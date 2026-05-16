"""
═══════════════════════════════════════════════════
 THAMAQ RESTAURANT — Flask Backend (app.py)
 Features: Reservations API, Contact, Menu, Auth
═══════════════════════════════════════════════════
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from datetime import datetime
import sqlite3, os, hashlib, secrets

app = Flask(__name__, static_folder='.', template_folder='.')
CORS(app)
app.secret_key = secrets.token_hex(32)

DB_PATH = 'thamaq.db'

# ══════════════════════ DATABASE SETUP ══════════════════════
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        guests TEXT NOT NULL,
        occasion TEXT,
        requests TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        items TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )''')

    conn.commit()
    conn.close()

# ══════════════════════ HELPER ══════════════════════
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ══════════════════════ ROUTES ══════════════════════

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

# ── RESERVATIONS ──
@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json()
    required = ['name', 'phone', 'date', 'time', 'guests']
    for field in required:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required'}), 400

    # Validate date is not in the past
    try:
        res_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if res_date < datetime.now().date():
            return jsonify({'success': False, 'error': 'Date cannot be in the past'}), 400
    except ValueError:
        return jsonify({'success': False, 'error': 'Invalid date format'}), 400

    conn = get_db()
    try:
        conn.execute('''
            INSERT INTO reservations (name, phone, date, time, guests, occasion, requests)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['name'], data['phone'], data['date'], data['time'],
            data['guests'], data.get('occasion', ''), data.get('requests', '')
        ))
        conn.commit()
        return jsonify({'success': True, 'message': 'Reservation confirmed! We will call you shortly.'}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    """Admin endpoint — protect with auth in production"""
    conn = get_db()
    rows = conn.execute('SELECT * FROM reservations ORDER BY created_at DESC').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

# ── CONTACT ──
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    required = ['name', 'email', 'message']
    for field in required:
        if not data.get(field):
            return jsonify({'success': False, 'error': f'{field} is required'}), 400

    conn = get_db()
    try:
        conn.execute('''
            INSERT INTO contacts (name, email, phone, message)
            VALUES (?, ?, ?, ?)
        ''', (data['name'], data['email'], data.get('phone', ''), data['message']))
        conn.commit()
        return jsonify({'success': True, 'message': 'Message received! We\'ll reply within 24 hours.'}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

# ── AUTH ──
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not all([data.get('name'), data.get('email'), data.get('password')]):
        return jsonify({'success': False, 'error': 'Name, email and password required'}), 400

    conn = get_db()
    try:
        conn.execute('''
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
        ''', (data['name'], data['email'], hash_password(data['password'])))
        conn.commit()
        return jsonify({'success': True, 'message': 'Account created! Welcome to Thamaq!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'error': 'Email already registered'}), 409
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not all([data.get('email'), data.get('password')]):
        return jsonify({'success': False, 'error': 'Email and password required'}), 400

    conn = get_db()
    user = conn.execute(
        'SELECT * FROM users WHERE email = ? AND password_hash = ?',
        (data['email'], hash_password(data['password']))
    ).fetchone()
    conn.close()

    if user:
        return jsonify({
            'success': True,
            'user': {'id': user['id'], 'name': user['name'], 'email': user['email']}
        })
    return jsonify({'success': False, 'error': 'Invalid email or password'}), 401

# ── MENU API ──
MENU_DATA = {
    "indian": [
        {"id": 1, "name": "Chicken Biryani", "price": 320, "description": "Aromatic basmati, tender chicken, golden saffron", "veg": False, "bestseller": True},
        {"id": 2, "name": "Mutton Biryani", "price": 380, "description": "Slow-cooked mutton with whole spices", "veg": False},
        {"id": 3, "name": "Butter Chicken", "price": 340, "description": "Silky tomato-cream gravy with tandoor chicken", "veg": False},
        {"id": 4, "name": "Paneer Tikka", "price": 280, "description": "Char-grilled paneer marinated in yogurt & spices", "veg": True},
        {"id": 5, "name": "Tandoori Mixed Platter", "price": 560, "description": "Seekh kebab, chicken tikka & reshmi kebab", "veg": False, "bestseller": True},
    ],
    "arabian": [
        {"id": 6, "name": "Alfaham Grilled Chicken", "price": 450, "description": "Whole chicken with Arabic spice blend, charcoal grilled", "veg": False, "bestseller": True},
        {"id": 7, "name": "Arabic Grilled Fish", "price": 520, "description": "Fresh pomfret with lemon, herbs & Arabian marinade", "veg": False},
    ],
    "chinese": [
        {"id": 8, "name": "Manchow Soup", "price": 180, "description": "Hot & sour broth with crispy noodles & veggies", "veg": False},
        {"id": 9, "name": "Chilli Chicken", "price": 280, "description": "Crispy fried chicken in fiery Indo-Chinese sauce", "veg": False},
        {"id": 10, "name": "Veg Hakka Noodles", "price": 200, "description": "Stir-fried noodles with crisp vegetables & soy sauce", "veg": True},
    ],
    "continental": [
        {"id": 11, "name": "Penne Arrabiata", "price": 240, "description": "Penne in spicy tomato-garlic sauce with fresh herbs", "veg": True},
        {"id": 12, "name": "Creamy Chicken Pasta", "price": 290, "description": "Al dente pasta in rich cream-mushroom sauce", "veg": False},
    ]
}

@app.route('/api/menu', methods=['GET'])
def get_menu():
    category = request.args.get('category', 'all')
    if category == 'all':
        return jsonify(MENU_DATA)
    elif category in MENU_DATA:
        return jsonify({category: MENU_DATA[category]})
    return jsonify({'error': 'Category not found'}), 404

# ── ORDERS ──
@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.get_json()
    if not data.get('items') or not data.get('total'):
        return jsonify({'success': False, 'error': 'Items and total required'}), 400

    import json
    conn = get_db()
    try:
        conn.execute('''
            INSERT INTO orders (user_id, items, total)
            VALUES (?, ?, ?)
        ''', (data.get('user_id'), json.dumps(data['items']), data['total']))
        conn.commit()
        return jsonify({'success': True, 'message': 'Order placed! Preparing your food...'}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        conn.close()

# ── ADMIN DASHBOARD ──
@app.route('/admin')
def admin():
    return send_from_directory('.', 'admin.html')

@app.route('/api/admin/stats', methods=['GET'])
def admin_stats():
    conn = get_db()
    stats = {
        'total_reservations': conn.execute('SELECT COUNT(*) FROM reservations').fetchone()[0],
        'pending_reservations': conn.execute("SELECT COUNT(*) FROM reservations WHERE status='pending'").fetchone()[0],
        'total_users': conn.execute('SELECT COUNT(*) FROM users').fetchone()[0],
        'total_orders': conn.execute('SELECT COUNT(*) FROM orders').fetchone()[0],
        'total_messages': conn.execute('SELECT COUNT(*) FROM contacts').fetchone()[0],
    }
    conn.close()
    return jsonify(stats)

# ══════════════════════ RUN ══════════════════════
if __name__ == '__main__':
    init_db()
    print("🍽️  Thamaq Restaurant Backend Running!")
    print("📍  http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
