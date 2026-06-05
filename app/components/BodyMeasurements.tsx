"use client";
import { useState } from "react";

type MeasurementKey = "chest" | "waist" | "hips" | "arms";

type MeasurementEntry = {
  date: string;
  chest: number;
  waist: number;
  hips: number;
  arms: number;
  note?: string;
};

const INITIAL_DATA: MeasurementEntry[] = [
  { date: "2024-01-01", chest: 104, waist: 96, hips: 108, arms: 36, note: "Starting measurements" },
  { date: "2024-02-01", chest: 103, waist: 94, hips: 106, arms: 35.5 },
  { date: "2024-03-01", chest: 102, waist: 92, hips: 105, arms: 35 },
  { date: "2024-04-01", chest: 101, waist: 90, hips: 103, arms: 34.5 },
  { date: "2024-05-01", chest: 100, waist: 88, hips: 102, arms: 34 },
  { date: "2024-06-01", chest: 99, waist: 86, hips: 100, arms: 33.5 },
];

const MEASUREMENT_META: Record<MeasurementKey, { label: string; icon: string; color: string; unit: string; desc: string }> = {
  chest:  { label: "Chest",  icon: "💪", color: "#2196F3", unit: "cm", desc: "Measure around the fullest part of chest" },
  waist:  { label: "Waist",  icon: "🎯", color: "#FF6B35", unit: "cm", desc: "Measure around natural waistline" },
  hips:   { label: "Hips",   icon: "🏃", color: "#7B5EA7", unit: "cm", desc: "Measure around the widest part of hips" },
  arms:   { label: "Arms",   icon: "💪", color: "#2EC972", unit: "cm", desc: "Measure around the bicep (flexed)" },
};

const KEYS: MeasurementKey[] = ["chest", "waist", "hips", "arms"];

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const W = 80, H = 32;
  const min = Math.min(...data) - 1;
  const max = Math.max(...data) + 1;
  const xOf = (i: number) => (i / (data.length - 1)) * W;
  const yOf = (v: number) => H - ((v - min) / (max - min)) * H;
  const pts = data.map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ");
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xOf(data.length - 1)} cy={yOf(data[data.length - 1])} r={3} fill={color} />
    </svg>
  );
}

function BodyDiagram({ measurements }: { measurements: MeasurementEntry }) {
  // Normalise each measurement to 0-1 relative to ranges
  const ranges = { chest: [85, 115], waist: [65, 105], hips: [85, 115], arms: [26, 42] };
  const norm = (key: MeasurementKey) => {
    const [lo, hi] = ranges[key];
    return Math.max(0, Math.min(1, (measurements[key] - lo) / (hi - lo)));
  };

  const chestW = 52 + norm("chest") * 28;
  const waistW = 34 + norm("waist") * 28;
  const hipW   = 50 + norm("hips") * 28;
  const armW   = 8  + norm("arms") * 8;
  const cx = 70;

  return (
    <svg width={140} height={280} viewBox="0 0 140 280" style={{ filter: "drop-shadow(0 4px 16px rgba(46,201,114,0.15))", overflow: "visible" }}>
      {/* Measurement lines */}
      {/* Chest line */}
      <line x1={cx - chestW / 2 - 10} y1={78} x2={cx + chestW / 2 + 10} y2={78} stroke="#2196F3" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.6} />
      <text x={cx + chestW / 2 + 13} y={82} fontSize={7} fill="#2196F3" fontWeight={700}>C</text>
      {/* Waist line */}
      <line x1={cx - waistW / 2 - 10} y1={120} x2={cx + waistW / 2 + 10} y2={120} stroke="#FF6B35" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.6} />
      <text x={cx + waistW / 2 + 13} y={124} fontSize={7} fill="#FF6B35" fontWeight={700}>W</text>
      {/* Hip line */}
      <line x1={cx - hipW / 2 - 10} y1={152} x2={cx + hipW / 2 + 10} y2={152} stroke="#7B5EA7" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.6} />
      <text x={cx + hipW / 2 + 13} y={156} fontSize={7} fill="#7B5EA7" fontWeight={700}>H</text>

      {/* Head */}
      <ellipse cx={cx} cy={24} rx={16} ry={18} fill="#2EC972" opacity={0.85} />
      {/* Neck */}
      <rect x={cx - 7} y={38} width={14} height={12} rx={4} fill="#2EC972" opacity={0.80} />
      {/* Shoulders */}
      <ellipse cx={cx} cy={62} rx={chestW / 2} ry={14} fill="#2EC972" opacity={0.82} />
      {/* Torso */}
      <path
        d={`M ${cx - chestW / 2} 58 
            Q ${cx - waistW / 2 - 4} 110 ${cx - hipW / 2} 148 
            L ${cx + hipW / 2} 148 
            Q ${cx + waistW / 2 + 4} 110 ${cx + chestW / 2} 58 Z`}
        fill="#2EC972"
        opacity={0.80}
        style={{ transition: "all 0.8s ease" }}
      />
      {/* Arms */}
      <path d={`M ${cx - chestW / 2 + 4} 60 Q ${cx - chestW / 2 - 10} 105 ${cx - chestW / 2 - 4} 130`}
        stroke="#2EC972" strokeWidth={armW} strokeLinecap="round" fill="none" opacity={0.78} style={{ transition: "all 0.8s ease" }} />
      <path d={`M ${cx + chestW / 2 - 4} 60 Q ${cx + chestW / 2 + 10} 105 ${cx + chestW / 2 + 4} 130`}
        stroke="#2EC972" strokeWidth={armW} strokeLinecap="round" fill="none" opacity={0.78} style={{ transition: "all 0.8s ease" }} />
      {/* Legs */}
      <path d={`M ${cx - hipW / 4 + 2} 148 Q ${cx - hipW / 4 - 4} 200 ${cx - hipW / 4 + 2} 270`}
        stroke="#2EC972" strokeWidth={18 + norm("hips") * 8} strokeLinecap="round" fill="none" opacity={0.80} style={{ transition: "all 0.8s ease" }} />
      <path d={`M ${cx + hipW / 4 - 2} 148 Q ${cx + hipW / 4 + 4} 200 ${cx + hipW / 4 - 2} 270`}
        stroke="#2EC972" strokeWidth={18 + norm("hips") * 8} strokeLinecap="round" fill="none" opacity={0.80} style={{ transition: "all 0.8s ease" }} />
    </svg>
  );
}

