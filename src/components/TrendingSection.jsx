import { useState, useEffect } from "react";
import { T } from "../tokens";
import { getRisingStars, getFallingStars } from "../services/hypeService";
import { Link } from "react-router-dom";

export default function TrendingSection({ restaurants }) {
  const [risingStars, setRisingStars] = useState([]);
  const [fallingStars, setFallingStars] = useState([]);

  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      const rising = getRisingStars(restaurants, 3);
      const falling = getFallingStars(restaurants, 3);
      setRisingStars(rising);
      setFallingStars(falling);
    }
  }, [restaurants]);

  if (risingStars.length === 0 && fallingStars.length === 0) {
    return null;
  }

  const TrendCard = ({ restaurant, type }) => {
    const isRising = type === "rising";
    const trendColor = isRising ? "#10b981" : "#ef4444";
    const trendIcon = isRising ? "↗" : "↘";
    const trendLabel = isRising ? "Rising" : "Falling";

    return (
      <Link
        to={`/restaurant/${restaurant.id}`}
        style={{
          display: "block",
          background: "white",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "12px",
          textDecoration: "none",
          transition: "all 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = T.borderMid;
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{
              fontSize: 14,
              fontWeight: 600,
              color: T.ink,
              marginBottom: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {restaurant.name}
            </h4>
            <p style={{
              fontSize: 11,
              color: T.inkLow,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {restaurant.neighborhood}
            </p>
          </div>
          <div style={{
            background: `${trendColor}15`,
            color: trendColor,
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 8px",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 4,
            whiteSpace: "nowrap",
            marginLeft: 8,
          }}>
            <span style={{ fontSize: 14 }}>{trendIcon}</span>
            {Math.abs(restaurant.momentum).toFixed(0)}%
          </div>
        </div>
        <div style={{
          display: "flex",
          gap: 12,
          fontSize: 11,
          color: T.inkMid,
        }}>
          <span>★ {restaurant.realityScore.toFixed(1)}</span>
          <span>•</span>
          <span>{restaurant.reviews} reviews</span>
        </div>
      </Link>
    );
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20,
      marginBottom: 32,
    }}>
      {/* Rising Stars */}
      {risingStars.length > 0 && (
        <div style={{
          background: T.bgRaised,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          padding: "20px",
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>🚀</span>
              <h3 style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.ink,
                letterSpacing: "0.02em",
              }}>
                Rising Stars
              </h3>
            </div>
            <p style={{
              fontSize: 11,
              color: T.inkLow,
              lineHeight: 1.4,
            }}>
              Gaining momentum this month
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {risingStars.map(restaurant => (
              <TrendCard key={restaurant.id} restaurant={restaurant} type="rising" />
            ))}
          </div>
        </div>
      )}

      {/* Falling Stars */}
      {fallingStars.length > 0 && (
        <div style={{
          background: T.bgRaised,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          padding: "20px",
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>📉</span>
              <h3 style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.ink,
                letterSpacing: "0.02em",
              }}>
                Losing Momentum
              </h3>
            </div>
            <p style={{
              fontSize: 11,
              color: T.inkLow,
              lineHeight: 1.4,
            }}>
              Cooling down lately
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {fallingStars.map(restaurant => (
              <TrendCard key={restaurant.id} restaurant={restaurant} type="falling" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}