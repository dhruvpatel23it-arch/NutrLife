"use client";
import { useState, useMemo } from "react";
import {
  BarChart2, TrendingDown, Droplets, Moon, Target,
  Download, Printer, FileSpreadsheet, FileText,
  Calendar, ChevronLeft, ChevronRight,
} from "lucide-react";

// ─── Types & seed data ────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface DayData {
  label: string;
  calories: number;
  water: number;
  sleep: number;
  weight: number;
  [key: string]: string | number;  // ← add this line
}

function buildWeekData(): DayData[] {
  const base = [2050, 2300, 1900, 2150, 2400, 1800, 2200];
  const water = [2.5, 3.1, 2.2, 2.8, 3.0, 2.4, 2.9];
  const sleep = [7.5, 8.0, 6.5, 7.8, 9.0, 6.0, 7.5];
  const weight = [79.2, 79.0, 78.8, 78.5, 78.2, 78.0, 77.8];
  return DAYS.map((label, i) => ({ label, calories: base[i], water: water[i], sleep: sleep[i], weight: weight[i] }));
}

function buildMonthData(): { label: string; weight: number }[] {
  const weights = [82, 81.5, 81, 80.3, 79.8, 79.2, 78.8, 78.5, 78.1, 77.8, 77.5, 77.2,
    77.0, 76.8, 76.5, 76.3, 76.0, 75.8, 75.5, 75.3, 75.0, 74.8, 74.5, 74.3,
    74.1, 73.9, 73.7, 73.5, 73.3, 73.1];
  return weights.map((w, i) => ({ label: `${i + 1}`, weight: w }));
}

// ─── SVG Line Chart ───────────────────────────────────────────────────────────

function LineChart({
  data, valueKey, color, gradientId, yMin, yMax, unit, height = 160,
}: {
  data: { label: string; [k: string]: number | string }[];
  valueKey: string;
  color: string;
  gradientId: string;
  yMin: number; yMax: number;
  unit: string;
  height?: number;
}) {
  const W = 100, H = height;
  const PAD = { top: 10, right: 2, bottom: 20, left: 0 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const xs = data.map((_, i) => PAD.left + (i / (data.length - 1)) * chartW);
  const ys = data.map(d => PAD.top + (1 - ((d[valueKey] as number) - yMin) / (yMax - yMin)) * chartH);

  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const areaPath = `${linePath} L${xs[xs.length - 1]},${H - PAD.bottom} L${xs[0]},${H - PAD.bottom} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <line key={t}
          x1={PAD.left} y1={PAD.top + t * chartH}
          x2={W - PAD.right} y2={PAD.top + t * chartH}
          stroke="#f1f5f9" strokeWidth="0.5"
        />
      ))}
      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />
      {/* Line */}
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="2" fill={color} />
      ))}
      {/* X labels */}
      {data.map((d, i) => (
        <text key={i} x={xs[i]} y={H - 4} textAnchor="middle" fontSize="4.5" fill="#94a3b8">
          {d.label}
        </text>
      ))}
      {/* Tooltip-style last value */}
      <text x={xs[xs.length - 1]} y={ys[ys.length - 1] - 5} textAnchor="middle" fontSize="5" fill={color} fontWeight="700">
        {data[data.length - 1][valueKey]}{unit}
      </text>
    </svg>
  );
}

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────

function BarChart({
  data, valueKey, color, maxVal, unit, height = 140,
}: {
  data: { label: string; [k: string]: number | string }[];
  valueKey: string;
  color: string;
  maxVal: number;
  unit: string;
  height?: number;
}) {
  const barW = 100 / (data.length * 1.6);
  const gap = 100 / data.length;
  const PAD_B = 16;

  return (
    <svg viewBox={`0 0 100 ${height}`} width="100%" height={height}>
      {/* Grid */}
      {[0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1="0" y1={t * (height - PAD_B)} x2="100" y2={t * (height - PAD_B)} stroke="#f1f5f9" strokeWidth="0.5" />
      ))}
      {data.map((d, i) => {
        const val = d[valueKey] as number;
        const barH = (val / maxVal) * (height - PAD_B);
        const x = i * gap + gap / 2 - barW / 2;
        const y = height - PAD_B - barH;
        const isMax = val === Math.max(...data.map(dd => dd[valueKey] as number));
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH}
              fill={isMax ? color : color + "88"}
              rx="2" ry="2"
            />
            {/* Value on top */}
            <text x={x + barW / 2} y={y - 2} textAnchor="middle" fontSize="4" fill={color} fontWeight="700">
              {val}{unit}
            </text>
            {/* Label */}
            <text x={x + barW / 2} y={height - 3} textAnchor="middle" fontSize="4.5" fill="#94a3b8">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Radial goal ring ─────────────────────────────────────────────────────────

function GoalRing({ pct, color, label, value }: { pct: number; color: string; label: string; value: string }) {
  const R = 28, CIRC = 2 * Math.PI * R;
  const dash = (pct / 100) * CIRC;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={80} height={80} viewBox="0 0 72 72" style={{ display: "block", margin: "0 auto" }}>
        <circle cx={36} cy={36} r={R} fill="none" stroke="#f1f5f9" strokeWidth="5" />
        <circle cx={36} cy={36} r={R} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${CIRC}`} strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x={36} y={34} textAnchor="middle" fontSize="10" fontWeight="800" fill={color}>{pct}%</text>
        <text x={36} y={46} textAnchor="middle" fontSize="5" fill="#94a3b8">{value}</text>
      </svg>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color, trend }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; trend?: "up" | "down" | "neutral";
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "20px 22px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
      flex: 1, minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: color + "18", display: "flex", alignItems: "center", justifyContent: "center",
        }}>{icon}</div>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
          background: trend === "down" ? "#FEF2F2" : trend === "up" ? "#F0FDF4" : "#F8FAFC",
          color: trend === "down" ? "#EF4444" : trend === "up" ? "#2EC972" : "#64748B",
        }}>
          {trend === "down" ? "▼" : trend === "up" ? "▲" : "—"} {sub}
        </span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ─── Chart Card ──────────────────────────────────────────────────────────────

