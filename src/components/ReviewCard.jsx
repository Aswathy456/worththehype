import { useState, useEffect } from "react";
import { T } from "../tokens";
import { voteOnReview, getUserVote, getUserStats } from "../services/reviewService";
import { computeEarnedBadges } from "../services/badgeService";
import { BadgeRow } from "./UserBadges";
import CredibilityTag from "./CredibilityTag";

// ── Reputation colours ────────────────────────────────────────────────────
const REP = {
  New:     { color: T.inkLow,  bg: T.bgRaised  },
  Regular: { color: "#4a7c8a", bg: "rgba(74,124,138,0.12)"  },
  Veteran: { color: "#c17c2b", bg: "rgba(193,124,43,0.12)"  },
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

function avatarGradient(name = "") {
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `linear-gradient(135deg, hsl(${hue},45%,28%) 0%, hsl(${(hue + 50) % 360},50%,18%) 100%)`;
}

// ── Vote button ───────────────────────────────────────────────────────────
function VoteButton({ direction, active, count, onClick, disabled }) {
  const [pressed, setPressed] = useState(false);
  const isUp = direction === "up";

  const activeColor = isUp ? T.accent : T.hype;
  const activeGlow  = isUp ? `${T.accent}35` : `${T.hype}35`;
  const icon        = isUp ? "▲" : "▼";

  return (
    <button
      onClick={() => {
        if (disabled) return;
        setPressed(true);
        setTimeout(() => setPressed(false), 180);
        onClick();
      }}
      title={disabled ? "Sign in to vote" : isUp ? "Upvote" : "Downvote"}
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap:            3,
        width:          36,
        padding:        "8px 0",
        background:     active ? `${activeColor}15` : "transparent",
        border:         `1.5px solid ${active ? activeColor : T.border}`,
        borderRadius:   8,
        cursor:         disabled ? "not-allowed" : "pointer",
        opacity:        disabled ? 0.45 : 1,
        transition:     "all 0.15s",
        transform:      pressed ? "scale(0.88)" : "scale(1)",
        boxShadow:      active ? `0 0 10px ${activeGlow}` : "none",
        outline:        "none",
      }}
      onMouseEnter={e => {
        if (!active && !disabled) {
          e.currentTarget.style.borderColor = activeColor;
          e.currentTarget.style.background  = `${activeColor}0d`;
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.background  = "transparent";
        }
      }}
    >
      <span style={{
        fontSize:   12,
        color:      active ? activeColor : T.inkLow,
        lineHeight: 1,
        transition: "color 0.15s",
      }}>
        {icon}
      </span>
      <span style={{
        fontFamily: T.fontMono,
        fontSize:   11,
        fontWeight: 700,
        color:      active ? activeColor : T.inkMid,
        lineHeight: 1,
        transition: "color 0.15s",
        minWidth:   16,
        textAlign:  "center",
      }}>
        {count}
      </span>
    </button>
  );
}

