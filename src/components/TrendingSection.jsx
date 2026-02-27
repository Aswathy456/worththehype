import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { T } from "../tokens";
import { getRisingStars, getFallingStars } from "../services/hypeService";

// ── TrendCard is defined OUTSIDE TrendingSection ───────────────────────────
// This is critical: defining it inside would cause React to treat it as a
// new component type every render, remounting cards and killing animations.
function TrendCard({ restaurant, type }) {
  const isRising   = type === "rising";
  const trendColor = isRising ? T.worthy : T.hype;
  const trendBg    = isRising ? "#4ade8012" : "#f8717112";

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          padding: "14px 16px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = T.borderMid;
          e.currentTarget.style.transform   = "translateY(-2px)";
          e.currentTarget.style.boxShadow   = "0 8px 28px rgba(0,0,0,0.45)";
          e.currentTarget.style.background  = T.bgHover;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.transform   = "translateY(0)";
          e.currentTarget.style.boxShadow   = "none";
          e.currentTarget.style.background  = T.bgCard;
        }}
      >
        {/* Top row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
            <h4 style={{
              fontFamily: T.fontDisplay,
              fontSize: 15,
              fontWeight: 600,
              color: T.ink,
              margin: "0 0 3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {restaurant.name}
            </h4>
            <p style={{
              fontFamily: T.fontBody,
              fontSize: 11,
              color: T.inkLow,
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {restaurant.neighborhood} · {restaurant.cuisine}
            </p>
          </div>

          {/* Momentum badge */}
          <div style={{
            background: trendBg,
            color: trendColor,
            fontFamily: T.fontMono,
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 9px",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexShrink: 0,
            border: `1px solid ${trendColor}20`,
          }}>
            {isRising ? "↗" : "↘"} {Math.abs(restaurant.momentum).toFixed(0)}%
          </div>
        </div>

        {/* Score bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: T.fontDisplay,
            fontSize: 22,
            fontWeight: 700,
            color: T.accent,
            lineHeight: 1,
            minWidth: 32,
          }}>
            {restaurant.realityScore.toFixed(1)}
          </span>
          <div style={{
            flex: 1,
            height: 3,
            background: T.bg,
            borderRadius: 2,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${(restaurant.realityScore / 10) * 100}%`,
              background: `linear-gradient(90deg, ${trendColor}40, ${trendColor})`,
              borderRadius: 2,
              transition: "width 0.6s ease",
            }} />
          </div>
          <span style={{
            fontFamily: T.fontBody,
            fontSize: 11,
            color: T.inkLow,
            whiteSpace: "nowrap",
          }}>
            {restaurant.reviews.toLocaleString()} reviews
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Section header sub-component ──────────────────────────────────────────
function SectionHead({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 17, lineHeight: 1 }}>{icon}</span>
        <h3 style={{
          fontFamily: T.fontDisplay,
          fontSize: 18,
          fontWeight: 700,
          color: T.ink,
          margin: 0,
          letterSpacing: "-0.01em",
        }}>
          {title}
        </h3>
      </div>
      <p style={{
        fontFamily: T.fontBody,
        fontSize: 11,
        color: T.inkLow,
        margin: 0,
        marginLeft: 27,
      }}>
        {subtitle}
      </p>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
export default function TrendingSection({ restaurants }) {
  const [risingStars, setRisingStars] = useState([]);
  const [fallingStars, setFallingStars] = useState([]);

  useEffect(() => {
    if (restaurants?.length > 0) {
      setRisingStars(getRisingStars(restaurants, 3));
      setFallingStars(getFallingStars(restaurants, 3));
    }
  }, [restaurants]);

  if (risingStars.length === 0 && fallingStars.length === 0) return null;

  return (
    <div style={{
      display: "grid",
      // Collapses to 1 column on narrow viewports automatically
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 20,
      marginBottom: 36,
    }}>
      {risingStars.length > 0 && (
        <div style={{
          background: T.bgRaised,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: "22px",
        }}>
          <SectionHead
            icon="🚀"
            title="Rising Stars"
            subtitle="Gaining momentum this month"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {risingStars.map(r => (
              <TrendCard key={r.id} restaurant={r} type="rising" />
            ))}
          </div>
        </div>
      )}

      {fallingStars.length > 0 && (
        <div style={{
          background: T.bgRaised,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: "22px",
        }}>
          <SectionHead
            icon="📉"
            title="Losing Momentum"
            subtitle="Cooling down lately"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {fallingStars.map(r => (
              <TrendCard key={r.id} restaurant={r} type="falling" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}