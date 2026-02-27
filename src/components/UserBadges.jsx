import { useState } from "react";
import { TIER_STYLES } from "../services/badgeService";
import { T } from "../tokens";

// ── Single badge pill ─────────────────────────────────────────────────────
// mode: "full" (icon + label) | "icon" (just icon, hover tooltip) | "mini" (tiny pill)
export function BadgePill({ badge, mode = "full" }) {
  const [hovered, setHovered] = useState(false);
  const style = TIER_STYLES[badge.tier];

  if (mode === "icon") {
    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: 28, height: 28,
            borderRadius: 7,
            background: style.bg,
            border: `1px solid ${style.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, cursor: "default",
            transition: "box-shadow 0.2s",
            boxShadow: hovered ? `0 0 10px ${style.glow}` : "none",
          }}
        >
          {badge.icon}
        </div>
        {hovered && (
          <div style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: T.bgCard,
            border: `1px solid ${style.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            zIndex: 200,
            whiteSpace: "nowrap",
            boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 12px ${style.glow}`,
            pointerEvents: "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: 14 }}>{badge.icon}</span>
              <span style={{
                fontFamily: T.fontBody,
                fontSize: 12, fontWeight: 700,
                color: style.color,
              }}>
                {badge.label}
              </span>
              <span style={{
                fontFamily: T.fontBody,
                fontSize: 9, fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: style.color,
                background: style.bg,
                border: `1px solid ${style.border}`,
                padding: "1px 5px", borderRadius: 3,
              }}>
                {style.label}
              </span>
            </div>
            <p style={{
              fontFamily: T.fontBody,
              fontSize: 11, color: T.inkMid,
              maxWidth: 180, lineHeight: 1.4,
              margin: 0,
            }}>
              {badge.description}
            </p>
            {/* Tooltip arrow */}
            <div style={{
              position: "absolute",
              top: "100%", left: "50%",
              transform: "translateX(-50%)",
              width: 0, height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: `5px solid ${style.border}`,
            }} />
          </div>
        )}
      </div>
    );
  }

  if (mode === "mini") {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        fontFamily: T.fontBody,
        fontSize: 9, fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: style.color,
        background: style.bg,
        border: `1px solid ${style.border}`,
        padding: "2px 6px", borderRadius: 4,
      }}>
        {badge.icon} {badge.label}
      </span>
    );
  }

  // "full" mode
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 10,
        padding: "10px 14px",
        transition: "all 0.2s",
        boxShadow: hovered ? `0 4px 16px ${style.glow}` : "none",
        cursor: "default",
      }}
    >
      <span style={{ fontSize: 20 }}>{badge.icon}</span>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{
            fontFamily: T.fontBody,
            fontSize: 13, fontWeight: 700,
            color: style.color,
          }}>
            {badge.label}
          </span>
          <span style={{
            fontFamily: T.fontBody,
            fontSize: 8, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: style.color, opacity: 0.7,
            background: `${style.color}18`,
            border: `1px solid ${style.border}`,
            padding: "1px 5px", borderRadius: 3,
          }}>
            {style.label}
          </span>
        </div>
        <p style={{
          fontFamily: T.fontBody,
          fontSize: 11, color: T.inkLow,
          margin: 0, lineHeight: 1.3,
        }}>
          {badge.description}
        </p>
      </div>
    </div>
  );
}

// ── Badge row (for ReviewCard — shows top 3 as icons) ────────────────────
export function BadgeRow({ badges, max = 3 }) {
  if (!badges?.length) return null;
  const shown = badges.slice(0, max);
  const extra = badges.length - shown.length;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {shown.map(b => <BadgePill key={b.id} badge={b} mode="icon" />)}
      {extra > 0 && (
        <span style={{
          fontFamily: T.fontBody,
          fontSize: 10, color: T.inkLow,
          marginLeft: 2,
        }}>
          +{extra}
        </span>
      )}
    </div>
  );
}

// ── Full badge shelf (for profile or detail page) ────────────────────────
export function BadgeShelf({ badges, emptyMessage = "No badges yet — start reviewing!" }) {
  if (!badges?.length) {
    return (
      <p style={{
        fontFamily: T.fontBody,
        fontSize: 13, color: T.inkLow,
        fontStyle: "italic",
      }}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {badges.map(b => <BadgePill key={b.id} badge={b} mode="full" />)}
    </div>
  );
}

// ── Badge unlock toast (shown when a new badge is earned) ────────────────
export function BadgeUnlockToast({ badge, onDismiss }) {
  const style = TIER_STYLES[badge.tier];

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      background: T.bgCard,
      border: `1px solid ${style.border}`,
      borderRadius: 12,
      padding: "14px 18px",
      boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 20px ${style.glow}`,
      animation: "slideIn 0.3s ease",
      maxWidth: 360,
    }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        width: 44, height: 44, borderRadius: 11,
        background: style.bg,
        border: `1.5px solid ${style.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
        boxShadow: `0 0 12px ${style.glow}`,
      }}>
        {badge.icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{
            fontFamily: T.fontBody,
            fontSize: 9, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: style.color,
          }}>
            Badge Unlocked
          </span>
        </div>
        <p style={{
          fontFamily: T.fontBody,
          fontSize: 14, fontWeight: 700,
          color: style.color, margin: "0 0 2px",
        }}>
          {badge.icon} {badge.label}
        </p>
        <p style={{
          fontFamily: T.fontBody,
          fontSize: 11, color: T.inkMid,
          margin: 0,
        }}>
          {badge.description}
        </p>
      </div>

      <button
        onClick={onDismiss}
        style={{
          background: "none", border: "none",
          color: T.inkLow, cursor: "pointer",
          fontSize: 16, padding: 4,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}