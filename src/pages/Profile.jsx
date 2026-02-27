import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";

const T = {
  bg:          "#0e0c0b",
  bgCard:      "#141210",
  bgCardHover: "#1a1714",
  ink:         "#f2ede6",
  inkMid:      "#a8998a",
  inkFaint:    "#4a4540",
  accent:      "#c1392b",
  worthy:      "#4a7c59",
  fontDisplay: "'Cormorant Garamond', Georgia, serif",
  fontBody:    "'Outfit', sans-serif",
  border:      "1px solid rgba(242,237,230,0.07)",
};

function getRepTier(accountCreatedTimestamp) {
  const days = Math.floor(
    (Date.now() - accountCreatedTimestamp) / (1000 * 60 * 60 * 24)
  );
  if (days < 30)  return { label: "New Member", color: T.inkMid,  days, icon: "◎" };
  if (days < 180) return { label: "Regular",    color: "#7aa3e0", days, icon: "◈" };
  return           { label: "Veteran",           color: "#d4a843", days, icon: "◆" };
}

function formatJoinDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function VerdictChip({ verdict }) {
  const map = {
    worthy:    { label: "Worth the Hype", bg: "rgba(74,124,89,0.15)",  color: T.worthy  },
    overhyped: { label: "Overhyped",      bg: "rgba(139,58,42,0.15)",  color: "#e07060" },
    expected:  { label: "As Expected",    bg: "rgba(168,153,138,0.1)", color: T.inkMid  },
  };
  const v = map[verdict] || map.expected;
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
        fontFamily: T.fontBody, fontSize: 11, color: T.inkMid, letterSpacing: "0.05em",
      }}>
        <span style={{ textTransform: "uppercase" }}>{label}</span>
        <span style={{ color: T.ink, fontWeight: 600 }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(value / 10) * 100}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function ReviewCard({ review, index }) {
  const [hovered, setHovered] = useState(false);
  const date = new Date(review.date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const positive    = review.delta >= 0;
  const borderColor = review.delta >= 0.5  ? T.worthy
                    : review.delta <= -0.5 ? "#8b3a2a"
                    : T.inkFaint;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   hovered ? T.bgCardHover : T.bgCard,
        border:       T.border,
        borderLeft:   `3px solid ${borderColor}`,
        borderRadius: 8,
        padding:      "20px 24px",
        transition:   "background 0.2s ease",
        position:     "relative",
        overflow:     "hidden",
      }}
    >
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
        justifyContent: "space-between",
        marginBottom: 12, gap: 12, flexWrap: "wrap",
      }}>
        <div>
          <div style={{
            fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 700,
            color: T.ink, lineHeight: 1.1, marginBottom: 4,
          }}>
            {review.restaurantName}
          </div>
          <div style={{
            fontFamily: T.fontBody, fontSize: 12, color: T.inkMid,
            display: "flex", gap: 8, alignItems: "center",
          }}>
            <span>{review.neighborhood}</span>
            <span style={{ color: T.inkFaint }}>·</span>
            <span>{review.cuisine}</span>
            <span style={{ color: T.inkFaint }}>·</span>
            <span>{date}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <span style={{
            fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 700,
            color: positive ? T.worthy : "#e07060",
          }}>
            {positive ? "+" : ""}{review.delta.toFixed(1)}
          </span>
          <VerdictChip verdict={review.verdict} />
        </div>
      </div>

      <div style={{ marginBottom: 14, maxWidth: 260 }}>
        <ScoreBar label="Hype"    value={review.hypeScore}    color={T.accent} />
        <ScoreBar label="Reality" value={review.realityScore} color={T.worthy} />
      </div>

      <p style={{
        fontFamily: T.fontBody, fontSize: 14, color: T.ink,
        lineHeight: 1.7, margin: "0 0 14px",
      }}>
        {review.text}
      </p>

      <div style={{ fontFamily: T.fontBody, fontSize: 12, color: T.inkMid }}>
        ▲ {review.upvotes} helpful
      </div>
    </div>
  );
}

