"use client";
import { useState, useRef, useEffect } from "react";

type WeightEntry = { date: string; weight: number; note?: string };

const INITIAL_ENTRIES: WeightEntry[] = [
  { date: "2024-01-01", weight: 88.0, note: "Starting weight" },
  { date: "2024-01-15", weight: 87.1 },
  { date: "2024-02-01", weight: 86.5, note: "Feeling good!" },
  { date: "2024-02-15", weight: 85.8 },
  { date: "2024-03-01", weight: 85.0 },
  { date: "2024-03-15", weight: 84.2, note: "Hit gym 3x/week" },
  { date: "2024-04-01", weight: 83.5 },
  { date: "2024-04-15", weight: 82.9 },
  { date: "2024-05-01", weight: 82.0 },
  { date: "2024-05-15", weight: 81.4, note: "Summer diet" },
  { date: "2024-06-01", weight: 80.5 },
  { date: "2024-06-15", weight: 79.8, note: "Goal close!" },
];

const GOAL_WEIGHT = 75;

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function BodySilhouette({ weight, goalWeight }: { weight: number; goalWeight: number }) {
  // Map weight to body shape: progress from 0 (goal) to 1 (overweight)
  const maxW = 100; const minW = goalWeight;
  const progress = Math.max(0, Math.min(1, (weight - minW) / (maxW - minW)));
  // belly width 40–80, shoulder 70–90, hip 60–85
  const belly = 36 + progress * 28;
  const shoulder = 60 + progress * 16;
  const hip = 52 + progress * 20;
  const neck = 14 + progress * 4;

  const cx = 60; // centre x
  const color = progress < 0.15 ? "#2EC972" : progress < 0.45 ? "#FFD166" : "#FF6B35";
  const label = progress < 0.15 ? "Goal Reached 🎉" : progress < 0.3 ? "Almost There!" : progress < 0.55 ? "Good Progress" : "Keep Going!";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={120} height={260} viewBox="0 0 120 260" style={{ filter: "drop-shadow(0 4px 12px rgba(46,201,114,0.2))", transition: "all 0.8s ease" }}>
        {/* Head */}
        <ellipse cx={cx} cy={28} rx={neck + 4} ry={18} fill={color} opacity={0.9} style={{ transition: "all 0.8s ease" }} />
        {/* Neck */}
        <rect x={cx - neck / 2} y={42} width={neck} height={14} rx={4} fill={color} opacity={0.85} style={{ transition: "all 0.8s ease" }} />
        {/* Shoulders */}
        <ellipse cx={cx} cy={66} rx={shoulder / 2} ry={16} fill={color} opacity={0.88} style={{ transition: "all 0.8s ease" }} />
        {/* Torso / belly */}
        <path
          d={`M ${cx - shoulder / 2} 60 Q ${cx - belly / 2 - 6} 120 ${cx - hip / 2} 158 L ${cx + hip / 2} 158 Q ${cx + belly / 2 + 6} 120 ${cx + shoulder / 2} 60 Z`}
          fill={color}
          opacity={0.86}
          style={{ transition: "all 0.8s ease" }}
        />
        {/* Left arm */}
        <path d={`M ${cx - shoulder / 2 + 4} 64 Q ${cx - shoulder / 2 - 12} 110 ${cx - shoulder / 2 - 6} 138`} stroke={color} strokeWidth={14 + progress * 6} strokeLinecap="round" fill="none" opacity={0.8} style={{ transition: "all 0.8s ease" }} />
        {/* Right arm */}
        <path d={`M ${cx + shoulder / 2 - 4} 64 Q ${cx + shoulder / 2 + 12} 110 ${cx + shoulder / 2 + 6} 138`} stroke={color} strokeWidth={14 + progress * 6} strokeLinecap="round" fill="none" opacity={0.8} style={{ transition: "all 0.8s ease" }} />
        {/* Left leg */}
        <path d={`M ${cx - hip / 4} 158 Q ${cx - hip / 2 + 2} 200 ${cx - hip / 4 + 2} 248`} stroke={color} strokeWidth={20 + progress * 8} strokeLinecap="round" fill="none" opacity={0.82} style={{ transition: "all 0.8s ease" }} />
        {/* Right leg */}
        <path d={`M ${cx + hip / 4} 158 Q ${cx + hip / 2 - 2} 200 ${cx + hip / 4 - 2} 248`} stroke={color} strokeWidth={20 + progress * 8} strokeLinecap="round" fill="none" opacity={0.82} style={{ transition: "all 0.8s ease" }} />
      </svg>
      <div style={{ fontSize: 12, fontWeight: 700, color, textAlign: "center", transition: "all 0.6s" }}>{label}</div>
      <div style={{ fontSize: 11, color: "var(--text2)", textAlign: "center" }}>
        {weight > goalWeight ? `${(weight - goalWeight).toFixed(1)} kg to goal` : "Goal achieved!"}
      </div>
    </div>
  );
}

