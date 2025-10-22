"""
🔧 DATACRYPT LABS - CORE SERVICES
Servicios centrales del sistema
Filosofía Mejora Continua: Separación de responsabilidades y reutilización
"""

import sqlite3
import hashlib
import secrets
import jwt
import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
from pathlib import Path
from contextlib import asynccontextmanager
from functools import wraps

from backend.config.settings import get_settings
from backend.utils.logger import get_logger
from backend.models import (
    AdminUser, ContactMessage, GameScore, 
    PortfolioProject, CryptoPrice, HealthStatus,
    MLPredictionRequest, DataAnalysisRequest
)

settings = get_settings()
logger = get_logger(__name__)

# ===== DATABASE SERVICE =====

class DatabaseService:
    """Servicio de base de datos con gestión de conexiones"""
    
    def __init__(self):
        self.db_path = settings.DATABASE_PATH
        self._ensure_database_exists()
    
    def _ensure_database_exists(self):
        """Asegura que la base de datos y tablas existan"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute("SELECT 1")
            logger.info(f"Database connected successfully: {self.db_path}")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    @asynccontextmanager
    async def get_connection(self):
        """Context manager para conexiones async"""
        conn = None
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row  # Enable dict-like access
            yield conn
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    async def execute_query(self, query: str, params: tuple = ()) -> List[Dict]:
        """Ejecuta query y retorna resultados"""
        async with self.get_connection() as conn:
            cursor = conn.execute(query, params)
            return [dict(row) for row in cursor.fetchall()]
    
    async def execute_insert(self, query: str, params: tuple = ()) -> int:
        """Ejecuta insert y retorna lastrowid"""
        async with self.get_connection() as conn:
            cursor = conn.execute(query, params)
            conn.commit()
            return cursor.lastrowid
    
    async def execute_update(self, query: str, params: tuple = ()) -> int:
        """Ejecuta update y retorna affected rows"""
        async with self.get_connection() as conn:
            cursor = conn.execute(query, params)
            conn.commit()
            return cursor.rowcount

# ===== AUTHENTICATION SERVICE =====

class AuthService:
    """Servicio de autenticación JWT"""
    
    def __init__(self):
        self.secret_key = settings.SECRET_KEY
        self.algorithm = settings.JWT_ALGORITHM
        self.access_token_expire = settings.JWT_EXPIRE_MINUTES
        self.db = DatabaseService()
    
    def _hash_password(self, password: str, salt: Optional[str] = None) -> tuple[str, str]:
        """Hash password with PBKDF2"""
        if salt is None:
            salt = secrets.token_hex(32)
        
        password_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            settings.PASSWORD_HASH_ITERATIONS
        )
        return password_hash.hex(), salt
    
    def _verify_password(self, password: str, password_hash: str, salt: str) -> bool:
        """Verifica password contra hash"""
        computed_hash, _ = self._hash_password(password, salt)
        return secrets.compare_digest(computed_hash, password_hash)
    
    def create_access_token(self, data: Dict[str, Any]) -> str:
        """Crea JWT token"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire)
        to_encode.update({"exp": expire})
        
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verifica JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token expired")
            return None
        except jwt.JWTError as e:
            logger.warning(f"Token validation failed: {e}")
            return None
    
    async def authenticate_user(self, username: str, password: str) -> Optional[AdminUser]:
        """Autentica usuario"""
        try:
            query = """
            SELECT id, username, email, password_hash, salt, is_active, 
                   is_superuser, created_at, last_login, permissions
            FROM admin_users 
            WHERE username = ? AND is_active = 1
            """
            results = await self.db.execute_query(query, (username,))
            
            if not results:
                logger.warning(f"User not found: {username}")
                return None
            
            user_data = results[0]
            
            if not self._verify_password(password, user_data['password_hash'], user_data['salt']):
                logger.warning(f"Invalid password for user: {username}")
                return None
            
            # Update last login
            await self.db.execute_update(
                "UPDATE admin_users SET last_login = ? WHERE id = ?",
                (datetime.utcnow().isoformat(), user_data['id'])
            )
            
            # Parse permissions
            permissions = json.loads(user_data.get('permissions', '[]'))
            
            return AdminUser(
                id=user_data['id'],
                username=user_data['username'],
                email=user_data['email'],
                is_active=bool(user_data['is_active']),
                is_superuser=bool(user_data['is_superuser']),
                created_at=datetime.fromisoformat(user_data['created_at']),
                last_login=datetime.fromisoformat(user_data['last_login']) if user_data['last_login'] else None,
                permissions=permissions
            )
            
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return None

