import { T } from "../tokens";

export default function HypeGauge({ hypeScore, realityScore }) {
  const delta = realityScore - hypeScore;
  const deltaPositive = delta >= 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        { label: "HYPE", score: hypeScore, color: T.hype, track: "#2a2218" },
        { label: "REALITY", score: realityScore, color: deltaPositive ? T.worthy : T.accent, track: "#1a201a" },
      ].map(({ label, score, color, track }) => (
        <div key={label}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
              color: T.inkLow, fontFamily: T.fontBody,
            }}>{label}</span>
            <span style={{
              fontFamily: T.fontDisplay,
              fontSize: 18, fontWeight: 700, color,
              lineHeight: 1,
            }}>
              {score}<span style={{ fontSize: 11, color: T.inkLow, fontFamily: T.fontBody }}>/10</span>
            </span>
          </div>
          <div style={{
            height: 3, background: track, borderRadius: 2, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${(score / 10) * 100}%`,
              background: color, borderRadius: 2,
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
        </div>
      ))}

      {/* Delta line */}
      <div style={{
        display: "flex", justifyContent: "flex-end", alignItems: "center",
        gap: 6, paddingTop: 4,
        borderTop: `1px solid ${T.border}`,
      }}>
        <span style={{ fontSize: 10, color: T.inkLow, letterSpacing: "0.08em", textTransform: "uppercase" }}>Delta</span>
        <span style={{
          fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700,
          color: deltaPositive ? T.worthy : T.accent,
        }}>
          {deltaPositive ? "+" : ""}{delta.toFixed(1)}
        </span>
      </div>
    </div>
  );
}