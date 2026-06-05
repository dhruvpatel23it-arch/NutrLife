"use client";
import { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";

export type UserType = {
  name: string;
  email: string;
  initials: string;
};

const MOCK_GOOGLE_ACCOUNT = {
  name: "Dhruv Patel",
  email: "dhruv@example.com",
};

// High-quality Unsplash diet food photos (direct URLs, no redirect)
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=85&fit=crop", // colorful salad bowl
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=85&fit=crop", // healthy breakfast
  "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=1600&q=85&fit=crop", // green smoothie bowl
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&q=85&fit=crop", // fresh vegetables
  "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=1600&q=85&fit=crop", // avocado toast
  "https://images.unsplash.com/photo-1501959915551-4e8d30928317?w=1600&q=85&fit=crop", // acai berry bowl
  "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=1600&q=85&fit=crop", // healthy grain bowl
  "https://images.unsplash.com/photo-1457296898342-cdd24585d095?w=1600&q=85&fit=crop", // fresh fruit platter
];

const IMAGE_LABELS = [
  "🥗 Fresh Salad Bowl",
  "🍳 Healthy Breakfast",
  "🥤 Green Smoothie",
  "🥦 Farm Vegetables",
  "🥑 Avocado Toast",
  "🫐 Acai Berry Bowl",
  "🌾 Wholesome Grain Bowl",
  "🍇 Fresh Fruit Platter",
];

export default function Login({ onLogin }: { onLogin: (user: UserType) => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [labelVisible, setLabelVisible] = useState(true);

  // Auto-cycle background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLabelVisible(false);
      setTimeout(() => {
        setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
        setLabelVisible(true);
      }, 700);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const userName = name || email.split("@")[0].replace(/[^a-zA-Z]/g, " ") || "User";
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
    onLogin({ name: formattedName, email, initials: formattedName.charAt(0).toUpperCase() });
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      onLogin({
        name: MOCK_GOOGLE_ACCOUNT.name,
        email: MOCK_GOOGLE_ACCOUNT.email,
        initials: MOCK_GOOGLE_ACCOUNT.name.charAt(0).toUpperCase(),
      });
    }, 800);
  };

  return (
    <>
      <div
        suppressHydrationWarning
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          position: "relative",
          overflow: "hidden",
          background: "#1a4d2e",
        }}
      >
        {/* Background image slides */}
        {BACKGROUND_IMAGES.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('${img}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: bgIndex === idx ? 1 : 0,
              transform: bgIndex === idx ? "scale(1.04)" : "scale(1)",
              transition: "opacity 1.2s cubic-bezier(0.4,0,0.2,1), transform 6s ease-out",
              zIndex: 0,
            }}
          />
        ))}

        {/* Gradient overlay so text is always readable */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.52) 0%, rgba(15,40,20,0.38) 60%, rgba(0,0,0,0.45) 100%)",
            zIndex: 1,
          }}
        />

        {/* Food label badge — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 32,
            zIndex: 3,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: 50,
            padding: "8px 20px",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.3px",
            border: "1px solid rgba(255,255,255,0.18)",
            opacity: labelVisible ? 1 : 0,
            transform: labelVisible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {IMAGE_LABELS[bgIndex]}
        </div>

        {/* Dot indicators — bottom center */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            display: "flex",
            gap: 8,
          }}
        >
          {BACKGROUND_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setLabelVisible(false); setTimeout(() => { setBgIndex(idx); setLabelVisible(true); }, 400); }}
              style={{
                width: bgIndex === idx ? 24 : 8,
                height: 8,
                borderRadius: 50,
                background: bgIndex === idx ? "#2ec972" : "rgba(255,255,255,0.5)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          ))}
        </div>

        {/* Login card */}
        <div
          suppressHydrationWarning
          style={{
            background: "rgba(255,255,255,0.96)",
            borderRadius: 24,
            padding: "48px 40px",
            width: "100%",
            maxWidth: 440,
            boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            position: "relative",
            zIndex: 2,
            animation: "fadeInUp 0.6s ease",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 36,
                fontWeight: 700,
                color: "var(--green-dark)",
                marginBottom: 8,
                letterSpacing: "-0.5px",
              }}
            >
              Nutri<span style={{ color: "var(--orange)" }}>Life</span>
            </div>
            <p style={{ color: "var(--text2)", fontSize: 16 }}>
              Sign in to continue your health journey.
            </p>
          </div>

          {/* Form */}
          <form suppressHydrationWarning onSubmit={handleAuth}>
            {isRegister && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                  Full Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1.5px solid var(--border)", fontSize: 15, outline: "none", transition: "all .2s", background: "rgba(255,255,255,0.8)", boxSizing: "border-box" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--green)"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(46,201,114,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.background = "rgba(255,255,255,0.8)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={20} color="var(--text2)" style={{ position: "absolute", left: 16, top: 14 }} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: "100%", padding: "14px 16px 14px 48px", borderRadius: 14, border: "1.5px solid var(--border)", fontSize: 15, outline: "none", transition: "all .2s", background: "rgba(255,255,255,0.8)", boxSizing: "border-box" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--green)"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(46,201,114,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.background = "rgba(255,255,255,0.8)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={20} color="var(--text2)" style={{ position: "absolute", left: 16, top: 14 }} />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "14px 16px 14px 48px", borderRadius: 14, border: "1.5px solid var(--border)", fontSize: 15, outline: "none", transition: "all .2s", background: "rgba(255,255,255,0.8)", boxSizing: "border-box" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--green)"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(46,201,114,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.background = "rgba(255,255,255,0.8)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%", padding: 16, borderRadius: 14, border: "none",
                background: "linear-gradient(135deg, var(--green), var(--green-dark))",
                color: "#fff", fontWeight: 700, fontSize: 16,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 6px 16px rgba(46,201,114,0.3)", transition: "all .2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(46,201,114,0.4)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 6px 16px rgba(46,201,114,0.3)"}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              {isRegister ? "Create Account" : "Sign In"} <ArrowRight size={20} />
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "28px 0", color: "var(--text2)", fontSize: 13, fontWeight: 500 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ padding: "0 14px" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            style={{
              width: "100%", padding: 16, borderRadius: 14, border: "1.5px solid var(--border)",
              background: "#fff", color: "var(--text)", fontWeight: 600, fontSize: 15,
              cursor: isGoogleLoading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              transition: "all .2s", opacity: isGoogleLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => { if (!isGoogleLoading) e.currentTarget.style.background = "#f9fafb"; }}
            onMouseLeave={(e) => { if (!isGoogleLoading) e.currentTarget.style.background = "#fff"; }}
          >
            {isGoogleLoading ? (
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #e5e7eb", borderTopColor: "#4285F4", animation: "spin 1s linear infinite" }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {isGoogleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: "var(--text2)" }}>
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <span
              onClick={() => setIsRegister(!isRegister)}
              style={{ color: "var(--green)", fontWeight: 700, cursor: "pointer", marginLeft: 8, transition: "color .2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--green-dark)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--green)"}
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </span>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      ` }} />
    </>
  );
}
