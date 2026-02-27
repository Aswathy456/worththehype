import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const TOKEN = {
  bg: "#0d0d0d",
  surface: "#161616",
  border: "#2a2a2a",
  borderHover: "#444",
  accent: "#ff5c1a",
  accentGlow: "rgba(255,92,26,0.25)",
  text: "#f0ede8",
  muted: "#6b6b6b",
  subtle: "#2e2e2e",
  success: "#22c55e",
  error: "#ef4444",
};

const FONT = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', system-ui, sans-serif",
};

function Input({ label, type = "text", value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
        textTransform: "uppercase", color: focused ? TOKEN.accent : TOKEN.muted,
        marginBottom: 7, transition: "color 0.2s", fontFamily: FONT.body,
      }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", background: focused ? "#1c1c1c" : TOKEN.surface,
          border: `1px solid ${error ? TOKEN.error : focused ? TOKEN.accent : TOKEN.border}`,
          borderRadius: 10, padding: "13px 16px", fontSize: 15, color: TOKEN.text,
          outline: "none", transition: "all 0.2s", fontFamily: FONT.body,
          boxShadow: focused ? `0 0 0 3px ${TOKEN.accentGlow}` : "none", boxSizing: "border-box",
        }}
      />
      {error && <p style={{ margin: "5px 0 0", fontSize: 12, color: TOKEN.error, fontFamily: FONT.body }}>{error}</p>}
    </div>
  );
}

function GoogleButton({ onClick, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        padding: "12px", background: hovered ? "#222" : TOKEN.surface,
        border: `1px solid ${hovered ? TOKEN.borderHover : TOKEN.border}`,
        borderRadius: 10, color: TOKEN.text, fontSize: 14, fontWeight: 600,
        fontFamily: FONT.body, cursor: "pointer", transition: "all 0.2s",
      }}>
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      {label}
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
      <div style={{ flex: 1, height: 1, background: TOKEN.border }} />
      <span style={{ fontSize: 12, color: TOKEN.muted, fontFamily: FONT.body }}>or</span>
      <div style={{ flex: 1, height: 1, background: TOKEN.border }} />
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
        background: loading ? TOKEN.subtle : hovered ? "#ff7a42" : TOKEN.accent,
        border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700,
        fontFamily: FONT.body, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
        boxShadow: hovered && !loading ? `0 4px 20px ${TOKEN.accentGlow}` : "none",
      }}>
      {loading ? "Please wait…" : label}
    </button>
  );
}

