"""
🚀 DATACRYPT LABS - MAIN APPLICATION V2.0
Sistema modular optimizado con arquitectura escalable
Filosofía Mejora Continua: Código limpio y mantenible
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn
from pathlib import Path

# Imports del sistema modular
from backend.config.settings import get_settings
from backend.utils.logger import get_logger
from backend.core import (
    RequestTrackingMiddleware, SecurityHeadersMiddleware, 
    RateLimitMiddleware, validation_exception_handler,
    generic_exception_handler
)
from backend.api import api_router

# Configuración
settings = get_settings()
logger = get_logger(__name__)

# Logger configurado automáticamente

# Crear aplicación FastAPI
app = FastAPI(
    title="DataCrypt Labs - Portfolio & Admin System",
    description="Sistema modular de portfolio con panel administrativo ultra-seguro",
    version="2.0.0",
    docs_url="/docs" if settings.environment == "development" else None,
    redoc_url="/redoc" if settings.environment == "development" else None,
)

# ===== MIDDLEWARE =====

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins_list(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Custom Middleware
app.add_middleware(RequestTrackingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, calls=100, period=60)

# ===== EXCEPTION HANDLERS =====

app.add_exception_handler(ValueError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# ===== ROUTES =====

# Include API router
app.include_router(api_router)

# ===== STATIC FILES =====

# Servir archivos estáticos si existen
static_dir = Path("static")
if static_dir.exists():
    app.mount("/static", StaticFiles(directory="static"), name="static")

# ===== ROOT ENDPOINTS =====

@app.get("/", response_class=HTMLResponse)
async def root():
    """Página principal con redirección al portfolio en GitHub Pages"""
    return HTMLResponse(content="""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DataCrypt Labs - Portfolio</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; text-align: center; padding: 50px;
                margin: 0; min-height: 100vh; display: flex;
                flex-direction: column; justify-content: center;
            }
            .container { max-width: 800px; margin: 0 auto; }
            h1 { font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
            .subtitle { font-size: 1.2em; margin-bottom: 40px; opacity: 0.9; }
            .links { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
            .link-card {
                background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);
                padding: 20px 30px; border-radius: 15px; text-decoration: none;
                color: white; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.2);
            }
            .link-card:hover {
                background: rgba(255,255,255,0.2); transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }
            .status { 
                position: fixed; top: 20px; right: 20px; 
                background: #28a745; padding: 10px 15px; 
                border-radius: 20px; font-size: 0.9em;
            }
            .api-info {
                margin-top: 40px; background: rgba(0,0,0,0.2);
                padding: 20px; border-radius: 10px; font-size: 0.9em;
            }
        </style>
    </head>
    <body>
        <div class="status">🟢 Sistema Modular v2.0</div>
        <div class="container">
            <h1>🔐 DataCrypt Labs</h1>
            <p class="subtitle">
                Sistema modular de portfolio con panel administrativo ultra-seguro<br>
                <strong>Localhost Only</strong> - Filosofía Mejora Continua
            </p>
            
            <div class="links">
                <a href="https://neydcv.github.io/DataCrypt_Labs/" class="link-card" target="_blank">
                    🌐 Portfolio Público<br>
                    <small>GitHub Pages</small>
                </a>
                <a href="/api/v1/health" class="link-card">
                    💚 Health Check<br>
                    <small>Estado del Sistema</small>
                </a>
                <a href="/docs" class="link-card">
                    📚 API Docs<br>
                    <small>Documentación</small>
                </a>
            </div>
            
            <div class="api-info">
                <h3>🔧 Sistema Modular v2.0</h3>
                <p>Backend completamente modularizado con:</p>
                <ul style="text-align: left; display: inline-block;">
                    <li>✅ Configuración centralizada con Pydantic</li>
                    <li>✅ Logging estructurado con JSON</li>
                    <li>✅ APIs organizadas por módulos</li>
                    <li>✅ Servicios especializados</li>
                    <li>✅ Middleware de seguridad</li>
                    <li>✅ Arquitectura escalable</li>
                    <li>✅ Filosofía PDCA aplicada</li>
                </ul>
            </div>
        </div>
        
        <script>
            // Auto-redirect al admin si viene de localhost admin
            if (window.location.search.includes('admin=true')) {
                window.location.href = '/api/v1/admin/dashboard';
            }
        </script>
    </body>
    </html>
    """)

@app.get("/status")
async def system_status():
    """Estado rápido del sistema"""
    return {
        "status": "operational",
        "version": "2.0.0",
        "architecture": "modular",
        "environment": settings.environment,
        "timestamp": "2024-01-20T00:00:00Z",
        "pdca_compliance": "active"
    }

# ===== STARTUP/SHUTDOWN EVENTS =====

@app.on_event("startup")
async def startup_event():
    """Eventos de inicio"""
    logger.info("🚀 DataCrypt Labs - Sistema modular v2.0 iniciado")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Database: {settings.get_database_path()}")
    logger.info("Filosofía Mejora Continua: ✅ Activa")
    logger.info("Arquitectura: 📦 Modular")

@app.on_event("shutdown")
async def shutdown_event():
    """Eventos de cierre"""
    logger.info("🛑 DataCrypt Labs - Sistema modular detenido")

# ===== MAIN =====

if __name__ == "__main__":
    logger.info("🌟 Iniciando DataCrypt Labs - Sistema Modular v2.0")
    uvicorn.run(
        "backend.main_new:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.environment == "development",
        log_level="info"
    )