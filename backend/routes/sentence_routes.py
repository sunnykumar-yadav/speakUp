import datetime
from flask import Blueprint, request, jsonify
from database import get_db_connection
from services.sentence_engine import sentence_engine
from routes.auth_routes import get_current_user_id

sentence_bp = Blueprint("sentence", __name__, url_prefix="/api/sentence-builder")

@sentence_bp.route("/presets", methods=["GET"])
def get_presets():
    presets = sentence_engine.get_preset_sentences()
    return jsonify({"presets": presets})

@sentence_bp.route("/translate", methods=["POST"])
def translate_sentence():
    user_id = get_current_user_id(request)
    data = request.get_json() or {}
    hindi_text = data.get("hindi_sentence", "").strip()

    if not hindi_text:
        return jsonify({"error": "Please provide a sentence in Hindi or Hinglish"}), 400

    result = sentence_engine.build_sentence(hindi_text)

    # Log sentence practice minutes
    today = datetime.date.today().isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO daily_logs (user_id, log_date, sentence_minutes)
        VALUES (?, ?, 5)
        ON CONFLICT(user_id, log_date) DO UPDATE SET
            sentence_minutes = sentence_minutes + 5
    """, (user_id, today))
    conn.commit()
    conn.close()

    return jsonify({"result": result})

@sentence_bp.route("/verify", methods=["POST"])
def verify_challenge():
    data = request.get_json() or {}
    challenge_prompt = data.get("challenge", "")
    student_answer = data.get("student_answer", "").strip()

    if not student_answer:
        return jsonify({"error": "Please provide your answer"}), 400

    feedback = sentence_engine.verify_challenge_attempt(challenge_prompt, student_answer)
    return jsonify(feedback)
