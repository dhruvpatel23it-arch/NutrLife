"use client";
import { useState, useRef } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  User, Lock, Moon, Bell, Globe, Heart, Shield,
  Camera, Check, Eye, EyeOff, ChevronRight, LogOut, Trash2, Sun,
} from "lucide-react";
import { UserType } from "../page";
import { useTranslation } from "../../lib/i18n/LanguageContext";

// ─── Section nav config ───────────────────────────────────────────────────────

const SECTIONS = [
  { id: "profile",       icon: User,   label: "Profile",       emoji: "👤" },
  { id: "security",      icon: Lock,   label: "Security",      emoji: "🔒" },
  { id: "health",        icon: Heart,  label: "Health Info",   emoji: "💪" },
  { id: "appearance",    icon: Moon,   label: "Dark Mode",     emoji: "🌙" },
  { id: "notifications", icon: Bell,   label: "Notifications", emoji: "🔔" },
  { id: "language",      icon: Globe,  label: "Language",      emoji: "🌐" },
  { id: "privacy",       icon: Shield, label: "Privacy",       emoji: "🛡️" },
];

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ value, onChange, color = "#2EC972" }: { value: boolean; onChange: () => void; color?: string }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 46, height: 26, borderRadius: 13, cursor: "pointer",
        background: value ? color : "#e2e8f0",
        position: "relative", transition: "background .3s",
        flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute",
        top: 3, left: value ? 23 : 3,
        width: 20, height: 20, borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transition: "left .3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }} />
    </div>
  );
}

// ─── Section Card wrapper ─────────────────────────────────────────────────────

