"""
📊 DATACRYPT LABS - DATA ANALYSIS API
Rutas para análisis de datos y generación de datasets
Filosofía Mejora Continua: Insights valiosos y visualización clara
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any, Optional
import numpy as np
import json
from datetime import datetime, timedelta
import random
import math

from backend.models import (
    DataAnalysisRequest, DataAnalysisResponse, DataType, 
    AnalysisType, SuccessResponse, RequestMetadata
)
from backend.core import get_request_metadata, cache_result
from backend.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

class DataGenerators:
    """Generadores de datos para diferentes tipos de análisis"""
    
    @staticmethod
    def generate_crypto_data(count: int = 100) -> List[Dict[str, Any]]:
        """Genera datos simulados de criptomonedas"""
        crypto_symbols = ['BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'XRP', 'LTC', 'BCH', 'BNB', 'DOGE']
        data = []
        
        base_time = datetime.utcnow() - timedelta(days=count)
        
        for i in range(count):
            symbol = random.choice(crypto_symbols)
            base_price = {'BTC': 45000, 'ETH': 3000, 'ADA': 1.2, 'DOT': 25, 'LINK': 15}.get(symbol, 10)
            
            # Generate price with some volatility
            price_change = random.uniform(-0.1, 0.1)  # ±10% change
            current_price = base_price * (1 + price_change)
            
            data.append({
                'symbol': symbol,
                'price': round(current_price, 2),
                'volume_24h': random.uniform(100000000, 1000000000),  # Volume in USD
                'market_cap': current_price * random.uniform(10000000, 100000000),  # Market cap
                'change_24h': round(price_change * 100, 2),  # Percentage change
                'timestamp': (base_time + timedelta(hours=i)).isoformat()
            })
        
        return data
    
    @staticmethod
    def generate_random_data(count: int = 100, dimensions: int = 3) -> List[Dict[str, Any]]:
        """Genera datos aleatorios para análisis general"""
        data = []
        
        for i in range(count):
            point = {
                f'feature_{j}': round(random.normalvariate(0, 1), 3)
                for j in range(dimensions)
            }
            point['id'] = i
            point['category'] = random.choice(['A', 'B', 'C', 'D'])
            point['timestamp'] = (datetime.utcnow() - timedelta(minutes=count-i)).isoformat()
            data.append(point)
        
        return data
    
    @staticmethod
    def generate_portfolio_data() -> List[Dict[str, Any]]:
        """Genera datos del portfolio para análisis"""
        technologies = ['Python', 'JavaScript', 'React', 'FastAPI', 'SQLite', 'HTML', 'CSS', 'Node.js']
        categories = ['Web Development', 'Data Science', 'Machine Learning', 'API Development']
        
        data = []
        for i in range(20):  # 20 proyectos simulados
            tech_count = random.randint(2, 6)
            project_techs = random.sample(technologies, tech_count)
            
            data.append({
                'project_id': f'project_{i:03d}',
                'title': f'Project {i+1}',
                'category': random.choice(categories),
                'technologies': project_techs,
                'technology_count': len(project_techs),
                'complexity_score': len(project_techs) * random.uniform(0.8, 1.2),
                'featured': random.choice([True, False]),
                'created_date': (datetime.utcnow() - timedelta(days=random.randint(1, 365))).isoformat()
            })
        
        return data

class DataAnalyzers:
    """Analizadores de datos para diferentes tipos de análisis"""
    
    @staticmethod
    def statistical_analysis(data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Análisis estadístico de los datos"""
        if not data:
            return {"error": "No data provided for analysis"}
        
        # Extract numerical columns
        numerical_cols = []
        for key in data[0].keys():
            if isinstance(data[0][key], (int, float)):
                numerical_cols.append(key)
        
        statistics = {}
        
        for col in numerical_cols:
            values = [row[col] for row in data if isinstance(row[col], (int, float))]
            if values:
                statistics[col] = {
                    'count': len(values),
                    'mean': np.mean(values),
                    'median': np.median(values),
                    'std': np.std(values),
                    'min': np.min(values),
                    'max': np.max(values),
                    'q25': np.percentile(values, 25),
                    'q75': np.percentile(values, 75)
                }
        
        # Categorical analysis
        categorical_cols = [key for key in data[0].keys() if key not in numerical_cols]
        categorical_stats = {}
        
        for col in categorical_cols:
            if col not in ['id', 'timestamp']:  # Skip ID and timestamp columns
                values = [row[col] for row in data if col in row]
                unique_values = list(set(values))
                value_counts = {val: values.count(val) for val in unique_values}
                
                categorical_stats[col] = {
                    'unique_count': len(unique_values),
                    'unique_values': unique_values[:10],  # Limit to first 10
                    'value_counts': value_counts,
                    'most_common': max(value_counts.items(), key=lambda x: x[1]) if value_counts else None
                }
        
        return {
            'numerical_statistics': statistics,
            'categorical_statistics': categorical_stats,
            'dataset_info': {
                'total_rows': len(data),
                'numerical_columns': len(numerical_cols),
                'categorical_columns': len(categorical_cols),
                'total_columns': len(data[0].keys()) if data else 0
            }
        }
    
    @staticmethod
    def correlation_analysis(data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Análisis de correlación entre variables numéricas"""
        if not data:
            return {"error": "No data provided for correlation analysis"}
        
        # Extract numerical data
        numerical_cols = []
        for key in data[0].keys():
            if isinstance(data[0][key], (int, float)):
                numerical_cols.append(key)
        
        if len(numerical_cols) < 2:
            return {"error": "Need at least 2 numerical columns for correlation analysis"}
        
        # Create correlation matrix
        correlations = {}
        
        for i, col1 in enumerate(numerical_cols):
            correlations[col1] = {}
            values1 = np.array([row[col1] for row in data if isinstance(row[col1], (int, float))])
            
            for j, col2 in enumerate(numerical_cols):
                values2 = np.array([row[col2] for row in data if isinstance(row[col2], (int, float))])
                
                # Calculate correlation coefficient
                if len(values1) == len(values2) and np.std(values1) > 0 and np.std(values2) > 0:
                    correlation = np.corrcoef(values1, values2)[0, 1]
                    correlations[col1][col2] = float(correlation) if not np.isnan(correlation) else 0.0
                else:
                    correlations[col1][col2] = 0.0
        
        # Find strongest correlations
        strong_correlations = []
        for col1 in numerical_cols:
            for col2 in numerical_cols:
                if col1 < col2:  # Avoid duplicates
                    corr_value = correlations[col1][col2]
                    if abs(corr_value) > 0.5:  # Strong correlation threshold
                        strong_correlations.append({
                            'feature1': col1,
                            'feature2': col2,
                            'correlation': corr_value,
                            'strength': 'strong' if abs(corr_value) > 0.7 else 'moderate'
                        })
        
        return {
            'correlation_matrix': correlations,
            'strong_correlations': strong_correlations,
            'numerical_features': numerical_cols,
            'analysis_summary': {
                'features_analyzed': len(numerical_cols),
                'strong_correlations_found': len(strong_correlations),
                'max_correlation': max(max(row.values()) for row in correlations.values()) if correlations else 0
            }
        }

@router.post("/analyze", response_model=DataAnalysisResponse)
async def analyze_data(
    request: DataAnalysisRequest,
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> DataAnalysisResponse:
    """
    🔍 Analizar datos
    
    Realiza análisis de datos según el tipo especificado.
    """
    try:
        # Get or generate data
        if request.custom_data:
            data = request.custom_data
        else:
            # Generate data based on type
            if request.data_type == DataType.CRYPTO:
                count = request.parameters.get('count', 100)
                data = DataGenerators.generate_crypto_data(count)
            elif request.data_type == DataType.RANDOM:
                count = request.parameters.get('count', 100)
                dimensions = request.parameters.get('dimensions', 3)
                data = DataGenerators.generate_random_data(count, dimensions)
            elif request.data_type == DataType.PORTFOLIO:
                data = DataGenerators.generate_portfolio_data()
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Data type {request.data_type} not supported"
                )
        
        # Perform analysis
        if request.analysis_type == AnalysisType.STATISTICAL:
            analysis_results = DataAnalyzers.statistical_analysis(data)
        elif request.analysis_type == AnalysisType.CORRELATION:
            analysis_results = DataAnalyzers.correlation_analysis(data)
        else:
            # For other analysis types, provide basic statistical analysis
            analysis_results = DataAnalyzers.statistical_analysis(data)
            analysis_results['note'] = f"Full {request.analysis_type.value} analysis not yet implemented, showing statistical analysis"
        
        # Prepare metadata
        analysis_metadata = {
            'data_type': request.data_type.value,
            'analysis_type': request.analysis_type.value,
            'data_points': len(data),
            'parameters_used': request.parameters,
            'analysis_timestamp': datetime.utcnow().isoformat(),
            'data_source': 'custom' if request.custom_data else 'generated'
        }
        
        logger.info(
            f"Data analysis completed: {request.data_type.value} - {request.analysis_type.value}",
            extra={
                "data_type": request.data_type.value,
                "analysis_type": request.analysis_type.value,
                "data_points": len(data),
                "request_id": metadata.request_id
            }
        )
        
        return DataAnalysisResponse(
            status="success",
            message=f"{request.analysis_type.value} analysis completed successfully",
            analysis_results=analysis_results,
            metadata=analysis_metadata
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Data analysis error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data analysis service error"
        )

@router.get("/generate/{data_type}", response_model=SuccessResponse)
@cache_result(ttl_seconds=60)  # Cache for 1 minute
async def generate_sample_data(
    data_type: DataType,
    count: int = 50,
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    🎲 Generar datos de muestra
    
    Genera datasets de muestra para diferentes tipos de análisis.
    """
    try:
        if count > 1000:
            count = 1000  # Limit to prevent excessive data generation
        
        # Generate data based on type
        if data_type == DataType.CRYPTO:
            data = DataGenerators.generate_crypto_data(count)
        elif data_type == DataType.RANDOM:
            dimensions = 5  # Default dimensions for random data
            data = DataGenerators.generate_random_data(count, dimensions)
        elif data_type == DataType.PORTFOLIO:
            data = DataGenerators.generate_portfolio_data()
            count = len(data)  # Portfolio has fixed count
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Data type {data_type} not supported for generation"
            )
        
        # Calculate basic statistics about the generated data
        data_stats = {
            'total_records': len(data),
            'columns': list(data[0].keys()) if data else [],
            'column_count': len(data[0].keys()) if data else 0,
            'sample_record': data[0] if data else None,
            'generation_timestamp': datetime.utcnow().isoformat()
        }
        
        logger.info(
            f"Sample data generated: {data_type.value}",
            extra={
                "data_type": data_type.value,
                "record_count": len(data),
                "request_id": metadata.request_id
            }
        )
        
        return SuccessResponse(
            status="success",
            message=f"Sample {data_type.value} data generated successfully",
            data={
                'dataset': data,
                'statistics': data_stats,
                'data_type': data_type.value,
                'usage_suggestions': {
                    'crypto': "Use for cryptocurrency market analysis, price prediction, or volatility studies",
                    'random': "Use for general statistical analysis, clustering, or machine learning experiments",
                    'portfolio': "Use for portfolio optimization, technology trend analysis, or project categorization"
                }.get(data_type.value, "General purpose dataset for analysis")
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Data generation error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data generation service error"
        )

@router.get("/types", response_model=SuccessResponse)
@cache_result(ttl_seconds=3600)  # Cache for 1 hour
async def get_data_types(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📋 Tipos de datos disponibles
    
    Retorna información sobre los tipos de datos y análisis disponibles.
    """
    try:
        data_types_info = {
            DataType.CRYPTO: {
                "name": "Cryptocurrency Data",
                "description": "Simulated cryptocurrency market data with prices, volumes, and market caps",
                "sample_fields": ["symbol", "price", "volume_24h", "market_cap", "change_24h", "timestamp"],
                "typical_use_cases": ["Market analysis", "Price prediction", "Volatility studies", "Portfolio optimization"],
                "generation_parameters": {
                    "count": "Number of data points to generate (default: 100, max: 1000)"
                }
            },
            DataType.RANDOM: {
                "name": "Random Numerical Data",
                "description": "Randomly generated numerical data for general analysis and experimentation",
                "sample_fields": ["feature_0", "feature_1", "feature_N", "category", "timestamp"],
                "typical_use_cases": ["Statistical analysis", "Machine learning experiments", "Algorithm testing", "Data visualization"],
                "generation_parameters": {
                    "count": "Number of data points (default: 100, max: 1000)",
                    "dimensions": "Number of features/dimensions (default: 3)"
                }
            },
            DataType.PORTFOLIO: {
                "name": "Portfolio Projects Data",
                "description": "Simulated project portfolio data with technologies, categories, and metrics",
                "sample_fields": ["project_id", "title", "category", "technologies", "complexity_score", "featured"],
                "typical_use_cases": ["Technology trend analysis", "Project categorization", "Skill assessment", "Portfolio optimization"],
                "generation_parameters": {
                    "count": "Fixed at 20 projects for realistic portfolio analysis"
                }
            }
        }
        
        analysis_types_info = {
            AnalysisType.STATISTICAL: {
                "name": "Statistical Analysis",
                "description": "Comprehensive statistical summary including mean, median, standard deviation, and distributions",
                "outputs": ["Descriptive statistics", "Distribution analysis", "Categorical summaries"],
                "best_for": ["Data exploration", "Quality assessment", "Initial insights"]
            },
            AnalysisType.CORRELATION: {
                "name": "Correlation Analysis",
                "description": "Analysis of relationships between numerical variables using correlation coefficients",
                "outputs": ["Correlation matrix", "Strong correlations identification", "Feature relationships"],
                "best_for": ["Feature selection", "Multicollinearity detection", "Relationship discovery"]
            },
            AnalysisType.PREDICTIVE: {
                "name": "Predictive Analysis",
                "description": "Advanced predictive modeling and forecasting (implementation in progress)",
                "outputs": ["Predictions", "Model performance", "Feature importance"],
                "best_for": ["Forecasting", "Trend prediction", "Decision support"],
                "status": "planned"
            },
            AnalysisType.CLUSTERING: {
                "name": "Clustering Analysis",
                "description": "Unsupervised grouping and pattern discovery (implementation in progress)",
                "outputs": ["Cluster assignments", "Cluster centers", "Silhouette scores"],
                "best_for": ["Market segmentation", "Pattern discovery", "Data grouping"],
                "status": "planned"
            }
        }
        
        capabilities_summary = {
            "supported_data_types": len(data_types_info),
            "supported_analysis_types": len([a for a in analysis_types_info.values() if a.get("status") != "planned"]),
            "planned_analysis_types": len([a for a in analysis_types_info.values() if a.get("status") == "planned"]),
            "max_data_points": 1000,
            "real_time_analysis": True,
            "custom_data_support": True
        }
        
        types_data = {
            "data_types": {dt.value: info for dt, info in data_types_info.items()},
            "analysis_types": {at.value: info for at, info in analysis_types_info.items()},
            "capabilities": capabilities_summary,
            "usage_examples": {
                "basic_analysis": {
                    "data_type": "random",
                    "analysis_type": "statistical",
                    "parameters": {"count": 100, "dimensions": 3}
                },
                "crypto_correlation": {
                    "data_type": "crypto",
                    "analysis_type": "correlation",
                    "parameters": {"count": 200}
                },
                "portfolio_insights": {
                    "data_type": "portfolio",
                    "analysis_type": "statistical",
                    "parameters": {}
                }
            }
        }
        
        logger.info(
            f"Data types information accessed",
            extra={"request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="Data types and analysis capabilities retrieved successfully",
            data=types_data
        )
        
    except Exception as e:
        logger.error(f"Data types error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data types service error"
        )