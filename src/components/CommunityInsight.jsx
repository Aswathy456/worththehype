import { useState, useEffect, useRef } from "react";
import { T } from "../tokens";

// ── Typewriter hook ───────────────────────────────────────────────────────
function useTypewriter(text, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    if (!text) return;
    idx.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

// ── Skeleton loader ───────────────────────────────────────────────────────
function Summaryskeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <style>{`
        @keyframes shimmer {
          0%   { opacity: 0.3; }
          50%  { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
      `}</style>
      {[100, 85, 60].map((w, i) => (
        <div key={i} style={{
          height:       12,
          width:        `${w}%`,
          background:   T.borderMid,
          borderRadius: 3,
          animation:    `shimmer 1.6s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
// Props:
//   summaryData   — { summary, reviewCount, generatedAt } | null
//   loading       — bool
//   weightedScore — number | null (AI-adjusted reality score)
//   rawScore      — number (original reality score)
//   reviewCount   — number
//   onRefresh     — () => void  (called when user requests regeneration)
//   canRefresh    — bool (true when new reviews arrived since last gen)

export default function CommunityInsight({
  summaryData,
  loading,
  weightedScore,
  rawScore,
  reviewCount,
  onRefresh,
  canRefresh,
}) {
  const displayedSummary = useTypewriter(summaryData?.summary ?? "", 14);
  const [expanded, setExpanded] = useState(false);
  const scoreDelta = weightedScore != null ? (weightedScore - rawScore).toFixed(1) : null;
  const deltaPos   = scoreDelta != null && parseFloat(scoreDelta) >= 0;

  if (!loading && !summaryData && reviewCount < 2) return null;

  return (
    <div style={{
      background:   T.bgRaised,
      border:       `1px solid ${T.borderMid}`,
      borderRadius: 12,
      overflow:     "hidden",
      marginBottom: 32,
    }}>
      {/* Top accent bar */}
      <div style={{
        height:     2,
        background: `linear-gradient(90deg, #c084fc, #c084fc60, transparent)`,
      }} />

      <div style={{ padding: "22px 24px" }}>
        {/* Header row */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          marginBottom:   16,
          gap:            12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* AI chip */}
            <div style={{
              display:       "flex",
              alignItems:    "center",
              gap:           5,
              background:    "#c084fc15",
              border:        "1px solid #c084fc35",
              borderRadius:  5,
              padding:       "3px 9px",
            }}>
              <span style={{ fontSize: 9 }}>◆</span>
              <span style={{
                fontFamily:    T.fontBody,
                fontSize:      9,
                fontWeight:    800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         "#c084fc",
              }}>
                AI Analysis
              </span>
            </div>
            <span style={{
              fontFamily: T.fontBody,
              fontSize:   12,
              color:      T.inkLow,
            }}>
              Community Insight
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Refresh button — only when new reviews arrived */}
            {canRefresh && !loading && (
              <button
                onClick={onRefresh}
                style={{
                  display:       "flex",
                  alignItems:    "center",
                  gap:           5,
                  background:    "none",
                  border:        `1px solid ${T.border}`,
                  borderRadius:  5,
                  padding:       "4px 10px",
                  fontFamily:    T.fontBody,
                  fontSize:      11,
                  color:         T.inkLow,
                  cursor:        "pointer",
                  transition:    "all 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#c084fc";
                  e.currentTarget.style.color       = "#c084fc";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.color       = T.inkLow;
                }}
              >
                ↻ Refresh Analysis
              </button>
            )}

            {summaryData?.generatedAt && (
              <span style={{
                fontFamily: T.fontBody,
                fontSize:   10,
                color:      T.inkLow,
                fontStyle:  "italic",
              }}>
                Based on {summaryData.reviewCount} review{summaryData.reviewCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Summary text */}
        <div style={{ marginBottom: weightedScore != null ? 20 : 0 }}>
          {loading ? (
            <SummarySkeletonBlock />
          ) : summaryData?.summary ? (
            <p style={{
              fontFamily:  T.fontDisplay,
              fontSize:    15,
              fontStyle:   "italic",
              color:       T.inkMid,
              lineHeight:  1.85,
              margin:      0,
              borderLeft:  "2px solid #c084fc50",
              paddingLeft: 14,
            }}>
              {displayedSummary}
              {displayedSummary.length < (summaryData.summary.length) && (
                <span style={{
                  display:          "inline-block",
                  width:            2,
                  height:           14,
                  background:       "#c084fc",
                  marginLeft:       2,
                  verticalAlign:    "middle",
                  animation:        "blink 0.8s step-end infinite",
                }} />
              )}
            </p>
          ) : reviewCount < 2 ? null : (
            <p style={{
              fontFamily: T.fontBody,
              fontSize:   13,
              color:      T.inkLow,
              fontStyle:  "italic",
              margin:     0,
            }}>
              Analysis will appear once more reviews are submitted.
            </p>
          )}
        </div>

        {/* Weighted score row */}
        {weightedScore != null && !loading && (
          <div style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            paddingTop:     16,
            borderTop:      `1px solid ${T.border}`,
            gap:            16,
            flexWrap:       "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Raw score */}
              <div>
                <p style={{
                  fontFamily:    T.fontBody,
                  fontSize:      9,
                  fontWeight:    700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         T.inkLow,
                  marginBottom:  3,
                }}>
                  Raw Reality Score
                </p>
                <span style={{
                  fontFamily: T.fontDisplay,
                  fontSize:   22,
                  fontWeight: 700,
                  color:      T.inkMid,
                }}>
                  {rawScore.toFixed(1)}
                </span>
              </div>

              <span style={{ color: T.border, fontSize: 18 }}>→</span>

              {/* Weighted score */}
              <div>
                <p style={{
                  fontFamily:    T.fontBody,
                  fontSize:      9,
                  fontWeight:    700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         "#c084fc",
                  marginBottom:  3,
                }}>
                  AI-Weighted Score
                </p>
                <span style={{
                  fontFamily: T.fontDisplay,
                  fontSize:   26,
                  fontWeight: 700,
                  color:      "#c084fc",
                }}>
                  {weightedScore}
                </span>
              </div>

              {/* Delta */}
              {scoreDelta !== "0.0" && (
                <div style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          5,
                  background:   deltaPos ? "#4ade8010" : "#f8717110",
                  border:       `1px solid ${deltaPos ? "#4ade8030" : "#f8717130"}`,
                  borderRadius: 5,
                  padding:      "4px 10px",
                }}>
                  <span style={{
                    fontFamily: T.fontMono,
                    fontSize:   12,
                    fontWeight: 700,
                    color:      deltaPos ? T.worthy : T.hype,
                  }}>
                    {deltaPos ? "+" : ""}{scoreDelta}
                  </span>
                  <span style={{
                    fontFamily:    T.fontBody,
                    fontSize:      9,
                    color:         deltaPos ? T.worthy : T.hype,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight:    600,
                  }}>
                    {deltaPos ? "adjusted up" : "adjusted down"}
                  </span>
                </div>
              )}
            </div>

            {/* Explainability note */}
            <p style={{
              fontFamily: T.fontBody,
              fontSize:   10,
              color:      T.inkLow,
              fontStyle:  "italic",
              maxWidth:   240,
              lineHeight: 1.5,
              margin:     0,
            }}>
              AI adjusts weight based on review credibility. Community votes take precedence over time.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function SummarySkeletonBlock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, borderLeft: "2px solid #c084fc30" }}>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 0.55; }
        }
      `}</style>
      {[100, 90, 65].map((w, i) => (
        <div key={i} style={{
          height:       13,
          width:        `${w}%`,
          background:   T.borderMid,
          borderRadius: 3,
          animation:    `shimmer 1.8s ease-in-out ${i * 0.25}s infinite`,
        }} />
      ))}
    </div>
  );
}