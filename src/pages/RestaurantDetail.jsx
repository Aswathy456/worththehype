import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, push, onValue, serverTimestamp } from "firebase/database";
import { db } from "../firebase";
import { useRestaurants } from "../context/RestaurantContext";
import { useAuth } from "../hooks/useAuth";
import HypeGauge from "../components/HypeGauge";
import VerdictBadge from "../components/VerdictBadge";
import { T } from "../tokens";

const REP = {
  New:     { color: T.inkLow,  bg: T.bgRaised },
  Regular: { color: "#4a7c8a", bg: "rgba(74,124,138,0.12)" },
  Veteran: { color: "#c17c2b", bg: "rgba(193,124,43,0.12)" },
};

function accountAgeLabel(createdMs) {
  if (!createdMs) return "New";
  const days = Math.floor((Date.now() - createdMs) / 86400000);
  if (days < 30)  return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}yr`;
}

function reputationFromAge(createdMs) {
  if (!createdMs) return "New";
  const days = Math.floor((Date.now() - createdMs) / 86400000);
  if (days >= 180) return "Veteran";
  if (days >= 30)  return "Regular";
  return "New";
}

/* ── Single review card ──────────────────────────────────────── */
function ReviewCard({ review }) {
  const { displayName, accountCreated, hypeGiven, realityGiven, text, upvotes = 0, createdAt } = review;
  const reputation = reputationFromAge(accountCreated);
  const { color, bg } = REP[reputation];
  const delta = realityGiven - hypeGiven;
  const date = createdAt ? new Date(createdAt).toISOString().split("T")[0] : "—";

  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, padding: "20px 22px", background: T.bgCard }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: T.bgRaised, border: `1px solid ${T.borderMid}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: T.inkMid,
          }}>
            {(displayName || "?")[0].toUpperCase()}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>u/{displayName}</span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color, background: bg, padding: "2px 7px", borderRadius: 3 }}>
                {reputation}
              </span>
            </div>
            <p style={{ fontSize: 11, color: T.inkLow, marginTop: 1 }}>
              {accountAgeLabel(accountCreated)} account · {date}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[["Hype", hypeGiven, T.hype], ["Reality", realityGiven, delta >= 0 ? T.worthy : T.accent]].map(([label, score, col]) => (
            <div key={label} style={{ textAlign: "right" }}>
              <p style={{ fontSize: 9, color: T.inkLow, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
              <p style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 700, color: col, lineHeight: 1 }}>{score}</p>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: T.fontDisplay, fontSize: 16, fontStyle: "italic", color: T.inkMid, lineHeight: 1.75, borderLeft: `2px solid ${T.border}`, paddingLeft: 14, marginBottom: 14 }}>
        "{text}"
      </p>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 4, padding: "4px 12px", fontSize: 12, color: T.inkLow, display: "flex", alignItems: "center", gap: 5 }}>
          ▲ <span style={{ fontWeight: 600 }}>{upvotes}</span>
        </button>
      </div>
    </div>
  );
}

