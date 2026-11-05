import os
from flask import Blueprint, request, jsonify
from services.ai_service import ai_service
from config import Config

settings_bp = Blueprint("settings", __name__, url_prefix="/api/settings")

@settings_bp.route("/ai-status", methods=["GET"])
def get_ai_status():
    return jsonify(ai_service.get_status())

@settings_bp.route("/save-keys", methods=["POST"])
def save_keys():
    data = request.get_json() or {}
    gemini_key = data.get("gemini_key")
    groq_key = data.get("groq_key")
    openai_key = data.get("openai_key")
    preferred_provider = data.get("preferred_provider", "auto")

    ai_service.update_keys(
        gemini_key=gemini_key,
        groq_key=groq_key,
        openai_key=openai_key,
        preferred_provider=preferred_provider
    )

    return jsonify({
        "message": "AI settings updated successfully",
        "status": ai_service.get_status()
    })
