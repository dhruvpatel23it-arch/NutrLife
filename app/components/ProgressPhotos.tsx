"use client";
import { useState, useRef } from "react";
import { Upload, Trash2, Camera } from "lucide-react";

export default function ProgressPhotos({ showToast }: { showToast: (msg: string) => void }) {
  const [photos, setPhotos] = useState<{ id: number; date: string; url: string; label: string }[]>([
    { id: 1, date: "Jan 1, 2026", url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80", label: "Before" },
    { id: 2, date: "Apr 15, 2026", url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80", label: "After (3 Months)" },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newUrl = URL.createObjectURL(e.target.files[0]);
      setPhotos([...photos, { id: Date.now(), date: new Date().toLocaleDateString(), url: newUrl, label: "New Update" }]);
      showToast("Photo uploaded successfully!");
    }
  };

  const deletePhoto = (id: number) => {
    setPhotos(photos.filter(p => p.id !== id));
    showToast("Photo removed.");
  };

  return (
    <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 19, fontWeight: 700 }}>📷 Before & After Photos</h3>
          <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 4 }}>Visually track your transformation over time.</p>
        </div>
        <button onClick={() => fileInputRef.current?.click()} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Upload size={16} /> Upload Photo
        </button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleUpload} style={{ display: "none" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20 }}>
        {photos.map(p => (
          <div key={p.id} style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1.5px solid var(--border)" }}>
            <img src={p.url} alt={p.label} style={{ width: "100%", height: 300, objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", color: "#fff" }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{p.label}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>{p.date}</div>
            </div>
            <button onClick={() => deletePhoto(p.id)} style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--orange)" }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        
        {/* Upload placeholder */}
        <div onClick={() => fileInputRef.current?.click()} style={{ height: 300, borderRadius: 16, border: "2px dashed var(--border)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--bg)", color: "var(--text2)", transition: "all 0.2s" }} onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--green)")} onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
          <Camera size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div style={{ fontWeight: 600 }}>Add New Photo</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Click or drag & drop</div>
        </div>
      </div>
    </div>
  );
}
