# HealthOS Pro - AI-Powered Clinical Nutrition & Meal Planner

A comprehensive health and nutrition application that provides personalized dietary recommendations, meal planning, and AI-powered clinical insights.

## Quick Start

### Frontend Only (No Installation Required)
1. Open `index.html` in any modern web browser
2. Enter your health information
3. Get personalized nutrition recommendations

### With Python Backend (Optional)
```bash
pip install -r requirements.txt
python app.py
```

## Features

- **Personalized Nutrition**: BMI, TDEE, and custom nutrient targets
- **AI-Powered Insights**: Real AI recommendations (OpenRouter API)
- **Condition-Specific Protocols**: Diabetes, Hypertension, Cholesterol, PCOS, IBS
- **Meal Planning**: Daily and weekly meal plans
- **Export Reports**: Save your health plan

## AI Configuration

1. Get a free API key from [OpenRouter](https://openrouter.ai)
2. Enter it in the settings panel
3. Select "OpenRouter" as the AI provider

## Project Structure

```
healthos-app/
├── index.html      # Main HTML file
├── styles.css      # All CSS styles
├── script.js       # All JavaScript logic
├── app.py          # Python backend (optional)
├── requirements.txt # Python dependencies
└── README.md       # Documentation
```

## Technologies

- HTML5, CSS3, JavaScript (ES6)
- Google Fonts (Syne, DM Sans)
- OpenRouter AI API
- Flask (optional backend)

## License

MIT License
