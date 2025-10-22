# Vercel FastAPI Entry Point
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app

# Vercel handler
def handler(request):
    return app(request.environ, lambda status, headers: None)