function RadarChart({ measurements, initial }: { measurements: MeasurementEntry; initial: MeasurementEntry }) {
  const W = 200, H = 200, cx = 100, cy = 100, r = 72;
  const keys = KEYS;
  const n = keys.length;
  const angleOf = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const ranges = { chest: [85, 115], waist: [65, 105], hips: [85, 115], arms: [26, 42] };

  const norm = (key: MeasurementKey, val: number) => {
    const [lo, hi] = ranges[key];
    return Math.max(0.05, Math.min(1, (val - lo) / (hi - lo)));
  };

  const ptOf = (key: MeasurementKey, val: number, i: number) => {
    const ratio = norm(key, val);
    const angle = angleOf(i);
    return { x: cx + ratio * r * Math.cos(angle), y: cy + ratio * r * Math.sin(angle) };
  };

  const currentPts = keys.map((k, i) => ptOf(k, measurements[k], i));
  const initialPts = keys.map((k, i) => ptOf(k, initial[k], i));

  const polyPts = (pts: { x: number; y: number }[]) => pts.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: 200 }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon
          key={ratio}
          points={keys.map((_, i) => {
            const angle = angleOf(i);
            return `${cx + ratio * r * Math.cos(angle)},${cy + ratio * r * Math.sin(angle)}`;
          }).join(" ")}
          fill="none" stroke="#e0f0e0" strokeWidth={1}
        />
      ))}
      {/* Axes */}
      {keys.map((k, i) => {
        const angle = angleOf(i);
        const ex = cx + r * Math.cos(angle), ey = cy + r * Math.sin(angle);
        const lx = cx + (r + 18) * Math.cos(angle), ly = cy + (r + 18) * Math.sin(angle);
        return (
          <g key={k}>
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#e0f0e0" strokeWidth={1} />
            <text x={lx} y={ly + 4} textAnchor="middle" fontSize={9} fill="#5a7a5a" fontWeight={700}>
              {MEASUREMENT_META[k].label}
            </text>
          </g>
        );
      })}
      {/* Initial polygon */}
      <polygon points={polyPts(initialPts)} fill="rgba(255,107,53,0.12)" stroke="#FF6B35" strokeWidth={1.5} strokeDasharray="4,3" />
      {/* Current polygon */}
      <polygon points={polyPts(currentPts)} fill="rgba(46,201,114,0.18)" stroke="#2EC972" strokeWidth={2} />
      {/* Points */}
      {currentPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#2EC972" />
      ))}
      {/* Legend */}
      <rect x={10} y={H - 28} width={10} height={3} rx={2} fill="#2EC972" />
      <text x={24} y={H - 23} fontSize={8} fill="#2EC972" fontWeight={600}>Current</text>
      <rect x={70} y={H - 28} width={10} height={3} rx={2} fill="#FF6B35" />
      <text x={84} y={H - 23} fontSize={8} fill="#FF6B35" fontWeight={600}>Start</text>
    </svg>
  );
}

