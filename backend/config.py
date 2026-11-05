import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend root or parent
backend_dir = Path(__file__).resolve().parent
load_dotenv(backend_dir / ".env")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "speakup-ai-super-secret-key-2026-prod-ready")
    DATABASE_PATH = os.getenv("DATABASE_PATH", str(backend_dir / "speakup_ai.db"))
    
    # AI API keys
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    
    # Preferred provider: 'auto', 'gemini', 'groq', 'openai', 'demo'
    AI_PROVIDER = os.getenv("AI_PROVIDER", "auto")
    
    # Server settings
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
