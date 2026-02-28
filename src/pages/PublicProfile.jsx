import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { T } from "../tokens";

// ── Helpers ───────────────────────────────────────────────────────────────
function getRepTier(accountCreatedTimestamp) {
  if (!accountCreatedTimestamp) return { label: "New", color: T.inkLow, days: 0, icon: "◎" };
  const days = Math.floor((Date.now() - accountCreatedTimestamp) / 86400000);
  if (days < 30)  return { label: "New",     color: T.inkLow,  days, icon: "◎" };
  if (days < 180) return { label: "Regular", color: "#7aa3e0", days, icon: "◈" };
  return                  { label: "Veteran", color: "#d4a843", days, icon: "◆" };
}

function formatJoinDate(ts) {
  if (!ts) return "Unknown";
  return new Date(ts).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function VerdictChip({ delta }) {
  const verdict = delta >= 0.5 ? "worthy" : delta <= -0.5 ? "overhyped" : "expected";
  const map = {
    worthy:    { label: "Worth the Hype", bg: "rgba(74,124,89,0.15)",   color: T.worthy  },
    overhyped: { label: "Overhyped",      bg: "rgba(193,57,43,0.15)",   color: "#e07060" },
    expected:  { label: "As Expected",    bg: "rgba(168,153,138,0.1)",  color: T.inkLow  },
  };
  const v = map[verdict];
  return (
    <span style={{
      fontSize: 10, fontFamily: T.fontBody, fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "3px 8px", borderRadius: 3,
      background: v.bg, color: v.color,
    }}>
      {v.label}
    </span>
  );
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", marginBottom: 4,
        fontFamily: T.fontBody, fontSize: 11, color: T.inkLow,
        letterSpacing: "0.05em", textTransform: "uppercase",
      }}>
        <span>{label}</span>
        <span style={{ color: T.ink, fontWeight: 600 }}>{Number(value).toFixed(1)}</span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(value / 10) * 100}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function ReviewCard({ review, restaurantName, index }) {
  const navigate   = useNavigate();
  const [hov, setHov] = useState(false);
  const date       = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";
  const delta      = (review.realityGiven ?? 0) - (review.hypeGiven ?? 0);
  const positive   = delta >= 0;
  const borderCol  = delta >= 0.5 ? T.worthy : delta <= -0.5 ? "#8b3a2a" : T.border;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => review.restaurantId && navigate(`/restaurant/${review.restaurantId}`)}
      style={{
        background:   hov ? T.bgRaised : T.bgCard,
        border:       `1px solid ${T.border}`,
        borderLeft:   `3px solid ${borderCol}`,
        borderRadius: 8,
        padding:      "20px 24px",
        cursor:       review.restaurantId ? "pointer" : "default",
        transition:   "background 0.2s",
        position:     "relative", overflow: "hidden",
      }}
    >
      {/* Ghost index number */}
      <div style={{
        position: "absolute", top: -10, right: 12,
        fontFamily: T.fontDisplay, fontSize: 80, fontWeight: 700,
        color: "rgba(242,237,230,0.03)", lineHeight: 1,
        userSelect: "none", pointerEvents: "none",
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: 12, gap: 12, flexWrap: "wrap",
      }}>
        <div>
          <div style={{
            fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 700,
            color: T.ink, lineHeight: 1.1, marginBottom: 4,
          }}>
            {restaurantName || "Restaurant"}
          </div>
          <div style={{
            fontFamily: T.fontBody, fontSize: 12, color: T.inkLow,
            display: "flex", gap: 8, alignItems: "center",
          }}>
            <span>{date}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <span style={{
            fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 700,
            color: positive ? T.worthy : "#e07060",
          }}>
            {positive ? "+" : ""}{delta.toFixed(1)}
          </span>
          <VerdictChip delta={delta} />
        </div>
      </div>

      <div style={{ marginBottom: 14, maxWidth: 260 }}>
        <ScoreBar label="Hype"    value={review.hypeGiven ?? 0}    color={T.hype  ?? "#c1392b"} />
        <ScoreBar label="Reality" value={review.realityGiven ?? 0} color={T.worthy} />
      </div>

      {review.text && (
        <p style={{
          fontFamily: T.fontBody, fontSize: 14, color: T.ink,
          lineHeight: 1.7, margin: "0 0 12px", fontStyle: "italic",
        }}>
          "{review.text}"
        </p>
      )}

      <div style={{ fontFamily: T.fontBody, fontSize: 12, color: T.inkLow }}>
        ▲ {review.upvotes ?? 0} helpful
      </div>
    </div>
  );
}

