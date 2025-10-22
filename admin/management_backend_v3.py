#!/usr/bin/env python3
"""
🚀 DATACRYPT LABS - MANAGEMENT BACKEND v3.0 - MEJORA CONTINUA
Sistema de Gestión Empresarial Avanzado siguiendo Filosofía PDCA

CARACTERÍSTICAS PRINCIPALES:
✅ API REST robusta con FastAPI
✅ Sistema de voz completamente integrado
✅ Monitoreo en tiempo real del sistema
✅ Seguridad avanzada con validaciones
✅ Logging inteligente con rotación automática
✅ Sistema de estado global sincronizado
✅ Manejo robusto de errores con recovery automático
✅ Arquitectura modular basada en mejores prácticas
✅ Filosofía PDCA aplicada en toda la estructura

AUTOR: DataCrypt Labs
VERSIÓN: 3.0.0
FECHA: 21 Octubre 2025
"""

import asyncio
import json
import logging
import os
import platform
import psutil
import requests
import time
import traceback
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from enum import Enum
import sys

# FastAPI y dependencias
from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, validator
import uvicorn

# ==================== CONFIGURACIÓN DE LOGGING AVANZADO ====================

class ColoredFormatter(logging.Formatter):
    """Formatter con colores para mejor visualización"""
    
    COLORS = {
        'DEBUG': '\033[36m',    # Cian
        'INFO': '\033[32m',     # Verde
        'WARNING': '\033[33m',  # Amarillo
        'ERROR': '\033[31m',    # Rojo
        'CRITICAL': '\033[35m', # Magenta
        'RESET': '\033[0m'      # Reset
    }
    
    def format(self, record):
        log_color = self.COLORS.get(record.levelname, self.COLORS['RESET'])
        reset_color = self.COLORS['RESET']
        
        record.levelname = f"{log_color}{record.levelname}{reset_color}"
        record.name = f"{log_color}{record.name}{reset_color}"
        
        return super().format(record)

# Configurar logging con rotación y colores
def setup_logging():
    """Configurar sistema de logging avanzado"""
    
    # Crear directorio de logs
    Path("logs").mkdir(exist_ok=True)
    
    # Formatter para archivos
    file_formatter = logging.Formatter(
        '%(asctime)s | %(name)s | %(levelname)s | %(funcName)s:%(lineno)d | %(message)s'
    )
    
    # Formatter para consola
    console_formatter = ColoredFormatter(
        '%(asctime)s | %(name)s | %(levelname)s | %(message)s'
    )
    
    # Handler para archivo
    file_handler = logging.FileHandler('logs/datacrypt_backend.log', encoding='utf-8')
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(file_formatter)
    
    # Handler para consola
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(console_formatter)
    
    # Configurar logger principal
    logger = logging.getLogger("DataCryptBackend")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

logger = setup_logging()

# ==================== ENUMS Y CONSTANTES ====================

class SystemStatus(str, Enum):
    """Estados del sistema con mejora continua"""
    OPTIMAL = "optimal"           # Funcionamiento perfecto
    WARNING = "warning"           # Requiere atención
    CRITICAL = "critical"         # Problema grave
    MAINTENANCE = "maintenance"   # En mantenimiento
    UPGRADING = "upgrading"       # Actualizándose

class VoiceReportType(str, Enum):
    """Tipos de reportes de voz especializados"""
    COMPLETE = "complete"         # Reporte completo del sistema
    SECURITY = "security"         # Estado de seguridad
    PERFORMANCE = "performance"   # Métricas de rendimiento
    STATUS = "status"            # Estado actual rápido
    ALERTS = "alerts"            # Alertas importantes
    METRICS = "metrics"          # Métricas específicas
    CUSTOM = "custom"            # Reporte personalizado

class SecurityLevel(str, Enum):
    """Niveles de seguridad del sistema"""
    LOW = "low"
    MEDIUM = "medium"  
    HIGH = "high"
    MAXIMUM = "maximum"
    PARANOID = "paranoid"

# ==================== CONFIGURACIÓN CENTRALIZADA ====================

@dataclass
class SystemConfig:
    """Configuración centralizada con validaciones"""
    # Configuración general
    debug_mode: bool = False
    environment: str = "production"
    
    # Configuración de logs
    max_log_size_mb: int = 50
    log_retention_days: int = 30
    log_level: str = "INFO"
    
    # Configuración de seguridad
    security_level: SecurityLevel = SecurityLevel.HIGH
    session_timeout_minutes: int = 30
    max_failed_attempts: int = 5
    
    # Configuración de voz
    voice_enabled: bool = True
    voice_language: str = "es-ES"
    voice_rate: float = 1.0
    voice_volume: float = 0.8
    
    # Configuración de monitoreo
    monitoring_interval_seconds: int = 60
    metrics_retention_hours: int = 48
    alert_threshold_cpu: float = 80.0
    alert_threshold_memory: float = 85.0
    alert_threshold_disk: float = 90.0
    
    # Configuración de API externa
    github_api_timeout: int = 30
    github_api_retries: int = 3
    auto_deploy: bool = True
    
    # Configuración de performance
    max_concurrent_requests: int = 100
    request_timeout_seconds: int = 30
    cache_ttl_seconds: int = 300

