"use client";
import { useState } from "react";
import WeightProgress from "./WeightProgress";
import BodyMeasurements from "./BodyMeasurements";
import ProgressPhotos from "./ProgressPhotos";

const WEIGHT_DATA = [
  { month: "Jan", weight: 88.0 }, { month: "Feb", weight: 87.1 }, { month: "Mar", weight: 86.5 },
  { month: "Apr", weight: 85.0 }, { month: "May", weight: 82.0 }, { month: "Jun", weight: 79.8 },
];

const CALORIE_WEEK = [
  { day: "Mon", cal: 1890 }, { day: "Tue", cal: 1840 }, { day: "Wed", cal: 1950 },
  { day: "Thu", cal: 1820 }, { day: "Fri", cal: 2100 }, { day: "Sat", cal: 1780 }, { day: "Sun", cal: 0 },
];

const ACHIEVEMENTS = [
  { icon: "🥇", title: "First Week Complete", desc: "Logged meals 7 days in a row", unlocked: true },
  { icon: "💧", title: "Hydration Hero", desc: "Hit water goal 5 days straight", unlocked: true },
  { icon: "🔥", title: "10-Day Streak", desc: "10 consecutive tracked days", unlocked: true },
  { icon: "⚖️", title: "5kg Down", desc: "Lost your first 5 kilograms", unlocked: true },
  { icon: "🏃", title: "Step Master", desc: "10,000 steps in a single day", unlocked: false },
  { icon: "🥗", title: "Clean Eater", desc: "7 days under calorie goal", unlocked: false },
];

const TABS = [
  { id: "overview",      label: "📊 Overview",           desc: "Stats & achievements" },
  { id: "weight",        label: "📉 Weight Progress",     desc: "Graph & history" },
  { id: "measurements",  label: "📏 Body Measurements",   desc: "Chest · Waist · Hips · Arms" },
  { id: "photos",        label: "📷 Progress Photos",     desc: "Before & After" },
];

