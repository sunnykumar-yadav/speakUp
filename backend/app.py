import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import init_db

from routes.auth_routes import auth_bp
from routes.assessment_routes import assessment_bp
from routes.conversation_routes import conversation_bp
from routes.grammar_routes import grammar_bp
from routes.sentence_routes import sentence_bp
from routes.progress_routes import progress_bp
from routes.learning_plan_routes import plan_bp
from routes.settings_routes import settings_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for Vite frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize Database tables and seed initial grammar topics
    with app.app_context():
        init_db()

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(assessment_bp)
    app.register_blueprint(conversation_bp)
    app.register_blueprint(grammar_bp)
    app.register_blueprint(sentence_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(plan_bp)
    app.register_blueprint(settings_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "SpeakUp AI Backend Engine",
            "version": "1.0.0"
        })

    return app

if __name__ == "__main__":
    app = create_app()
    port = Config.PORT
    print(f"SpeakUp AI Backend running on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=Config.DEBUG)