function ChartCard({ title, icon, color, children }: {
  title: string; icon: React.ReactNode; color: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 22,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: color + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{icon}</div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReportsAnalytics({ showToast }: { showToast: (msg: string) => void }) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [monthOffset, setMonthOffset] = useState(0);

  const weekData = useMemo(() => buildWeekData(), []);
  const monthWeightData = useMemo(() => buildMonthData(), []);

  // Averages
  const avgCalories = Math.round(weekData.reduce((s, d) => s + d.calories, 0) / weekData.length);
  const avgWater = (weekData.reduce((s, d) => s + d.water, 0) / weekData.length).toFixed(1);
  const avgSleep = (weekData.reduce((s, d) => s + d.sleep, 0) / weekData.length).toFixed(1);
  const weightChange = (weekData[weekData.length - 1].weight - weekData[0].weight).toFixed(1);

  const currentMonth = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthOffset);
    return MONTHS[d.getMonth()] + " " + d.getFullYear();
  }, [monthOffset]);

  const handleExport = (type: "pdf" | "excel" | "print") => {
    if (type === "print" || type === "pdf") { 
      window.print(); 
      if (type === "pdf") {
        showToast("📄 Please select 'Save as PDF' in the print dialog.");
      }
      return; 
    }

    if (type === "excel") {
      const headers = ["Day", "Calories (kcal)", "Water (L)", "Sleep (h)", "Weight (kg)"];
      const rows = weekData.map(d => [d.label, d.calories, d.water, d.sleep, d.weight]);
      const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `NutriLife_Report_${currentMonth.replace(" ", "_")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast(`📊 Excel (CSV) report downloaded successfully.`);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: "linear-gradient(135deg, #6366F1, #06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 20px rgba(99,102,241,0.3)",
          }}>
            <BarChart2 size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", margin: 0 }}>
              Reports & Analytics
            </h1>
            <p style={{ color: "var(--text2)", fontSize: 14, margin: 0 }}>Your complete health data at a glance</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { icon: <FileText size={15} />, label: "Download PDF", type: "pdf" as const, color: "#EF4444" },
            { icon: <FileSpreadsheet size={15} />, label: "Export Excel", type: "excel" as const, color: "#2EC972" },
            { icon: <Printer size={15} />, label: "Print Report", type: "print" as const, color: "#6366F1" },
          ].map(({ icon, label, type, color }) => (
            <button
              key={type}
              onClick={() => handleExport(type)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 16px", borderRadius: 12, cursor: "pointer",
                border: `1.5px solid ${color}33`, background: color + "10",
                color, fontSize: 13, fontWeight: 600, transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = color + "20"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = color + "10"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Period Tabs ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, background: "var(--bg)", borderRadius: 14, padding: 5 }}>
          {(["weekly", "monthly"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: 600, transition: "all .2s",
              background: period === p ? "#fff" : "transparent",
              color: period === p ? "var(--green-dark)" : "var(--text2)",
              boxShadow: period === p ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
            }}>
              {p === "weekly" ? "📅 This Week" : "🗓️ Monthly"}
            </button>
          ))}
        </div>

        {/* Month navigator (monthly only) */}
        {period === "monthly" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setMonthOffset(o => o + 1)} style={{
              width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--border)",
              background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChevronLeft size={16} color="var(--text2)" />
            </button>
            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", minWidth: 110, textAlign: "center" }}>
              <Calendar size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
              {currentMonth}
            </span>
            <button onClick={() => setMonthOffset(o => Math.max(0, o - 1))} disabled={monthOffset === 0} style={{
              width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--border)",
              background: "#fff", cursor: monthOffset === 0 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: monthOffset === 0 ? 0.4 : 1,
            }}>
              <ChevronRight size={16} color="var(--text2)" />
            </button>
          </div>
        )}
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard
          icon={<TrendingDown size={20} color="#EF4444" />}
          label="Weight Change"
          value={`${weightChange} kg`}
          sub="this week"
          color="#EF4444"
          trend="down"
        />
        <StatCard
          icon={<BarChart2 size={20} color="#F59E0B" />}
          label="Avg Calories"
          value={`${avgCalories}`}
          sub="kcal/day"
          color="#F59E0B"
          trend="neutral"
        />
        <StatCard
          icon={<Droplets size={20} color="#06B6D4" />}
          label="Water Intake"
          value={`${avgWater} L`}
          sub="per day"
          color="#06B6D4"
          trend="up"
        />
        <StatCard
          icon={<Moon size={20} color="#6366F1" />}
          label="Avg Sleep"
          value={`${avgSleep}h`}
          sub="per night"
          color="#6366F1"
          trend="up"
        />
      </div>

      {/* ── Charts Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

        {/* Weight Progress */}
        <ChartCard title="Weight Progress" icon={<TrendingDown size={16} color="#EF4444" />} color="#EF4444">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>
              {period === "weekly" ? "Past 7 days" : "Past 30 days"}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#EF4444" }}>
              {period === "weekly" ? `${weekData[0].weight} → ${weekData[weekData.length - 1].weight} kg` : `${monthWeightData[0].weight} → ${monthWeightData[monthWeightData.length - 1].weight} kg`}
            </span>
          </div>
          {period === "weekly" ? (
            <LineChart
              data={weekData} valueKey="weight" color="#EF4444"
              gradientId="wt-grad" yMin={77} yMax={80} unit=" kg"
            />
          ) : (
            <LineChart
              data={monthWeightData.filter((_, i) => i % 5 === 0 || i === monthWeightData.length - 1)}
              valueKey="weight" color="#EF4444"
              gradientId="wt-grad-m" yMin={72} yMax={83} unit=" kg"
            />
          )}
        </ChartCard>

        {/* Calorie Intake */}
        <ChartCard title="Calorie Intake" icon={<BarChart2 size={16} color="#F59E0B" />} color="#F59E0B">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>Daily calories</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B" }}>Goal: 2000 kcal</span>
          </div>
          <BarChart data={weekData} valueKey="calories" color="#F59E0B" maxVal={2600} unit="" />
          {/* Goal line annotation */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 11, color: "var(--text2)" }}>
            <div style={{ width: 20, height: 2, background: "#EF4444", borderRadius: 1 }} />
            Goal: 2000 kcal
          </div>
        </ChartCard>

        {/* Water Intake */}
        <ChartCard title="Water Intake" icon={<Droplets size={16} color="#06B6D4" />} color="#06B6D4">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>Litres per day</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#06B6D4" }}>Goal: 3 L</span>
          </div>
          <BarChart data={weekData} valueKey="water" color="#06B6D4" maxVal={3.5} unit="L" />
        </ChartCard>

        {/* Sleep Analysis */}
        <ChartCard title="Sleep Analysis" icon={<Moon size={16} color="#6366F1" />} color="#6366F1">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>Hours per night</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#6366F1" }}>Goal: 8h</span>
          </div>
          <LineChart
            data={weekData} valueKey="sleep" color="#6366F1"
            gradientId="sl-grad" yMin={5} yMax={10} unit="h"
          />
        </ChartCard>
      </div>

      {/* ── Goal Completion ── */}
      <div style={{
        background: "#fff", borderRadius: 20, padding: 24,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
        marginBottom: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Target size={18} color="#2EC972" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Goal Completion</span>
        </div>

        {/* Rings row */}
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
          <GoalRing pct={90} color="#F59E0B" label="Calories Goal" value="2100/2000" />
          <GoalRing pct={85} color="#06B6D4" label="Water Goal" value="2.7/3 L" />
          <GoalRing pct={95} color="#6366F1" label="Sleep Goal" value="7.8/8h" />
          <GoalRing pct={70} color="#2EC972" label="Workout Goal" value="3.5/5 days" />
        </div>

        {/* Progress bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Calories Goal", pct: 90, color: "#F59E0B", detail: "Avg 2,100 kcal vs 2,000 goal" },
            { label: "Water Goal", pct: 85, color: "#06B6D4", detail: "2.7 L/day vs 3 L goal" },
            { label: "Sleep Goal", pct: 95, color: "#6366F1", detail: "7.8h/night vs 8h goal" },
            { label: "Workout Goal", pct: 70, color: "#2EC972", detail: "3.5 days vs 5 days goal" },
          ].map(({ label, pct, color, detail }) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>
                  {pct}% <span style={{ fontWeight: 400, color: "var(--text2)", fontSize: 12 }}>— {detail}</span>
                </span>
              </div>
              <div style={{ height: 8, background: "var(--bg)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`, borderRadius: 4,
                  background: `linear-gradient(90deg, ${color}88, ${color})`,
                  transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Weekly/Monthly Summary Table ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a4d2e 0%, #2d7a47 100%)",
        borderRadius: 20, padding: 24, color: "#fff",
        boxShadow: "0 4px 24px rgba(46,201,114,0.2)",
      }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>
          📋 {period === "weekly" ? "Weekly" : "Monthly"} Summary — {currentMonth}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Day", "Calories", "Water", "Sleep", "Weight", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "rgba(255,255,255,0.65)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekData.map((d, i) => {
                const calOk = d.calories <= 2000;
                const waterOk = d.water >= 3;
                const sleepOk = d.sleep >= 8;
                const allOk = calOk && waterOk && sleepOk;
                return (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{d.label}</td>
                    <td style={{ padding: "10px 12px", color: calOk ? "#86efac" : "#fca5a5" }}>{d.calories} kcal</td>
                    <td style={{ padding: "10px 12px", color: waterOk ? "#67e8f9" : "#fca5a5" }}>{d.water} L</td>
                    <td style={{ padding: "10px 12px", color: sleepOk ? "#c4b5fd" : "#fca5a5" }}>{d.sleep}h</td>
                    <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.9)" }}>{d.weight} kg</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        background: allOk ? "rgba(134,239,172,0.2)" : "rgba(252,165,165,0.2)",
                        color: allOk ? "#86efac" : "#fca5a5",
                        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      }}>
                        {allOk ? "✅ On Track" : "⚠️ Off Track"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
