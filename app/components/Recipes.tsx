"use client";
import { useState } from "react";
import { Star, Clock, Flame, Users } from "lucide-react";
import { RECIPES } from "../data/data";
import Modal, { FormGroup, Input, Select } from "./Modal";

const FILTER_TABS = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Vegetarian", "High Protein", "Vegan", "Keto"];
const CAT_MAP: Record<string, string> = {
  "All": "all", "Breakfast": "breakfast", "Lunch": "lunch", "Dinner": "dinner",
  "Snacks": "snack", "Vegetarian": "veg", "High Protein": "highprotein", "Vegan": "vegan", "Keto": "keto"
};

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  "Breakfast": { bg: "var(--green-light)", color: "var(--green-dark)" },
  "Lunch": { bg: "#fff0e8", color: "var(--orange)" },
  "Dinner": { bg: "#f0ebff", color: "var(--purple)" },
  "Snack": { bg: "#fff8e1", color: "#b8854c" },
  "High Protein": { bg: "#fff0e8", color: "var(--orange)" },
  "Vegetarian": { bg: "var(--green-light)", color: "var(--green-dark)" },
  "Vegan": { bg: "#e8f5e9", color: "#2e7d32" },
  "Keto": { bg: "#e1f5fe", color: "#0277bd" },
};

const DIFF_COLORS: Record<string, string> = { "Easy": "var(--green)", "Medium": "var(--orange)", "Hard": "#e53935" };

