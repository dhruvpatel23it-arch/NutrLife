"use client";
import { useState, useMemo } from "react";
import { Moon, Sun, Target, TrendingUp, Clock, Star, ChevronDown, Trash2, Plus } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SleepQuality = "Poor" | "Average" | "Good" | "Excellent";

interface SleepEntry {
  id: string;
  user_id: string;
  sleep_date: string;   // "YYYY-MM-DD"
  bed_time: string;     // "HH:MM"
  wake_time: string;    // "HH:MM"
  sleep_hours: number;  // decimal, e.g. 7.5
  sleep_quality: SleepQuality;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const QUALITY_CONFIG: Record<SleepQuality, { color: string; bg: string; stars: number; emoji: string }> = {
  Poor:      { color: "#EF4444", bg: "#FEF2F2", stars: 1, emoji: "😴" },
  Average:   { color: "#F59E0B", bg: "#FFFBEB", stars: 2, emoji: "😐" },
  Good:      { color: "#2EC972",  bg: "#F0FDF4", stars: 3, emoji: "😊" },
  Excellent: { color: "#6366F1", bg: "#EEF2FF", stars: 4, emoji: "🌟" },
};

function calcHours(bed: string, wake: string): number {
  if (!bed || !wake) return 0;
  const [bh, bm] = bed.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60; // overnight sleep
  return Math.round((mins / 60) * 10) / 10;
}

function formatHours(h: number): string {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
}

function dayLabel(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-IN", { weekday: "short" });
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── Sample seed data ─────────────────────────────────────────────────────────

function makeSeedData(): SleepEntry[] {
  const days: { offset: number; bed: string; wake: string; quality: SleepQuality }[] = [
    { offset: 6, bed: "23:00", wake: "06:45", quality: "Good" },
    { offset: 5, bed: "23:30", wake: "07:30", quality: "Excellent" },
    { offset: 4, bed: "00:15", wake: "06:15", quality: "Average" },
    { offset: 3, bed: "22:45", wake: "06:45", quality: "Excellent" },
    { offset: 2, bed: "23:00", wake: "08:00", quality: "Good" },
    { offset: 1, bed: "01:00", wake: "06:30", quality: "Poor" },
  ];
  return days.map(({ offset, bed, wake, quality }, i) => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    const date = d.toISOString().split("T")[0];
    return {
      id: `seed-${i}`,
      user_id: "demo",
      sleep_date: date,
      bed_time: bed,
      wake_time: wake,
      sleep_hours: calcHours(bed, wake),
      sleep_quality: quality,
    };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "20px 24px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
      display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", lineHeight: 1.1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// Weekly bar chart
function WeeklyChart({ entries, goal }: { entries: SleepEntry[]; goal: number }) {
  const last7 = useMemo(() => {
    const days: { date: string; label: string; hours: number; quality: SleepQuality | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = d.toISOString().split("T")[0];
      const entry = entries.find(e => e.sleep_date === date);
      days.push({
        date,
        label: d.toLocaleDateString("en-IN", { weekday: "short" }),
        hours: entry?.sleep_hours ?? 0,
        quality: entry?.sleep_quality ?? null,
      });
    }
    return days;
  }, [entries]);

  const maxH = Math.max(goal + 2, ...last7.map(d => d.hours), 1);

  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 24,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Weekly Overview</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text2)" }}>
          <div style={{ width: 12, height: 3, borderRadius: 2, background: "#F59E0B", borderTop: "2px dashed #F59E0B" }} />
          Goal: {goal}h
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
        {last7.map((day) => {
          const heightPct = day.hours > 0 ? (day.hours / maxH) * 100 : 0;
          const goalLineY = (goal / maxH) * 100;
          const cfg = day.quality ? QUALITY_CONFIG[day.quality] : null;
          const barColor = cfg ? cfg.color : "#e5e7eb";
          const isToday = day.date === todayStr();

          return (
            <div key={day.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
              {/* Goal line indicator */}
              <div style={{
                position: "absolute",
                bottom: `${goalLineY}%`,
                left: 0, right: 0, height: 2,
                background: "#F59E0B",
                borderRadius: 1,
                opacity: 0.5,
                zIndex: 1,
              }} />

              <div style={{ position: "relative", width: "100%", height: 140, display: "flex", alignItems: "flex-end" }}>
                {day.hours > 0 && (
                  <div style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 700, color: barColor, whiteSpace: "nowrap" }}>
                    {formatHours(day.hours)}
                  </div>
                )}
                <div style={{
                  width: "100%",
                  height: `${Math.max(heightPct, day.hours > 0 ? 4 : 0)}%`,
                  background: day.hours > 0
                    ? `linear-gradient(180deg, ${barColor}cc, ${barColor})`
                    : "#f3f4f6",
                  borderRadius: "8px 8px 4px 4px",
                  transition: "height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: isToday ? `0 0 0 2px ${barColor}` : "none",
                }} />
              </div>

              <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 500, color: isToday ? "var(--green)" : "var(--text2)" }}>
                {day.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Monthly report
function MonthlyReport({ entries, goal }: { entries: SleepEntry[]; goal: number }) {
  const stats = useMemo(() => {
    const now = new Date();
    const monthEntries = entries.filter(e => {
      const d = new Date(e.sleep_date + "T12:00:00");
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    if (monthEntries.length === 0) return null;
    const avg = monthEntries.reduce((s, e) => s + e.sleep_hours, 0) / monthEntries.length;
    const best = Math.max(...monthEntries.map(e => e.sleep_hours));
    const worst = Math.min(...monthEntries.map(e => e.sleep_hours));
    const onGoal = monthEntries.filter(e => e.sleep_hours >= goal).length;
    const qualityCounts: Record<SleepQuality, number> = { Poor: 0, Average: 0, Good: 0, Excellent: 0 };
    monthEntries.forEach(e => qualityCounts[e.sleep_quality]++);
    const topQuality = (Object.entries(qualityCounts) as [SleepQuality, number][]).sort((a, b) => b[1] - a[1])[0];
    return { avg, best, worst, onGoal, total: monthEntries.length, topQuality: topQuality[0] };
  }, [entries, goal]);

  const monthName = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a4d2e 0%, #2d7a47 100%)",
      borderRadius: 20, padding: 24,
      boxShadow: "0 4px 24px rgba(46,201,114,0.2)",
      color: "#fff",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <TrendingUp size={20} color="#fff" />
        <span style={{ fontWeight: 700, fontSize: 16 }}>Monthly Report — {monthName}</span>
      </div>

      {!stats ? (
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>No data logged this month yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {[
            { label: "Avg Sleep", value: formatHours(stats.avg) },
            { label: "Best Night", value: formatHours(stats.best) },
            { label: "Days on Goal", value: `${stats.onGoal}/${stats.total}` },
            { label: "Top Quality", value: `${QUALITY_CONFIG[stats.topQuality].emoji} ${stats.topQuality}` },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.12)", borderRadius: 14,
              padding: "14px 16px", backdropFilter: "blur(8px)",
            }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SleepTracker({ showToast }: { showToast: (msg: string) => void }) {
  const [entries, setEntries] = useState<SleepEntry[]>(makeSeedData);
  const [goal, setGoal] = useState(8);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("8");
  const [tab, setTab] = useState<"log" | "history" | "reports">("log");

  // Form state
  const [sleepDate, setSleepDate] = useState(todayStr());
  const [bedTime, setBedTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState<SleepQuality>("Good");

  const calculatedHours = useMemo(() => calcHours(bedTime, wakeTime), [bedTime, wakeTime]);

  // Latest entry stats
  const lastEntry = useMemo(() => [...entries].sort((a, b) => b.sleep_date.localeCompare(a.sleep_date))[0], [entries]);
  const avgWeek = useMemo(() => {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
    const week = entries.filter(e => new Date(e.sleep_date + "T12:00:00") >= cutoff);
    if (!week.length) return 0;
    return week.reduce((s, e) => s + e.sleep_hours, 0) / week.length;
  }, [entries]);

  const handleLog = () => {
    if (!sleepDate || !bedTime || !wakeTime) {
      showToast("Please fill in all fields.");
      return;
    }
    if (calculatedHours <= 0) {
      showToast("Wake time must be after bed time.");
      return;
    }
    // Check duplicate
    if (entries.some(e => e.sleep_date === sleepDate)) {
      showToast("Sleep already logged for this date. Delete it first to re-log.");
      return;
    }
    const entry: SleepEntry = {
      id: Date.now().toString(),
      user_id: "demo",
      sleep_date: sleepDate,
      bed_time: bedTime,
      wake_time: wakeTime,
      sleep_hours: calculatedHours,
      sleep_quality: quality,
    };
    setEntries(prev => [entry, ...prev].sort((a, b) => b.sleep_date.localeCompare(a.sleep_date)));
    showToast(`✅ Sleep logged: ${formatHours(calculatedHours)} — ${quality}`);
    // Move date back for next entry
    setSleepDate(prev => {
      const d = new Date(prev + "T12:00:00"); d.setDate(d.getDate() - 1);
      return d.toISOString().split("T")[0];
    });
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    showToast("Sleep entry deleted.");
  };

  const handleSaveGoal = () => {
    const g = parseFloat(goalInput);
    if (isNaN(g) || g < 1 || g > 24) { showToast("Goal must be between 1 and 24 hours."); return; }
    setGoal(g);
    setEditingGoal(false);
    showToast(`Sleep goal set to ${g}h/day`);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 14,
    border: "1.5px solid var(--border)", fontSize: 15, outline: "none",
    background: "rgba(255,255,255,0.8)", boxSizing: "border-box", color: "var(--text)",
    transition: "all .2s",
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 20px rgba(99,102,241,0.3)",
          }}>
            <Moon size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", margin: 0 }}>
              Sleep Tracker
            </h1>
            <p style={{ color: "var(--text2)", fontSize: 14, margin: 0 }}>
              Track your rest, improve your health
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard
          icon={<Moon size={22} color="#6366F1" />}
          label="Last Night"
          value={lastEntry ? formatHours(lastEntry.sleep_hours) : "—"}
          sub={lastEntry ? `${QUALITY_CONFIG[lastEntry.sleep_quality].emoji} ${lastEntry.sleep_quality}` : "No data"}
          color="#6366F1"
        />
        <StatCard
          icon={<Target size={22} color="#2EC972" />}
          label="Sleep Goal"
          value={`${goal}h / day`}
          sub={lastEntry ? (lastEntry.sleep_hours >= goal ? "✅ Goal met!" : `${formatHours(goal - lastEntry.sleep_hours)} short`) : undefined}
          color="#2EC972"
        />
        <StatCard
          icon={<TrendingUp size={22} color="#F59E0B" />}
          label="7-Day Average"
          value={avgWeek > 0 ? formatHours(avgWeek) : "—"}
          sub={avgWeek >= goal ? "Above goal 🎉" : avgWeek > 0 ? "Below goal" : "No data yet"}
          color="#F59E0B"
        />
        <StatCard
          icon={<Star size={22} color="#EF4444" />}
          label="Entries Logged"
          value={`${entries.length}`}
          sub="All time"
          color="#EF4444"
        />
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "var(--bg)", borderRadius: 14, padding: 6, width: "fit-content" }}>
        {(["log", "history", "reports"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "9px 22px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: 600, transition: "all .2s",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "var(--green-dark)" : "var(--text2)",
              boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {t === "log" ? "📝 Log Sleep" : t === "history" ? "📋 History" : "📊 Reports"}
          </button>
        ))}
      </div>

      {/* ── Tab: Log Sleep ── */}
      {tab === "log" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left: Form */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: 28,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
          }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 22, color: "var(--text)" }}>
              Log Tonight's Sleep
            </div>

            {/* Date */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                📅 Sleep Date
              </label>
              <input type="date" value={sleepDate} max={todayStr()}
                onChange={e => setSleepDate(e.target.value)} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Bedtime + Wake time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                  🌙 Bed Time
                </label>
                <div style={{ position: "relative" }}>
                  <Moon size={16} color="#6366F1" style={{ position: "absolute", left: 12, top: 15, pointerEvents: "none" }} />
                  <input type="time" value={bedTime} onChange={e => setBedTime(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 36 }}
                    onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                  ☀️ Wake Time
                </label>
                <div style={{ position: "relative" }}>
                  <Sun size={16} color="#F59E0B" style={{ position: "absolute", left: 12, top: 15, pointerEvents: "none" }} />
                  <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 36 }}
                    onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>
            </div>

            {/* Calculated hours pill */}
            {calculatedHours > 0 && (
              <div style={{
                background: calculatedHours >= goal ? "#F0FDF4" : "#FEF2F2",
                border: `1.5px solid ${calculatedHours >= goal ? "#2EC972" : "#EF4444"}`,
                borderRadius: 12, padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 10, marginBottom: 18,
              }}>
                <Clock size={16} color={calculatedHours >= goal ? "#2EC972" : "#EF4444"} />
                <span style={{ fontWeight: 700, fontSize: 15, color: calculatedHours >= goal ? "#166534" : "#991B1B" }}>
                  {formatHours(calculatedHours)} of sleep
                </span>
                <span style={{ fontSize: 13, color: "var(--text2)", marginLeft: "auto" }}>
                  {calculatedHours >= goal ? `✅ ${formatHours(calculatedHours - goal)} over goal` : `⚠️ ${formatHours(goal - calculatedHours)} below goal`}
                </span>
              </div>
            )}

            {/* Quality */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text)" }}>
                ⭐ Sleep Quality
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {(["Poor", "Average", "Good", "Excellent"] as SleepQuality[]).map(q => {
                  const cfg = QUALITY_CONFIG[q];
                  const isSelected = quality === q;
                  return (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      style={{
                        padding: "12px 10px", borderRadius: 12, cursor: "pointer",
                        border: `2px solid ${isSelected ? cfg.color : "var(--border)"}`,
                        background: isSelected ? cfg.bg : "#fff",
                        color: isSelected ? cfg.color : "var(--text2)",
                        fontWeight: isSelected ? 700 : 500, fontSize: 14,
                        transition: "all .2s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      {"⭐".repeat(cfg.stars)} {q}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleLog}
              style={{
                width: "100%", padding: 15, borderRadius: 14, border: "none",
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 6px 20px rgba(99,102,241,0.3)", transition: "all .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <Plus size={20} /> Save Sleep Entry
            </button>
          </div>

          {/* Right: Goal + Tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Sleep Goal */}
            <div style={{
              background: "#fff", borderRadius: 20, padding: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>🎯 Sleep Goal</div>
                <button
                  onClick={() => { setEditingGoal(!editingGoal); setGoalInput(String(goal)); }}
                  style={{ fontSize: 13, color: "var(--green)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                >
                  {editingGoal ? "Cancel" : "Edit"}
                </button>
              </div>

              {editingGoal ? (
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    type="number" min="1" max="24" step="0.5"
                    value={goalInput} onChange={e => setGoalInput(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button onClick={handleSaveGoal} style={{
                    padding: "13px 18px", borderRadius: 14, border: "none",
                    background: "var(--green)", color: "#fff", fontWeight: 700, cursor: "pointer",
                  }}>Save</button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    flex: 1, height: 10, background: "var(--bg)", borderRadius: 5, overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 5, transition: "width .6s ease",
                      background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
                      width: `${Math.min(100, ((lastEntry?.sleep_hours ?? 0) / goal) * 100)}%`,
                    }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 16, color: "#6366F1", flexShrink: 0 }}>
                    {goal}h
                  </span>
                </div>
              )}

              <div style={{ marginTop: 14, fontSize: 13, color: "var(--text2)" }}>
                Recommended: <strong>7–9 hours</strong> for adults
              </div>
            </div>

            {/* Tips */}
            <div style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              borderRadius: 20, padding: 24, color: "#fff",
              boxShadow: "0 4px 20px rgba(99,102,241,0.25)",
            }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>💡 Sleep Tips</div>
              {[
                "Stick to a consistent sleep schedule",
                "Avoid screens 30 min before bed",
                "Keep your room cool (18–20°C)",
                "Avoid caffeine after 2 PM",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
                  <span style={{ flexShrink: 0, fontSize: 15 }}>✓</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: History ── */}
      {tab === "history" && (
        <div style={{
          background: "#fff", borderRadius: 20, padding: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
        }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20, color: "var(--text)" }}>
            Sleep History ({entries.length} entries)
          </div>

          {entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text2)" }}>
              <Moon size={48} color="#e5e7eb" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No sleep logged yet</div>
              <div style={{ fontSize: 14 }}>Head to the Log tab to record your first night!</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...entries].sort((a, b) => b.sleep_date.localeCompare(a.sleep_date)).map(entry => {
                const cfg = QUALITY_CONFIG[entry.sleep_quality];
                const metGoal = entry.sleep_hours >= goal;
                return (
                  <div key={entry.id} style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "16px 20px", borderRadius: 16,
                    border: "1.5px solid var(--border)", background: "var(--bg)",
                    transition: "all .2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                  >
                    {/* Quality dot */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, background: cfg.bg,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                    }}>
                      {cfg.emoji}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                        {formatDate(entry.sleep_date)}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                        🌙 {entry.bed_time} → ☀️ {entry.wake_time}
                      </div>
                    </div>

                    {/* Hours */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: metGoal ? "#2EC972" : "#EF4444" }}>
                        {formatHours(entry.sleep_hours)}
                      </div>
                      <div style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>
                        {"⭐".repeat(cfg.stars)}
                      </div>
                    </div>

                    {/* Quality badge */}
                    <div style={{
                      padding: "5px 12px", borderRadius: 20,
                      background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 700,
                    }}>
                      {entry.sleep_quality}
                    </div>

                    {/* Goal badge */}
                    <div style={{
                      padding: "5px 10px", borderRadius: 20,
                      background: metGoal ? "#F0FDF4" : "#FEF2F2",
                      color: metGoal ? "#166534" : "#991B1B",
                      fontSize: 11, fontWeight: 600,
                    }}>
                      {metGoal ? "✅ Goal" : "⚠️ Short"}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(entry.id)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--border)",
                        background: "#fff", cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        transition: "all .2s", flexShrink: 0,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#EF4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--border)"; }}
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Reports ── */}
      {tab === "reports" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <WeeklyChart entries={entries} goal={goal} />
          <MonthlyReport entries={entries} goal={goal} />

          {/* Quality breakdown */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
          }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18, color: "var(--text)" }}>
              Quality Breakdown
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {(["Excellent", "Good", "Average", "Poor"] as SleepQuality[]).map(q => {
                const count = entries.filter(e => e.sleep_quality === q).length;
                const cfg = QUALITY_CONFIG[q];
                const pct = entries.length > 0 ? Math.round((count / entries.length) * 100) : 0;
                return (
                  <div key={q} style={{
                    textAlign: "center", padding: "20px 10px", borderRadius: 16,
                    background: cfg.bg, border: `1.5px solid ${cfg.color}22`,
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{cfg.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 20, color: cfg.color }}>{pct}%</div>
                    <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{q}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>{count} nights</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