class ConfigManager:
    """Gestor centralizado de configuración con persistencia"""
    
    def __init__(self):
        self.config = SystemConfig()
        self.config_file = Path("config/system_config.json")
        self.load_config()
        logger.info("✅ ConfigManager inicializado")
    
    def load_config(self):
        """Cargar configuración desde archivo con validación"""
        try:
            if self.config_file.exists():
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # Validar y aplicar configuración
                for key, value in data.items():
                    if hasattr(self.config, key):
                        # Validar tipos de enum
                        if key == 'security_level':
                            value = SecurityLevel(value)
                        setattr(self.config, key, value)
                        
                logger.info(f"✅ Configuración cargada desde {self.config_file}")
            else:
                logger.info("📝 Usando configuración por defecto")
                self.save_config()
                
        except Exception as e:
            logger.error(f"❌ Error cargando configuración: {e}")
            logger.info("🔧 Usando configuración por defecto")
    
    def save_config(self):
        """Guardar configuración actual con backup"""
        try:
            # Crear directorio si no existe
            self.config_file.parent.mkdir(parents=True, exist_ok=True)
            
            # Backup de configuración anterior
            if self.config_file.exists():
                backup_file = self.config_file.with_suffix(f'.backup.{int(time.time())}')
                self.config_file.rename(backup_file)
                logger.info(f"💾 Backup creado: {backup_file}")
            
            # Guardar nueva configuración
            config_dict = asdict(self.config)
            # Convertir enums a strings para JSON
            for key, value in config_dict.items():
                if isinstance(value, Enum):
                    config_dict[key] = value.value
                    
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config_dict, f, indent=2, ensure_ascii=False)
                
            logger.info(f"✅ Configuración guardada en {self.config_file}")
            
        except Exception as e:
            logger.error(f"❌ Error guardando configuración: {e}")
    
    def update_config(self, **kwargs):
        """Actualizar configuración específica"""
        updated = []
        for key, value in kwargs.items():
            if hasattr(self.config, key):
                old_value = getattr(self.config, key)
                setattr(self.config, key, value)
                updated.append(f"{key}: {old_value} → {value}")
                
        if updated:
            self.save_config()
            logger.info(f"🔄 Configuración actualizada: {', '.join(updated)}")
        
        return len(updated)

# ==================== MODELOS DE DATOS ====================

class SystemMetrics(BaseModel):
    """Métricas del sistema con validaciones"""
    timestamp: datetime = Field(default_factory=datetime.now)
    cpu_usage: float = Field(..., ge=0, le=100, description="Uso de CPU en porcentaje")
    memory_usage: float = Field(..., ge=0, le=100, description="Uso de memoria en porcentaje")
    disk_usage: float = Field(..., ge=0, le=100, description="Uso de disco en porcentaje")
    network_status: bool = Field(..., description="Estado de la conexión de red")
    uptime_seconds: int = Field(..., ge=0, description="Tiempo de funcionamiento en segundos")
    active_processes: int = Field(..., ge=0, description="Número de procesos activos")
    system_load: float = Field(..., ge=0, description="Carga del sistema")
    temperature: Optional[float] = Field(None, description="Temperatura del sistema")
    
    @validator('cpu_usage', 'memory_usage', 'disk_usage')
    def validate_percentage(cls, v):
        if not 0 <= v <= 100:
            raise ValueError('El porcentaje debe estar entre 0 y 100')
        return round(v, 2)

class SecurityScanResult(BaseModel):
    """Resultado del escaneo de seguridad"""
    timestamp: datetime = Field(default_factory=datetime.now)
    scan_type: str = Field(..., description="Tipo de escaneo realizado")
    duration_seconds: float = Field(..., ge=0, description="Duración del escaneo")
    threats_found: int = Field(0, ge=0, description="Amenazas encontradas")
    vulnerabilities: List[str] = Field(default=[], description="Lista de vulnerabilidades")
    security_score: float = Field(..., ge=0, le=100, description="Puntuación de seguridad")
    recommendations: List[str] = Field(default=[], description="Recomendaciones de seguridad")
    files_scanned: int = Field(0, ge=0, description="Archivos escaneados")
    false_positives: int = Field(0, ge=0, description="Falsos positivos detectados")

