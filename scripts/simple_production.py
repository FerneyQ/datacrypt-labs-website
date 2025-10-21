#!/usr/bin/env python3
"""
DataCrypt Labs - Simple Production Server
Filosofía Mejora Continua - Servidor simplificado para demostración
"""

import uvicorn
import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

def setup_production_environment():
    """Configurar variables de entorno de producción"""
    os.environ["PRODUCTION"] = "true"
    os.environ["API_HOST"] = "0.0.0.0"
    os.environ["API_PORT"] = "8000"
    os.environ["LOG_LEVEL"] = "ERROR"  # Reduce logging to avoid emoji issues
    os.environ["DATABASE_URL"] = "sqlite:///./data/datacrypt_production.db"
    
    # CORS para producción local
    os.environ["ALLOWED_ORIGINS"] = '["*"]'  # Allow all for demo
    
    print("Production environment configured")

def main():
    """Ejecutar servidor de producción"""
    print("Starting DataCrypt Labs in PRODUCTION mode...")
    print("=" * 60)
    
    # Setup production environment
    setup_production_environment()
    
    # Server configuration for production
    config = {
        "app": "main:app",
        "host": "0.0.0.0",
        "port": 8000,
        "workers": 1,
        "log_level": "error",  # Reduce logging
        "access_log": False,   # Disable access log to avoid emoji issues
        "reload": False,
        "server_header": False,
        "date_header": False,
    }
    
    print("Server configuration:")
    print(f"   • Host: {config['host']}")
    print(f"   • Port: {config['port']}")
    print("=" * 60)
    print("Available URLs:")
    print(f"   • Main Application: http://localhost:8000/")
    print(f"   • API Documentation: http://localhost:8000/docs")
    print(f"   • Health Check: http://localhost:8000/health")
    print(f"   • Data Wizard Game: http://localhost:8000/game.html")
    print("=" * 60)
    
    # Start the server
    try:
        uvicorn.run(**config)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error running server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()