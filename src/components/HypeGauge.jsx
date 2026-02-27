function HypeGauge({ hypeScore, realityScore }) {
  const hypeWidth = (hypeScore / 10) * 100;
  const realityWidth = (realityScore / 10) * 100;

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Hype bar */}
      <div style={styles.row}>
        <span style={styles.label}>Hype</span>
        <div style={styles.track}>
          <div style={{ ...styles.fill, width: `${hypeWidth}%`, background: "#f97316" }} />
        </div>
        <span style={styles.score}>{hypeScore}</span>
      </div>

      {/* Reality bar */}
      <div style={styles.row}>
        <span style={styles.label}>Reality</span>
        <div style={styles.track}>
          <div style={{ ...styles.fill, width: `${realityWidth}%`, background: "#22c55e" }} />
        </div>
        <span style={styles.score}>{realityScore}</span>
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  label: {
    width: 50,
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
  },
  track: {
    flex: 1,
    background: "#e5e7eb",
    borderRadius: 20,
    height: 10,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 20,
    transition: "width 0.4s ease",
  },
  score: {
    width: 28,
    fontSize: 13,
    fontWeight: 700,
    color: "#111",
    textAlign: "right",
  },
};

export default HypeGauge;