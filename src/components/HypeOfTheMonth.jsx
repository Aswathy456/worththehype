import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { T } from "../tokens";
import { calculateHypeOfTheMonth } from "../services/hypeService";

export default function HypeOfTheMonth({ restaurants, city }) {
  const [hypeData, setHypeData] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    if (restaurants?.length > 0) {
      setHypeData(calculateHypeOfTheMonth(restaurants));
    }
  }, [restaurants]);

  if (!hypeData) return null;

  const { restaurant, trendData, hypeScore, momentum } = hypeData;
  const isRising   = momentum > 0;
  const trendColor = isRising ? T.worthy : T.hype;

  // ── SVG graph dimensions ──────────────────────────────────────────────
  const gW  = 420;
  const gH  = 170;
  const pad = { top: 16, right: 16, bottom: 28, left: 36 };
  const cW  = gW - pad.left - pad.right;
  const cH  = gH - pad.top - pad.bottom;

  const vals    = trendData.map(d => d.value);
  const maxV    = Math.max(...vals);
  const minV    = Math.min(...vals);
  const vRange  = maxV - minV || 1;

  const xS = i => pad.left + (i / (trendData.length - 1)) * cW;
  const yS = v => pad.top + cH - ((v - minV) / vRange) * cH;

  const linePath = trendData
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xS(i).toFixed(1)} ${yS(d.value).toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${xS(trendData.length - 1).toFixed(1)} ${(pad.top + cH).toFixed(1)} L ${pad.left} ${(pad.top + cH).toFixed(1)} Z`;

  return (
    <div style={{
      background: T.bgRaised,
      border: `1px solid ${T.borderMid}`,
      borderRadius: 14,
      overflow: "hidden",
      marginBottom: 36,
      position: "relative",
    }}>
      {/* Amber top accent bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${T.accent}, ${T.accentHi} 50%, ${T.accentLow})`,
      }} />

      {/* Radial glow — decorative only */}
      <div style={{
        position: "absolute",
        top: -80,
        right: -80,
        width: 260,
        height: 260,
        background: `radial-gradient(circle, ${T.accent}10 0%, transparent 70%)`,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{ padding: "28px 32px", position: "relative", zIndex: 1 }}>

        {/* ── Header label ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <span style={{
            fontFamily: T.fontBody,
            background: T.accent,
            color: "#0c0905",
            fontSize: 9,
            fontWeight: 800,
            padding: "5px 11px",
            borderRadius: 5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            🔥 Hype of the Month
          </span>
          <span style={{
            fontFamily: T.fontBody,
            fontSize: 12,
            color: T.inkLow,
            letterSpacing: "0.06em",
          }}>
            {city && `${city} · `}
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>

        {/* ── Main grid: left info + right chart ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 36,
          alignItems: "start",
        }}>

          {/* ── Left: content ── */}
          <div>
            <h2 style={{
              fontFamily: T.fontDisplay,
              fontSize: 40,
              fontWeight: 700,
              color: T.ink,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: "0 0 6px",
            }}>
              {restaurant.name}
            </h2>
            <p style={{
              fontFamily: T.fontBody,
              fontSize: 13,
              color: T.inkMid,
              marginBottom: 22,
              letterSpacing: "0.02em",
            }}>
              {restaurant.neighborhood} · {restaurant.cuisine}
            </p>

            {/* Score pills */}
            <div style={{ display: "flex", gap: 24, marginBottom: 22 }}>
              {[
                { label: "Hype Score",    value: hypeScore,                 color: T.hype,   fmt: v => v.toFixed(1) },
                { label: "Reality Score", value: restaurant.realityScore,   color: T.worthy, fmt: v => v.toFixed(1) },
                { label: "Reviews",       value: restaurant.reviews,        color: T.accent, fmt: v => v.toLocaleString() },
              ].map(({ label, value, color, fmt }) => (
                <div key={label}>
                  <div style={{
                    fontFamily: T.fontDisplay,
                    fontSize: 28,
                    fontWeight: 700,
                    color,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>
                    {fmt(value)}
                  </div>
                  <div style={{
                    fontFamily: T.fontBody,
                    fontSize: 9,
                    color: T.inkLow,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Momentum badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: isRising ? "#4ade8012" : "#f8717112",
              border: `1px solid ${trendColor}25`,
              borderRadius: 8,
              padding: "7px 14px",
              marginBottom: 20,
            }}>
              <span style={{
                fontFamily: T.fontMono,
                fontSize: 16,
                fontWeight: 700,
                color: trendColor,
              }}>
                {isRising ? "↗" : "↘"} {Math.abs(momentum).toFixed(1)}%
              </span>
              <span style={{
                fontFamily: T.fontBody,
                fontSize: 11,
                color: T.inkMid,
              }}>
                this week
              </span>
            </div>

            {/* Description pull-quote */}
            {restaurant.description && (
              <p style={{
                fontFamily: T.fontBody,
                fontSize: 13,
                lineHeight: 1.75,
                color: T.inkMid,
                marginBottom: 24,
                borderLeft: `2px solid ${T.accent}`,
                paddingLeft: 14,
                fontStyle: "italic",
              }}>
                {restaurant.description}
              </p>
            )}

            {/* CTA */}
            <Link
              to={`/restaurant/${restaurant.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 22px",
                background: T.accent,
                color: "#0c0905",
                fontFamily: T.fontBody,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderRadius: 8,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background  = T.accentHi;
                e.currentTarget.style.transform   = "translateY(-2px)";
                e.currentTarget.style.boxShadow   = `0 6px 20px ${T.accentDim}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background  = T.accent;
                e.currentTarget.style.transform   = "translateY(0)";
                e.currentTarget.style.boxShadow   = "none";
              }}
            >
              View Full Details
              <span style={{ fontSize: 15 }}>→</span>
            </Link>
          </div>

          {/* ── Right: trend chart ── */}
          <div style={{
            background: T.bg,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: "18px 18px 14px",
            minWidth: gW + 36,
          }}>
            {/* Chart header */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 14,
            }}>
              <div>
                <p style={{
                  fontFamily: T.fontBody,
                  fontSize: 9,
                  fontWeight: 700,
                  color: T.inkLow,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}>
                  Popularity Trend
                </p>
                <p style={{
                  fontFamily: T.fontBody,
                  fontSize: 10,
                  color: T.inkLow,
                }}>
                  Last 8 weeks
                </p>
              </div>
              <span style={{
                fontFamily: T.fontMono,
                fontSize: 12,
                fontWeight: 700,
                color: trendColor,
              }}>
                {isRising ? "↗" : "↘"} {Math.abs(momentum).toFixed(1)}%
              </span>
            </div>

            {/* SVG chart — accessible */}
            <svg
              width={gW}
              height={gH}
              role="img"
              aria-label={`Popularity trend for ${restaurant.name} — last 8 weeks. Peak: ${maxV.toFixed(1)}, Current: ${trendData[trendData.length - 1].value.toFixed(1)}`}
              style={{ display: "block", overflow: "visible" }}
            >
              <title>{restaurant.name} — Popularity Trend (last 8 weeks)</title>

              {/* Grid lines */}
              {[0, 0.33, 0.67, 1].map(ratio => {
                const y = pad.top + cH * (1 - ratio);
                return (
                  <line
                    key={ratio}
                    x1={pad.left} y1={y}
                    x2={gW - pad.right} y2={y}
                    stroke={T.border}
                    strokeWidth={1}
                    strokeDasharray="3,3"
                  />
                );
              })}

              {/* Area fill */}
              <path d={areaPath} fill={`${trendColor}10`} />

              {/* Line */}
              <path
                d={linePath}
                fill="none"
                stroke={trendColor}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {trendData.map((d, i) => {
                const cx  = xS(i);
                const cy  = yS(d.value);
                const hov = hoveredPoint === i;

                return (
                  <g key={i}>
                    {/* Halo on hover */}
                    {hov && (
                      <circle cx={cx} cy={cy} r={14}
                        fill={`${trendColor}12`} />
                    )}

                    {/* Point */}
                    <circle
                      cx={cx} cy={cy}
                      r={hov ? 5.5 : 3.5}
                      fill={trendColor}
                      stroke={T.bg}
                      strokeWidth={2}
                      style={{ cursor: "pointer", transition: "r 0.15s" }}
                      onMouseEnter={() => setHoveredPoint(i)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />

                    {/* Tooltip */}
                    {hov && (
                      <g>
                        <rect
                          x={cx - 32} y={cy - 46}
                          width={64} height={32}
                          rx={7}
                          fill={T.bgCard}
                          stroke={T.borderMid}
                          strokeWidth={1}
                        />
                        <text
                          x={cx} y={cy - 32}
                          textAnchor="middle"
                          fontSize={9}
                          fill={T.inkLow}
                          fontFamily={T.fontBody}
                        >
                          {d.label}
                        </text>
                        <text
                          x={cx} y={cy - 19}
                          textAnchor="middle"
                          fontSize={13}
                          fill={trendColor}
                          fontWeight={700}
                          fontFamily={T.fontDisplay}
                        >
                          {d.value.toFixed(1)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* X-axis labels — every other */}
              {trendData.map((d, i) => i % 2 !== 0 ? null : (
                <text
                  key={i}
                  x={xS(i)} y={gH - 6}
                  textAnchor="middle"
                  fontSize={9}
                  fill={T.inkLow}
                  fontFamily={T.fontBody}
                >
                  {d.label}
                </text>
              ))}

              {/* Y-axis labels */}
              {[minV, (minV + maxV) / 2, maxV].map((v, i) => (
                <text
                  key={i}
                  x={pad.left - 7} y={yS(v) + 3}
                  textAnchor="end"
                  fontSize={9}
                  fill={T.inkLow}
                  fontFamily={T.fontBody}
                >
                  {v.toFixed(0)}
                </text>
              ))}
            </svg>

            {/* Chart footer */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 10,
              marginTop: 10,
              borderTop: `1px solid ${T.border}`,
              fontFamily: T.fontMono,
              fontSize: 10,
              color: T.inkLow,
            }}>
              <span>Peak {maxV.toFixed(1)}</span>
              <span>Now {trendData[trendData.length - 1].value.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}