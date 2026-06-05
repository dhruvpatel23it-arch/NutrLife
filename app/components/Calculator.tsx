"use client";
import { useState } from "react";
import { Activity, Target, User, Scale, Ruler, Utensils, Dumbbell } from "lucide-react";

export default function Calculator() {
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("80");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("Male");
  const [activity, setActivity] = useState("1.55"); // Moderate
  const [goal, setGoal] = useState("Weight Loss");
  const [wantDietPlan, setWantDietPlan] = useState("Yes");
  
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);
    
    if (!h || !w || !a) return;

    // BMI
    const bmi = w / ((h / 100) * (h / 100));
    
    // BMR (Mifflin-St Jeor)
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr = gender === "Male" ? bmr + 5 : bmr - 161;
    
    // TDEE (Maintenance)
    const tdee = bmr * parseFloat(activity);
    
    // Target Calories
    let targetCals = tdee;
    if (goal === "Weight Loss") targetCals -= 500;
    if (goal === "Muscle Gain") targetCals += 500;
    
    // Macros
    let p = 0, c = 0, f = 0;
    if (goal === "Weight Loss") {
      p = (targetCals * 0.4) / 4;
      c = (targetCals * 0.3) / 4;
      f = (targetCals * 0.3) / 9;
    } else if (goal === "Muscle Gain") {
      p = (targetCals * 0.3) / 4;
      c = (targetCals * 0.5) / 4;
      f = (targetCals * 0.2) / 9;
    } else {
      p = (targetCals * 0.3) / 4;
      c = (targetCals * 0.4) / 4;
      f = (targetCals * 0.3) / 9;
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let dietPlan: { day: string; meals: string }[] = [];
    let workoutPlan = "";
    
    if (goal === "Weight Loss") {
      workoutPlan = "3-4 days of cardio + 2 days of strength training to preserve muscle mass.";
      dietPlan = days.map(d => ({
        day: d,
        meals: "Breakfast: Scrambled eggs & spinach. Lunch: Grilled chicken salad. Dinner: Baked salmon & veggies."
      }));
      // Add some variety
      dietPlan[1].meals = "Breakfast: Greek yogurt & berries. Lunch: Turkey lettuce wrap. Dinner: Zucchini noodles & meatballs.";
      dietPlan[3].meals = "Breakfast: Protein smoothie. Lunch: Tuna salad. Dinner: Chicken stir-fry.";
      dietPlan[5].meals = "Breakfast: Avocado toast. Lunch: Quinoa bowl. Dinner: Steak & asparagus.";
    } else if (goal === "Muscle Gain") {
      workoutPlan = "4-5 days of heavy weightlifting (hypertrophy training). Minimal cardio.";
      dietPlan = days.map(d => ({
        day: d,
        meals: "Breakfast: Oatmeal with protein powder. Lunch: Chicken & rice. Dinner: Beef & sweet potato."
      }));
      dietPlan[1].meals = "Breakfast: 4 eggs & toast. Lunch: Pasta with turkey. Dinner: Salmon & quinoa.";
      dietPlan[3].meals = "Breakfast: Pancakes & sausage. Lunch: Steak & potatoes. Dinner: Chicken fajitas.";
      dietPlan[5].meals = "Breakfast: Bagel & eggs. Lunch: Large chicken wrap. Dinner: Pasta bake.";
    } else {
      workoutPlan = "3 days of moderate strength training + 2 days of light cardio/active recovery.";
      dietPlan = days.map(d => ({
        day: d,
        meals: "Breakfast: Toast & eggs. Lunch: Sandwich & fruit. Dinner: Chicken & pasta."
      }));
      dietPlan[1].meals = "Breakfast: Oatmeal & nuts. Lunch: Soup & salad. Dinner: Pork chops & rice.";
      dietPlan[3].meals = "Breakfast: Yogurt parfait. Lunch: Chicken wrap. Dinner: Fish & potatoes.";
      dietPlan[5].meals = "Breakfast: Pancakes. Lunch: Burger (no bun). Dinner: Pizza (cauliflower crust).";
    }

    setResults({
      bmi: bmi.toFixed(1),
      maintenance: Math.round(tdee),
      target: Math.round(targetCals),
      macros: { p: Math.round(p), c: Math.round(c), f: Math.round(f) },
      dietPlan,
      workoutPlan,
      wantDietPlan
    });
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 24, fontWeight: 700 }}>🧮 Macros & Calorie Calculator</h3>
        <p style={{ color: "var(--text2)", marginTop: 8 }}>Find your exact caloric needs, BMI, and customized macronutrient breakdown based on your goals.</p>
      </div>

      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 30 }}>
        
        {/* Input Form */}
        <div style={{ background: "var(--card)", padding: 24, borderRadius: "var(--radius)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <User size={18} color="var(--green)" /> Personal Info
          </h4>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", outline: "none" }}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>Age (years)</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", outline: "none" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>Height (cm)</label>
              <div style={{ position: "relative" }}>
                <Ruler size={16} color="var(--text2)" style={{ position: "absolute", top: 12, left: 14 }} />
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: 10, border: "1.5px solid var(--border)", outline: "none" }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>Weight (kg)</label>
              <div style={{ position: "relative" }}>
                <Scale size={16} color="var(--text2)" style={{ position: "absolute", top: 12, left: 14 }} />
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: 10, border: "1.5px solid var(--border)", outline: "none" }} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>Activity Level</label>
            <div style={{ position: "relative" }}>
              <Activity size={16} color="var(--text2)" style={{ position: "absolute", top: 12, left: 14 }} />
              <select value={activity} onChange={e => setActivity(e.target.value)} style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: 10, border: "1.5px solid var(--border)", outline: "none", appearance: "none" }}>
                <option value="1.2">Sedentary (Little or no exercise)</option>
                <option value="1.375">Lightly Active (1-3 days/week)</option>
                <option value="1.55">Moderately Active (3-5 days/week)</option>
                <option value="1.725">Very Active (6-7 days/week)</option>
                <option value="1.9">Extra Active (Twice daily)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>Primary Goal</label>
            <div style={{ position: "relative" }}>
              <Target size={16} color="var(--text2)" style={{ position: "absolute", top: 12, left: 14 }} />
              <select value={goal} onChange={e => setGoal(e.target.value)} style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: 10, border: "1.5px solid var(--border)", outline: "none", appearance: "none" }}>
                <option>Weight Loss</option>
                <option>Maintenance</option>
                <option>Muscle Gain</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>Do you want a customized diet plan?</label>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setWantDietPlan("Yes")}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${wantDietPlan === "Yes" ? "var(--green)" : "var(--border)"}`, background: wantDietPlan === "Yes" ? "var(--green-light)" : "#fff", fontWeight: 600, color: wantDietPlan === "Yes" ? "var(--green-dark)" : "var(--text2)", cursor: "pointer", transition: "all .2s" }}
              >Yes</button>
              <button 
                onClick={() => setWantDietPlan("No")}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${wantDietPlan === "No" ? "var(--orange)" : "var(--border)"}`, background: wantDietPlan === "No" ? "#fff0e8" : "#fff", fontWeight: 600, color: wantDietPlan === "No" ? "var(--orange)" : "var(--text2)", cursor: "pointer", transition: "all .2s" }}
              >No</button>
            </div>
          </div>

          <button onClick={calculate} style={{ width: "100%", padding: "14px", borderRadius: 30, background: "var(--green)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", transition: "all .2s", boxShadow: "0 8px 24px rgba(46,201,114,0.3)" }} className="card-hover">
            Calculate My Results 🚀
          </button>
        </div>

        {/* Results */}
        {results ? (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div style={{ background: "linear-gradient(135deg, var(--green-light), #fff)", padding: 20, borderRadius: "var(--radius)", border: "1.5px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Your BMI</div>
                <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 32, fontWeight: 700, color: "var(--green-dark)" }}>{results.bmi}</div>
                <div style={{ fontSize: 12, color: "var(--green-dark)", marginTop: 4 }}>{results.bmi < 18.5 ? "Underweight" : results.bmi < 25 ? "Normal Weight" : results.bmi < 30 ? "Overweight" : "Obese"}</div>
              </div>
              <div style={{ background: "var(--card)", padding: 20, borderRadius: "var(--radius)", border: "1.5px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 8 }}>Target Daily Calories</div>
                <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: 32, fontWeight: 700, color: "var(--orange)" }}>{results.target} <span style={{ fontSize: 16, fontWeight: 500, color: "var(--text2)" }}>kcal</span></div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>Maintenance: {results.maintenance} kcal</div>
              </div>
            </div>

            <div style={{ background: "var(--card)", padding: 24, borderRadius: "var(--radius)", border: "1.5px solid var(--border)", marginBottom: 16 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Daily Macronutrient Targets</h4>
              <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                <div style={{ background: "#fff0e8", padding: 16, borderRadius: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🥩</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>Protein</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--orange)", marginTop: 4 }}>{results.macros.p}g</div>
                </div>
                <div style={{ background: "var(--green-light)", padding: 16, borderRadius: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🌾</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>Carbs</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--green-dark)", marginTop: 4 }}>{results.macros.c}g</div>
                </div>
                <div style={{ background: "#f0ebff", padding: 16, borderRadius: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🥑</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>Fats</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--purple)", marginTop: 4 }}>{results.macros.f}g</div>
                </div>
              </div>
            </div>

            {results.wantDietPlan === "Yes" && (
              <div style={{ background: "var(--card)", padding: 24, borderRadius: "var(--radius)", border: "1.5px solid var(--border)", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, color: "var(--green)", fontWeight: 700, fontSize: 18 }}>
                  <Utensils size={24} /> Full 7-Day Diet Plan
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {results.dietPlan.map((dayPlan: any, i: number) => (
                    <div key={i} style={{ background: "var(--green-light)", padding: "14px 18px", borderRadius: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontWeight: 700, color: "var(--green-dark)" }}>{dayPlan.day}</div>
                      <div style={{ fontSize: 13.5, color: "var(--text)", lineHeight: 1.5 }}>{dayPlan.meals}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 32, marginBottom: 16, color: "var(--orange)", fontWeight: 700, fontSize: 18 }}>
                  <Dumbbell size={24} /> Recommended Workout
                </div>
                <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.6, background: "#fff0e8", padding: 20, borderRadius: 12 }}>
                  {results.workoutPlan}
                </p>
              </div>
            )}

          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", border: "2px dashed var(--border)", borderRadius: "var(--radius)", color: "var(--text2)" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🥗</div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Ready to calculate!</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Enter your details to generate your custom plan.</div>
          </div>
        )}

      </div>
    </div>
  );
}
