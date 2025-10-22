"""
🔧 DATACRYPT LABS - ADMIN API
Rutas para administración del sistema
Filosofía Mejora Continua: Control granular y monitoreo completo
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any
from datetime import datetime, timedelta

from backend.models import (
    AdminUser, SuccessResponse, ErrorResponse, RequestMetadata
)
from backend.services import (
    get_database_service, get_contact_service, 
    get_game_service, get_portfolio_service
)
from backend.core import (
    require_admin, require_permission, get_request_metadata,
    validate_localhost_only, response_cache
)
from backend.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.get("/dashboard", response_model=SuccessResponse)
@validate_localhost_only()
async def get_admin_dashboard(
    admin_user: AdminUser = Depends(require_admin),
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📊 Dashboard principal de administración
    
    Retorna estadísticas y métricas del sistema para el panel admin.
    Acceso restringido a localhost y usuarios administradores.
    """
    try:
        # Get services
        db_service = get_database_service()
        contact_service = get_contact_service()
        game_service = get_game_service()
        portfolio_service = get_portfolio_service()
        
        # System overview
        current_time = datetime.utcnow()
        
        # Database statistics
        try:
            # Get table counts
            table_counts = {}
            tables = [
                "admin_users", "contact_messages", "game_scores", 
                "portfolio_projects", "data_analysis_results",
                "ml_predictions", "api_keys", "user_sessions"
            ]
            
            for table in tables:
                try:
                    result = await db_service.execute_query(f"SELECT COUNT(*) as count FROM {table}")
                    table_counts[table] = result[0]["count"] if result else 0
                except:
                    table_counts[table] = 0  # Table might not exist
            
        except Exception as e:
            logger.warning(f"Could not get database statistics: {e}")
            table_counts = {"error": "Database statistics unavailable"}
        
        # Recent activity (last 7 days)
        week_ago = current_time - timedelta(days=7)
        
        # Contact messages activity
        recent_contacts = await contact_service.get_messages(100)
        recent_contact_count = len([
            msg for msg in recent_contacts 
            if msg.timestamp >= week_ago
        ])
        
        # Game activity
        recent_scores = await game_service.get_leaderboard(100)
        recent_game_count = len([
            score for score in recent_scores 
            if score.timestamp >= week_ago
        ])
        
        # Portfolio projects
        portfolio_projects = await portfolio_service.get_projects()
        featured_projects = len([p for p in portfolio_projects if p.featured])
        
        # System health indicators
        health_indicators = {
            "database_status": "healthy" if not isinstance(table_counts, dict) or "error" not in table_counts else "degraded",
            "contact_system": "healthy" if recent_contacts is not None else "degraded",
            "game_system": "healthy" if recent_scores is not None else "degraded",
            "portfolio_system": "healthy" if portfolio_projects is not None else "degraded"
        }
        
        overall_health = "healthy" if all(status == "healthy" for status in health_indicators.values()) else "degraded"
        
        # Dashboard data
        dashboard_data = {
            "overview": {
                "system_health": overall_health,
                "admin_user": admin_user.username,
                "last_login": admin_user.last_login.isoformat() if admin_user.last_login else None,
                "current_time": current_time.isoformat(),
                "environment": "localhost_only"
            },
            "statistics": {
                "database": table_counts,
                "total_contact_messages": table_counts.get("contact_messages", 0),
                "total_game_scores": table_counts.get("game_scores", 0),
                "total_portfolio_projects": len(portfolio_projects),
                "featured_projects": featured_projects
            },
            "recent_activity": {
                "period": "last_7_days",
                "new_contacts": recent_contact_count,
                "new_game_scores": recent_game_count,
                "total_activity_events": recent_contact_count + recent_game_count
            },
            "health_indicators": health_indicators,
            "quick_actions": [
                {"name": "View Contact Messages", "endpoint": "/api/v1/contact/messages"},
                {"name": "Game Leaderboard", "endpoint": "/api/v1/games/leaderboard"},
                {"name": "Portfolio Stats", "endpoint": "/api/v1/portfolio/stats"},
                {"name": "System Health", "endpoint": "/api/v1/health/detailed"},
                {"name": "Clear Cache", "action": "clear_cache"}
            ]
        }
        
        logger.info(
            f"Admin dashboard accessed by: {admin_user.username}",
            extra={
                "admin_id": admin_user.id,
                "system_health": overall_health,
                "request_id": metadata.request_id
            }
        )
        
        return SuccessResponse(
            status="success",
            message="Admin dashboard data retrieved successfully",
            data=dashboard_data
        )
        
    except Exception as e:
        logger.error(
            f"Admin dashboard error: {e}",
            extra={
                "admin_id": admin_user.id,
                "request_id": metadata.request_id
            }
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin service error"
        )