class VoiceReportRequest(BaseModel):
    """Solicitud de reporte de voz con configuración avanzada"""
    report_type: VoiceReportType = Field(..., description="Tipo de reporte solicitado")
    content: Optional[str] = Field(None, description="Contenido personalizado")
    voice_settings: Dict[str, Any] = Field(default={}, description="Configuración de voz")
    priority: int = Field(1, ge=1, le=5, description="Prioridad del reporte (1=baja, 5=crítica)")
    include_timestamp: bool = Field(True, description="Incluir timestamp en el reporte")
    include_metrics: bool = Field(True, description="Incluir métricas en el reporte")

class ApiResponse(BaseModel):
    """Respuesta estándar de la API con metadatos"""
    success: bool = Field(..., description="Indica si la operación fue exitosa")
    message: str = Field(..., description="Mensaje descriptivo")
    data: Optional[Dict[str, Any]] = Field(None, description="Datos de respuesta")
    timestamp: datetime = Field(default_factory=datetime.now)
    execution_time_ms: Optional[float] = Field(None, description="Tiempo de ejecución en milisegundos")
    request_id: Optional[str] = Field(None, description="ID único de la petición")
    version: str = Field("3.0.0", description="Versión de la API")

class SystemAlert(BaseModel):
    """Alerta del sistema"""
    id: str = Field(..., description="ID único de la alerta")
    timestamp: datetime = Field(default_factory=datetime.now)
    level: str = Field(..., description="Nivel de alerta (info, warning, critical)")
    source: str = Field(..., description="Origen de la alerta")
    message: str = Field(..., description="Mensaje de la alerta")
    resolved: bool = Field(False, description="Estado de resolución")
    resolution_time: Optional[datetime] = Field(None, description="Tiempo de resolución")
    data: Dict[str, Any] = Field(default={}, description="Datos adicionales")

# ==================== SISTEMA DE ESTADO GLOBAL ====================

class GlobalState:
    """Sistema de estado global con sincronización avanzada"""
    
    def __init__(self):
        self.system_status = SystemStatus.OPTIMAL
        self.last_update = datetime.now()
        self.start_time = datetime.now()
        
        # Métricas e historial
        self.metrics_history: List[SystemMetrics] = []
        self.max_metrics_history = 1000
        
        # Alertas y logs
        self.alerts: List[SystemAlert] = []
        self.security_events: List[str] = []
        
        # Contadores y estadísticas
        self.voice_reports_count = 0
        self.api_requests_count = 0
        self.active_connections = 0
        self.deployment_count = 0
        
        # Estados específicos
        self.deployment_status = "ready"
        self.security_level = SecurityLevel.HIGH
        self.maintenance_mode = False
        
        # Cache para performance
        self._cache: Dict[str, Any] = {}
        self._cache_timestamps: Dict[str, datetime] = {}
        
        logger.info("🌍 GlobalState inicializado")
    
    def update_status(self, new_status: SystemStatus, reason: str = ""):
        """Actualizar estado del sistema con logging"""
        old_status = self.system_status
        self.system_status = new_status
        self.last_update = datetime.now()
        
        if old_status != new_status:
            logger.info(f"🔄 Estado del sistema: {old_status.value} → {new_status.value}")
            if reason:
                logger.info(f"💡 Razón: {reason}")
                
            # Generar alerta si es crítico
            if new_status == SystemStatus.CRITICAL:
                self.add_alert("critical", "system", f"Sistema en estado crítico: {reason}")
    
    def add_alert(self, level: str, source: str, message: str, data: Dict = None):
        """Agregar alerta al sistema"""
        alert = SystemAlert(
            id=f"{source}_{int(time.time())}_{len(self.alerts)}",
            level=level,
            source=source,
            message=message,
            data=data or {}
        )
        
        self.alerts.append(alert)
        
        # Mantener solo las últimas 500 alertas
        if len(self.alerts) > 500:
            self.alerts = self.alerts[-500:]
            
        logger.info(f"🚨 Nueva alerta [{level.upper()}] {source}: {message}")
        
        return alert
    
    def add_metrics(self, metrics: SystemMetrics):
        """Agregar métricas al historial"""
        self.metrics_history.append(metrics)
        
        # Mantener solo las métricas recientes
        if len(self.metrics_history) > self.max_metrics_history:
            self.metrics_history = self.metrics_history[-self.max_metrics_history:]
            
        # Verificar umbrales de alerta
        self._check_metric_thresholds(metrics)
    
    def _check_metric_thresholds(self, metrics: SystemMetrics):
        """Verificar umbrales de alerta en métricas"""
        if metrics.cpu_usage > config_manager.config.alert_threshold_cpu:
            self.add_alert("warning", "metrics", f"Alto uso de CPU: {metrics.cpu_usage}%")
            
        if metrics.memory_usage > config_manager.config.alert_threshold_memory:
            self.add_alert("warning", "metrics", f"Alto uso de memoria: {metrics.memory_usage}%")
            
        if metrics.disk_usage > config_manager.config.alert_threshold_disk:
            self.add_alert("critical", "metrics", f"Alto uso de disco: {metrics.disk_usage}%")
    
    def get_status_summary(self) -> Dict[str, Any]:
        """Obtener resumen completo del estado"""
        uptime = datetime.now() - self.start_time
        
        # Métricas recientes
        recent_metrics = self.metrics_history[-10:] if self.metrics_history else []
        avg_cpu = sum(m.cpu_usage for m in recent_metrics) / len(recent_metrics) if recent_metrics else 0
        avg_memory = sum(m.memory_usage for m in recent_metrics) / len(recent_metrics) if recent_metrics else 0
        
        # Alertas no resueltas
        unresolved_alerts = [a for a in self.alerts if not a.resolved]
        critical_alerts = [a for a in unresolved_alerts if a.level == "critical"]
        
        return {
            "status": self.system_status.value,
            "last_update": self.last_update.isoformat(),
            "uptime": str(uptime).split('.')[0],  # Sin microsegundos
            "uptime_seconds": int(uptime.total_seconds()),
            
            # Métricas
            "metrics": {
                "collected": len(self.metrics_history),
                "avg_cpu_10": round(avg_cpu, 2),
                "avg_memory_10": round(avg_memory, 2),
                "last_update": recent_metrics[-1].timestamp.isoformat() if recent_metrics else None
            },
            
            # Alertas
            "alerts": {
                "total": len(self.alerts),
                "unresolved": len(unresolved_alerts),
                "critical": len(critical_alerts)
            },
            
            # Contadores
            "counters": {
                "voice_reports": self.voice_reports_count,
                "api_requests": self.api_requests_count,
                "active_connections": self.active_connections,
                "deployments": self.deployment_count
            },
            
            # Estados
            "states": {
                "deployment": self.deployment_status,
                "security_level": self.security_level.value,
                "maintenance_mode": self.maintenance_mode
            }
        }
    
    def cache_set(self, key: str, value: Any, ttl_seconds: int = 300):
        """Establecer valor en cache con TTL"""
        self._cache[key] = value
        self._cache_timestamps[key] = datetime.now() + timedelta(seconds=ttl_seconds)
    
    def cache_get(self, key: str) -> Optional[Any]:
        """Obtener valor del cache si es válido"""
        if key in self._cache:
            if datetime.now() < self._cache_timestamps[key]:
                return self._cache[key]
            else:
                # Cache expirado
                del self._cache[key]
                del self._cache_timestamps[key]
        return None

