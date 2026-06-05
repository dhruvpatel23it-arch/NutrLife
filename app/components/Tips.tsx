"use client";
import { TIPS } from "../data/data";

export default function Tips() {
  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 19, fontWeight: 700 }}>💡 Health Tips & Guidance</h3>
        <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 6 }}>Evidence-based tips to help you build sustainable healthy habits.</p>
      </div>
      <div>
        {TIPS.map((tip, i) => (
          <div
            key={i}
            style={{ background: "linear-gradient(135deg, var(--green-light), #fff)", borderRadius: "var(--radius-sm)", padding: 18, border: "1.5px solid var(--border)", display: "flex", gap: 14, marginBottom: 14, transition: "all .2s", cursor: "default" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "var(--shadow)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
          >
            <div style={{ fontSize: 28, flexShrink: 0 }}>{tip.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 13.5, color: "var(--text2)", lineHeight: 1.6 }}>{tip.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
