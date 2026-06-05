"use client";
import { useState } from "react";
import { UserType } from "../page";
import Modal from "./Modal";

// ─── Mock Data ───────────────────────────────────────────────
const REACTIONS = [
  { emoji: "👏", label: "Great Job" },
  { emoji: "🔥", label: "Keep Going" },
  { emoji: "💪", label: "You Can Do It" },
  { emoji: "🎯", label: "Almost There" },
];

const MOCK_FRIENDS = [
  { id: 1, name: "Priya Sharma", initials: "PS", avatar: "linear-gradient(135deg, #FF6B6B, #EE5A24)" },
  { id: 2, name: "Arjun Patel", initials: "AP", avatar: "linear-gradient(135deg, #6C5CE7, #A29BFE)" },
  { id: 3, name: "Neha Gupta", initials: "NG", avatar: "linear-gradient(135deg, #00B894, #55EFC4)" },
  { id: 4, name: "Rahul Verma", initials: "RV", avatar: "linear-gradient(135deg, #FDCB6E, #F39C12)" },
  { id: 5, name: "Sneha Iyer", initials: "SI", avatar: "linear-gradient(135deg, #E84393, #FD79A8)" },
  { id: 6, name: "Vikram Das", initials: "VD", avatar: "linear-gradient(135deg, #0984E3, #74B9FF)" },
];

const INITIAL_FEED = [
  { id: 1, user: MOCK_FRIENDS[0], time: "2 hours ago", type: "goal", text: "Just hit my 10,000 steps goal for the day! 🎉", reactions: { "👏": 5, "🔥": 3 } },
  { id: 2, user: MOCK_FRIENDS[1], time: "4 hours ago", type: "meal", text: "Logged a perfectly balanced meal – 450 kcal, 30g protein, 15g fiber 🥗", reactions: { "💪": 2 } },
  { id: 3, user: MOCK_FRIENDS[2], time: "6 hours ago", type: "streak", text: "🔥 20-day logging streak! Consistency is everything.", reactions: { "🔥": 8, "👏": 4, "🎯": 1 } },
  { id: 4, user: MOCK_FRIENDS[3], time: "Yesterday", type: "weight", text: "Lost 2kg this month! Slow and steady wins the race ⚖️", reactions: { "👏": 12, "💪": 6 } },
  { id: 5, user: MOCK_FRIENDS[4], time: "Yesterday", type: "photo", text: "3-month transformation! So proud of how far I've come 📷", reactions: { "👏": 20, "🔥": 15, "💪": 8, "🎯": 3 } },
  { id: 6, user: MOCK_FRIENDS[5], time: "2 days ago", type: "challenge", text: "Completed the 7-Day No Sugar Challenge! Who's next? 🏆", reactions: { "🔥": 10, "💪": 5 } },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: "Sneha Iyer", initials: "SI", avatar: MOCK_FRIENDS[4].avatar, points: 2450, streak: 28 },
  { rank: 2, name: "Neha Gupta", initials: "NG", avatar: MOCK_FRIENDS[2].avatar, points: 2180, streak: 22 },
  { rank: 3, name: "Vikram Das", initials: "VD", avatar: MOCK_FRIENDS[5].avatar, points: 1960, streak: 20 },
  { rank: 4, name: "You", initials: "YO", avatar: "linear-gradient(135deg, var(--green), var(--green-dark))", points: 1840, streak: 18 },
  { rank: 5, name: "Priya Sharma", initials: "PS", avatar: MOCK_FRIENDS[0].avatar, points: 1720, streak: 15 },
  { rank: 6, name: "Arjun Patel", initials: "AP", avatar: MOCK_FRIENDS[1].avatar, points: 1540, streak: 12 },
  { rank: 7, name: "Rahul Verma", initials: "RV", avatar: MOCK_FRIENDS[3].avatar, points: 1320, streak: 10 },
];

const CHALLENGES = [
  { id: 1, title: "7-Day No Sugar Challenge", emoji: "🍬", participants: 12, daysLeft: 4, progress: 43, joined: true },
  { id: 2, title: "10K Steps Daily", emoji: "🚶", participants: 8, daysLeft: 7, progress: 0, joined: false },
  { id: 3, title: "Drink 3L Water Challenge", emoji: "💧", participants: 15, daysLeft: 2, progress: 71, joined: true },
  { id: 4, title: "Cook Healthy 5 Days", emoji: "👨‍🍳", participants: 6, daysLeft: 5, progress: 0, joined: false },
];

