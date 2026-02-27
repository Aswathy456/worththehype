import { T } from "../tokens";

export default function VerdictBadge({ hypeScore, realityScore, large = false }) {
  const delta = realityScore - hypeScore;

  let label, color, bg, symbol;
  if (delta >= 1) {
    label = "Worth the Hype"; color = T.worthy; bg = T.worthyBg; symbol = "✦";
  } else if (delta >= -1) {
    label = "As Expected"; color = T.hype; bg = T.hypeBg; symbol = "◈";
  } else {
    label = "Overhyped"; color = T.over; bg = T.overBg; symbol = "▽";
  }

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: bg,
      border: `1px solid ${color}30`,
      color, borderRadius: 4,
      padding: large ? "5px 12px" : "3px 9px",
      fontSize: large ? 13 : 11,
      fontWeight: 600,
      fontFamily: T.fontBody,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }}>
      <span style={{ fontSize: large ? 10 : 8 }}>{symbol}</span>
      {label}
    </span>
  );
}