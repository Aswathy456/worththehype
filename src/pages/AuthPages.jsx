import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const T = {
  bg: "#0d0d0d", surface: "#161616", border: "#2a2a2a", borderHover: "#444",
  accent: "#c1392b", accentGlow: "rgba(193,57,43,0.25)", accentLow: "rgba(193,57,43,0.12)",
  text: "#f2ede6", muted: "#6b6b6b", subtle: "#2e2e2e",
  success: "#22c55e", error: "#ef4444",
  fontDisplay: "'Cormorant Garamond', Georgia, serif",
  fontBody: "'Outfit', system-ui, sans-serif",
};

function Input({ label, type = "text", value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
        textTransform: "uppercase", color: focused ? T.accent : T.muted,
        marginBottom: 7, transition: "color 0.2s", fontFamily: T.fontBody,
      }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", background: focused ? "#1c1c1c" : T.surface,
          border: `1px solid ${error ? T.error : focused ? T.accent : T.border}`,
          borderRadius: 10, padding: "13px 16px", fontSize: 15, color: T.text,
          outline: "none", transition: "all 0.2s", fontFamily: T.fontBody,
          boxShadow: focused ? `0 0 0 3px ${T.accentGlow}` : "none", boxSizing: "border-box",
        }} />
      {error && <p style={{ margin: "5px 0 0", fontSize: 12, color: T.error, fontFamily: T.fontBody }}>{error}</p>}
    </div>
  );
}

function GoogleButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        padding: "12px", background: hovered ? "#222" : T.surface,
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        borderRadius: 10, color: T.text, fontSize: 14, fontWeight: 600,
        fontFamily: T.fontBody, cursor: "pointer", transition: "all 0.2s",
      }}>
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      Continue with Google
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
      <div style={{ flex: 1, height: 1, background: T.border }} />
      <span style={{ fontSize: 12, color: T.muted, fontFamily: T.fontBody }}>or</span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

function SubmitButton({ label, onClick, loading }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      disabled={loading}
      style={{
        width: "100%", padding: "14px",
        background: loading ? T.subtle : hovered ? "#e04535" : T.accent,
        border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700,
        fontFamily: T.fontBody, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
        boxShadow: hovered && !loading ? `0 4px 20px ${T.accentGlow}` : "none",
      }}>
      {loading ? "Please wait…" : label}
    </button>
  );
}

