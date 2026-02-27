import { useState, useEffect } from "react";
import { T } from "../tokens";
import { calculateHypeOfTheMonth } from "../services/hypeService";
import { Link } from "react-router-dom";

export default function HypeOfTheMonth({ restaurants, city }) {
  const [hypeData, setHypeData] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      const data = calculateHypeOfTheMonth(restaurants);
      setHypeData(data);
    }
  }, [restaurants]);

  if (!hypeData) return null;

  const { restaurant, trendData, hypeScore, momentum } = hypeData;

  // Graph dimensions
  const graphWidth = 480;
  const graphHeight = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = graphWidth - padding.left - padding.right;
  const chartHeight = graphHeight - padding.top - padding.bottom;

  // Scale functions
  const maxValue = Math.max(...trendData.map(d => d.value));
  const minValue = Math.min(...trendData.map(d => d.value));
  const valueRange = maxValue - minValue || 1;

  const xScale = (index) => padding.left + (index / (trendData.length - 1)) * chartWidth;
  const yScale = (value) => padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Create path for line chart
  const linePath = trendData.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.value);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(" ");

  // Create area fill
  const areaPath = `${linePath} L ${xScale(trendData.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  // Determine trend direction
  const isRising = momentum > 0;
  const trendColor = isRising ? "#10b981" : "#ef4444";
  const trendIcon = isRising ? "↗" : "↘";

  return (
    <div style={{
      background: `linear-gradient(135deg, ${T.bgRaised} 0%, ${T.bg} 100%)`,
      border: `1px solid ${T.borderMid}`,
      borderRadius: 12,
      padding: "32px",
      marginBottom: 32,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background accent */}
      <div style={{
        position: "absolute",
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        background: `radial-gradient(circle, ${T.accent}15 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{
            background: T.accent,
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 6,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            🔥 Hype of the Month
          </span>
          <span style={{
            fontSize: 12,
            color: T.inkLow,
            letterSpacing: "0.05em",
          }}>
            {city} · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <h2 style={{
          fontFamily: T.fontDisplay,
          fontSize: 36,
          fontWeight: 700,
          color: T.ink,
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}>
          {restaurant.name}
        </h2>
        <p style={{ fontSize: 13, color: T.inkMid, marginTop: 6 }}>
          {restaurant.neighborhood} · {restaurant.cuisine}
        </p>
      </div>

      {/* Content Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 32,
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Left: Stats and Description */}
        <div>
          {/* Score Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: `${trendColor}15`,
            border: `1px solid ${trendColor}40`,
            borderRadius: 8,
            padding: "8px 16px",
            marginBottom: 16,
          }}>
            <span style={{
              fontFamily: T.fontDisplay,
              fontSize: 28,
              fontWeight: 700,
              color: trendColor,
            }}>
              {hypeScore.toFixed(1)}
            </span>
            <div style={{ fontSize: 11, color: T.inkMid, lineHeight: 1.3 }}>
              <div style={{ fontWeight: 600, letterSpacing: "0.05em" }}>HYPE SCORE</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <span style={{ color: trendColor, fontSize: 14 }}>{trendIcon}</span>
                <span>{Math.abs(momentum).toFixed(1)}% this week</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div style={{
            display: "flex",
            gap: 24,
            marginBottom: 16,
          }}>
            <div>
              <div style={{
                fontFamily: T.fontDisplay,
                fontSize: 22,
                fontWeight: 700,
                color: T.ink,
              }}>
                {restaurant.reviews}
              </div>
              <div style={{
                fontSize: 10,
                color: T.inkLow,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: 2,
              }}>
                Reviews
              </div>
            </div>
            <div>
              <div style={{
                fontFamily: T.fontDisplay,
                fontSize: 22,
                fontWeight: 700,
                color: T.ink,
              }}>
                {restaurant.realityScore.toFixed(1)}
              </div>
              <div style={{
                fontSize: 10,
                color: T.inkLow,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: 2,
              }}>
                Reality Score
              </div>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: T.inkMid,
            marginBottom: 16,
          }}>
            {restaurant.description || "This restaurant is making waves in the community with consistent quality and growing popularity."}
          </p>

          {/* CTA */}
          <Link
            to={`/restaurant/${restaurant.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: T.accent,
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 8,
              textDecoration: "none",
              transition: "all 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            View Full Details
            <span style={{ fontSize: 16 }}>→</span>
          </Link>
        </div>

        {/* Right: Trend Graph */}
        <div style={{
          background: "white",
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.inkLow,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}>
              Popularity Trend
            </h3>
            <p style={{ fontSize: 11, color: T.inkLow }}>
              Last 8 weeks
            </p>
          </div>

          <svg
            width={graphWidth}
            height={graphHeight}
            style={{ display: "block" }}
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + chartHeight * (1 - ratio);
              return (
                <line
                  key={ratio}
                  x1={padding.left}
                  y1={y}
                  x2={graphWidth - padding.right}
                  y2={y}
                  stroke={T.border}
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
              );
            })}

            {/* Area fill */}
            <path
              d={areaPath}
              fill={`${trendColor}15`}
              stroke="none"
            />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke={trendColor}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {trendData.map((d, i) => {
              const cx = xScale(i);
              const cy = yScale(d.value);
              const isHovered = hoveredPoint === i;

              return (
                <g key={i}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : 4}
                    fill={trendColor}
                    stroke="white"
                    strokeWidth={2}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {isHovered && (
                    <g>
                      {/* Tooltip background */}
                      <rect
                        x={cx - 35}
                        y={cy - 45}
                        width={70}
                        height={32}
                        rx={6}
                        fill={T.ink}
                        opacity={0.95}
                      />
                      {/* Tooltip text */}
                      <text
                        x={cx}
                        y={cy - 30}
                        textAnchor="middle"
                        fontSize={10}
                        fill="white"
                        fontWeight={600}
                      >
                        {d.label}
                      </text>
                      <text
                        x={cx}
                        y={cy - 18}
                        textAnchor="middle"
                        fontSize={13}
                        fill="white"
                        fontWeight={700}
                      >
                        {d.value.toFixed(1)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* X-axis labels */}
            {trendData.map((d, i) => {
              if (i % 2 !== 0) return null; // Show every other label
              const x = xScale(i);
              return (
                <text
                  key={i}
                  x={x}
                  y={graphHeight - 8}
                  textAnchor="middle"
                  fontSize={9}
                  fill={T.inkLow}
                >
                  {d.label}
                </text>
              );
            })}

            {/* Y-axis labels */}
            {[minValue, (minValue + maxValue) / 2, maxValue].map((value, i) => {
              const y = yScale(value);
              return (
                <text
                  key={i}
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={10}
                  fill={T.inkLow}
                >
                  {value.toFixed(0)}
                </text>
              );
            })}
          </svg>

          {/* Graph legend */}
          <div style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: T.inkLow,
          }}>
            <span>Peak: {maxValue.toFixed(1)}</span>
            <span>Current: {trendData[trendData.length - 1].value.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}