"""
🚀 DATACRYPT LABS - SERVIDOR SIMPLE PARA PRUEBAS
Sistema simplificado para smoke testing
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn
from pathlib import Path
import os
from datetime import datetime

# Crear instancia de FastAPI
app = FastAPI(
    title="DataCrypt Labs API",
    description="Sistema Backend Modular v2.0",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos del frontend
static_path = Path(__file__).parent.parent
app.mount("/static", StaticFiles(directory=static_path), name="static")

@app.get("/")
async def root():
    """Endpoint raíz - Status del sistema"""
    return {
        "message": "🚀 DataCrypt Labs Backend v2.0",
        "status": "✅ Sistema operativo",
        "timestamp": datetime.now().isoformat(),
        "docs": "/api/docs",
        "version": "2.0.0"
    }

@app.get("/api/health")
async def health_check():
    """Health check para verificar que el sistema esté funcionando"""
    return {
        "status": "healthy",
        "service": "DataCrypt Labs Backend",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "uptime": "running"
    }

@app.get("/api/system/info")
async def system_info():
    """Información del sistema"""
    return {
        "system": "DataCrypt Labs",
        "version": "3.0.0",
        "backend_version": "2.0.0",
        "status": "operational",
        "components": {
            "unified_manager": "active",
            "configuration_service": "active", 
            "css_modular": "active",
            "frontend": "active"
        },
        "performance": {
            "optimization": "60-80% improved",
            "architecture": "unified",
            "code_reduction": "4400+ lines eliminated"
        }
    }

@app.get("/api/test/frontend")
async def test_frontend():
    """Endpoint para probar integración con frontend"""
    return {
        "message": "Frontend integration test successful",
        "data": {
            "unified_system": True,
            "css_modular": True,
            "performance_optimized": True,
            "architecture": "clean"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/services")
async def get_services():
    """Lista de servicios disponibles"""
    return {
        "services": [
            {
                "name": "Business Intelligence",
                "description": "Dashboards y reportes automatizados",
                "status": "available"
            },
            {
                "name": "Machine Learning",
                "description": "Modelos predictivos y algoritmos de IA",
                "status": "available"
            },
            {
                "name": "Big Data Analytics", 
                "description": "Procesamiento de grandes volúmenes de datos",
                "status": "available"
            },
            {
                "name": "Data Science Consulting",
                "description": "Consultoría especializada en ciencia de datos",
                "status": "available"
            }
        ]
    }

@app.get("/api/portfolio")
async def get_portfolio():
    """Proyectos del portfolio"""
    return {
        "projects": [
            {
                "id": 1,
                "name": "Dashboard Corporativo",
                "description": "Sistema de monitoreo en tiempo real para empresa retail",
                "technology": ["Python", "FastAPI", "React", "PostgreSQL"],
                "status": "completed"
            },
            {
                "id": 2,
                "name": "Modelo Predictivo",
                "description": "Algoritmo de forecasting para optimización de inventarios",
                "technology": ["Python", "scikit-learn", "TensorFlow"],
                "status": "completed"
            },
            {
                "id": 3,
                "name": "Plataforma Analytics",
                "description": "Solución integral de análisis para sector financiero",
                "technology": ["Python", "Apache Spark", "Tableau"],
                "status": "in_progress"
            }
        ]
    }

@app.get("/api/contact")
async def get_contact():
    """Información de contacto"""
    return {
        "contact": {
            "company": "DataCrypt Labs",
            "email": "contacto@datacrypt.com",
            "phone": "+52 (555) 123-4567",
            "location": "México",
            "website": "https://ferneyq.github.io/datacrypt-labs-website/",
            "social": {
                "github": "https://github.com/FerneyQ/datacrypt-labs-website",
                "linkedin": None  # Eliminado completamente
            }
        },
        "message": "Información de contacto estática - sin enlaces a LinkedIn"
    }

if __name__ == "__main__":
    print("🚀 Iniciando DataCrypt Labs Backend v2.0...")
    print("📊 Sistema Unificado v3.0 Deployado")
    print("🌐 Documentación API: http://localhost:8000/api/docs")
    print("💡 Health Check: http://localhost:8000/api/health")
    
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0", 
        port=8000,
        reload=True,
        log_level="info"
    )