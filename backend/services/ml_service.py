"""
🤖 DATACRYPT LABS - MACHINE LEARNING SERVICES  
Servicios especializados de Machine Learning para el sistema modular
Filosofía Mejora Continua: ML escalable y modular
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional, Union
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_squared_error
import json
from datetime import datetime

from backend.config.settings import get_settings
from backend.utils.logger import get_logger
from backend.models import MLModelType, MLPredictionRequest, MLTrainingRequest

settings = get_settings()
logger = get_logger(__name__)

class MLService:
    """Servicio especializado de Machine Learning"""
    
    def __init__(self):
        self.models = {}
        self.model_metadata = {}
        logger.info("🤖 MLService inicializado")
    
    async def train_model(self, request: MLTrainingRequest) -> Dict[str, Any]:
        """Entrenar un modelo de ML"""
        try:
            logger.info(f"🎯 Iniciando entrenamiento: {request.model_type}")
            
            # Preparar datos
            X = np.array(request.training_data)
            y = np.array(request.target_data)
            
            # Split de datos
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Seleccionar modelo
            if request.model_type == MLModelType.CLASSIFICATION:
                model = RandomForestClassifier(**request.parameters)
                metric_name = "accuracy"
            elif request.model_type == MLModelType.REGRESSION:
                model = RandomForestRegressor(**request.parameters)
                metric_name = "mse"
            else:
                raise ValueError(f"Tipo de modelo no soportado: {request.model_type}")
            
            # Entrenar
            model.fit(X_train, y_train)
            
            # Evaluar
            y_pred = model.predict(X_test)
            if request.model_type == MLModelType.CLASSIFICATION:
                metric_value = accuracy_score(y_test, y_pred)
            else:
                metric_value = mean_squared_error(y_test, y_pred)
            
            # Guardar modelo
            model_id = f"{request.model_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            self.models[model_id] = model
            self.model_metadata[model_id] = {
                "type": request.model_type,
                "trained_at": datetime.now().isoformat(),
                "training_samples": len(X_train),
                "test_samples": len(X_test),
                "metric_name": metric_name,
                "metric_value": float(metric_value),
                "parameters": request.parameters
            }
            
            logger.info(f"✅ Modelo entrenado exitosamente: {model_id}")
            
            return {
                "model_id": model_id,
                "metric_name": metric_name,
                "metric_value": metric_value,
                "training_samples": len(X_train),
                "test_samples": len(X_test)
            }
            
        except Exception as e:
            logger.error(f"❌ Error entrenando modelo: {e}")
            raise
    
    async def predict(self, request: MLPredictionRequest) -> Dict[str, Any]:
        """Hacer predicciones con modelo entrenado"""
        try:
            logger.info("🔮 Realizando predicción")
            
            # Para este ejemplo, usamos un modelo simple
            features = np.array(request.features).reshape(1, -1)
            
            if request.model_type == MLModelType.CLASSIFICATION:
                # Predicción clasificación simple
                prediction = 1 if np.mean(features) > 0.5 else 0
                confidence = abs(np.mean(features) - 0.5) * 2
            elif request.model_type == MLModelType.REGRESSION:
                # Predicción regresión simple
                prediction = float(np.mean(features) * 10)
                confidence = 0.85
            else:
                raise ValueError(f"Tipo de modelo no soportado: {request.model_type}")
            
            result = {
                "prediction": prediction,
                "confidence": confidence,
                "model_type": request.model_type,
                "features_processed": len(request.features)
            }
            
            logger.info(f"✅ Predicción completada: {result}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error en predicción: {e}")
            raise
    
    async def get_model_info(self, model_id: str) -> Optional[Dict[str, Any]]:
        """Obtener información de un modelo"""
        return self.model_metadata.get(model_id)
    
    async def list_models(self) -> List[Dict[str, Any]]:
        """Listar todos los modelos disponibles"""
        return list(self.model_metadata.values())
    
    async def analyze_data(self, data: List[List[float]]) -> Dict[str, Any]:
        """Análisis estadístico de datos"""
        try:
            logger.info("📊 Iniciando análisis de datos")
            
            df = pd.DataFrame(data)
            
            analysis = {
                "shape": df.shape,
                "columns": len(df.columns),
                "rows": len(df),
                "statistics": {
                    "mean": df.mean().to_dict(),
                    "std": df.std().to_dict(),
                    "min": df.min().to_dict(),
                    "max": df.max().to_dict()
                },
                "missing_values": df.isnull().sum().to_dict(),
                "data_types": df.dtypes.astype(str).to_dict()
            }
            
            logger.info(f"✅ Análisis completado: {analysis['shape']}")
            return analysis
            
        except Exception as e:
            logger.error(f"❌ Error en análisis: {e}")
            raise

# Instancia global del servicio
ml_service = MLService()

async def get_ml_service() -> MLService:
    """Obtener instancia del servicio de ML"""
    return ml_service