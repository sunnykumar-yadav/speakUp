import hashlib
import secrets
import json
from flask import Blueprint, request, jsonify
from database import get_db_connection

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

def hash_password(password: str, salt: str = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return f"{salt}${hashed}", salt

def verify_password(stored_hash: str, password: str) -> bool:
    try:
        salt, _ = stored_hash.split("$", 1)
        check_hash, _ = hash_password(password, salt)
        return secrets.compare_digest(stored_hash, check_hash)
    except Exception:
        return False

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    english_level = data.get("english_level", "Beginner (A1)")

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"error": "An account with this email already exists"}), 409

    pwd_hash, _ = hash_password(password)
    cursor.execute("""
        INSERT INTO users (name, email, password_hash, english_level, target_minutes, preferred_language)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (name, email, pwd_hash, english_level, 30, "Hinglish"))
    conn.commit()

    user_id = cursor.lastrowid
    
    # Initialize basic learning plan for user
    init_user_defaults(cursor, user_id)
    conn.commit()
    conn.close()

    # Generate token
    token = f"user_{user_id}_{secrets.token_hex(24)}"
    return jsonify({
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "english_level": english_level,
            "target_minutes": 30,
            "preferred_language": "Hinglish"
        }
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, password_hash, english_level, target_minutes, preferred_language FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user or not verify_password(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = f"user_{user['id']}_{secrets.token_hex(24)}"
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "english_level": user["english_level"],
            "target_minutes": user["target_minutes"],
            "preferred_language": user["preferred_language"]
        }
    })

@auth_bp.route("/profile", methods=["GET"])
def get_profile():
    user_id = get_current_user_id(request)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, english_level, target_minutes, preferred_language, created_at FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    
    # Fetch latest assessment
    cursor.execute("SELECT overall_score, cefr_level, created_at FROM assessments WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,))
    latest_assessment = cursor.fetchone()
    
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "english_level": user["english_level"],
            "target_minutes": user["target_minutes"],
            "preferred_language": user["preferred_language"],
            "created_at": user["created_at"],
            "latest_assessment": dict(latest_assessment) if latest_assessment else None
        }
    })

@auth_bp.route("/update", methods=["PUT"])
def update_profile():
    user_id = get_current_user_id(request)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json() or {}
    name = data.get("name")
    target_minutes = data.get("target_minutes")
    preferred_language = data.get("preferred_language")
    english_level = data.get("english_level")

    conn = get_db_connection()
    cursor = conn.cursor()

    if name:
        cursor.execute("UPDATE users SET name = ? WHERE id = ?", (name, user_id))
    if target_minutes is not None:
        cursor.execute("UPDATE users SET target_minutes = ? WHERE id = ?", (int(target_minutes), user_id))
    if preferred_language:
        cursor.execute("UPDATE users SET preferred_language = ? WHERE id = ?", (preferred_language, user_id))
    if english_level:
        cursor.execute("UPDATE users SET english_level = ? WHERE id = ?", (english_level, user_id))

    conn.commit()
    cursor.execute("SELECT id, name, email, english_level, target_minutes, preferred_language FROM users WHERE id = ?", (user_id,))
    updated_user = cursor.fetchone()
    conn.close()

    return jsonify({"message": "Profile updated", "user": dict(updated_user)})

def get_current_user_id(req):
    auth_header = req.headers.get("Authorization", "")
    if auth_header.startswith("Bearer user_"):
        parts = auth_header.replace("Bearer ", "").split("_")
        if len(parts) >= 2 and parts[1].isdigit():
            return int(parts[1])
    # Fallback for demo guest
    return 1

def init_user_defaults(cursor, user_id):
    # Seed today's learning plan tasks
    import datetime
    today = datetime.date.today().isoformat()
    tasks = [
        ("grammar", "Complete Lesson: Is, Am, Are vs Action Verbs", 10, "/grammar/is-am-are"),
        ("sentence", "Sentence Builder: Hindi to Natural English", 10, "/sentence-builder"),
        ("speaking", "AI Speaking Room: Daily Routine Scenario", 15, "/speaking-room"),
        ("revision", "Review Weak Topics & Vocabulary Cards", 5, "/progress")
    ]
    for task_type, title, duration, route in tasks:
        cursor.execute("""
            INSERT INTO learning_plan_tasks (user_id, plan_date, task_type, title, duration_minutes, action_route, is_completed)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        """, (user_id, today, task_type, title, duration, route))
