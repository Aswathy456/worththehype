import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HypeGauge from "./HypeGauge";
import VerdictBadge from "./VerdictBadge";
import { T } from "../tokens";

// ── Platform config ────────────────────────────────────────────────────────────
const PLATFORMS = {
  instagram: { label: "Instagram", icon: "📸", color: "#E1306C" },
  youtube:   { label: "YouTube",   icon: "▶",  color: "#FF0000" },
  tiktok:    { label: "TikTok",    icon: "🎵", color: "#69C9D0" },
  blog:      { label: "Blog",      icon: "📝", color: "#a8998a" },
  zomato:    { label: "Zomato",    icon: "🍴", color: "#E23744" },
  swiggy:    { label: "Swiggy",    icon: "🛵", color: "#FC8019" },
};

// Stable platform assigned from restaurant id
function getPlatform(id) {
  const keys = Object.keys(PLATFORMS);
  const idx  = Math.abs(
    String(id).split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  ) % keys.length;
  return PLATFORMS[keys[idx]];
}

// Stable reviewer assigned from restaurant id
const REVIEWERS = [
  { name: "Meera Pillai",   followers: "142K followers",   verified: true  },
  { name: "Arjun Nair",     followers: "89K subscribers",  verified: true  },
  { name: "Lakshmi Varma",  followers: "54K followers",    verified: false },
  { name: "Rahul Krishnan", followers: "200K subscribers", verified: true  },
  { name: "Priya Suresh",   followers: "31K followers",    verified: false },
  { name: "Ananya Thomas",  followers: "77K followers",    verified: true  },
];

function getReviewer(id) {
  const idx = Math.abs(
    String(id).split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  ) % REVIEWERS.length;
  return REVIEWERS[idx];
}

function getInitials(name = "") {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function avatarGradient(name = "") {
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `linear-gradient(135deg, hsl(${hue},50%,32%) 0%, hsl(${(hue+40)%360},55%,22%) 100%)`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function RestaurantCard({ restaurant, index }) {
  const { id, name, neighborhood, cuisine, hypeScore, realityScore, reviews } = restaurant;
  const navigate  = useNavigate();
  const [hovered, setHovered] = useState(false);

  const platform = getPlatform(id);
  const reviewer = getReviewer(id);

  return (
    <article
      onClick={() => navigate(`/restaurant/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    hovered ? T.bgCard : T.bgRaised,
        border:        `1px solid ${hovered ? T.borderMid : T.border}`,
        borderRadius:  10,
        padding:       "26px",
        cursor:        "pointer",
        transition:    "all 0.22s ease",
        display:       "flex",
        flexDirection: "column",
        gap:           22,
        position:      "relative",
        overflow:      "hidden",
        transform:     hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow:     hovered ? "0 12px 40px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* ── Watermark index — UNCHANGED ── */}
      <span style={{
        position: "absolute", top: 14, right: 18,
        fontFamily: T.fontDisplay, fontSize: 80, fontWeight: 700,
        color: hovered ? T.border : `${T.border}80`,
        lineHeight: 1, userSelect: "none",
        transition: "color 0.22s", pointerEvents: "none",
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* ── Accent line on hover — UNCHANGED ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${T.accent}, ${T.accentHi})`,
        opacity: hovered ? 1 : 0, transition: "opacity 0.22s",
      }} />

      {/* ── NEW: Platform pill — sits above the name ── */}
      <div style={{
        position: "absolute", top: 14, left: 20,
        display: "flex", alignItems: "center", gap: 4,
        background: `${platform.color}15`,
        border: `1px solid ${platform.color}35`,
        borderRadius: 5, padding: "3px 8px",
        fontSize: 10, fontWeight: 700,
        color: platform.color, letterSpacing: "0.05em",
        fontFamily: T.fontBody,
        opacity: hovered ? 1 : 0.65,
        transition: "opacity 0.22s",
      }}>
        <span style={{ fontSize: 11 }}>{platform.icon}</span>
        {platform.label}
      </div>

      {/* ── Header — unchanged except paddingTop to clear the platform pill ── */}
      <div style={{ paddingRight: 60, paddingTop: 24 }}>
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: 12, marginBottom: 10,
        }}>
          <h2 style={{
            fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 700,
            color: T.ink, lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0,
          }}>
            {name}
          </h2>
          <VerdictBadge hypeScore={hypeScore} realityScore={realityScore} />
        </div>

        {/* Meta pills — UNCHANGED */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[neighborhood, cuisine].map((label, i) => (
            <span key={label} style={{
              fontFamily: T.fontBody, fontSize: 10, fontWeight: 600,
              color: T.inkLow, letterSpacing: "0.08em", textTransform: "uppercase",
              ...(i === 0 ? {} : { paddingLeft: 8, borderLeft: `1px solid ${T.border}` }),
            }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── HypeGauge — UNCHANGED ── */}
      <HypeGauge hypeScore={hypeScore} realityScore={realityScore} />

      {/* ── NEW: Reviewer row ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
      }}>
        {/* Avatar */}
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
          background: avatarGradient(reviewer.name),
          border: `1.5px solid ${platform.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: T.fontDisplay, fontSize: 10, fontWeight: 700, color: "#f2ede6",
        }}>
          {getInitials(reviewer.name)}
        </div>

        {/* Name + followers */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{
              fontFamily: T.fontBody, fontSize: 12, fontWeight: 600,
              color: T.ink, overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap", maxWidth: 130,
            }}>
              {reviewer.name}
            </span>
            {reviewer.verified && (
              <span style={{
                fontSize: 9, color: platform.color,
                background: `${platform.color}18`,
                border: `1px solid ${platform.color}30`,
                borderRadius: 3, padding: "1px 4px",
                fontWeight: 700, fontFamily: T.fontBody, flexShrink: 0,
              }}>
                ✓
              </span>
            )}
          </div>
          <div style={{ fontFamily: T.fontBody, fontSize: 10, color: T.inkLow, marginTop: 1 }}>
            {reviewer.followers}
          </div>
        </div>

        {/* Platform icon — large, faded */}
        <span style={{
          fontSize: 18,
          opacity: hovered ? 0.9 : 0.5,
          filter: hovered ? "none" : "grayscale(0.4)",
          transition: "all 0.22s",
        }}>
          {platform.icon}
        </span>
      </div>

      {/* ── Footer — UNCHANGED structure, CTA enhanced on hover ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 16, borderTop: `1px solid ${T.border}`, marginTop: -4,
      }}>
        <span style={{
          fontFamily: T.fontBody, fontSize: 11,
          color: T.inkLow, letterSpacing: "0.03em",
        }}>
          {reviews.toLocaleString()} community reviews
        </span>

        {hovered ? (
          <span style={{
            fontFamily: T.fontBody, fontSize: 11, fontWeight: 700,
            color: "#fff", background: T.accent,
            padding: "5px 12px", borderRadius: 6, letterSpacing: "0.04em",
          }}>
            Read full review →
          </span>
        ) : (
          <span style={{
            fontFamily: T.fontBody, fontSize: 11, fontWeight: 600,
            color: T.inkMid, letterSpacing: "0.04em", transition: "color 0.2s",
          }}>
            Read more →
          </span>
        )}
      </div>
    </article>
  );
}
