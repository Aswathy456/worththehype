import { T } from "../tokens";

export default function HypeGauge({ hypeScore, realityScore }) {
  const delta = realityScore - hypeScore;
  const deltaPositive = delta >= 0;
  const deltaColor = deltaPositive ? T.worthy : T.hype;

  const bars = [
    { label: "HYPE",    score: hypeScore,    color: T.hype,   track: "#2a0e0e" },
    { label: "REALITY", score: realityScore, color: deltaPositive ? T.worthy : T.accent, track: "#0a1f0a" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {bars.map(({ label, score, color, track }) => (
        <div key={label}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 7,
          }}>
            <span style={{
              fontFamily: T.fontBody,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: T.inkLow,
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: T.fontDisplay,
              fontSize: 21,
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}>
              {score.toFixed(1)}
              <span style={{
                fontFamily: T.fontBody,
                fontSize: 10,
                fontWeight: 400,
                color: T.inkLow,
                marginLeft: 2,
              }}>
                /10
              </span>
            </span>
          </div>

          {/* Track */}
          <div style={{
            height: 4,
            background: track,
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
          }}>
            <div style={{
              height: "100%",
              width: `${(score / 10) * 100}%`,
              background: `linear-gradient(90deg, ${color}50, ${color})`,
              borderRadius: 3,
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }} />
          </div>
        </div>
      ))}

      {/* Delta row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 12,
        borderTop: `1px solid ${T.border}`,
        marginTop: 2,
      }}>
        <span style={{
          fontFamily: T.fontBody,
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: T.inkLow,
        }}>
          Reality vs Hype
        </span>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{
            fontFamily: T.fontDisplay,
            fontSize: 20,
            fontWeight: 700,
            color: deltaColor,
            lineHeight: 1,
          }}>
            {deltaPositive ? "+" : ""}{delta.toFixed(1)}
          </span>
          <span style={{
            fontFamily: T.fontBody,
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: deltaColor,
            opacity: 0.7,
          }}>
            {deltaPositive ? "underrated" : "overhyped"}
          </span>
        </div>
      </div>
    </div>
  );
}