# ===== CONTACT SERVICE =====

class ContactService:
    """Servicio de manejo de contactos"""
    
    def __init__(self):
        self.db = DatabaseService()
    
    async def save_message(self, message: ContactMessage) -> bool:
        """Guarda mensaje de contacto"""
        try:
            query = """
            INSERT INTO contact_messages (name, email, message, timestamp, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)
            """
            await self.db.execute_insert(query, (
                message.name,
                message.email,
                message.message,
                message.timestamp.isoformat(),
                message.ip_address,
                message.user_agent
            ))
            
            logger.info(f"Contact message saved from: {message.email}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving contact message: {e}")
            return False
    
    async def get_messages(self, limit: int = 50) -> List[ContactMessage]:
        """Obtiene mensajes de contacto"""
        try:
            query = """
            SELECT * FROM contact_messages 
            ORDER BY timestamp DESC 
            LIMIT ?
            """
            results = await self.db.execute_query(query, (limit,))
            
            return [
                ContactMessage(
                    name=row['name'],
                    email=row['email'],
                    message=row['message'],
                    timestamp=datetime.fromisoformat(row['timestamp']),
                    ip_address=row['ip_address'],
                    user_agent=row['user_agent']
                )
                for row in results
            ]
            
        except Exception as e:
            logger.error(f"Error getting contact messages: {e}")
            return []

# ===== GAME SERVICE =====

class GameService:
    """Servicio de juegos y puntuaciones"""
    
    def __init__(self):
        self.db = DatabaseService()
    
    async def save_score(self, score: GameScore) -> bool:
        """Guarda puntuación"""
        try:
            query = """
            INSERT INTO game_scores (player_name, score, level, timestamp)
            VALUES (?, ?, ?, ?)
            """
            await self.db.execute_insert(query, (
                score.player_name,
                score.score,
                score.level,
                score.timestamp.isoformat()
            ))
            
            logger.info(f"Game score saved: {score.player_name} - {score.score}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving game score: {e}")
            return False
    
    async def get_leaderboard(self, limit: int = 10) -> List[GameScore]:
        """Obtiene tabla de líderes"""
        try:
            query = """
            SELECT * FROM game_scores 
            ORDER BY score DESC, timestamp ASC 
            LIMIT ?
            """
            results = await self.db.execute_query(query, (limit,))
            
            return [
                GameScore(
                    player_name=row['player_name'],
                    score=row['score'],
                    level=row['level'],
                    timestamp=datetime.fromisoformat(row['timestamp'])
                )
                for row in results
            ]
            
        except Exception as e:
            logger.error(f"Error getting leaderboard: {e}")
            return []

# ===== PORTFOLIO SERVICE =====

