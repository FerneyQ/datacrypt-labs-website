"""
🤖 DATACRYPT LABS - MACHINE LEARNING API
Rutas para servicios de Machine Learning
Filosofía Mejora Continua: IA accesible y modelos adaptativos
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any, Optional
import numpy as np
import json
from datetime import datetime

from backend.models import (
    MLPredictionRequest, MLTrainingRequest, MLPredictionResponse,
    MLModelType, SuccessResponse, RequestMetadata
)
from backend.core import get_request_metadata, cache_result
from backend.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

# Simple ML models implementation
class SimpleMLModels:
    """Implementaciones simples de modelos ML para demostración"""
    
    @staticmethod
    def linear_regression(features: List[float], params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Regresión lineal simple"""
        # Simulated linear regression: y = mx + b
        m = params.get('slope', 1.5) if params else 1.5
        b = params.get('intercept', 0.5) if params else 0.5
        
        x = np.mean(features) if features else 0
        prediction = m * x + b
        
        # Calculate mock confidence based on feature variability
        feature_std = np.std(features) if len(features) > 1 else 0.1
        confidence = max(0.5, 1.0 - (feature_std / 10))
        
        return {
            'prediction': float(prediction),
            'confidence': float(confidence),
            'model_params': {'slope': m, 'intercept': b},
            'feature_importance': [1.0 / len(features)] * len(features) if features else []
        }
    
    @staticmethod
    def classification(features: List[float], params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Clasificación simple"""
        # Simple threshold-based classification
        threshold = params.get('threshold', 0.5) if params else 0.5
        feature_sum = sum(features) if features else 0
        
        # Normalize by feature count
        normalized_value = feature_sum / len(features) if features else 0
        
        # Binary classification
        prediction = 1 if normalized_value > threshold else 0
        class_names = params.get('class_names', ['Class A', 'Class B']) if params else ['Class A', 'Class B']
        
        # Calculate confidence based on distance from threshold
        distance_from_threshold = abs(normalized_value - threshold)
        confidence = min(0.95, 0.5 + distance_from_threshold)
        
        return {
            'prediction': class_names[prediction],
            'prediction_code': prediction,
            'confidence': float(confidence),
            'probabilities': {
                class_names[0]: float(1 - confidence) if prediction == 1 else float(confidence),
                class_names[1]: float(confidence) if prediction == 1 else float(1 - confidence)
            },
            'threshold_used': threshold
        }
    
    @staticmethod
    def clustering(features: List[float], params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Clustering simple"""
        n_clusters = params.get('n_clusters', 3) if params else 3
        
        # Simple clustering based on feature value ranges
        feature_mean = np.mean(features) if features else 0
        feature_std = np.std(features) if len(features) > 1 else 1
        
        # Assign cluster based on distance from mean
        if feature_mean < -feature_std:
            cluster = 0
        elif feature_mean > feature_std:
            cluster = 2
        else:
            cluster = 1
        
        # Ensure cluster is within n_clusters range
        cluster = cluster % n_clusters
        
        return {
            'prediction': f'Cluster_{cluster}',
            'cluster_id': cluster,
            'confidence': 0.8,  # Fixed confidence for clustering
            'cluster_center': float(feature_mean),
            'total_clusters': n_clusters
        }
    
    @staticmethod
    def neural_network(features: List[float], params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Red neuronal simple simulada"""
        # Simulate a simple neural network with one hidden layer
        hidden_size = params.get('hidden_size', 5) if params else 5
        activation = params.get('activation', 'relu') if params else 'relu'
        
        # Simulate forward pass
        input_layer = np.array(features) if features else np.array([0])
        
        # Random weights for simulation (in real implementation, these would be learned)
        np.random.seed(42)  # For reproducible results
        weights_1 = np.random.randn(len(input_layer), hidden_size) * 0.5
        bias_1 = np.random.randn(hidden_size) * 0.1
        
        # Hidden layer
        hidden = np.dot(input_layer, weights_1) + bias_1
        if activation == 'relu':
            hidden = np.maximum(0, hidden)
        elif activation == 'sigmoid':
            hidden = 1 / (1 + np.exp(-hidden))
        
        # Output layer (single output for regression)
        weights_2 = np.random.randn(hidden_size) * 0.5
        bias_2 = np.random.randn() * 0.1
        output = np.dot(hidden, weights_2) + bias_2
        
        # Calculate confidence based on activation strength
        activation_strength = np.mean(np.abs(hidden))
        confidence = min(0.95, 0.5 + activation_strength / 10)
        
        return {
            'prediction': float(output),
            'confidence': float(confidence),
            'network_info': {
                'input_size': len(input_layer),
                'hidden_size': hidden_size,
                'activation': activation,
                'hidden_activations': hidden.tolist()
            }
        }

@router.post("/predict", response_model=MLPredictionResponse)
async def predict(
    request: MLPredictionRequest,
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> MLPredictionResponse:
    """
    🔮 Realizar predicción con modelo ML
    
    Ejecuta predicción usando el modelo especificado con las características proporcionadas.
    """
    try:
        model_functions = {
            MLModelType.REGRESSION: SimpleMLModels.linear_regression,
            MLModelType.CLASSIFICATION: SimpleMLModels.classification,
            MLModelType.CLUSTERING: SimpleMLModels.clustering,
            MLModelType.NEURAL_NETWORK: SimpleMLModels.neural_network
        }
        
        if request.model_type not in model_functions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Model type {request.model_type} not supported"
            )
        
        # Execute prediction
        model_function = model_functions[request.model_type]
        result = model_function(request.features, request.model_parameters)
        
        # Prepare response
        prediction_response = MLPredictionResponse(
            status="success",
            message=f"{request.model_type.value} prediction completed successfully",
            prediction=result['prediction'],
            confidence=result.get('confidence'),
            model_info={
                'model_type': request.model_type.value,
                'feature_count': len(request.features),
                'parameters_used': request.model_parameters or {},
                'additional_info': {k: v for k, v in result.items() if k not in ['prediction', 'confidence']}
            }
        )
        
        logger.info(
            f"ML prediction completed: {request.model_type.value}",
            extra={
                "model_type": request.model_type.value,
                "feature_count": len(request.features),
                "confidence": result.get('confidence', 0),
                "request_id": metadata.request_id
            }
        )
        
        return prediction_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"ML prediction error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Machine learning service error"
        )

@router.post("/train", response_model=SuccessResponse)
async def train_model(
    request: MLTrainingRequest,
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    🏋️ Entrenar modelo ML
    
    Entrena un modelo con los datos proporcionados (simulado para demostración).
    """
    try:
        # Validate training data
        if not request.training_data or not request.target_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Training data and target data are required"
            )
        
        if len(request.training_data) != len(request.target_data):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Training data and target data must have the same length"
            )
        
        # Simulate training process
        training_samples = len(request.training_data)
        feature_count = len(request.training_data[0]) if request.training_data else 0
        
        # Calculate some basic statistics as if we're training
        X = np.array(request.training_data)
        y = np.array(request.target_data)
        
        # Simulate different training metrics based on model type
        training_metrics = {}
        
        if request.model_type == MLModelType.REGRESSION:
            # Simulate regression metrics
            y_pred = np.mean(y) + np.random.normal(0, 0.1, len(y))  # Simple baseline prediction
            mse = np.mean((y - y_pred) ** 2)
            r2 = max(0, 1 - (mse / np.var(y))) if np.var(y) > 0 else 0
            
            training_metrics = {
                'mse': float(mse),
                'rmse': float(np.sqrt(mse)),
                'r2_score': float(r2),
                'mean_target': float(np.mean(y))
            }
            
        elif request.model_type == MLModelType.CLASSIFICATION:
            # Simulate classification metrics
            unique_classes = len(set(y))
            accuracy = 0.7 + np.random.random() * 0.25  # Random accuracy between 70-95%
            
            training_metrics = {
                'accuracy': float(accuracy),
                'unique_classes': unique_classes,
                'class_distribution': {str(cls): int(np.sum(y == cls)) for cls in set(y)}
            }
            
        elif request.model_type == MLModelType.CLUSTERING:
            # Simulate clustering metrics
            n_clusters = request.parameters.get('n_clusters', 3)
            inertia = np.random.uniform(10, 100)  # Simulated inertia
            
            training_metrics = {
                'n_clusters': n_clusters,
                'inertia': float(inertia),
                'silhouette_score': float(0.3 + np.random.random() * 0.4)
            }
            
        elif request.model_type == MLModelType.NEURAL_NETWORK:
            # Simulate neural network training
            epochs = request.parameters.get('epochs', 100)
            learning_rate = request.parameters.get('learning_rate', 0.01)
            
            training_metrics = {
                'epochs_trained': epochs,
                'learning_rate': learning_rate,
                'final_loss': float(0.1 + np.random.random() * 0.5),
                'convergence': True
            }
        
        # Simulate model saving (in reality, you'd save the trained model)
        model_id = f"model_{request.model_type.value}_{int(datetime.utcnow().timestamp())}"
        
        training_result = {
            'model_id': model_id,
            'model_type': request.model_type.value,
            'training_samples': training_samples,
            'feature_count': feature_count,
            'training_metrics': training_metrics,
            'parameters_used': request.parameters or {},
            'training_completed_at': datetime.utcnow().isoformat(),
            'status': 'trained_successfully'
        }
        
        logger.info(
            f"ML model training completed: {request.model_type.value}",
            extra={
                "model_type": request.model_type.value,
                "training_samples": training_samples,
                "feature_count": feature_count,
                "model_id": model_id,
                "request_id": metadata.request_id
            }
        )
        
        return SuccessResponse(
            status="success",
            message=f"{request.model_type.value} model trained successfully",
            data=training_result
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"ML training error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Machine learning training service error"
        )

