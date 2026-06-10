"use client";
import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, TrendingUp, User, Users, Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import Dashboard from "./components/Dashboard";
import Meals from "./components/Meals";
import Recipes from "./components/Recipes";
import MealPlan from "./components/MealPlan";
import Progress from "./components/Progress";
import Shopping from "./components/Shopping";
import Nutrition from "./components/Nutrition";
import Tips from "./components/Tips";
import Profile from "./components/Profile";
import Community from "./components/Community";
import Settings from "./components/Settings";
import HelpSupport from "./components/HelpSupport";
import VoiceAssistant from "./components/VoiceAssistant";
import Calculator from "./components/Calculator";
import Notifications, { Notification } from "./components/Notifications";
import SleepTracker from "./components/SleepTracker";
import Reports from "./components/Reports";
import WorkoutPlans from "./components/WorkoutPlans";
import LogoutManager from "./components/LogoutManager";
import confetti from "canvas-confetti";

export type UserType = {
  name: string;
  email: string;
  initials: string;
};

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

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard", meals: "Meal Log", recipes: "Recipes",
  wishlist: "My Wishlist", mealplan: "Meal Plan", progress: "My Progress",
  shopping: "Shopping List", nutrition: "Nutrition Hub", tips: "Health Tips",
  settings: "Settings", community: "Community & Friends", calculator: "Macro Calculator",
  sleep: "Sleep Tracker",
  reports: "Reports & Analytics",
  workout: "Workout Plans",
  help: "Help & Support",
};

// Bottom nav items (5 most used)
const bottomNavItems = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "meals", label: "Meals", icon: UtensilsCrossed },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "community", label: "Community", icon: Users },
  { id: "profile", label: "Profile", icon: User },
];

