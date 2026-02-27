import { useParams, useNavigate } from "react-router-dom";
import { restaurants } from "../data/restaurants";
import HypeGauge from "../components/HypeGauge";
import VerdictBadge from "../components/VerdictBadge";
import ReviewCard from "../components/ReviewCard";

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = restaurants.find((r) => r.id === parseInt(id));

  if (!restaurant) {
    return <div style={{ padding: 24 }}>Restaurant not found.</div>;
  }

  const { name, city, neighborhood, cuisine, hypeScore, realityScore, description, reviews_list } = restaurant;

  return (
    <div style={styles.page}>
      {/* Back button */}
      <button style={styles.back} onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.name}>{name}</h1>
          <span style={styles.meta}>📍 {neighborhood}, {city} · {cuisine}</span>
        </div>
        <VerdictBadge hypeScore={hypeScore} realityScore={realityScore} />
      </div>

      {/* Description */}
      <p style={styles.description}>{description}</p>

      {/* Scores */}
      <div style={styles.scoreBox}>
        <HypeGauge hypeScore={hypeScore} realityScore={realityScore} />
        <div style={styles.deltaRow}>
          <span style={styles.deltaLabel}>Reality Delta</span>
          <span style={{
            ...styles.deltaValue,
            color: (realityScore - hypeScore) >= 0 ? "#16a34a" : "#dc2626"
          }}>
            {(realityScore - hypeScore) >= 0 ? "+" : ""}
            {(realityScore - hypeScore).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Add Review button */}
      <button style={styles.reviewBtn} onClick={() => navigate(`/restaurant/${id}/review`)}>
        + Write a Review
      </button>

      {/* Reviews */}
      <h2 style={styles.sectionTitle}>Community Reviews</h2>
      {reviews_list.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "20px 16px",
  },
  back: {
    background: "none",
    border: "none",
    color: "#4f46e5",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    padding: 0,
    marginBottom: 20,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  name: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#111",
  },
  meta: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
    display: "block",
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 1.7,
    marginBottom: 20,
  },
  scoreBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "16px 18px",
    marginBottom: 16,
  },
  deltaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid #e5e7eb",
  },
  deltaLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 600,
  },
  deltaValue: {
    fontSize: 18,
    fontWeight: 800,
  },
  reviewBtn: {
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#111",
    marginBottom: 14,
  },
};

export default RestaurantDetail;