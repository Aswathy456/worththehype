import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user
    ? user.displayName?.slice(0, 2).toUpperCase() || "U"
    : null;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          🍽️ WorthTheHype
        </Link>

        <div style={styles.right}>
          <select style={styles.citySelect} defaultValue="Kochi">
            <option>Kochi</option>
            <option>Trivandrum</option>
            <option>Kozhikode</option>
          </select>

          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                style={styles.avatarBtn}
                title={user.displayName}
              >
                {initials}
              </button>

              {menuOpen && (
                <>
                  <div style={styles.backdrop} onClick={() => setMenuOpen(false)} />
                  <div style={styles.dropdown}>
                    <div style={styles.dropdownHeader}>
                      <p style={styles.dropdownName}>{user.displayName}</p>
                      <p style={styles.dropdownEmail}>{user.email}</p>
                      <span style={styles.ageBadge}>🕐 New member</span>
                    </div>
                    <div style={styles.dropdownDivider} />
                    <button style={styles.dropdownItem} onClick={() => { setMenuOpen(false); navigate("/profile"); }}>
                      👤 My Profile
                    </button>
                    <button style={styles.dropdownItem} onClick={() => { setMenuOpen(false); navigate("/my-reviews"); }}>
                      📝 My Reviews
                    </button>
                    <div style={styles.dropdownDivider} />
                    <button
                      style={{ ...styles.dropdownItem, color: "#ef4444" }}
                      onClick={() => { logout(); setMenuOpen(false); }}
                    >
                      → Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button style={styles.loginBtn} onClick={() => navigate("/login")}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 100,
    width: "100%",
  },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "14px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontWeight: 800,
    fontSize: 18,
    color: "#111",
    textDecoration: "none",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    position: "relative",
  },
  citySelect: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
    background: "#f9fafb",
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtn: {
    padding: "8px 18px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 10,
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    width: 220,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    zIndex: 20,
    overflow: "hidden",
  },
  dropdownHeader: {
    padding: "14px 16px",
    background: "#fafafa",
  },
  dropdownName: {
    margin: 0,
    fontWeight: 700,
    fontSize: 14,
    color: "#111",
  },
  dropdownEmail: {
    margin: "2px 0 8px",
    fontSize: 12,
    color: "#9ca3af",
  },
  ageBadge: {
    fontSize: 11,
    background: "#ede9fe",
    color: "#6d28d9",
    padding: "3px 8px",
    borderRadius: 20,
    fontWeight: 600,
  },
  dropdownDivider: {
    height: 1,
    background: "#f0f0f0",
  },
  dropdownItem: {
    width: "100%",
    padding: "11px 16px",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    display: "block",
  },
};

export default NavBar;