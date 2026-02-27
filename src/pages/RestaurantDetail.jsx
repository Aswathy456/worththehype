import { useParams, useNavigate } from "react-router-dom";
import { restaurants } from "../data/restaurants";
import HypeGauge from "../components/HypeGauge";
import VerdictBadge from "../components/VerdictBadge";
import ReviewCard from "../components/ReviewCard";
import { T } from "../tokens";

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const r = restaurants.find((r) => r.id === parseInt(id));

  if (!r) return (
    <div style={{ padding: 40, color: T.inkMid, fontFamily: T.fontBody }}>Restaurant not found.</div>
  );

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Back */}
        <button onClick={() => navigate("/")} style={{
          background: "none", border: "none", padding: 0,
          color: T.inkLow, fontSize: 12, fontWeight: 500,
          letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: 40, display: "flex", alignItems: "center", gap: 6,
        }}>
          ← All Restaurants
        </button>

        {/* Title block */}
        <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 32, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
            <h1 style={{
              fontFamily: T.fontDisplay,
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700, color: T.ink,
              lineHeight: 1.1, letterSpacing: "-0.02em",
            }}>
              {r.name}
            </h1>
            <VerdictBadge hypeScore={r.hypeScore} realityScore={r.realityScore} large />
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: T.inkLow, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {r.neighborhood}
            </span>
            <span style={{ color: T.border }}>·</span>
            <span style={{ fontSize: 12, color: T.inkLow, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {r.cuisine}
            </span>
            <span style={{ color: T.border }}>·</span>
            <span style={{ fontSize: 12, color: T.inkLow }}>
              {r.reviews_list?.length || 0} reviews
            </span>
          </div>

          <p style={{ fontSize: 15, color: T.inkMid, lineHeight: 1.8, maxWidth: 560 }}>
            {r.description}
          </p>
        </div>

        {/* Score panel */}
        <div style={{
          background: T.bgRaised, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: "28px 28px 24px",
          marginBottom: 40,
        }}>
          <p style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.14em",
            textTransform: "uppercase", color: T.inkLow, marginBottom: 20,
          }}>
            Community Verdict
          </p>
          <HypeGauge hypeScore={r.hypeScore} realityScore={r.realityScore} />
        </div>

        {/* Write review CTA */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 32,
        }}>
          <h2 style={{
            fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 700, color: T.ink,
          }}>
            Community Reviews
          </h2>
          <button
            onClick={() => navigate(`/restaurant/${id}/review`)}
            style={{
              padding: "10px 22px",
              background: T.accent, color: "#fff",
              border: "none", borderRadius: 6,
              fontSize: 13, fontWeight: 600,
              letterSpacing: "0.04em",
            }}>
            + Write a Review
          </button>
        </div>

        {/* Reviews */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {r.reviews_list?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}