import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { restaurants } from "../data/restaurants";
import { useAuth } from "../hooks/useAuth";

function AddReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const restaurant = restaurants.find((r) => r.id === parseInt(id));

  const [hype, setHype] = useState(5);
  const [reality, setReality] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!restaurant) return <div style={{ padding: 24 }}>Restaurant not found.</div>;

  // ── Auth gate ──────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.gateBox}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={styles.gateTitle}>Sign in to write a review</h2>
          <p style={styles.gateSubtitle}>
            You need an account to review <strong>{restaurant.name}</strong>.<br />
            Account age is shown on your reviews — it builds trust with the community.
          </p>
          <button
            style={styles.gateBtn}
            onClick={() => navigate(`/login?redirect=/restaurant/${id}/review`)}
          >
            Sign In
          </button>
          <button
            style={styles.gateBtnSecondary}
            onClick={() => navigate(`/signup?redirect=/restaurant/${id}/review`)}
          >
            Create Account
          </button>
          <button style={styles.backLink} onClick={() => navigate(`/restaurant/${id}`)}>
            ← Back to restaurant
          </button>
        </div>
      </div>
    );
  }

  const delta = (reality - hype).toFixed(1);
  const deltaPositive = delta >= 0;

  const handleSubmit = () => {
    if (text.trim().length < 10) return alert("Please write a bit more in your review!");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ ...styles.page, textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontWeight: 800, color: "#111" }}>Review submitted!</h2>
        <p style={{ color: "#6b7280", fontSize: 14, marginTop: 8 }}>
          +10 reputation points earned. Thanks for keeping it real.
        </p>
        <button style={{ ...styles.gateBtn, marginTop: 24 }} onClick={() => navigate(`/restaurant/${id}`)}>
          Back to {restaurant.name}
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => navigate(`/restaurant/${id}`)}>
        ← Back
      </button>

      <div style={styles.userBadge}>
        Reviewing as <strong>{user.displayName}</strong>
        <span style={styles.newBadge}>🕐 New member</span>
      </div>

      <h1 style={styles.title}>Review {restaurant.name}</h1>
      <p style={styles.subtitle}>Be honest. The community is counting on you.</p>

      {/* Hype slider */}
      <div style={styles.sliderBlock}>
        <div style={styles.sliderHeader}>
          <span style={styles.sliderLabel}>🔥 Hype Score</span>
          <span style={styles.sliderValue}>{hype}</span>
        </div>
        <p style={styles.sliderHint}>How hyped is this place online / by word of mouth?</p>
        <input type="range" min="1" max="10" step="0.5" value={hype}
          onChange={(e) => setHype(parseFloat(e.target.value))} style={styles.slider} />
        <div style={styles.sliderScale}><span>1</span><span>10</span></div>
      </div>

      {/* Reality slider */}
      <div style={styles.sliderBlock}>
        <div style={styles.sliderHeader}>
          <span style={styles.sliderLabel}>✅ Reality Score</span>
          <span style={styles.sliderValue}>{reality}</span>
        </div>
        <p style={styles.sliderHint}>How good was your actual experience?</p>
        <input type="range" min="1" max="10" step="0.5" value={reality}
          onChange={(e) => setReality(parseFloat(e.target.value))} style={styles.slider} />
        <div style={styles.sliderScale}><span>1</span><span>10</span></div>
      </div>

      {/* Live delta */}
      <div style={{ ...styles.deltaBox, borderColor: deltaPositive ? "#16a34a" : "#dc2626" }}>
        <span style={styles.deltaLabel}>Your Reality Delta</span>
        <span style={{ ...styles.deltaValue, color: deltaPositive ? "#16a34a" : "#dc2626" }}>
          {deltaPositive ? "+" : ""}{delta}
        </span>
        <span style={styles.deltaVerdict}>
          {deltaPositive ? "✅ You think it's Worth the Hype" : "⚠️ You think it's Overhyped"}
        </span>
      </div>

      {/* Text */}
      <div style={styles.textBlock}>
        <label style={styles.sliderLabel}>Your Review</label>
        <textarea style={styles.textarea}
          placeholder="What did you actually experience? Be specific — vague reviews get downvoted."
          value={text} onChange={(e) => setText(e.target.value)} rows={4} />
        <span style={styles.charCount}>{text.length} characters</span>
      </div>

      <button style={styles.submitBtn} onClick={handleSubmit}>
        Submit Review
      </button>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "20px 16px",
  },
  gateBox: {
    textAlign: "center",
    paddingTop: 60,
    maxWidth: 400,
    margin: "0 auto",
  },
  gateTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#111",
    margin: "0 0 12px",
  },
  gateSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.7,
    marginBottom: 28,
  },
  gateBtn: {
    display: "block",
    width: "100%",
    padding: "13px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    marginBottom: 10,
  },
  gateBtnSecondary: {
    display: "block",
    width: "100%",
    padding: "13px",
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    marginBottom: 20,
  },
  backLink: {
    background: "none",
    border: "none",
    color: "#9ca3af",
    fontSize: 13,
    cursor: "pointer",
  },
  userBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "6px 12px",
    borderRadius: 20,
    marginBottom: 20,
  },
  newBadge: {
    fontSize: 11,
    background: "#ede9fe",
    color: "#6d28d9",
    padding: "2px 8px",
    borderRadius: 20,
    fontWeight: 600,
  },
  back: {
    background: "none",
    border: "none",
    color: "#4f46e5",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    padding: 0,
    marginBottom: 16,
    display: "block",
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#111",
  },
  subtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
    marginBottom: 28,
  },
  sliderBlock: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "16px 18px",
    marginBottom: 16,
  },
  sliderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderLabel: {
    fontWeight: 700,
    fontSize: 14,
    color: "#111",
  },
  sliderValue: {
    fontWeight: 800,
    fontSize: 20,
    color: "#4f46e5",
  },
  sliderHint: {
    fontSize: 12,
    color: "#9ca3af",
    margin: "4px 0 10px",
  },
  slider: {
    width: "100%",
    accentColor: "#4f46e5",
    cursor: "pointer",
  },
  sliderScale: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
  },
  deltaBox: {
    border: "2px solid",
    borderRadius: 12,
    padding: "14px 18px",
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  deltaLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 600,
  },
  deltaValue: {
    fontSize: 28,
    fontWeight: 800,
  },
  deltaVerdict: {
    fontSize: 13,
    color: "#374151",
    fontWeight: 600,
  },
  textBlock: {
    marginBottom: 20,
  },
  textarea: {
    width: "100%",
    marginTop: 8,
    padding: "12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    color: "#111",
    lineHeight: 1.6,
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  charCount: {
    fontSize: 11,
    color: "#9ca3af",
    display: "block",
    textAlign: "right",
    marginTop: 4,
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
};

export default AddReview;