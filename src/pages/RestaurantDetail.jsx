import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, query, orderByChild } from "firebase/database";
import { db } from "../firebase";
import { useRestaurants } from "../context/RestaurantContext";
import { useAuth } from "../hooks/useAuth";
import HypeGauge from "../components/HypeGauge";
import VerdictBadge from "../components/VerdictBadge";
import ReviewCard from "../components/ReviewCard";
import { BadgeUnlockToast } from "../components/UserBadges";
import { submitReview, getUserStats, saveUserBadges } from "../services/reviewService";
import { computeEarnedBadges, computeNewBadges } from "../services/badgeService";
import { T } from "../tokens";

// ── Reputation helpers ────────────────────────────────────────────────────
const REP = {
  New:     { color: T.inkLow,  bg: T.bgRaised },
  Regular: { color: "#4a7c8a", bg: "rgba(74,124,138,0.12)" },
  Veteran: { color: "#c17c2b", bg: "rgba(193,124,43,0.12)" },
};

function reputationFromAge(createdMs) {
  if (!createdMs) return "New";
  const days = Math.floor((Date.now() - createdMs) / 86400000);
  if (days >= 180) return "Veteran";
  if (days >= 30)  return "Regular";
  return "New";
}

function accountAgeLabel(createdMs) {
  if (!createdMs) return "New";
  const days = Math.floor((Date.now() - createdMs) / 86400000);
  if (days < 30)  return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}yr`;
}

// ── Inline review form ────────────────────────────────────────────────────
function AddReviewForm({ restaurantId, user, onSubmitted }) {
  const [hype,    setHype]    = useState(5);
  const [reality, setReality] = useState(5);
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const delta    = (reality - hype).toFixed(1);
  const deltaPos = parseFloat(delta) >= 0;

  const handleSubmit = async () => {
    if (text.trim().length < 15) {
      setError("Write at least a sentence — the community needs detail.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await submitReview(restaurantId, user, { hypeGiven: hype, realityGiven: reality, text });
      setText(""); setHype(5); setReality(5);
      onSubmitted();
    } catch {
      setError("Failed to submit. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      border:       `1px solid ${T.borderMid}`,
      borderRadius: 12,
      padding:      "26px",
      background:   T.bgRaised,
      marginBottom: 32,
    }}>
      {/* Form header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.accent}60, ${T.accent}30)`,
          border: `1.5px solid ${T.accent}50`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 700, color: T.accent,
        }}>
          {(user.displayName || "?")[0].toUpperCase()}
        </div>
        <div>
          <p style={{
            fontFamily: T.fontBody,
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: T.accent, margin: 0,
          }}>
            Your Review
          </p>
          <p style={{
            fontFamily: T.fontBody,
            fontSize: 12, color: T.inkLow, margin: 0,
          }}>
            as u/{user.displayName}
          </p>
        </div>
      </div>

      {/* Score sliders */}
      {[
        { label: "🔥 Hype Score",    hint: "How hyped is this place online?", val: hype,    set: setHype,    color: T.hype   },
        { label: "✦ Reality Score",  hint: "How good was your actual visit?",  val: reality, set: setReality, color: deltaPos ? T.worthy : T.accent },
      ].map(({ label, hint, val, set, color }) => (
        <div key={label} style={{ marginBottom: 20 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 6,
          }}>
            <div>
              <span style={{
                fontFamily: T.fontBody,
                fontSize: 13, fontWeight: 600, color: T.ink,
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: T.fontBody,
                fontSize: 11, color: T.inkLow, marginLeft: 8,
              }}>
                {hint}
              </span>
            </div>
            <span style={{
              fontFamily: T.fontDisplay,
              fontSize: 24, fontWeight: 700, color,
            }}>
              {val}
            </span>
          </div>
          <input
            type="range" min="1" max="10" step="0.5"
            value={val}
            onChange={e => set(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: color, cursor: "pointer" }}
          />
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: T.fontBody, fontSize: 10, color: T.inkLow, marginTop: 2,
          }}>
            <span>1</span><span>10</span>
          </div>
        </div>
      ))}

      {/* Delta preview */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px", marginBottom: 20,
        background: T.bgCard, borderRadius: 8,
        border: `1px solid ${deltaPos ? "#4ade8030" : "#f8717130"}`,
      }}>
        <span style={{
          fontFamily: T.fontBody,
          fontSize: 11, color: T.inkLow,
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          Your Delta
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: T.fontDisplay,
            fontSize: 28, fontWeight: 700,
            color: deltaPos ? T.worthy : T.hype,
          }}>
            {deltaPos ? "+" : ""}{delta}
          </span>
          <span style={{
            fontFamily: T.fontBody,
            fontSize: 12, color: T.inkMid,
          }}>
            {deltaPos ? "✦ Worth the Hype" : "▽ Overhyped"}
          </span>
        </div>
      </div>

      {/* Text area */}
      <div style={{ marginBottom: 18 }}>
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setError(""); }}
          placeholder="What did you actually experience? Be specific — the community trusts detail."
          rows={4}
          style={{
            width: "100%", padding: "14px",
            background: T.bgCard,
            border: `1.5px solid ${error ? T.hype : T.border}`,
            borderRadius: 8,
            color: T.ink, fontSize: 14, lineHeight: 1.7,
            resize: "vertical", outline: "none",
            fontFamily: T.fontBody,
            transition: "border-color 0.2s",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {error
            ? <span style={{ fontFamily: T.fontBody, fontSize: 12, color: T.hype }}>{error}</span>
            : <span />
          }
          <span style={{ fontFamily: T.fontBody, fontSize: 11, color: T.inkLow }}>
            {text.length} chars
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%", padding: "13px",
          background: loading ? T.bgCard : T.accent,
          color: loading ? T.inkMid : "#0c0905",
          border: `1.5px solid ${loading ? T.border : T.accent}`,
          borderRadius: 8,
          fontFamily: T.fontBody,
          fontSize: 13, fontWeight: 700,
          letterSpacing: "0.04em",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          if (!loading) {
            e.currentTarget.style.background = T.accentHi;
            e.currentTarget.style.transform  = "translateY(-1px)";
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = loading ? T.bgCard : T.accent;
          e.currentTarget.style.transform  = "translateY(0)";
        }}
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}