export default function Home() {
  const { user: clerkUser, isLoaded } = useUser();
  const router = useRouter();

  // Redirect unauthenticated users to sign-in (client-side guard)
  useEffect(() => {
    if (isLoaded && !clerkUser) {
      router.replace("/sign-in");
    }
  }, [isLoaded, clerkUser, router]);

  // Sync logged-in user to Neon DB (runs once per session when user is resolved)
  useEffect(() => {
    if (!isLoaded || !clerkUser) return;
    // Fire-and-forget: silently upserts the user into our Neon DB
    // The API route checks if they already exist first, so this is safe to call every login
    fetch("/api/auth/callback").catch((err) =>
      console.error("Failed to sync user to DB:", err)
    );
  }, [isLoaded, clerkUser]);

  const user: UserType = clerkUser ? {
    name: clerkUser.fullName || clerkUser.firstName || "User",
    email: clerkUser.primaryEmailAddress?.emailAddress || "",
    initials: (clerkUser.firstName?.charAt(0) || "U").toUpperCase(),
  } : {
    name: "Guest",
    email: "guest@nutrilife.com",
    initials: "G"
  };

  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Meal Logged Successfully",
      message: "Your breakfast (Oatmeal with berries) has been logged and added to your daily nutrition.",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Daily Goal Progress",
      message: "You've consumed 1,850 calories today. You have 650 calories remaining to reach your goal.",
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Water Intake Reminder",
      message: "Remember to drink water! You've only had 4 glasses today. Try to reach 8 glasses by evening.",
      timestamp: new Date(Date.now() - 45 * 60000),
      read: true,
    },
    {
      id: "4",
      type: "success",
      title: "Weekly Goal Achieved",
      message: "Congratulations! You've completed your weekly exercise goal of 150 minutes.",
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
    },
  ]);

  const showToast = useCallback((msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }, []);

  // Background slideshow
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Welcome Popup & Confetti — show ONCE per user account using localStorage
  useEffect(() => {
    if (!isLoaded || !clerkUser) return;
    // Use a per-user key so each account gets their own first-time flag
    const storageKey = `nutrilife_welcomed_${clerkUser.id}`;
    if (localStorage.getItem(storageKey)) return; // already seen it, skip
    localStorage.setItem(storageKey, "true");
    setShowWelcome(true);

    const createdAt = clerkUser.createdAt ? new Date(clerkUser.createdAt).getTime() : 0;
    const isNewUser = Date.now() - createdAt < 24 * 60 * 60 * 1000;
    if (isNewUser) {
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#2EC972', '#FFD166', '#FF6B35'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#2EC972', '#FFD166', '#FF6B35'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [isLoaded, clerkUser]);

  const addNotification = useCallback((notif: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(notif.title);
  }, [showToast]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast("All notifications cleared");
  };

  const handleSearch = (query: string) => {
    if (query.length > 2) {
      showToast(`Searching for "${query}"…`);
      addNotification({
        type: "info",
        title: "Search",
        message: `You searched for "${query}". Results from Meals, Recipes, and Tips are being displayed.`,
      });
    }
  };

  // (Removed recurring "Welcome Back!" notification — it was firing on every page load)

  // Show branded loading/redirect screen while Clerk resolves auth
  if (!isLoaded || !clerkUser) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0f2d14 0%, #1a4d2e 60%, #0a1f0d 100%)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'Clash Display', sans-serif", fontSize: 42, fontWeight: 700,
            color: "#fff", marginBottom: 8, letterSpacing: "-0.5px",
          }}>
            Nutri<span style={{ color: "#FF6B35" }}>Life</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginBottom: 32 }}>
            Your Healthy Diet Companion
          </p>
          {/* Spinner */}
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.2)",
            borderTopColor: "#2EC972",
            animation: "nlSpin 0.8s linear infinite",
            margin: "0 auto",
          }} />
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes nlSpin { to { transform: rotate(360deg); } }
        ` }} />
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard showToast={showToast} user={user} onNav={setPage} />;
      case "meals":     return <Meals showToast={showToast} />;
      case "recipes":   return <Recipes showToast={showToast} />;
      case "wishlist":  return <Recipes showToast={showToast} defaultFilter="Wishlist" />;
      case "mealplan":  return <MealPlan />;
      case "progress":  return <Progress showToast={showToast} />;
      case "shopping":  return <Shopping showToast={showToast} />;
      case "nutrition": return <Nutrition />;
      case "calculator": return <Calculator />;
      case "sleep":      return <SleepTracker showToast={showToast} />;
      case "reports":    return <Reports showToast={showToast} />;
      case "workout":    return <WorkoutPlans showToast={showToast} />;
      case "tips":      return <Tips />;
      case "help":      return <HelpSupport showToast={showToast} />;
      case "community": return <Community showToast={showToast} user={user} />;
      case "settings":  return <Settings showToast={showToast} user={user} />;
      case "profile":   return <Profile showToast={showToast} user={user} onLogout={() => setShowLogoutModal(true)} />;
      default:          return <Dashboard showToast={showToast} user={user} onNav={setPage} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Sidebar overlay backdrop (mobile) */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        active={page}
        onNav={setPage}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => setShowLogoutModal(true)}
      />

      <main className="nutrilife-main" style={{ marginLeft: 240, minHeight: "100vh", position: "relative" }}>

        {/* Background image slides */}
        {BACKGROUND_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className="bg-slide-panel"
            style={{
              position: "fixed",
              top: 0,
              left: 240,
              right: 0,
              bottom: 0,
              backgroundImage: `url('${img}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: bgIndex === idx ? 0.15 : 0,
              transition: "opacity 2s ease-in-out",
              zIndex: -1,
            }}
          />
        ))}

        {/* Topbar */}
        <div
          className="nutrilife-topbar"
          style={{
            background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(16px)",
            borderBottom: "1.5px solid rgba(0,0,0,0.05)",
            padding: "18px 32px", display: "flex", alignItems: "center", gap: 16,
            position: "sticky", top: 0, zIndex: 50
          }}
        >
          {/* Hamburger (mobile only) */}
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} color="var(--text)" />
          </button>

          <div
            className="nutrilife-topbar-title"
            style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 22, fontWeight: 700, flex: 1 }}
          >
            {PAGE_TITLES[page]}
          </div>

          {/* Search bar (hidden on mobile) */}
          <div
            className="nutrilife-search-bar"
            style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: 30, padding: "8px 16px", width: 240 }}
          >
            <span>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && search.length > 2) handleSearch(search);
              }}
              placeholder="Search anything..."
              style={{ border: "none", background: "none", outline: "none", fontSize: 14, color: "var(--text)", width: "100%" }}
            />
          </div>

          {/* Notification bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "1.5px solid var(--border)", background: "#fff",
              cursor: "pointer", fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", transition: "all 0.2s", flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: -2, right: -2,
                width: 20, height: 20, borderRadius: "50%",
                background: "var(--orange)", border: "2px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 600, color: "#fff",
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div
            onClick={() => setPage("profile")}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--green), var(--green-dark))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", flexShrink: 0,
            }}
            title={user.name}
          >
            {user.initials}
          </div>
        </div>

        {/* Page content */}
        <div className="nutrilife-content" style={{ padding: 32 }}>
          {renderPage()}
        </div>
      </main>

      {/* Bottom navigation (mobile only) */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {bottomNavItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`bottom-nav-item${page === id ? " active" : ""}`}
            onClick={() => setPage(id)}
            aria-label={label}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <Toast msg={toast.msg} show={toast.show} />
      <Notifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onClearAll={clearAllNotifications}
      />
      <VoiceAssistant />

      {/* Welcome Popup */}
      {showWelcome && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
          animation: "fadeIn 0.3s ease", padding: "16px",
        }}>
          <div style={{
            background: "#fff", width: "90%", maxWidth: 450, borderRadius: "24px", padding: 32,
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)", position: "relative",
            animation: "slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", textAlign: "center"
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>👋</div>
            <h2 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--green-dark)", marginBottom: 12 }}>
              Welcome Back, {user?.name.split(' ')[0]}!
            </h2>
            <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
              We're thrilled to see you again. Check out your dashboard to see your daily progress, or dive into some new recipes for the week!
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              style={{
                width: "100%", padding: "14px", borderRadius: 30, background: "var(--green)",
                color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
                boxShadow: "0 8px 24px rgba(46,201,114,0.3)", transition: "all .2s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Let's Go! 🚀
            </button>
          </div>
        </div>
      )}
      
      <LogoutManager showLogoutModal={showLogoutModal} setShowLogoutModal={setShowLogoutModal} />
    </>
  );
}
