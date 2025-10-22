"""
🎮 DATACRYPT LABS - GAMES API
Rutas para sistema de juegos y puntuaciones
Filosofía Mejora Continua: Gamificación y engagement
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List

from backend.models import (
    GameScore, GameLeaderboard, SuccessResponse, 
    ErrorResponse, RequestMetadata
)
from backend.services import get_game_service
from backend.core import get_request_metadata
from backend.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.post("/score", response_model=SuccessResponse)
async def save_game_score(
    score: GameScore,
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    🏆 Guardar puntuación del juego
    
    Registra una nueva puntuación en el sistema.
    """
    try:
        game_service = get_game_service()
        success = await game_service.save_score(score)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save score"
            )
        
        logger.info(
            f"Game score saved: {score.player_name} - {score.score}",
            extra={
                "player": score.player_name,
                "score": score.score,
                "level": score.level,
                "request_id": metadata.request_id
            }
        )
        
        return SuccessResponse(
            status="success",
            message="Score saved successfully",
            data={
                "player_name": score.player_name,
                "score": score.score,
                "level": score.level,
                "timestamp": score.timestamp.isoformat()
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Save score error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Game service error"
        )

@router.get("/leaderboard", response_model=SuccessResponse)
async def get_leaderboard(
    limit: int = 10,
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    🥇 Tabla de líderes
    
    Obtiene las mejores puntuaciones del juego.
    """
    try:
        if limit > 100:
            limit = 100  # Prevent excessive data
        
        game_service = get_game_service()
        scores = await game_service.get_leaderboard(limit)
        
        # Calculate additional stats
        total_players = len(set(score.player_name for score in scores))
        average_score = sum(score.score for score in scores) / len(scores) if scores else 0
        highest_score = max(scores, key=lambda x: x.score) if scores else None
        
        leaderboard_data = {
            "top_scores": [
                {
                    "player_name": score.player_name,
                    "score": score.score,
                    "level": score.level,
                    "timestamp": score.timestamp.isoformat(),
                    "rank": idx + 1
                }
                for idx, score in enumerate(scores)
            ],
            "stats": {
                "total_entries": len(scores),
                "unique_players": total_players,
                "average_score": round(average_score, 2),
                "highest_score": {
                    "player_name": highest_score.player_name,
                    "score": highest_score.score,
                    "level": highest_score.level,
                    "timestamp": highest_score.timestamp.isoformat()
                } if highest_score else None
            }
        }
        
        logger.info(
            f"Leaderboard requested: {len(scores)} entries",
            extra={"request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="Leaderboard retrieved successfully",
            data=leaderboard_data
        )
        
    except Exception as e:
        logger.error(f"Leaderboard error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Game service error"
        )

@router.get("/player/{player_name}/scores", response_model=SuccessResponse)
async def get_player_scores(
    player_name: str,
    limit: int = 20,
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📊 Puntuaciones de un jugador
    
    Obtiene el historial de puntuaciones de un jugador específico.
    """
    try:
        if limit > 100:
            limit = 100
        
        # TODO: Implement player-specific score retrieval
        # For now, return filtered leaderboard
        game_service = get_game_service()
        all_scores = await game_service.get_leaderboard(1000)  # Get more scores to filter
        
        player_scores = [
            score for score in all_scores 
            if score.player_name.lower() == player_name.lower()
        ][:limit]
        
        if not player_scores:
            return SuccessResponse(
                status="success",
                message="No scores found for player",
                data={
                    "player_name": player_name,
                    "scores": [],
                    "stats": {
                        "total_games": 0,
                        "best_score": None,
                        "average_score": 0,
                        "highest_level": 0
                    }
                }
            )
        
        # Calculate player stats
        best_score = max(player_scores, key=lambda x: x.score)
        average_score = sum(score.score for score in player_scores) / len(player_scores)
        highest_level = max(score.level for score in player_scores)
        
        player_data = {
            "player_name": player_name,
            "scores": [
                {
                    "score": score.score,
                    "level": score.level,
                    "timestamp": score.timestamp.isoformat()
                }
                for score in player_scores
            ],
            "stats": {
                "total_games": len(player_scores),
                "best_score": best_score.score,
                "average_score": round(average_score, 2),
                "highest_level": highest_level,
                "first_game": min(score.timestamp for score in player_scores).isoformat(),
                "latest_game": max(score.timestamp for score in player_scores).isoformat()
            }
        }
        
        logger.info(
            f"Player scores retrieved: {player_name} - {len(player_scores)} scores",
            extra={"player": player_name, "request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="Player scores retrieved successfully",
            data=player_data
        )
        
    except Exception as e:
        logger.error(
            f"Player scores error: {e}", 
            extra={"player": player_name, "request_id": metadata.request_id}
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Game service error"
        )

@router.get("/stats", response_model=SuccessResponse)
async def get_game_stats(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📈 Estadísticas del juego
    
    Obtiene estadísticas generales del sistema de juegos.
    """
    try:
        game_service = get_game_service()
        all_scores = await game_service.get_leaderboard(1000)  # Get all scores for stats
        
        if not all_scores:
            return SuccessResponse(
                status="success",
                message="No game data available",
                data={
                    "total_games": 0,
                    "unique_players": 0,
                    "average_score": 0,
                    "highest_score": None,
                    "score_distribution": {},
                    "player_distribution": {}
                }
            )
        
        # Calculate comprehensive stats
        unique_players = list(set(score.player_name for score in all_scores))
        scores_only = [score.score for score in all_scores]
        
        # Score distribution (by ranges)
        score_ranges = {
            "0-99": 0,
            "100-499": 0,
            "500-999": 0,
            "1000-4999": 0,
            "5000+": 0
        }
        
        for score_val in scores_only:
            if score_val < 100:
                score_ranges["0-99"] += 1
            elif score_val < 500:
                score_ranges["100-499"] += 1
            elif score_val < 1000:
                score_ranges["500-999"] += 1
            elif score_val < 5000:
                score_ranges["1000-4999"] += 1
            else:
                score_ranges["5000+"] += 1
        
        # Player game count distribution
        player_game_counts = {}
        for score in all_scores:
            player_game_counts[score.player_name] = player_game_counts.get(score.player_name, 0) + 1
        
        game_count_distribution = {
            "1 game": sum(1 for count in player_game_counts.values() if count == 1),
            "2-5 games": sum(1 for count in player_game_counts.values() if 2 <= count <= 5),
            "6-10 games": sum(1 for count in player_game_counts.values() if 6 <= count <= 10),
            "11+ games": sum(1 for count in player_game_counts.values() if count > 10)
        }
        
        highest_score = max(all_scores, key=lambda x: x.score)
        
        stats_data = {
            "total_games": len(all_scores),
            "unique_players": len(unique_players),
            "average_score": round(sum(scores_only) / len(scores_only), 2),
            "median_score": sorted(scores_only)[len(scores_only) // 2],
            "highest_score": {
                "player_name": highest_score.player_name,
                "score": highest_score.score,
                "level": highest_score.level,
                "timestamp": highest_score.timestamp.isoformat()
            },
            "score_distribution": score_ranges,
            "player_distribution": game_count_distribution,
            "top_players": [
                {
                    "player_name": player,
                    "total_games": count,
                    "best_score": max(score.score for score in all_scores if score.player_name == player)
                }
                for player, count in sorted(
                    player_game_counts.items(), 
                    key=lambda x: x[1], 
                    reverse=True
                )[:5]
            ]
        }
        
        logger.info(
            f"Game stats retrieved: {len(all_scores)} total games",
            extra={"request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="Game statistics retrieved successfully",
            data=stats_data
        )
        
    except Exception as e:
        logger.error(f"Game stats error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Game service error"
        )