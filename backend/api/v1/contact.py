"""
📧 DATACRYPT LABS - CONTACT API
Rutas para sistema de contacto
Filosofía Mejora Continua: Comunicación efectiva y seguimiento
"""

from fastapi import APIRouter, HTTPException, Depends, Request, status
from typing import List

from backend.models import (
    ContactMessage, SuccessResponse, 
    ErrorResponse, RequestMetadata
)
from backend.services import get_contact_service
from backend.core import get_request_metadata, require_admin
from backend.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.post("/send", response_model=SuccessResponse)
async def send_contact_message(
    request: Request,
    message: ContactMessage,
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📤 Enviar mensaje de contacto
    
    Recibe y almacena un mensaje de contacto del usuario.
    """
    try:
        # Add request metadata to message
        message.ip_address = metadata.ip_address
        message.user_agent = metadata.user_agent
        
        contact_service = get_contact_service()
        success = await contact_service.save_message(message)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save contact message"
            )
        
        logger.info(
            f"Contact message received from: {message.email}",
            extra={
                "sender_email": message.email,
                "sender_name": message.name,
                "message_length": len(message.message),
                "ip": metadata.ip_address,
                "request_id": metadata.request_id
            }
        )
        
        return SuccessResponse(
            status="success",
            message="Your message has been sent successfully! I'll get back to you soon.",
            data={
                "sender_name": message.name,
                "sender_email": message.email,
                "timestamp": message.timestamp.isoformat(),
                "message_id": f"msg_{int(message.timestamp.timestamp())}"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Contact message error: {e}", 
            extra={
                "sender_email": message.email if message else "unknown",
                "request_id": metadata.request_id
            }
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Contact service error"
        )

@router.get("/messages", response_model=SuccessResponse)
async def get_contact_messages(
    limit: int = 50,
    _: str = Depends(require_admin),  # Require admin access
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📬 Obtener mensajes de contacto (Admin)
    
    Recupera los mensajes de contacto almacenados.
    Requiere permisos de administrador.
    """
    try:
        if limit > 500:
            limit = 500  # Prevent excessive data
        
        contact_service = get_contact_service()
        messages = await contact_service.get_messages(limit)
        
        messages_data = [
            {
                "name": msg.name,
                "email": msg.email,
                "message": msg.message,
                "timestamp": msg.timestamp.isoformat(),
                "ip_address": msg.ip_address,
                "user_agent": msg.user_agent,
                "message_id": f"msg_{int(msg.timestamp.timestamp())}"
            }
            for msg in messages
        ]
        
        # Calculate stats
        total_messages = len(messages)
        unique_senders = len(set(msg.email for msg in messages))
        recent_messages = len([msg for msg in messages if (metadata.timestamp - msg.timestamp).days <= 7])
        
        logger.info(
            f"Contact messages retrieved: {total_messages} messages",
            extra={
                "total_messages": total_messages,
                "request_id": metadata.request_id
            }
        )
        
        return SuccessResponse(
            status="success",
            message="Contact messages retrieved successfully",
            data={
                "messages": messages_data,
                "stats": {
                    "total_messages": total_messages,
                    "unique_senders": unique_senders,
                    "recent_messages_7_days": recent_messages,
                    "average_message_length": round(
                        sum(len(msg.message) for msg in messages) / total_messages, 2
                    ) if total_messages > 0 else 0
                }
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get messages error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Contact service error"
        )

@router.get("/stats", response_model=SuccessResponse)
async def get_contact_stats(
    _: str = Depends(require_admin),  # Require admin access
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📊 Estadísticas de contacto (Admin)
    
    Obtiene estadísticas del sistema de contacto.
    Requiere permisos de administrador.
    """
    try:
        contact_service = get_contact_service()
        all_messages = await contact_service.get_messages(1000)  # Get more for stats
        
        if not all_messages:
            return SuccessResponse(
                status="success",
                message="No contact data available",
                data={
                    "total_messages": 0,
                    "unique_senders": 0,
                    "messages_by_month": {},
                    "popular_domains": {},
                    "average_message_length": 0
                }
            )
        
        # Monthly distribution
        monthly_counts = {}
        for msg in all_messages:
            month_key = msg.timestamp.strftime("%Y-%m")
            monthly_counts[month_key] = monthly_counts.get(month_key, 0) + 1
        
        # Email domain analysis
        domain_counts = {}
        for msg in all_messages:
            domain = msg.email.split("@")[-1].lower()
            domain_counts[domain] = domain_counts.get(domain, 0) + 1
        
        # Sort domains by popularity
        popular_domains = dict(sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)[:10])
        
        # Message length analysis
        message_lengths = [len(msg.message) for msg in all_messages]
        avg_length = sum(message_lengths) / len(message_lengths)
        
        stats_data = {
            "total_messages": len(all_messages),
            "unique_senders": len(set(msg.email for msg in all_messages)),
            "messages_by_month": dict(sorted(monthly_counts.items())),
            "popular_domains": popular_domains,
            "message_length_stats": {
                "average": round(avg_length, 2),
                "shortest": min(message_lengths),
                "longest": max(message_lengths),
                "median": sorted(message_lengths)[len(message_lengths) // 2]
            },
            "recent_activity": {
                "last_24h": len([msg for msg in all_messages if (metadata.timestamp - msg.timestamp).days < 1]),
                "last_7_days": len([msg for msg in all_messages if (metadata.timestamp - msg.timestamp).days <= 7]),
                "last_30_days": len([msg for msg in all_messages if (metadata.timestamp - msg.timestamp).days <= 30])
            }
        }
        
        logger.info(
            f"Contact stats retrieved: {len(all_messages)} total messages",
            extra={"request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="Contact statistics retrieved successfully",
            data=stats_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Contact stats error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Contact service error"
        )