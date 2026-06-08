"use client";
import { useState, useEffect, useRef } from "react";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

// INACTIVITY_TIMEOUT in milliseconds (e.g., 15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export default function LogoutManager({ 
  showLogoutModal, 
  setShowLogoutModal 
}: { 
  showLogoutModal: boolean; 
  setShowLogoutModal: (show: boolean) => void; 
}) {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isAutoLogout, setIsAutoLogout] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsAutoLogout(true);
      setShowLogoutModal(true);
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    // Attach event listeners to reset inactivity timer
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setShowLogoutModal(false);
    router.replace("/sign-in");
  };

  if (!showLogoutModal) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease"
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: 32, width: "90%", maxWidth: 400,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)", textAlign: "center",
        animation: "scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px"
        }}>
          <LogOut size={32} color="#EF4444" />
        </div>
        
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", margin: "0 0 12px", fontFamily: "'Clash Display', sans-serif" }}>
          {isAutoLogout ? "Session Expired" : "Confirm Logout"}
        </h2>
        
        <p style={{ fontSize: 15, color: "var(--text2)", marginBottom: 28, lineHeight: 1.5 }}>
          {isAutoLogout 
            ? "You've been inactive for a while. To protect your privacy, you will be logged out."
            : "Are you sure you want to log out of your account? You will need to sign back in to access your data."}
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          {!isAutoLogout && (
            <button 
              onClick={() => setShowLogoutModal(false)}
              style={{
                flex: 1, padding: "14px", borderRadius: 14, border: "none",
                background: "var(--bg)", color: "var(--text)", fontWeight: 700, fontSize: 15,
                cursor: "pointer", transition: "all 0.2s"
              }}
            >
              Cancel
            </button>
          )}
          <button 
            onClick={handleLogout}
            style={{
              flex: 1, padding: "14px", borderRadius: 14, border: "none",
              background: "#EF4444", color: "#fff", fontWeight: 700, fontSize: 15,
              cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(239,68,68,0.3)"
            }}
          >
            {isAutoLogout ? "Log Out Now" : "Yes, Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
