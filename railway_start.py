#!/usr/bin/env python3
"""
🚀 DataCrypt Labs - Railway Deployment Starter
Filosofía Mejora Continua - Inicio optimizado para Railway.app
"""

import os
import uvicorn
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

def main():
    """Ejecutar servidor optimizado para Railway"""
    
    # Railway provides PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    
    # Configuration for Railway deployment
    config = {
        "app": "backend.main:app",
        "host": "0.0.0.0", 
        "port": port,
        "workers": 1,
        "log_level": "info",
        "access_log": True,
        "reload": False,
        "server_header": False,
        "date_header": False,
    }
    
    print(f"🚀 Starting DataCrypt Labs on port {port}")
    print("📍 Available endpoints:")
    print(f"   • Main: https://your-app.railway.app/")
    print(f"   • Docs: https://your-app.railway.app/docs")
    print(f"   • Game: https://your-app.railway.app/game.html")
    
    # Start server
    uvicorn.run(**config)

if __name__ == "__main__":
    main()