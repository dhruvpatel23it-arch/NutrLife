"use client";
import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UserType } from "../page";

export default function Profile({ showToast, user, onLogout }: { showToast: (msg: string) => void; user?: UserType; onLogout?: () => void }) {
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  
  const [prefs, setPrefs] = useState({ glutenFree: true, vegetarian: false, vegan: false, dairyFree: false, lowCarb: true, keto: false, highProtein: false, mediterranean: false });
  const [notifs, setNotifs] = useState({ meals: true, water: true, weekly: false, streaks: true, weight: false, tips: true });
  const [activityLevel, setActivityLevel] = useState("Moderately active (3-5 days/week)");

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 19, fontWeight: 700 }}>⚙️ My Profile & Settings</h3>
        {onLogout && (
          clerkUser ? (
            <button 
              onClick={() => signOut()}
              style={{ padding: "8px 16px", borderRadius: 30, border: "1.5px solid var(--orange)", background: "#fff", color: "var(--orange)", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .2s" }}
              className="hover-bg-gray"
            >
              Sign Out
            </button>
          ) : (
            <button 
              onClick={() => router.push('/sign-in')}
              style={{ padding: "8px 16px", borderRadius: 30, border: "1.5px solid var(--green)", background: "var(--green)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .2s" }}
              className="hover-bg-gray"
            >
              Sign In to Save Data
            </button>
          )
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {/* Personal Info */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>👤 Personal Info</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, var(--green), var(--green-dark))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 28 }}>
              {user?.initials || "A"}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name || "Aarav Shah"}</div>
              <div style={{ color: "var(--text2)", fontSize: 13 }}>Pro Member · Joined Jan 2026</div>
              <div style={{ background: "var(--green-light)", color: "var(--green-dark)", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, display: "inline-block", marginTop: 4 }}>PRO</div>
            </div>
          </div>
          {[
            { label: "Full Name", type: "text", defaultValue: user?.name || "Aarav Shah" },
            { label: "Email", type: "email", defaultValue: user?.email || "aarav@example.com" },
            { label: "Phone", type: "tel", defaultValue: "+91 98765 43210" },
            { label: "Date of Birth", type: "date", defaultValue: "1995-03-14" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>{f.label}</label>
              <input defaultValue={f.defaultValue} type={f.type} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Gender</label>
            <select style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" }}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <button onClick={() => showToast("Profile saved!")} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
        </div>

        {/* Health Goals */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🎯 Health Goals</div>
          {[
            { label: "Current Weight (kg)", type: "number", defaultValue: "72.4" },
            { label: "Goal Weight (kg)", type: "number", defaultValue: "68" },
            { label: "Height (cm)", type: "number", defaultValue: "172" },
            { label: "Daily Calorie Goal (kcal)", type: "number", defaultValue: "2000" },
            { label: "Daily Steps Goal", type: "number", defaultValue: "10000" },
            { label: "Daily Water Goal (L)", type: "number", defaultValue: "2" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>{f.label}</label>
              <input defaultValue={f.defaultValue} type={f.type} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Activity Level</label>
            <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" }}>
              <option value="Sedentary (little exercise)">Sedentary (little exercise)</option>
              <option value="Lightly active (1-3 days/week)">Lightly active (1-3 days/week)</option>
              <option value="Moderately active (3-5 days/week)">Moderately active (3-5 days/week)</option>
              <option value="Very active (6-7 days/week)">Very active (6-7 days/week)</option>
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text2)" }}>Primary Goal</label>
            <select style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" }}>
              <option>Lose Weight</option>
              <option>Maintain Weight</option>
              <option>Gain Muscle</option>
              <option>Improve Nutrition</option>
            </select>
          </div>
          <button onClick={() => showToast("Goals updated!")} style={{ padding: "10px 20px", borderRadius: 30, border: "none", background: "var(--green)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Update Goals</button>
        </div>

        {/* Notifications */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🔔 Notifications</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { key: "meals", label: "Meal reminders (breakfast, lunch, dinner)" },
              { key: "water", label: "Water intake reminders every 2 hours" },
              { key: "weekly", label: "Weekly progress reports" },
              { key: "streaks", label: "Streak & achievement alerts" },
              { key: "weight", label: "Weight logging reminders" },
              { key: "tips", label: "Daily health tips" },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={notifs[key as keyof typeof notifs]}
                  onChange={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof notifs] }))}
                  style={{ width: 18, height: 18, accentColor: "var(--green)" }}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius)", padding: 24, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🍽️ Dietary Preferences</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { key: "glutenFree", label: "Gluten Free" },
              { key: "vegetarian", label: "Vegetarian" },
              { key: "vegan", label: "Vegan" },
              { key: "dairyFree", label: "Dairy Free" },
              { key: "lowCarb", label: "Low Carb" },
              { key: "keto", label: "Keto" },
              { key: "highProtein", label: "High Protein" },
              { key: "mediterranean", label: "Mediterranean" },
            ].map(({ key, label }) => (
              <label
                key={key}
                onClick={() => setPrefs(p => ({ ...p, [key]: !p[key as keyof typeof prefs] }))}
                style={{
                  display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                  padding: "8px 14px", borderRadius: 20,
                  border: `1.5px solid ${prefs[key as keyof typeof prefs] ? "var(--green)" : "var(--border)"}`,
                  background: prefs[key as keyof typeof prefs] ? "var(--green-light)" : "#fff",
                  fontSize: 13, fontWeight: 500, transition: "all .2s"
                }}
              >
                <input type="checkbox" checked={prefs[key as keyof typeof prefs]} readOnly style={{ accentColor: "var(--green)" }} />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