const TEAM_GOALS = [
  { id: 1, title: "Team Burn 10,000 kcal", emoji: "🔥", members: [MOCK_FRIENDS[0], MOCK_FRIENDS[1], MOCK_FRIENDS[2]], progress: 67, target: "10,000 kcal", current: "6,700 kcal" },
  { id: 2, title: "Walk 100km Together", emoji: "🏃", members: [MOCK_FRIENDS[3], MOCK_FRIENDS[4]], progress: 45, target: "100 km", current: "45 km" },
];

const TABS = [
  { id: "feed", label: "📰 Progress Feed" },
  { id: "leaderboard", label: "🏆 Leaderboards" },
  { id: "challenges", label: "⚔️ Challenges" },
  { id: "referrals", label: "🎁 Referrals" },
];

interface FeedItem {
  id: number;
  user: {
    id: number;
    name: string;
    initials: string;
    avatar: string;
  };
  time: string;
  type: string;
  text: string;
  reactions: Record<string, number>;
}

// ─── Component ───────────────────────────────────────────────
export default function Community({ showToast, user }: { showToast: (msg: string) => void; user?: UserType }) {
  const [tab, setTab] = useState("feed");
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED as FeedItem[]);
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareText, setShareText] = useState("");
  const [sharePrivacy, setSharePrivacy] = useState<"private" | "friends" | "public">("friends");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState(1840);
  const [leaderboardType, setLeaderboardType] = useState<"points" | "streak">("points");

  // ─── Handlers ────────────────────────────────────────────
  const addReaction = (postId: number, emoji: string) => {
    setFeed(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const r = { ...p.reactions } as Record<string, number>;
      r[emoji] = (r[emoji] || 0) + 1;
      return { ...p, reactions: r };
    }));
  };

  const publishPost = () => {
    if (!shareText.trim()) return;
    const newPost = {
      id: Date.now(),
      user: { id: 0, name: user?.name || "You", initials: user?.initials || "YO", avatar: "linear-gradient(135deg, var(--green), var(--green-dark))" },
      time: "Just now",
      type: "goal" as const,
      text: shareText,
      reactions: {} as Record<string, number>,
    };
    setFeed([newPost, ...feed]);
    setShareText("");
    setShowShareModal(false);
    showToast("🎉 Goal shared with your community!");
  };

  const joinChallenge = (id: number) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, joined: true, participants: c.participants + 1 } : c));
    showToast("⚔️ Challenge joined! Good luck!");
  };

  const sendInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      showToast("Please enter a valid email address!");
      return;
    }
    setInvitedEmails([...invitedEmails, inviteEmail]);
    setUserPoints(prev => prev + 100);
    setInviteEmail("");
    showToast("✉️ Invite sent! You earned ⭐ 100 points!");
  };

  // ─── Styles ──────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: "var(--card)", borderRadius: "var(--radius)", padding: 24,
    border: "1.5px solid var(--border)", boxShadow: "var(--shadow)",
  };
  const sectionTitle: React.CSSProperties = {
    fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16,
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          👥 Community & Friends
        </h3>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Share goals, cheer friends, and stay motivated together.</p>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 28,
        background: "var(--card)", borderRadius: 16, padding: 6,
        border: "1.5px solid var(--border)", boxShadow: "var(--shadow)",
        overflowX: "auto", width: "100%",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 22px", borderRadius: 12, border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 14,
            background: tab === t.id ? "var(--green)" : "transparent",
            color: tab === t.id ? "#fff" : "var(--text2)",
            boxShadow: tab === t.id ? "0 4px 14px rgba(46,201,114,0.35)" : "none",
            transition: "all 0.25s ease",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════ TAB: FEED ═══════════════ */}
      {tab === "feed" && (
        <div style={{ animation: "fadeInUp 0.35s ease" }}>
          {/* Share Your Goal button */}
          <div style={{ ...cardStyle, marginBottom: 22, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--green), var(--green-dark))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0,
            }}>{user?.initials || "YO"}</div>
            <div
              onClick={() => setShowShareModal(true)}
              style={{
                flex: 1, padding: "12px 18px", borderRadius: 30,
                background: "var(--bg)", border: "1.5px solid var(--border)",
                color: "var(--text2)", fontSize: 14, cursor: "pointer",
              }}
            >
              Share your goal or update with friends...
            </div>
            <button onClick={() => setShowShareModal(true)} style={{
              padding: "10px 20px", borderRadius: 30, border: "none",
              background: "var(--green)", color: "#fff", fontWeight: 600,
              fontSize: 14, cursor: "pointer",
            }}>
              Share Goal 🎯
            </button>
          </div>

          {/* Feed items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {feed.map(post => (
              <div key={post.id} style={{ ...cardStyle, padding: 20 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", background: post.user.avatar,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0,
                  }}>{post.user.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{post.user.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{post.time}</div>
                  </div>
                  <span style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: post.type === "streak" ? "#fff3e0" : post.type === "weight" ? "#e8f5e9" : post.type === "photo" ? "#fce4ec" : "var(--green-light)",
                    color: post.type === "streak" ? "#e65100" : post.type === "weight" ? "#2e7d32" : post.type === "photo" ? "#c62828" : "var(--green-dark)",
                  }}>
                    {post.type === "goal" ? "🎯 Goal" : post.type === "meal" ? "🥗 Meal" : post.type === "streak" ? "🔥 Streak" : post.type === "weight" ? "⚖️ Weight" : post.type === "photo" ? "📷 Photo" : "⚔️ Challenge"}
                  </span>
                </div>
                {/* Content */}
                <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 14 }}>{post.text}</p>
                {/* Reactions bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {/* Existing reactions */}
                  {Object.entries(post.reactions).map(([emoji, count]) => (
                    <span key={emoji} onClick={() => addReaction(post.id, emoji)} style={{
                      padding: "4px 10px", borderRadius: 20, fontSize: 13,
                      background: "var(--green-light)", border: "1px solid var(--green)",
                      cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                    }}>
                      {emoji} {count as number}
                    </span>
                  ))}
                  {/* Add reaction buttons */}
                  <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                    {REACTIONS.map(r => (
                      <button key={r.emoji} title={r.label} onClick={() => addReaction(post.id, r.emoji)} style={{
                        width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)",
                        background: "#fff", cursor: "pointer", fontSize: 16,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.3)"; e.currentTarget.style.background = "var(--green-light)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#fff"; }}
                      >
                        {r.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ TAB: LEADERBOARD ═══════════════ */}
      {tab === "leaderboard" && (
        <div style={{ animation: "fadeInUp 0.35s ease" }}>
          {/* Toggle */}
          <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
            {(["points", "streak"] as const).map(t => (
              <button key={t} onClick={() => setLeaderboardType(t)} style={{
                padding: "8px 20px", borderRadius: 20, border: "1.5px solid var(--border)",
                background: leaderboardType === t ? "var(--green)" : "#fff",
                color: leaderboardType === t ? "#fff" : "var(--text2)",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}>
                {t === "points" ? "⭐ By Points" : "🔥 By Streak"}
              </button>
            ))}
          </div>

          {/* Podium */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16, marginBottom: 28 }}>
            {[LEADERBOARD_DATA[1], LEADERBOARD_DATA[0], LEADERBOARD_DATA[2]].map((p, idx) => {
              const heights = [140, 180, 120];
              const medals = ["🥈", "🥇", "🥉"];
              return (
                <div key={p.rank} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%", background: p.avatar, margin: "0 auto 8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: 18,
                    border: idx === 1 ? "3px solid gold" : "2px solid var(--border)",
                    boxShadow: idx === 1 ? "0 0 20px rgba(255,215,0,0.4)" : "none",
                  }}>{p.initials}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                  <div style={{
                    width: 80, height: heights[idx], borderRadius: "12px 12px 0 0",
                    background: idx === 1
                      ? "linear-gradient(to top, #f7b731, #fed330)"
                      : idx === 0
                        ? "linear-gradient(to top, #a5b1c2, #d1d8e0)"
                        : "linear-gradient(to top, #cd6133, #e17055)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700,
                  }}>
                    <div style={{ fontSize: 28 }}>{medals[idx]}</div>
                    <div style={{ fontSize: 14 }}>{leaderboardType === "points" ? `${p.points} pts` : `${p.streak} days`}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full list */}
          <div style={cardStyle}>
            <div style={sectionTitle}>🏆 Weekly Rankings</div>
            {(leaderboardType === "points"
              ? [...LEADERBOARD_DATA].sort((a, b) => b.points - a.points)
              : [...LEADERBOARD_DATA].sort((a, b) => b.streak - a.streak)
            ).map((p, idx) => (
              <div key={p.rank} style={{
                display: "flex", alignItems: "center", gap: 14,
                borderBottom: idx < LEADERBOARD_DATA.length - 1 ? "1px solid var(--border)" : "none",
                background: p.name === "You" ? "var(--green-light)" : "transparent",
                borderRadius: p.name === "You" ? 10 : 0,
                padding: p.name === "You" ? "12px 14px" : "12px 0",
                margin: p.name === "You" ? "4px -14px" : 0,
              }}>
                <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 18, fontWeight: 700, width: 30, textAlign: "center", color: idx < 3 ? "var(--green-dark)" : "var(--text2)" }}>
                  {idx + 1}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", background: p.avatar,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>{p.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name} {p.name === "You" && <span style={{ color: "var(--green)", fontSize: 12 }}>(That's you!)</span>}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--green-dark)" }}>
                    {leaderboardType === "points" ? `${p.points} pts` : `${p.streak} days`}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>
                    {leaderboardType === "points" ? `${p.streak}-day streak` : `${p.points} pts`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ TAB: CHALLENGES ═══════════════ */}
      {tab === "challenges" && (
        <div style={{ animation: "fadeInUp 0.35s ease" }}>
          {/* Active Challenges */}
          <div style={sectionTitle}>⚔️ Friend Challenges</div>
          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 28 }}>
            {challenges.map(c => (
              <div key={c.id} style={{ ...cardStyle }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 32 }}>{c.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{c.participants} participants · {c.daysLeft} days left</div>
                  </div>
                </div>
                {c.joined && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>
                      <span>Your Progress</span><span>{c.progress}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 10, background: "var(--bg)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${c.progress}%`, borderRadius: 10, background: "linear-gradient(90deg, var(--green), var(--green-dark))", transition: "width 1s ease" }} />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => !c.joined && joinChallenge(c.id)}
                  disabled={c.joined}
                  style={{
                    width: "100%", padding: "10px 0", borderRadius: 30, border: "none",
                    background: c.joined ? "var(--green-light)" : "var(--green)",
                    color: c.joined ? "var(--green-dark)" : "#fff",
                    fontWeight: 700, fontSize: 13, cursor: c.joined ? "default" : "pointer",
                  }}
                >
                  {c.joined ? "✓ Joined" : "Join Challenge"}
                </button>
              </div>
            ))}
          </div>

          {/* Team Goals */}
          <div style={sectionTitle}>👥 Team Goals</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {TEAM_GOALS.map(g => (
              <div key={g.id} style={{ ...cardStyle }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ fontSize: 36 }}>{g.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{g.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text2)" }}>{g.current} / {g.target}</div>
                  </div>
                  <div style={{ display: "flex" }}>
                    {g.members.map((m, i) => (
                      <div key={m.id} style={{
                        width: 32, height: 32, borderRadius: "50%", background: m.avatar,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 700, fontSize: 11,
                        border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0, zIndex: g.members.length - i,
                      }}>{m.initials}</div>
                    ))}
                  </div>
                </div>
                <div style={{ height: 10, borderRadius: 10, background: "var(--bg)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${g.progress}%`, borderRadius: 10, background: "linear-gradient(90deg, var(--green), var(--green-dark))", transition: "width 1s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "var(--text2)", marginTop: 6 }}>
                  <span>{g.progress}% complete</span>
                  <span>{g.members.length + 1} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ TAB: REFERRALS ═══════════════ */}
      {tab === "referrals" && (
        <div style={{ animation: "fadeInUp 0.35s ease" }}>
          {/* Hero */}
          <div style={{
            background: "linear-gradient(120deg, var(--green-dark) 0%, var(--green) 60%, #80e8b0 100%)",
            borderRadius: "var(--radius)", padding: "36px 40px", color: "#fff",
            marginBottom: 28, position: "relative", overflow: "hidden", textAlign: "center",
          }}>
            <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", fontSize: 80, opacity: 0.15 }}>🎁</div>
            <h2 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
              Invite Friends, Earn Rewards!
            </h2>
            <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 20, maxWidth: 500, margin: "0 auto 20px" }}>
              When your friends join NutriLife, you both win. Share the journey of health and fitness together!
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
              {[
                { icon: "⭐", val: "100", lbl: "Points Per Invite" },
                { icon: "🏅", val: "Special", lbl: "Badge Earned" },
                { icon: "🎁", val: "7 Days", lbl: "Premium Features" },
              ].map(r => (
                <div key={r.lbl} style={{ background: "rgba(255,255,255,0.18)", borderRadius: 14, padding: "14px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>{r.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{r.val}</div>
                  <div style={{ fontSize: 11, opacity: 0.85 }}>{r.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {/* Invite form */}
            <div style={cardStyle}>
              <div style={sectionTitle}>✉️ Invite a Friend</div>
              <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>Enter your friend's email address to send them an invitation.</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <input
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com"
                  type="email"
                  style={{ flex: 1, padding: "11px 16px", borderRadius: 30, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none" }}
                />
                <button onClick={sendInvite} style={{ padding: "10px 24px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Send Invite
                </button>
              </div>
              {invitedEmails.length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Invites Sent ({invitedEmails.length})</div>
                  {invitedEmails.map((email, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < invitedEmails.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <span style={{ fontSize: 18 }}>📧</span>
                      <span style={{ flex: 1, fontSize: 13 }}>{email}</span>
                      <span style={{ fontSize: 11, color: "var(--orange)", fontWeight: 600, background: "#fff3e0", padding: "3px 10px", borderRadius: 20 }}>Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Points balance */}
            <div style={cardStyle}>
              <div style={sectionTitle}>⭐ Your Points</div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 52, fontWeight: 700, color: "var(--green-dark)" }}>{userPoints}</div>
                <div style={{ fontSize: 14, color: "var(--text2)" }}>Total Points Earned</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { icon: "🏅", title: "Referral Champion", desc: invitedEmails.length > 0 ? "Unlocked!" : "Invite 1 friend", unlocked: invitedEmails.length > 0 },
                  { icon: "🌟", title: "Social Star", desc: "Share 5 goals", unlocked: false },
                  { icon: "🤝", title: "Team Player", desc: "Join 2 challenges", unlocked: true },
                  { icon: "💎", title: "Premium Member", desc: "7-day trial active", unlocked: invitedEmails.length > 0 },
                ].map((badge, i) => (
                  <div key={i} style={{
                    padding: 12, borderRadius: 10, textAlign: "center",
                    background: badge.unlocked ? "var(--green-light)" : "#f5f5f5",
                    border: `1.5px solid ${badge.unlocked ? "var(--green)" : "var(--border)"}`,
                    opacity: badge.unlocked ? 1 : 0.5,
                  }}>
                    <div style={{ fontSize: 24 }}>{badge.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 12, marginTop: 4 }}>{badge.title}</div>
                    <div style={{ fontSize: 10, color: badge.unlocked ? "var(--green)" : "var(--text2)", fontWeight: 600 }}>
                      {badge.unlocked ? "✓ Earned" : badge.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ SHARE GOAL MODAL ═══════════════ */}
      {showShareModal && (
        <Modal title="Share Your Goal 🎯" onClose={() => setShowShareModal(false)}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>What's your update?</label>
            <textarea
              value={shareText}
              onChange={e => setShareText(e.target.value)}
              placeholder="I just completed my morning workout! 💪"
              rows={4}
              style={{ width: "100%", padding: 14, borderRadius: 12, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical" }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text2)" }}>Privacy</label>
            <div style={{ display: "flex", gap: 8 }}>
              {([
                { val: "private", icon: "🔒", label: "Only Me" },
                { val: "friends", icon: "👥", label: "Friends Only" },
                { val: "public", icon: "🌎", label: "Public" },
              ] as const).map(p => (
                <button key={p.val} onClick={() => setSharePrivacy(p.val)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                  border: sharePrivacy === p.val ? "1.5px solid var(--green)" : "1.5px solid var(--border)",
                  background: sharePrivacy === p.val ? "var(--green-light)" : "#fff",
                  fontWeight: 600, fontSize: 13,
                  color: sharePrivacy === p.val ? "var(--green-dark)" : "var(--text2)",
                }}>
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={publishPost} style={{ width: "100%", padding: 14, borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            Share with {sharePrivacy === "private" ? "Only Me" : sharePrivacy === "friends" ? "Friends" : "Everyone"} 🚀
          </button>
        </Modal>
      )}

      {/* ═══════════════ INVITE MODAL (optional extra) ═══════════════ */}
      {showInviteModal && (
        <Modal title="Invite a Friend 🎁" onClose={() => setShowInviteModal(false)}>
          <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
            Share NutriLife with a friend. When they join, you both earn rewards!
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="friend@example.com"
              type="email"
              style={{ flex: 1, padding: "11px 16px", borderRadius: 30, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none" }}
            />
            <button onClick={() => { sendInvite(); setShowInviteModal(false); }} style={{ padding: "10px 24px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
              Send
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
