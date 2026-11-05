import json
from flask import Blueprint, request, jsonify
from database import get_db_connection
from services.assessment_engine import assessment_engine
from routes.auth_routes import get_current_user_id

assessment_bp = Blueprint("assessment", __name__, url_prefix="/api/assessment")

@assessment_bp.route("/questions", methods=["GET"])
def get_questions():
    questions = assessment_engine.get_questions()
    return jsonify({"questions": questions})

@assessment_bp.route("/submit", methods=["POST"])
def submit_assessment():
    user_id = get_current_user_id(request)
    data = request.get_json() or {}
    answers = data.get("answers", {})

    if not answers:
        return jsonify({"error": "No answers provided"}), 400

    report = assessment_engine.evaluate_submission(answers)

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO assessments (
            user_id, overall_score, cefr_level, grammar_score, vocab_score,
            tenses_score, confidence_score, speaking_score, strengths_json,
            weaknesses_json, recommendations_json, answers_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        report["overall_score"],
        report["cefr_level"],
        report["grammar_score"],
        report["vocab_score"],
        report["tenses_score"],
        report["confidence_score"],
        report["speaking_score"],
        json.dumps(report["strengths"]),
        json.dumps(report["weaknesses"]),
        json.dumps(report["recommendations"]),
        json.dumps(answers)
    ))

    # Update user's CEFR level
    cursor.execute("UPDATE users SET english_level = ? WHERE id = ?", (report["cefr_level"], user_id))

    # Store any critical weak topics into student_memory
    for weakness in report["weaknesses"]:
        cursor.execute("""
            INSERT INTO student_memory (user_id, memory_type, content, count)
            VALUES (?, 'weak_topic', ?, 1)
        """, (user_id, weakness))

    conn.commit()
    report["assessment_id"] = cursor.lastrowid
    conn.close()

    return jsonify({"message": "Assessment completed successfully", "report": report})

@assessment_bp.route("/latest", methods=["GET"])
def get_latest_assessment():
    user_id = get_current_user_id(request)
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM assessments WHERE user_id = ? ORDER BY id DESC LIMIT 1
    """, (user_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"assessment": None})

    data = dict(row)
    data["strengths"] = json.loads(data["strengths_json"] or "[]")
    data["weaknesses"] = json.loads(data["weaknesses_json"] or "[]")
    data["recommendations"] = json.loads(data["recommendations_json"] or "[]")
    data["limitations_disclaimer"] = (
        "Assessment Limitations Note: This diagnostic provides a structured snapshot of sentence formation, "
        "grammatical concord, and baseline verbal fluency. Spontaneous conversational resilience develops "
        "through consistent, pressure-free daily practice."
    )

    return jsonify({"assessment": data})
