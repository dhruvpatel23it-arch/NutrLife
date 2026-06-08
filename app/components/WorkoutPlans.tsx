"use client";
import { useState, useMemo } from "react";
import {
  Dumbbell, Flame, Clock, Play, ChevronRight, Check,
  Filter, BarChart2, Bell, ChevronDown, ChevronUp, X,
  Home, Building2, Star, Trophy, Zap, Heart,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Level = "Beginner" | "Intermediate" | "Advanced";
type WorkoutType = "Weight Loss" | "Muscle Gain" | "Yoga & Flexibility" | "HIIT" | "Cardio";
type Location = "Home" | "Gym" | "Both";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  calories: number;
  instructions: string[];
  muscles: string[];
  videoTip: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  totalCalories: number;
  duration: number; // minutes
}

interface WorkoutPlan {
  id: string;
  title: string;
  emoji: string;
  type: WorkoutType;
  level: Level;
  location: Location;
  duration: number; // days
  daysPerWeek: number;
  totalCaloriesPerWeek: number;
  description: string;
  color: string;
  gradient: string;
  schedule: WorkoutDay[];
  completedDays?: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: "wl-30",
    title: "Weight Loss Blitz",
    emoji: "🏃",
    type: "Weight Loss",
    level: "Beginner",
    location: "Home",
    duration: 30,
    daysPerWeek: 5,
    totalCaloriesPerWeek: 2800,
    description: "A high-energy cardio + HIIT program designed for maximum fat burn. No equipment needed.",
    color: "#EF4444",
    gradient: "linear-gradient(135deg, #EF4444, #F97316)",
    completedDays: 7,
    schedule: [
      {
        day: "Day 1 — Cardio Blast",
        focus: "Full Body Cardio",
        duration: 35,
        totalCalories: 320,
        exercises: [
          { name: "Jumping Jacks", sets: 3, reps: "45 sec", rest: "15 sec", calories: 30, muscles: ["Full Body"], videoTip: "Land softly on balls of feet", instructions: ["Stand with feet together", "Jump feet out while raising arms overhead", "Jump back to start", "Keep core tight throughout"] },
          { name: "High Knees", sets: 3, reps: "40 sec", rest: "20 sec", calories: 35, muscles: ["Legs", "Core"], videoTip: "Drive knees to hip height", instructions: ["Run in place driving knees up", "Pump arms opposite to legs", "Stay on balls of feet", "Maintain upright posture"] },
          { name: "Burpees", sets: 3, reps: "10 reps", rest: "30 sec", calories: 60, muscles: ["Full Body"], videoTip: "Explosive jump at the top", instructions: ["Drop hands to floor", "Jump feet back to plank", "Do a push-up", "Jump feet forward and leap up"] },
          { name: "Mountain Climbers", sets: 3, reps: "30 sec", rest: "15 sec", calories: 40, muscles: ["Core", "Shoulders"], videoTip: "Keep hips level", instructions: ["Start in plank position", "Drive one knee toward chest", "Alternate legs rapidly", "Keep hips from bouncing"] },
        ],
      },
      {
        day: "Day 2 — Lower Body",
        focus: "Legs & Glutes",
        duration: 30,
        totalCalories: 280,
        exercises: [
          { name: "Squats", sets: 4, reps: "20 reps", rest: "30 sec", calories: 40, muscles: ["Quads", "Glutes"], videoTip: "Knees track over toes", instructions: ["Feet shoulder-width apart", "Lower until thighs parallel to floor", "Push through heels to rise", "Keep chest tall"] },
          { name: "Reverse Lunges", sets: 3, reps: "12 each leg", rest: "20 sec", calories: 35, muscles: ["Quads", "Hamstrings"], videoTip: "Step back far enough", instructions: ["Step back with one foot", "Lower back knee toward floor", "Push front foot to return", "Alternate legs"] },
          { name: "Glute Bridges", sets: 3, reps: "20 reps", rest: "20 sec", calories: 25, muscles: ["Glutes", "Hamstrings"], videoTip: "Squeeze glutes at the top", instructions: ["Lie on back, knees bent", "Drive hips up by squeezing glutes", "Hold 1 second at top", "Lower slowly"] },
          { name: "Wall Sit", sets: 3, reps: "45 sec", rest: "30 sec", calories: 30, muscles: ["Quads"], videoTip: "Thighs parallel to ground", instructions: ["Back flat against wall", "Slide down until 90° knee bend", "Hold position", "Keep arms relaxed"] },
        ],
      },
      { day: "Day 3 — Rest / Active Recovery", focus: "Stretching", duration: 20, totalCalories: 80, exercises: [] },
    ],
  },
  {
    id: "mg-45",
    title: "Muscle Gain Power",
    emoji: "💪",
    type: "Muscle Gain",
    level: "Intermediate",
    location: "Gym",
    duration: 45,
    daysPerWeek: 4,
    totalCaloriesPerWeek: 2200,
    description: "Progressive overload program targeting hypertrophy. Split training with compound lifts.",
    color: "#6366F1",
    gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    completedDays: 12,
    schedule: [
      {
        day: "Day 1 — Chest & Triceps",
        focus: "Push Day",
        duration: 60,
        totalCalories: 420,
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8–10 reps", rest: "90 sec", calories: 80, muscles: ["Chest", "Triceps"], videoTip: "Arch slightly, retract scapula", instructions: ["Lie on bench, feet flat", "Grip slightly wider than shoulders", "Lower bar to mid-chest", "Press explosively up"] },
          { name: "Incline Dumbbell Fly", sets: 3, reps: "12 reps", rest: "60 sec", calories: 50, muscles: ["Upper Chest"], videoTip: "Slight bend in elbows", instructions: ["Set bench to 30–45°", "Hold dumbbells above chest", "Open arms in arc motion", "Squeeze chest to bring back"] },
          { name: "Tricep Dips", sets: 3, reps: "15 reps", rest: "60 sec", calories: 45, muscles: ["Triceps"], videoTip: "Keep elbows close", instructions: ["Grip parallel bars", "Lower body until elbows 90°", "Push up to start", "Lean slightly forward"] },
          { name: "Cable Crossover", sets: 3, reps: "15 reps", rest: "45 sec", calories: 35, muscles: ["Chest"], videoTip: "Control the eccentric", instructions: ["Set cables at shoulder height", "Step forward, slight lean", "Bring hands together in arc", "Squeeze chest at center"] },
        ],
      },
      {
        day: "Day 2 — Back & Biceps",
        focus: "Pull Day",
        duration: 65,
        totalCalories: 450,
        exercises: [
          { name: "Deadlift", sets: 4, reps: "6–8 reps", rest: "120 sec", calories: 100, muscles: ["Back", "Hamstrings", "Glutes"], videoTip: "Neutral spine throughout", instructions: ["Bar over mid-foot", "Hip-hinge to grip bar", "Brace core, drive hips forward", "Lock out at top"] },
          { name: "Pull-ups", sets: 4, reps: "8–10 reps", rest: "90 sec", calories: 60, muscles: ["Lats", "Biceps"], videoTip: "Full range of motion", instructions: ["Dead hang grip shoulder-width", "Pull chest to bar", "Control the descent", "Avoid kipping"] },
          { name: "Seated Cable Row", sets: 3, reps: "12 reps", rest: "60 sec", calories: 45, muscles: ["Mid Back", "Biceps"], videoTip: "Squeeze shoulder blades", instructions: ["Sit upright, slight lean back", "Pull handle to lower chest", "Hold 1 second squeeze", "Return slowly"] },
          { name: "Barbell Curl", sets: 3, reps: "12 reps", rest: "45 sec", calories: 30, muscles: ["Biceps"], videoTip: "Don't swing body", instructions: ["Stand, grip shoulder-width", "Curl bar to shoulder height", "Squeeze at top", "Lower slowly"] },
        ],
      },
    ],
  },
  {
    id: "yoga-21",
    title: "Yoga & Flexibility",
    emoji: "🧘",
    type: "Yoga & Flexibility",
    level: "Beginner",
    location: "Home",
    duration: 21,
    daysPerWeek: 6,
    totalCaloriesPerWeek: 1200,
    description: "21-day mindfulness & flexibility journey. Reduce stress, improve posture & mobility.",
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981, #06B6D4)",
    completedDays: 5,
    schedule: [
      {
        day: "Day 1 — Morning Flow",
        focus: "Sun Salutation",
        duration: 25,
        totalCalories: 120,
        exercises: [
          { name: "Cat-Cow Stretch", sets: 1, reps: "10 cycles", rest: "0 sec", calories: 10, muscles: ["Spine", "Core"], videoTip: "Breathe into each position", instructions: ["Start on all fours", "Inhale: drop belly, lift head (Cow)", "Exhale: arch back, tuck chin (Cat)", "Flow smoothly with breath"] },
          { name: "Downward Dog", sets: 1, reps: "30 sec hold", rest: "10 sec", calories: 12, muscles: ["Hamstrings", "Shoulders"], videoTip: "Push through palms, not wrists", instructions: ["From all fours, tuck toes", "Lift hips up and back", "Straighten legs, heels toward floor", "Relax head between arms"] },
          { name: "Warrior I", sets: 1, reps: "20 sec each side", rest: "10 sec", calories: 15, muscles: ["Legs", "Core"], videoTip: "Stack hips forward", instructions: ["Lunge with front knee at 90°", "Raise arms overhead", "Square hips to front", "Look straight ahead"] },
          { name: "Child's Pose", sets: 1, reps: "45 sec", rest: "0 sec", calories: 5, muscles: ["Back", "Hips"], videoTip: "Let gravity do the work", instructions: ["Kneel and sit on heels", "Stretch arms forward on mat", "Rest forehead on mat", "Breathe deeply into back"] },
        ],
      },
    ],
  },
  {
    id: "hiit-28",
    title: "HIIT Shred",
    emoji: "⚡",
    type: "HIIT",
    level: "Advanced",
    location: "Both",
    duration: 28,
    daysPerWeek: 4,
    totalCaloriesPerWeek: 3200,
    description: "High-intensity intervals for elite fat loss and conditioning. 20–30 min sessions.",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    completedDays: 2,
    schedule: [],
  },
  {
    id: "cardio-60",
    title: "Cardio Endurance",
    emoji: "🫀",
    type: "Cardio",
    level: "Intermediate",
    location: "Gym",
    duration: 60,
    daysPerWeek: 5,
    totalCaloriesPerWeek: 3500,
    description: "Build cardiovascular endurance with progressive running and cycling programs.",
    color: "#06B6D4",
    gradient: "linear-gradient(135deg, #06B6D4, #3B82F6)",
    completedDays: 0,
    schedule: [],
  },
];

