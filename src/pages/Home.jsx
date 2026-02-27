import { useState, useEffect, useRef } from "react";
import RestaurantCard from "../components/RestaurantCard";
import NavBar from "../components/NavBar";
import HypeOfTheMonth from "../components/HypeOfTheMonth";
import TrendingSection from "../components/TrendingSection";
import SearchBar from "../components/SearchBar";
import { fetchRestaurantsByCity } from "../services/restaurantService";
import { useRestaurants } from "../context/RestaurantContext";
import { seedDummyReviews } from "../seedReviews";
import { T } from "../tokens";

export default function Home() {
  const [activeCity, setActiveCity] = useState("Kochi");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("Most Reviewed");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { setCity } = useRestaurants();
  const seededRef = useRef(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setRestaurants([]);
    setFilteredRestaurants([]);

    fetchRestaurantsByCity(activeCity)
      .then(async data => {
        setRestaurants(data);
        setFilteredRestaurants(data);
        setCity(activeCity, data);
        setLoading(false);

        // Seed once — uses real restaurant IDs from what just loaded
        if (activeCity === "Kochi" && !seededRef.current) {
          seededRef.current = true;
          seedDummyReviews(data).catch(e => console.warn("Seed error:", e.message));
        }
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [activeCity]);

  const handleFilterChange = (filtered) => {
    setFilteredRestaurants(filtered);
    setIsSearchActive(filtered.length !== restaurants.length);
  };

  const sorted = [...filteredRestaurants].sort((a, b) => {
    if (sort === "Most Reviewed") return b.reviews - a.reviews;
    if (sort === "Biggest Gap")   return Math.abs(b.realityScore - b.hypeScore) - Math.abs(a.realityScore - a.hypeScore);
    if (sort === "Newest")        return b.id - a.id;
    return 0;
  });

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <NavBar activeCity={activeCity} onCityChange={setActiveCity} />

      <header style={{ borderBottom: `1px solid ${T.border}`, padding: "52px 32px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.accent, marginBottom: 12 }}>
              {activeCity} · Community Edition
            </p>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 700, color: T.ink, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 560 }}>
              The restaurants<br />
              <em style={{ fontStyle: "italic", color: T.inkMid }}>worth your time.</em>
            </h1>
          </div>
          <div style={{ display: "flex", gap: 40, flexShrink: 0, paddingBottom: 4 }}>
            {[
              { n: loading ? "…" : `${restaurants.length}+`, label: "Restaurants" },
              { n: "2,847", label: "Reviews" },
              { n: "128",   label: "Hype Busts" },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <p style={{ fontFamily: T.fontDisplay, fontSize: 32, fontWeight: 700, color: T.ink, lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: 11, color: T.inkLow, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        {!loading && !error && (
          <div style={{ marginTop: 32 }}>
            <SearchBar 
              restaurants={restaurants} 
              onFilter={handleFilterChange}
            />
          </div>
        )}
      </header>

      {/* Featured Hype & Trending Section - Hidden when search is active */}
      {!loading && !error && restaurants.length > 0 && !isSearchActive && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 0" }}>
          <HypeOfTheMonth restaurants={restaurants} city={activeCity} />
          <TrendingSection restaurants={restaurants} />
        </div>
      )}

      {/* Search Active Banner */}
      {isSearchActive && (
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "24px 32px 0",
        }}>
          <div style={{
            background: `${T.accent}15`,
            border: `1px solid ${T.accent}40`,
            borderRadius: 10,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <p style={{
                fontSize: 13,
                fontWeight: 600,
                color: T.accent,
                marginBottom: 4,
              }}>
                🔍 Search Results
              </p>
              <p style={{
                fontSize: 12,
                color: T.inkMid,
              }}>
                Showing {filteredRestaurants.length} of {restaurants.length} restaurants
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.border}` }}>
        <p style={{ fontSize: 12, color: T.inkLow, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {loading ? `Loading ${activeCity}…` : `${sorted.length} restaurant${sorted.length === 1 ? '' : 's'} in ${activeCity}`}
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          {["Most Reviewed", "Biggest Gap", "Newest"].map(s => (
            <button key={s} onClick={() => setSort(s)} style={{
              padding: "6px 14px", background: sort === s ? T.bgRaised : "none",
              border: `1px solid ${sort === s ? T.borderMid : "transparent"}`,
              borderRadius: 5, fontSize: 12, fontWeight: 500,
              color: sort === s ? T.ink : T.inkLow, letterSpacing: "0.03em", transition: "all 0.15s",
              cursor: "pointer",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "80px 32px" }}>
          <p style={{ fontFamily: T.fontDisplay, fontSize: 28, color: T.inkMid, fontStyle: "italic" }}>
            Fetching {activeCity} restaurants…
          </p>
          <p style={{ fontSize: 13, color: T.inkLow, marginTop: 8 }}>Querying OpenStreetMap</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "80px 32px" }}>
          <p style={{ fontSize: 14, color: T.accent }}>{error}</p>
          <p style={{ fontSize: 13, color: T.inkLow, marginTop: 8 }}>Try refreshing the page.</p>
        </div>
      )}

      {!loading && !error && sorted.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 32px" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>🍽️</span>
          <p style={{ fontFamily: T.fontDisplay, fontSize: 24, color: T.inkMid, marginBottom: 8 }}>
            No restaurants found
          </p>
          <p style={{ fontSize: 13, color: T.inkLow }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 64px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {sorted.map((place, i) => (
            <RestaurantCard key={place.id} restaurant={place} index={i} />
          ))}
        </main>
      )}
    </div>
  );
}