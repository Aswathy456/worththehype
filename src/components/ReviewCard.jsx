import { T } from "../tokens";

const repColors = {
  New:     { color: T.inkLow,  bg: T.bgRaised },
  Regular: { color: "#4a7c8a", bg: "rgba(74,124,138,0.12)" },
  Veteran: { color: "#c17c2b", bg: "rgba(193,124,43,0.12)" },
};

export default function ReviewCard({ review }) {
  const { user, accountAgeDays, reputation, hypeGiven, realityGiven, text, upvotes, date } = review;
  const { color, bg } = repColors[reputation] || repColors.New;
  const delta = realityGiven - hypeGiven;

  const ageLabel = accountAgeDays < 30
    ? `${accountAgeDays}d`
    : accountAgeDays < 365
    ? `${Math.floor(accountAgeDays / 30)}mo`
    : `${(accountAgeDays / 365).toFixed(1)}yr`;

  return (
    <div style={{
      border: `1px solid ${T.border}`,
      borderRadius: 8, padding: "20px 22px",
      background: T.bgCard,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: T.bgRaised, border: `1px solid ${T.borderMid}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: T.inkMid,
          }}>
            {user[0].toUpperCase()}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>u/{user}</span>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.07em",
                textTransform: "uppercase", color, background: bg,
                padding: "2px 7px", borderRadius: 3,
              }}>{reputation}</span>
            </div>
            <p style={{ fontSize: 11, color: T.inkLow, marginTop: 1 }}>
              {ageLabel} account · {date}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[["Hype", hypeGiven, T.hype], ["Reality", realityGiven, delta >= 0 ? T.worthy : T.accent]].map(([label, score, color]) => (
            <div key={label} style={{ textAlign: "right" }}>
              <p style={{ fontSize: 9, color: T.inkLow, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
              <p style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{score}</p>
            </div>
          ))}
        </div>
      </div>

      <p style={{
        fontFamily: T.fontDisplay, fontSize: 16, fontStyle: "italic",
        color: T.inkMid, lineHeight: 1.75,
        borderLeft: `2px solid ${T.border}`,
        paddingLeft: 14, marginBottom: 14,
      }}>
        "{text}"
      </p>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{
          background: "none", border: `1px solid ${T.border}`,
          borderRadius: 4, padding: "4px 12px",
          fontSize: 12, color: T.inkLow,
          display: "flex", alignItems: "center", gap: 5,
        }}>
          ▲ <span style={{ fontWeight: 600 }}>{upvotes}</span>
        </button>
      </div>
    </div>
  );
}