// ─── Calories Calculator data ─────────────────────────────────────────────────

const EXERCISE_MET: { name: string; met: number; emoji: string }[] = [
  { name: "Running (8 km/h)", met: 8.3, emoji: "🏃" },
  { name: "Cycling (moderate)", met: 6.8, emoji: "🚴" },
  { name: "Swimming", met: 6.0, emoji: "🏊" },
  { name: "Jump Rope", met: 10.0, emoji: "🪢" },
  { name: "Weight Training", met: 5.0, emoji: "🏋️" },
  { name: "HIIT", met: 9.5, emoji: "⚡" },
  { name: "Yoga", met: 3.0, emoji: "🧘" },
  { name: "Walking (5 km/h)", met: 3.5, emoji: "🚶" },
  { name: "Burpees", met: 8.0, emoji: "💥" },
  { name: "Pilates", met: 3.8, emoji: "🤸" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: Level }) {
  const cfg: Record<Level, { color: string; bg: string }> = {
    Beginner:     { color: "#2EC972", bg: "#F0FDF4" },
    Intermediate: { color: "#F59E0B", bg: "#FFFBEB" },
    Advanced:     { color: "#EF4444", bg: "#FEF2F2" },
  };
  const { color, bg } = cfg[level];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: bg, color }}>
      {level}
    </span>
  );
}

