import json
import datetime
from flask import Blueprint, request, jsonify
from database import get_db_connection
from routes.auth_routes import get_current_user_id

grammar_bp = Blueprint("grammar", __name__, url_prefix="/api/grammar")

@grammar_bp.route("/topics", methods=["GET"])
def get_topics():
    user_id = get_current_user_id(request)
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT gt.id, gt.slug, gt.title, gt.hindi_title, gt.description_hindi,
               gt.description_english, gt.key_rule, gt.common_mistake, gt.icon, gt.level,
               COALESCE(ugp.completed, 0) as is_completed,
               COALESCE(ugp.quiz_score, 0) as quiz_score,
               COALESCE(ugp.speaking_completed, 0) as speaking_completed
        FROM grammar_topics gt
        LEFT JOIN user_grammar_progress ugp ON gt.id = ugp.topic_id AND ugp.user_id = ?
        ORDER BY gt.id ASC
    """, (user_id,))
    
    rows = cursor.fetchall()
    conn.close()

    topics = [dict(r) for r in rows]
    return jsonify({"topics": topics})

@grammar_bp.route("/topic/<slug_or_id>", methods=["GET"])
def get_topic_detail(slug_or_id):
    user_id = get_current_user_id(request)
    conn = get_db_connection()
    cursor = conn.cursor()

    if slug_or_id.isdigit():
        cursor.execute("SELECT * FROM grammar_topics WHERE id = ?", (int(slug_or_id),))
    else:
        cursor.execute("SELECT * FROM grammar_topics WHERE slug = ?", (slug_or_id,))

    topic = cursor.fetchone()
    if not topic:
        conn.close()
        return jsonify({"error": "Topic not found"}), 404

    topic_dict = dict(topic)
    topic_dict["content"] = json.loads(topic["content_json"])

    # Fetch user progress for this topic
    cursor.execute("""
        SELECT completed, quiz_score, speaking_completed
        FROM user_grammar_progress
        WHERE user_id = ? AND topic_id = ?
    """, (user_id, topic_dict["id"]))
    progress = cursor.fetchone()
    conn.close()

    topic_dict["progress"] = dict(progress) if progress else {"completed": 0, "quiz_score": 0, "speaking_completed": 0}
    return jsonify({"topic": topic_dict})

@grammar_bp.route("/submit-quiz", methods=["POST"])
def submit_quiz():
    user_id = get_current_user_id(request)
    data = request.get_json() or {}
    topic_id = data.get("topic_id")
    score = float(data.get("score", 0))

    if not topic_id:
        return jsonify({"error": "topic_id required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO user_grammar_progress (user_id, topic_id, completed, quiz_score, last_practiced)
        VALUES (?, ?, 1, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, topic_id) DO UPDATE SET
            completed = 1,
            quiz_score = MAX(quiz_score, excluded.quiz_score),
            last_practiced = CURRENT_TIMESTAMP
    """, (user_id, topic_id, score))

    # Log progress for today
    today = datetime.date.today().isoformat()
    cursor.execute("""
        INSERT INTO daily_logs (user_id, log_date, grammar_minutes, lessons_completed, accuracy_rate)
        VALUES (?, ?, 10, 1, ?)
        ON CONFLICT(user_id, log_date) DO UPDATE SET
            grammar_minutes = grammar_minutes + 10,
            lessons_completed = lessons_completed + 1,
            accuracy_rate = (accuracy_rate + excluded.accuracy_rate) / 2
    """, (user_id, today, score))

    conn.commit()
    conn.close()

    return jsonify({"message": "Quiz recorded", "score": score, "completed": True})

@grammar_bp.route("/submit-speaking", methods=["POST"])
def submit_speaking():
    user_id = get_current_user_id(request)
    data = request.get_json() or {}
    topic_id = data.get("topic_id")
    expected_text = data.get("expected_text", "").lower().strip()
    spoken_transcript = data.get("spoken_transcript", "").lower().strip()

    if not topic_id:
        return jsonify({"error": "topic_id required"}), 400

    # Calculate word overlap match
    expected_words = set(expected_text.replace(".", "").replace(",", "").split())
    spoken_words = set(spoken_transcript.replace(".", "").replace(",", "").split())
    
    if not expected_words:
        match_pct = 100
    else:
        overlap = len(expected_words.intersection(spoken_words))
        match_pct = round((overlap / len(expected_words)) * 100, 1)

    passed = match_pct >= 60

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO user_grammar_progress (user_id, topic_id, speaking_completed, last_practiced)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, topic_id) DO UPDATE SET
            speaking_completed = CASE WHEN ? THEN 1 ELSE speaking_completed END,
            last_practiced = CURRENT_TIMESTAMP
    """, (user_id, topic_id, 1 if passed else 0, passed))

    conn.commit()
    conn.close()

    feedback = "Fantastic pronunciation and clear rhythm!" if passed else "Good effort! Listen to the pronunciation guide and try one more time."

    return jsonify({
        "passed": passed,
        "match_percentage": match_pct,
        "feedback": feedback,
        "spoken_transcript": spoken_transcript
    })
