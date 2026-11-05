import sys
import os
from pathlib import Path

# Add backend directory to Python sys.path
root_dir = Path(__file__).resolve().parent.parent
backend_dir = root_dir / "backend"
sys.path.insert(0, str(backend_dir))

from app import create_app

app = create_app()
