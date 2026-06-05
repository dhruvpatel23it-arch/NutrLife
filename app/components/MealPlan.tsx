"use client";
import { useState } from "react";
import Modal from "./Modal";
import Toast from "./Toast";

type Meal = { emoji: string; name: string };
type DayPlan = { label: string; date: string; today?: boolean; meals: Meal[]; cal: number };

const EMOJIS = ["🥣","🍳","🥞","🥗","🍱","🥘","🍚","🍝","🍗","🥩","🐟","🥑","🍎","🍇","🥜","🥙","🌮","🍜","🥦","🍲"];
const WEEK_DAYS: DayPlan[] = [
  { label: "MON", date: "Jun 2", today: true, meals: [
    { emoji: "🥣", name: "Berry Oatmeal" }, { emoji: "🥗", name: "Chicken Salad" },
    { emoji: "🥘", name: "Lentil Dal" }, { emoji: "🍎", name: "Apple (snack)" }
  ], cal: 1890 },
  { label: "TUE", date: "Jun 3", meals: [
    { emoji: "🍓", name: "Smoothie Bowl" }, { emoji: "🐟", name: "Baked Salmon" },
    { emoji: "🥙", name: "Veggie Wrap" }, { emoji: "🥚", name: "Boiled Egg" }
  ], cal: 1840 },
  { label: "WED", date: "Jun 4", meals: [
    { emoji: "🥣", name: "Berry Oatmeal" }, { emoji: "🍗", name: "Herb Chicken" },
    { emoji: "🥦", name: "Stir‑fry Veg" }, { emoji: "🥑", name: "Avocado Toast" }
  ], cal: 1950 },
  { label: "THU", date: "Jun 5", meals: [
    { emoji: "🍳", name: "Egg Omelette" }, { emoji: "🥗", name: "Tuna Salad" },
    { emoji: "🍚", name: "Brown Rice Bowl" }, { emoji: "🍊", name: "Orange" }
  ], cal: 1820 },
  { label: "FRI", date: "Jun 6", meals: [
    { emoji: "🥞", name: "Wheat Pancakes" }, { emoji: "🥗", name: "Greek Salad" },
    { emoji: "🥩", name: "Grilled Steak" }, { emoji: "🍇", name: "Grapes" }
  ], cal: 2100 },
  { label: "SAT", date: "Jun 7", meals: [
    { emoji: "🍓", name: "Fruit Bowl" }, { emoji: "🥘", name: "Chickpea Curry" },
    { emoji: "🍱", name: "Mixed Bento" }, { emoji: "🥜", name: "Mixed Nuts" }
  ], cal: 1780 },
  { label: "SUN", date: "Jun 8", meals: [
    { emoji: "🥣", name: "Granola Parfait" }, { emoji: "🥗", name: "Caesar Salad" },
    { emoji: "🍝", name: "Wheat Pasta" }, { emoji: "🍎", name: "Apple + PB" }
  ], cal: 1960 }
];