/* ── Inline review form ──────────────────────────────────────── */
function AddReviewForm({ restaurantId, user, onSubmitted }) {
  const [hype, setHype]       = useState(5);
  const [reality, setReality] = useState(5);
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const delta    = (reality - hype).toFixed(1);
  const deltaPos = delta >= 0;

  const handleSubmit = async () => {
    if (text.trim().length < 15) return setError("Write at least a sentence — the community needs detail.");
    setLoading(true); setError("");
    try {
      await push(ref(db, `reviews/${restaurantId}`), {
        uid: user.uid,
        displayName: user.displayName,
        accountCreated: user.accountCreated || null,
        hypeGiven: hype,
        realityGiven: reality,
        text: text.trim(),
        upvotes: 0,
        createdAt: Date.now(),
      });
      setText(""); setHype(5); setReality(5);
      onSubmitted();
    } catch (err) {
      setError("Failed to submit. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ border: `1px solid ${T.borderMid}`, borderRadius: 10, padding: "24px", background: T.bgRaised, marginBottom: 32 }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accent, marginBottom: 20 }}>
        Your Review — as u/{user.displayName}
      </p>

      {[
        { label: "🔥 Hype Score", hint: "How hyped is this place?", val: hype, set: setHype, color: T.hype },
        { label: "✦ Reality Score", hint: "How good was the actual experience?", val: reality, set: setReality, color: deltaPos ? T.worthy : T.accent },
      ].map(({ label, hint, val, set, color }) => (
        <div key={label} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{label}</span>
              <span style={{ fontSize: 11, color: T.inkLow, marginLeft: 8 }}>{hint}</span>
            </div>
            <span style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 700, color }}>{val}</span>
          </div>
          <input type="range" min="1" max="10" step="0.5" value={val}
            onChange={e => set(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: color, cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.inkLow, marginTop: 2 }}>
            <span>1</span><span>10</span>
          </div>
        </div>
      ))}

      {/* Delta preview */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", marginBottom: 18,
        background: T.bgCard, borderRadius: 8,
        border: `1px solid ${deltaPos ? T.worthy : T.accent}33`,
      }}>
        <span style={{ fontSize: 12, color: T.inkLow, letterSpacing: "0.06em", textTransform: "uppercase" }}>Your Delta</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 700, color: deltaPos ? T.worthy : T.accent }}>
            {deltaPos ? "+" : ""}{delta}
          </span>
          <span style={{ fontSize: 12, color: T.inkMid }}>
            {deltaPos ? "✦ Worth the Hype" : "▽ Overhyped"}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <textarea value={text} onChange={e => { setText(e.target.value); setError(""); }}
          placeholder="What did you actually experience? Be specific — the community trusts detail."
          rows={4}
          style={{
            width: "100%", padding: "14px",
            background: T.bgCard, border: `1px solid ${error ? T.accent : T.border}`,
            borderRadius: 8, color: T.ink, fontSize: 14, lineHeight: 1.7,
            resize: "vertical", outline: "none", fontFamily: T.fontBody,
          }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {error ? <span style={{ fontSize: 12, color: T.accent }}>{error}</span> : <span />}
          <span style={{ fontSize: 11, color: T.inkLow }}>{text.length} chars</span>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading}
        style={{
          width: "100%", padding: "13px",
          background: loading ? T.bgRaised : T.accent,
          color: "#fff", border: "none", borderRadius: 8,
          fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
        }}>
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { findById } = useRestaurants();
  const { user } = useAuth();

  const r = findById(id);
  const [reviews, setReviews]       = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Live reviews from Firebase
  useEffect(() => {
    const reviewsRef = ref(db, `reviews/${id}`);
    const unsub = onValue(reviewsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.values(data).sort((a, b) => b.createdAt - a.createdAt);
        setReviews(list);
      } else {
        setReviews([]);
      }
    });
    return unsub;
  }, [id]);

  const handleSubmitted = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!r) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: T.fontDisplay, fontSize: 22, color: T.inkMid, fontStyle: "italic" }}>Loading restaurant…</p>
          <p style={{ fontSize: 13, color: T.inkLow, marginTop: 8 }}>
            <span style={{ color: T.accent, cursor: "pointer" }} onClick={() => navigate("/")}>← Go back home</span> so data can load first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 32px 80px" }}>

        <button onClick={() => navigate("/")} style={{
          background: "none", border: "none", padding: 0, color: T.inkLow,
          fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: 40, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>
          ← All Restaurants
        </button>

        {/* Title */}
        <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 32, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: T.ink, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              {r.name}
            </h1>
            <VerdictBadge hypeScore={r.hypeScore} realityScore={r.realityScore} large />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
            {[r.neighborhood, r.cuisine, r.city].filter(Boolean).map((item, i, arr) => (
              <span key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: T.inkLow, letterSpacing: "0.08em", textTransform: "uppercase" }}>{item}</span>
                {i < arr.length - 1 && <span style={{ color: T.border }}>·</span>}
              </span>
            ))}
          </div>
          {r.address      && <p style={{ fontSize: 13, color: T.inkLow, marginBottom: 4 }}>📍 {r.address}</p>}
          {r.openingHours && <p style={{ fontSize: 13, color: T.inkLow }}>🕐 {r.openingHours}</p>}
        </div>

        {/* Scores */}
        <div style={{ background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 10, padding: "28px", marginBottom: 40 }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: T.inkLow, marginBottom: 20 }}>
            Community Verdict
          </p>
          <HypeGauge hypeScore={r.hypeScore} realityScore={r.realityScore} />
          <p style={{ fontSize: 12, color: T.inkLow, marginTop: 16 }}>
            Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Reviews header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 700, color: T.ink }}>Community Reviews</h2>
          <span style={{ fontSize: 13, color: T.inkLow }}>{reviews.length} total</span>
        </div>

        {/* Success toast */}
        {showSuccess && (
          <div style={{ background: T.worthyBg, border: `1px solid ${T.worthy}44`, borderRadius: 8, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: T.worthy, fontSize: 16 }}>✦</span>
            <span style={{ fontSize: 13, color: T.worthy, fontWeight: 600 }}>Review submitted! +10 reputation earned.</span>
          </div>
        )}

        {/* Review form or sign-in prompt */}
        {user ? (
          <AddReviewForm restaurantId={id} user={user} onSubmitted={handleSubmitted} />
        ) : (
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: "28px", textAlign: "center", marginBottom: 32, background: T.bgRaised }}>
            <p style={{ fontFamily: T.fontDisplay, fontSize: 20, color: T.ink, marginBottom: 8 }}>Have you been here?</p>
            <p style={{ fontSize: 13, color: T.inkLow, marginBottom: 20 }}>
              Sign in to share your experience. Account age is visible on your review — it builds community trust.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => navigate(`/login?redirect=/restaurant/${id}`)}
                style={{ padding: "10px 24px", background: T.accent, color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Sign In
              </button>
              <button onClick={() => navigate(`/signup?redirect=/restaurant/${id}`)}
                style={{ padding: "10px 24px", background: "none", color: T.inkMid, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontFamily: T.fontDisplay, fontSize: 20, color: T.inkMid, fontStyle: "italic" }}>No reviews yet.</p>
            <p style={{ fontSize: 13, color: T.inkLow, marginTop: 6 }}>Be the first to share your experience.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {reviews.map((review, i) => <ReviewCard key={i} review={review} />)}
          </div>
        )}
      </div>
    </div>
  );
}