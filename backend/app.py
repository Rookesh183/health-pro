from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Resolve the absolute path to the frontend folder
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))

# In-memory user store (demo only)
users = {
    "user@example.com": {
        "password": "password123",
        "name": "Alex"
    }
}

# ─── API: Login ────────────────────────────────────────────────
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = users.get(email)
    if user and user['password'] == password:
        return jsonify({
            "success": True,
            "token": "fake-jwt-token-for-demo",
            "user": {"name": user['name'], "email": email}
        })
    return jsonify({"success": False, "message": "Invalid email or password"}), 401


# ─── Serve frontend static files ───────────────────────────────
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    # Skip — API routes are handled above
    if path.startswith('api/'):
        return jsonify({"error": "Not found"}), 404

    # Build the full file path safely
    target = os.path.join(FRONTEND_DIR, path) if path else ''

    # If the path points to an existing FILE, serve it
    if path and os.path.isfile(target):
        return send_from_directory(FRONTEND_DIR, path)

    # Default: serve login.html (so the app always loads)
    return send_from_directory(FRONTEND_DIR, 'login.html')


# ─── Run ────────────────────────────────────────────────────────
if __name__ == '__main__':
    print(f"Serving frontend from: {FRONTEND_DIR}")
    app.run(host='0.0.0.0', port=5000, debug=True)