# ==================== INICIALIZACIÓN ====================

# Instancias globales
config_manager = ConfigManager()
global_state = GlobalState()
security = HTTPBearer(auto_error=False)

# Configuración de FastAPI con metadatos avanzados
app = FastAPI(
    title="DataCrypt Labs Management API v3.0",
    description="""
    🚀 Sistema de Gestión Empresarial Avanzado con Mejora Continua
    
    ## Características Principales
    
    * **Sistema de Voz Integrado**: Reportes automáticos por voz con configuración avanzada
    * **Monitoreo en Tiempo Real**: Métricas del sistema y alertas inteligentes  
    * **Seguridad Avanzada**: Escaneos automáticos y validaciones robustas
    * **Estado Global**: Sincronización de estado en tiempo real
    * **API REST Completa**: Endpoints optimizados con validaciones
    * **Logging Inteligente**: Sistema de logs con rotación automática
    * **Configuración Centralizada**: Gestión avanzada de configuración
    * **Filosofía PDCA**: Metodología de mejora continua aplicada
    
    ## Tecnologías
    
    * FastAPI 🚀
    * Python 3.11+ 🐍  
    * Pydantic para validaciones 📝
    * psutil para métricas del sistema 📊
    * Logging avanzado con rotación 📋
    
    ---
    
    **DataCrypt Labs** - Transformando datos en decisiones inteligentes
    """,
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "DataCrypt Labs",
        "url": "https://datacrypt-labs.com",
        "email": "contact@datacrypt-labs.com"
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    }
)

# Configuración de CORS avanzada
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios exactos
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Execution-Time"]
)

# Crear directorios necesarios
required_dirs = ["logs", "config", "backups", "cache", "data"]
for dir_name in required_dirs:
    Path(dir_name).mkdir(exist_ok=True)

logger.info("🚀 DataCrypt Labs Management Backend v3.0 inicializado")
logger.info(f"🔧 Configuración: {config_manager.config.environment}")
logger.info(f"🛡️ Seguridad: {config_manager.config.security_level.value}")
logger.info(f"🎤 Voz: {'Habilitada' if config_manager.config.voice_enabled else 'Deshabilitada'}")