export default function Progress({ showToast }: { showToast: (msg: string) => void }) {
  const [tab, setTab] = useState("overview");

  // BMI state (overview tab)
  const [height, setHeight] = useState("172");
  const [weight, setWeight] = useState("79.8");
  const [bmiResult, setBmiResult] = useState<{ val: number; label: string } | null>(null);

  const calcBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return;
    const bmi = w / (h * h);
    const label = bmi < 18.5 ? "Underweight ⚠️" : bmi < 25 ? "Normal Weight ✅" : bmi < 30 ? "Overweight ⚠️" : "Obese ❌";
    setBmiResult({ val: parseFloat(bmi.toFixed(1)), label });
  };

  // Calorie Deficit state
  const [goalWeight, setGoalWeight] = useState("70");
  const [weeksToGoal, setWeeksToGoal] = useState("10");
  const [deficitResult, setDeficitResult] = useState<number | null>(null);

  const calcDeficit = () => {
    const wLoss = parseFloat(weight) - parseFloat(goalWeight);
    if (wLoss <= 0 || !parseFloat(weeksToGoal)) {
      showToast("Goal weight must be less than current weight!");
      return;
    }
    const totalDeficit = wLoss * 7700; // 7700 kcal per 1kg of fat
    const dailyDeficit = totalDeficit / (parseFloat(weeksToGoal) * 7);
    setDeficitResult(Math.round(dailyDeficit));
  };

  const maxW = Math.max(...WEIGHT_DATA.map(d => d.weight));
  const minW = Math.min(...WEIGHT_DATA.map(d => d.weight));
  const maxCal = Math.max(...CALORIE_WEEK.map(d => d.cal));

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          📊 My Progress
        </h3>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Track your weight, measurements, and achievements</p>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 28,
        background: "var(--card)", borderRadius: 16, padding: 6,
        border: "1.5px solid var(--border)", boxShadow: "var(--shadow)",
        overflowX: "auto", width: "100%",
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "10px 22px", borderRadius: 12, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 14,
              background: tab === t.id ? "var(--green)" : "transparent",
              color: tab === t.id ? "#fff" : "var(--text2)",
              boxShadow: tab === t.id ? "0 4px 14px rgba(46,201,114,0.35)" : "none",
              transition: "all 0.25s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === "overview" && (
        <div style={{ animation: "fadeInUp 0.35s ease" }}>
          {/* Stat cards */}
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 28 }}>
            {[
              { icon: "⚖️", val: "79.8 kg",  lbl: "Current Weight",    change: "↓ 8.2 kg since start", up: true },
              { icon: "🎯", val: "75 kg",     lbl: "Goal Weight",        change: "4.8 kg to go",         up: false },
              { icon: "📏", val: "26.9",      lbl: "BMI",                change: "Normal Range",          up: true },
              { icon: "🔥", val: "18 days",   lbl: "Streak",             change: "Personal best!",        up: true },
              { icon: "🏃", val: "47,200",    lbl: "Steps This Week",    change: "↑ 12% vs last",         up: true },
              { icon: "💪", val: "1,840 kcal",lbl: "Avg Burned/Week",    change: "Great effort!",         up: true },
              { icon: "💧", val: "87%",       lbl: "Hydration Score",    change: "Almost perfect",        up: true },
              { icon: "🥗", val: "94%",       lbl: "Meal Compliance",    change: "Excellent!",            up: true },
            ].map(s => (
              <div key={s.lbl} className="card-hover" style={{ background: "var(--card)", borderRadius: "var(--radius-sm)", padding: "22px 20px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
                <div style={{ fontSize: 26 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 22, fontWeight: 700, marginTop: 8 }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "var(--text2)" }}>{s.lbl}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: s.up ? "var(--green)" : "var(--orange)", marginTop: 4 }}>{s.change}</div>
              </div>
            ))}
          </div>

          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
            {/* Weight chart */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
              <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>📉 Weight History (6 months)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
                {WEIGHT_DATA.map((d, i) => {
                  const h = ((d.weight - minW) / (maxW - minW)) * 100 + 20;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 10, color: "var(--text2)", fontWeight: 600 }}>{d.weight}</div>
                      <div style={{ width: "100%", borderRadius: "6px 6px 0 0", background: "linear-gradient(to top, var(--green-dark), var(--green))", height: `${h}px`, minHeight: 4, transition: "height 1.2s" }} />
                      <div style={{ fontSize: 10, color: "var(--text2)" }}>{d.month}</div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setTab("weight")} style={{ marginTop: 16, padding: "7px 18px", borderRadius: 20, border: "1.5px solid var(--green)", background: "var(--green-light)", color: "var(--green-dark)", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                View Full Graph →
              </button>
            </div>

            {/* Calorie chart */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
              <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🔥 Calories This Week</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
                {CALORIE_WEEK.map((d, i) => {
                  const h = d.cal > 0 ? (d.cal / maxCal) * 110 + 10 : 4;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      {d.cal > 0 && <div style={{ fontSize: 9, color: "var(--text2)" }}>{d.cal}</div>}
                      <div style={{ width: "100%", borderRadius: "6px 6px 0 0", background: d.cal > 2000 ? "var(--orange)" : "linear-gradient(to top, var(--green-dark), var(--green))", height: `${h}px`, minHeight: 4 }} />
                      <div style={{ fontSize: 11, color: d.day === "Sun" ? "var(--text2)" : "var(--text)" }}>{d.day}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 10 }}>🟠 Orange bars = over daily goal</div>
            </div>
          </div>

          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {/* BMI Calculator */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
              <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>📏 BMI Calculator</div>
              {bmiResult && (
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 48, fontWeight: 700, color: "var(--green-dark)" }}>{bmiResult.val}</div>
                  <div style={{ fontWeight: 600, color: "var(--green)" }}>{bmiResult.label}</div>
                  <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", height: 10, margin: "14px 0 8px" }}>
                    <div style={{ flex: 1, background: "#64b5f6" }} />
                    <div style={{ flex: 1.5, background: "#81c784" }} />
                    <div style={{ flex: 1, background: "#ffb74d" }} />
                    <div style={{ flex: 1, background: "#e57373" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text2)" }}>
                    <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
                  </div>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Height (cm)</label>
                  <input value={height} onChange={e => setHeight(e.target.value)} type="number" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Weight (kg)</label>
                  <input value={weight} onChange={e => setWeight(e.target.value)} type="number" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                </div>
              </div>
              <button onClick={calcBMI} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, cursor: "pointer", width: "100%" }}>
                Calculate BMI
              </button>
            </div>

            {/* Achievements */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
              <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🏆 Achievements</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i} style={{
                    padding: "12px", borderRadius: 10,
                    background: a.unlocked ? "var(--green-light)" : "#f5f5f5",
                    border: `1.5px solid ${a.unlocked ? "var(--green)" : "var(--border)"}`,
                    opacity: a.unlocked ? 1 : 0.6,
                    display: "flex", gap: 10, alignItems: "flex-start",
                  }}>
                    <span style={{ fontSize: 22 }}>{a.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text2)" }}>{a.desc}</div>
                      {a.unlocked && <div style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, marginTop: 2 }}>✓ UNLOCKED</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Calorie Deficit Calculator */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", gridColumn: "1 / -1" }}>
              <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🧮 Daily Calorie Deficit Calculator</div>
              <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Current Weight (kg)</label>
                  <input value={weight} onChange={e => setWeight(e.target.value)} type="number" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Goal Weight (kg)</label>
                  <input value={goalWeight} onChange={e => setGoalWeight(e.target.value)} type="number" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Target Time (Weeks)</label>
                  <input value={weeksToGoal} onChange={e => setWeeksToGoal(e.target.value)} type="number" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                </div>
              </div>
              <button onClick={calcDeficit} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: deficitResult ? 16 : 0 }}>
                Calculate Required Deficit
              </button>
              
              {deficitResult !== null && (
                <div style={{ background: "var(--green-light)", borderRadius: 12, padding: 16, textAlign: "center", border: "1.5px solid var(--green)", animation: "fadeInUp 0.3s ease" }}>
                  <div style={{ fontSize: 14, color: "var(--green-dark)", fontWeight: 600, marginBottom: 4 }}>You need a daily calorie deficit of</div>
                  <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 36, fontWeight: 700, color: "var(--green-dark)" }}>{deficitResult} kcal</div>
                  <div style={{ fontSize: 13, color: "var(--green-dark)", opacity: 0.9, marginTop: 4 }}>to reach {goalWeight}kg in {weeksToGoal} weeks.</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick-nav cards */}
          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 22 }}>
            <div
              onClick={() => setTab("weight")}
              className="card-hover"
              style={{ background: "linear-gradient(135deg, #2EC972 0%, #1a9b52 100%)", borderRadius: 16, padding: "24px 28px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ fontSize: 40 }}>📉</div>
              <div>
                <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 18, fontWeight: 700 }}>Weight Progress</div>
                <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Interactive graph · Body silhouette · Log entries</div>
              </div>
            </div>
            <div
              onClick={() => setTab("measurements")}
              className="card-hover"
              style={{ background: "linear-gradient(135deg, #7B5EA7 0%, #5a3e8a 100%)", borderRadius: 16, padding: "24px 28px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ fontSize: 40 }}>📏</div>
              <div>
                <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 18, fontWeight: 700 }}>Body Measurements</div>
                <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Chest · Waist · Hips · Arms · Radar chart</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Weight Progress */}
      {tab === "weight" && (
        <div style={{ animation: "fadeInUp 0.35s ease" }}>
          <WeightProgress showToast={showToast} />
        </div>
      )}

      {/* Tab: Body Measurements */}
      {tab === "measurements" && (
        <div style={{ animation: "fadeInUp 0.35s ease" }}>
          <BodyMeasurements showToast={showToast} />
        </div>
      )}

      {/* Tab: Progress Photos */}
      {tab === "photos" && (
        <div style={{ animation: "fadeInUp 0.35s ease" }}>
          <ProgressPhotos showToast={showToast} />
        </div>
      )}
    </div>
  );
}
