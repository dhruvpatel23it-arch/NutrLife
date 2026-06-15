"use client";
import { useState } from "react";
import {
  HelpCircle, MessageCircle, Mail, Bug, Book,
  ChevronDown, ChevronUp, Send, CheckCircle2,
  Phone, ArrowRight, ExternalLink
} from "lucide-react";

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    question: "How do I create a meal plan?",
    answer: "Go to the 'Meal Plan' section from the sidebar. You can either auto-generate a plan based on your calorie goals or manually add recipes and foods to specific days and meals."
  },
  {
    question: "How do I track calories?",
    answer: "Navigate to the 'Meal Log' tab. Tap 'Add Meal', search for your food items, and enter the serving size. Your daily calorie intake will automatically update."
  },
  {
    question: "How do I reset my password?",
    answer: "If you're logged out, click 'Forgot Password' on the sign-in screen. If you're logged in, go to Settings > Security and follow the instructions to change your password."
  },
  {
    question: "How do I update my profile?",
    answer: "Click on 'Settings' in the sidebar, then navigate to the 'Profile' section. There you can change your photo, name, email, and update your health goals."
  },
  {
    question: "How do I connect my smart watch?",
    answer: "Currently, we support manual entry for workouts and steps. Direct integration with Apple Health and Google Fit is coming in our next major update!"
  }
];

// ─── Support Card Component ───────────────────────────────────────────────────