function AuthShell({ children }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Outfit:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #3a3a3a; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #161616 inset !important;
          -webkit-text-fill-color: #f2ede6 !important;
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(193,57,43,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Left panel */}
        <div style={{ width: "45%", minHeight: "100vh", background: "#111", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`, backgroundSize: "40px 40px", opacity: 0.3, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 80 }}>
              <span style={{ fontSize: 22 }}>🍽️</span>
              <span style={{ fontFamily: T.fontDisplay, fontSize: 20, color: T.text, fontWeight: 700 }}>WorthTheHype</span>
            </div>
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: 42, fontWeight: 700, color: T.text, lineHeight: 1.25, margin: "0 0 20px" }}>
              Honest reviews.<br />
              <em style={{ color: T.accent, fontStyle: "italic" }}>Real people.</em>
            </h2>
            <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7, maxWidth: 320 }}>
              Kerala's community-driven restaurant guide. We score the gap between what's hyped and what's real.
            </p>
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            {[{ label: "Reviews this month", value: "2,847" }, { label: "Restaurants tracked", value: "340+" }, { label: "Hype busts uncovered", value: "128" }].map(stat => (
              <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 13, color: T.muted }}>{stat.label}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.fontDisplay }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
          <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
        </div>
      </div>
    </>
  );
}

/* ── Login ──────────────────────────────────────────────────── */
export function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [firebaseError, setFirebaseError] = useState("");

  const handleLogin = async () => {
    const e = {};
    if (!email.includes("@")) e.email = "Enter a valid email";
    if (password.length < 6)  e.password = "At least 6 characters";
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true); setFirebaseError("");
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setFirebaseError(friendlyError(err.code));
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setFirebaseError("");
    try { await loginWithGoogle(); navigate(redirect); }
    catch (err) { setFirebaseError(friendlyError(err.code)); }
  };

  return (
    <AuthShell>
      <h1 style={{ fontFamily: T.fontDisplay, fontSize: 32, color: T.text, margin: "0 0 6px", fontWeight: 700 }}>Welcome back</h1>
      <p style={{ fontSize: 14, color: T.muted, margin: "0 0 32px" }}>
        No account?{" "}<Link to={`/signup?redirect=${redirect}`} style={{ color: T.accent, fontWeight: 600 }}>Sign up</Link>
      </p>
      <GoogleButton onClick={handleGoogle} />
      <Divider />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" error={errors.email} />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" error={errors.password} />
      <div style={{ textAlign: "right", marginBottom: 22, marginTop: -10 }}>
        <Link to="/forgot-password" style={{ fontSize: 13, color: T.muted, textDecoration: "none" }}>Forgot password?</Link>
      </div>
      {firebaseError && <p style={{ fontSize: 13, color: T.error, marginBottom: 14 }}>{firebaseError}</p>}
      <SubmitButton label="Sign In" onClick={handleLogin} loading={loading} />
    </AuthShell>
  );
}

/* ── Signup ─────────────────────────────────────────────────── */
export function Signup() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [firebaseError, setFirebaseError] = useState("");

  const handleSignup = async () => {
    const e = {};
    if (!email.includes("@"))    e.email = "Enter a valid email";
    if (password.length < 6)     e.password = "At least 6 characters";
    if (password !== confirm)    e.confirm = "Passwords don't match";
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true); setFirebaseError("");
    try {
      await signup(email, password);
      navigate(redirect);
    } catch (err) {
      setFirebaseError(friendlyError(err.code));
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setFirebaseError("");
    try { await loginWithGoogle(); navigate(redirect); }
    catch (err) { setFirebaseError(friendlyError(err.code)); }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ["transparent", T.error, "#f59e0b", T.success][strength];
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];

  return (
    <AuthShell>
      <h1 style={{ fontFamily: T.fontDisplay, fontSize: 32, color: T.text, margin: "0 0 6px", fontWeight: 700 }}>Join the community</h1>
      <p style={{ fontSize: 14, color: T.muted, margin: "0 0 32px" }}>
        Already have an account?{" "}<Link to={`/login?redirect=${redirect}`} style={{ color: T.accent, fontWeight: 600 }}>Sign in</Link>
      </p>
      <GoogleButton onClick={handleGoogle} />
      <Divider />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" error={errors.email} />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" error={errors.password} />
      {password.length > 0 && (
        <div style={{ marginTop: -12, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
            {[1,2,3].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : T.subtle, transition: "background 0.3s" }} />)}
          </div>
          <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
        </div>
      )}
      <Input label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" error={errors.confirm} />
      {firebaseError && <p style={{ fontSize: 13, color: T.error, marginBottom: 14 }}>{firebaseError}</p>}
      <SubmitButton label="Create Account" onClick={handleSignup} loading={loading} />
      <p style={{ fontSize: 12, color: T.muted, marginTop: 16, lineHeight: 1.6, textAlign: "center" }}>
        By signing up you agree to our <span style={{ color: T.accent, cursor: "pointer" }}>Terms</span> and <span style={{ color: T.accent, cursor: "pointer" }}>Privacy Policy</span>
      </p>
    </AuthShell>
  );
}

/* ── Forgot Password ────────────────────────────────────────── */
export function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleReset = async () => {
    if (!email.includes("@")) return setError("Enter a valid email");
    setLoading(true);
    try { await forgotPassword(email); setSent(true); }
    catch (err) { setError(friendlyError(err.code)); setLoading(false); }
  };

  return (
    <AuthShell>
      {!sent ? (
        <>
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: T.muted, textDecoration: "none", marginBottom: 32 }}>← Back to login</Link>
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: 32, color: T.text, margin: "0 0 8px", fontWeight: 700 }}>Reset password</h1>
          <p style={{ fontSize: 14, color: T.muted, margin: "0 0 32px", lineHeight: 1.6 }}>We'll send a reset link to your email.</p>
          <Input label="Email" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" error={error} />
          <SubmitButton label="Send Reset Link" onClick={handleReset} loading={loading} />
        </>
      ) : (
        <div style={{ textAlign: "center", paddingTop: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28 }}>✉️</div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: 28, color: T.text, margin: "0 0 12px" }}>Check your inbox</h2>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, marginBottom: 32 }}>
            Reset link sent to <strong style={{ color: T.text }}>{email}</strong>
          </p>
          <Link to="/login" style={{ color: T.accent, fontSize: 14, fontWeight: 600 }}>Back to login →</Link>
        </div>
      )}
    </AuthShell>
  );
}

// Firebase error code → human readable
function friendlyError(code) {
  const map = {
    "auth/user-not-found":       "No account found with this email.",
    "auth/wrong-password":       "Incorrect password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password":        "Password should be at least 6 characters.",
    "auth/invalid-email":        "Please enter a valid email address.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/too-many-requests":    "Too many attempts. Please try again later.",
    "auth/invalid-credential":   "Incorrect email or password.",
  };
  return map[code] || "Something went wrong. Please try again.";
}