class PortfolioService:
    """Servicio de portfolio"""
    
    def __init__(self):
        self.db = DatabaseService()
    
    async def get_projects(self, featured_only: bool = False) -> List[PortfolioProject]:
        """Obtiene proyectos del portfolio"""
        try:
            query = """
            SELECT * FROM portfolio_projects 
            WHERE (? = 0 OR featured = 1)
            ORDER BY created_date DESC
            """
            results = await self.db.execute_query(query, (1 if featured_only else 0,))
            
            return [
                PortfolioProject(
                    id=row['id'],
                    title=row['title'],
                    description=row['description'],
                    technologies=json.loads(row['technologies']),
                    category=row['category'],
                    url=row['url'],
                    github_url=row['github_url'],
                    image_url=row['image_url'],
                    featured=bool(row['featured']),
                    created_date=datetime.fromisoformat(row['created_date']),
                    last_updated=datetime.fromisoformat(row['last_updated']) if row['last_updated'] else None
                )
                for row in results
            ]
            
        except Exception as e:
            logger.error(f"Error getting portfolio projects: {e}")
            return []

# ===== HEALTH SERVICE =====

class HealthService:
    """Servicio de monitoreo de salud"""
    
    def __init__(self):
        self.db = DatabaseService()
        self.start_time = datetime.utcnow()
    
    async def get_health_status(self) -> HealthStatus:
        """Obtiene estado de salud del sistema"""
        try:
            # Test database
            db_status = "healthy"
            try:
                await self.db.execute_query("SELECT 1")
            except:
                db_status = "unhealthy"
            
            # Calculate uptime
            uptime = (datetime.utcnow() - self.start_time).total_seconds()
            
            return HealthStatus(
                status="healthy" if db_status == "healthy" else "degraded",
                uptime=uptime,
                version=settings.VERSION,
                environment=settings.ENVIRONMENT,
                database_status=db_status,
                cache_status="not_implemented",
                dependencies={
                    "sqlite": db_status,
                    "jwt": "healthy",
                    "fastapi": "healthy"
                }
            )
            
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return HealthStatus(
                status="unhealthy",
                uptime=0,
                version=settings.VERSION,
                environment=settings.ENVIRONMENT,
                database_status="unhealthy",
                cache_status="unknown",
                dependencies={}
            )

# ===== SERVICE FACTORY =====

class ServiceFactory:
    """Factory para servicios del sistema"""
    
    _instances = {}
    
    @classmethod
    def get_auth_service(cls) -> AuthService:
        if 'auth' not in cls._instances:
            cls._instances['auth'] = AuthService()
        return cls._instances['auth']
    
    @classmethod
    def get_contact_service(cls) -> ContactService:
        if 'contact' not in cls._instances:
            cls._instances['contact'] = ContactService()
        return cls._instances['contact']
    
    @classmethod
    def get_game_service(cls) -> GameService:
        if 'game' not in cls._instances:
            cls._instances['game'] = GameService()
        return cls._instances['game']
    
    @classmethod
    def get_portfolio_service(cls) -> PortfolioService:
        if 'portfolio' not in cls._instances:
            cls._instances['portfolio'] = PortfolioService()
        return cls._instances['portfolio']
    
    @classmethod
    def get_health_service(cls) -> HealthService:
        if 'health' not in cls._instances:
            cls._instances['health'] = HealthService()
        return cls._instances['health']
    
    @classmethod
    def get_database_service(cls) -> DatabaseService:
        if 'database' not in cls._instances:
            cls._instances['database'] = DatabaseService()
        return cls._instances['database']

# Funciones de conveniencia
def get_auth_service() -> AuthService:
    return ServiceFactory.get_auth_service()

def get_contact_service() -> ContactService:
    return ServiceFactory.get_contact_service()

def get_game_service() -> GameService:
    return ServiceFactory.get_game_service()

def get_portfolio_service() -> PortfolioService:
    return ServiceFactory.get_portfolio_service()

def get_health_service() -> HealthService:
    return ServiceFactory.get_health_service()

def get_database_service() -> DatabaseService:
    return ServiceFactory.get_database_service()

# Export
__all__ = [
    "DatabaseService", "AuthService", "ContactService", 
    "GameService", "PortfolioService", "HealthService",
    "ServiceFactory",
    "get_auth_service", "get_contact_service", "get_game_service",
    "get_portfolio_service", "get_health_service", "get_database_service"
]