"""
💼 DATACRYPT LABS - PORTFOLIO API
Rutas para gestión del portfolio
Filosofía Mejora Continua: Showcase profesional y actualizaciones dinámicas
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional

from backend.models import (
    PortfolioProject, PortfolioStats, SuccessResponse, 
    RequestMetadata
)
from backend.services import get_portfolio_service
from backend.core import get_request_metadata, require_admin, cache_result
from backend.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.get("/projects", response_model=SuccessResponse)
@cache_result(ttl_seconds=300)  # Cache for 5 minutes
async def get_portfolio_projects(
    featured_only: bool = False,
    category: Optional[str] = None,
    limit: Optional[int] = None,
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📁 Obtener proyectos del portfolio
    
    Retorna la lista de proyectos con filtros opcionales.
    """
    try:
        portfolio_service = get_portfolio_service()
        projects = await portfolio_service.get_projects(featured_only=featured_only)
        
        # Apply additional filters
        if category:
            projects = [p for p in projects if p.category.lower() == category.lower()]
        
        if limit and limit > 0:
            projects = projects[:limit]
        
        # Format projects for response
        projects_data = [
            {
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "technologies": project.technologies,
                "category": project.category,
                "url": project.url,
                "github_url": project.github_url,
                "image_url": project.image_url,
                "featured": project.featured,
                "created_date": project.created_date.isoformat(),
                "last_updated": project.last_updated.isoformat() if project.last_updated else None
            }
            for project in projects
        ]
        
        # Calculate stats
        total_projects = len(projects_data)
        categories = list(set(p["category"] for p in projects_data))
        technologies = []
        for project in projects_data:
            technologies.extend(project["technologies"])
        unique_technologies = list(set(technologies))
        
        logger.info(
            f"Portfolio projects retrieved: {total_projects} projects",
            extra={
                "total_projects": total_projects,
                "featured_only": featured_only,
                "category_filter": category,
                "request_id": metadata.request_id
            }
        )
        
        return SuccessResponse(
            status="success",
            message="Portfolio projects retrieved successfully",
            data={
                "projects": projects_data,
                "meta": {
                    "total_count": total_projects,
                    "categories": categories,
                    "technologies_used": unique_technologies,
                    "featured_count": len([p for p in projects_data if p["featured"]]),
                    "filters_applied": {
                        "featured_only": featured_only,
                        "category": category,
                        "limit": limit
                    }
                }
            }
        )
        
    except Exception as e:
        logger.error(f"Portfolio projects error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Portfolio service error"
        )