export default function MealPlan() {
  const [weekDays, setWeekDays] = useState(WEEK_DAYS);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDayIdx, setEditDayIdx] = useState<number | null>(null);
  const [editMealIdx, setEditMealIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState("");

  const [addModalDay, setAddModalDay] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🍽️");

  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 3000);
  };

  const openEdit = (dayIdx: number, mealIdx: number) => {
    const meal = weekDays[dayIdx].meals[mealIdx];
    setEditDayIdx(dayIdx);
    setEditMealIdx(mealIdx);
    setEditName(meal.name);
    setEditEmoji(meal.emoji);
    setEditModalOpen(true);
  };

  const saveEdit = () => {
    if (editDayIdx !== null && editMealIdx !== null) {
      setWeekDays(prev => {
        const newDays = [...prev];
        const day = { ...newDays[editDayIdx] };
        const meals = [...day.meals];
        meals[editMealIdx] = { ...meals[editMealIdx], name: editName, emoji: editEmoji };
        day.meals = meals;
        newDays[editDayIdx] = day;
        return newDays;
      });
      showToast("✅ Meal updated!");
    }
    setEditModalOpen(false);
  };

  const deleteMeal = (dayIdx: number, mealIdx: number) => {
    setWeekDays(prev => {
      const newDays = [...prev];
      const day = { ...newDays[dayIdx] };
      day.meals = day.meals.filter((_, i) => i !== mealIdx);
      newDays[dayIdx] = day;
      return newDays;
    });
    showToast("🗑️ Meal removed");
  };

  const openAdd = (dayIdx: number) => {
    setAddModalDay(dayIdx);
    setNewName("");
    setNewEmoji("🍽️");
  };

  const saveAdd = () => {
    if (addModalDay === null) return;
    if (!newName.trim()) return;
    setWeekDays(prev => {
      const newDays = [...prev];
      const day = { ...newDays[addModalDay] };
      day.meals = [...day.meals, { emoji: newEmoji, name: newName }];
      newDays[addModalDay] = day;
      return newDays;
    });
    setAddModalDay(null);
    showToast("✅ Meal added!");
  };

  const avgCal = Math.round(weekDays.reduce((s, d) => s + d.cal, 0) / weekDays.length);

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 19, fontWeight: 700 }}>📅 Weekly Meal Plan</h3>
      </div>
      <div className="mealplan-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
        {weekDays.map((day, i) => (
          <div key={i} style={{
            background: day.today ? "var(--green-light)" : "var(--card)",
            borderRadius: "var(--radius-sm)",
            border: `1.5px solid ${day.today ? "var(--green)" : "var(--border)"}`,
            padding: 12,
            minHeight: 220,
            transition: "all .2s"
          }}>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: day.today ? "var(--green-dark)" : "var(--text)" }}>
              {day.label} · {day.date}
              {day.today && <span style={{ display: "block", fontSize: 10, color: "var(--green)", marginTop: 2 }}>TODAY</span>}
            </div>
            {day.meals.map((m, j) => (
              <div key={j} style={{ fontSize: 11.5, padding: "5px 8px", background: day.today ? "rgba(255,255,255,0.8)" : "#fff", borderRadius: 8, marginBottom: 5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{m.emoji} {m.name}</span>
                <div>
                  <button onClick={() => openEdit(i, j)} style={{ marginRight: 6, background: "none", border: "none", color: "var(--green)", cursor: "pointer" }}>✏️</button>
                  <button onClick={() => deleteMeal(i, j)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer" }}>🗑️</button>
                </div>
              </div>
            ))}
            <button onClick={() => openAdd(i)} style={{ marginTop: 8, background: "none", border: "1px dashed var(--border)", color: "var(--text2)", padding: "4px 8px", borderRadius: 6, cursor: "pointer" }}>+ Add Meal</button>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 8, fontWeight: 600 }}>~{day.cal.toLocaleString()} kcal</div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <Modal title="Edit Meal" onClose={() => setEditModalOpen(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>Emoji</label>
            <input value={editEmoji} onChange={e => setEditEmoji(e.target.value)} placeholder="e.g. 🍲" style={{ padding: "8px", borderRadius: 6, border: "1px solid var(--border)" }} />
            <label>Name</label>
            <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Meal name" style={{ padding: "8px", borderRadius: 6, border: "1px solid var(--border)" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
              <button onClick={() => setEditModalOpen(false)} style={{ padding: "8px 14px", borderRadius: 6, background: "#fff", border: "1px solid var(--border)", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveEdit} style={{ padding: "8px 14px", borderRadius: 6, background: "var(--green)", color: "#fff", border: "none", cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Modal */}
      {addModalDay !== null && (
        <Modal title="Add Meal" onClose={() => setAddModalDay(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>Meal Name</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Avocado Toast" style={{ padding: "8px", borderRadius: 6, border: "1px solid var(--border)" }} />
            <label>Emoji</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setNewEmoji(e)} style={{ fontSize: 22, width: 40, height: 40, borderRadius: 10, cursor: "pointer", border: `2px solid ${newEmoji === e ? "var(--green)" : "var(--border)"}`, background: newEmoji === e ? "var(--green-light)" : "#fff", transition: "all .15s" }}>{e}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={() => setAddModalDay(null)} style={{ flex: 1, padding: "11px 16px", borderRadius: 30, border: "1.5px solid var(--border)", background: "#fff", color: "var(--text2)", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={saveAdd} style={{ flex: 1, padding: "11px 16px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Add Meal ✓</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Weekly Nutrition Summary */}
      <div style={{ marginTop: 22, background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>📊 Weekly Nutrition Summary</div>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[{ label: "Avg Calories", val: `${avgCal.toLocaleString()} kcal`, pct: Math.min(100, Math.round(avgCal / 20)), color: "var(--green)" },
            { label: "Avg Protein", val: "118g", pct: 79, color: "var(--orange)" },
            { label: "Avg Carbs", val: "220g", pct: 88, color: "#FFD166" },
            { label: "Avg Fat", val: "58g", pct: 89, color: "var(--purple)" }].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{s.val}</div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} /></div>
                <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>{s.pct}% of goal</div>
              </div>
            ))}
        </div>
      </div>

      <Toast msg={toastMsg} show={toastShow} />
    </div>
  );
}
