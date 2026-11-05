import json
import datetime
from flask import Blueprint, request, jsonify
from database import get_db_connection
from services.ai_service import ai_service
from routes.auth_routes import get_current_user_id

conversation_bp = Blueprint("conversation", __name__, url_prefix="/api/conversation")

SCENARIOS = [
    {
        "id": "daily_chat",
        "title": "Daily Casual Chat",
        "role": "Friendly Companion",
        "icon": "MessageCircle",
        "description": "Talk freely about your day, hobbies, movies, and thoughts with zero pressure.",
        "starter_message": "Hello! I am your SpeakUp AI coach. What's on your mind today? Tell me how your day has been going so far!"
    },
    {
        "id": "job_interview",
        "title": "Job Interview Practice",
        "role": "Hiring Manager",
        "icon": "Briefcase",
        "description": "Practice answering real interview questions: self-introduction, career strengths, and challenges.",
        "starter_message": "Good day! Welcome to our interview session. Let's start with a classic question: Could you please introduce yourself and mention your key professional strengths?"
    },
    {
        "id": "ordering_cafe",
        "title": "Cafe & Restaurant Order",
        "role": "Barista / Waiter",
        "icon": "Coffee",
        "description": "Practice ordering food, asking about ingredients, customization, and paying the bill.",
        "starter_message": "Welcome to Starbucks! What can I get started for you today?"
    },
    {
        "id": "introducing_yourself",
        "title": "Introducing Yourself",
        "role": "Networking Partner",
        "icon": "Users",
        "description": "Master self-introductions in social and business environments without saying 'Myself Rahul'.",
        "starter_message": "Hi there! I don't think we've met yet. My name is Alex. What is your name, and where are you from?"
    },
    {
        "id": "workplace_meeting",
        "title": "Workplace Team Meeting",
        "role": "Team Lead",
        "icon": "Laptop",
        "description": "Give status updates, discuss blockers, and express opinions politely in meetings.",
        "starter_message": "Good morning team. Thanks for joining today's standup. Could you share your quick update on yesterday's tasks?"
    },
    {
        "id": "asking_directions",
        "title": "Travel & Asking Directions",
        "role": "Local City Guide",
        "icon": "MapPin",
        "description": "Ask polite questions when lost in a new city, metro station, or airport.",
        "starter_message": "Excuse me! You look like you might need some assistance. Are you looking for the terminal or the metro station?"
    }
]

@conversation_bp.route("/scenarios", methods=["GET"])
def get_scenarios():
    return jsonify({"scenarios": SCENARIOS})

@conversation_bp.route("/send", methods=["POST"])
def send_message():
    user_id = get_current_user_id(request)
    data = request.get_json() or {}
    message_text = data.get("message", "").strip()
    scenario_id = data.get("scenario_id", "daily_chat")
    conversation_id = data.get("conversation_id")
    student_level = data.get("student_level", "Beginner (A1)")

    if not message_text:
        return jsonify({"error": "Message cannot be empty"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Create or retrieve conversation
    if not conversation_id:
        scenario_title = next((s["title"] for s in SCENARIOS if s["id"] == scenario_id), "Speaking Practice")
        cursor.execute("""
            INSERT INTO conversations (user_id, scenario_id, title)
            VALUES (?, ?, ?)
        """, (user_id, scenario_id, scenario_title))
        conversation_id = cursor.lastrowid

    # Record user message
    cursor.execute("""
        INSERT INTO conversation_messages (conversation_id, sender, text)
        VALUES (?, 'student', ?)
    """, (conversation_id, message_text))

    # Fetch recent history
    cursor.execute("""
        SELECT sender, text FROM conversation_messages
        WHERE conversation_id = ?
        ORDER BY id DESC LIMIT 6
    """, (conversation_id,))
    history_rows = cursor.fetchall()
    history = [{"sender": r["sender"], "text": r["text"]} for r in reversed(history_rows)]

    # Generate AI Coach Response
    ai_res = ai_service.generate_chat_response(
        user_message=message_text,
        scenario=scenario_id,
        conversation_history=history,
        student_level=student_level
    )

    # Record AI message with feedback
    cursor.execute("""
        INSERT INTO conversation_messages (
            conversation_id, sender, text, corrected_sentence, explanation,
            repeat_prompt, mistakes_json
        ) VALUES (?, 'ai', ?, ?, ?, ?, ?)
    """, (
        conversation_id,
        ai_res.get("teacher_reply", ""),
        ai_res.get("corrected_sentence"),
        ai_res.get("explanation_hinglish"),
        ai_res.get("repeat_prompt"),
        json.dumps({"has_mistake": ai_res.get("has_mistake"), "topic_tag": ai_res.get("topic_tag")})
    ))
    ai_message_id = cursor.lastrowid

    # If mistake detected, save to student memory
    if ai_res.get("has_mistake") and ai_res.get("topic_tag"):
        cursor.execute("""
            INSERT INTO student_memory (user_id, memory_type, content, count)
            VALUES (?, 'repeated_mistake', ?, 1)
        """, (user_id, f"{ai_res.get('topic_tag')}: {message_text[:60]}"))

    # Update daily speaking minutes (+2 minutes estimated per interaction)
    today = datetime.date.today().isoformat()
    cursor.execute("""
        INSERT INTO daily_logs (user_id, log_date, speaking_minutes, accuracy_rate)
        VALUES (?, ?, 2, 85)
        ON CONFLICT(user_id, log_date) DO UPDATE SET
            speaking_minutes = speaking_minutes + 2
    """, (user_id, today))

    conn.commit()
    conn.close()

    return jsonify({
        "conversation_id": conversation_id,
        "message_id": ai_message_id,
        "reply": ai_res.get("teacher_reply"),
        "has_mistake": ai_res.get("has_mistake", False),
        "corrected_sentence": ai_res.get("corrected_sentence"),
        "explanation": ai_res.get("explanation_hinglish"),
        "repeat_prompt": ai_res.get("repeat_prompt"),
        "topic_tag": ai_res.get("topic_tag"),
        "provider": ai_res.get("provider", "demo")
    })

@conversation_bp.route("/history/<int:conv_id>", methods=["GET"])
def get_history(conv_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM conversation_messages
        WHERE conversation_id = ?
        ORDER BY id ASC
    """, (conv_id,))
    messages = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return jsonify({"messages": messages})

@conversation_bp.route("/explain-mistake", methods=["POST"])
def explain_mistake():
    data = request.get_json() or {}
    student_text = data.get("student_text", "")
    corrected = data.get("corrected_sentence", "")
    topic_tag = data.get("topic_tag", "Grammar")

    explanation = (
        f"In spoken English, we say '{corrected}' instead of '{student_text}'.\n\n"
        f"💡 Hinglish Explanation: जब हम हिंदी से सीधे दिमाग में अनुवाद करते हैं, "
        f"तो वाक्य संरचना या Helping Verb में गड़बड़ी हो जाती है। "
        f"{topic_tag} के नियम के अनुसार इसे बोलने से आपकी बात एकदम स्वाभाविक लगेगी।\n\n"
        f"Try saying it slowly 3 times to train your vocal cords!"
    )
    return jsonify({"explanation": explanation})
