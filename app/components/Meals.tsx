"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MEAL_LOG } from "../data/data";
import Modal, { FormGroup, Input, Select } from "./Modal";

export default function Meals({ showToast }: { showToast: (msg: string) => void }) {
  const [expanded, setExpanded] = useState<number[]>([0, 1, 2, 3]);
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Today");

  const toggleSection = (i: number) => {
    setExpanded(e => e.includes(i) ? e.filter(x => x !== i) : [...e, i]);
  };

  const total = MEAL_LOG.reduce((a, m) => a + m.cal, 0);
  const goal = 2000;

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 19, fontWeight: 700 }}>🍽️ Meal Log</h3>
        <button onClick={() => setModal(true)} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          + Log Food
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {["Today", "Yesterday", "This Week", "Custom Range"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: "7px 18px", borderRadius: 20, fontSize: 13.5, fontWeight: 500,
            cursor: "pointer", border: "1.5px solid var(--border)",
            background: activeTab === t ? "var(--green)" : "#fff",
            color: activeTab === t ? "#fff" : "var(--text2)",
            transition: "all .2s"
          }}>{t}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Consumed", val: `${total} kcal`, color: "var(--green-dark)" },
          { label: "Remaining", val: `${goal - total} kcal`, color: "var(--orange)" },
          { label: "Protein", val: "112g", color: "var(--purple)" },
          { label: "Carbs", val: "188g", color: "#b8854c" },
        ].map(c => (
          <div key={c.label} style={{ background: "var(--card)", borderRadius: "var(--radius-sm)", padding: "18px 20px", border: "1.5px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 26, fontWeight: 700, color: c.color }}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Calorie bar */}
      <div style={{ background: "var(--card)", borderRadius: "var(--radius-sm)", padding: "16px 20px", border: "1.5px solid var(--border)", marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>Daily Calorie Progress</span>
          <span style={{ color: "var(--text2)" }}>{total} / {goal} kcal ({Math.round(total / goal * 100)}%)</span>
        </div>
        <div className="progress-bar" style={{ height: 12 }}>
          <div className="progress-fill" style={{ width: `${Math.min(total / goal * 100, 100)}%`, background: "var(--green)" }} />
        </div>
      </div>

      {/* Meals */}
      <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
        {MEAL_LOG.map((meal, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div
              onClick={() => toggleSection(i)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "var(--green-light)", padding: "10px 16px", borderRadius: 10,
                marginBottom: expanded.includes(i) ? 10 : 0, cursor: "pointer"
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14.5, color: "var(--green-dark)" }}>{meal.time}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "var(--text2)" }}>{meal.cal} kcal</span>
                {expanded.includes(i) ? <ChevronUp size={16} color="var(--green-dark)" /> : <ChevronDown size={16} color="var(--green-dark)" />}
              </div>
            </div>
            {expanded.includes(i) && meal.foods.map((f, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 4px", borderBottom: j < meal.foods.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: 22 }}>{f.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>{f.detail}</div>
                </div>
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--green-dark)" }}>{f.cal} kcal</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {modal && (
        <Modal title="🍽️ Log Food" onClose={() => setModal(false)}>
          <FormGroup label="Meal Time"><Select><option>Breakfast</option><option>Snack</option><option>Lunch</option><option>Dinner</option></Select></FormGroup>
          <FormGroup label="Food Name"><Input placeholder="e.g. Grilled Chicken" /></FormGroup>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormGroup label="Quantity (g)"><Input type="number" defaultValue={100} /></FormGroup>
            <FormGroup label="Calories (kcal)"><Input type="number" placeholder="auto-fill" /></FormGroup>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <FormGroup label="Protein (g)"><Input type="number" placeholder="0" /></FormGroup>
            <FormGroup label="Carbs (g)"><Input type="number" placeholder="0" /></FormGroup>
            <FormGroup label="Fat (g)"><Input type="number" placeholder="0" /></FormGroup>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
            <button onClick={() => setModal(false)} style={{ padding: "10px 20px", borderRadius: 30, border: "1.5px solid var(--green)", background: "none", color: "var(--green)", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => { setModal(false); showToast("Food logged successfully!"); }} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Log Food ✓</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
