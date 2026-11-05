import sqlite3
import json
from pathlib import Path
from config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Enable foreign keys
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        english_level TEXT DEFAULT 'Beginner (A1)',
        target_minutes INTEGER DEFAULT 30,
        preferred_language TEXT DEFAULT 'Hinglish',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # Assessments table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        overall_score REAL NOT NULL,
        cefr_level TEXT NOT NULL,
        grammar_score REAL,
        vocab_score REAL,
        tenses_score REAL,
        confidence_score REAL,
        speaking_score REAL,
        strengths_json TEXT,
        weaknesses_json TEXT,
        recommendations_json TEXT,
        answers_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """)
    
    # Conversations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        scenario_id TEXT NOT NULL DEFAULT 'daily_chat',
        title TEXT NOT NULL DEFAULT 'Conversation Practice',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """)
    
    # Conversation Messages table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS conversation_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender TEXT NOT NULL, -- 'student' or 'ai'
        text TEXT NOT NULL,
        corrected_sentence TEXT,
        explanation TEXT,
        mistakes_json TEXT,
        repeat_prompt TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
    );
    """)
    
    # Grammar Topics
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS grammar_topics (
        id INTEGER PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        hindi_title TEXT NOT NULL,
        description_hindi TEXT NOT NULL,
        description_english TEXT NOT NULL,
        key_rule TEXT NOT NULL,
        common_mistake TEXT NOT NULL,
        icon TEXT NOT NULL,
        level TEXT NOT NULL,
        content_json TEXT NOT NULL
    );
    """)
    
    # User Grammar Progress
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_grammar_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        topic_id INTEGER NOT NULL,
        completed INTEGER DEFAULT 0,
        quiz_score REAL DEFAULT 0,
        speaking_completed INTEGER DEFAULT 0,
        last_practiced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, topic_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (topic_id) REFERENCES grammar_topics (id) ON DELETE CASCADE
    );
    """)
    
    # Daily logs for progress tracking
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS daily_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        log_date TEXT NOT NULL,
        speaking_minutes INTEGER DEFAULT 0,
        grammar_minutes INTEGER DEFAULT 0,
        sentence_minutes INTEGER DEFAULT 0,
        accuracy_rate REAL DEFAULT 0,
        lessons_completed INTEGER DEFAULT 0,
        UNIQUE(user_id, log_date),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """)
    
    # Daily learning plan tasks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS learning_plan_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        plan_date TEXT NOT NULL,
        task_type TEXT NOT NULL,
        title TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        action_route TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """)
    
    # AI Student Memory (repeated mistakes, weaknesses, preferences)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        memory_type TEXT NOT NULL, -- 'repeated_mistake', 'weak_topic', 'vocabulary_struggle', 'speaking_note'
        content TEXT NOT NULL,
        count INTEGER DEFAULT 1,
        last_noted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """)
    
    conn.commit()
    seed_grammar_topics(cursor, conn)
    conn.close()

def seed_grammar_topics(cursor, conn):
    # Check if topics already exist
    cursor.execute("SELECT COUNT(*) FROM grammar_topics")
    count = cursor.fetchone()[0]
    if count >= 14:
        return
        
    # The 14 official grammar topics with comprehensive Hinglish & English lessons
    from data.grammar_data import GRAMMAR_TOPICS_DATA
    for topic in GRAMMAR_TOPICS_DATA:
        cursor.execute("""
        INSERT OR REPLACE INTO grammar_topics (
            id, slug, title, hindi_title, description_hindi, description_english,
            key_rule, common_mistake, icon, level, content_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            topic["id"],
            topic["slug"],
            topic["title"],
            topic["hindi_title"],
            topic["description_hindi"],
            topic["description_english"],
            topic["key_rule"],
            topic["common_mistake"],
            topic["icon"],
            topic["level"],
            json.dumps(topic["content"], ensure_ascii=False)
        ))
    conn.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
