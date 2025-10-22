"""
📊 DATACRYPT LABS - LOGGING SYSTEM
Sistema de logging estructurado con rotación automática
Filosofía Mejora Continua: Observabilidad y debugging mejorado
"""

import logging
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional
from logging.handlers import RotatingFileHandler
from ..config import settings

class StructuredFormatter(logging.Formatter):
    """Formatter para logs estructurados en JSON"""
    
    def format(self, record: logging.LogRecord) -> str:
        """Formatea el log en JSON estructurado"""
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Agregar información adicional si existe
        if hasattr(record, "extra_data"):
            log_data["extra"] = record.extra_data
            
        # Agregar información de excepción si existe
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        # Agregar request_id si existe (para tracing)
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
            
        return json.dumps(log_data, ensure_ascii=False)

class DataCryptLogger:
    """Logger centralizado para DataCrypt Labs"""
    
    def __init__(self, name: str = "datacrypt"):
        self.logger = logging.getLogger(name)
        self._setup_logger()
    
    def _setup_logger(self):
        """Configura el logger principal"""
        # Limpiar handlers existentes
        self.logger.handlers.clear()
        
        # Configurar nivel
        level = getattr(logging, settings.log_level.upper(), logging.INFO)
        self.logger.setLevel(level)
        
        # Handler para consola (desarrollo)
        if settings.is_development():
            console_handler = logging.StreamHandler(sys.stdout)
            console_handler.setLevel(level)
            
            # Formato simple para desarrollo
            console_format = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S"
            )
            console_handler.setFormatter(console_format)
            self.logger.addHandler(console_handler)
        
        # Handler para archivo (siempre)
        try:
            log_file = Path(settings.log_file)
            log_file.parent.mkdir(parents=True, exist_ok=True)
            
            file_handler = RotatingFileHandler(
                filename=log_file,
                maxBytes=settings.log_max_size,
                backupCount=settings.log_backup_count,
                encoding="utf-8"
            )
            file_handler.setLevel(level)
            
            # Formato estructurado para archivo
            if settings.is_production:
                file_handler.setFormatter(StructuredFormatter())
            else:
                file_format = logging.Formatter(
                    "%(asctime)s - %(name)s - %(levelname)s - %(module)s:%(funcName)s:%(lineno)d - %(message)s",
                    datefmt="%Y-%m-%d %H:%M:%S"
                )
                file_handler.setFormatter(file_format)
            
            self.logger.addHandler(file_handler)
            
        except Exception as e:
            print(f"⚠️ Warning: Could not setup file logging: {e}")
    
    def info(self, message: str, extra_data: Optional[Dict[str, Any]] = None, request_id: Optional[str] = None):
        """Log nivel INFO"""
        self._log(logging.INFO, message, extra_data, request_id)
    
    def debug(self, message: str, extra_data: Optional[Dict[str, Any]] = None, request_id: Optional[str] = None):
        """Log nivel DEBUG"""
        self._log(logging.DEBUG, message, extra_data, request_id)
    
    def warning(self, message: str, extra_data: Optional[Dict[str, Any]] = None, request_id: Optional[str] = None):
        """Log nivel WARNING"""
        self._log(logging.WARNING, message, extra_data, request_id)
    
    def error(self, message: str, extra_data: Optional[Dict[str, Any]] = None, request_id: Optional[str] = None, exc_info: bool = False):
        """Log nivel ERROR"""
        self._log(logging.ERROR, message, extra_data, request_id, exc_info)
    
    def critical(self, message: str, extra_data: Optional[Dict[str, Any]] = None, request_id: Optional[str] = None, exc_info: bool = False):
        """Log nivel CRITICAL"""
        self._log(logging.CRITICAL, message, extra_data, request_id, exc_info)
    
    def _log(self, level: int, message: str, extra_data: Optional[Dict[str, Any]], request_id: Optional[str], exc_info: bool = False):
        """Método interno para logging"""
        extra = {}
        if extra_data:
            extra["extra_data"] = extra_data
        if request_id:
            extra["request_id"] = request_id
            
        self.logger.log(level, message, extra=extra, exc_info=exc_info)

# Instancia global del logger
logger = DataCryptLogger("datacrypt")

# Loggers especializados
api_logger = DataCryptLogger("datacrypt.api")
auth_logger = DataCryptLogger("datacrypt.auth")
ml_logger = DataCryptLogger("datacrypt.ml")
db_logger = DataCryptLogger("datacrypt.database")
security_logger = DataCryptLogger("datacrypt.security")

def get_logger(name: str) -> DataCryptLogger:
    """Obtiene un logger específico"""
    return DataCryptLogger(f"datacrypt.{name}")

# Performance logging decorator
def log_performance(logger_instance: DataCryptLogger = logger):
    """Decorator para medir performance de funciones"""
    def decorator(func):
        import time
        import functools
        
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                execution_time = time.time() - start_time
                logger_instance.info(
                    f"Function {func.__name__} completed",
                    extra_data={
                        "function": func.__name__,
                        "execution_time_ms": round(execution_time * 1000, 2),
                        "status": "success"
                    }
                )
                return result
            except Exception as e:
                execution_time = time.time() - start_time
                logger_instance.error(
                    f"Function {func.__name__} failed",
                    extra_data={
                        "function": func.__name__,
                        "execution_time_ms": round(execution_time * 1000, 2),
                        "status": "error",
                        "error": str(e)
                    },
                    exc_info=True
                )
                raise
        
        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                execution_time = time.time() - start_time
                logger_instance.info(
                    f"Function {func.__name__} completed",
                    extra_data={
                        "function": func.__name__,
                        "execution_time_ms": round(execution_time * 1000, 2),
                        "status": "success"
                    }
                )
                return result
            except Exception as e:
                execution_time = time.time() - start_time
                logger_instance.error(
                    f"Function {func.__name__} failed",
                    extra_data={
                        "function": func.__name__,
                        "execution_time_ms": round(execution_time * 1000, 2),
                        "status": "error",
                        "error": str(e)
                    },
                    exc_info=True
                )
                raise
        
        # Detectar si la función es async
        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator

# Export para importación fácil
__all__ = [
    "logger", "api_logger", "auth_logger", "ml_logger", 
    "db_logger", "security_logger", "get_logger", "log_performance"
]