// =============================================
// Application State
// =============================================
const S = {
    age: '', weight: '', height: '', sex: '',
    activity: '', diet: '', allergies: [], conditions: []
};

let aiSettings = { provider: 'openrouter', apiKey: '' };

const ACTIVITY_MULTIPLIERS = {
    'Sedentary': 1.2, 'Lightly Active': 1.375,
    'Moderately Active': 1.55, 'Very Active': 1.725, 'Extremely Active': 1.9
};

// =============================================
// Extended Meal Database (with Indian Foods)
// =============================================
const MEAL_DB = {
    Omnivore: {
        bf: ['Oats with berries & honey', 'Avocado toast with eggs', 'Greek yogurt parfait', 'Poha (flattened rice) with vegetables', 'Masala omelette with toast', 'Upma with sambar'],
        lu: ['Grilled chicken bowl with salad', 'Dal rice with sabji', 'Rajma chawal', 'Chicken curry with roti', 'Paneer tikka wrap', 'Tuna salad sandwich'],
        dn: ['Baked salmon with quinoa', 'Chicken curry with brown rice', 'Mutton kheema with roti', 'Mixed vegetable sabji with dal', 'Grilled fish with stir-fry veg', 'Chicken biryani (lighter)'],
        sn: ['Mixed nuts & dates', 'Apple with peanut butter', 'Roasted chana', 'Fruit chaat', 'Makhana (fox nuts)', 'Banana with milk']
    },
    Vegetarian: {
        bf: ['Moong dal chilla', 'Poha with peas & peanuts', 'Paneer bhurji with toast', 'Idli with sambar & chutney', 'Vegetable upma', 'Besan cheela'],
        lu: ['Paneer tikka wrap with raita', 'Chole with brown rice', 'Palak paneer with roti', 'Dal tadka with jeera rice', 'Mix veg curry with chapati', 'Rajma bowl with salad'],
        dn: ['Dal makhani with garlic naan', 'Matar paneer with roti', 'Kadhi chawal', 'Stuffed capsicum with dal', 'Tofu stir-fry', 'Vegetable khichdi'],
        sn: ['Sprouts bhel', 'Roasted chana', 'Dry fruit mix', 'Fruit bowl with chaat masala', 'Murmura (puffed rice)', 'Coconut water with banana']
    },
    Vegan: {
        bf: ['Oats with almond milk & fruits', 'Moong dal chilla (no ghee)', 'Chia pudding with mango', 'Tofu scramble with veggies', 'Ragi porridge', 'Poha with groundnuts'],
        lu: ['Chickpea curry (chana masala)', 'Lentil Buddha bowl', 'Black bean tacos', 'Mixed dal with brown rice', 'Rajma with roti', 'Mung bean salad'],
        dn: ['Dal with bajra roti', 'Mushroom & pea curry', 'Baingan bharta with khichdi', 'Mung bean curry', 'Vegetable dalia', 'Tofu palak curry'],
        sn: ['Edamame', 'Roasted groundnuts', 'Dates & figs', 'Coconut water', 'Makhana roasted snack', 'Seasonal fruits']
    },
    Keto: {
        bf: ['Keto paneer omelette', 'Avocado egg bake', 'Cheese omelette with greens', 'Chicken tikka (boneless)', 'Bulletproof coffee'],
        lu: ['Chicken Caesar salad', 'Tandoori chicken with cucumber', 'Egg salad wrap (lettuce)', 'Paneer bhurji (no roti)', 'Grilled fish with veggies'],
        dn: ['Grilled fish with cauliflower rice', 'Chicken thighs with stir-fry', 'Mutton soup with sauteed veg', 'Egg curry (no potatoes)', 'Keto palak with paneer'],
        sn: ['Cheese cubes', 'Hard boiled eggs', 'Pumpkin seeds', 'Almond & walnut mix', 'Paneer cubes with spices']
    },
    'Gluten-Free': {
        bf: ['Rice flake (poha) upma', 'Quinoa porridge with nuts', 'Ragi (finger millet) dosa', 'Sabudana khichdi', 'Smoothie bowl with granola (GF)', 'Idli with coconut chutney'],
        lu: ['Brown rice with dal & sabji', 'Quinoa salad with chickpeas', 'Ragi roti with dal', 'Rice noodle stir-fry', 'Sabudana vada with chutney', 'Besan curry (kadhi)'],
        dn: ['Grilled fish with sweet potato', 'Chicken curry with rice', 'Khichdi (rice & dal)', 'Baked salmon with quinoa', 'Ragi mudde with sambar'],
        sn: ['Rice cakes', 'Mixed nuts', 'Yogurt with honey', 'Makhana roasted snack', 'Fruit salad', 'Coconut laddoo']
    },
    Pescatarian: {
        bf: ['Smoked salmon toast', 'Tuna omelette', 'Fish tikka bhurji', 'Oats with nuts & honey', 'Idli with fish sambar'],
        lu: ['Grilled prawn bowl', 'Fish curry with brown rice', 'Tuna salad', 'Prawn biryani (lighter)', 'Fish tacos'],
        dn: ['Baked salmon with quinoa', 'Fish curry with roti', 'Prawn stir-fry with veggies', 'Tandoori fish with salad', 'Fish khichdi'],
        sn: ['Roasted makhana', 'Dates & nuts', 'Yogurt', 'Fruit bowl', 'Coconut water']
    }
};