function ProgressRing({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const R = size / 2 - 4;
  const CIRC = 2 * Math.PI * R;
  const dash = Math.min(pct, 100) / 100 * CIRC;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke={color + "22"} strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={`${dash} ${CIRC}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize={size * 0.2} fontWeight="800" fill={color}>
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

// ─── Exercise Card (expandable) ───────────────────────────────────────────────

function ExerciseCard({ ex, idx }: { ex: Exercise; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden",
      marginBottom: 10, transition: "box-shadow .2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
          cursor: "pointer", background: "#fff",
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "var(--green-light)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          fontWeight: 700, fontSize: 13, color: "var(--green)",
        }}>
          {idx + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{ex.name}</div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            {ex.sets} sets · {ex.reps} · Rest: {ex.rest}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            <Flame size={13} />{ex.calories} kcal
          </span>
          <span style={{ fontSize: 11, color: "var(--text2)", background: "var(--bg)", padding: "2px 8px", borderRadius: 8 }}>
            {ex.muscles[0]}
          </span>
          {open ? <ChevronUp size={16} color="var(--text2)" /> : <ChevronDown size={16} color="var(--text2)" />}
        </div>
      </div>

      {open && (
        <div style={{ background: "var(--bg)", padding: "16px 18px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "var(--text)" }}>📋 Instructions</div>
              {ex.instructions.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "var(--text2)" }}>
                  <span style={{ color: "var(--green)", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  {step}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "var(--text)" }}>💡 Pro Tip</div>
              <div style={{
                background: "#FFF9E6", border: "1.5px solid #F59E0B33", borderRadius: 10,
                padding: "10px 12px", fontSize: 13, color: "#92400E",
              }}>
                ⭐ {ex.videoTip}
              </div>
              <div style={{ marginTop: 12, fontWeight: 700, fontSize: 13, marginBottom: 6, color: "var(--text)" }}>🎯 Muscles</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {ex.muscles.map(m => (
                  <span key={m} style={{ fontSize: 11, background: "var(--green-light)", color: "var(--green)", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WorkoutPlans({ showToast }: { showToast: (msg: string) => void }) {
  const [activeTab, setActiveTab] = useState<"plans" | "schedule" | "calculator" | "progress">("plans");
  const [filterLevel, setFilterLevel] = useState<Level | "All">("All");
  const [filterType, setFilterType] = useState<WorkoutType | "All">("All");
  const [filterLocation, setFilterLocation] = useState<Location | "Both" | "All">("All");
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [reminder, setReminder] = useState("");
  const [reminderSaved, setReminderSaved] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  // Calculator state
  const [calcExercise, setCalcExercise] = useState(EXERCISE_MET[0].name);
  const [calcWeight, setCalcWeight] = useState("70");
  const [calcDuration, setCalcDuration] = useState("30");

  const filteredPlans = useMemo(() => WORKOUT_PLANS.filter(p => {
    if (filterLevel !== "All" && p.level !== filterLevel) return false;
    if (filterType !== "All" && p.type !== filterType) return false;
    if (filterLocation !== "All" && p.location !== filterLocation && p.location !== "Both") return false;
    return true;
  }), [filterLevel, filterType, filterLocation]);

  const calcResult = useMemo(() => {
    const met = EXERCISE_MET.find(e => e.name === calcExercise)?.met ?? 5;
    const w = parseFloat(calcWeight) || 70;
    const d = parseFloat(calcDuration) || 30;
    return Math.round((met * w * (d / 60)));
  }, [calcExercise, calcWeight, calcDuration]);

  const handleStartPlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setSelectedDay(0);
    setActiveTab("schedule");
    showToast(`✅ Started: ${plan.title}`);
  };

  const toggleExercise = (key: string) => {
    setCompletedExercises(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const saveReminder = () => {
    if (!reminder) { showToast("Please set a reminder time first."); return; }
    setReminderSaved(true);
    showToast(`⏰ Workout reminder set for ${reminder} daily!`);
  };

  const currentDay = selectedPlan?.schedule[selectedDay];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: "1.5px solid var(--border)", fontSize: 14, outline: "none",
    background: "#fff", boxSizing: "border-box", color: "var(--text)",
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 16,
          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 20px rgba(245,158,11,0.35)",
        }}>
          <Dumbbell size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", margin: 0 }}>
            Workout Plans
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 14, margin: 0 }}>
            Expert routines tailored to your fitness goal
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "var(--bg)", borderRadius: 14, padding: 6, width: "fit-content", flexWrap: "wrap" }}>
        {[
          { id: "plans", label: "🏋️ Plans" },
          { id: "schedule", label: "📅 My Schedule" },
          { id: "calculator", label: "🔥 Calories Calc" },
          { id: "progress", label: "📊 Progress" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)} style={{
            padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, transition: "all .2s",
            background: activeTab === t.id ? "#fff" : "transparent",
            color: activeTab === t.id ? "var(--green-dark)" : "var(--text2)",
            boxShadow: activeTab === t.id ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════ TAB: PLANS ══════════════ */}
      {activeTab === "plans" && (
        <>
          {/* Filters */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "16px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1.5px solid var(--border)",
            marginBottom: 20, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text2)", fontSize: 13, fontWeight: 600 }}>
              <Filter size={16} /> Filters
            </div>
            {/* Level */}
            <div style={{ display: "flex", gap: 6 }}>
              {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(l => (
                <button key={l} onClick={() => setFilterLevel(l)} style={{
                  padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .2s",
                  borderColor: filterLevel === l ? "var(--green)" : "var(--border)",
                  background: filterLevel === l ? "var(--green-light)" : "#fff",
                  color: filterLevel === l ? "var(--green)" : "var(--text2)",
                }}>
                  {l}
                </button>
              ))}
            </div>
            {/* Location */}
            <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
              {(["All", "Home", "Gym"] as const).map(l => (
                <button key={l} onClick={() => setFilterLocation(l)} style={{
                  padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .2s",
                  borderColor: filterLocation === l ? "#6366F1" : "var(--border)",
                  background: filterLocation === l ? "#EEF2FF" : "#fff",
                  color: filterLocation === l ? "#6366F1" : "var(--text2)",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  {l === "Home" ? <Home size={12} /> : l === "Gym" ? <Building2 size={12} /> : null}
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filteredPlans.map(plan => {
              const progressPct = plan.completedDays ? Math.round((plan.completedDays / plan.duration) * 100) : 0;
              return (
                <div key={plan.id} style={{
                  background: "#fff", borderRadius: 20, overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1.5px solid var(--border)",
                  transition: "transform .2s, box-shadow .2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}
                >
                  {/* Card header gradient */}
                  <div style={{ background: plan.gradient, padding: "24px 24px 20px", position: "relative" }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>{plan.emoji}</div>
                    <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>
                      {plan.title}
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
                      {plan.duration} Days · {plan.daysPerWeek}x / week
                    </div>
                    {/* Location badge */}
                    <div style={{
                      position: "absolute", top: 16, right: 16,
                      background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)",
                      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#fff",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      {plan.location === "Home" ? <Home size={11} /> : plan.location === "Gym" ? <Building2 size={11} /> : <Zap size={11} />}
                      {plan.location}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "18px 22px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <LevelBadge level={plan.level} />
                      <span style={{ fontSize: 12, color: "var(--text2)", display: "flex", alignItems: "center", gap: 4 }}>
                        <Flame size={13} color="#EF4444" />{plan.totalCaloriesPerWeek.toLocaleString()} kcal/wk
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 14 }}>
                      {plan.description}
                    </p>

                    {/* Progress bar */}
                    {plan.completedDays !== undefined && plan.completedDays > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>
                          <span>Progress</span>
                          <span style={{ fontWeight: 700, color: plan.color }}>{plan.completedDays}/{plan.duration} days</span>
                        </div>
                        <div style={{ height: 6, background: "var(--bg)", borderRadius: 3 }}>
                          <div style={{ height: "100%", width: `${progressPct}%`, borderRadius: 3, background: plan.gradient }} />
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleStartPlan(plan)}
                        style={{
                          flex: 1, padding: "12px", borderRadius: 12, border: "none",
                          background: plan.gradient, color: "#fff",
                          fontWeight: 700, fontSize: 14, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          transition: "all .2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >
                        <Play size={16} fill="#fff" />
                        {plan.completedDays ? "Continue" : "Start Plan"}
                      </button>
                      <button
                        onClick={() => showToast(`📌 ${plan.title} saved to your list!`)}
                        style={{
                          width: 44, borderRadius: 12, border: `1.5px solid ${plan.color}33`,
                          background: plan.color + "10", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all .2s",
                        }}
                      >
                        <Star size={16} color={plan.color} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPlans.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "var(--text2)" }}>
                <Dumbbell size={48} color="#e5e7eb" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 16, fontWeight: 600 }}>No plans match your filters</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting the level or location filter</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════════ TAB: SCHEDULE ══════════════ */}
      {activeTab === "schedule" && (
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
          {/* Left: Plan selector + day list */}
          <div>
            {/* Plan picker */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1.5px solid var(--border)", marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Active Plan</div>
              {selectedPlan ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{selectedPlan.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{selectedPlan.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>{selectedPlan.duration} days</div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "var(--text2)" }}>
                  No plan selected. <span onClick={() => setActiveTab("plans")} style={{ color: "var(--green)", cursor: "pointer", fontWeight: 600 }}>Pick one →</span>
                </div>
              )}
            </div>

            {/* Day list */}
            {selectedPlan?.schedule.map((day, i) => (
              <div key={i}
                onClick={() => setSelectedDay(i)}
                style={{
                  padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                  marginBottom: 8, transition: "all .2s",
                  background: selectedDay === i ? selectedPlan.gradient : "#fff",
                  border: `1.5px solid ${selectedDay === i ? "transparent" : "var(--border)"}`,
                  color: selectedDay === i ? "#fff" : "var(--text)",
                  boxShadow: selectedDay === i ? `0 4px 16px ${selectedPlan.color}40` : "none",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13 }}>{day.day}</div>
                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                  <Clock size={11} style={{ verticalAlign: "middle", marginRight: 3 }} />{day.duration} min
                  <Flame size={11} style={{ verticalAlign: "middle", margin: "0 3px 0 8px" }} />{day.totalCalories} kcal
                </div>
              </div>
            ))}

            {!selectedPlan && (
              <div style={{ textAlign: "center", padding: 32, color: "var(--text2)", fontSize: 13 }}>
                Select a plan to see the schedule
              </div>
            )}

            {/* Reminder */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1.5px solid var(--border)", marginTop: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Bell size={15} color="#6366F1" />
                <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>Daily Reminder</span>
              </div>
              <input type="time" value={reminder} onChange={e => setReminder(e.target.value)} style={inputStyle} />
              <button onClick={saveReminder} style={{
                width: "100%", marginTop: 10, padding: "10px", borderRadius: 10, border: "none",
                background: reminderSaved ? "var(--green)" : "#6366F1",
                color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                {reminderSaved ? <><Check size={14} /> Saved!</> : <><Bell size={14} /> Set Reminder</>}
              </button>
            </div>
          </div>

          {/* Right: Day detail */}
          <div>
            {currentDay ? (
              <div>
                {currentDay.exercises.length === 0 ? (
                  <div style={{
                    background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", borderRadius: 20,
                    padding: 40, textAlign: "center", border: "1.5px solid #86efac",
                  }}>
                    <div style={{ fontSize: 56, marginBottom: 12 }}>🛁</div>
                    <div style={{ fontWeight: 700, fontSize: 20, color: "#166534", marginBottom: 8 }}>Rest Day</div>
                    <div style={{ color: "#16a34a", fontSize: 14 }}>Recovery is part of the program. Hydrate, stretch, and sleep well!</div>
                  </div>
                ) : (
                  <>
                    <div style={{
                      background: selectedPlan!.gradient, borderRadius: 20, padding: "20px 24px",
                      marginBottom: 20, color: "#fff",
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{currentDay.day}</div>
                      <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>Focus: {currentDay.focus}</div>
                      <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 13 }}>
                        <span>⏱ {currentDay.duration} min</span>
                        <span>🔥 {currentDay.totalCalories} kcal</span>
                        <span>💪 {currentDay.exercises.length} exercises</span>
                      </div>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 12 }}>
                      Exercises
                    </div>
                    {currentDay.exercises.map((ex, i) => {
                      const key = `${currentDay.day}-${i}`;
                      return (
                        <div key={i} style={{ position: "relative" }}>
                          <button
                            onClick={() => toggleExercise(key)}
                            style={{
                              position: "absolute", top: 14, right: 56, zIndex: 5,
                              width: 28, height: 28, borderRadius: 8,
                              border: `2px solid ${completedExercises.has(key) ? "var(--green)" : "var(--border)"}`,
                              background: completedExercises.has(key) ? "var(--green)" : "#fff",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            {completedExercises.has(key) && <Check size={14} color="#fff" />}
                          </button>
                          <ExerciseCard ex={ex} idx={i} />
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            ) : (
              <div style={{
                background: "#fff", borderRadius: 20, padding: 60, textAlign: "center",
                border: "1.5px solid var(--border)", color: "var(--text2)",
              }}>
                <Dumbbell size={48} color="#e5e7eb" style={{ marginBottom: 12 }} />
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No schedule loaded</div>
                <div style={{ fontSize: 13 }}>Choose a plan and start your workout!</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ TAB: CALCULATOR ══════════════ */}
      {activeTab === "calculator" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Input */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: 28,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
          }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 22, color: "var(--text)" }}>
              🔥 Calories Burned Calculator
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                Exercise Type
              </label>
              <select value={calcExercise} onChange={e => setCalcExercise(e.target.value)}
                style={{ ...inputStyle, appearance: "none" }}>
                {EXERCISE_MET.map(e => (
                  <option key={e.name} value={e.name}>{e.emoji} {e.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                  Body Weight (kg)
                </label>
                <input type="number" min="30" max="200" value={calcWeight}
                  onChange={e => setCalcWeight(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                  Duration (minutes)
                </label>
                <input type="number" min="5" max="300" value={calcDuration}
                  onChange={e => setCalcDuration(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Result */}
            <div style={{
              background: "linear-gradient(135deg, #EF4444, #F97316)",
              borderRadius: 16, padding: 24, textAlign: "center", color: "#fff",
            }}>
              <Flame size={32} color="#fff" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>{calcResult}</div>
              <div style={{ fontSize: 15, opacity: 0.9, marginTop: 6 }}>kcal burned</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                {Math.floor(calcDuration)} min · {EXERCISE_MET.find(e => e.name === calcExercise)?.emoji}
              </div>
            </div>
          </div>

          {/* Exercise list */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
          }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: "var(--text)" }}>
              Calories per 30 min (70 kg)
            </div>
            {EXERCISE_MET.map(ex => {
              const cal = Math.round(ex.met * 70 * 0.5);
              const maxCal = Math.max(...EXERCISE_MET.map(e => Math.round(e.met * 70 * 0.5)));
              const pct = (cal / maxCal) * 100;
              const isSelected = ex.name === calcExercise;
              return (
                <div key={ex.name}
                  onClick={() => setCalcExercise(ex.name)}
                  style={{ marginBottom: 10, cursor: "pointer", padding: "8px 10px", borderRadius: 10, transition: "background .15s", background: isSelected ? "#FEF2F2" : "transparent" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500, color: isSelected ? "#EF4444" : "var(--text)" }}>
                      {ex.emoji} {ex.name}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#EF4444" }}>{cal} kcal</span>
                  </div>
                  <div style={{ height: 5, background: "var(--bg)", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: isSelected ? "#EF4444" : "#EF444466" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════ TAB: PROGRESS ══════════════ */}
      {activeTab === "progress" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Overview cards */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Workouts Done", value: "21", icon: <Trophy size={20} color="#F59E0B" />, color: "#F59E0B", sub: "this month" },
              { label: "Calories Burned", value: "12,450", icon: <Flame size={20} color="#EF4444" />, color: "#EF4444", sub: "kcal total" },
              { label: "Active Streak", value: "7 days", icon: <Zap size={20} color="#6366F1" />, color: "#6366F1", sub: "keep going!" },
              { label: "Workout Minutes", value: "840", icon: <Clock size={20} color="#2EC972" />, color: "#2EC972", sub: "this month" },
            ].map(({ label, value, icon, color, sub }) => (
              <div key={label} style={{
                background: "#fff", borderRadius: 18, padding: "18px 22px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
                flex: 1, minWidth: 160,
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  {icon}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{value}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Plan progress list */}
          <div style={{
            background: "#fff", borderRadius: 20, padding: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
          }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18, color: "var(--text)" }}>
              Active Plans Progress
            </div>
            {WORKOUT_PLANS.filter(p => (p.completedDays ?? 0) > 0).map(plan => {
              const pct = Math.round(((plan.completedDays ?? 0) / plan.duration) * 100);
              return (
                <div key={plan.id} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: plan.gradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, flexShrink: 0,
                    }}>
                      {plan.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{plan.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text2)" }}>
                        {plan.completedDays} of {plan.duration} days completed
                      </div>
                    </div>
                    <ProgressRing pct={pct} color={plan.color} />
                  </div>
                  <div style={{ height: 8, background: "var(--bg)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${pct}%`, borderRadius: 4,
                      background: plan.gradient,
                      transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }} />
                  </div>
                </div>
              );
            })}
            {WORKOUT_PLANS.filter(p => (p.completedDays ?? 0) === 0).length > 0 && (
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 8 }}>
                {WORKOUT_PLANS.filter(p => (p.completedDays ?? 0) === 0).length} plans not started yet.{" "}
                <span onClick={() => setActiveTab("plans")} style={{ color: "var(--green)", cursor: "pointer", fontWeight: 600 }}>
                  Start one →
                </span>
              </div>
            )}
          </div>

          {/* Weekly activity heatmap-style */}
          <div style={{
            background: "linear-gradient(135deg, #1a4d2e, #2d7a47)",
            borderRadius: 20, padding: 24, color: "#fff",
          }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
              📅 This Week's Activity
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
                const done = [true, true, false, true, true, false, false][i];
                const today = new Date().getDay();
                const dayNum = [1, 2, 3, 4, 5, 6, 0][i];
                const isToday = today === dayNum;
                return (
                  <div key={d} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      width: "100%", aspectRatio: "1",
                      borderRadius: 12, marginBottom: 6,
                      background: done ? "rgba(46,201,114,0.7)" : "rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                      border: isToday ? "2px solid #fff" : "2px solid transparent",
                    }}>
                      {done ? "✅" : "○"}
                    </div>
                    <div style={{ fontSize: 11, color: isToday ? "#fff" : "rgba(255,255,255,0.65)", fontWeight: isToday ? 700 : 400 }}>
                      {d}
                    </div>
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
