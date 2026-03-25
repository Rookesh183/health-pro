# HealthOS Pro — Clinical Nutrition & Meal Planner

A clinical nutrition app with BMI/TDEE calculations, condition-specific dietary protocols, meal planning (Indian + global), and nutrient tracking.

---

## 🚀 Quick Start (No Installation Needed)

1. **Clone the repo**
   ```bash
   git clone https://github.com/Rookesh183/health-pro.git
   cd health-pro
   ```

2. **Open the app** — just open `frontend/login.html` in any modern browser (Chrome, Edge, Firefox).

3. **Log in** using the built-in demo account:
   | Field    | Value               |
   |----------|---------------------|
   | Email    | `user@example.com`  |
   | Password | `password123`       |

   > Or click **Sign up** to create your own account (stored locally in your browser).

---

## 📁 Project Structure

```
health-pro/
├── frontend/
│   ├── index.html      # Main app (step-by-step planner)
│   ├── login.html      # Login page
│   ├── signup.html     # Registration page
│   ├── styles.css      # All styles
│   ├── script.js       # App logic (BMI, TDEE, meals, charts)
│   └── login.js        # Auth logic
└── backend/
    ├── app.py          # Flask backend (optional)
    └── requirements.txt
```

---

## ⚙️ Optional: Run with Flask Backend

Only needed if you want server-side login. The frontend works **100% offline** without it.

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000` and also serves the frontend at `/`.

---

## 🔑 Authentication

- Auth is **localStorage-based** — accounts are saved in the browser on each device.
- The demo account (`user@example.com` / `password123`) works on **any device** without sign-up.
- Signing up on one machine does **not** carry over to another machine (by design — no server).

---

## ✨ Features

- BMI, TDEE & macro calculation
- Condition-specific protocols (Diabetes, Hypertension, PCOS, CKD, etc.)
- Daily & weekly meal plans (Indian + global foods)
- Nutrient breakdown with animated charts
- Optional AI insights via [OpenRouter](https://openrouter.ai) (free API key)

---

## 🛠 Technologies

- HTML5 · CSS3 · Vanilla JavaScript (ES6)
- Canvas API (charts)
- Flask + Flask-CORS (optional backend)
- Google Fonts (Outfit, Inter)

---

## 📄 License

MIT License
