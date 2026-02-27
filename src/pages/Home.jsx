import { useState, useEffect } from "react";
import RestaurantCard from "../components/RestaurantCard";
import { fetchKochiRestaurants } from "../services/restaurantService";
import { T } from "../tokens";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("Most Reviewed");

  useEffect(() => {
    fetchKochiRestaurants()
      .then(data => { setRestaurants(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const sorted = [...restaurants].sort((a, b) => {
    if (sort === "Most Reviewed") return b.reviews - a.reviews;
    if (sort === "Biggest Gap") return Math.abs(b.realityScore - b.hypeScore) - Math.abs(a.realityScore - a.hypeScore);
    if (sort === "Newest") return b.id - a.id;
    return 0;
  });

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>

      {/* Hero masthead */}
      <header style={{
        borderBottom: `1px solid ${T.border}`,
        padding: "52px 32px 40px",
        maxWidth: 1200, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.16em",
              textTransform: "uppercase", color: T.accent, marginBottom: 12,
            }}>
              Kochi · Community Edition
            </p>
            <h1 style={{
              fontFamily: T.fontDisplay,
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 700, color: T.ink,
              lineHeight: 1.1, letterSpacing: "-0.02em",
              maxWidth: 560,
            }}>
              The restaurants<br />
              <em style={{ fontStyle: "italic", color: T.inkMid }}>worth your time.</em>
            </h1>
          </div>

          <div style={{ display: "flex", gap: 40, flexShrink: 0, paddingBottom: 4 }}>
            {[
              { n: loading ? "…" : `${restaurants.length}+`, label: "Restaurants" },
              { n: "2,847", label: "Reviews" },
              { n: "128", label: "Hype Busts" },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <p style={{ fontFamily: T.fontDisplay, fontSize: 32, fontWeight: 700, color: T.ink, lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: 11, color: T.inkLow, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Sort bar */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <p style={{ fontSize: 12, color: T.inkLow, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {loading ? "Loading restaurants…" : `${sorted.length} restaurants found`}
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          {["Most Reviewed", "Biggest Gap", "Newest"].map((s) => (
            <button key={s} onClick={() => setSort(s)} style={{
              padding: "6px 14px",
              background: sort === s ? T.bgRaised : "none",
              border: `1px solid ${sort === s ? T.borderMid : "transparent"}`,
              borderRadius: 5, fontSize: 12, fontWeight: 500,
              color: sort === s ? T.ink : T.inkLow,
              letterSpacing: "0.03em", transition: "all 0.15s",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", padding: "80px 32px" }}>
          <p style={{ fontFamily: T.fontDisplay, fontSize: 28, color: T.inkMid, fontStyle: "italic" }}>
            Fetching Kochi restaurants…
          </p>
          <p style={{ fontSize: 13, color: T.inkLow, marginTop: 8 }}>Querying OpenStreetMap</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{ textAlign: "center", padding: "80px 32px" }}>
          <p style={{ fontSize: 14, color: T.accent }}>Could not load restaurants: {error}</p>
          <p style={{ fontSize: 13, color: T.inkLow, marginTop: 8 }}>Check your connection and try refreshing.</p>
        </div>
      )}

      {/* Card grid */}
      {!loading && !error && (
        <main style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "32px 32px 64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 20,
        }}>
          {sorted.map((place, i) => (
            <RestaurantCard key={place.id} restaurant={place} index={i} />
          ))}
        </main>
      )}
    </div>
  );
}