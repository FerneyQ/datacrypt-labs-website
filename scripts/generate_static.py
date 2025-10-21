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
    """Genera API mock para demostración"""
    
    api_dir = dist_dir / "api"
    api_dir.mkdir(exist_ok=True)
    
    # Mock data para portfolio stats
    portfolio_stats = {
        "status": "success",
        "data": {
            "total_projects": 15,
            "technologies": ["Python", "FastAPI", "React", "Docker"],
            "experience_years": 5,
            "certifications": 8
        }
    }
    
    with open(api_dir / "portfolio-stats.json", "w") as f:
        json.dump(portfolio_stats, f, indent=2)
    
    # Mock data para health check
    health_data = {
        "status": "healthy",
        "version": "2.1.0",
        "timestamp": "2025-10-21T14:30:00Z"
    }
    
    with open(api_dir / "health.json", "w") as f:
        json.dump(health_data, f, indent=2)
    
    print("✅ APIs mock generadas")

def update_html_for_github_pages(dist_dir):
    """Actualiza HTML para GitHub Pages"""
    
    index_file = dist_dir / "index.html"
    if index_file.exists():
        content = index_file.read_text(encoding='utf-8')
        
        # Actualizar URLs de API para usar archivos JSON estáticos  
        content = content.replace(
            '/api/portfolio/stats',
            './api/portfolio-stats.json'
        )
        content = content.replace(
            '/health',
            './api/health.json'
        )
        
        index_file.write_text(content, encoding='utf-8')
        print("✅ HTML actualizado para GitHub Pages")

if __name__ == "__main__":
    generate_static_site()