function AuthShell({ children }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #3a3a3a; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #161616 inset !important;
          -webkit-text-fill-color: #f0ede8 !important;
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: TOKEN.bg, display: "flex", fontFamily: FONT.body, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,26,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -300, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,26,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Left branding panel */}
        <div style={{ width: "45%", minHeight: "100vh", background: "#111", borderRight: `1px solid ${TOKEN.border}`, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${TOKEN.border} 1px, transparent 1px), linear-gradient(90deg, ${TOKEN.border} 1px, transparent 1px)`, backgroundSize: "40px 40px", opacity: 0.3, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 80 }}>
              <span style={{ fontSize: 22 }}>🍽️</span>
              <span style={{ fontFamily: FONT.display, fontSize: 20, color: TOKEN.text, fontWeight: 700 }}>WorthTheHype</span>
            </div>
            <h2 style={{ fontFamily: FONT.display, fontSize: 42, fontWeight: 700, color: TOKEN.text, lineHeight: 1.25, margin: "0 0 20px" }}>
              Honest reviews.<br />
              <em style={{ color: TOKEN.accent, fontStyle: "italic" }}>Real people.</em>
            </h2>
            <p style={{ fontSize: 15, color: TOKEN.muted, lineHeight: 1.7, maxWidth: 320 }}>
              Kochi's community-driven restaurant guide. We score the gap between what's hyped and what's real.
            </p>
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            {[{ label: "Reviews this month", value: "2,847" }, { label: "Restaurants tracked", value: "340+" }, { label: "Hype busts uncovered", value: "128" }].map((stat) => (
              <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: `1px solid ${TOKEN.border}` }}>
                <span style={{ fontSize: 13, color: TOKEN.muted }}>{stat.label}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: TOKEN.text, fontFamily: FONT.display }}>{stat.value}</span>
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

/* ── Login ── */
export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    const e = {};
    if (!email.includes("@")) e.email = "Enter a valid email address";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    // TODO: replace with Firebase signInWithEmailAndPassword(auth, email, password)
    setTimeout(() => { login(email); navigate(redirect); }, 1000);
  };

  return (
    <AuthShell>
      <h1 style={{ fontFamily: FONT.display, fontSize: 32, color: TOKEN.text, margin: "0 0 6px", fontWeight: 700 }}>Welcome back</h1>
      <p style={{ fontSize: 14, color: TOKEN.muted, margin: "0 0 32px" }}>
        Don't have an account?{" "}
        <Link to={`/signup?redirect=${redirect}`} style={{ color: TOKEN.accent, fontWeight: 600 }}>Sign up</Link>
      </p>
      <GoogleButton label="Continue with Google" onClick={() => { login("google@user.com"); navigate(redirect); }} />
      <Divider />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" error={errors.email} />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" error={errors.password} />
      <div style={{ textAlign: "right", marginBottom: 22, marginTop: -10 }}>
        <Link to="/forgot-password" style={{ fontSize: 13, color: TOKEN.muted, textDecoration: "none" }}>Forgot password?</Link>
      </div>
      <SubmitButton label="Sign In" onClick={handleLogin} loading={loading} />
    </AuthShell>
  );
}

/* ── Signup ── */
export function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignup = () => {
    const e = {};
    if (!email.includes("@")) e.email = "Enter a valid email address";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (password !== confirm) e.confirm = "Passwords don't match";
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    // TODO: replace with Firebase createUserWithEmailAndPassword(auth, email, password)
    setTimeout(() => { login(email); navigate(redirect); }, 1000);
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ["transparent", TOKEN.error, "#f59e0b", TOKEN.success][strength];
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];

  return (
    <AuthShell>
      <h1 style={{ fontFamily: FONT.display, fontSize: 32, color: TOKEN.text, margin: "0 0 6px", fontWeight: 700 }}>Join the community</h1>
      <p style={{ fontSize: 14, color: TOKEN.muted, margin: "0 0 32px" }}>
        Already have an account?{" "}
        <Link to={`/login?redirect=${redirect}`} style={{ color: TOKEN.accent, fontWeight: 600 }}>Sign in</Link>
      </p>
      <GoogleButton label="Sign up with Google" onClick={() => { login("google@user.com"); navigate(redirect); }} />
      <Divider />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" error={errors.email} />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" error={errors.password} />
      {password.length > 0 && (
        <div style={{ marginTop: -12, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : TOKEN.subtle, transition: "background 0.3s" }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
        </div>
      )}
      <Input label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" error={errors.confirm} />
      <SubmitButton label="Create Account" onClick={handleSignup} loading={loading} />
      <p style={{ fontSize: 12, color: TOKEN.muted, marginTop: 16, lineHeight: 1.6, textAlign: "center" }}>
        By signing up you agree to our <span style={{ color: TOKEN.accent, cursor: "pointer" }}>Terms</span> and <span style={{ color: TOKEN.accent, cursor: "pointer" }}>Privacy Policy</span>
      </p>
    </AuthShell>
  );
}

/* ── Forgot Password ── */
export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = () => {
    if (!email.includes("@")) return setError("Enter a valid email address");
    setLoading(true);
    // TODO: replace with Firebase sendPasswordResetEmail(auth, email)
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <AuthShell>
      {!sent ? (
        <>
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: TOKEN.muted, textDecoration: "none", marginBottom: 32 }}>← Back to login</Link>
          <h1 style={{ fontFamily: FONT.display, fontSize: 32, color: TOKEN.text, margin: "0 0 8px", fontWeight: 700 }}>Reset password</h1>
          <p style={{ fontSize: 14, color: TOKEN.muted, margin: "0 0 32px", lineHeight: 1.6 }}>Enter your email and we'll send you a link to get back in.</p>
          <Input label="Email" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" error={error} />
          <SubmitButton label="Send Reset Link" onClick={handleReset} loading={loading} />
        </>
      ) : (
        <div style={{ textAlign: "center", paddingTop: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28 }}>✉️</div>
          <h2 style={{ fontFamily: FONT.display, fontSize: 28, color: TOKEN.text, margin: "0 0 12px" }}>Check your inbox</h2>
          <p style={{ fontSize: 14, color: TOKEN.muted, lineHeight: 1.7, marginBottom: 32 }}>
            We sent a reset link to <strong style={{ color: TOKEN.text }}>{email}</strong>.<br />It may take a minute to arrive.
          </p>
          <Link to="/login" style={{ color: TOKEN.accent, fontSize: 14, fontWeight: 600 }}>Back to login →</Link>
        </div>
      )}
    </AuthShell>
  );
}