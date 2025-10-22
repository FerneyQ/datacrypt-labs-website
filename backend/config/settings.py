"""
🔧 DATACRYPT LABS - CONFIGURATION SYSTEM
Sistema de configuración centralizado con Pydantic Settings
Filosofía Mejora Continua: Type-safe, environment-aware config
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Dict, Any
import json
import os
from pathlib import Path

class Settings(BaseSettings):
    """Configuración principal del sistema"""
    
    # ===== API CONFIGURATION =====
    api_title: str = Field(default="DataCrypt Labs API", env="API_TITLE")
    api_description: str = Field(
        default="Backend Python con análisis de datos, ML y crypto integration",
        env="API_DESCRIPTION"
    )
    api_version: str = Field(default="3.0.0", env="API_VERSION")
    api_host: str = Field(default="127.0.0.1", env="API_HOST")
    api_port: int = Field(default=8000, env="API_PORT")
    
    # ===== ENVIRONMENT =====
    environment: str = Field(default="local", env="ENVIRONMENT")  # local, dev, staging, prod
    debug: bool = Field(default=True, env="DEBUG")
    is_production: bool = Field(default=False, env="PRODUCTION")
    
    # ===== SECURITY =====
    secret_key: str = Field(default="datacrypt-ultra-secure-key-2025-local", env="SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", env="JWT_ALGORITHM")
    jwt_expire_minutes: int = Field(default=60, env="JWT_EXPIRE_MINUTES")
    password_hash_rounds: int = Field(default=150000, env="PASSWORD_HASH_ROUNDS")
    
    # ===== CORS CONFIGURATION =====
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:8000", "http://127.0.0.1:8000"],
        env="CORS_ORIGINS"
    )
    cors_methods: List[str] = Field(
        default=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        env="CORS_METHODS"
    )
    cors_headers: List[str] = Field(default=["*"], env="CORS_HEADERS")
    cors_credentials: bool = Field(default=True, env="CORS_CREDENTIALS")
    
    # ===== DATABASE =====
    database_url: str = Field(default="sqlite:///./datacrypt_admin.db", env="DATABASE_URL")
    database_echo: bool = Field(default=False, env="DATABASE_ECHO")
    database_pool_size: int = Field(default=10, env="DATABASE_POOL_SIZE")
    
    # ===== LOGGING =====
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_file: str = Field(default="./data/logs/datacrypt_api.log", env="LOG_FILE")
    log_max_size: int = Field(default=10 * 1024 * 1024, env="LOG_MAX_SIZE")  # 10MB
    log_backup_count: int = Field(default=5, env="LOG_BACKUP_COUNT")
    
    # ===== CACHE =====
    cache_enabled: bool = Field(default=True, env="CACHE_ENABLED")
    cache_ttl_seconds: int = Field(default=300, env="CACHE_TTL_SECONDS")  # 5 minutes
    cache_max_size: int = Field(default=1000, env="CACHE_MAX_SIZE")
    
    # ===== API FEATURES =====
    enable_docs: bool = Field(default=True, env="ENABLE_DOCS")
    enable_redoc: bool = Field(default=True, env="ENABLE_REDOC")
    enable_admin: bool = Field(default=True, env="ENABLE_ADMIN")
    enable_ml_endpoints: bool = Field(default=True, env="ENABLE_ML_ENDPOINTS")
    enable_crypto_data: bool = Field(default=True, env="ENABLE_CRYPTO_DATA")
    
    # ===== PERFORMANCE =====
    max_request_size: int = Field(default=10 * 1024 * 1024, env="MAX_REQUEST_SIZE")  # 10MB
    request_timeout: int = Field(default=30, env="REQUEST_TIMEOUT")  # 30 seconds
    worker_processes: int = Field(default=1, env="WORKER_PROCESSES")
    
    # ===== RATE LIMITING =====
    rate_limit_enabled: bool = Field(default=True, env="RATE_LIMIT_ENABLED")
    rate_limit_requests: int = Field(default=100, env="RATE_LIMIT_REQUESTS")
    rate_limit_window: int = Field(default=60, env="RATE_LIMIT_WINDOW")  # 60 seconds
    
    # ===== EXTERNAL APIs =====
    crypto_api_key: str = Field(default="", env="CRYPTO_API_KEY")
    crypto_api_url: str = Field(default="https://api.coingecko.com/api/v3", env="CRYPTO_API_URL")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    def get_cors_origins_list(self) -> List[str]:
        """Convierte CORS origins string a lista si es necesario"""
        if isinstance(self.cors_origins, str):
            return json.loads(self.cors_origins)
        return self.cors_origins

    def get_cors_methods_list(self) -> List[str]:
        """Convierte CORS methods string a lista si es necesario"""
        if isinstance(self.cors_methods, str):
            return json.loads(self.cors_methods)
        return self.cors_methods

    def get_cors_headers_list(self) -> List[str]:
        """Convierte CORS headers string a lista si es necesario"""
        if isinstance(self.cors_headers, str):
            return json.loads(self.cors_headers)
        return self.cors_headers

    def is_development(self) -> bool:
        """Verifica si estamos en desarrollo"""
        return self.environment in ["local", "dev", "development"]

    def is_localhost_only(self) -> bool:
        """Verifica si el sistema está configurado solo para localhost"""
        return self.api_host in ["127.0.0.1", "localhost"] and self.is_development()

    def get_database_path(self) -> Path:
        """Obtiene la ruta de la base de datos"""
        if self.database_url.startswith("sqlite:///"):
            db_path = self.database_url.replace("sqlite:///", "")
            return Path(db_path)
        return Path("./datacrypt_admin.db")

    def ensure_directories(self):
        """Crea directorios necesarios"""
        directories = [
            Path(self.log_file).parent,
            Path("./data/cache"),
            Path("./data/backups"),
            self.get_database_path().parent
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)

# Instancia global de configuración
settings = Settings()

# Asegurar que existen los directorios necesarios
settings.ensure_directories()

def get_settings() -> Settings:
    """Obtener instancia de configuración"""
    return settings

# Export para importación fácil
__all__ = ["settings", "Settings"]