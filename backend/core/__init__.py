"""
🏗️ DATACRYPT LABS - CORE SYSTEM
Núcleo del sistema con middleware, dependencias y utilidades
Filosofía Mejora Continua: Arquitectura robusta y escalable
"""

import time
import uuid
import asyncio
from typing import Dict, Any, Optional, Callable
from datetime import datetime
from functools import wraps

from fastapi import Request, Response, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware

from backend.config.settings import get_settings
from backend.utils.logger import get_logger
from backend.services import get_auth_service
from backend.models import AdminUser, RequestMetadata

settings = get_settings()
logger = get_logger(__name__)

# ===== MIDDLEWARE =====

class RequestTrackingMiddleware(BaseHTTPMiddleware):
    """Middleware para tracking de requests"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate request ID
        request_id = str(uuid.uuid4())
        start_time = time.time()
        
        # Add request ID to request state
        request.state.request_id = request_id
        request.state.start_time = start_time
        
        # Log request
        logger.info(
            "Request started",
            extra={
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url),
                "client_ip": request.client.host if request.client else None,
                "user_agent": request.headers.get("user-agent")
            }
        )
        
        try:
            # Process request
            response = await call_next(request)
            
            # Calculate execution time
            execution_time = (time.time() - start_time) * 1000  # ms
            
            # Add headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Execution-Time"] = f"{execution_time:.2f}ms"
            
            # Log response
            logger.info(
                "Request completed",
                extra={
                    "request_id": request_id,
                    "status_code": response.status_code,
                    "execution_time_ms": execution_time
                }
            )
            
            return response
            
        except Exception as e:
            execution_time = (time.time() - start_time) * 1000
            
            # Log error
            logger.error(
                "Request failed",
                extra={
                    "request_id": request_id,
                    "error": str(e),
                    "execution_time_ms": execution_time
                }
            )
            
            raise

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware para headers de seguridad"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Only add HSTS in production
        if settings.ENVIRONMENT == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware básico de rate limiting"""
    
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients = {}
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        client_ip = request.client.host if request.client else "unknown"
        current_time = time.time()
        
        # Clean old entries
        self.clients = {
            ip: times for ip, times in self.clients.items()
            if any(t > current_time - self.period for t in times)
        }
        
        # Check rate limit
        if client_ip in self.clients:
            self.clients[client_ip] = [
                t for t in self.clients[client_ip]
                if t > current_time - self.period
            ]
            
            if len(self.clients[client_ip]) >= self.calls:
                logger.warning(f"Rate limit exceeded for IP: {client_ip}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded"
                )
        else:
            self.clients[client_ip] = []
        
        # Add current request
        self.clients[client_ip].append(current_time)
        
        return await call_next(request)

# ===== DEPENDENCIES =====

security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[AdminUser]:
    """Dependency para obtener usuario actual"""
    if not credentials:
        return None
    
    auth_service = get_auth_service()
    payload = auth_service.verify_token(credentials.credentials)
    
    if not payload:
        return None
    
    # Get user from database
    try:
        # This would typically fetch from database
        # For now, return from token payload
        return AdminUser(
            id=payload.get("sub"),
            username=payload.get("username", "unknown"),
            email=payload.get("email", ""),
            is_active=True,
            is_superuser=payload.get("is_superuser", False),
            created_at=datetime.utcnow(),
            permissions=payload.get("permissions", [])
        )
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        return None

