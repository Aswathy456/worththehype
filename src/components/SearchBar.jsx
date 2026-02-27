import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { T } from "../tokens";

const SearchIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ pointerEvents: "none" }}>
    <circle cx="6.5" cy="6.5" r="4.5" stroke={color} strokeWidth="1.6" />
    <path d="M13 13L10 10" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2.5 6.5h8M7 2.5l4 4-4 4" stroke={T.inkLow} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function SearchBar({ restaurants, onFilter }) {
  const [searchTerm, setSearchTerm]         = useState("");
  const [isOpen, setIsOpen]                 = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [activeFilter, setActiveFilter]     = useState("all");
  const [isFocused, setIsFocused]           = useState(false);
  const [hoveredId, setHoveredId]           = useState(null);

  const searchRef = useRef(null);
  const inputRef  = useRef(null);

  // Stable callback ref — prevents infinite loop when parent passes inline fn
  const onFilterRef = useRef(onFilter);
  useEffect(() => { onFilterRef.current = onFilter; });

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced filter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchTerm.trim()) {
        setFilteredResults([]);
        setIsOpen(false);
        onFilterRef.current?.(restaurants);
        return;
      }

      const term = searchTerm.toLowerCase();
      const results = restaurants.filter(r => {
        const byName         = r.name.toLowerCase().includes(term);
        const byCuisine      = r.cuisine.toLowerCase().includes(term);
        const byNeighborhood = r.neighborhood.toLowerCase().includes(term);
        if (activeFilter === "cuisine")      return byCuisine;
        if (activeFilter === "neighborhood") return byNeighborhood;
        return byName || byCuisine || byNeighborhood;
      });

      setFilteredResults(results);
      setIsOpen(results.length > 0 || searchTerm.length > 0);
      onFilterRef.current?.(results);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchTerm, restaurants, activeFilter]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    setFilteredResults([]);
    setIsOpen(false);
    onFilterRef.current?.(restaurants);
    inputRef.current?.focus();
  }, [restaurants]);

  const filters = [
    { key: "all",          label: "All"     },
    { key: "cuisine",      label: "Cuisine" },
    { key: "neighborhood", label: "Area"    },
  ];

  const borderColor = isFocused ? T.accent : T.border;
  const shadowStyle = isFocused
    ? `0 0 0 3px ${T.accentDim}, 0 4px 20px rgba(0,0,0,0.5)`
    : "0 2px 10px rgba(0,0,0,0.35)";

  return (
    <div ref={searchRef} style={{ position: "relative", width: "100%" }}>

      {/* ── Input row ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

        {/* Search input */}
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
          <span style={{ position: "absolute", left: 15, display: "flex", alignItems: "center" }}>
            <SearchIcon color={isFocused ? T.accent : T.inkLow} />
          </span>

          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (searchTerm) setIsOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Search restaurants, cuisines, neighborhoods…"
            style={{
              width: "100%",
              padding: "13px 44px",
              fontSize: 14,
              fontFamily: T.fontBody,
              fontWeight: 400,
              color: T.ink,
              background: T.bgCard,
              border: `1.5px solid ${borderColor}`,
              borderRadius: 10,
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxShadow: shadowStyle,
              letterSpacing: "0.01em",
            }}
          />

          {/* Clear button */}
          {searchTerm && (
            <button
              onClick={handleClear}
              style={{
                position: "absolute",
                right: 12,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: T.border,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: T.inkMid,
                fontSize: 10,
                fontWeight: 700,
                transition: "all 0.15s",
                lineHeight: 1,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = T.accent;
                e.currentTarget.style.color = "#0c0905";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = T.border;
                e.currentTarget.style.color = T.inkMid;
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div style={{
          display: "flex",
          gap: 4,
          background: T.bgCard,
          border: `1.5px solid ${T.border}`,
          borderRadius: 10,
          padding: "4px",
          flexShrink: 0,
          boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
        }}>
          {filters.map(({ key, label }) => {
            const active = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: active ? 700 : 500,
                  fontFamily: T.fontBody,
                  letterSpacing: "0.04em",
                  background: active ? T.accent : "transparent",
                  color: active ? "#0c0905" : T.inkMid,
                  border: "none",
                  borderRadius: 7,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = T.bgHover;
                    e.currentTarget.style.color = T.ink;
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = T.inkMid;
                  }
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dropdown ── */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          right: 0,
          maxHeight: 460,
          overflowY: "auto",
          background: T.bgCard,
          border: `1.5px solid ${T.borderMid}`,
          borderRadius: 12,
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
          zIndex: 100,
        }}>

          {/* Results */}
          {filteredResults.length > 0 ? (
            <>
              {/* Header */}
              <div style={{
                padding: "10px 16px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                background: T.bgCard,
                zIndex: 1,
              }}>
                <span style={{
                  fontFamily: T.fontBody,
                  fontSize: 9,
                  fontWeight: 700,
                  color: T.inkLow,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}>
                  {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"}
                </span>
                <span style={{
                  fontFamily: T.fontBody,
                  fontSize: 11,
                  color: T.inkLow,
                  fontStyle: "italic",
                }}>
                  "{searchTerm}"
                </span>
              </div>

              {/* Result rows */}
              {filteredResults.map((r, i) => {
                const delta = r.realityScore - r.hypeScore;
                const isUnder = delta > 2;
                const isOver  = delta < -2;
                const isHov   = hoveredId === r.id;

                return (
                  <Link
                    key={r.id}
                    to={`/restaurant/${r.id}`}
                    onClick={() => setIsOpen(false)}
                    onMouseEnter={() => setHoveredId(r.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "13px 16px",
                      borderBottom: i < filteredResults.length - 1 ? `1px solid ${T.border}` : "none",
                      textDecoration: "none",
                      background: isHov ? T.bgHover : "transparent",
                      transition: "background 0.12s",
                      cursor: "pointer",
                    }}
                  >
                    {/* Score circle */}
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: T.bg,
                      border: `1.5px solid ${isHov ? T.accent : T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "border-color 0.15s",
                    }}>
                      <span style={{
                        fontFamily: T.fontDisplay,
                        fontSize: 14,
                        fontWeight: 700,
                        color: T.accent,
                      }}>
                        {r.realityScore.toFixed(1)}
                      </span>
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 3,
                      }}>
                        <span style={{
                          fontFamily: T.fontDisplay,
                          fontSize: 15,
                          fontWeight: 600,
                          color: T.ink,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {r.name}
                        </span>
                        {(isUnder || isOver) && (
                          <span style={{
                            flexShrink: 0,
                            fontFamily: T.fontBody,
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            padding: "2px 7px",
                            borderRadius: 4,
                            background: isUnder ? "#4ade8015" : "#f8717115",
                            color:      isUnder ? "#4ade80"   : "#f87171",
                          }}>
                            {isUnder ? "Underrated" : "Overhyped"}
                          </span>
                        )}
                      </div>
                      <span style={{
                        fontFamily: T.fontBody,
                        fontSize: 11,
                        color: T.inkMid,
                      }}>
                        {r.cuisine} · {r.neighborhood}
                      </span>
                    </div>

                    <ArrowIcon />
                  </Link>
                );
              })}
            </>
          ) : (
            /* ── No results ── */
            <div style={{
              padding: "40px 24px",
              textAlign: "center",
            }}>
              <span style={{ fontSize: 30, display: "block", marginBottom: 12 }}>🍽️</span>
              <p style={{
                fontFamily: T.fontDisplay,
                fontSize: 16,
                color: T.inkMid,
                marginBottom: 6,
              }}>
                Nothing found for "{searchTerm}"
              </p>
              <p style={{
                fontFamily: T.fontBody,
                fontSize: 12,
                color: T.inkLow,
              }}>
                Try a different cuisine, name, or neighborhood
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}