"""
🔐 DATACRYPT LABS - AUTHENTICATION API
Rutas de autenticación y autorización
Filosofía Mejora Continua: Seguridad robusta y UX optimizada
"""

from fastapi import APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer
from datetime import datetime

from backend.models import (
    AdminLoginRequest, AdminTokenResponse, AdminUser,
    SuccessResponse, ErrorResponse, RequestMetadata
)
from backend.services import get_auth_service
from backend.core import get_current_user, get_request_metadata, validate_localhost_only
from backend.utils.logger import get_logger

router = APIRouter()
security = HTTPBearer(auto_error=False)
logger = get_logger(__name__)

@router.post("/login", response_model=AdminTokenResponse)
@validate_localhost_only()
async def login(
    request: Request,
    login_data: AdminLoginRequest,
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> AdminTokenResponse:
    """
    🔑 Autenticación de usuario administrador
    
    Valida credenciales y genera token JWT para acceso al sistema.
    Restricción: Solo accesible desde localhost.
    """
    try:
        auth_service = get_auth_service()
        
        # Authenticate user
        user = await auth_service.authenticate_user(
            login_data.username, 
            login_data.password
        )
        
        if not user:
            logger.warning(
                f"Failed login attempt for user: {login_data.username}",
                extra={"ip": metadata.ip_address, "user_agent": metadata.user_agent}
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Create access token
        token_data = {
            "sub": user.id,
            "username": user.username,
            "email": user.email,
            "is_superuser": user.is_superuser,
            "permissions": user.permissions
        }
        
        access_token = auth_service.create_access_token(token_data)
        
        logger.info(
            f"Successful login: {user.username}",
            extra={
                "user_id": user.id,
                "ip": metadata.ip_address,
                "request_id": metadata.request_id
            }
        )
        
        return AdminTokenResponse(
            status="success",
            message="Login successful",
            access_token=access_token,
            token_type="bearer",
            expires_in=auth_service.access_token_expire * 60,  # Convert to seconds
            user_info=user
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service error"
        )

@router.post("/logout", response_model=SuccessResponse)
async def logout(
    current_user: AdminUser = Depends(get_current_user),
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    🚪 Cerrar sesión
    
    Invalida el token actual (en una implementación completa).
    Por ahora solo registra el evento.
    """
    try:
        if current_user:
            logger.info(
                f"User logout: {current_user.username}",
                extra={
                    "user_id": current_user.id,
                    "request_id": metadata.request_id
                }
            )
        
        return SuccessResponse(
            status="success",
            message="Logout successful"
        )
        
    except Exception as e:
        logger.error(f"Logout error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout service error"
        )

@router.get("/me", response_model=AdminUser)
async def get_current_user_info(
    current_user: AdminUser = Depends(get_current_user)
) -> AdminUser:
    """
    👤 Información del usuario actual
    
    Retorna información del usuario autenticado.
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    return current_user

@router.post("/verify", response_model=SuccessResponse)
async def verify_token(
    current_user: AdminUser = Depends(get_current_user)
) -> SuccessResponse:
    """
    ✅ Verificar token
    
    Verifica si el token actual es válido.
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    return SuccessResponse(
        status="success",
        message="Token is valid",
        data={
            "user_id": current_user.id,
            "username": current_user.username,
            "is_superuser": current_user.is_superuser
        }
    )

@router.get("/permissions", response_model=SuccessResponse)
async def get_user_permissions(
    current_user: AdminUser = Depends(get_current_user)
) -> SuccessResponse:
    """
    🛡️ Permisos del usuario
    
    Retorna los permisos del usuario actual.
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    return SuccessResponse(
        status="success",
        message="User permissions retrieved",
        data={
            "user_id": current_user.id,
            "username": current_user.username,
            "is_superuser": current_user.is_superuser,
            "permissions": current_user.permissions,
            "has_admin_access": current_user.is_superuser or "admin" in current_user.permissions
        }
    )