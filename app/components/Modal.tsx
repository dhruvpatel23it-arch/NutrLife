"use client";
import { X } from "lucide-react";
import { ReactNode } from "react";

export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "var(--radius)", padding: 32,
          maxWidth: 500, width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,.2)",
          animation: "fadeInUp 0.25s ease"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 20, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>{label}</label>
      {children}
    </div>
  );
}

export function Input({ ...props }) {
  return (
    <input
      {...props}
      style={{
        width: "100%", padding: "11px 14px", borderRadius: 10,
        border: "1.5px solid var(--border)", fontSize: 14,
        fontFamily: "inherit", outline: "none",
        transition: "border-color .2s",
      }}
      onFocus={e => (e.target.style.borderColor = "var(--green)")}
      onBlur={e => (e.target.style.borderColor = "var(--border)")}
    />
  );
}

export function Select({ children, ...props }: { children: ReactNode; [key: string]: unknown }) {
  return (
    <select
      {...props}
      style={{
        width: "100%", padding: "11px 14px", borderRadius: 10,
        border: "1.5px solid var(--border)", fontSize: 14,
        fontFamily: "inherit", outline: "none", background: "#fff",
        cursor: "pointer"
      }}
    >
      {children}
    </select>
  );
}