// =============================================
// API Settings
// =============================================
function loadApiSettings() {
    const saved = localStorage.getItem('healthos_ai_settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            aiSettings = settings;
            if (document.getElementById('aiProvider')) document.getElementById('aiProvider').value = settings.provider;
            if (document.getElementById('apiKey')) document.getElementById('apiKey').value = settings.apiKey || '';
        } catch (e) { }
    }
}

function saveApiSettings() {
    aiSettings.provider = document.getElementById('aiProvider').value;
    aiSettings.apiKey = document.getElementById('apiKey').value;
    localStorage.setItem('healthos_ai_settings', JSON.stringify(aiSettings));
    document.getElementById('apiStatus').innerHTML = '✓ Saved';
    setTimeout(() => document.getElementById('apiStatus').innerHTML = '⚡ AI Ready', 2000);
}

// =============================================
// Progress & Navigation
// =============================================
function updateProgress(step) {
    const pct = ((step - 1) / 4) * 100;
    document.getElementById('pFill').style.width = pct + '%';
    document.getElementById('pLabel').textContent = step < 5 ? `Step ${step} of 4` : 'Complete 🎉';
}

function showError(id, msg) {
    const el = document.getElementById(id);
    el.innerHTML = msg ? `<div class="error-msg">! ${msg}</div>` : '';
}