@router.get("/featured", response_model=SuccessResponse)
@cache_result(ttl_seconds=600)  # Cache for 10 minutes
async def get_featured_projects(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    ⭐ Proyectos destacados
    
    Retorna solo los proyectos marcados como destacados.
    """
    return await get_portfolio_projects(featured_only=True, metadata=metadata)

@router.get("/categories", response_model=SuccessResponse)
@cache_result(ttl_seconds=3600)  # Cache for 1 hour
async def get_project_categories(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📂 Categorías de proyectos
    
    Retorna las categorías disponibles con estadísticas.
    """
    try:
        portfolio_service = get_portfolio_service()
        all_projects = await portfolio_service.get_projects()
        
        # Calculate category statistics
        category_stats = {}
        for project in all_projects:
            category = project.category
            if category not in category_stats:
                category_stats[category] = {
                    "name": category,
                    "count": 0,
                    "featured_count": 0,
                    "technologies": set(),
                    "latest_project": None
                }
            
            category_stats[category]["count"] += 1
            if project.featured:
                category_stats[category]["featured_count"] += 1
            
            category_stats[category]["technologies"].update(project.technologies)
            
            # Track latest project
            if (category_stats[category]["latest_project"] is None or 
                project.created_date > category_stats[category]["latest_project"]):
                category_stats[category]["latest_project"] = project.created_date
        
        # Format for response
        categories_data = []
        for category, stats in category_stats.items():
            categories_data.append({
                "name": stats["name"],
                "project_count": stats["count"],
                "featured_count": stats["featured_count"],
                "technologies": list(stats["technologies"]),
                "technology_count": len(stats["technologies"]),
                "latest_update": stats["latest_project"].isoformat() if stats["latest_project"] else None
            })
        
        # Sort by project count
        categories_data.sort(key=lambda x: x["project_count"], reverse=True)
        
        logger.info(
            f"Portfolio categories retrieved: {len(categories_data)} categories",
            extra={"request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="Project categories retrieved successfully",
            data={
                "categories": categories_data,
                "total_categories": len(categories_data),
                "total_projects": sum(cat["project_count"] for cat in categories_data)
            }
        )
        
    except Exception as e:
        logger.error(f"Portfolio categories error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Portfolio service error"
        )

@router.get("/technologies", response_model=SuccessResponse)
@cache_result(ttl_seconds=3600)  # Cache for 1 hour
async def get_technologies_used(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    🛠️ Tecnologías utilizadas
    
    Retorna las tecnologías usadas en los proyectos con estadísticas.
    """
    try:
        portfolio_service = get_portfolio_service()
        all_projects = await portfolio_service.get_projects()
        
        # Calculate technology statistics
        tech_stats = {}
        for project in all_projects:
            for tech in project.technologies:
                if tech not in tech_stats:
                    tech_stats[tech] = {
                        "name": tech,
                        "project_count": 0,
                        "featured_projects": 0,
                        "categories": set(),
                        "latest_use": None
                    }
                
                tech_stats[tech]["project_count"] += 1
                if project.featured:
                    tech_stats[tech]["featured_projects"] += 1
                
                tech_stats[tech]["categories"].add(project.category)
                
                # Track latest use
                if (tech_stats[tech]["latest_use"] is None or 
                    project.created_date > tech_stats[tech]["latest_use"]):
                    tech_stats[tech]["latest_use"] = project.created_date
        
        # Format for response
        technologies_data = []
        for tech, stats in tech_stats.items():
            technologies_data.append({
                "name": stats["name"],
                "project_count": stats["project_count"],
                "featured_projects": stats["featured_projects"],
                "categories_used": list(stats["categories"]),
                "category_count": len(stats["categories"]),
                "latest_use": stats["latest_use"].isoformat() if stats["latest_use"] else None,
                "popularity_score": stats["project_count"] * 1.5 + stats["featured_projects"] * 2
            })
        
        # Sort by popularity score
        technologies_data.sort(key=lambda x: x["popularity_score"], reverse=True)
        
        # Group by popularity tiers
        total_techs = len(technologies_data)
        popular_techs = technologies_data[:min(10, total_techs)]
        emerging_techs = [t for t in technologies_data if t["project_count"] == 1]
        
        logger.info(
            f"Portfolio technologies retrieved: {len(technologies_data)} technologies",
            extra={"request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="Technologies retrieved successfully",
            data={
                "all_technologies": technologies_data,
                "popular_technologies": popular_techs,
                "emerging_technologies": emerging_techs,
                "stats": {
                    "total_technologies": total_techs,
                    "most_used": technologies_data[0]["name"] if technologies_data else None,
                    "average_projects_per_tech": round(
                        sum(t["project_count"] for t in technologies_data) / total_techs, 2
                    ) if total_techs > 0 else 0
                }
            }
        )
        
    except Exception as e:
        logger.error(f"Portfolio technologies error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Portfolio service error"
        )

@router.get("/stats", response_model=SuccessResponse)
@cache_result(ttl_seconds=1800)  # Cache for 30 minutes
async def get_portfolio_stats(
    metadata: RequestMetadata = Depends(get_request_metadata)
) -> SuccessResponse:
    """
    📊 Estadísticas del portfolio
    
    Retorna estadísticas completas del portfolio.
    """
    try:
        portfolio_service = get_portfolio_service()
        all_projects = await portfolio_service.get_projects()
        
        if not all_projects:
            return SuccessResponse(
                status="success",
                message="No portfolio data available",
                data={
                    "total_projects": 0,
                    "featured_projects": 0,
                    "categories": {},
                    "technologies": {},
                    "timeline": {}
                }
            )
        
        # Basic stats
        total_projects = len(all_projects)
        featured_count = len([p for p in all_projects if p.featured])
        
        # Category distribution
        categories = {}
        for project in all_projects:
            categories[project.category] = categories.get(project.category, 0) + 1
        
        # Technology frequency
        technologies = {}
        for project in all_projects:
            for tech in project.technologies:
                technologies[tech] = technologies.get(tech, 0) + 1
        
        # Timeline analysis (by year)
        timeline = {}
        for project in all_projects:
            year = project.created_date.year
            timeline[year] = timeline.get(year, 0) + 1
        
        # Recent activity
        from datetime import datetime, timedelta
        now = datetime.utcnow()
        recent_projects = [
            p for p in all_projects 
            if (now - p.created_date).days <= 30
        ]
        
        # Project complexity (based on technology count)
        tech_counts = [len(p.technologies) for p in all_projects]
        avg_complexity = sum(tech_counts) / len(tech_counts) if tech_counts else 0
        
        stats_data = {
            "overview": {
                "total_projects": total_projects,
                "featured_projects": featured_count,
                "featured_percentage": round((featured_count / total_projects) * 100, 2) if total_projects > 0 else 0,
                "average_technologies_per_project": round(avg_complexity, 2),
                "most_recent_project": max(all_projects, key=lambda x: x.created_date).title if all_projects else None
            },
            "categories": dict(sorted(categories.items(), key=lambda x: x[1], reverse=True)),
            "top_technologies": dict(sorted(technologies.items(), key=lambda x: x[1], reverse=True)[:15]),
            "timeline": dict(sorted(timeline.items())),
            "recent_activity": {
                "projects_last_30_days": len(recent_projects),
                "most_active_year": max(timeline.items(), key=lambda x: x[1])[0] if timeline else None,
                "projects_this_year": timeline.get(now.year, 0)
            },
            "complexity_analysis": {
                "simple_projects": len([c for c in tech_counts if c <= 2]),
                "medium_projects": len([c for c in tech_counts if 3 <= c <= 5]),
                "complex_projects": len([c for c in tech_counts if c > 5]),
                "most_complex_project": max(all_projects, key=lambda x: len(x.technologies)).title if all_projects else None
            }
        }
        
        logger.info(
            f"Portfolio stats retrieved: {total_projects} total projects",
            extra={"request_id": metadata.request_id}
        )
        
        return SuccessResponse(
            status="success",
            message="Portfolio statistics retrieved successfully",
            data=stats_data
        )
        
    except Exception as e:
        logger.error(f"Portfolio stats error: {e}", extra={"request_id": metadata.request_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Portfolio service error"
        )