// ── Sort control ──────────────────────────────────────────────────────────
function SortControl({ value, onChange }) {
  const options = [
    { key: "top",  label: "Top"  },
    { key: "new",  label: "New"  },
    { key: "controversial", label: "Controversial" },
  ];
  return (
    <div style={{ display: "flex", gap: 4, background: T.bgRaised, border: `1px solid ${T.border}`, borderRadius: 8, padding: "3px" }}>
      {options.map(o => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            style={{
              padding: "5px 14px",
              fontFamily: T.fontBody,
              fontSize: 12, fontWeight: active ? 700 : 500,
              background: active ? T.bgCard : "transparent",
              border: active ? `1px solid ${T.borderMid}` : "1px solid transparent",
              borderRadius: 6,
              color: active ? T.ink : T.inkMid,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function RestaurantDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { findById } = useRestaurants();
  const { user }     = useAuth();

  const r = findById(id);

  const [reviews,      setReviews]      = useState([]);
  const [reviewIds,    setReviewIds]    = useState([]);
  const [sortBy,       setSortBy]       = useState("top");
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [newBadges,    setNewBadges]    = useState([]); // queue of badges to toast

  // Badge toast queue management
  const dismissBadge = (badgeId) => setNewBadges(q => q.filter(b => b.id !== badgeId));

  // Live reviews from Realtime Database
  useEffect(() => {
    const reviewsRef = query(ref(db, `reviews/${id}`), orderByChild("createdAt"));
    const unsub = onValue(reviewsRef, (snap) => {
      if (snap.exists()) {
        const ids  = [];
        const list = [];
        snap.forEach(child => {
          ids.push(child.key);
          list.push(child.val());
        });
        // Reverse so newest first by default
        setReviewIds(ids.reverse());
        setReviews(list.reverse());
      } else {
        setReviewIds([]);
        setReviews([]);
      }
    });
    return () => unsub();
  }, [id]);

  // Sort reviews
  const sortedReviews = [...reviews].map((r, i) => ({ ...r, _id: reviewIds[i] })).sort((a, b) => {
    if (sortBy === "top")           return (b.score ?? 0) - (a.score ?? 0);
    if (sortBy === "new")           return (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);
    if (sortBy === "controversial") {
      // High downvotes + high upvotes = controversial
      const controversyA = Math.min(a.upvotes ?? 0, a.downvotes ?? 0);
      const controversyB = Math.min(b.upvotes ?? 0, b.downvotes ?? 0);
      return controversyB - controversyA;
    }
    return 0;
  });

  // After submitting a review, check for new badges
  const handleSubmitted = async () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);

    if (user) {
      try {
        const stats        = await getUserStats(user.uid);
        const earned       = computeEarnedBadges(stats);
        const existing     = stats?.badges ?? [];
        const unlocked     = computeNewBadges(stats, existing);
        if (unlocked.length > 0) {
          setNewBadges(unlocked);
          await saveUserBadges(user.uid, earned.map(b => b.id));
        }
      } catch { /* non-fatal */ }
    }
  };

  if (!r) {
    return (
      <div style={{
        background: T.bg, minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: T.fontDisplay, fontSize: 22, color: T.inkMid, fontStyle: "italic" }}>
            Loading restaurant…
          </p>
          <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.inkLow, marginTop: 8 }}>
            <span style={{ color: T.accent, cursor: "pointer" }} onClick={() => navigate("/")}>
              ← Go back home
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>

      {/* ── Badge unlock toasts ── */}
      <div style={{
        position: "fixed",
        bottom: 24, right: 24,
        zIndex: 300,
        display: "flex", flexDirection: "column", gap: 10,
        alignItems: "flex-end",
      }}>
        {newBadges.map(badge => (
          <BadgeUnlockToast
            key={badge.id}
            badge={badge}
            onDismiss={() => dismissBadge(badge.id)}
          />
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none", border: "none", padding: 0,
            fontFamily: T.fontBody,
            color: T.inkLow, fontSize: 12,
            fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: 40, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = T.accent}
          onMouseLeave={e => e.currentTarget.style.color = T.inkLow}
        >
          ← All Restaurants
        </button>

        {/* ── Restaurant header ── */}
        <div style={{
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: 32, marginBottom: 32,
        }}>
          <div style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", gap: 16, marginBottom: 12,
          }}>
            <h1 style={{
              fontFamily:    T.fontDisplay,
              fontSize:      "clamp(32px, 5vw, 52px)",
              fontWeight:    700,
              color:         T.ink,
              lineHeight:    1.1,
              letterSpacing: "-0.02em",
              margin:        0,
            }}>
              {r.name}
            </h1>
            <VerdictBadge hypeScore={r.hypeScore} realityScore={r.realityScore} large />
          </div>

          <div style={{
            display: "flex", gap: 12,
            alignItems: "center", flexWrap: "wrap",
            marginBottom: 12,
          }}>
            {[r.neighborhood, r.cuisine, r.city].filter(Boolean).map((item, i, arr) => (
              <span key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  fontFamily:    T.fontBody,
                  fontSize:      12,
                  color:         T.inkLow,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  {item}
                </span>
                {i < arr.length - 1 && <span style={{ color: T.border }}>·</span>}
              </span>
            ))}
          </div>

          {r.address      && <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.inkLow, marginBottom: 4 }}>📍 {r.address}</p>}
          {r.openingHours && <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.inkLow }}>🕐 {r.openingHours}</p>}
        </div>

        {/* ── Community verdict ── */}
        <div style={{
          background:   T.bgRaised,
          border:       `1px solid ${T.border}`,
          borderRadius: 12,
          padding:      "28px",
          marginBottom: 40,
        }}>
          <p style={{
            fontFamily:    T.fontBody,
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         T.inkLow,
            marginBottom:  20,
          }}>
            Community Verdict
          </p>
          <HypeGauge hypeScore={r.hypeScore} realityScore={r.realityScore} />
          <p style={{ fontFamily: T.fontBody, fontSize: 12, color: T.inkLow, marginTop: 16 }}>
            Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ── Reviews section header ── */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          marginBottom:   24,
          flexWrap:       "wrap",
          gap:            12,
        }}>
          <h2 style={{
            fontFamily:    T.fontDisplay,
            fontSize:      28,
            fontWeight:    700,
            color:         T.ink,
            margin:        0,
          }}>
            Community Reviews
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: T.fontBody, fontSize: 13, color: T.inkLow }}>
              {reviews.length} total
            </span>
            <SortControl value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* ── Success toast (inline) ── */}
        {showSuccess && (
          <div style={{
            background:   "#4ade8010",
            border:       `1px solid #4ade8035`,
            borderRadius: 8,
            padding:      "12px 18px",
            marginBottom: 20,
            display:      "flex",
            alignItems:   "center",
            gap:          10,
          }}>
            <span style={{ color: T.worthy, fontSize: 16 }}>✦</span>
            <span style={{
              fontFamily: T.fontBody,
              fontSize: 13, fontWeight: 600,
              color: T.worthy,
            }}>
              Review submitted! Your voice is now part of the community verdict.
            </span>
          </div>
        )}

        {/* ── Review form or sign-in prompt ── */}
        {user ? (
          <AddReviewForm
            restaurantId={id}
            user={user}
            onSubmitted={handleSubmitted}
          />
        ) : (
          <div style={{
            border:       `1px solid ${T.border}`,
            borderRadius: 12,
            padding:      "32px",
            textAlign:    "center",
            marginBottom: 32,
            background:   T.bgRaised,
          }}>
            <p style={{
              fontFamily: T.fontDisplay,
              fontSize:   20, color: T.ink, marginBottom: 8,
            }}>
              Have you been here?
            </p>
            <p style={{
              fontFamily: T.fontBody,
              fontSize:   13, color: T.inkLow, marginBottom: 22,
            }}>
              Sign in to share your experience and earn badges for your contributions.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => navigate(`/login?redirect=/restaurant/${id}`)}
                style={{
                  padding:      "10px 26px",
                  background:   T.accent,
                  color:        "#0c0905",
                  border:       "none",
                  borderRadius: 7,
                  fontFamily:   T.fontBody,
                  fontSize:     13, fontWeight: 700,
                  cursor:       "pointer",
                  transition:   "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.accentHi}
                onMouseLeave={e => e.currentTarget.style.background = T.accent}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate(`/signup?redirect=/restaurant/${id}`)}
                style={{
                  padding:      "10px 26px",
                  background:   "none",
                  color:        T.inkMid,
                  border:       `1px solid ${T.border}`,
                  borderRadius: 7,
                  fontFamily:   T.fontBody,
                  fontSize:     13, fontWeight: 600,
                  cursor:       "pointer",
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* ── Reviews list ── */}
        {sortedReviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{
              fontFamily: T.fontDisplay,
              fontSize:   22, color: T.inkMid, fontStyle: "italic", marginBottom: 8,
            }}>
              No reviews yet.
            </p>
            <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.inkLow }}>
              Be the first to share your experience.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                reviewId={review._id}
                restaurantId={id}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}