// ── Main ReviewCard ───────────────────────────────────────────────────────
export default function ReviewCard({ review, reviewId, restaurantId, currentUser, credibility, credibilityLoading }) {
  const {
    uid, displayName, accountCreated,
    hypeGiven, realityGiven, text,
    upvotes = 0, downvotes = 0, score = 0,
    createdAt,
  } = review;

  const reputation  = reputationFromAge(accountCreated);
  const { color, bg } = REP[reputation];
  const delta       = realityGiven - hypeGiven;
  const deltaPos    = delta >= 0;
  const date        = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  // ── Local vote state ──────────────────────────────────────────────────
  const [localUpvotes,   setLocalUpvotes]   = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [myVote,         setMyVote]         = useState(0); // 1 | -1 | 0
  const [voting,         setVoting]         = useState(false);

  // ── Author badges ─────────────────────────────────────────────────────
  const [authorBadges, setAuthorBadges] = useState([]);

  // ── Collapse if heavily downvoted ─────────────────────────────────────
  const netScore      = localUpvotes - localDownvotes;
  const isControversial = netScore <= -3;
  const [collapsed,   setCollapsed]   = useState(false);

  // Sync collapse when score drops
  useEffect(() => {
    if (isControversial) setCollapsed(true);
  }, [isControversial]);

  // Fetch user's existing vote + author stats on mount
  useEffect(() => {
    let alive = true;
    async function load() {
      if (currentUser && reviewId) {
        const v = await getUserVote(restaurantId, reviewId, currentUser.uid);
        if (alive) setMyVote(v);
      }
      if (uid) {
        const stats = await getUserStats(uid);
        if (stats && alive) setAuthorBadges(computeEarnedBadges(stats));
      }
    }
    load();
    return () => { alive = false; };
  }, [reviewId, restaurantId, currentUser, uid]);

  // ── Handle vote ───────────────────────────────────────────────────────
  async function handleVote(value) {
    if (!currentUser || voting || !reviewId) return;
    setVoting(true);

    const prev = myVote;

    // Optimistic UI update
    if (prev === value) {
      // Toggle off
      setMyVote(0);
      if (value ===  1) setLocalUpvotes(v => v - 1);
      if (value === -1) setLocalDownvotes(v => v - 1);
    } else {
      // Switch or fresh vote
      setMyVote(value);
      if (value ===  1) {
        setLocalUpvotes(v => v + 1);
        if (prev === -1) setLocalDownvotes(v => v - 1);
      } else {
        setLocalDownvotes(v => v + 1);
        if (prev === 1) setLocalUpvotes(v => v - 1);
      }
    }

    try {
      await voteOnReview(restaurantId, reviewId, currentUser.uid, value);
    } catch {
      // Revert on failure
      setMyVote(prev);
      setLocalUpvotes(upvotes);
      setLocalDownvotes(downvotes);
    }
    setVoting(false);
  }

  // ── Collapsed state ───────────────────────────────────────────────────
  if (collapsed) {
    return (
      <div style={{
        border:       `1px solid ${T.border}`,
        borderRadius: 8,
        padding:      "12px 16px",
        background:   T.bgRaised,
        display:      "flex",
        alignItems:   "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: T.inkLow, fontFamily: T.fontBody }}>
            ▼ Collapsed — low score ({netScore})
          </span>
          <span style={{ fontSize: 11, color: T.inkMid, fontFamily: T.fontBody }}>
            u/{displayName}
          </span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: "none", border: `1px solid ${T.border}`,
            borderRadius: 5, padding: "3px 10px",
            fontSize: 11, color: T.inkLow,
            cursor: "pointer", fontFamily: T.fontBody,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = T.accent;
            e.currentTarget.style.color = T.accent;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = T.border;
            e.currentTarget.style.color = T.inkLow;
          }}
        >
          Show anyway
        </button>
      </div>
    );
  }

  // ── Full card ─────────────────────────────────────────────────────────
  return (
    <div style={{
      border:       `1px solid ${T.border}`,
      borderRadius: 10,
      background:   T.bgCard,
      overflow:     "hidden",
      transition:   "border-color 0.2s",
    }}>
      {/* Left vote rail + content */}
      <div style={{ display: "flex" }}>

        {/* ── Vote rail ── */}
        <div style={{
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          gap:            4,
          padding:        "16px 10px",
          background:     T.bgRaised,
          borderRight:    `1px solid ${T.border}`,
          minWidth:       52,
        }}>
          <VoteButton
            direction="up"
            active={myVote === 1}
            count={localUpvotes}
            onClick={() => handleVote(1)}
            disabled={!currentUser || voting}
          />

          {/* Net score */}
          <span style={{
            fontFamily:  T.fontMono,
            fontSize:    13,
            fontWeight:  700,
            color:       netScore > 0 ? T.accent : netScore < 0 ? T.hype : T.inkLow,
            lineHeight:  1,
            minWidth:    24,
            textAlign:   "center",
            padding:     "2px 0",
          }}>
            {netScore > 0 ? `+${netScore}` : netScore}
          </span>

          <VoteButton
            direction="down"
            active={myVote === -1}
            count={localDownvotes}
            onClick={() => handleVote(-1)}
            disabled={!currentUser || voting}
          />
        </div>

        {/* ── Review content ── */}
        <div style={{ flex: 1, padding: "16px 20px" }}>

          {/* Header row */}
          <div style={{
            display:        "flex",
            alignItems:     "flex-start",
            justifyContent: "space-between",
            marginBottom:   14,
            gap:            12,
          }}>
            {/* Avatar + user info */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width:          34,
                height:         34,
                borderRadius:   "50%",
                background:     avatarGradient(displayName),
                border:         `1.5px solid ${T.borderMid}`,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontFamily:     T.fontDisplay,
                fontSize:       13,
                fontWeight:     700,
                color:          "#f2ede6",
                flexShrink:     0,
              }}>
                {(displayName || "?")[0].toUpperCase()}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: T.fontBody,
                    fontSize:   13,
                    fontWeight: 700,
                    color:      T.ink,
                  }}>
                    u/{displayName}
                  </span>
                  <span style={{
                    fontFamily:    T.fontBody,
                    fontSize:      9,
                    fontWeight:    700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color,
                    background:    bg,
                    padding:       "2px 6px",
                    borderRadius:  3,
                  }}>
                    {reputation}
                  </span>
                  {/* Author's top badges */}
                  {authorBadges.length > 0 && (
                    <BadgeRow badges={authorBadges} max={3} />
                  )}
                </div>
                <p style={{
                  fontFamily: T.fontBody,
                  fontSize:   11,
                  color:      T.inkLow,
                  marginTop:  2,
                }}>
                  {accountAgeLabel(accountCreated)} account · {date}
                </p>
              </div>
            </div>

            {/* Scores */}
            <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
              {[
                ["Hype",    hypeGiven,    T.hype],
                ["Reality", realityGiven, deltaPos ? T.worthy : T.accent],
              ].map(([label, val, col]) => (
                <div key={label} style={{ textAlign: "right" }}>
                  <p style={{
                    fontFamily:    T.fontBody,
                    fontSize:      9,
                    color:         T.inkLow,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom:  2,
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontFamily: T.fontDisplay,
                    fontSize:   22,
                    fontWeight: 700,
                    color:      col,
                    lineHeight: 1,
                  }}>
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delta pill + credibility tag row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          6,
              background:   deltaPos ? "#4ade8010" : "#f8717110",
              border:       `1px solid ${deltaPos ? "#4ade8030" : "#f8717130"}`,
              borderRadius: 5,
              padding:      "3px 10px",
            }}>
              <span style={{
                fontFamily: T.fontMono,
                fontSize:   11,
                fontWeight: 700,
                color:      deltaPos ? T.worthy : T.hype,
              }}>
                {deltaPos ? "+" : ""}{delta.toFixed(1)}
              </span>
              <span style={{
                fontFamily:    T.fontBody,
                fontSize:      9,
                fontWeight:    600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:         deltaPos ? T.worthy : T.hype,
                opacity:       0.8,
              }}>
                {deltaPos ? "Worth It" : "Overhyped"}
              </span>
            </div>

            <CredibilityTag credibility={credibility} loading={credibilityLoading} />
          </div>

          {/* Review text */}
          <p style={{
            fontFamily:  T.fontDisplay,
            fontSize:    15,
            fontStyle:   "italic",
            color:       T.inkMid,
            lineHeight:  1.8,
            borderLeft:  `2px solid ${T.border}`,
            paddingLeft: 14,
            margin:      0,
          }}>
            "{text}"
          </p>

          {/* Sign-in nudge if not logged in */}
          {!currentUser && (
            <p style={{
              fontFamily: T.fontBody,
              fontSize:   11,
              color:      T.inkLow,
              marginTop:  12,
              fontStyle:  "italic",
            }}>
              Sign in to vote on this review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}