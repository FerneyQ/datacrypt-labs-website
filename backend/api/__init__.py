"""
🚀 DATACRYPT LABS - API ROUTES
Rutas principales de la API
Filosofía Mejora Continua: Modularización y organización clara
"""

from fastapi import APIRouter
from backend.api.v1 import auth, admin, contact, portfolio, games, health, ml, data

# Router principal de la API
api_router = APIRouter(prefix="/api/v1")

# Include all route modules
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(admin.router, prefix="/admin", tags=["Administration"])
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["Portfolio"])
api_router.include_router(games.router, prefix="/games", tags=["Games"])
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(ml.router, prefix="/ml", tags=["Machine Learning"])
api_router.include_router(data.router, prefix="/data", tags=["Data Analysis"])

__all__ = ["api_router"]