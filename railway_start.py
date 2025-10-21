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
    
    # Railway provides PORT environment variable - CRITICAL for Railway deployment
    # Railway REQUIRES the app to listen on the exact port provided
    port_env = os.environ.get("PORT")
    if port_env:
        port = int(port_env)
        print(f"✅ Railway PORT detected: {port}")
    else:
        port = 8000
        print(f"⚠️ No Railway PORT env var - using default: {port}")
    
    print(f"🔧 Starting server on HOST: 0.0.0.0, PORT: {port}")
    print(f"🌍 All environment variables: PORT={os.environ.get('PORT', 'NONE')}")
    
    # Test import before starting server
    try:
        print("🧪 Testing backend import...")
        from backend.main import app
        print("✅ Backend imported successfully!")
    except Exception as e:
        print(f"❌ CRITICAL: Backend import failed: {e}")
        print("🔍 Python path:", sys.path)
        return
    
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
    
    print(f"🚀 DataCrypt Labs Railway Deploy v2.1 - Starting on port {port}")
    print("📍 Available endpoints:")
    print(f"   • Main: https://your-app.railway.app/")
    print(f"   • API Docs: https://your-app.railway.app/docs")
    print(f"   • Health: https://your-app.railway.app/health")
    print(f"   • Game: https://your-app.railway.app/game.html")
    print(f"🔧 Railway Environment: {os.environ.get('RAILWAY_ENVIRONMENT', 'Not detected')}")
    print(f"🌍 All Environment Variables loaded successfully")
    
    # Start server
    uvicorn.run(**config)

if __name__ == "__main__":
    main()