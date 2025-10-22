"""
📊 DATACRYPT LABS - DATA MODELS
Modelos Pydantic para validación de datos y APIs
Filosofía Mejora Continua: Type safety y validación robusta
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from enum import Enum

# ===== ENUMS =====

class DataType(str, Enum):
    """Tipos de datos soportados"""
    CRYPTO = "crypto"
    RANDOM = "random"
    CUSTOM = "custom"
    PORTFOLIO = "portfolio"

class MLModelType(str, Enum):
    """Tipos de modelos ML soportados"""
    REGRESSION = "regression"
    CLASSIFICATION = "classification"
    CLUSTERING = "clustering"
    NEURAL_NETWORK = "neural_network"

class AnalysisType(str, Enum):
    """Tipos de análisis disponibles"""
    STATISTICAL = "statistical"
    PREDICTIVE = "predictive"
    CLUSTERING = "clustering"
    CORRELATION = "correlation"

class ResponseStatus(str, Enum):
    """Estados de respuesta"""
    SUCCESS = "success"
    ERROR = "error"
    WARNING = "warning"
    PROCESSING = "processing"

# ===== BASE MODELS =====

class BaseResponse(BaseModel):
    """Respuesta base del sistema"""
    status: ResponseStatus
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = None

class SuccessResponse(BaseResponse):
    """Respuesta exitosa con datos"""
    status: ResponseStatus = ResponseStatus.SUCCESS
    data: Optional[Dict[str, Any]] = None

class ErrorResponse(BaseResponse):
    """Respuesta de error"""
    status: ResponseStatus = ResponseStatus.ERROR
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

# ===== CONTACT MODELS =====

class ContactMessage(BaseModel):
    """Mensaje de contacto"""
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
    message: str = Field(..., min_length=10, max_length=2000)
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @field_validator('message')
    @classmethod
    def validate_message(cls, v):
        if not v.strip():
            raise ValueError('Message cannot be empty')
        return v.strip()

# ===== DATA ANALYSIS MODELS =====

class DataAnalysisRequest(BaseModel):
    """Solicitud de análisis de datos"""
    data_type: DataType
    analysis_type: AnalysisType = AnalysisType.STATISTICAL
    parameters: Dict[str, Any] = Field(default_factory=dict)
    custom_data: Optional[List[Dict[str, Any]]] = None
    
    @field_validator('parameters')
    @classmethod
    def validate_parameters(cls, v):
        # Validaciones específicas por tipo de datos
        return v

class DataAnalysisResponse(SuccessResponse):
    """Respuesta de análisis de datos"""
    analysis_results: Dict[str, Any]
    metadata: Dict[str, Any]
    visualizations: Optional[List[str]] = None  # Base64 encoded images

# ===== MACHINE LEARNING MODELS =====

class MLPredictionRequest(BaseModel):
    """Solicitud de predicción ML"""
    model_type: MLModelType
    features: List[float] = Field(..., min_items=1)
    model_parameters: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    @field_validator('features')
    @classmethod
    def validate_features(cls, v):
        if any(not isinstance(x, (int, float)) for x in v):
            raise ValueError('All features must be numeric')
        return v

class MLTrainingRequest(BaseModel):
    """Solicitud de entrenamiento ML"""
    model_type: MLModelType
    training_data: List[List[float]]
    target_data: List[Union[float, int, str]]
    parameters: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    @field_validator('training_data')
    @classmethod
    def validate_training_data(cls, v):
        if not v:
            raise ValueError('Training data cannot be empty')
        if len(set(len(row) for row in v)) > 1:
            raise ValueError('All training data rows must have the same length')
        return v

class MLPredictionResponse(SuccessResponse):
    """Respuesta de predicción ML"""
    prediction: Union[float, int, str, List[Union[float, int, str]]]
    confidence: Optional[float] = None
    model_info: Dict[str, Any]

# ===== PORTFOLIO MODELS =====

class PortfolioProject(BaseModel):
    """Proyecto del portfolio"""
    id: str
    title: str
    description: str
    technologies: List[str]
    category: str
    url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool = False
    created_date: datetime
    last_updated: Optional[datetime] = None

class PortfolioStats(BaseModel):
    """Estadísticas del portfolio"""
    total_projects: int
    total_technologies: int
    featured_projects: int
    categories: Dict[str, int]
    latest_projects: List[PortfolioProject]

# ===== CRYPTO MODELS =====

class CryptoPrice(BaseModel):
    """Precio de criptomoneda"""
    symbol: str
    name: str
    current_price: float
    price_change_24h: float
    price_change_percentage_24h: float
    market_cap: float
    volume_24h: float
    last_updated: datetime

class CryptoPortfolio(BaseModel):
    """Portfolio de criptomonedas"""
    total_value: float
    total_change_24h: float
    total_change_percentage_24h: float
    holdings: List[Dict[str, Any]]
    last_updated: datetime

# ===== ADMIN MODELS =====

class AdminUser(BaseModel):
    """Usuario administrador"""
    id: str
    username: str
    email: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime
    last_login: Optional[datetime] = None
    permissions: List[str] = Field(default_factory=list)

class AdminLoginRequest(BaseModel):
    """Solicitud de login administrativo"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    remember_me: bool = False

class AdminTokenResponse(SuccessResponse):
    """Respuesta con token de autenticación"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user_info: AdminUser

# ===== GAME MODELS =====

class GameScore(BaseModel):
    """Puntuación del juego"""
    player_name: str = Field(..., min_length=1, max_length=50)
    score: int = Field(..., ge=0)
    level: int = Field(..., ge=1)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    @field_validator('player_name')
    @classmethod
    def validate_player_name(cls, v):
        if not v.strip():
            raise ValueError('Player name cannot be empty')
        return v.strip()

class GameLeaderboard(BaseModel):
    """Tabla de puntuaciones"""
    top_scores: List[GameScore]
    total_players: int
    average_score: float
    highest_score: GameScore
    latest_scores: List[GameScore]

# ===== HEALTH CHECK MODELS =====

class HealthStatus(BaseModel):
    """Estado de salud del sistema"""
    status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    uptime: float
    version: str
    environment: str
    database_status: str
    cache_status: str
    dependencies: Dict[str, str]

# ===== REQUEST/RESPONSE METADATA =====

class RequestMetadata(BaseModel):
    """Metadata de request"""
    request_id: str
    timestamp: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    endpoint: str
    method: str
    execution_time_ms: Optional[float] = None

# Export para importación fácil
__all__ = [
    # Enums
    "DataType", "MLModelType", "AnalysisType", "ResponseStatus",
    # Base
    "BaseResponse", "SuccessResponse", "ErrorResponse",
    # Contact
    "ContactMessage",
    # Data Analysis
    "DataAnalysisRequest", "DataAnalysisResponse",
    # Machine Learning
    "MLPredictionRequest", "MLTrainingRequest", "MLPredictionResponse",
    # Portfolio
    "PortfolioProject", "PortfolioStats",
    # Crypto
    "CryptoPrice", "CryptoPortfolio",
    # Admin
    "AdminUser", "AdminLoginRequest", "AdminTokenResponse",
    # Game
    "GameScore", "GameLeaderboard",
    # Health
    "HealthStatus",
    # Metadata
    "RequestMetadata"
]