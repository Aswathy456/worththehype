import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CITIES } from "../services/restaurantService";
import { T } from "../tokens";

export default function NavBar({ activeCity, onCityChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user?.displayName?.slice(0, 2).toUpperCase() || "U";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .nav-city-btn:hover {
          color: ${T.ink} !important;
          background: ${T.bgRaised} !important;
        }
        .nav-city-btn::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: ${T.accent};
          transition: width 0.2s ease;
        }
        .nav-city-btn:hover::after { width: 60% !important; }
        .nav-city-btn.active::after { width: 60% !important; }

        .avatar-btn:hover {
          border-color: ${T.accent} !important;
          background: ${T.bgHover} !important;
        }
        .signin-btn:hover {
          background: ${T.accentHi} !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px ${T.accentDim};
        }
        .dropdown-item:hover {
          background: ${T.bgHover} !important;
          color: ${T.ink} !important;
          padding-left: 20px !important;
        }
        .signout-btn:hover {
          background: #2a100e !important;
          color: #f87171 !important;
          padding-left: 20px !important;
        }
      `}</style>

      <nav style={{
        background: T.bg,
        borderBottom: `1px solid ${T.border}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        backdropFilter: "blur(12px)",
      }}>
        {/* Amber accent line */}
        <div style={{
          height: 2,
          background: `linear-gradient(90deg, ${T.accent}, ${T.accentHi} 40%, ${T.accent}40)`,
        }} />

        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 1 }}>
            <span style={{
              fontFamily: T.fontDisplay,
              fontSize: 23,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}>
              Worth
            </span>
            <em style={{
              fontFamily: T.fontDisplay,
              fontSize: 23,
              fontWeight: 600,
              fontStyle: "italic",
              color: T.accent,
              letterSpacing: "-0.01em",
            }}>
              The
            </em>
            <span style={{
              fontFamily: T.fontDisplay,
              fontSize: 23,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-0.02em",
            }}>
              Hype
            </span>
          </Link>

          {/* ── City tabs ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            background: T.bgRaised,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: "4px",
          }}>
            {Object.keys(CITIES).map(city => {
              const isActive = city === activeCity;
              return (
                <button
                  key={city}
                  className={`nav-city-btn${isActive ? " active" : ""}`}
                  onClick={() => onCityChange(city)}
                  style={{
                    position: "relative",
                    background: isActive ? T.bgCard : "transparent",
                    border: isActive ? `1px solid ${T.borderMid}` : "1px solid transparent",
                    borderRadius: 7,
                    padding: "6px 16px",
                    fontFamily: T.fontBody,
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.05em",
                    color: isActive ? T.ink : T.inkMid,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    whiteSpace: "nowrap",
                    boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.4)" : "none",
                  }}
                >
                  {city}
                </button>
              );
            })}
          </div>

          {/* ── Auth ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  className="avatar-btn"
                  onClick={() => setMenuOpen(o => !o)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: T.bgCard,
                    border: `1.5px solid ${T.borderMid}`,
                    color: T.ink,
                    fontFamily: T.fontBody,
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                >
                  {initials}
                </button>

                {menuOpen && (
                  <>
                    <div
                      style={{ position: "fixed", inset: 0, zIndex: 10 }}
                      onClick={() => setMenuOpen(false)}
                    />
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 12px)",
                      right: 0,
                      width: 220,
                      background: T.bgCard,
                      border: `1px solid ${T.borderMid}`,
                      borderRadius: 12,
                      boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
                      zIndex: 20,
                      overflow: "hidden",
                    }}>
                      {/* User info */}
                      <div style={{ padding: "16px", borderBottom: `1px solid ${T.border}` }}>
                        <p style={{
                          fontFamily: T.fontBody,
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.ink,
                          marginBottom: 2,
                        }}>
                          {user.displayName}
                        </p>
                        <p style={{
                          fontFamily: T.fontBody,
                          fontSize: 11,
                          color: T.inkLow,
                          marginBottom: 10,
                        }}>
                          {user.email}
                        </p>
                        <span style={{
                          display: "inline-block",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: T.accent,
                          background: T.accentLow,
                          border: `1px solid ${T.accentDim}`,
                          padding: "3px 8px",
                          borderRadius: 4,
                          fontFamily: T.fontBody,
                        }}>
                          New Member
                        </span>
                      </div>

                      {/* Nav items */}
                      {[
                        ["👤  Profile", "/profile"],
                        ["📝  My Reviews", "/my-reviews"],
                      ].map(([label, path]) => (
                        <button
                          key={path}
                          className="dropdown-item"
                          onClick={() => { setMenuOpen(false); navigate(path); }}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            background: "none",
                            border: "none",
                            textAlign: "left",
                            fontFamily: T.fontBody,
                            fontSize: 13,
                            color: T.inkMid,
                            cursor: "pointer",
                            display: "block",
                            transition: "all 0.15s",
                            borderBottom: `1px solid ${T.border}`,
                          }}
                        >
                          {label}
                        </button>
                      ))}

                      <button
                        className="signout-btn"
                        onClick={() => { logout(); setMenuOpen(false); }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background: "none",
                          border: "none",
                          textAlign: "left",
                          fontFamily: T.fontBody,
                          fontSize: 13,
                          color: T.hype,
                          cursor: "pointer",
                          display: "block",
                          transition: "all 0.15s",
                        }}
                      >
                        → Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                className="signin-btn"
                onClick={() => navigate("/login")}
                style={{
                  padding: "9px 22px",
                  background: T.accent,
                  color: "#0c0905",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: T.fontBody,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}