@router.get("/system/info", response_model=SuccessResponse)
@validate_localhost_only()
async def get_system_info(
    admin_user: AdminUser = Depends(require_admin),
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    🖥️ Información del sistema
    
    Retorna información detallada del sistema y configuración.
    """
    try:
        import platform
        import sys
        from pathlib import Path
        
        # System information
        system_info = {
            "platform": {
                "system": platform.system(),
                "release": platform.release(),
                "version": platform.version(),
                "machine": platform.machine(),
                "processor": platform.processor(),
                "hostname": platform.node()
            },
            "python": {
                "version": sys.version,
                "implementation": platform.python_implementation(),
                "executable": sys.executable,
                "path": sys.path[:5]  # First 5 entries only
            },
            "application": {
                "name": "DataCrypt Labs Portfolio",
                "version": "2.0.0",
                "environment": "localhost_development",
                "startup_time": "calculated_from_health_service",
                "config_loaded": True
            }
        }
        
        # Database information
        from backend.config.settings import get_settings
        settings = get_settings()
        
        db_path = Path(settings.DATABASE_PATH)
        database_info = {
            "path": str(db_path),
            "exists": db_path.exists(),
            "size_mb": round(db_path.stat().st_size / (1024**2), 2) if db_path.exists() else 0,
            "modified": datetime.fromtimestamp(db_path.stat().st_mtime).isoformat() if db_path.exists() else None,
            "readable": db_path.is_file() if db_path.exists() else False
        }
        
        # Configuration summary
        config_summary = {
            "database_configured": bool(settings.DATABASE_PATH),
            "jwt_configured": bool(settings.SECRET_KEY),
            "cors_enabled": bool(settings.ALLOWED_ORIGINS),
            "security_headers": True,
            "rate_limiting": True,
            "request_logging": True
        }
        
        # Features status
        features_status = {
            "authentication": "enabled",
            "contact_system": "enabled",
            "game_system": "enabled", 
            "portfolio_management": "enabled",
            "data_analysis": "enabled",
            "machine_learning": "enabled",
            "admin_panel": "enabled",
            "health_monitoring": "enabled"
        }
        
        system_data = {
            "system": system_info,
            "database": database_info,
            "configuration": config_summary,
            "features": features_status,
            "security": {
                "localhost_only": True,
                "jwt_auth": True,
                "rate_limiting": True,
                "security_headers": True,
                "admin_required": True
            }
        }
        
        logger.info(
            f"System info accessed by: {admin_user.username}",
            extra={"admin_id": admin_user.id, "request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="System information retrieved successfully",
            data=system_data
        )
        
    except Exception as e:
        logger.error(f"System info error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="System info service error"
        )

@router.post("/cache/clear", response_model=SuccessResponse)
@validate_localhost_only()
async def clear_system_cache(
    admin_user: AdminUser = Depends(require_admin),
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    🗑️ Limpiar cache del sistema
    
    Limpia el cache del sistema para forzar actualizaciones.
    """
    try:
        # Clear response cache
        cache_entries_before = len(response_cache.cache)
        response_cache.invalidate()
        
        # Clear any other caches here
        # TODO: Add more cache clearing logic if needed
        
        logger.info(
            f"System cache cleared by: {admin_user.username}",
            extra={
                "admin_id": admin_user.id,
                "cache_entries_cleared": cache_entries_before,
                "request_id": metadata.request_id
            }
        )
        
        return SuccessResponse(
            status="success",
            message="System cache cleared successfully",
            data={
                "cache_entries_cleared": cache_entries_before,
                "cleared_at": datetime.utcnow().isoformat(),
                "cleared_by": admin_user.username
            }
        )
        
    except Exception as e:
        logger.error(f"Cache clear error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cache service error"
        )

@router.get("/logs/recent", response_model=SuccessResponse)
@validate_localhost_only()
async def get_recent_logs(
    limit: int = 100,
    level: str = "INFO",
    admin_user: AdminUser = Depends(require_admin),
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📝 Logs recientes del sistema
    
    Retorna los logs recientes del sistema (simulado por ahora).
    """
    try:
        # TODO: Implement actual log reading from log files
        # For now, return simulated recent logs
        
        recent_logs = [
            {
                "timestamp": (datetime.utcnow() - timedelta(minutes=1)).isoformat(),
                "level": "INFO",
                "message": "Admin dashboard accessed",
                "module": "admin_api",
                "user": admin_user.username
            },
            {
                "timestamp": (datetime.utcnow() - timedelta(minutes=5)).isoformat(),
                "level": "INFO",
                "message": "Health check completed",
                "module": "health_api",
                "user": "system"
            },
            {
                "timestamp": (datetime.utcnow() - timedelta(minutes=10)).isoformat(),
                "level": "INFO",
                "message": "Portfolio projects retrieved",
                "module": "portfolio_api",
                "user": "anonymous"
            }
        ]
        
        # Filter by level if specified
        if level.upper() != "ALL":
            recent_logs = [log for log in recent_logs if log["level"] == level.upper()]
        
        # Apply limit
        recent_logs = recent_logs[:limit]
        
        logger.info(
            f"Recent logs accessed by: {admin_user.username}",
            extra={
                "admin_id": admin_user.id,
                "logs_requested": limit,
                "level_filter": level,
                "request_id": metadata.request_id
            }
        )
        
        return SuccessResponse(
            status="success",
            message="Recent logs retrieved successfully",
            data={
                "logs": recent_logs,
                "total_logs": len(recent_logs),
                "level_filter": level,
                "limit_applied": limit,
                "note": "Log implementation is simulated - integrate with actual log files for production"
            }
        )
        
    except Exception as e:
        logger.error(f"Recent logs error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logs service error"
        )