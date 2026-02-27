function ReviewCard({ review }) {
  const { user, accountAgeDays, reputation, hypeGiven, realityGiven, text, upvotes, date } = review;

  const reputationColor = {
    New: "#9ca3af",
    Regular: "#3b82f6",
    Veteran: "#f59e0b",
  };

  const accountAgeLabel =
    accountAgeDays < 30
      ? `${accountAgeDays}d`
      : accountAgeDays < 365
      ? `${Math.floor(accountAgeDays / 30)}mo`
      : `${Math.floor(accountAgeDays / 365)}yr`;

  return (
    <div style={styles.card}>
      {/* User info row */}
      <div style={styles.userRow}>
        <div style={{ ...styles.avatar, background: reputationColor[reputation] }}>
          {user[0].toUpperCase()}
        </div>
        <div>
          <div style={styles.username}>
            u/{user}
            <span style={{ ...styles.repBadge, color: reputationColor[reputation] }}>
              {reputation}
            </span>
          </div>
          <div style={styles.meta}>
            🕐 Account age: {accountAgeLabel} · {date}
          </div>
        </div>
      </div>

      {/* Review text */}
      <p style={styles.text}>{text}</p>

      {/* Scores + upvotes */}
      <div style={styles.footer}>
        <span style={styles.score}>Hype: {hypeGiven} · Reality: {realityGiven}</span>
        <span style={styles.upvotes}>▲ {upvotes}</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "14px 16px",
    marginBottom: 12,
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  username: {
    fontWeight: 700,
    fontSize: 13,
    color: "#111",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  repBadge: {
    fontSize: 11,
    fontWeight: 600,
    background: "#f3f4f6",
    padding: "2px 7px",
    borderRadius: 20,
  },
  meta: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  text: {
    margin: "0 0 10px",
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.6,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  score: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 600,
  },
  upvotes: {
    fontSize: 13,
    fontWeight: 700,
    color: "#4f46e5",
    cursor: "pointer",
  },
};

export default ReviewCard;