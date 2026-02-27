import { useState, useEffect, useRef } from "react";
import { T } from "../tokens";
import { Link } from "react-router-dom";

export default function SearchBar({ restaurants, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all"); // all, cuisine, neighborhood
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter restaurants based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      setIsOpen(false);
      if (onFilter) onFilter(restaurants); // Reset filter
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = restaurants.filter(r => {
      const matchesName = r.name.toLowerCase().includes(term);
      const matchesCuisine = r.cuisine.toLowerCase().includes(term);
      const matchesNeighborhood = r.neighborhood.toLowerCase().includes(term);

      if (activeFilter === "cuisine") return matchesCuisine;
      if (activeFilter === "neighborhood") return matchesNeighborhood;
      return matchesName || matchesCuisine || matchesNeighborhood;
    });

    setFilteredResults(results);
    setIsOpen(results.length > 0);
    if (onFilter) onFilter(results);
  }, [searchTerm, restaurants, activeFilter, onFilter]);

  const handleClear = () => {
    setSearchTerm("");
    setFilteredResults([]);
    setIsOpen(false);
    if (onFilter) onFilter(restaurants);
  };

  // Get unique cuisines and neighborhoods for quick filters
  const cuisines = [...new Set(restaurants.map(r => r.cuisine))].slice(0, 5);
  const neighborhoods = [...new Set(restaurants.map(r => r.neighborhood))].slice(0, 5);

  return (
    <div ref={searchRef} style={{ position: "relative", width: "100%" }}>
      {/* Search Input Container */}
      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        {/* Search Icon & Input */}
        <div style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}>
          <span style={{
            position: "absolute",
            left: 14,
            fontSize: 16,
            color: T.inkLow,
            pointerEvents: "none",
          }}>
            🔍
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setIsOpen(true)}
            placeholder="Search restaurants, cuisines, or neighborhoods..."
            style={{
              width: "100%",
              padding: "12px 40px 12px 40px",
              fontSize: 14,
              border: `1px solid ${searchTerm ? T.accent : T.border}`,
              borderRadius: 10,
              outline: "none",
              transition: "all 0.2s",
              background: "white",
              color: T.ink,
            }}
            onFocusCapture={(e) => {
              e.target.style.borderColor = T.accent;
              e.target.style.boxShadow = `0 0 0 3px ${T.accent}20`;
            }}
            onBlurCapture={(e) => {
              if (!searchTerm) {
                e.target.style.borderColor = T.border;
                e.target.style.boxShadow = "none";
              }
            }}
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              style={{
                position: "absolute",
                right: 10,
                background: T.bgRaised,
                border: "none",
                borderRadius: 6,
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 14,
                color: T.inkLow,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = T.accent;
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = T.bgRaised;
                e.target.style.color = T.inkLow;
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { key: "all", label: "All", icon: "🏠" },
            { key: "cuisine", label: "Cuisine", icon: "🍽️" },
            { key: "neighborhood", label: "Area", icon: "📍" },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              style={{
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 600,
                border: `1px solid ${activeFilter === key ? T.accent : T.border}`,
                borderRadius: 8,
                background: activeFilter === key ? `${T.accent}15` : "white",
                color: activeFilter === key ? T.accent : T.inkMid,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== key) {
                  e.target.style.borderColor = T.borderMid;
                  e.target.style.background = T.bgRaised;
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== key) {
                  e.target.style.borderColor = T.border;
                  e.target.style.background = "white";
                }
              }}
            >
              <span>{icon}</span>
              <span style={{ letterSpacing: "0.02em" }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredResults.length > 0 && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          right: 0,
          maxHeight: 480,
          overflowY: "auto",
          background: "white",
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 100,
        }}>
          {/* Results Header */}
          <div style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${T.border}`,
            background: T.bgRaised,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}>
            <p style={{
              fontSize: 11,
              fontWeight: 600,
              color: T.inkLow,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              {filteredResults.length} {filteredResults.length === 1 ? "Result" : "Results"} for "{searchTerm}"
            </p>
          </div>

          {/* Results List */}
          <div>
            {filteredResults.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                onClick={() => {
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  padding: "14px 16px",
                  borderBottom: `1px solid ${T.border}`,
                  textDecoration: "none",
                  transition: "all 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.bgRaised;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}>
                    <h4 style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: T.ink,
                      margin: 0,
                    }}>
                      {restaurant.name}
                    </h4>
                    {/* Hype Badge */}
                    {Math.abs(restaurant.hypeScore - restaurant.realityScore) > 2 && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: restaurant.realityScore > restaurant.hypeScore 
                          ? "#10b98120" 
                          : "#ef444420",
                        color: restaurant.realityScore > restaurant.hypeScore 
                          ? "#10b981" 
                          : "#ef4444",
                        letterSpacing: "0.04em",
                      }}>
                        {restaurant.realityScore > restaurant.hypeScore ? "UNDERRATED" : "OVERHYPED"}
                      </span>
                    )}
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    color: T.inkMid,
                  }}>
                    <span>{restaurant.cuisine}</span>
                    <span style={{ color: T.inkLow }}>•</span>
                    <span>{restaurant.neighborhood}</span>
                    <span style={{ color: T.inkLow }}>•</span>
                    <span style={{ color: T.accent, fontWeight: 600 }}>
                      ★ {restaurant.realityScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  color: T.inkLow,
                  fontSize: 14,
                }}>
                  →
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Filter Suggestions (shown when no search term) */}
          {!searchTerm && (cuisines.length > 0 || neighborhoods.length > 0) && (
            <div style={{
              padding: "16px",
              background: T.bgRaised,
              borderTop: `1px solid ${T.border}`,
            }}>
              {cuisines.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: T.inkLow,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}>
                    Popular Cuisines
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {cuisines.map(cuisine => (
                      <button
                        key={cuisine}
                        onClick={() => {
                          setSearchTerm(cuisine);
                          setActiveFilter("cuisine");
                        }}
                        style={{
                          padding: "4px 10px",
                          fontSize: 11,
                          background: "white",
                          border: `1px solid ${T.border}`,
                          borderRadius: 6,
                          color: T.inkMid,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = T.accent;
                          e.target.style.color = T.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = T.border;
                          e.target.style.color = T.inkMid;
                        }}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {isOpen && searchTerm && filteredResults.length === 0 && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          right: 0,
          background: "white",
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: "32px 24px",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 100,
        }}>
          <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>🔍</span>
          <p style={{
            fontSize: 14,
            color: T.inkMid,
            marginBottom: 6,
          }}>
            No restaurants found for "{searchTerm}"
          </p>
          <p style={{
            fontSize: 12,
            color: T.inkLow,
          }}>
            Try searching for a different cuisine or neighborhood
          </p>
        </div>
      )}
    </div>
  );
}