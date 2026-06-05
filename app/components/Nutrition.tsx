"use client";
import { useState } from "react";
import { NUTRITION_TABLE } from "../data/data";

const VITAMINS = [
  { name: "Vitamin A", daily: "900 mcg", source: "Carrots, sweet potato, spinach", benefit: "Vision, immune function, skin health" },
  { name: "Vitamin B12", daily: "2.4 mcg", source: "Meat, fish, eggs, dairy", benefit: "Nerve function, red blood cells" },
  { name: "Vitamin C", daily: "90 mg", source: "Citrus, bell peppers, broccoli", benefit: "Immunity, collagen, antioxidant" },
  { name: "Vitamin D", daily: "600 IU", source: "Sunlight, fatty fish, fortified foods", benefit: "Bone health, immunity, mood" },
  { name: "Vitamin E", daily: "15 mg", source: "Nuts, seeds, vegetable oils", benefit: "Antioxidant, skin, immune support" },
  { name: "Vitamin K", daily: "120 mcg", source: "Leafy greens, broccoli", benefit: "Blood clotting, bone metabolism" },
  { name: "Folate (B9)", daily: "400 mcg", source: "Legumes, leafy greens, citrus", benefit: "DNA synthesis, cell division" },
  { name: "Iron", daily: "8–18 mg", source: "Red meat, lentils, spinach", benefit: "Oxygen transport, energy" },
  { name: "Calcium", daily: "1,000 mg", source: "Dairy, fortified plant milk, broccoli", benefit: "Bones, teeth, muscle function" },
  { name: "Magnesium", daily: "420 mg", source: "Nuts, seeds, whole grains", benefit: "Muscle, nerve function, energy" },
  { name: "Zinc", daily: "11 mg", source: "Meat, shellfish, legumes, nuts", benefit: "Immunity, wound healing, taste" },
  { name: "Potassium", daily: "3,500 mg", source: "Bananas, potatoes, legumes", benefit: "Heart, fluid balance, muscles" },
];

const CATEGORIES = ["All", "Protein", "Grains", "Vegetables", "Fruits", "Dairy", "Legumes", "Nuts"];

export default function Nutrition() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"food" | "cal" | "protein" | "carbs" | "fat">("food");

  const filtered = NUTRITION_TABLE
    .filter(r => {
      const matchSearch = r.food.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "All" || r.category === catFilter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "food") return a.food.localeCompare(b.food);
      return (b[sortBy] as number) - (a[sortBy] as number);
    });

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 19, fontWeight: 700 }}>🥦 Nutrition Info</h3>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid var(--border)", borderRadius: 30, padding: "8px 16px", flex: 1, minWidth: 200 }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food..." style={{ border: "none", background: "none", outline: "none", fontSize: 14, width: "100%" }} />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} style={{ padding: "8px 14px", borderRadius: 20, border: "1.5px solid var(--border)", background: "#fff", fontSize: 13, cursor: "pointer" }}>
          <option value="food">Sort: Name</option>
          <option value="cal">Sort: Calories</option>
          <option value="protein">Sort: Protein</option>
          <option value="carbs">Sort: Carbs</option>
          <option value="fat">Sort: Fat</option>
        </select>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{
            padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
            cursor: "pointer", border: "1.5px solid var(--border)",
            background: catFilter === c ? "var(--green)" : "#fff",
            color: catFilter === c ? "#fff" : "var(--text2)", transition: "all .2s"
          }}>{c}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "var(--card)", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden", marginBottom: 28 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--green-light)" }}>
                {["Food (per 100g)", "Calories", "Protein", "Carbs", "Fat", "Fiber", "Sugar", "Category"].map(h => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: 700, color: "var(--green-dark)", fontSize: 13, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "#fff" : "#fafffe" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{row.food}</td>
                  <td style={{ padding: "12px 16px", color: "var(--orange)", fontWeight: 700 }}>{row.cal}</td>
                  <td style={{ padding: "12px 16px", color: "var(--green-dark)", fontWeight: 600 }}>{row.protein}g</td>
                  <td style={{ padding: "12px 16px" }}>{row.carbs}g</td>
                  <td style={{ padding: "12px 16px" }}>{row.fat}g</td>
                  <td style={{ padding: "12px 16px", color: "#2e7d32" }}>{row.fiber}g</td>
                  <td style={{ padding: "12px 16px", color: "#b8854c" }}>{row.sugar}g</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "var(--green-light)", color: "var(--green-dark)", fontSize: 11, padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>{row.category}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vitamins & minerals */}
      <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🌿 Essential Vitamins & Minerals</div>
      <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {VITAMINS.map((v, i) => (
          <div key={i} style={{ background: "linear-gradient(135deg, var(--green-light), #fff)", borderRadius: "var(--radius-sm)", padding: 18, border: "1.5px solid var(--border)", transition: "all .2s" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "var(--shadow)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{v.name}</div>
            <div style={{ fontSize: 12, color: "var(--green-dark)", fontWeight: 600, marginBottom: 6 }}>Daily: {v.daily}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>📍 {v.source}</div>
            <div style={{ fontSize: 12, color: "var(--text)" }}>✨ {v.benefit}</div>
          </div>
        ))}
      </div>

      {/* Macronutrient info cards */}
      <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="grid-3col">
        {[
          { icon: "🌿", title: "Vitamins Explained", body: "Vitamin C boosts immunity. B vitamins support energy metabolism. Vitamin K aids blood clotting and bone health. Aim for variety in your diet." },
          { icon: "💪", title: "Top Protein Sources", body: "Chicken breast: 31g/100g. Eggs: 13g each. Lentils: 18g/cup. Greek yogurt: 17g/cup. Tuna: 29g/100g. Cottage cheese: 11g/100g." },
          { icon: "🌾", title: "Fiber Benefits", body: "Aim for 25–30g daily. Fiber aids digestion, lowers cholesterol, stabilizes blood sugar, and keeps you full longer. Best sources: legumes, oats, vegetables." },
        ].map((card, i) => (
          <div key={i} style={{ background: "linear-gradient(135deg, var(--green-light), #fff)", borderRadius: "var(--radius-sm)", padding: 18, border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 28 }}>{card.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{card.title}</div>
            <div style={{ fontSize: 13.5, color: "var(--text2)", lineHeight: 1.5 }}>{card.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
