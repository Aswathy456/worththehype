import { restaurants } from "../data/restaurants";
import RestaurantCard from "../components/RestaurantCard";
import { T } from "../tokens";

export default function Home() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>

      {/* Hero masthead */}
      <header style={{
        borderBottom: `1px solid ${T.border}`,
        padding: "52px 32px 40px",
        maxWidth: 1200, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32 }}>
          <div>
            <p style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.16em",
              textTransform: "uppercase", color: T.accent,
              marginBottom: 12,
            }}>
              Kochi · Community Edition
            </p>
            <h1 style={{
              fontFamily: T.fontDisplay,
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 700,
              color: T.ink,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 560,
            }}>
              The restaurants<br />
              <em style={{ fontStyle: "italic", color: T.inkMid }}>worth your time.</em>
            </h1>
          </div>

          {/* Stats column */}
          <div style={{
            display: "flex", gap: 40, flexShrink: 0,
            paddingBottom: 4,
          }}>
            {[
              { n: "340+", label: "Restaurants" },
              { n: "2,847", label: "Reviews" },
              { n: "128", label: "Hype Busts" },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <p style={{
                  fontFamily: T.fontDisplay, fontSize: 32, fontWeight: 700,
                  color: T.ink, lineHeight: 1,
                }}>{n}</p>
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
          Showing {restaurants.length} restaurants
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          {["Most Reviewed", "Biggest Gap", "Newest"].map((s, i) => (
            <button key={s} style={{
              padding: "6px 14px", background: i === 0 ? T.bgRaised : "none",
              border: `1px solid ${i === 0 ? T.borderMid : "transparent"}`,
              borderRadius: 5, fontSize: 12, fontWeight: 500,
              color: i === 0 ? T.ink : T.inkLow,
              letterSpacing: "0.03em",
              transition: "all 0.15s",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <main style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "32px 32px 64px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: 20,
      }}>
        {restaurants.map((place, i) => (
          <RestaurantCard key={place.id} restaurant={place} index={i} />
        ))}
      </main>
    </div>
  );
}