function SupportCard({ icon, title, desc, action, onClick, color }: {
  icon: React.ReactNode; title: string; desc: string; action: string; onClick: () => void; color: string;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 24,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid var(--border)",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, background: color + "15",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
      }}>
        {icon}
      </div>
      <div style={{ fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 14, color: "var(--text2)", marginBottom: 20, flex: 1, lineHeight: 1.5 }}>{desc}</div>
      <button onClick={onClick} style={{
        width: "100%", padding: "12px", borderRadius: 12, border: "none",
        background: color, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all .2s",
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        {action}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HelpSupport({ showToast }: { showToast: (msg: string) => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeForm, setActiveForm] = useState<"none" | "contact" | "bug" | "chat">("none");
  const [formMsg, setFormMsg] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [chatMessages, setChatMessages] = useState<{sender: "user" | "bot", text: string}[]>([
    { sender: "bot", text: "Hi! I am the NutriLife support bot. Ask me any questions!" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMsg.trim()) {
      showToast("Please enter a message before submitting.");
      return;
    }

    // Get subject from form
    const subjectSelect = (e.target as any).querySelector('select');
    const subject = subjectSelect ? subjectSelect.value : "Support Request";

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeForm,
          subject: subject,
          message: formMsg
        })
      });
    } catch (err) {
      console.error(err);
    }

    setFormSubmitted(true);
    showToast("✅ Successfully submitted! We'll get back to you shortly.");
    setTimeout(() => {
      setFormSubmitted(false);
      setFormMsg("");
      setActiveForm("none");
    }, 3000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    
    setTimeout(() => {
      let botResponse = "I'm sorry, I don't have an answer for that. Please try contacting support through Email.";
      const lowerMsg = userMsg.toLowerCase();
      
      const matchedFaq = FAQS.find(faq => {
        const keywords = faq.question.toLowerCase().split(' ').filter(w => w.length > 3 && w !== 'how' && w !== 'what');
        return keywords.some(kw => lowerMsg.includes(kw));
      });
      
      if (matchedFaq) {
        botResponse = matchedFaq.answer;
      } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
        botResponse = "Hello there! How can I assist you with NutriLife today?";
      }
      
      setChatMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
    }, 600);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 16,
          background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 20px rgba(59,130,246,0.3)",
        }}>
          <HelpCircle size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)", margin: 0 }}>
            Help & Support
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 14, margin: 0 }}>
            How can we help you today?
          </p>
        </div>
      </div>

      {/* ── Top Support Options Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
        <SupportCard
          icon={<MessageCircle size={24} color="#2EC972" />}
          color="#2EC972"
          title="Live Chat"
          desc="Chat directly with our support team for quick answers."
          action="Start Chat"
          onClick={() => setActiveForm("chat")}
        />
        <SupportCard
          icon={<Mail size={24} color="#3B82F6" />}
          color="#3B82F6"
          title="Email Support"
          desc="Send us a detailed message and we'll reply within 24 hours."
          action="Contact Us"
          onClick={() => setActiveForm("contact")}
        />
        <SupportCard
          icon={<Bug size={24} color="#EF4444" />}
          color="#EF4444"
          title="Report a Problem"
          desc="Found a bug or glitch? Let us know so we can fix it."
          action="Report Bug"
          onClick={() => setActiveForm("bug")}
        />
        <SupportCard
          icon={<Book size={24} color="#F59E0B" />}
          color="#F59E0B"
          title="User Guide"
          desc="Browse our comprehensive documentation and tutorials."
          action="Read Guide"
          onClick={() => showToast("📖 Opening user guide...")}
        />
      </div>

      {/* ── Sliding Form Overlay ── */}
      {activeForm !== "none" && (
        <div style={{
          background: "#fff", borderRadius: 20, padding: 32, marginBottom: 40,
          boxShadow: "0 12px 32px rgba(0,0,0,0.1)", border: "1.5px solid var(--border)",
          animation: "fadeInUp 0.4s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
              {activeForm === "contact" ? <><Mail color="#3B82F6" /> Contact Support</> : 
               activeForm === "bug" ? <><Bug color="#EF4444" /> Report a Problem</> : 
               <><MessageCircle color="#2EC972" /> Live Chat</>}
            </div>
            <button onClick={() => setActiveForm("none")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)" }}>✕ Cancel</button>
          </div>

          {activeForm === "chat" ? (
            <div style={{ display: "flex", flexDirection: "column", height: 400 }}>
              <div style={{ flex: 1, overflowY: "auto", padding: "10px", background: "#f9fafb", borderRadius: 12, marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ 
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    background: msg.sender === "user" ? "#2EC972" : "#fff",
                    color: msg.sender === "user" ? "#fff" : "var(--text)",
                    padding: "10px 14px", borderRadius: 16, maxWidth: "80%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: msg.sender === "bot" ? "1px solid var(--border)" : "none",
                    fontSize: 14, lineHeight: 1.5
                  }}>
                    {msg.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} style={{ display: "flex", gap: 10 }}>
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  style={{
                    flex: 1, padding: "12px 16px", borderRadius: 12, border: "1.5px solid var(--border)",
                    fontSize: 15, outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = "#2EC972"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <button type="submit" style={{
                  padding: "0 20px", borderRadius: 12, border: "none",
                  background: "#2EC972", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          ) : formSubmitted ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--green)" }}>
              <CheckCircle2 size={64} style={{ margin: "0 auto 16px" }} />
              <div style={{ fontSize: 24, fontWeight: 700 }}>Message Sent!</div>
              <div style={{ color: "var(--text2)", marginTop: 8 }}>Thank you for reaching out. We will get back to you soon.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Subject</label>
                <select style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid var(--border)",
                  fontSize: 15, background: "#fff", outline: "none"
                }}>
                  {activeForm === "contact" ? (
                    <>
                      <option>Account Assistance</option>
                      <option>Billing & Subscriptions</option>
                      <option>Nutrition Coaching</option>
                      <option>Other Inquiry</option>
                    </>
                  ) : (
                    <>
                      <option>App Crash / Freezing</option>
                      <option>Data Not Syncing</option>
                      <option>UI/Display Issue</option>
                      <option>Feature Request</option>
                    </>
                  )}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Message Details</label>
                <textarea
                  value={formMsg}
                  onChange={e => setFormMsg(e.target.value)}
                  placeholder={activeForm === "bug" ? "Please describe what happened, and what you were doing when the issue occurred..." : "How can we help you?"}
                  rows={5}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid var(--border)",
                    fontSize: 15, fontFamily: "inherit", resize: "vertical", outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = activeForm === "contact" ? "#3B82F6" : "#EF4444"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>
              <button type="submit" style={{
                padding: "14px 28px", borderRadius: 12, border: "none",
                background: activeForm === "contact" ? "#3B82F6" : "#EF4444", color: "#fff",
                fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
              }}>
                <Send size={18} /> Send Message
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── FAQ Section ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HelpCircle size={18} color="var(--text)" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", margin: 0 }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 16, overflow: "hidden",
              border: `1.5px solid ${openFaq === i ? "var(--green)" : "var(--border)"}`,
              transition: "all .2s",
            }}>
              <div
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", background: openFaq === i ? "var(--green-light)" : "transparent",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 15, color: openFaq === i ? "var(--green-dark)" : "var(--text)" }}>
                  {faq.question}
                </div>
                {openFaq === i ? <ChevronUp size={18} color="var(--green)" /> : <ChevronDown size={18} color="var(--text2)" />}
              </div>
              
              {openFaq === i && (
                <div style={{ padding: "0 24px 20px", color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>
                  <div style={{ marginTop: 12 }}>{faq.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer Info ── */}
      <div style={{
        marginTop: 40, padding: 24, borderRadius: 20, textAlign: "center",
        background: "linear-gradient(135deg, #1a4d2e, #2d7a47)", color: "#fff",
      }}>
        <Phone size={24} style={{ marginBottom: 12, opacity: 0.8 }} />
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Still need help?</div>
        <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>Our customer support team is available 24/7.</div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 1 }}>1-800-NUTRILIFE</div>
      </div>

    </div>
  );
}
