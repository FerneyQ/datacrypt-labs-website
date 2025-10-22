"""
🏥 DATACRYPT LABS - HEALTH API
Rutas para monitoreo de salud del sistema
Filosofía Mejora Continua: Observabilidad y mantenimiento proactivo
"""

from fastapi import APIRouter, HTTPException, Depends, status
import psutil
import sys
import platform
from datetime import datetime
from pathlib import Path

from backend.models import HealthStatus, SuccessResponse, RequestMetadata
from backend.services import get_health_service, get_database_service
from backend.core import get_request_metadata
from backend.config.settings import get_settings
from backend.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)
settings = get_settings()

@router.get("/", response_model=SuccessResponse)
async def get_health_check(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    ❤️ Health Check básico
    
    Verificación rápida del estado del sistema.
    """
    try:
        health_service = get_health_service()
        health_status = await health_service.get_health_status()
        
        return SuccessResponse(
            status="success",
            message="Health check completed",
            data={
                "status": health_status.status,
                "timestamp": health_status.timestamp.isoformat(),
                "uptime_seconds": health_status.uptime,
                "version": health_status.version,
                "environment": health_status.environment
            }
        )
        
    except Exception as e:
        logger.error(f"Health check error: {e}", extra={"request_id": metadata.request_id})
        return SuccessResponse(
            status="error",
            message="Health check failed",
            data={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

@router.get("/detailed", response_model=SuccessResponse)
async def get_detailed_health(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    🔍 Health Check detallado
    
    Verificación completa del sistema incluyendo recursos.
    """
    try:
        health_service = get_health_service()
        basic_health = await health_service.get_health_status()
        
        # System information
        system_info = {
            "platform": platform.system(),
            "platform_release": platform.release(),
            "platform_version": platform.version(),
            "architecture": platform.machine(),
            "hostname": platform.node(),
            "processor": platform.processor(),
            "python_version": sys.version,
            "python_implementation": platform.python_implementation()
        }
        
        # Resource usage
        try:
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            cpu_percent = psutil.cpu_percent(interval=1)
            
            resources = {
                "cpu": {
                    "usage_percent": cpu_percent,
                    "count": psutil.cpu_count(),
                    "count_logical": psutil.cpu_count(logical=True)
                },
                "memory": {
                    "total_gb": round(memory.total / (1024**3), 2),
                    "available_gb": round(memory.available / (1024**3), 2),
                    "used_gb": round(memory.used / (1024**3), 2),
                    "usage_percent": memory.percent
                },
                "disk": {
                    "total_gb": round(disk.total / (1024**3), 2),
                    "free_gb": round(disk.free / (1024**3), 2),
                    "used_gb": round(disk.used / (1024**3), 2),
                    "usage_percent": round((disk.used / disk.total) * 100, 2)
                }
            }
        except Exception as e:
            logger.warning(f"Could not get system resources: {e}")
            resources = {"error": "System resources unavailable"}
        
        # Database check
        db_health = {"status": "unknown", "error": None}
        try:
            db_service = get_database_service()
            await db_service.execute_query("SELECT 1")
            db_health["status"] = "healthy"
            
            # Check database file size
            db_path = Path(settings.DATABASE_PATH)
            if db_path.exists():
                db_size_mb = db_path.stat().st_size / (1024**2)
                db_health["size_mb"] = round(db_size_mb, 2)
            
        except Exception as e:
            db_health["status"] = "unhealthy"
            db_health["error"] = str(e)
        
        # API endpoints health (basic check)
        api_health = {
            "total_endpoints": "calculated_dynamically",  # Would need FastAPI app instance
            "auth_system": "operational" if basic_health.dependencies.get("jwt") == "healthy" else "degraded",
            "database_connectivity": db_health["status"]
        }
        
        detailed_data = {
            "overview": {
                "status": basic_health.status,
                "uptime_seconds": basic_health.uptime,
                "uptime_formatted": format_uptime(basic_health.uptime),
                "version": basic_health.version,
                "environment": basic_health.environment,
                "timestamp": basic_health.timestamp.isoformat()
            },
            "system": system_info,
            "resources": resources,
            "database": db_health,
            "dependencies": basic_health.dependencies,
            "api": api_health
        }
        
        logger.info(
            f"Detailed health check completed",
            extra={
                "status": basic_health.status,
                "uptime": basic_health.uptime,
                "request_id": metadata.request_id
            }
        )
        
        return SuccessResponse(
            status="success",
            message="Detailed health check completed",
            data=detailed_data
        )
        
    except Exception as e:
        logger.error(f"Detailed health check error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Health service error"
        )

@router.get("/database", response_model=SuccessResponse)
async def check_database_health(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    🗄️ Verificación de base de datos
    
    Chequeo específico del estado de la base de datos.
    """
    try:
        db_service = get_database_service()
        
        # Test basic connectivity
        await db_service.execute_query("SELECT 1")
        
        # Get database stats
        stats_queries = [
            ("SELECT COUNT(*) as count FROM contact_messages", "contact_messages"),
            ("SELECT COUNT(*) as count FROM game_scores", "game_scores"),
            ("SELECT COUNT(*) as count FROM admin_users", "admin_users"),
            ("SELECT COUNT(*) as count FROM portfolio_projects", "portfolio_projects")
        ]
        
        table_stats = {}
        for query, table_name in stats_queries:
            try:
                result = await db_service.execute_query(query)
                table_stats[table_name] = result[0]["count"] if result else 0
            except Exception as e:
                table_stats[table_name] = f"Error: {str(e)}"
        
        # Database file info
        db_path = Path(settings.DATABASE_PATH)
        file_info = {}
        if db_path.exists():
            stat = db_path.stat()
            file_info = {
                "path": str(db_path),
                "size_bytes": stat.st_size,
                "size_mb": round(stat.st_size / (1024**2), 2),
                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "readable": db_path.is_file(),
                "writable": db_path.stat().st_mode & 0o200 != 0
            }
        
        db_data = {
            "status": "healthy",
            "connectivity": "operational",
            "file_info": file_info,
            "table_statistics": table_stats,
            "total_records": sum(
                count for count in table_stats.values() 
                if isinstance(count, int)
            )
        }
        
        logger.info(
            f"Database health check completed: {sum(isinstance(count, int) and count or 0 for count in table_stats.values())} total records",
            extra={"request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="Database health check completed",
            data=db_data
        )
        
    except Exception as e:
        logger.error(f"Database health check error: {e}", extra={"request_id": metadata.request_id})
        
        return SuccessResponse(
            status="error",
            message="Database health check failed",
            data={
                "status": "unhealthy",
                "connectivity": "failed",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

@router.get("/metrics", response_model=SuccessResponse)
async def get_system_metrics(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📊 Métricas del sistema
    
    Obtiene métricas detalladas para monitoreo.
    """
    try:
        # Get current metrics
        current_time = datetime.utcnow()
        
        # Memory usage
        try:
            import gc
            memory_info = psutil.virtual_memory()
            process = psutil.Process()
            process_memory = process.memory_info()
            
            memory_metrics = {
                "system_total_mb": round(memory_info.total / (1024**2), 2),
                "system_available_mb": round(memory_info.available / (1024**2), 2),
                "system_used_percent": memory_info.percent,
                "process_rss_mb": round(process_memory.rss / (1024**2), 2),
                "process_vms_mb": round(process_memory.vms / (1024**2), 2),
                "gc_collections": {
                    "generation_0": gc.get_count()[0],
                    "generation_1": gc.get_count()[1],
                    "generation_2": gc.get_count()[2]
                }
            }
        except Exception as e:
            memory_metrics = {"error": f"Memory metrics unavailable: {e}"}
        
        # Performance metrics (would be expanded with actual monitoring)
        performance_metrics = {
            "avg_response_time_ms": "not_implemented",  # Would track from middleware
            "requests_per_minute": "not_implemented",   # Would track from middleware
            "error_rate_percent": "not_implemented",    # Would track from error logs
            "active_connections": "not_implemented"     # Would track from connection pool
        }
        
        # Database metrics
        try:
            db_service = get_database_service()
            # Simple query performance test
            start_time = datetime.utcnow()
            await db_service.execute_query("SELECT 1")
            query_time_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
            
            db_metrics = {
                "connection_test_ms": round(query_time_ms, 2),
                "status": "operational"
            }
        except Exception as e:
            db_metrics = {
                "connection_test_ms": None,
                "status": "failed",
                "error": str(e)
            }
        
        metrics_data = {
            "timestamp": current_time.isoformat(),
            "memory": memory_metrics,
            "performance": performance_metrics,
            "database": db_metrics,
            "system": {
                "cpu_count": psutil.cpu_count(),
                "boot_time": datetime.fromtimestamp(psutil.boot_time()).isoformat(),
                "load_average": getattr(psutil, 'getloadavg', lambda: [0, 0, 0])()[:3]
            }
        }
        
        return SuccessResponse(
            status="success",
            message="System metrics retrieved successfully",
            data=metrics_data
        )
        
    except Exception as e:
        logger.error(f"System metrics error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Metrics service error"
        )

def format_uptime(seconds: float) -> str:
    """Formatea uptime en formato legible"""
    days = int(seconds // 86400)
    hours = int((seconds % 86400) // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = int(seconds % 60)
    
    if days > 0:
        return f"{days}d {hours}h {minutes}m {seconds}s"
    elif hours > 0:
        return f"{hours}h {minutes}m {seconds}s"
    elif minutes > 0:
        return f"{minutes}m {seconds}s"
    else:
        return f"{seconds}s"