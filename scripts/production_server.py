#!/usr/bin/env python3
"""
🚀 DataCrypt Labs - Production Simulation Server
Filosofía Mejora Continua - Simulación de entorno de producción
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
    os.environ["LOG_LEVEL"] = "INFO"
    os.environ["DATABASE_URL"] = "sqlite:///./data/datacrypt_production.db"
    
    # CORS para producción local
    os.environ["ALLOWED_ORIGINS"] = '["http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:3000"]'
    
    print("✅ Variables de entorno de producción configuradas")

def main():
    """Ejecutar servidor de producción"""
    print("🚀 Iniciando DataCrypt Labs en modo PRODUCCIÓN...")
    print("=" * 60)
    
    # Setup production environment
    setup_production_environment()
    
    # Import the FastAPI app
    try:
        from main import app
        print("✅ Aplicación FastAPI cargada correctamente")
    except ImportError as e:
        print(f"❌ Error importando la aplicación: {e}")
        sys.exit(1)
    
    # Server configuration for production
    config = {
        "app": "main:app",
        "host": "0.0.0.0",
        "port": 8000,
        "workers": 1,  # Para desarrollo local
        "log_level": "info",
        "access_log": True,
        "reload": False,  # No reload in production
        "server_header": False,  # Hide server info
        "date_header": False,    # Security
    }
    
    print("🌐 Configuración del servidor:")
    print(f"   • Host: {config['host']}")
    print(f"   • Puerto: {config['port']}")
    print(f"   • Workers: {config['workers']}")
    print(f"   • Reload: {config['reload']}")
    print("=" * 60)
    print("📍 URLs disponibles:")
    print(f"   • Aplicación Principal: http://localhost:8000/")
    print(f"   • Documentación API: http://localhost:8000/docs")
    print(f"   • Health Check: http://localhost:8000/health")
    print(f"   • Juego Data Wizard: http://localhost:8000/game.html")
    print("=" * 60)
    print("🎮 Para probar el juego completo:")
    print("   1. Abre http://localhost:8000/game.html")
    print("   2. Juega y obtén puntajes")
    print("   3. Verifica leaderboards y estadísticas")
    print("=" * 60)
    
    # Start the server
    try:
        uvicorn.run(**config)
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido por el usuario")
    except Exception as e:
        print(f"❌ Error ejecutando el servidor: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()