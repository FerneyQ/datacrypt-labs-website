"""
🔧 DATACRYPT LABS - ADMIN API (SIMPLE LOCAL)
Rutas básicas para administración local únicamente
Filosofía Mejora Continua: Simplicidad y efectividad
"""

from fastapi import APIRouter
from typing import Dict, Any
from datetime import datetime

router = APIRouter()

@router.get("/status")
async def get_admin_status() -> Dict[str, Any]:
    """
    📊 Estado básico del sistema admin (solo localhost)
    
    Retorna información básica del sistema sin complejidad web.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "system": "DataCrypt Labs Backend Modular v2.0",
        "mode": "local_only",
        "message": "Sistema administrativo funcionando correctamente"
    }

@router.get("/health")
async def admin_health_check() -> Dict[str, str]:
    """
    🏥 Health check simple para admin
    """
    return {
        "status": "ok",
        "admin": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }