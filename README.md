# HealthOS Pro — Clinical Nutrition Architecture

A locally-run, clinical nutrition engine that dynamically generates personalized dietary plans based on evidence-based algorithms (Mifflin-St Jeor) and complex chronic condition filters.

---

## 🚀 Quick Start (Zero Setup)

1. **Clone the repo**
   ```bash
   git clone https://github.com/Rookesh183/health-pro.git
   cd health-pro
   ```

2. **Open the App directly**
   Simply open `frontend/index.html` in any modern browser (Chrome, Edge, Firefox).
   *No login, servers, or database required.*

---

## ✨ Key Features

- **Evidence-Based Engine:** Accurate BMI, BMR, and TDEE calculations using the Mifflin-St Jeor equation.
- **Micro/Macro Precision:** Dynamically adjusts Carbohydrate, Protein, and Fat percentages based on selected conditions (e.g., Keto drops carbs to 5%, CKD caps protein at 15%).
- **Extensive Condition Protocols (14+):** Automatically sets strict boundaries for Diabetes, Hypertension, PCOS, CKD, Gout, GERD, Fatty Liver, Hypothyroidism, Anaemia, and more.
- **Interactive Daily & Weekly Plans:** Generates diverse meals (including Indian and global foods) with instant 🔄 **1-Click Swap** functionality.
- **Visual Analytics:** Real-time macro donut charts and weekly calorie estimates.
- **Clinical Print Export:** Polish CSS specifically designed to export a clean, branded PDF of the patient's entire architecture to share with a dietitian.

---

## 📁 Project Structure

```text
health-pro/
├── frontend/
│   ├── index.html      # Main clinical engine and UI
│   ├── styles.css      # Custom styling (light mode, print optimizations)
│   └── script.js       # Core algorithms (Calculations, Meals, Canvas Charts)
└── backend/
    ├── app.py          # Legacy Flask fallback
    └── requirements.txt
```

---

## 🧬 Core Algorithms

The logic driving HealthOS Pro lives entirely inside `frontend/script.js`:
- **BMR & TDEE:** Calculated using user physical metrics and exact activity multipliers.
- **Rule-Based Expert System:** Replaces generic advice by flagging hard limits:
  - `Hypertension` ➜ `max_sodium = 1500mg`
  - `Type 2 Diabetes` ➜ `max_sugar = 25g`
- **Cardiometabolic Risk Score:** A compounding UI algorithm analyzing BMI penalty + Age penalty + Comorbidity penalty.

*Disclaimer: HealthOS Pro is a clinical simulation/support tool for educational purposes only and does not replace professional medical advice.*

---

## 🛠 Technologies

- **Frontend:** Pure HTML5, Vanilla JavaScript (ES6), Custom CSS3.
- **Data Visualization:** Native HTML5 `<canvas>`.
- **Data Persistence:** `localStorage` (100% offline, privacy-first).
- **Typography:** Google Fonts (Outfit, Inter).

---

## 📄 License
MIT License
