import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HypeGauge from "./HypeGauge";
import VerdictBadge from "./VerdictBadge";
import { T } from "../tokens";

export default function RestaurantCard({ restaurant, index }) {
  const { id, name, city, neighborhood, cuisine, hypeScore, realityScore, reviews } = restaurant;
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        .rcard-${id}:hover { border-color: ${T.borderMid} !important; }
      `}</style>
      <article
        className={`rcard-${id}`}
        onClick={() => navigate(`/restaurant/${id}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? T.bgRaised : T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "24px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Issue number watermark */}
        <span style={{
          position: "absolute", top: 16, right: 20,
          fontFamily: T.fontDisplay,
          fontSize: 72, fontWeight: 700,
          color: T.border,
          lineHeight: 1, userSelect: "none",
          transition: "color 0.2s",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Header */}
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
            <h2 style={{
              fontFamily: T.fontDisplay,
              fontSize: 24, fontWeight: 700,
              color: T.ink, lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}>
              {name}
            </h2>
            <VerdictBadge hypeScore={hypeScore} realityScore={realityScore} />
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{
              fontSize: 11, color: T.inkLow,
              letterSpacing: "0.06em", textTransform: "uppercase",
              fontWeight: 500,
            }}>
              {neighborhood}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: T.inkLow, flexShrink: 0 }} />
            <span style={{
              fontSize: 11, color: T.inkLow,
              letterSpacing: "0.06em", textTransform: "uppercase",
              fontWeight: 500,
            }}>
              {cuisine}
            </span>
          </div>
        </div>

        {/* Gauge */}
        <HypeGauge hypeScore={hypeScore} realityScore={realityScore} />

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 16, borderTop: `1px solid ${T.border}`,
        }}>
          <span style={{ fontSize: 12, color: T.inkLow }}>
            {reviews.toLocaleString()} community reviews
          </span>
          <span style={{
            fontSize: 12, fontWeight: 600, color: T.inkMid,
            letterSpacing: "0.04em",
          }}>
            Read more →
          </span>
        </div>
      </article>
    </>
  );
}