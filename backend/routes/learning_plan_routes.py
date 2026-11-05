import datetime
from flask import Blueprint, request, jsonify
from database import get_db_connection
from routes.auth_routes import get_current_user_id

plan_bp = Blueprint("learning_plan", __name__, url_prefix="/api/learning-plan")

@plan_bp.route("/daily", methods=["GET"])
def get_daily_plan():
    user_id = get_current_user_id(request)
    today = datetime.date.today().isoformat()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, task_type, title, duration_minutes, action_route, is_completed
        FROM learning_plan_tasks
        WHERE user_id = ? AND plan_date = ?
        ORDER BY id ASC
    """, (user_id, today))
    tasks = [dict(r) for r in cursor.fetchall()]

    # If no tasks for today, generate standard 40-minute balanced plan
    if not tasks:
        default_tasks = [
            ("grammar", "10 Mins: Lesson on 'Past Simple vs Continuous'", 10, "/grammar/past-simple"),
            ("sentence", "10 Mins: Hindi-to-English Sentence Builder Practice", 10, "/sentence-builder"),
            ("speaking", "15 Mins: AI Speaking Room — Practice Cafe Scenario", 15, "/speaking-room"),
            ("revision", "5 Mins: Review Common Mistakes & Repeat Sentences", 5, "/progress")
        ]
        for task_type, title, duration, route in default_tasks:
            cursor.execute("""
                INSERT INTO learning_plan_tasks (user_id, plan_date, task_type, title, duration_minutes, action_route, is_completed)
                VALUES (?, ?, ?, ?, ?, ?, 0)
            """, (user_id, today, task_type, title, duration, route))
        conn.commit()

        cursor.execute("""
            SELECT id, task_type, title, duration_minutes, action_route, is_completed
            FROM learning_plan_tasks
            WHERE user_id = ? AND plan_date = ?
            ORDER BY id ASC
        """, (user_id, today))
        tasks = [dict(r) for r in cursor.fetchall()]

    conn.close()

    completed_count = sum(1 for t in tasks if t["is_completed"])
    total_minutes = sum(t["duration_minutes"] for t in tasks)

    return jsonify({
        "plan_date": today,
        "tasks": tasks,
        "completed_count": completed_count,
        "total_tasks": len(tasks),
        "total_minutes": total_minutes,
        "estimated_timeline": "Estimated timeline to reach Conversational B1: 8–12 weeks with 30-40 daily active minutes."
    })

@plan_bp.route("/toggle-task/<int:task_id>", methods=["POST"])
def toggle_task(task_id):
    user_id = get_current_user_id(request)
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT is_completed FROM learning_plan_tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({"error": "Task not found"}), 404

    new_status = 0 if row["is_completed"] else 1
    cursor.execute("UPDATE learning_plan_tasks SET is_completed = ? WHERE id = ?", (new_status, task_id))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "is_completed": bool(new_status)})
