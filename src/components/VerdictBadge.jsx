function VerdictBadge({ hypeScore, realityScore }) {
  const delta = realityScore - hypeScore;

  if (delta >= 1) {
    return <span style={styles.worthy}>✅ Worth the Hype</span>;
  } else if (delta >= -1) {
    return <span style={styles.fair}>😐 About What You'd Expect</span>;
  } else {
    return <span style={styles.overhyped}>⚠️ Overhyped</span>;
  }
}

const styles = {
  worthy: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "4px 10px",
    borderRadius: 20,
    fontWeight: 700,
    fontSize: 13,
  },
  fair: {
    background: "#fef9c3",
    color: "#854d0e",
    padding: "4px 10px",
    borderRadius: 20,
    fontWeight: 700,
    fontSize: 13,
  },
  overhyped: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "4px 10px",
    borderRadius: 20,
    fontWeight: 700,
    fontSize: 13,
  },
};

export default VerdictBadge;