function StatBox({ value, label, accent }) {
  return (
    <div style={{
      background: T.bgCard, border: T.border,
      borderRadius: 8, padding: "20px 24px",
      flex: 1, minWidth: 110,
    }}>
      <div style={{
        fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 700,
        color: accent || T.ink, lineHeight: 1, marginBottom: 6,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: T.fontBody, fontSize: 11, color: T.inkMid,
        letterSpacing: "0.07em", textTransform: "uppercase",
      }}>
        {label}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews]         = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeTab, setActiveTab]     = useState("reviews");

  // If not logged in, send to login page
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Fetch this user's reviews from Firebase
  useEffect(() => {
    if (!user) return;

    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const snap = await get(ref(db, `reviews`));
        if (snap.exists()) {
          const allReviews = [];
          // reviews are stored as reviews/{restaurantId}/{reviewId}
          snap.forEach((restaurantSnap) => {
            restaurantSnap.forEach((reviewSnap) => {
              const r = reviewSnap.val();
              // only include reviews written by the logged-in user
              if (r.userId === user.uid) {
                allReviews.push({ id: reviewSnap.key, ...r });
              }
            });
          });
          // sort newest first
          allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
          setReviews(allReviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
      }
      setReviewsLoading(false);
    };

    fetchReviews();
  }, [user]);

  // Show loading spinner while auth is resolving
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: T.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.fontBody, color: T.inkMid, fontSize: 14,
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  // accountCreated is stored as a timestamp (Date.now()) in your Firebase
  const tier = getRepTier(user.accountCreated);

  const worthyCount    = reviews.filter(r => r.delta >= 0.5).length;
  const overhypedCount = reviews.filter(r => r.delta <= -0.5).length;
  const expectedCount  = reviews.length - worthyCount - overhypedCount;
  const avgDelta       = reviews.length > 0
    ? reviews.reduce((a, r) => a + r.delta, 0) / reviews.length
    : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: T.fontBody,
      paddingTop: 72,
      paddingBottom: 80,
    }}>

      <div style={{
        height: 2,
        background: `linear-gradient(90deg, ${T.accent} 0%, transparent 100%)`,
      }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>

        {/* PROFILE HEADER */}
        <div style={{
          paddingTop: 48, paddingBottom: 32,
          borderBottom: T.border, marginBottom: 36,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>

            {/* Avatar — shows photo if Google login, otherwise initials */}
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  flexShrink: 0, border: "2px solid rgba(193,57,43,0.3)",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.accent} 0%, #8b1c0f 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 700, color: T.ink,
                flexShrink: 0, border: "2px solid rgba(193,57,43,0.3)",
              }}>
                {user.displayName
                  ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase()
                  : "?"}
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
                  {user.displayName || user.email}
                </h1>
                <span style={{
                  fontFamily: T.fontBody, fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "4px 10px", borderRadius: 4,
                  border: `1px solid ${tier.color}40`,
                  color: tier.color,
                  background: `${tier.color}12`,
                }}>
                  {tier.icon} {tier.label}
                </span>
              </div>

              <div style={{
                fontFamily: T.fontBody, fontSize: 13, color: T.inkMid,
                display: "flex", gap: 12, flexWrap: "wrap",
                alignItems: "center", marginBottom: 14,
              }}>
                <span>{user.email}</span>
                <span style={{ color: T.inkFaint }}>·</span>
                <span>Member since {formatJoinDate(user.accountCreated)}</span>
                <span style={{ color: T.inkFaint }}>·</span>
                <span>{tier.days} days in the community</span>
              </div>

              {/* New → Regular → Veteran progress bar */}
              <div style={{ maxWidth: 320 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontFamily: T.fontBody, fontSize: 10, color: T.inkFaint,
                  marginBottom: 5, letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  <span>New</span>
                  <span>Regular</span>
                  <span>Veteran</span>
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

        {/* STAT BOXES */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
          <StatBox value={reviews.length}        label="Reviews Written" />
          <StatBox value={user.upvotesReceived || 0} label="Upvotes Received" accent={T.worthy} />
          <StatBox value={worthyCount}           label="Worth the Hype"   accent={T.worthy} />
          <StatBox value={overhypedCount}        label="Overhyped Calls"  accent="#e07060" />
        </div>

        {/* TABS */}
        <div style={{ display: "flex", borderBottom: T.border, marginBottom: 32 }}>
          {["reviews", "stats"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                borderBottom: activeTab === tab
                  ? `2px solid ${T.accent}`
                  : "2px solid transparent",
                padding: "12px 20px", marginBottom: -1,
                fontFamily: T.fontBody, fontSize: 13, letterSpacing: "0.04em",
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? T.ink : T.inkMid,
                transition: "all 0.15s ease",
              }}
            >
              {tab === "reviews" ? `Reviews (${reviews.length})` : "Stats"}
            </button>
          ))}
        </div>

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {reviewsLoading ? (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                color: T.inkMid, fontFamily: T.fontBody, fontSize: 14,
              }}>
                Loading your reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                color: T.inkMid, fontFamily: T.fontBody, fontSize: 14,
              }}>
                No reviews yet. Go eat something.
              </div>
            ) : (
              reviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))
            )}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div style={{
              background: T.bgCard, border: T.border,
              borderRadius: 8, padding: "28px",
            }}>
              <div style={{
                fontFamily: T.fontDisplay, fontSize: 18,
                fontWeight: 700, color: T.ink, marginBottom: 20,
              }}>
                Verdict Breakdown
              </div>
              {reviews.length === 0 ? (
                <div style={{ fontFamily: T.fontBody, fontSize: 13, color: T.inkMid }}>
                  Write some reviews to see your breakdown.
                </div>
              ) : (
                [
                  { label: "Worth the Hype", count: worthyCount,    color: T.worthy  },
                  { label: "Overhyped",      count: overhypedCount, color: "#e07060" },
                  { label: "As Expected",    count: expectedCount,  color: T.inkMid  },
                ].map(({ label, count, color }) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      fontFamily: T.fontBody, fontSize: 13,
                      color: T.inkMid, marginBottom: 6,
                    }}>
                      <span>{label}</span>
                      <span style={{ color: T.ink, fontWeight: 600 }}>
                        {count} / {reviews.length}
                      </span>
                    </div>
                    <div style={{
                      height: 6, background: "rgba(255,255,255,0.06)",
                      borderRadius: 3, overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${(count / reviews.length) * 100}%`,
                        background: color, borderRadius: 3,
                      }} />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{
              background: T.bgCard, border: T.border,
              borderRadius: 8, padding: "28px",
            }}>
              <div style={{
                fontFamily: T.fontDisplay, fontSize: 18,
                fontWeight: 700, color: T.ink, marginBottom: 6,
              }}>
                Average Delta
              </div>
              <div style={{
                fontFamily: T.fontBody, fontSize: 13,
                color: T.inkMid, marginBottom: 20,
              }}>
                How you score restaurants vs their hype, on average
              </div>
              {reviews.length === 0 ? (
                <div style={{ fontFamily: T.fontBody, fontSize: 13, color: T.inkMid }}>
                  No reviews yet.
                </div>
              ) : (
                <>
                  <div style={{
                    fontFamily: T.fontDisplay, fontSize: 52, fontWeight: 700,
                    color: avgDelta >= 0 ? T.worthy : "#e07060", lineHeight: 1,
                  }}>
                    {avgDelta >= 0 ? "+" : ""}{avgDelta.toFixed(2)}
                  </div>
                  <div style={{
                    fontFamily: T.fontBody, fontSize: 12,
                    color: T.inkMid, marginTop: 8,
                  }}>
                    across {reviews.length} reviews
                  </div>
                </>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
