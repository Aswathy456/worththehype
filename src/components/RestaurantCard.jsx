import { useNavigate } from "react-router-dom";
import HypeGauge from "./HypeGauge";
import VerdictBadge from "./VerdictBadge";

function RestaurantCard({ restaurant }) {
  const { id, name, city, neighborhood, cuisine, hypeScore, realityScore, reviews } = restaurant;
  const navigate = useNavigate();

  return (
    <div style={styles.card} onClick={() => navigate(`/restaurant/${id}`)}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.name}>{name}</h3>
          <span style={styles.meta}>📍 {neighborhood}, {city} · {cuisine}</span>
        </div>
        <VerdictBadge hypeScore={hypeScore} realityScore={realityScore} />
      </div>

      <HypeGauge hypeScore={hypeScore} realityScore={realityScore} />

      <div style={styles.footer}>
        <span style={styles.reviews}>💬 {reviews} reviews</span>
        <span style={styles.delta}>
          Delta: {(realityScore - hypeScore) >= 0 ? "+" : ""}
          {(realityScore - hypeScore).toFixed(1)}
        </span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "16px 18px",
    marginBottom: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    cursor: "pointer",
    transition: "box-shadow 0.2s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  name: {
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: "#111",
  },
  meta: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 3,
    display: "block",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  reviews: {
    fontSize: 12,
    color: "#6b7280",
  },
  delta: {
    fontSize: 12,
    fontWeight: 700,
    color: "#4f46e5",
  },
};

export default RestaurantCard;