@router.get("/models", response_model=SuccessResponse)
@cache_result(ttl_seconds=300)
async def get_available_models(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📋 Modelos disponibles
    
    Retorna la lista de modelos ML disponibles y sus capacidades.
    """
    try:
        available_models = {
            MLModelType.REGRESSION: {
                "name": "Linear Regression",
                "description": "Simple linear regression for continuous target prediction",
                "input_type": "numerical_features",
                "output_type": "continuous",
                "parameters": {
                    "slope": "Slope coefficient (default: 1.5)",
                    "intercept": "Y-intercept (default: 0.5)"
                },
                "use_cases": ["Price prediction", "Sales forecasting", "Trend analysis"]
            },
            MLModelType.CLASSIFICATION: {
                "name": "Threshold Classification",
                "description": "Simple threshold-based binary classification",
                "input_type": "numerical_features",
                "output_type": "categorical",
                "parameters": {
                    "threshold": "Classification threshold (default: 0.5)",
                    "class_names": "Custom class names (default: ['Class A', 'Class B'])"
                },
                "use_cases": ["Binary classification", "Decision making", "Category assignment"]
            },
            MLModelType.CLUSTERING: {
                "name": "Simple Clustering",
                "description": "Basic clustering algorithm for grouping data points",
                "input_type": "numerical_features",
                "output_type": "cluster_assignment",
                "parameters": {
                    "n_clusters": "Number of clusters (default: 3)"
                },
                "use_cases": ["Data segmentation", "Pattern discovery", "Customer grouping"]
            },
            MLModelType.NEURAL_NETWORK: {
                "name": "Simple Neural Network",
                "description": "Basic feedforward neural network with one hidden layer",
                "input_type": "numerical_features",
                "output_type": "continuous",
                "parameters": {
                    "hidden_size": "Hidden layer size (default: 5)",
                    "activation": "Activation function: 'relu' or 'sigmoid' (default: 'relu')",
                    "epochs": "Training epochs for training (default: 100)",
                    "learning_rate": "Learning rate for training (default: 0.01)"
                },
                "use_cases": ["Complex pattern recognition", "Non-linear regression", "Feature learning"]
            }
        }
        
        # Model statistics (simulated)
        model_stats = {
            "total_models": len(available_models),
            "model_categories": {
                "supervised": 3,  # regression, classification, neural_network
                "unsupervised": 1  # clustering
            },
            "supported_tasks": ["regression", "classification", "clustering", "neural_networks"],
            "implementation_status": "demo_implementation"
        }
        
        models_data = {
            "available_models": {
                model_type.value: info 
                for model_type, info in available_models.items()
            },
            "statistics": model_stats,
            "usage_examples": {
                "regression": {
                    "features": [1.0, 2.5, 3.2],
                    "parameters": {"slope": 2.0, "intercept": 1.0}
                },
                "classification": {
                    "features": [0.8, 1.2, 0.5],
                    "parameters": {"threshold": 0.7, "class_names": ["Low", "High"]}
                },
                "clustering": {
                    "features": [1.0, 2.0, 3.0],
                    "parameters": {"n_clusters": 2}
                },
                "neural_network": {
                    "features": [0.5, 1.5, 2.5],
                    "parameters": {"hidden_size": 10, "activation": "relu"}
                }
            }
        }
        
        logger.info(
            f"ML models list accessed",
            extra={"request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="Available ML models retrieved successfully",
            data=models_data
        )
        
    except Exception as e:
        logger.error(f"ML models list error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Machine learning models service error"
        )