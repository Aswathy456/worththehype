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
        .nav-city-btn { transition: all 0.2s; }
        .nav-city-btn:hover { color: ${T.ink} !important; }
        .avatar-btn:hover { border-color: ${T.accent} !important; }
        .signin-btn:hover { background: ${T.accentHi} !important; }
        .dropdown-item:hover { background: ${T.bgHover} !important; color: ${T.ink} !important; }
      `}</style>

      <nav style={{
        background: T.bg,
        borderBottom: `1px solid ${T.border}`,
        position: "sticky", top: 0, zIndex: 100, width: "100%",
      }}>
        <div style={{ height: 2, background: T.accent }} />

        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 60,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{
              fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 700,
              color: T.ink, letterSpacing: "-0.01em",
            }}>
              Worth<em style={{ color: T.accent, fontStyle: "italic" }}>The</em>Hype
            </span>
          </Link>

          {/* City tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {Object.keys(CITIES).map(city => {
              const isActive = city === activeCity;
              return (
                <button
                  key={city}
                  className="nav-city-btn"
                  onClick={() => onCityChange(city)}
                  style={{
                    background: isActive ? T.bgRaised : "none",
                    border: `1px solid ${isActive ? T.borderMid : "transparent"}`,
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontFamily: T.fontBody,
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.04em",
                    color: isActive ? T.ink : T.inkLow,
                    cursor: "pointer",
                    borderBottom: isActive ? `2px solid ${T.accent}` : "2px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  {city}
                </button>
              );
            })}
          </div>

          {/* Auth */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button className="avatar-btn" onClick={() => setMenuOpen(o => !o)}
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: T.bgRaised, border: `1px solid ${T.borderMid}`,
                    color: T.ink, fontWeight: 600, fontSize: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "border-color 0.2s",
                  }}>
                  {initials}
                </button>
                {menuOpen && (
                  <>
                    <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setMenuOpen(false)} />
                    <div style={{
                      position: "absolute", top: "calc(100% + 12px)", right: 0,
                      width: 210, background: T.bgRaised,
                      border: `1px solid ${T.border}`, borderRadius: 10,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                      zIndex: 20, overflow: "hidden",
                    }}>
                      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{user.displayName}</p>
                        <p style={{ fontSize: 11, color: T.inkLow, marginTop: 2 }}>{user.email}</p>
                        <span style={{
                          display: "inline-block", marginTop: 8,
                          fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                          textTransform: "uppercase", color: T.accent,
                          background: T.accentLow, padding: "3px 8px", borderRadius: 4,
                        }}>New Member</span>
                      </div>
                      {[["👤  Profile", "/profile"], ["📝  My Reviews", "/my-reviews"]].map(([label, path]) => (
                        <button key={path} className="dropdown-item"
                          onClick={() => { setMenuOpen(false); navigate(path); }}
                          style={{
                            width: "100%", padding: "11px 16px", background: "none",
                            border: "none", textAlign: "left", fontSize: 13,
                            color: T.inkMid, display: "block", transition: "all 0.15s",
                          }}>
                          {label}
                        </button>
                      ))}
                      <div style={{ height: 1, background: T.border }} />
                      <button className="dropdown-item"
                        onClick={() => { logout(); setMenuOpen(false); }}
                        style={{
                          width: "100%", padding: "11px 16px", background: "none",
                          border: "none", textAlign: "left", fontSize: 13,
                          color: "#9b3a2e", display: "block", transition: "all 0.15s",
                        }}>
                        → Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button className="signin-btn" onClick={() => navigate("/login")}
                style={{
                  padding: "8px 20px", background: T.accent, color: "#fff",
                  border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600,
                  letterSpacing: "0.04em", transition: "background 0.2s",
                }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}