export default function Recipes({ showToast, defaultFilter }: { showToast: (msg: string) => void; defaultFilter?: string }) {
  const [activeFilter, setActiveFilter] = useState(defaultFilter || "All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState("Today");
  const [favs, setFavs] = useState<number[]>([1, 5]);

  const filtered = RECIPES.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "Wishlist") {
      return favs.includes(r.id) && matchSearch;
    }
    const cat = CAT_MAP[activeFilter];
    const matchCat = cat === "all" || r.cat.includes(cat);
    return matchCat && matchSearch;
  });

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 19, fontWeight: 700 }}>📖 Healthy Recipes</h3>
        <button onClick={() => setModal(true)} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          + Add Recipe
        </button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid var(--border)", borderRadius: 30, padding: "8px 16px", marginBottom: 18, maxWidth: 340 }}>
        <span>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search recipes..." style={{ border: "none", background: "none", outline: "none", fontSize: 14, width: "100%" }} />
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {FILTER_TABS.map(t => (
          <button key={t} onClick={() => setActiveFilter(t)} style={{
            padding: "7px 18px", borderRadius: 20, fontSize: 13.5, fontWeight: 500,
            cursor: "pointer", border: "1.5px solid var(--border)",
            background: activeFilter === t ? "var(--green)" : "#fff",
            color: activeFilter === t ? "#fff" : "var(--text2)", transition: "all .2s"
          }}>{t}</button>
        ))}
      </div>

      <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>{filtered.length} recipes found</div>

      {/* Featured Recipe */}
      {activeFilter === "All" && search === "" && (
        <div style={{
          background: "linear-gradient(135deg, var(--green-dark), var(--green))",
          borderRadius: "var(--radius)", padding: 24, color: "#fff",
          display: "flex", gap: 24, alignItems: "center", marginBottom: 28,
          boxShadow: "0 10px 30px rgba(46,201,114,0.3)",
          flexWrap: "wrap",
        }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "var(--radius)", width: 140, height: 140, overflow: "hidden", flexShrink: 0 }}>
            <img src="https://loremflickr.com/400/400/avocado,toast?lock=100" alt="Avocado Toast" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>FEATURED RECIPE</div>
            <h2 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Avocado Toast with Poached Egg</h2>
            <p style={{ opacity: 0.9, fontSize: 14, marginBottom: 16 }}>A quick, protein-packed breakfast that's perfect for busy mornings. Rich in healthy fats and fiber.</p>
            <div style={{ display: "flex", gap: 16, fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> 10 mins</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Flame size={14} /> 320 kcal</span>
            </div>
            <button onClick={() => setSelectedRecipe("Avocado Toast with Poached Egg")} style={{ padding: "10px 24px", borderRadius: 30, border: "none", background: "#fff", color: "var(--green-dark)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Add to Meal Plan
            </button>
          </div>
        </div>
      )}

      {/* Recipe grid */}
      <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {filtered.map(r => (
          <div key={r.id} className="card-hover" style={{
            background: "var(--card)", borderRadius: "var(--radius-sm)", overflow: "hidden",
            border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", cursor: "pointer",
            position: "relative"
          }}>
            <div style={{
              height: 180, display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--green-light)", position: "relative", overflow: "hidden"
            }}>
              <img src={`https://loremflickr.com/400/300/food,meal?lock=${r.id}`} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={(e) => { e.stopPropagation(); setFavs(f => f.includes(r.id) ? f.filter(x => x !== r.id) : [...f, r.id]) }}
                style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
              >
                {favs.includes(r.id) ? "❤️" : "🤍"}
              </button>
              {r.time <= 15 && (
                 <div style={{ position: "absolute", top: 10, left: 10, background: "var(--orange)", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                   ⚡ Fast Prep
                 </div>
              )}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> {r.time} min</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Flame size={11} /> {r.cal} kcal</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={11} /> {r.servings}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Star size={12} fill="#FFD166" color="#FFD166" />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{r.rating}</span>
                <span style={{ fontSize: 11, marginLeft: 8, padding: "1px 8px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)", fontWeight: 600, color: DIFF_COLORS[r.difficulty] }}>{r.difficulty}</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", height: 22, overflow: "hidden" }}>
                {r.tags.map(tag => (
                  <span key={tag} style={{
                    display: "inline-block", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                    background: TAG_COLORS[tag]?.bg || "var(--green-light)",
                    color: TAG_COLORS[tag]?.color || "var(--green-dark)"
                  }}>{tag}</span>
                ))}
              </div>
              <button onClick={(e) => { e.stopPropagation(); setSelectedRecipe(r.name); }} style={{ marginTop: 12, width: "100%", padding: "8px", borderRadius: 8, border: "1.5px solid var(--green)", background: "none", color: "var(--green)", fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all .2s" }} onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = "var(--green)"; (e.target as HTMLButtonElement).style.color = "#fff"; }} onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "none"; (e.target as HTMLButtonElement).style.color = "var(--green)"; }}>
                Add to Meal Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title="📖 Add Recipe" onClose={() => setModal(false)}>
          <FormGroup label="Recipe Name"><Input placeholder="e.g. Mango Smoothie Bowl" /></FormGroup>
          <FormGroup label="Category"><Select><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></Select></FormGroup>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <FormGroup label="Calories"><Input type="number" /></FormGroup>
            <FormGroup label="Prep Time (min)"><Input type="number" defaultValue={15} /></FormGroup>
            <FormGroup label="Servings"><Input type="number" defaultValue={1} /></FormGroup>
          </div>
          <FormGroup label="Difficulty">
            <Select><option>Easy</option><option>Medium</option><option>Hard</option></Select>
          </FormGroup>
          <FormGroup label="Ingredients (one per line)">
            <textarea style={{ width: "100%", padding: 10, border: "1.5px solid var(--border)", borderRadius: 10, fontFamily: "inherit", height: 80, resize: "vertical", outline: "none" }} placeholder={"1 cup oats\n2 bananas\n1 tbsp honey"} />
          </FormGroup>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
            <button onClick={() => setModal(false)} style={{ padding: "10px 20px", borderRadius: 30, border: "1.5px solid var(--green)", background: "none", color: "var(--green)", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => { setModal(false); showToast("Recipe saved!"); }} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Save Recipe ✓</button>
          </div>
        </Modal>
      )}

      {selectedRecipe && (
        <Modal title="Add to Meal Plan" onClose={() => setSelectedRecipe(null)}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
              Which meal are you having <br/>
              <span style={{ color: "var(--green)", fontWeight: 700 }}>{selectedRecipe}</span> for?
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)" }}>Select a day and meal type to add it to your plan.</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              {["Today", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: "1.5px solid var(--border)",
                    background: selectedDay === day ? "var(--green)" : "var(--bg)",
                    color: selectedDay === day ? "#fff" : "var(--text2)",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 12,
                    transition: "all 0.2s"
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Breakfast", emoji: "🍳", bg: "var(--green-light)", color: "var(--green-dark)" },
              { label: "Lunch", emoji: "🥗", bg: "#fff0e8", color: "var(--orange)" },
              { label: "Dinner", emoji: "🍽️", bg: "#f0ebff", color: "var(--purple)" },
              { label: "Snack", emoji: "🍎", bg: "#fff8e1", color: "#b8854c" },
            ].map(m => (
              <button
                key={m.label}
                onClick={() => {
                  showToast(`${selectedRecipe} added to your ${m.label} plan for ${selectedDay}!`);
                  setSelectedRecipe(null);
                  setSelectedDay("Today"); // reset for next time
                }}
                className="card-hover"
                style={{
                  padding: "16px",
                  borderRadius: 16,
                  border: "1.5px solid var(--border)",
                  background: m.bg,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontSize: 24 }}>{m.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: m.color }}>{m.label}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setSelectedRecipe(null)} style={{ marginTop: 16, width: "100%", padding: "12px", borderRadius: 30, border: "1.5px solid var(--border)", background: "#fff", color: "var(--text2)", fontWeight: 600, cursor: "pointer" }}>
            Cancel
          </button>
        </Modal>
      )}
    </div>
  );
}
