import { useState, useEffect } from "react";
import { T } from "../tokens";

// ── Tag config ────────────────────────────────────────────────────────────
const TAG_CONFIG = {
  genuine: {
    label:      "Likely Genuine",
    dot:        "#4ade80",
    bg:         "#4ade8012",
    border:     "#4ade8030",
    textColor:  "#4ade80",
    barColor:   "#4ade80",
  },
  low_confidence: {
    label:      "Low Confidence",
    dot:        "#f0b84a",
    bg:         "#f0b84a12",
    border:     "#f0b84a30",
    textColor:  "#f0b84a",
    barColor:   "#f0b84a",
  },
  promotional: {
    label:      "Promotional",
    dot:        "#f87171",
    bg:         "#f8717112",
    border:     "#f8717130",
    textColor:  "#f87171",
    barColor:   "#f87171",
  },
};

// ── Loading skeleton ──────────────────────────────────────────────────────
function TagSkeleton() {
  return (
    <div style={{
      display:      "flex",
      alignItems:   "center",
      gap:          6,
      padding:      "3px 8px",
      borderRadius: 5,
      background:   T.bgRaised,
      border:       `1px solid ${T.border}`,
      width:        110,
      height:       22,
      animation:    "pulse 1.5s ease-in-out infinite",
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.border }} />
      <div style={{ flex: 1, height: 8, borderRadius: 3, background: T.border }} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function CredibilityTag({ credibility, loading }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (loading) return <TagSkeleton />;
  if (!credibility) return null;

  const { tag, confidence, signals = [] } = credibility;
  const cfg = TAG_CONFIG[tag] ?? TAG_CONFIG.low_confidence;

  return (
    <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", gap: 4 }}>
      {/* Tag pill */}
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        style={{
          display:       "inline-flex",
          alignItems:    "center",
          gap:           5,
          padding:       "3px 8px",
          background:    cfg.bg,
          border:        `1px solid ${cfg.border}`,
          borderRadius:  5,
          cursor:        "default",
          transition:    "all 0.15s",
          outline:       "none",
        }}
      >
        {/* Dot */}
        <span style={{
          width:        6,
          height:       6,
          borderRadius: "50%",
          background:   cfg.dot,
          flexShrink:   0,
          boxShadow:    `0 0 4px ${cfg.dot}80`,
        }} />
        <span style={{
          fontFamily:    T.fontBody,
          fontSize:      9,
          fontWeight:    700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color:         cfg.textColor,
          whiteSpace:    "nowrap",
        }}>
          {cfg.label}
        </span>
      </button>

      {/* Confidence bar */}
      <div style={{
        width:        "100%",
        height:       2,
        background:   T.border,
        borderRadius: 1,
        overflow:     "hidden",
      }}>
        <div style={{
          height:     "100%",
          width:      `${confidence}%`,
          background: cfg.barColor,
          borderRadius: 1,
          transition: "width 0.6s ease",
          opacity:    0.7,
        }} />
      </div>

      {/* Tooltip */}
      {showTooltip && signals.length > 0 && (
        <div style={{
          position:   "absolute",
          bottom:     "calc(100% + 10px)",
          left:       0,
          zIndex:     300,
          background: T.bgCard,
          border:     `1px solid ${cfg.border}`,
          borderRadius: 9,
          padding:    "12px 14px",
          width:      220,
          boxShadow:  `0 12px 36px rgba(0,0,0,0.6), 0 0 16px ${cfg.dot}20`,
          pointerEvents: "none",
        }}>
          {/* Header */}
          <div style={{
            display:       "flex",
            alignItems:    "center",
            gap:           6,
            marginBottom:  8,
            paddingBottom: 8,
            borderBottom:  `1px solid ${T.border}`,
          }}>
            <span style={{
              fontFamily:    T.fontBody,
              fontSize:      10,
              fontWeight:    700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color:         cfg.textColor,
            }}>
              AI Confidence
            </span>
            <span style={{
              fontFamily: T.fontMono,
              fontSize:   11,
              fontWeight: 700,
              color:      cfg.textColor,
              marginLeft: "auto",
            }}>
              {confidence}%
            </span>
          </div>

          {/* Signals */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {signals.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <span style={{ color: cfg.dot, fontSize: 8, marginTop: 3, flexShrink: 0 }}>◆</span>
                <span style={{
                  fontFamily:  T.fontBody,
                  fontSize:    11,
                  color:       T.inkMid,
                  lineHeight:  1.5,
                }}>
                  {s}
                </span>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p style={{
            fontFamily:  T.fontBody,
            fontSize:    9,
            color:       T.inkLow,
            marginTop:   10,
            lineHeight:  1.4,
            fontStyle:   "italic",
          }}>
            AI analysis only. Does not remove or alter reviews.
          </p>

          {/* Arrow */}
          <div style={{
            position:    "absolute",
            top:         "100%",
            left:        14,
            width:       0,
            height:      0,
            borderLeft:  "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop:   `5px solid ${cfg.border}`,
          }} />
        </div>
      )}
    </div>
  );
}