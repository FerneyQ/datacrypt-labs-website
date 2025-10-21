#!/usr/bin/env python3
"""
🚀 DataCrypt Labs - Static Site Generator
Genera versión estática para GitHub Pages - 100% GRATIS
"""

import os
import shutil
import json
from pathlib import Path

def generate_static_site():
    """Genera sitio estático para GitHub Pages"""
    
    print("🚀 Generando DataCrypt Labs para GitHub Pages...")
    
    # Crear directorio dist
    dist_dir = Path("dist")
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
    dist_dir.mkdir()
    
    # Copiar archivos principales
    files_to_copy = [
        "index.html",
        "index_datacrypt.html", 
        "manifest.json",
        "robots.txt",
        "sitemap.xml",
        "sw.js"
    ]
    
    for file in files_to_copy:
        if Path(file).exists():
            shutil.copy2(file, dist_dir / file)
            print(f"✅ Copiado: {file}")
    
    # Copiar directorios
    dirs_to_copy = ["src", "assets", "Material visual"]
    
    for dir_name in dirs_to_copy:
        src_dir = Path(dir_name)
        if src_dir.exists():
            dst_dir = dist_dir / dir_name
            shutil.copytree(src_dir, dst_dir)
            print(f"✅ Copiado directorio: {dir_name}")
    
    # Generar API mock para demostración
    generate_mock_api(dist_dir)
    
    # Actualizar URLs en HTML
    update_html_for_github_pages(dist_dir)
    
    print("🎉 Sitio estático generado exitosamente en /dist")
    print("🌐 URL EN VIVO: https://ferneyq.github.io/datacrypt-labs-website")
    print("✅ Deploy GitHub Pages - 100% GRATUITO ¡Funcionando!")

def generate_mock_api(dist_dir):
    """Genera APIs mock completas para demostración"""
    
    api_dir = dist_dir / "api"
    api_dir.mkdir(exist_ok=True)
    
    # Portfolio Stats API
    portfolio_stats = {
        "status": "success",
        "data": {
            "total_projects": 25,
            "technologies": ["Python", "FastAPI", "React", "Docker", "Machine Learning", "Business Intelligence"],
            "experience_years": 6,
            "certifications": 12,
            "clients_served": 45,
            "data_processed_gb": 2500,
            "ml_models_deployed": 18
        },
        "timestamp": "2025-10-21T20:00:00Z"
    }
    
    with open(api_dir / "portfolio-stats.json", "w") as f:
        json.dump(portfolio_stats, f, indent=2)
    
    # Health Check API
    health_data = {
        "status": "healthy",
        "version": "2.2.0",
        "environment": "production",
        "uptime": "99.9%",
        "services": {
            "database": "online",
            "analytics": "online", 
            "ml_engine": "online"
        },
        "timestamp": "2025-10-21T20:00:00Z"
    }
    
    with open(api_dir / "health.json", "w") as f:
        json.dump(health_data, f, indent=2)
    
    # Crypto Prices Mock API
    crypto_data = {
        "status": "success",
        "data": {
            "bitcoin": {"price": 67250.50, "change_24h": 2.45},
            "ethereum": {"price": 2580.75, "change_24h": -1.20},
            "cardano": {"price": 0.45, "change_24h": 3.80}
        },
        "timestamp": "2025-10-21T20:00:00Z"
    }
    
    with open(api_dir / "crypto-prices.json", "w") as f:
        json.dump(crypto_data, f, indent=2)
    
    # Game Leaderboard Mock API
    game_data = {
        "status": "success",
        "leaderboard": [
            {"player": "DataMaster", "score": 9850, "level": 10},
            {"player": "CryptoAnalyst", "score": 9200, "level": 9},
            {"player": "MLExpert", "score": 8750, "level": 8},
            {"player": "BISpecialist", "score": 8100, "level": 7},
            {"player": "DataScientist", "score": 7650, "level": 6}
        ],
        "total_players": 1247,
        "timestamp": "2025-10-21T20:00:00Z"
    }
    
    with open(api_dir / "game-leaderboard.json", "w") as f:
        json.dump(game_data, f, indent=2)
    
    print("✅ APIs mock completas generadas (Portfolio, Health, Crypto, Game)")

def update_html_for_github_pages(dist_dir):
    """Actualiza HTML para GitHub Pages con APIs mock funcionales"""
    
    index_file = dist_dir / "index.html"
    if index_file.exists():
        content = index_file.read_text(encoding='utf-8')
        
        # Actualizar todas las URLs de API para usar archivos JSON estáticos  
        api_mappings = {
            '/api/portfolio/stats': './api/portfolio-stats.json',
            '/health': './api/health.json',
            '/api/health': './api/health.json',
            '/api/crypto/prices': './api/crypto-prices.json',
            '/api/game/leaderboard': './api/game-leaderboard.json'
        }
        
        for old_url, new_url in api_mappings.items():
            content = content.replace(old_url, new_url)
        
        # Agregar mensaje de GitHub Pages en el header
        github_notice = '''
        <!-- GitHub Pages Deploy - APIs Mock Funcionales -->
        <div id="github-pages-notice" style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 8px; text-align: center; font-size: 14px; position: relative; z-index: 1000;">
            🎉 <strong>DataCrypt Labs EN VIVO</strong> - Deploy GitHub Pages GRATUITO con APIs Mock Funcionales 
            <span style="margin-left: 10px;">📧 Contacto: ferneyquiroga101@gmail.com</span>
        </div>
        '''
        
        # Insertar el notice después del body tag
        content = content.replace('<body>', f'<body>{github_notice}')
        
        index_file.write_text(content, encoding='utf-8')
        print("✅ HTML actualizado para GitHub Pages con APIs mock funcionales")
        print("✅ Agregado banner de GitHub Pages con correos actualizados")

if __name__ == "__main__":
    generate_static_site()