"use client";

import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=1600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=1600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1501959915551-4e8d30928317?w=1600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=1600&q=85&fit=crop",
  "https://images.unsplash.com/photo-1457296898342-cdd24585d095?w=1600&q=85&fit=crop",
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

export default function SignInPage() {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px 100px 20px",
        background: "#1a4d2e",
        position: "relative",
        overflowX: "hidden",
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
          bottom: 24,
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
          bottom: 28,
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

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", width: "100%", maxWidth: 440 }}>
        {/* Logo above Clerk component */}
        <div
          style={{
            marginBottom: 32,
            animation: "fadeInUp 0.6s ease",
          }}
        >
          <div
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 42,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.5px",
              marginBottom: 8,
            }}
          >
            Nutri<span style={{ color: "#FF6B35" }}>Life</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 500 }}>
            Your Healthy Diet Companion
          </p>
        </div>

        {/* Clerk Sign In component */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SignIn
            forceRedirectUrl="/"
            appearance={{
              layout: {
                socialButtonsPlacement: "top",
              },
              elements: {
                formFieldRow: {
                  display: "none",
                },
                formButtonPrimary: {
                  display: "none",
                },
                dividerRow: {
                  display: "none",
                },
                rootBox: {
                  width: "100%",
                },
                headerTitle: {
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 700,
                },
                headerSubtitle: {
                  color: "#5a7a5a",
                },
                socialButtonsBlockButton: {
                  borderRadius: "14px",
                  border: "1.5px solid #e0f0e0",
                },
                footerActionLink: {
                  color: "#2EC972",
                  fontWeight: 700,
                },
              },
              variables: {
                colorPrimary: "#2EC972",
                colorText: "#1a2e1a",
                colorTextSecondary: "#5a7a5a",
                colorBackground: "#ffffff",
                borderRadius: "14px",
                fontFamily: "'DM Sans', sans-serif",
              },
            }}
          />
        </div>
      </div>

      {/* Keyframe animations & CSS fixes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        
        /* Hide Clerk's 'Last Used' badge to fix overlap */
        .cl-socialButtonsBlockButton [class*="badge"] {
          display: none !important;
        }
      ` }} />
    </div>
  );
}