function SectionCard({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 28,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
    }}>
      <div style={{
        fontFamily: "'Clash Display',sans-serif", fontSize: 19, fontWeight: 700,
        color: "var(--text)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>{emoji}</span> {title}
      </div>
      {children}
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────

function Field({
  label, type = "text", value, onChange, placeholder, disabled, hint,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean; hint?: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7, color: "var(--text)" }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        style={{
          width: "100%", padding: "13px 16px", borderRadius: 12,
          border: "1.5px solid var(--border)", fontSize: 15, outline: "none",
          background: disabled ? "var(--bg)" : "#fff",
          color: disabled ? "var(--text2)" : "var(--text)",
          boxSizing: "border-box", transition: "border-color .2s, box-shadow .2s",
          cursor: disabled ? "not-allowed" : "text",
          fontFamily: "inherit",
        }}
        onFocus={e => { if (!disabled) { e.target.style.borderColor = "var(--green)"; e.target.style.boxShadow = "0 0 0 4px rgba(46,201,114,0.1)"; }}}
        onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
      />
      {hint && <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7, color: "var(--text)" }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", padding: "13px 16px", borderRadius: 12,
        border: "1.5px solid var(--border)", fontSize: 15, outline: "none",
        background: "#fff", color: "var(--text)", boxSizing: "border-box", fontFamily: "inherit",
        appearance: "none", cursor: "pointer",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function SaveBtn({ onClick, label = "Save Changes" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} style={{
      padding: "13px 28px", borderRadius: 12, border: "none",
      background: "linear-gradient(135deg, var(--green), var(--green-dark))",
      color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
      boxShadow: "0 6px 16px rgba(46,201,114,0.3)", transition: "all .2s",
      display: "inline-flex", alignItems: "center", gap: 8,
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <Check size={16} /> {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Settings({ showToast, user }: { showToast: (msg: string) => void; user?: UserType }) {
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  
  const { language, setLanguage, t } = useTranslation();

  const [activeSection, setActiveSection] = useState("profile");

  // Profile state
  const [name, setName] = useState(user?.name ?? clerkUser?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? clerkUser?.primaryEmailAddress?.emailAddress ?? "");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [bio, setBio] = useState("Fitness enthusiast · Healthy eating advocate");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Security state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Health state
  const [weight, setWeight] = useState("72.4");
  const [height, setHeight] = useState("172");
  const [age, setAge] = useState("28");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [goalWeight, setGoalWeight] = useState("68");
  const [primaryGoal, setPrimaryGoal] = useState("lose_weight");
  const [calorieGoal, setCalorieGoal] = useState("2000");
  const [waterGoal, setWaterGoal] = useState("3");

  // Appearance
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") return document.body.classList.contains("dark-mode");
    return false;
  });
  
  const toggleDarkMode = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    if (newVal) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("nutrilife_dark", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("nutrilife_dark", "false");
    }
    showToast(newVal ? "Dark mode on 🌙" : "Light mode on");
  };

  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [colorTheme, setColorTheme] = useState("green");

  // Notifications
  const [notifs, setNotifs] = useState({
    meals: true, water: true, weekly: true, streaks: true,
    weight: false, tips: true, workout: true, sleep: false,
  });
  const [notifTime, setNotifTime] = useState("08:00");
  const [emailNotifs, setEmailNotifs] = useState(true);

  // Language
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [units, setUnits] = useState("metric");
  const [currency, setCurrency] = useState("INR");

  // Privacy
  const [publicProfile, setPublicProfile] = useState(true);
  const [shareActivity, setShareActivity] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  // Derived BMI
  const bmi = weight && height
    ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)
    : "—";
  const bmiCategory =
    parseFloat(bmi) < 18.5 ? { label: "Underweight", color: "#06B6D4" } :
    parseFloat(bmi) < 25    ? { label: "Normal",      color: "#2EC972" } :
    parseFloat(bmi) < 30    ? { label: "Overweight",  color: "#F59E0B" } :
                               { label: "Obese",       color: "#EF4444" };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("Image must be < 5 MB"); return; }
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    showToast("Profile photo updated!");
  };

  const handleChangePassword = () => {
    if (!currentPw || !newPw || !confirmPw) { showToast("Please fill all password fields."); return; }
    if (newPw !== confirmPw) { showToast("New passwords don't match!"); return; }
    if (newPw.length < 8) { showToast("Password must be at least 8 characters."); return; }
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    showToast("✅ Password changed successfully!");
  };

  const handleDeleteAccount = () => {
    showToast("⚠️ Account deletion requires email confirmation. Check your inbox.");
  };

  const THEMES = [
    { id: "green",  color: "#2EC972", label: "NutriGreen" },
    { id: "blue",   color: "#3B82F6", label: "Ocean Blue" },
    { id: "purple", color: "#8B5CF6", label: "Royal Purple" },
    { id: "orange", color: "#F97316", label: "Sunset Orange" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }}>

      {/* ── Left Nav ── */}
      <div style={{ position: "sticky", top: 80 }}>
        {/* User preview card */}
        <div style={{
          background: "linear-gradient(135deg, #1a4d2e, #2d7a47)",
          borderRadius: 20, padding: "22px 18px", marginBottom: 16,
          color: "#fff", textAlign: "center",
          boxShadow: "0 8px 24px rgba(46,201,114,0.25)",
        }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: avatarPreview ? "transparent" : "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 700, overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.4)",
            }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : (user?.initials ?? "U")
              }
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{name || user?.name || "Your Name"}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2, wordBreak: "break-all" }}>
            {email || user?.email}
          </div>
        </div>

        {/* Section links */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
        }}>
          {SECTIONS.map(sec => (
            <div
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 14px", borderRadius: 12, cursor: "pointer",
                transition: "all .2s",
                background: activeSection === sec.id ? "var(--green-light)" : "transparent",
                color: activeSection === sec.id ? "var(--green-dark)" : "var(--text2)",
                fontWeight: activeSection === sec.id ? 700 : 500,
                fontSize: 14, marginBottom: 2,
              }}
              onMouseEnter={e => { if (activeSection !== sec.id) e.currentTarget.style.background = "var(--bg)"; }}
              onMouseLeave={e => { if (activeSection !== sec.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16 }}>{sec.emoji}</span>
              <span style={{ flex: 1 }}>{t(`settings.${sec.id === 'health' ? 'healthInfo' : sec.id === 'appearance' ? 'darkMode' : sec.id}`)}</span>
              {activeSection === sec.id && <ChevronRight size={14} />}
            </div>
          ))}

          <div style={{ margin: "8px 0", height: 1, background: "var(--border)" }} />

          {/* Sign out */}
          <div
            onClick={() => signOut().then(() => router.replace("/sign-in"))}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px", borderRadius: 12, cursor: "pointer",
              color: "#EF4444", fontSize: 14, fontWeight: 600, transition: "all .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={16} /> {t("settings.signOut")}
          </div>
        </div>
      </div>

      {/* ── Right Content ── */}
      <div>

        {/* ════ PROFILE ════ */}
        {activeSection === "profile" && (
          <SectionCard title="Profile Settings" emoji="👤">
            {/* Avatar upload */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--green), var(--green-dark))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, fontWeight: 700, color: "#fff", overflow: "hidden",
                  border: "3px solid var(--green-light)",
                }}>
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : (user?.initials ?? "U")
                  }
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: 28, height: 28, borderRadius: "50%",
                    background: "var(--green)", border: "2px solid #fff",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  }}
                >
                  <Camera size={13} color="#fff" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Profile Photo</div>
                <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>JPG, PNG or GIF · Max 5 MB</div>
                <button onClick={() => fileRef.current?.click()} style={{
                  marginTop: 8, padding: "7px 16px", borderRadius: 8, border: "1.5px solid var(--green)",
                  background: "var(--green-light)", color: "var(--green-dark)", fontWeight: 600,
                  fontSize: 13, cursor: "pointer",
                }}>
                  Upload Photo
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
              <Field label="Email Address" type="email" value={email} onChange={setEmail}
                disabled={!!clerkUser} hint={clerkUser ? "Managed by Clerk — change via account settings" : undefined} />
              <Field label="Phone Number" type="tel" value={phone} onChange={setPhone} />
              <Field label="Bio" value={bio} onChange={setBio} placeholder="Short bio..." />
            </div>

            <SaveBtn onClick={() => showToast("✅ Profile saved successfully!")} />
          </SectionCard>
        )}

        {/* ════ SECURITY ════ */}
        {activeSection === "security" && (
          <SectionCard title="Security" emoji="🔒">
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "var(--text)" }}>Change Password</div>

              {clerkUser && (
                <div style={{
                  background: "#FFFBEB", border: "1.5px solid #F59E0B33", borderRadius: 12,
                  padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#92400E",
                }}>
                  ℹ️ Your account is managed by Clerk. Use the Clerk dashboard or your provider to change your password.
                </div>
              )}

              <Field label="Current Password" type={showPw ? "text" : "password"} value={currentPw} onChange={setCurrentPw} placeholder="••••••••" />
              <div style={{ position: "relative" }}>
                <Field label="New Password" type={showPw ? "text" : "password"} value={newPw} onChange={setNewPw}
                  placeholder="Min. 8 characters" hint="Use uppercase, numbers and symbols for a strong password." />
                <button
                  onClick={() => setShowPw(s => !s)}
                  style={{ position: "absolute", right: 14, top: 40, background: "none", border: "none", cursor: "pointer", color: "var(--text2)" }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Field label="Confirm New Password" type={showPw ? "text" : "password"} value={confirmPw} onChange={setConfirmPw} placeholder="••••••••" />

              {/* Password strength */}
              {newPw && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>
                    Password strength: <span style={{ color: newPw.length >= 12 ? "#2EC972" : newPw.length >= 8 ? "#F59E0B" : "#EF4444" }}>
                      {newPw.length >= 12 ? "Strong" : newPw.length >= 8 ? "Medium" : "Weak"}
                    </span>
                  </div>
                  <div style={{ height: 5, background: "var(--bg)", borderRadius: 3 }}>
                    <div style={{
                      height: "100%", borderRadius: 3, transition: "width .4s",
                      width: newPw.length >= 12 ? "100%" : newPw.length >= 8 ? "60%" : "25%",
                      background: newPw.length >= 12 ? "#2EC972" : newPw.length >= 8 ? "#F59E0B" : "#EF4444",
                    }} />
                  </div>
                </div>
              )}

              <SaveBtn onClick={handleChangePassword} label="Change Password" />
            </div>

            <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />

            {/* 2FA */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>Two-Factor Authentication</div>
                <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>Add an extra layer of security to your account</div>
              </div>
              <Toggle value={twoFactor} onChange={() => { setTwoFactor(t => !t); showToast(twoFactor ? "2FA disabled" : "2FA enabled!"); }} color="#6366F1" />
            </div>

            <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />

            {/* Delete account */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#EF4444", marginBottom: 6 }}>Danger Zone</div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </div>
              <button onClick={handleDeleteAccount} style={{
                padding: "11px 20px", borderRadius: 12, border: "1.5px solid #EF4444",
                background: "#FEF2F2", color: "#EF4444", fontWeight: 700, fontSize: 14,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                transition: "all .2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#FEE2E2"}
                onMouseLeave={e => e.currentTarget.style.background = "#FEF2F2"}
              >
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </SectionCard>
        )}

        {/* ════ HEALTH ════ */}
        {activeSection === "health" && (
          <SectionCard title="Health Info" emoji="💪">
            {/* BMI card */}
            <div style={{
              background: "linear-gradient(135deg, #1a4d2e, #2d7a47)",
              borderRadius: 16, padding: "16px 20px", marginBottom: 24,
              display: "flex", alignItems: "center", gap: 24, color: "#fff",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>{bmi}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>BMI</div>
              </div>
              <div style={{ width: 1, height: 48, background: "rgba(255,255,255,0.2)" }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: bmiCategory.color }}>{bmiCategory.label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                  Based on your current weight & height
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Current Weight (kg)" type="number" value={weight} onChange={setWeight} />
              <Field label="Goal Weight (kg)" type="number" value={goalWeight} onChange={setGoalWeight} />
              <Field label="Height (cm)" type="number" value={height} onChange={setHeight} />
              <Field label="Age" type="number" value={age} onChange={setAge} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <SelectField label="Gender" value={gender} onChange={setGender} options={[
                { value: "male",   label: "♂ Male" },
                { value: "female", label: "♀ Female" },
                { value: "other",  label: "⚧ Other / Prefer not to say" },
              ]} />
              <SelectField label="Activity Level" value={activityLevel} onChange={setActivityLevel} options={[
                { value: "sedentary",   label: "🛋 Sedentary (little exercise)" },
                { value: "light",       label: "🚶 Lightly active (1–3 days/wk)" },
                { value: "moderate",    label: "🏃 Moderately active (3–5 days/wk)" },
                { value: "very",        label: "⚡ Very active (6–7 days/wk)" },
                { value: "extra",       label: "🏆 Extra active (athlete/physical job)" },
              ]} />
              <SelectField label="Primary Goal" value={primaryGoal} onChange={setPrimaryGoal} options={[
                { value: "lose_weight",    label: "⬇️ Lose Weight" },
                { value: "maintain",       label: "⚖️ Maintain Weight" },
                { value: "gain_muscle",    label: "💪 Gain Muscle" },
                { value: "improve_health", label: "❤️ Improve Overall Health" },
              ]} />
              <Field label="Daily Calorie Goal (kcal)" type="number" value={calorieGoal} onChange={setCalorieGoal} />
              <Field label="Daily Water Goal (L)" type="number" value={waterGoal} onChange={setWaterGoal} />
            </div>

            <SaveBtn onClick={() => showToast("✅ Health info updated!")} />
          </SectionCard>
        )}

        {/* ════ APPEARANCE ════ */}
        {activeSection === "appearance" && (
          <SectionCard title="Appearance" emoji="🌙">
            {/* Dark mode big toggle */}
            <div style={{
              background: darkMode
                ? "linear-gradient(135deg, #0f172a, #1e293b)"
                : "linear-gradient(135deg, #f8fafc, #e2e8f0)",
              borderRadius: 16, padding: 24, marginBottom: 24,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transition: "all .4s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: darkMode ? "#1e293b" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}>
                  {darkMode ? <Moon size={22} color="#818cf8" /> : <Sun size={22} color="#F59E0B" />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: darkMode ? "#f1f5f9" : "var(--text)" }}>Dark Mode</div>
                  <div style={{ fontSize: 13, color: darkMode ? "#94a3b8" : "var(--text2)" }}>
                    {darkMode ? "Easy on the eyes at night" : "Light and clean interface"}
                  </div>
                </div>
              </div>
              <Toggle value={darkMode} onChange={toggleDarkMode} color="#6366F1" />
            </div>

            {/* Color theme */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: "var(--text)" }}>Accent Color</div>
              <div style={{ display: "flex", gap: 12 }}>
                {THEMES.map(t => (
                  <div key={t.id} onClick={() => { setColorTheme(t.id); showToast(`Theme: ${t.label}`); }} style={{ textAlign: "center", cursor: "pointer" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, background: t.color,
                      border: colorTheme === t.id ? `3px solid ${t.color}` : "3px solid transparent",
                      boxShadow: colorTheme === t.id ? `0 0 0 3px ${t.color}44` : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all .2s",
                    }}>
                      {colorTheme === t.id && <Check size={20} color="#fff" />}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 5 }}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other toggles */}
            {[
              { label: "Compact Mode", sub: "Reduce spacing for more content", val: compactMode, set: setCompactMode },
              { label: "Animations", sub: "Enable smooth transitions and effects", val: animations, set: setAnimations },
            ].map(({ label, sub, val, set }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 0", borderBottom: "1px solid var(--border)",
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{label}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>{sub}</div>
                </div>
                <Toggle value={val} onChange={() => set(v => !v)} />
              </div>
            ))}
          </SectionCard>
        )}

        {/* ════ NOTIFICATIONS ════ */}
        {activeSection === "notifications" && (
          <SectionCard title="Notifications" emoji="🔔">
            <div style={{ marginBottom: 20 }}>
              <Field label="Default Notification Time" type="time" value={notifTime} onChange={setNotifTime}
                hint="Daily reminders will be sent at this time" />
            </div>

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 0", borderBottom: "1px solid var(--border)", marginBottom: 8,
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>Email Notifications</div>
                <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>Receive weekly reports via email</div>
              </div>
              <Toggle value={emailNotifs} onChange={() => setEmailNotifs(v => !v)} />
            </div>

            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", margin: "18px 0 12px" }}>
              Push Notifications
            </div>

            {[
              { key: "meals",   label: "Meal Reminders",        sub: "Breakfast, lunch & dinner alerts",   emoji: "🍽️" },
              { key: "water",   label: "Water Reminders",       sub: "Hydration nudges every 2 hours",     emoji: "💧" },
              { key: "weekly",  label: "Weekly Reports",        sub: "Progress summary every Sunday",      emoji: "📊" },
              { key: "streaks", label: "Streak Alerts",         sub: "Don't break your streak!",           emoji: "🔥" },
              { key: "weight",  label: "Weight Log Reminders",  sub: "Daily morning weigh-in prompt",      emoji: "⚖️" },
              { key: "tips",    label: "Daily Health Tips",     sub: "Personalised tip every morning",     emoji: "💡" },
              { key: "workout", label: "Workout Reminders",     sub: "Time to move!",                      emoji: "🏋️" },
              { key: "sleep",   label: "Sleep Reminders",       sub: "Bedtime wind-down alert",            emoji: "🌙" },
            ].map(({ key, label, sub, emoji }) => (
              <div key={key} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "13px 0", borderBottom: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{label}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 1 }}>{sub}</div>
                </div>
                <Toggle value={notifs[key as keyof typeof notifs]}
                  onChange={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof notifs] }))} />
              </div>
            ))}

            <div style={{ marginTop: 20 }}>
              <SaveBtn onClick={() => showToast("✅ Notification preferences saved!")} />
            </div>
          </SectionCard>
        )}

        {/* ════ LANGUAGE ════ */}
        {activeSection === "language" && (
          <SectionCard title={t("settings.languageAndRegion")} emoji="🌐">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <SelectField label={t("settings.languageLabel")} value={language} onChange={setLanguage} options={[
                { value: "en",    label: "🇬🇧 English" },
                { value: "hi",    label: "🇮🇳 Hindi" },
                { value: "gu",    label: "🇮🇳 Gujarati" },
                { value: "mr",    label: "🇮🇳 Marathi" },
                { value: "ta",    label: "🇮🇳 Tamil" },
                { value: "te",    label: "🇮🇳 Telugu" },
                { value: "es",    label: "🇪🇸 Spanish" },
                { value: "fr",    label: "🇫🇷 French" },
                { value: "de",    label: "🇩🇪 German" },
              ]} />
              <SelectField label={t("settings.dateFormat")} value={dateFormat} onChange={setDateFormat} options={[
                { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
              ]} />
              <SelectField label={t("settings.unitsSystem")} value={units} onChange={setUnits} options={[
                { value: "metric",   label: "📏 Metric (kg, cm, km)" },
                { value: "imperial", label: "📐 Imperial (lbs, ft, miles)" },
              ]} />
              <SelectField label={t("settings.currency")} value={currency} onChange={setCurrency} options={[
                { value: "INR", label: "₹ Indian Rupee" },
                { value: "USD", label: "$ US Dollar" },
                { value: "EUR", label: "€ Euro" },
                { value: "GBP", label: "£ British Pound" },
              ]} />
            </div>
            <SaveBtn onClick={() => showToast(t("settings.savedMsg"))} />
          </SectionCard>
        )}

        {/* ════ PRIVACY ════ */}
        {activeSection === "privacy" && (
          <SectionCard title="Privacy & Data" emoji="🛡️">
            {[
              { label: "Public Profile",      sub: "Let other NutriLife users find your profile",    val: publicProfile,  set: setPublicProfile },
              { label: "Share Activity",       sub: "Show your workouts and meals in the community",  val: shareActivity,  set: setShareActivity },
              { label: "Usage Analytics",      sub: "Help us improve by sharing anonymous usage data",val: analytics,      set: setAnalytics },
            ].map(({ label, sub, val, set }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 0", borderBottom: "1px solid var(--border)",
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{label}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>{sub}</div>
                </div>
                <Toggle value={val} onChange={() => { set(v => !v); showToast(`${label} ${!val ? "enabled" : "disabled"}`); }} />
              </div>
            ))}

            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => showToast("📦 Your data export will be emailed to you.")} style={{
                padding: "11px 20px", borderRadius: 12, border: "1.5px solid var(--green)",
                background: "var(--green-light)", color: "var(--green-dark)", fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}>
                📦 Export My Data
              </button>
              <button onClick={() => showToast("🗑 Your data has been cleared from cache.")} style={{
                padding: "11px 20px", borderRadius: 12, border: "1.5px solid var(--border)",
                background: "#fff", color: "var(--text2)", fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}>
                🗑 Clear Cache
              </button>
            </div>

            <div style={{
              marginTop: 20, background: "#FFFBEB", border: "1.5px solid #F59E0B33",
              borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#92400E",
            }}>
              🔒 Your health data is encrypted and never sold to third parties. See our{" "}
              <span style={{ color: "#2EC972", fontWeight: 700, cursor: "pointer" }}>Privacy Policy</span> for details.
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
