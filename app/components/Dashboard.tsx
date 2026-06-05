"use client";
import { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";

import { UserType } from "../page";
import Modal from "./Modal";

const statCards = [
  { icon: "🔥", val: "1,560", lbl: "Calories Today", change: "440 remaining", up: true, page: "meals" },
  { icon: "💧", val: "1.5L", lbl: "Water Intake", change: "0.5L to go", up: true, page: "dashboard" },
  { icon: "👣", val: "7,240", lbl: "Steps Today", change: "2,760 to goal", up: false, page: "progress" },
  { icon: "😴", val: "7.5h", lbl: "Sleep Last Night", change: "Good quality", up: true, page: "progress" },
  { icon: "⚖️", val: "72.4 kg", lbl: "Current Weight", change: "↓ 0.3kg this week", up: true, page: "progress" },
  { icon: "💪", val: "320 kcal", lbl: "Calories Burned", change: "Exercise today", up: true, page: "meals" },
  { icon: "🎯", val: "78%", lbl: "Goal Progress", change: "On track!", up: true, page: "progress" },
  { icon: "🔥", val: "12 days", lbl: "Current Streak", change: "Personal best!", up: true, page: "progress" },
];

const activities = [
  { icon: "🏃", name: "Morning Run", detail: "30 min · 4.2 km", cal: "-280 kcal" },
  { icon: "🧘", name: "Yoga Session", detail: "20 min · Flexibility", cal: "-80 kcal" },
  { icon: "🚴", name: "Cycling (evening)", detail: "45 min · 12 km", cal: "-360 kcal" },
  { icon: "🏊", name: "Swimming", detail: "25 min · Freestyle", cal: "-220 kcal" },
];

const streakDays = [
  { label: "M", done: true },
  { label: "T", done: true },
  { label: "W", done: true },
  { label: "T", done: true },
  { label: "F", done: true },
  { label: "S", today: true },
  { label: "S", done: false },
];

const MOTIVATIONAL_THOUGHTS_BY_DAY = [
  [
    { time: "08:00 AM", title: "Sunday Reset", content: "Plan your meals today to set yourself up for success this week! 📝" },
    { time: "01:00 PM", title: "Mindful Eating", content: "Take it slow. Enjoy the flavors and textures of your Sunday lunch. 🥗" },
    { time: "06:00 PM", title: "Rest & Recover", content: "A good week starts with a good night's sleep. Wind down and relax. 🌙" },
  ],
  [
    { time: "08:00 AM", title: "Monday Momentum", content: "New week, new goals. Every healthy choice today builds momentum! 🚀" },
    { time: "01:00 PM", title: "Fuel Up", content: "Keep your energy steady. Choose proteins and complex carbs for lunch! 🥑" },
    { time: "06:00 PM", title: "Strong Finish", content: "You crushed Monday! Keep this positive energy going into tomorrow. 💪" },
  ],
  [
    { time: "08:00 AM", title: "Consistent Tuesday", content: "Motivation gets you started, habit keeps you going. Stick to the plan! 📈" },
    { time: "01:00 PM", title: "Hydration Check", content: "Have you drank enough water today? Hydration is key to fat loss. 💧" },
    { time: "06:00 PM", title: "Evening Reflection", content: "Consistency is key. Be proud of the healthy choices you made today. 🌙" },
  ],
  [
    { time: "08:00 AM", title: "Mid-week Push", content: "Hump day! You are stronger than your cravings. You've got this! 🔥" },
    { time: "01:00 PM", title: "Colorful Plate", content: "Try to eat the rainbow today. More colors mean more nutrients! 🌈" },
    { time: "06:00 PM", title: "Keep Going", content: "Half the week is done. Don't slow down now, finish strong! 🏃‍♂️" },
  ],
  [
    { time: "08:00 AM", title: "Thankful Thursday", content: "Appreciate your body for all it does. Nourish it well today! 🌿" },
    { time: "01:00 PM", title: "Smart Snacking", content: "If you're hungry, reach for fruit or nuts instead of processed snacks. 🍎" },
    { time: "06:00 PM", title: "Progress Over Perfection", content: "Don't stress small slip-ups. Just get right back on track! 🎯" },
  ],
  [
    { time: "08:00 AM", title: "Focus Friday", content: "The weekend is near, but stay focused on your goals today! ☀️" },
    { time: "01:00 PM", title: "Portion Control", content: "Listen to your body's fullness signals. Stop when you're satisfied. 🍽️" },
    { time: "06:00 PM", title: "Weekend Ready", content: "Going out tonight? Make smart swaps and enjoy yourself mindfully! 🎉" },
  ],
  [
    { time: "08:00 AM", title: "Active Saturday", content: "Get outside! A morning walk or workout sets a great tone for the weekend. 🚴‍♀️" },
    { time: "01:00 PM", title: "Balance is Key", content: "It's okay to treat yourself occasionally. Balance is a sustainable diet. ⚖️" },
    { time: "06:00 PM", title: "Celebrate Wins", content: "Look back at the week. Celebrate every small victory you achieved! 🏆" },
  ],
];

export default function Dashboard({ showToast, user, onNav }: { showToast: (msg: string) => void; user?: UserType; onNav?: (page: string) => void }) {
  const [water, setWater] = useState(6);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const todayThoughts = MOTIVATIONAL_THOUGHTS_BY_DAY[new Date().getDay()];

  const addWater = () => {
    if (water < 8) { setWater(w => w + 1); showToast("💧 Water logged!"); }
  };
  const resetWater = () => setWater(0);

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      {/* Banner */}
      <div
        className="dashboard-banner"
        style={{
          background: "linear-gradient(120deg, var(--green-dark) 0%, var(--green) 60%, #80e8b0 100%)",
          borderRadius: "var(--radius)", padding: "36px 40px", color: "#fff",
          marginBottom: 28, position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", fontSize: 80, opacity: 0.22 }}>🌿</div>
        <h2 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          Good morning, {user ? user.name.split(" ")[0] : "Aarav"}! 👋
        </h2>
        <p style={{ fontSize: 15, opacity: 0.85 }}>You're on a 12-day streak! Keep up the great work.</p>
        <div className="banner-stats" style={{ display: "flex", gap: 18, marginTop: 20, flexWrap: "wrap" }}>
          {[{ val: "1560", lbl: "kcal eaten" }, { val: "440", lbl: "kcal left" }, { val: "320", lbl: "kcal burned" }, { val: "6/8", lbl: "cups water" }].map(s => (
            <div key={s.lbl} className="banner-stat" style={{ background: "rgba(255,255,255,.18)", borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 70 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{s.val}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid — 4 cols desktop, 2 cols mobile */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 28 }}>
        {statCards.map(s => (
          <div key={s.lbl} className="card-hover" onClick={() => setActiveCard(s.lbl)} style={{
            background: "var(--card)", borderRadius: "var(--radius-sm)", padding: "22px 20px",
            border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", cursor: "pointer",
          }}>
            <div style={{ fontSize: 26 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 22, fontWeight: 700, marginTop: 8 }}>{s.val}</div>
            <div style={{ fontSize: 13, color: "var(--text2)" }}>{s.lbl}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: s.up ? "var(--green)" : "var(--orange)", marginTop: 4 }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Calorie ring + Water tracker — 2 cols desktop, 1 col mobile */}
      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 28 }}>
        {/* Calorie Ring */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🎯 Today's Calories</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <svg width={160} height={160} viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
              <circle cx="80" cy="80" r="60" fill="none" stroke="var(--green-light)" strokeWidth={14} />
              <circle cx="80" cy="80" r="60" fill="none" stroke="var(--green)" strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - 0.78)}`}
                style={{ transform: "rotate(-90deg)", transformOrigin: "80px 80px", transition: "stroke-dashoffset 1.2s" }}
              />
              <text x="80" y="76" textAnchor="middle" style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 22, fontWeight: 700, fill: "var(--text)" }}>1,560</text>
              <text x="80" y="94" textAnchor="middle" style={{ fontSize: 11, fill: "var(--text2)" }}>of 2,000 kcal</text>
            </svg>
            <div style={{ flex: 1, minWidth: 140 }}>
              {[
                { name: "Protein", val: "112g / 150g", pct: 75, color: "var(--orange)" },
                { name: "Carbs", val: "188g / 250g", pct: 75, color: "#FFD166" },
                { name: "Fat", val: "42g / 65g", pct: 65, color: "var(--purple)" },
                { name: "Fiber", val: "22g / 30g", pct: 73, color: "var(--green)" },
              ].map(m => (
                <div key={m.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500 }}>{m.name}</span>
                    <span style={{ color: "var(--text2)", fontSize: 12 }}>{m.val}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Water Tracker */}
        <div id="water-tracker" style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>💧 Water Tracker</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`water-cup ${i < water ? "filled" : ""}`}
                onClick={() => { setWater(i + 1); showToast("💧 Water logged!"); }}
              >
                {i < water ? "💧" : ""}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600, marginBottom: 16 }}>
            {water} of 8 cups ({(water * 0.25).toFixed(1)}L of 2L)
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={addWater} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: "var(--blue)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <Plus size={14} /> Add Cup
            </button>
            <button onClick={resetWater} style={{ padding: "8px 16px", borderRadius: 20, border: "1.5px solid var(--border)", background: "#fff", color: "var(--text2)", fontWeight: 600, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Activities + Daily Goals — 2 cols desktop, 1 col mobile */}
      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 28 }}>
        {/* Activities */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🏃 Today's Activities</div>
          {activities.map(a => (
            <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {a.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{a.detail}</div>
              </div>
              <div style={{ fontWeight: 700, color: "var(--orange)", fontSize: 14, flexShrink: 0 }}>{a.cal}</div>
            </div>
          ))}
          <button onClick={() => showToast("Activity logged!")} style={{ marginTop: 14, padding: "8px 18px", borderRadius: 20, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            + Log Activity
          </button>
        </div>

        {/* Daily Goals */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🎯 Daily Goals</div>
          {[
            { label: "Calories", val: "1560/2000 kcal", pct: 78, color: "var(--green)" },
            { label: "Protein", val: "112/150g", pct: 75, color: "var(--orange)" },
            { label: "Water", val: "1.5/2L", pct: 75, color: "#2196F3" },
            { label: "Steps", val: "7240/10000", pct: 72, color: "var(--purple)" },
            { label: "Sleep", val: "7.5/8h", pct: 94, color: "#FFD166" },
            { label: "Exercise", val: "45/60 min", pct: 75, color: "var(--orange)" },
          ].map(g => (
            <div key={g.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
                <span>{g.label}</span><span style={{ color: "var(--text2)" }}>{g.val}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${g.pct}%`, background: g.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak + Thoughts — 2 cols desktop, 1 col mobile */}
      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 28 }}>
        {/* Streak */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🔥 Weekly Streak</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {streakDays.map((d, i) => (
              <div key={i} className={`streak-dot ${d.done ? "done" : d.today ? "today" : ""}`}>
                {d.label}
              </div>
            ))}
            <span style={{ marginLeft: 8, fontSize: 13, color: "var(--text2)" }}>5 days on track 🎉</span>
          </div>
        </div>

        {/* Motivational Timeline */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>✨ Thought of the Moment</div>
          <div style={{ position: "relative", paddingLeft: 20 }}>
            <div style={{ position: "absolute", left: 7, top: 10, bottom: 10, width: 2, background: "var(--border)" }} />
            {todayThoughts.map((thought, i) => (
              <div key={i} style={{ position: "relative", marginBottom: i === todayThoughts.length - 1 ? 0 : 22 }}>
                <div style={{
                  position: "absolute", left: -21, top: 4, width: 12, height: 12,
                  borderRadius: "50%", background: i === 1 ? "var(--green)" : "var(--green-light)",
                  border: "2px solid var(--card)", boxShadow: "0 0 0 2px var(--green)",
                }} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 14.5 }}>{thought.title}</span>
                  <span style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>{thought.time}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>
                  {thought.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeCard && (
        <Modal title={`${activeCard} Details`} onClose={() => setActiveCard(null)}>
          <div style={{ padding: "20px 10px", textAlign: "center" }}>
            {activeCard === "Calories Today" && (
              <div><div style={{ fontSize: 32, marginBottom: 12 }}>🔥</div><h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>1,560 kcal consumed</h4><p style={{ color: "var(--text2)", lineHeight: 1.5 }}>You have 440 kcal remaining for today. Great job keeping on track!</p></div>
            )}
            {activeCard === "Water Intake" && (
              <div><div style={{ fontSize: 32, marginBottom: 12 }}>💧</div><h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>1.5L / 2.0L</h4><p style={{ color: "var(--text2)", lineHeight: 1.5 }}>You need about 2 more glasses of water to hit your daily goal.</p></div>
            )}
            {activeCard === "Steps Today" && (
              <div><div style={{ fontSize: 32, marginBottom: 12 }}>👣</div><h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>7,240 Steps</h4><p style={{ color: "var(--text2)", lineHeight: 1.5 }}>Keep moving! You're just 2,760 steps away from your 10,000 step goal.</p></div>
            )}
            {activeCard === "Sleep Last Night" && (
              <div><div style={{ fontSize: 32, marginBottom: 12 }}>😴</div><h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>7.5 hours</h4><p style={{ color: "var(--text2)", lineHeight: 1.5 }}>Your sleep quality was "Good". You had 2 hours of Deep Sleep.</p></div>
            )}
            {activeCard === "Current Weight" && (
              <div><div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div><h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>72.4 kg</h4><p style={{ color: "var(--text2)", lineHeight: 1.5 }}>You've lost 0.3kg this week. Steady progress is the best kind!</p></div>
            )}
            {activeCard === "Calories Burned" && (
              <div><div style={{ fontSize: 32, marginBottom: 12 }}>💪</div><h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>320 kcal burned</h4><p style={{ color: "var(--text2)", lineHeight: 1.5 }}>You earned this through your Morning Run and Yoga Session today.</p></div>
            )}
            {activeCard === "Goal Progress" && (
              <div><div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div><h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>78% to Target</h4><p style={{ color: "var(--text2)", lineHeight: 1.5 }}>You are well on your way to hitting your target weight in the next 3 weeks!</p></div>
            )}
            {activeCard === "Current Streak" && (
              <div><div style={{ fontSize: 32, marginBottom: 12 }}>🔥</div><h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>12 Days</h4><p style={{ color: "var(--text2)", lineHeight: 1.5 }}>This is your personal best streak! Don't break the chain tomorrow!</p></div>
            )}
          </div>
          <button onClick={() => setActiveCard(null)} style={{ width: "100%", padding: 12, borderRadius: 20, border: "none", background: "var(--green)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 12 }}>
            Awesome!
          </button>
        </Modal>
      )}
    </div>
  );
}