function go(from, to) {
    if (from === 1) {
        S.age = document.getElementById('age').value;
        S.weight = document.getElementById('weight').value;
        S.height = document.getElementById('height').value;
        S.sex = S._sex || document.getElementById('sex')?.value || '';
        if (!S.age || !S.weight || !S.height || !S.sex) {
            showError('e1', 'Please fill all fields including gender.');
            return;
        }
        showError('e1', '');
    }
    if (from === 2 && !S.activity) { showError('e2', 'Select activity level.'); return; }
    if (from === 3 && !S.diet) { showError('e3', 'Select dietary preference.'); return; }
    if (from === 4) {
        if (!S.conditions.length) { showError('e4', 'Select at least one condition option.'); return; }
        showError('e4', '');
    }

    document.getElementById(`step${from}`).classList.remove('active');
    document.getElementById(`step${to}`).classList.add('active');
    updateProgress(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (to === 5) renderAll();
}

function pick(type, el) {
    el.parentElement.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    S[type] = el.dataset.val;
}

function pickGender(val, el) {
    document.querySelectorAll('.gender-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    S._sex = val;
    S.sex = val;
}

function tog(type, el) {
    const arr = type === 'allergy' ? S.allergies : S.conditions;
    const val = el.dataset.val;

    if (val === 'None') {
        el.parentElement.querySelectorAll('.tag-chip').forEach(c => {
            if (c.dataset.val !== 'None') c.classList.remove('selected');
        });
        arr.length = 0;
        if (!el.classList.contains('selected')) {
            el.classList.add('selected');
            arr.push('None');
        } else {
            el.classList.remove('selected');
        }
        return;
    }

    const noneEl = el.parentElement.querySelector('[data-val="None"]');
    if (noneEl && noneEl.classList.contains('selected')) {
        noneEl.classList.remove('selected');
        const idx = arr.indexOf('None');
        if (idx > -1) arr.splice(idx, 1);
    }

    if (el.classList.contains('selected')) {
        el.classList.remove('selected');
        const idx = arr.indexOf(val);
        if (idx > -1) arr.splice(idx, 1);
    } else {
        el.classList.add('selected');
        arr.push(val);
    }
}

// =============================================
// Calculations
// =============================================
function calculateBMI() {
    const h = parseFloat(S.height) / 100;
    return (parseFloat(S.weight) / (h * h)).toFixed(1);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

function calculateTDEE() {
    const w = parseFloat(S.weight), h = parseFloat(S.height), a = parseInt(S.age);
    let bmr = S.sex === 'Female' ? 10 * w + 6.25 * h - 5 * a - 161 : 10 * w + 6.25 * h - 5 * a + 5;
    return Math.round(bmr * (ACTIVITY_MULTIPLIERS[S.activity] || 1.55));
}

function calculateNutrients(cal) {
    const isDia = S.conditions.includes('Type 2 Diabetes');
    const isHyp = S.conditions.includes('Hypertension');
    const isChol = S.conditions.includes('High Cholesterol');
    const isCKD = S.conditions.includes('CKD');
    const isKeto = S.diet === 'Keto';

    let carbPct = isKeto ? 0.05 : (isDia ? 0.40 : 0.50);
    let proteinPct = isCKD ? 0.15 : 0.25;
    let fatPct = 1 - carbPct - proteinPct;

    return {
        carbs: Math.round((cal * carbPct) / 4),
        protein: Math.round((cal * proteinPct) / 4),
        fat: Math.round((cal * fatPct) / 9),
        fiber: isDia ? 38 : 28,
        sodium: isHyp ? 1500 : 2300,
        sugar: isDia ? 25 : 50,
        satFat: isChol ? 13 : 22,
        calcium: 1000,
        carbPct: Math.round(carbPct * 100),
        proteinPct: Math.round(proteinPct * 100),
        fatPct: Math.round(fatPct * 100)
    };
}

// =============================================
// Meal Plan Builder
// =============================================
function getMealPlan() {
    const db = MEAL_DB[S.diet] || MEAL_DB.Omnivore;
    return {
        id: Math.random().toString(36).substr(2, 9),
        bf: db.bf[Math.floor(Math.random() * db.bf.length)],
        lu: db.lu[Math.floor(Math.random() * db.lu.length)],
        dn: db.dn[Math.floor(Math.random() * db.dn.length)],
        sn: db.sn[Math.floor(Math.random() * db.sn.length)]
    };
}

function swapMeal(type, elId) {
    const db = MEAL_DB[S.diet] || MEAL_DB.Omnivore;
    const meals = db[type];
    const newMeal = meals[Math.floor(Math.random() * meals.length)];
    const el = document.getElementById(elId);
    if (el) {
        el.textContent = newMeal;
        // If it's the daily view, we might need to update calorie eaten progress if checked
        if (type === 'bf' || type === 'lu' || type === 'dn' || type === 'sn') {
             // Just updating text is enough for now as the kcal is fixed per slot in this simplified version
        }
    }
}

function buildDailyPlan(cal) {
    const meals = getMealPlan();
    const bfCals = Math.round(cal * 0.25);
    const luCals = Math.round(cal * 0.35);
    const dnCals = Math.round(cal * 0.30);
    const snCals = Math.round(cal * 0.10);

    return `<div class="day-card">
        <div class="day-header-label">Today's Recommended Meals</div>
        <div class="meal-row">
            <div class="meal-time-badge breakfast-badge">🌅 Breakfast</div>
            <div class="meal-info">
                <div class="meal-name-row">
                    <div class="meal-name" id="meal-bf">${meals.bf}</div>
                    <button class="swap-btn" onclick="swapMeal('bf', 'meal-bf')">🔄</button>
                </div>
                <div class="meal-cal">${bfCals} kcal</div>
            </div>
        </div>
        <div class="meal-row">
            <div class="meal-time-badge lunch-badge">☀️ Lunch</div>
            <div class="meal-info">
                <div class="meal-name-row">
                    <div class="meal-name" id="meal-lu">${meals.lu}</div>
                    <button class="swap-btn" onclick="swapMeal('lu', 'meal-lu')">🔄</button>
                </div>
                <div class="meal-cal">${luCals} kcal</div>
            </div>
        </div>
        <div class="meal-row">
            <div class="meal-time-badge snack-badge">🍵 Snack</div>
            <div class="meal-info">
                <div class="meal-name-row">
                    <div class="meal-name" id="meal-sn">${meals.sn}</div>
                    <button class="swap-btn" onclick="swapMeal('sn', 'meal-sn')">🔄</button>
                </div>
                <div class="meal-cal">${snCals} kcal</div>
            </div>
        </div>
        <div class="meal-row" style="border-bottom:none;">
            <div class="meal-time-badge dinner-badge">🌙 Dinner</div>
            <div class="meal-info">
                <div class="meal-name-row">
                    <div class="meal-name" id="meal-dn">${meals.dn}</div>
                    <button class="swap-btn" onclick="swapMeal('dn', 'meal-dn')">🔄</button>
                </div>
                <div class="meal-cal">${dnCals} kcal</div>
            </div>
        </div>
        <div style="margin-top:16px;border-top:1px dashed rgba(255,255,255,0.1);padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
            <span style="color:var(--text-muted);font-size:0.85rem;">Total Daily Intake</span>
            <span style="color:var(--accent);font-weight:700;font-size:1.1rem;">${bfCals + luCals + dnCals + snCals} kcal</span>
        </div>
    </div>`;
}

function buildWeeklyPlan(cal) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let rows = '';
    for (let i = 0; i < days.length; i++) {
        const meals = getMealPlan();
        const rowClass = i % 2 === 0 ? 'week-row-even' : '';
        rows += `<tr class="${rowClass}">
            <td style="color:var(--accent);font-weight:700;">${days[i]}</td>
            <td>
                <div class="week-meal-cell">
                    <span id="w-bf-${i}">${meals.bf}</span>
                    <button class="swap-btn-mini" onclick="swapMeal('bf', 'w-bf-${i}')">🔄</button>
                </div>
            </td>
            <td>
                <div class="week-meal-cell">
                    <span id="w-lu-${i}">${meals.lu}</span>
                    <button class="swap-btn-mini" onclick="swapMeal('lu', 'w-lu-${i}')">🔄</button>
                </div>
            </td>
            <td>
                <div class="week-meal-cell">
                    <span id="w-sn-${i}">${meals.sn}</span>
                    <button class="swap-btn-mini" onclick="swapMeal('sn', 'w-sn-${i}')">🔄</button>
                </div>
            </td>
            <td>
                <div class="week-meal-cell">
                    <span id="w-dn-${i}">${meals.dn}</span>
                    <button class="swap-btn-mini" onclick="swapMeal('dn', 'w-dn-${i}')">🔄</button>
                </div>
            </td>
            <td style="color:var(--accent2);font-weight:700;">${Math.round(cal)} kcal</td>
        </tr>`;
    }
    return `<div style="overflow-x:auto;">
        <table class="week-table">
            <thead><tr><th>Day</th><th>🌅 Breakfast</th><th>☀️ Lunch</th><th>🍵 Snack</th><th>🌙 Dinner</th><th>Calories</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    </div>`;
}

function nutrientBar(name, val, unit, max, color) {
    const pct = Math.min(100, Math.round((val / max) * 100));
    return `<div class="nutrient-item">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:0.85rem;color:var(--text-muted);">${name}</span>
            <span style="font-size:0.95rem;font-weight:700;color:var(--text);">${val}${unit}</span>
        </div>
        <div class="nutrient-bar-bg">
            <div class="nutrient-bar" style="background:${color};width:0%" data-pct="${pct}"></div>
        </div>
        <div style="text-align:right;font-size:0.75rem;color:var(--text-dim);margin-top:4px;">${pct}% of target</div>
    </div>`;
}

// =============================================
// Macro Donut Chart (Canvas-based)
// =============================================
function drawMacroChart(nutrients) {
    const canvas = document.getElementById('macroChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 200;
    const H = canvas.height = 200;
    const cx = W / 2, cy = H / 2, r = 80, innerR = 50;

    const data = [
        { pct: nutrients.carbPct, color: '#3b82f6' },
        { pct: nutrients.proteinPct, color: '#10b981' },
        { pct: nutrients.fatPct, color: '#f59e0b' }
    ];

    ctx.clearRect(0, 0, W, H);
    let startAngle = -Math.PI / 2;

    data.forEach(d => {
        const slice = (d.pct / 100) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, startAngle + slice);
        ctx.closePath();
        ctx.fillStyle = d.color;
        ctx.fill();
        startAngle += slice;
    });

    // Inner circle (donut hole)
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Centre text
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px Outfit, sans-serif';
    ctx.fillText('Macros', cx, cy - 6);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('breakdown', cx, cy + 12);
}

function drawCalorieChart(cal) {
    const canvas = document.getElementById('calorieChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 380;
    const H = canvas.height = 160;
    ctx.clearRect(0, 0, W, H);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = days.map(() => Math.round(cal * (0.85 + Math.random() * 0.3)));
    const max = Math.max(...values) * 1.2;
    const barW = 34;
    const gap = (W - days.length * barW) / (days.length + 1);
    const bottomPad = 28, topPad = 12;

    const grad = ctx.createLinearGradient(0, topPad, 0, H - bottomPad);
    grad.addColorStop(0, 'rgba(16,185,129,0.8)');
    grad.addColorStop(1, 'rgba(16,185,129,0.15)');

    values.forEach((v, i) => {
        const bH = ((v / max) * (H - topPad - bottomPad));
        const x = gap + i * (barW + gap);
        const y = H - bottomPad - bH;

        ctx.beginPath();
        ctx.roundRect(x, y, barW, bH, 6);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.fillStyle = '#64748b';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(days[i], x + barW / 2, H - 6);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 11px Inter';
        ctx.fillText(v, x + barW / 2, y - 6);
    });
}

// =============================================
// Condition Banners
// =============================================
function renderConditionBanners() {
    let html = '';
    if (S.conditions.includes('Type 2 Diabetes')) html += `<div class="condition-banner cb-red"><strong>🩸 Diabetes Protocol</strong> — Sugar ≤25g, fiber ≥38g, low-GI foods only.</div>`;
    if (S.conditions.includes('Hypertension')) html += `<div class="condition-banner cb-orange"><strong>❤️ Hypertension Protocol</strong> — Sodium ≤1500mg, DASH diet, low processed foods.</div>`;
    if (S.conditions.includes('High Cholesterol')) html += `<div class="condition-banner cb-yellow"><strong>🫀 Cholesterol Protocol</strong> — Saturated fat ≤13g, omega-3 focus.</div>`;
    if (S.conditions.includes('Asthma')) html += `<div class="condition-banner cb-blue"><strong>🫁 Asthma Support</strong> — Anti-inflammatory foods, Vitamin D rich diet, avoid cold foods.</div>`;
    if (S.conditions.includes('Arthritis')) html += `<div class="condition-banner cb-purple"><strong>🦴 Arthritis Support</strong> — Omega-3 rich foods, antioxidants (berries, greens), low sugar.</div>`;
    if (S.conditions.includes('CKD')) html += `<div class="condition-banner cb-red"><strong>🫘 CKD Protocol</strong> — Controlled protein (${Math.round(parseFloat(S.weight) * 0.6)}g/day), low phosphorus & potassium.</div>`;
    if (S.conditions.includes('Celiac')) html += `<div class="condition-banner cb-green"><strong>🌾 Celiac Protocol</strong> — Strict 100% gluten-free diet. No wheat, barley, rye.</div>`;
    if (S.conditions.includes('Crohns')) html += `<div class="condition-banner cb-orange"><strong>🔥 Crohn's Protocol</strong> — Low residue during flares, high nutrient density, small frequent meals.</div>`;
    if (S.conditions.includes('Osteoporosis')) html += `<div class="condition-banner cb-blue"><strong>🦴 Osteoporosis Support</strong> — 1200mg calcium, Vitamin D, weight-bearing exercise.</div>`;
    if (S.conditions.includes('PCOS')) html += `<div class="condition-banner cb-purple"><strong>🔵 PCOS Protocol</strong> — Low GI diet, high fiber, low dairy, anti-inflammatory.</div>`;
    if (S.conditions.includes('IBS')) html += `<div class="condition-banner cb-yellow"><strong>🌀 IBS Protocol</strong> — Low FODMAP diet, avoid trigger foods, small frequent meals.</div>`;
    if (S.conditions.includes('Thyroid Disorder')) html += `<div class="condition-banner cb-green"><strong>🦋 Thyroid Protocol</strong> — Choose selenium-rich foods, limit raw cruciferous vegetables.</div>`;
    if (S.conditions.includes('GERD')) html += `<div class="condition-banner cb-orange"><strong>🔥 GERD Support</strong> — Avoid caffeine, spicy foods, citric fruits; eat 3h before bed.</div>`;
    if (S.conditions.includes('Fatty Liver')) html += `<div class="condition-banner cb-green"><strong>🌿 Fatty Liver Support</strong> — Zero alcohol, high antioxidants, weight management, low sugar.</div>`;
    if (S.conditions.includes('Gout')) html += `<div class="condition-banner cb-red"><strong>⚖️ Gout Management</strong> — Low purine foods, avoid red meat & alcohol, high hydration.</div>`;
    if (S.conditions.includes('Hypothyroidism')) html += `<div class="condition-banner cb-blue"><strong>🦋 Hypothyroid Support</strong> — Iodine & selenium focus, avoid raw goitrogens (cabbage/kale).</div>`;
    if (S.conditions.includes('Anaemia')) html += `<div class="condition-banner cb-purple"><strong>🩸 Anaemia Support</strong> — Iron-rich foods ( पालक, dates, seeds), Vitamin C for absorption.</div>`;
    if (!html) html = '<div class="condition-banner cb-green">✅ No chronic conditions — standard nutrient targets applied.</div>';
    document.getElementById('condBanners').innerHTML = html;
}

// =============================================
// Physical Stats Render
// =============================================
function renderPhysicalStats(bmi, bmiCat, cal, nutrients) {
    const riskScore = Math.min(95, Math.round(30 + (bmi > 30 ? 25 : 0) + (S.conditions.filter(c => c !== 'None').length * 8) + (parseInt(S.age) > 60 ? 15 : 0)));
    const riskColor = riskScore > 70 ? '#ef4444' : riskScore > 50 ? '#f59e0b' : '#10b981';
    const bmiColor = parseFloat(bmi) > 30 ? '#ef4444' : parseFloat(bmi) > 25 ? '#f59e0b' : '#10b981';

    document.getElementById('physRows').innerHTML = `
        <div class="result-row"><span>Age / Sex</span><span>${S.age} yrs · ${S.sex}</span></div>
        <div class="result-row"><span>Weight / Height</span><span>${S.weight} kg · ${S.height} cm</span></div>
        <div class="result-row"><span>BMI</span><span style="color:${bmiColor};font-weight:600;">${bmi} — ${bmiCat}</span></div>
        <div class="result-row"><span>Activity</span><span>${S.activity}</span></div>
        <div class="result-row"><span>Diet Preference</span><span>${S.diet}</span></div>
        <div class="result-row"><span>Cardiometabolic Risk</span><span style="color:${riskColor};font-weight:600;">${riskScore}%</span></div>
        <div class="result-row"><span>Daily Energy (TDEE)</span><span><strong style="color:var(--accent);font-size:1.1em;">${cal} kcal</strong></span></div>
        <div class="result-row"><span>Macro Split</span><span>Carbs ${nutrients.carbPct}% · Protein ${nutrients.proteinPct}% · Fat ${nutrients.fatPct}%</span></div>
    `;
}

// =============================================
// Nutrient Grid Render
// =============================================
function renderNutrients(nutrients, cal) {
    document.getElementById('nutGrid').innerHTML = `
        ${nutrientBar('Carbohydrates', nutrients.carbs, 'g', 400, 'linear-gradient(90deg,#3b82f6,#60a5fa)')}
        ${nutrientBar('Protein', nutrients.protein, 'g', 200, 'linear-gradient(90deg,#10b981,#34d399)')}
        ${nutrientBar('Total Fat', nutrients.fat, 'g', 120, 'linear-gradient(90deg,#f59e0b,#fcd34d)')}
        ${nutrientBar('Dietary Fiber', nutrients.fiber, 'g', 50, 'linear-gradient(90deg,#8b5cf6,#c4b5fd)')}
        ${nutrientBar('Sodium', nutrients.sodium, 'mg', 2300, 'linear-gradient(90deg,#ef4444,#fca5a5)')}
        ${nutrientBar('Sugar', nutrients.sugar, 'g', 100, 'linear-gradient(90deg,#ec4899,#f9a8d4)')}
        ${nutrientBar('Saturated Fat', nutrients.satFat, 'g', 30, 'linear-gradient(90deg,#6366f1,#a5b4fc)')}
        ${nutrientBar('Calories', cal, 'kcal', 3500, 'linear-gradient(90deg,#06b6d4,#67e8f9)')}
    `;

    // Animate bars after a brief delay
    setTimeout(() => {
        document.querySelectorAll('.nutrient-bar').forEach(bar => {
            bar.style.width = bar.getAttribute('data-pct') + '%';
        });
    }, 100);
}

// =============================================
// Clinical Insights// =============================================
function generateMockAIInsights(bmi, bmiCat, cal, nutrients) {
    const bmiNum = parseFloat(bmi);
    const riskLevel = bmiNum > 30 ? 'elevated' : (bmiNum > 25 ? 'moderate' : 'optimal');
    const hasConditions = S.conditions.filter(c => c !== 'None').length > 0;
    const water = Math.round(parseFloat(S.weight) * 0.033);
    return `<strong>1. Key Health Observations</strong><br>Your BMI of ${bmi} puts you in the <em>${bmiCat.toLowerCase()}</em> category (${riskLevel} risk). ${hasConditions ? `Your conditions (${S.conditions.filter(c => c !== 'None').join(', ')}) require special dietary attention.` : 'No chronic conditions detected — focus on maintaining your current health.'}<br><br>
    <strong>2. Personalised Nutrition Strategy</strong><br>Following a ${S.diet} diet with ${S.activity} activity, your body needs ${cal} kcal/day. ${S.conditions.includes('Type 2 Diabetes') ? 'Prioritise low-GI carbs like oats, brown rice, and legumes.' : ''} ${S.conditions.includes('Hypertension') ? `Limit sodium to ${nutrients.sodium}mg — avoid pickles, processed snacks, papads.` : ''} ${S.conditions.includes('High Cholesterol') ? 'Replace saturated fats with omega-3 sources like flaxseeds and walnuts.' : ''}<br><br>
    <strong>3. Daily Habits for Best Results</strong><br>• <strong>Hydration:</strong> Drink ${water}L of water daily (more in summer)<br>• <strong>Meal Timing:</strong> Eat every 3–4 hours; don't skip breakfast<br>• <strong>Indian Superfoods:</strong> Include haldi, methi, amla, dalchini in daily cooking<br>• <strong>Mindful Eating:</strong> Chew slowly, eat without screens<br><br><em style="color:var(--text-dim);">⚠️ Disclaimer: This is for educational purposes only. Always consult your doctor or registered dietitian for personalised medical advice.</em>`;
}

async function getAIInsights(bmi, bmiCat, cal, nutrients) {
    const aiText = document.getElementById('aiText');
    const badge = document.getElementById('aiModelBadge');

    if (aiSettings.provider === 'mock' || !aiSettings.apiKey) {
        badge.innerHTML = '📋 Standard Protocol';
        aiText.innerHTML = generateMockAIInsights(bmi, bmiCat, cal, nutrients);
        return;
    }

    try {
        badge.innerHTML = '⚡ Advanced Protocol';
        aiText.innerHTML = '<div class="loading-spinner"><div class="dot-spin"></div><span>Generating personalized clinical protocol...</span></div>';

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aiSettings.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'HealthOS'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [{ role: 'user', content: `Provide clinical nutrition advice for: Age ${S.age}, ${S.sex}, BMI ${bmi} (${bmiCat}), ${S.activity} activity, ${S.diet} diet, conditions: ${S.conditions.join(',') || 'none'}. Include Indian food recommendations. Give 3 short paragraphs.` }],
                max_tokens: 500
            })
        });

        if (!response.ok) throw new Error();
        const data = await response.json();
        aiText.innerHTML = data.choices[0].message.content.replace(/\n/g, '<br>');
    } catch (error) {
        badge.innerHTML = '📋 Smart AI';
        aiText.innerHTML = generateMockAIInsights(bmi, bmiCat, cal, nutrients);
    }
}