async def require_auth(
    current_user: Optional[AdminUser] = Depends(get_current_user)
) -> AdminUser:
    """Dependency que requiere autenticación"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

async def require_admin(
    current_user: AdminUser = Depends(require_auth)
) -> AdminUser:
    """Dependency que requiere permisos de admin"""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

def require_permission(permission: str):
    """Dependency factory para requerir permisos específicos"""
    async def _require_permission(
        current_user: AdminUser = Depends(require_auth)
    ) -> AdminUser:
        if permission not in current_user.permissions and not current_user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission}' required"
            )
        return current_user
    
    return _require_permission

async def get_request_metadata(request: Request) -> RequestMetadata:
    """Dependency para obtener metadata del request"""
    return RequestMetadata(
        request_id=getattr(request.state, 'request_id', str(uuid.uuid4())),
        timestamp=datetime.utcnow(),
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        endpoint=str(request.url.path),
        method=request.method,
        execution_time_ms=None  # Will be set by middleware
    )

# ===== DECORATORS =====

def async_retry(max_retries: int = 3, delay: float = 1.0):
    """Decorator para retry automático"""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(max_retries):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_retries - 1:
                        logger.warning(f"Retry {attempt + 1}/{max_retries} for {func.__name__}: {e}")
                        await asyncio.sleep(delay * (2 ** attempt))  # Exponential backoff
                    else:
                        logger.error(f"All retries failed for {func.__name__}: {e}")
            
            raise last_exception
        
        return wrapper
    return decorator

def cache_result(ttl_seconds: int = 300):
    """Decorator para cache simple en memoria"""
    cache = {}
    
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Create cache key
            cache_key = f"{func.__name__}:{hash(str(args) + str(sorted(kwargs.items())))}"
            current_time = time.time()
            
            # Check cache
            if cache_key in cache:
                result, timestamp = cache[cache_key]
                if current_time - timestamp < ttl_seconds:
                    logger.debug(f"Cache hit for {func.__name__}")
                    return result
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Store in cache
            cache[cache_key] = (result, current_time)
            
            # Clean old entries (simple cleanup)
            cache_keys_to_remove = [
                key for key, (_, timestamp) in cache.items()
                if current_time - timestamp > ttl_seconds
            ]
            for key in cache_keys_to_remove:
                del cache[key]
            
            logger.debug(f"Cache miss for {func.__name__}, result cached")
            return result
        
        return wrapper
    return decorator

def validate_localhost_only():
    """Decorator para validar que el request venga solo de localhost"""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            client_host = request.client.host if request.client else None
            
            # Check if localhost
            localhost_ips = ["127.0.0.1", "::1", "localhost"]
            if client_host not in localhost_ips:
                logger.warning(f"Non-localhost access attempt from: {client_host}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access restricted to localhost only"
                )
            
            return await func(request, *args, **kwargs)
        
        return wrapper
    return decorator

# ===== UTILITIES =====

class ResponseCache:
    """Cache simple para responses"""
    
    def __init__(self, default_ttl: int = 300):
        self.cache = {}
        self.default_ttl = default_ttl
    
    def get(self, key: str) -> Optional[Any]:
        """Obtiene valor del cache"""
        if key in self.cache:
            value, timestamp = self.cache[key]
            if time.time() - timestamp < self.default_ttl:
                return value
            else:
                del self.cache[key]
        return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Establece valor en cache"""
        self.cache[key] = (value, time.time())
    
    def invalidate(self, pattern: str = None) -> None:
        """Invalida cache por patrón"""
        if pattern:
            keys_to_remove = [key for key in self.cache.keys() if pattern in key]
            for key in keys_to_remove:
                del self.cache[key]
        else:
            self.cache.clear()

# Global cache instance
response_cache = ResponseCache()

# ===== EXCEPTION HANDLERS =====

async def validation_exception_handler(request: Request, exc: Exception):
    """Handler para errores de validación"""
    logger.error(f"Validation error: {exc}")
    return {
        "status": "error",
        "message": "Validation failed",
        "details": str(exc),
        "timestamp": datetime.utcnow().isoformat()
    }

async def generic_exception_handler(request: Request, exc: Exception):
    """Handler genérico para excepciones"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    logger.error(
        f"Unhandled exception: {exc}",
        extra={"request_id": request_id}
    )
    
    return {
        "status": "error",
        "message": "Internal server error",
        "request_id": request_id,
        "timestamp": datetime.utcnow().isoformat()
    }

# Export
__all__ = [
    # Middleware
    "RequestTrackingMiddleware", "SecurityHeadersMiddleware", "RateLimitMiddleware",
    # Dependencies
    "get_current_user", "require_auth", "require_admin", "require_permission",
    "get_request_metadata",
    # Decorators
    "async_retry", "cache_result", "validate_localhost_only",
    # Utilities
    "ResponseCache", "response_cache",
    # Exception handlers
    "validation_exception_handler", "generic_exception_handler"
]