"use client";
import { useState } from "react";
import { SHOPPING_ITEMS } from "../data/data";
import Modal, { FormGroup, Input, Select } from "./Modal";

export default function Shopping({ showToast }: { showToast: (msg: string) => void }) {
  const [items, setItems] = useState(SHOPPING_ITEMS);
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const toggle = (id: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    showToast("Item removed");
  };

  const allDone = items.length > 0 && items.every(i => i.done);
  const toggleSelectAll = () => {
    setItems(prev => prev.map(i => ({ ...i, done: !allDone })));
    showToast(allDone ? "All items deselected" : "All items selected! 🎉");
  };

  const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];
  
  // Apply category and search filters
  let filtered = items.filter(i => {
    const matchCat = filter === "All" || i.category === filter;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Sort: Unchecked first, Checked last
  filtered = filtered.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
  
  const doneCount = items.filter(i => i.done).length;

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 19, fontWeight: 700 }}>🛒 Shopping List</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={toggleSelectAll}
            style={{
              padding: "10px 16px", borderRadius: 30, fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: `1.5px solid ${allDone ? "var(--green)" : "var(--border)"}`,
              background: allDone ? "var(--green-light)" : "#fff",
              color: allDone ? "var(--green-dark)" : "var(--text2)",
              transition: "all .2s", display: "flex", alignItems: "center", gap: 6
            }}
          >
            {allDone ? "✓ Deselect All" : "☐ Select All"}
          </button>
          <button onClick={() => setItems(prev => prev.map(i => ({ ...i, done: false })))} style={{ padding: "10px 16px", borderRadius: 30, border: "1.5px solid var(--border)", background: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .2s" }} className="hover-bg-gray">Clear All</button>
          <button onClick={() => setModal(true)} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>+ Add Item</button>
        </div>
      </div>

      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 20 }}>
        {/* Progress */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius-sm)", padding: "16px 20px", border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Shopping Progress</span>
            <span style={{ color: "var(--text2)", fontSize: 13 }}>{doneCount} / {items.length}</span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className="progress-fill" style={{ width: items.length === 0 ? "0%" : `${(doneCount / items.length) * 100}%`, background: "var(--green)" }} />
          </div>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0 16px" }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search shopping list..." 
            style={{ border: "none", background: "none", outline: "none", fontSize: 14, width: "100%", padding: "16px 0" }} 
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ border: "none", background: "var(--bg)", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", color: "var(--text2)", fontSize: 12, fontWeight: "bold" }}>✕</button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
            cursor: "pointer", border: "1.5px solid var(--border)",
            background: filter === c ? "var(--green)" : "#fff",
            color: filter === c ? "#fff" : "var(--text2)", transition: "all .2s"
          }}>{c}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)", minHeight: 200 }}>
        {filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 150, color: "var(--text2)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🤷‍♂️</div>
            <div style={{ fontWeight: 600 }}>No items found</div>
            <div style={{ fontSize: 13 }}>Try adjusting your search or filters.</div>
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 12px",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                transition: "all .2s", opacity: item.done ? 0.65 : 1,
                cursor: "pointer", borderRadius: 10, marginLeft: -12, marginRight: -12,
                background: item.done ? "var(--green-light)" : "transparent"
              }}
              onMouseEnter={e => { if (!item.done) e.currentTarget.style.background = "var(--bg)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = item.done ? "var(--green-light)" : "transparent"; }}
            >
              <div
                style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `2px solid ${item.done ? "var(--green)" : "var(--border)"}`,
                  background: item.done ? "var(--green)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0,
                  transition: "all .2s"
                }}
              >
                {item.done ? "✓" : ""}
              </div>
              <span style={{ flex: 1, fontSize: 14.5, fontWeight: item.done ? 400 : 500, textDecoration: item.done ? "line-through" : "none", color: item.done ? "var(--text2)" : "var(--text)", userSelect: "none" }}>
                {item.name}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)", marginRight: 8 }}>{item.qty}</span>
              <span style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                background: `${item.cat_color}18`, color: item.cat_color
              }}>{item.category}</span>
              <button
                onClick={e => { e.stopPropagation(); deleteItem(item.id); }}
                style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", padding: "4px 8px", fontSize: 18, marginLeft: 8, borderRadius: 6, transition: "all .2s" }}
                title="Remove item"
                onMouseEnter={e => { e.currentTarget.style.color = "#e53e3e"; e.currentTarget.style.background = "#fff0f0"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.background = "none"; }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {modal && (
        <Modal title="🛒 Add Shopping Item" onClose={() => setModal(false)}>
          <FormGroup label="Item Name"><Input placeholder="e.g. Greek Yogurt" /></FormGroup>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormGroup label="Quantity"><Input placeholder="e.g. 500g or 2 pcs" /></FormGroup>
            <FormGroup label="Category">
              <Select><option>Vegetables</option><option>Fruits</option><option>Protein</option><option>Grains</option><option>Dairy</option><option>Other</option></Select>
            </FormGroup>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
            <button onClick={() => setModal(false)} style={{ padding: "10px 20px", borderRadius: 30, border: "1.5px solid var(--green)", background: "none", color: "var(--green)", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => { setModal(false); showToast("Item added to list!"); }} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Add Item ✓</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
