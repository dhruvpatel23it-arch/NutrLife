"use client";
import { LayoutDashboard, UtensilsCrossed, BookOpen, CalendarDays, TrendingUp, ShoppingCart, Info, Lightbulb, User, Users, Target, Heart, Moon, BarChart2, Dumbbell, Settings, HelpCircle, X, LogOut } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "meals", label: "Meal Log", icon: UtensilsCrossed, badge: "3" },
  { id: "recipes", label: "Recipes", icon: BookOpen },
  { id: "wishlist", label: "My Wishlist", icon: Heart },
  { id: "mealplan", label: "Meal Plan", icon: CalendarDays },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "sleep", label: "Sleep Tracker", icon: Moon },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "workout", label: "Workout Plans", icon: Dumbbell },
  { id: "community", label: "Community", icon: Users, badge: "New" },
  { id: "shopping", label: "Shopping List", icon: ShoppingCart, badge: "5" },
  { id: "nutrition", label: "Nutrition Info", icon: Info },
  { id: "calculator", label: "Calculator", icon: Target },
  { id: "tips", label: "Health Tips", icon: Lightbulb },
  { id: "help", label: "Help & Support", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

import { UserType } from "../page";

export default function Sidebar({
  active,
  onNav,
  user,
  isOpen,
  onClose,
  onLogout,
}: {
  active: string;
  onNav: (id: string) => void;
  user?: UserType;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}) {
  const handleNav = (id: string) => {
    onNav(id);
    // Close sidebar on mobile after navigating
    if (onClose) onClose();
  };

  return (
    <aside
      className={`nutrilife-sidebar${isOpen ? " open" : ""}`}
      style={{
        position: "fixed", left: 0, top: 0, height: "100vh", width: 240,
        background: "#fff", borderRight: "1.5px solid var(--border)",
        display: "flex", flexDirection: "column", zIndex: 100,
        boxShadow: "4px 0 24px rgba(46,201,114,0.07)",
        overflowY: "auto",
      }}
    >
      {/* Logo + Close Button (mobile) */}
      <div style={{
        padding: "28px 24px 18px",
        fontFamily: "'Clash Display', sans-serif", fontSize: 22, fontWeight: 700,
        color: "var(--green-dark)", borderBottom: "1.5px solid var(--border)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div>
          Nutri<span style={{ color: "var(--orange)" }}>Life</span>
          <div style={{ fontSize: 11, fontWeight: 400, color: "var(--text2)", marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>
            Your Healthy Diet Companion
          </div>
        </div>
        {/* Close button visible only on mobile via CSS */}
        <button
          onClick={onClose}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: 8,
            border: "1.5px solid var(--border)", background: "var(--bg)",
            cursor: "pointer", flexShrink: 0, marginTop: 2,
          }}
          className="sidebar-close-btn"
          aria-label="Close menu"
        >
          <X size={16} color="var(--text2)" />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        {navItems.map(({ id, label, icon: Icon, badge }, idx) => (
          <div
            key={id}
            onClick={() => handleNav(id)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 22px",
              cursor: "pointer", borderRadius: "0 30px 30px 0", marginRight: 16,
              fontSize: 14.5, fontWeight: active === id ? 600 : 500,
              color: active === id ? "#fff" : "var(--text2)",
              background: active === id ? "var(--green)" : "transparent",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              marginBottom: 2,
              animation: `sidebarItemEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.05}s backwards`,
            }}
            onMouseEnter={e => {
              if (active !== id) {
                e.currentTarget.style.background = "var(--green-light)";
                e.currentTarget.style.color = "var(--green-dark)";
                e.currentTarget.style.transform = "translateX(4px)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = active === id ? "var(--green)" : "transparent";
              e.currentTarget.style.color = active === id ? "#fff" : "var(--text2)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <Icon size={18} style={{ flexShrink: 0, transition: "transform 0.3s ease" }} />
            <span>{label}</span>
            {badge && (
              <span style={{
                background: "var(--orange)", color: "#fff", fontSize: 11, fontWeight: 700,
                padding: "2px 7px", borderRadius: 20, marginLeft: "auto",
                animation: "badgePulse 0.5s ease 0.3s",
              }}>{badge}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {user && (
        <div style={{
          padding: "18px 22px",
          borderTop: "1.5px solid var(--border)",
          animation: "fadeInUp 0.5s ease 0.5s backwards",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div
            onClick={() => handleNav("settings")}
            style={{
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flex: 1, minWidth: 0,
              padding: "8px 12px", borderRadius: "14px", marginLeft: "-12px",
              background: active === "settings" ? "var(--green-light)" : "transparent",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => { if (active !== "settings") e.currentTarget.style.background = "var(--bg)"; }}
            onMouseLeave={e => { if (active !== "settings") e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--green), var(--green-dark))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 16,
              boxShadow: "0 4px 12px rgba(46,201,114,0.3)",
              flexShrink: 0
            }}>{user.initials}</div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "var(--text2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                background: "none", border: "none", cursor: "pointer", color: "var(--text2)",
                padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "#FEF2F2"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.background = "none"; }}
              title="Log Out"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