function LineChart({ entries, goalWeight }: { entries: WeightEntry[]; goalWeight: number }) {
  const [tooltip, setTooltip] = useState<{ idx: number; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 520, H = 220, PAD = { top: 20, right: 20, bottom: 40, left: 48 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const weights = entries.map((e) => e.weight);
  const minW = Math.min(...weights, goalWeight) - 2;
  const maxW = Math.max(...weights) + 2;

  const xOf = (i: number) => PAD.left + (i / (entries.length - 1)) * innerW;
  const yOf = (w: number) => PAD.top + ((maxW - w) / (maxW - minW)) * innerH;

  const points = entries.map((e, i) => `${xOf(i)},${yOf(e.weight)}`).join(" ");
  const areaPoints = `${PAD.left},${H - PAD.bottom} ${points} ${W - PAD.right},${H - PAD.bottom}`;

  const yGridLines = 5;
  const goalY = yOf(goalWeight);

  return (
    <div style={{ position: "relative", overflowX: "auto" }}>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 340 }}>
        <defs>
          <linearGradient id="wgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2EC972" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2EC972" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: yGridLines + 1 }).map((_, i) => {
          const w = minW + ((maxW - minW) / yGridLines) * (yGridLines - i);
          const y = yOf(w);
          return (
            <g key={i}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#e0f0e0" strokeWidth={1} strokeDasharray="4,4" />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize={9} fill="#5a7a5a">{w.toFixed(1)}</text>
            </g>
          );
        })}

        {/* Goal line */}
        <line x1={PAD.left} x2={W - PAD.right} y1={goalY} y2={goalY} stroke="#FF6B35" strokeWidth={1.5} strokeDasharray="6,4" />
        <text x={W - PAD.right + 4} y={goalY + 4} fontSize={9} fill="#FF6B35" fontWeight={700}>Goal</text>

        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#wgGrad)" />

        {/* Line */}
        <polyline points={points} fill="none" stroke="#2EC972" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {/* Data points */}
        {entries.map((e, i) => (
          <g key={i}
            onMouseEnter={() => setTooltip({ idx: i, x: xOf(i), y: yOf(e.weight) })}
            onMouseLeave={() => setTooltip(null)}
            style={{ cursor: "pointer" }}>
            <circle cx={xOf(i)} cy={yOf(e.weight)} r={14} fill="transparent" />
            <circle cx={xOf(i)} cy={yOf(e.weight)} r={5}
              fill={tooltip?.idx === i ? "#fff" : "#2EC972"}
              stroke="#2EC972" strokeWidth={2.5}
              style={{ transition: "r 0.2s" }} />
          </g>
        ))}

        {/* X-axis labels (every other) */}
        {entries.map((e, i) => (
          (i % 2 === 0) && (
            <text key={i} x={xOf(i)} y={H - PAD.bottom + 16} textAnchor="middle" fontSize={9} fill="#5a7a5a">{fmt(e.date)}</text>
          )
        ))}

        {/* Tooltip */}
        {tooltip && (() => {
          const e = entries[tooltip.idx];
          const tx = Math.min(tooltip.x, W - 120);
          const ty = Math.max(tooltip.y - 60, 10);
          return (
            <g>
              <rect x={tx - 4} y={ty} width={112} height={48} rx={8} fill="#1a2e1a" opacity={0.92} />
              <text x={tx + 52} y={ty + 16} textAnchor="middle" fontSize={10} fill="#aee8c8">{fmt(e.date)}</text>
              <text x={tx + 52} y={ty + 30} textAnchor="middle" fontSize={14} fill="#fff" fontWeight={700}>{e.weight} kg</text>
              {e.note && <text x={tx + 52} y={ty + 44} textAnchor="middle" fontSize={9} fill="#aee8c8">{e.note}</text>}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

export default function WeightProgress({ showToast }: { showToast: (msg: string) => void }) {
  const [entries, setEntries] = useState<WeightEntry[]>(INITIAL_ENTRIES);
  const [newWeight, setNewWeight] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newNote, setNewNote] = useState("");
  const [goalWeight, setGoalWeight] = useState(GOAL_WEIGHT);
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(String(GOAL_WEIGHT));
  const [showAll, setShowAll] = useState(false);

  const latest = entries[entries.length - 1];
  const oldest = entries[0];
  const totalLost = (oldest.weight - latest.weight).toFixed(1);
  const toGoal = (latest.weight - goalWeight).toFixed(1);
  const pct = Math.min(100, Math.round(((oldest.weight - latest.weight) / (oldest.weight - goalWeight)) * 100));

  const handleAdd = () => {
    const w = parseFloat(newWeight);
    if (!w || w < 30 || w > 300) { showToast("Please enter a valid weight (30–300 kg)"); return; }
    const entry: WeightEntry = { date: newDate, weight: w, note: newNote || undefined };
    const updated = [...entries, entry].sort((a, b) => a.date.localeCompare(b.date));
    setEntries(updated);
    setNewWeight(""); setNewNote("");
    showToast(`✅ Weight ${w} kg logged for ${fmt(newDate)}`);
  };

  const handleDeleteEntry = (idx: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
    showToast("Entry removed");
  };

  const displayedEntries = showAll ? [...entries].reverse() : [...entries].reverse().slice(0, 5);

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 20, fontWeight: 700 }}>📉 Weight Progress</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500 }}>Goal:</span>
          {editingGoal ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="number" value={tempGoal} onChange={(e) => setTempGoal(e.target.value)}
                style={{ width: 72, padding: "5px 10px", borderRadius: 8, border: "1.5px solid var(--green)", fontSize: 14, outline: "none" }}
              />
              <button onClick={() => { setGoalWeight(parseFloat(tempGoal) || goalWeight); setEditingGoal(false); showToast("Goal updated!"); }}
                style={{ padding: "5px 14px", borderRadius: 8, border: "none", background: "var(--green)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Save
              </button>
            </div>
          ) : (
            <button onClick={() => { setTempGoal(String(goalWeight)); setEditingGoal(true); }}
              style={{ padding: "5px 14px", borderRadius: 8, border: "1.5px solid var(--green)", background: "var(--green-light)", color: "var(--green-dark)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {goalWeight} kg ✏️
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        {[
          { icon: "⚖️", val: `${latest.weight} kg`, lbl: "Current Weight", sub: `Started at ${oldest.weight} kg`, color: "var(--green)" },
          { icon: "📉", val: `-${totalLost} kg`, lbl: "Total Lost", sub: "Since you began", color: "#2196F3" },
          { icon: "🎯", val: `${goalWeight} kg`, lbl: "Goal Weight", sub: `${toGoal} kg remaining`, color: "var(--orange)" },
          { icon: "📊", val: `${pct}%`, lbl: "Goal Progress", sub: "Keep it up!", color: "#7B5EA7" },
        ].map((s) => (
          <div key={s.lbl} className="card-hover" style={{ background: "var(--card)", borderRadius: 16, padding: "20px 18px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 22, fontWeight: 700, color: s.color, marginTop: 6 }}>{s.val}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{s.lbl}</div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ background: "var(--card)", borderRadius: 16, padding: "20px 24px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Progress to goal</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--green)" }}>{pct}%</span>
        </div>
        <div className="progress-bar" style={{ height: 12 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 80 ? "var(--green)" : pct >= 50 ? "#FFD166" : "var(--orange)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--text2)" }}>
          <span>Start: {oldest.weight} kg</span><span>Goal: {goalWeight} kg</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 22, marginBottom: 24, alignItems: "start" }}>
        {/* Line Chart */}
        <div style={{ background: "var(--card)", borderRadius: 16, padding: "22px 20px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📈 Weight Over Time</div>
          <LineChart entries={entries} goalWeight={goalWeight} />
        </div>

        {/* Body Silhouette */}
        <div style={{ background: "var(--card)", borderRadius: 16, padding: "22px 20px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", minWidth: 160 }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>🏃 Body Shape</div>
          <BodySilhouette weight={latest.weight} goalWeight={goalWeight} />
        </div>
      </div>

      {/* Log new entry */}
      <div style={{ background: "var(--card)", borderRadius: 16, padding: "22px 24px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", marginBottom: 24 }}>
        <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>➕ Log New Weight</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr auto", gap: 12, alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>Date</label>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>Weight (kg)</label>
            <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)}
              placeholder="e.g. 80.5"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>Note (optional)</label>
            <input value={newNote} onChange={(e) => setNewNote(e.target.value)}
              placeholder="e.g. After gym session"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={handleAdd}
            style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "var(--green)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
            Log ✓
          </button>
        </div>
      </div>

      {/* History */}
      <div style={{ background: "var(--card)", borderRadius: 16, padding: "22px 24px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 16, fontWeight: 700 }}>📋 History</div>
          <button onClick={() => setShowAll((v) => !v)} style={{ padding: "5px 14px", borderRadius: 8, border: "1.5px solid var(--border)", background: "transparent", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            {showAll ? "Show Less" : `Show All (${entries.length})`}
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {displayedEntries.map((e, i) => {
            const realIdx = entries.length - 1 - i;
            const prev = entries[realIdx - 1];
            const diff = prev ? e.weight - prev.weight : 0;
            return (
              <div key={e.date} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, color: "var(--text2)", minWidth: 80, fontWeight: 500 }}>{fmt(e.date)}</div>
                <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, minWidth: 70 }}>{e.weight} kg</div>
                {prev && (
                  <div style={{ fontSize: 12, fontWeight: 600, color: diff < 0 ? "var(--green)" : diff > 0 ? "var(--orange)" : "var(--text2)" }}>
                    {diff < 0 ? `↓ ${Math.abs(diff).toFixed(1)}` : diff > 0 ? `↑ ${diff.toFixed(1)}` : "—"}
                  </div>
                )}
                {e.note && <div style={{ fontSize: 12, color: "var(--text2)", flex: 1 }}>📝 {e.note}</div>}
                <button onClick={() => handleDeleteEntry(realIdx)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#ccc", padding: "2px 6px" }}>✕</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