function StatBox({ value, label, accent }) {
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: 8, padding: "20px 24px", flex: 1, minWidth: 110,
    }}>
      <div style={{
        fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 700,
        color: accent || T.ink, lineHeight: 1, marginBottom: 6,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: T.fontBody, fontSize: 11, color: T.inkLow,
        letterSpacing: "0.07em", textTransform: "uppercase",
      }}>
        {label}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function PublicProfile() {
  const { userId }      = useParams();
  const navigate        = useNavigate();
  const { user: me }    = useAuth();

  const [profileUser,   setProfileUser]   = useState(null);
  const [reviews,       setReviews]       = useState([]);
  const [restaurantMap, setRestaurantMap] = useState({});
  const [loading,       setLoading]       = useState(true);
  const [notFound,      setNotFound]      = useState(false);

  // If viewing own profile, redirect to /profile
  useEffect(() => {
    if (me && me.uid === userId) navigate("/profile", { replace: true });
  }, [me, userId, navigate]);

  // Load user record + all their reviews + restaurant names
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      setLoading(true);
      try {
        // 1. Get user record
        const userSnap = await get(ref(db, `users/${userId}`));
        if (!userSnap.exists()) { setNotFound(true); setLoading(false); return; }
        setProfileUser({ uid: userId, ...userSnap.val() });

        // 2. Collect all reviews belonging to this user
        const reviewsSnap = await get(ref(db, "reviews"));
        const userReviews = [];
        if (reviewsSnap.exists()) {
          reviewsSnap.forEach(restSnap => {
            restSnap.forEach(reviewSnap => {
              const r = reviewSnap.val();
              if (r.userId === userId) {
                userReviews.push({
                  id:           reviewSnap.key,
                  restaurantId: restSnap.key,
                  ...r,
                });
              }
            });
          });
        }
        userReviews.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setReviews(userReviews);

        // 3. Fetch restaurant names for each unique restaurantId
        const uniqueIds = [...new Set(userReviews.map(r => r.restaurantId))];
        const nameMap   = {};
        await Promise.all(
          uniqueIds.map(async rid => {
            const snap = await get(ref(db, `restaurants/${rid}`));
            if (snap.exists()) nameMap[rid] = snap.val().name ?? rid;
            else nameMap[rid] = rid;
          })
        );
        setRestaurantMap(nameMap);

      } catch (e) {
        console.error(e);
        setNotFound(true);
      }
      setLoading(false);
    };

    load();
  }, [userId]);

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: T.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.fontBody, color: T.inkLow, fontSize: 14,
      }}>
        Loading profile…
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────
  if (notFound || !profileUser) {
    return (
      <div style={{
        minHeight: "100vh", background: T.bg,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <p style={{ fontFamily: T.fontDisplay, fontSize: 28, color: T.ink }}>User not found</p>
        <button
          onClick={() => navigate("/")}
          style={{
            fontFamily: T.fontBody, fontSize: 13, color: T.inkLow,
            background: "none", border: "none", cursor: "pointer",
          }}
        >
          ← Back home
        </button>
      </div>
    );
  }

  const tier         = getRepTier(profileUser.accountCreated);
  const worthyCount  = reviews.filter(r => (r.realityGiven - r.hypeGiven) >= 0.5).length;
  const overhyped    = reviews.filter(r => (r.realityGiven - r.hypeGiven) <= -0.5).length;
  const avgDelta     = reviews.length
    ? reviews.reduce((a, r) => a + ((r.realityGiven ?? 0) - (r.hypeGiven ?? 0)), 0) / reviews.length
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, paddingTop: 72, paddingBottom: 80 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: 20, marginBottom: 32,
            background: "none", border: "none", cursor: "pointer",
            fontFamily: T.fontBody, fontSize: 12, color: T.inkLow,
            fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 6,
          }}
          onMouseEnter={e => e.currentTarget.style.color = T.accent}
          onMouseLeave={e => e.currentTarget.style.color = T.inkLow}
        >
          ← Back
        </button>

        {/* ── Profile header ── */}
        <div style={{
          paddingBottom: 32,
          borderBottom: `1px solid ${T.border}`,
          marginBottom: 36,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>

            {/* Avatar */}
            {profileUser.photoURL ? (
              <img
                src={profileUser.photoURL}
                alt="avatar"
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  flexShrink: 0, border: `2px solid ${T.accent}50`,
                  objectFit: "cover",
                }}
              />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.accent} 0%, #8b1c0f 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 700, color: T.ink,
                flexShrink: 0, border: `2px solid ${T.accent}50`,
              }}>
                {(profileUser.displayName || "?")[0].toUpperCase()}
              </div>
            )}

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{
                display: "flex", alignItems: "center",
                gap: 12, flexWrap: "wrap", marginBottom: 6,
              }}>
                <h1 style={{
                  fontFamily: T.fontDisplay, fontSize: 32,
                  fontWeight: 700, color: T.ink, margin: 0, lineHeight: 1,
                }}>
                  u/{profileUser.displayName || "Anonymous"}
                </h1>
                <span style={{
                  fontFamily: T.fontBody, fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "4px 10px", borderRadius: 4,
                  border: `1px solid ${tier.color}40`,
                  color: tier.color, background: `${tier.color}12`,
                }}>
                  {tier.icon} {tier.label}
                </span>
              </div>

              <div style={{
                fontFamily: T.fontBody, fontSize: 13, color: T.inkLow,
                display: "flex", gap: 12, flexWrap: "wrap",
                alignItems: "center", marginBottom: 14,
              }}>
                <span>Member since {formatJoinDate(profileUser.accountCreated)}</span>
                <span style={{ color: T.border }}>·</span>
                <span>{tier.days} days in the community</span>
              </div>

              {/* Progression bar */}
              <div style={{ maxWidth: 320 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontFamily: T.fontBody, fontSize: 10, color: T.inkLow,
                  marginBottom: 5, letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  <span>New</span><span>Regular</span><span>Veteran</span>
                </div>
                <div style={{
                  height: 3, background: "rgba(255,255,255,0.06)",
                  borderRadius: 2, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min((tier.days / 180) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${T.accent}, ${tier.color})`,
                    borderRadius: 2,
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
          <StatBox value={reviews.length} label="Reviews Written" />
          <StatBox value={worthyCount}    label="Worth the Hype"  accent={T.worthy} />
          <StatBox value={overhyped}      label="Overhyped Calls" accent="#e07060" />
          <StatBox
            value={`${avgDelta >= 0 ? "+" : ""}${avgDelta.toFixed(1)}`}
            label="Avg Delta"
            accent={avgDelta >= 0 ? T.worthy : "#e07060"}
          />
        </div>

        {/* ── Reviews ── */}
        <h2 style={{
          fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 700,
          color: T.ink, marginBottom: 20,
        }}>
          Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            fontFamily: T.fontBody, fontSize: 14, color: T.inkLow,
          }}>
            No reviews yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {reviews.map((review, i) => (
              <ReviewCard
                key={review.id}
                review={review}
                restaurantName={restaurantMap[review.restaurantId]}
                index={i}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}