export default function BodyMeasurements({ showToast }: { showToast: (msg: string) => void }) {
  const [entries, setEntries] = useState<MeasurementEntry[]>(INITIAL_DATA);
  const [activeKey, setActiveKey] = useState<MeasurementKey>("waist");
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], chest: "", waist: "", hips: "", arms: "", note: "" });
  const [showAll, setShowAll] = useState(false);

  const latest = entries[entries.length - 1];
  const initial = entries[0];

  const handleAdd = () => {
    const chest = parseFloat(form.chest), waist = parseFloat(form.waist);
    const hips  = parseFloat(form.hips),  arms  = parseFloat(form.arms);
    if (!chest || !waist || !hips || !arms) { showToast("Please fill in all four measurements"); return; }
    const entry: MeasurementEntry = { date: form.date, chest, waist, hips, arms, note: form.note || undefined };
    const updated = [...entries, entry].sort((a, b) => a.date.localeCompare(b.date));
    setEntries(updated);
    setForm({ ...form, chest: "", waist: "", hips: "", arms: "", note: "" });
    showToast("📏 Measurements logged successfully!");
  };

  const diff = (key: MeasurementKey) => (latest[key] - initial[key]).toFixed(1);

  // Mini bar chart for selected measurement
  const chartData = entries.map(e => e[activeKey]);
  const chartMin = Math.min(...chartData) - 2;
  const chartMax = Math.max(...chartData) + 2;

  const displayedEntries = showAll ? [...entries].reverse() : [...entries].reverse().slice(0, 5);

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 20, fontWeight: 700 }}>📏 Body Measurements</h3>
        <div style={{ fontSize: 13, color: "var(--text2)" }}>Track: Chest · Waist · Hips · Arms</div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {KEYS.map((key) => {
          const meta = MEASUREMENT_META[key];
          const d = parseFloat(diff(key));
          const isActive = activeKey === key;
          return (
            <div
              key={key}
              onClick={() => setActiveKey(key)}
              className="card-hover"
              style={{
                background: isActive ? meta.color : "var(--card)",
                borderRadius: 16, padding: "18px 16px",
                border: `2px solid ${isActive ? meta.color : "var(--border)"}`,
                boxShadow: isActive ? `0 8px 24px ${meta.color}40` : "var(--shadow)",
                cursor: "pointer", transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? "rgba(255,255,255,0.8)" : "var(--text2)", marginBottom: 4 }}>
                    {meta.label.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 22, fontWeight: 700, color: isActive ? "#fff" : meta.color }}>
                    {latest[key]} cm
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? "rgba(255,255,255,0.9)" : (d < 0 ? "var(--green)" : d > 0 ? "var(--orange)" : "var(--text2)"), marginTop: 4 }}>
                    {d < 0 ? `↓ ${Math.abs(d)} cm` : d > 0 ? `↑ ${d} cm` : "No change"} since start
                  </div>
                </div>
                <MiniSparkline data={entries.map(e => e[key])} color={isActive ? "rgba(255,255,255,0.8)" : meta.color} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 22, marginBottom: 24, alignItems: "start" }}>
        {/* Bar chart for selected measurement */}
        <div style={{ background: "var(--card)", borderRadius: 16, padding: "22px 20px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
            {MEASUREMENT_META[activeKey].icon} {MEASUREMENT_META[activeKey].label} Over Time
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 18 }}>{MEASUREMENT_META[activeKey].desc}</div>

          {/* SVG line chart */}
          <svg width="100%" viewBox="0 0 400 140" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id={`mGrad_${activeKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={MEASUREMENT_META[activeKey].color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={MEASUREMENT_META[activeKey].color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((r) => {
              const y = 10 + (1 - r) * 100;
              const val = chartMin + r * (chartMax - chartMin);
              return (
                <g key={r}>
                  <line x1={40} x2={390} y1={y} y2={y} stroke="#e0f0e0" strokeWidth={1} />
                  <text x={34} y={y + 4} textAnchor="end" fontSize={8} fill="#5a7a5a">{val.toFixed(0)}</text>
                </g>
              );
            })}

            {/* Area */}
            {chartData.length > 1 && (
              <polygon
                points={`40,110 ${chartData.map((v, i) => {
                  const x = 40 + (i / (chartData.length - 1)) * 350;
                  const y = 10 + ((chartMax - v) / (chartMax - chartMin)) * 100;
                  return `${x},${y}`;
                }).join(" ")} ${40 + 350},110`}
                fill={`url(#mGrad_${activeKey})`}
              />
            )}

            {/* Line */}
            {chartData.length > 1 && (
              <polyline
                points={chartData.map((v, i) => {
                  const x = 40 + (i / (chartData.length - 1)) * 350;
                  const y = 10 + ((chartMax - v) / (chartMax - chartMin)) * 100;
                  return `${x},${y}`;
                }).join(" ")}
                fill="none"
                stroke={MEASUREMENT_META[activeKey].color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Points + labels */}
            {chartData.map((v, i) => {
              const x = chartData.length > 1 ? 40 + (i / (chartData.length - 1)) * 350 : 215;
              const y = 10 + ((chartMax - v) / (chartMax - chartMin)) * 100;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={5} fill={MEASUREMENT_META[activeKey].color} stroke="#fff" strokeWidth={2} />
                  <text x={x} y={y - 9} textAnchor="middle" fontSize={8} fill={MEASUREMENT_META[activeKey].color} fontWeight={700}>{v}</text>
                  <text x={x} y={128} textAnchor="middle" fontSize={8} fill="#5a7a5a">{fmt(entries[i].date)}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Body diagram */}
        <div style={{ background: "var(--card)", borderRadius: 16, padding: "22px 16px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 14, fontWeight: 700 }}>🧍 Body Map</div>
          <BodyDiagram measurements={latest} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
            {KEYS.map(k => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "3px 6px", borderRadius: 6, background: activeKey === k ? `${MEASUREMENT_META[k].color}18` : "transparent" }}>
                <span style={{ color: MEASUREMENT_META[k].color, fontWeight: 700 }}>{MEASUREMENT_META[k].label}</span>
                <span style={{ fontWeight: 600 }}>{latest[k]} cm</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar */}
        <div style={{ background: "var(--card)", borderRadius: 16, padding: "22px 16px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 14, fontWeight: 700 }}>🕸️ Shape Radar</div>
          <RadarChart measurements={latest} initial={initial} />
          <div style={{ fontSize: 10, color: "var(--text2)", textAlign: "center" }}>Compare start vs. now</div>
        </div>
      </div>

      {/* Add measurement form */}
      <div style={{ background: "var(--card)", borderRadius: 16, padding: "22px 24px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", marginBottom: 24 }}>
        <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 18 }}>➕ Log New Measurements</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 2fr auto", gap: 12, alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 6 }}>DATE</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          {KEYS.map(key => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MEASUREMENT_META[key].color, marginBottom: 6 }}>
                {MEASUREMENT_META[key].label.toUpperCase()} (cm)
              </label>
              <input
                type="number" step="0.1"
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={`${latest[key]}`}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${MEASUREMENT_META[key].color}60`, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                onFocus={e => { e.target.style.borderColor = MEASUREMENT_META[key].color; e.target.style.boxShadow = `0 0 0 3px ${MEASUREMENT_META[key].color}20`; }}
                onBlur={e => { e.target.style.borderColor = `${MEASUREMENT_META[key].color}60`; e.target.style.boxShadow = "none"; }}
              />
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 6 }}>NOTE</label>
            <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={handleAdd}
            style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "var(--green)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
            Save ✓
          </button>
        </div>
      </div>

      {/* History table */}
      <div style={{ background: "var(--card)", borderRadius: 16, padding: "22px 24px", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 16, fontWeight: 700 }}>📋 Measurement History</div>
          <button onClick={() => setShowAll(v => !v)} style={{ padding: "5px 14px", borderRadius: 8, border: "1.5px solid var(--border)", background: "transparent", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            {showAll ? "Show Less" : `Show All (${entries.length})`}
          </button>
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "100px repeat(4, 1fr) 1fr", gap: 10, padding: "8px 10px", background: "var(--bg)", borderRadius: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)" }}>DATE</span>
          {KEYS.map(k => (
            <span key={k} style={{ fontSize: 11, fontWeight: 700, color: MEASUREMENT_META[k].color }}>{MEASUREMENT_META[k].label.toUpperCase()}</span>
          ))}
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)" }}>NOTE</span>
        </div>

        {displayedEntries.map((entry, i) => {
          const realIdx = entries.length - 1 - i;
          const prev = entries[realIdx - 1];
          return (
            <div key={entry.date} style={{ display: "grid", gridTemplateColumns: "100px repeat(4, 1fr) 1fr", gap: 10, padding: "10px 10px", borderRadius: 8, background: i % 2 === 0 ? "var(--bg)" : "transparent", marginBottom: 4, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>{fmt(entry.date)}</span>
              {KEYS.map(k => {
                const d = prev ? entry[k] - prev[k] : 0;
                return (
                  <div key={k}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: MEASUREMENT_META[k].color }}>{entry[k]}</span>
                    <span style={{ fontSize: 10, color: "var(--text2)" }}> cm</span>
                    {prev && d !== 0 && (
                      <div style={{ fontSize: 10, fontWeight: 700, color: d < 0 ? "var(--green)" : "var(--orange)" }}>
                        {d < 0 ? `↓${Math.abs(d).toFixed(1)}` : `↑${d.toFixed(1)}`}
                      </div>
                    )}
                  </div>
                );
              })}
              <span style={{ fontSize: 11, color: "var(--text2)" }}>{entry.note || "—"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
