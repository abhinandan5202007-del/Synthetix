import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database Setup
def init_db():
    conn = sqlite3.connect('mentor.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                 (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    try:
        conn = sqlite3.connect('mentor.db')
        c = conn.cursor()
        c.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
                  (data['fullName'], data['email'], data['password']))
        conn.commit()
        return jsonify({"message": "User registered", "name": data['fullName']}), 201
    except Exception as e:
        return jsonify({"error": "Email already exists"}), 400
    finally:
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    conn = sqlite3.connect('mentor.db')
    c = conn.cursor()
    c.execute("SELECT name, email FROM users WHERE email=? AND password=?", 
              (data['email'], data['password']))
    user = c.fetchone()
    conn.close()
    
    if user:
        return jsonify({"name": user[0], "email": user[1]}), 200
    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5000)