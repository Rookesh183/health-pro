from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend')
CORS(app)

# Dummy user data for demonstration
users = {
    "user@example.com": {
        "password": "password123",
        "name": "Alex"
    }
}

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if email in users and users[email]['password'] == password:
        return jsonify({
            "success": True,
            "token": "fake-jwt-token-for-demo",
            "user": {
                "name": users[email]['name'],
                "email": email
            }
        })
    else:
        return jsonify({"success": False, "message": "Invalid email or password"}), 401


if __name__ == '__main__':
    app.run(debug=True, port=5000)