// =============================================
// Tab Switching (Fixed)
// =============================================
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    // Find and activate the matching tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab === tab) btn.classList.add('active');
    });
    const panel = document.getElementById(`tab-${tab}`);
    if (panel) panel.classList.add('active');
}

// =============================================
// Main Render
// =============================================
async function renderAll() {
    const bmi = calculateBMI();
    const cal = calculateTDEE();
    const nutrients = calculateNutrients(cal);
    const bmiCat = getBMICategory(parseFloat(bmi));

    renderPhysicalStats(bmi, bmiCat, cal, nutrients);
    renderNutrients(nutrients, cal);
    renderConditionBanners();
    document.getElementById('tab-daily').innerHTML = buildDailyPlan(cal);
    document.getElementById('tab-weekly').innerHTML = buildWeeklyPlan(cal);
    
    // Set date for print branding
    const appEl = document.querySelector('.app');
    if (appEl) appEl.setAttribute('data-date', new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));

    // Draw charts after content is rendered
    setTimeout(() => {
        drawMacroChart(nutrients);
        drawCalorieChart(cal);
    }, 300);

    await getAIInsights(bmi, bmiCat, cal, nutrients);
}

// =============================================
// Start Over
// =============================================
function startOver() {
    Object.assign(S, { age: '', weight: '', height: '', sex: '', _sex: '', activity: '', diet: '', allergies: [], conditions: [] });
    ['age', 'weight', 'height'].forEach(id => { if (document.getElementById(id)) document.getElementById(id).value = ''; });
    document.querySelectorAll('.choice-card, .gender-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('selected'));
    ['step2', 'step3', 'step4', 'step5'].forEach(id => document.getElementById(id).classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    updateProgress(1);
    window.scrollTo({ top: 0 });
}

// =============================================
// Init
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    loadApiSettings();
    updateProgress(1);
});
