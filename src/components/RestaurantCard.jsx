import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HypeGauge from "./HypeGauge";
import VerdictBadge from "./VerdictBadge";
import { T } from "../tokens";

export default function RestaurantCard({ restaurant, index }) {
  const { id, name, neighborhood, cuisine, hypeScore, realityScore, reviews } = restaurant;
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onClick={() => navigate(`/restaurant/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.bgCard : T.bgRaised,
        border: `1px solid ${hovered ? T.borderMid : T.border}`,
        borderRadius: 10,
        padding: "26px",
        cursor: "pointer",
        transition: "all 0.22s ease",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        position: "relative",
        overflow: "hidden",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Watermark index number */}
      <span style={{
        position: "absolute",
        top: 14,
        right: 18,
        fontFamily: T.fontDisplay,
        fontSize: 80,
        fontWeight: 700,
        color: hovered ? T.border : `${T.border}80`,
        lineHeight: 1,
        userSelect: "none",
        transition: "color 0.22s",
        pointerEvents: "none",
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Accent line — appears on hover */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, ${T.accent}, ${T.accentHi})`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.22s",
      }} />

      {/* Header */}
      <div style={{ paddingRight: 60 }}>
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 10,
        }}>
          <h2 style={{
            fontFamily: T.fontDisplay,
            fontSize: 26,
            fontWeight: 700,
            color: T.ink,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: 0,
          }}>
            {name}
          </h2>
          <VerdictBadge hypeScore={hypeScore} realityScore={realityScore} />
        </div>

        {/* Meta pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[neighborhood, cuisine].map((label, i) => (
            <span
              key={label}
              style={{
                fontFamily: T.fontBody,
                fontSize: 10,
                fontWeight: 600,
                color: T.inkLow,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                ...(i === 0 ? {} : {
                  paddingLeft: 8,
                  borderLeft: `1px solid ${T.border}`,
                }),
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Gauge */}
      <HypeGauge hypeScore={hypeScore} realityScore={realityScore} />

      {/* Footer */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 16,
        borderTop: `1px solid ${T.border}`,
        marginTop: -4,
      }}>
        <span style={{
          fontFamily: T.fontBody,
          fontSize: 11,
          color: T.inkLow,
          letterSpacing: "0.03em",
        }}>
          {reviews.toLocaleString()} community reviews
        </span>
        <span style={{
          fontFamily: T.fontBody,
          fontSize: 11,
          fontWeight: 600,
          color: hovered ? T.accent : T.inkMid,
          letterSpacing: "0.04em",
          transition: "color 0.2s",
        }}>
          Read more →
        </span>
      </div>
    </article>
  );
}