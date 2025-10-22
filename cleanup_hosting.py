#!/usr/bin/env python3
"""
🗑️ LIMPIEZA DE ARCHIVOS DE HOSTING
Elimina todo código relacionado con deploy/hosting (Railway, Vercel, etc.)
Deja solo: Portfolio en GitHub Pages + Backend localhost
"""

import os
import shutil
from pathlib import Path
from datetime import datetime

def cleanup_hosting_files():
    """Elimina archivos de hosting y deployment"""
    
    # Archivos específicos de hosting para eliminar
    hosting_files = [
        # Railway
        'railway.json',
        'railway_start.py', 
        'servidor_railway.py',
        'Procfile',
        'main.py',  # Adaptador Railway
        
        # Vercel
        'vercel.json',
        'api/',  # Carpeta completa de Vercel
        '.env.production',
        'runtime.txt',
        
        # Docker/Containers
        'Dockerfile',
        'docker-compose.yml',
        '.htaccess',
        
        # Config hosting
        'nginx/',
        'config/',
        
        # Otros archivos de deployment
        'manifest.json',
        'sw.js',  # Service worker
    ]
    
    # Documentación de hosting para eliminar
    hosting_docs = [
        # Railway docs
        'RAILWAY_DEPLOYMENT_GUIDE.md',
        'RAILWAY_ACCESS_GUIDE.md', 
        'RAILWAY_DEPLOY_EN_PROCESO.md',
        'RAILWAY_DEPLOY_ID_CONFIRMADO.md',
        'RAILWAY_DEPLOY_OPTIONS.md',
        'RAILWAY_DEPLOY_SUCCESS_FINAL.md',
        'RAILWAY_NO_ACTUALIZA_SOLUCION.md',
        'RAILWAY_WORKSPACE_SOLUCION.md',
        'TIEMPOS_DEPLOY_RAILWAY.md',
        'ARREGLAR_RAILWAY_ESPECIFICO.md',
        'ARREGLAR_RAILWAY_REPOSITORIO.md',
        'OBTENER_ENLACE_RAILWAY.md',
        'SOLUCIONAR_RAILWAY_PAGADO.md',
        'ANALISIS_PDCA_RAILWAY_COMPLETO.md',
        'PDCA_RAILWAY_DEPLOY_COMPLETO.md',
        
        # Deploy general docs
        'DEPLOYMENT_GUIDE.md',
        'DEPLOYMENT_READY.md', 
        'DEPLOYMENT_EXITOSO_INMEDIATO.md',
        'DEPLOY_EN_EJECUCION_RAILWAY.md',
        'DEPLOY_EN_VIVO_AHORA.md',
        'DEPLOY_EXITOSO_MEJORA_CONTINUA.md',
        'DEPLOY_INMEDIATO_RAILWAY.md',
        'DEPLOY_REAL_GUIDE.md',
        'DESPLIEGUE_EXITOSO_FINAL.md',
        'GUIA_DEPLOY_WEB.md',
        'READY_TO_DEPLOY.md',
        'PDCA_DEPLOY_DIRECTO.md',
        
        # Hosting/Cloud docs
        'NO_PAGAR_MAS_SOLUCION.md',
        'SOLUCION_NEYDS_PROJECTS.md',
        'SOLUCION_NO_REPOSITORIO.md',
        'CONFIRMACION_DEPLOY_FINAL.md',
        'DATACRYPT_LABS_DEPLOY_SUCCESS_FINAL.md',
        'CERTIFICADO_DEPLOYMENT_FINAL_2025.md',
        'REPORTE_FINAL_DEPLOYMENT_CALIDAD_SEGURIDAD_2025.md',
        'ENLACES_DIRECTOS_DATACRYPT.md',
        'GITHUB_DEPLOYMENT_STEPS.md',
        'GITHUB_SETUP_EXACT.md',
        'VERIFICACION_DEPLOY.md',
        'VERIFICACION_DEPLOY_RAILWAY.md',
        'VERIFICACION_COMPLETA_FINAL.md',
        'WEB_TESTING_AMBIENTE_PRODUCCION.md',
        'WEB_TESTING_SUCCESS_FINAL.md',
        
        # Testing relacionado con deploy
        'TESTING_WEB_MEJORA_CONTINUA.md',
        'TESTING_FINAL_PRODUCCION_EXITOSO.md',
        'TESTING_COMPLETO_MEJORA_CONTINUA.md',
        'deployment_test_report_20251021_185002.json',
        'deployment_verification_20251021_185955.json',
        'offline_test_report.json',
    ]
    
    # Crear carpeta de backup
    backup_dir = Path('backups/hosting_removed')
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    removed_files = []
    removed_docs = []
    not_found = []
    
    print("🗑️ LIMPIEZA DE ARCHIVOS DE HOSTING")
    print("=" * 50)
    
    # Eliminar archivos de hosting
    print("\\n📁 Eliminando archivos de hosting...")
    for file in hosting_files:
        file_path = Path(file)
        if file_path.exists():
            try:
                if file_path.is_dir():
                    shutil.rmtree(file_path)
                    print(f"🗂️ Carpeta eliminada: {file}")
                else:
                    file_path.unlink()
                    print(f"✅ Archivo eliminado: {file}")
                removed_files.append(file)
            except Exception as e:
                print(f"❌ Error eliminando {file}: {e}")
        else:
            not_found.append(file)
    
    # Eliminar documentación de hosting
    print("\\n📚 Eliminando documentación de hosting...")
    for doc in hosting_docs:
        doc_path = Path(doc)
        if doc_path.exists():
            try:
                doc_path.unlink()
                print(f"✅ Doc eliminado: {doc}")
                removed_docs.append(doc)
            except Exception as e:
                print(f"❌ Error eliminando {doc}: {e}")
        else:
            not_found.append(doc)
    
    # Crear archivo de inventario
    with open(backup_dir / 'HOSTING_REMOVED.md', 'w', encoding='utf-8') as f:
        f.write(f"""# 🗑️ ARCHIVOS DE HOSTING ELIMINADOS
## Limpieza realizada el {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

### ✅ Archivos de hosting eliminados ({len(removed_files)}):
""")
        for file in removed_files:
            f.write(f"- `{file}` - Archivo de hosting/deploy\\n")
        
        f.write(f"""
### ✅ Documentación eliminada ({len(removed_docs)}):
""")
        for doc in removed_docs:
            f.write(f"- `{doc}` - Documentación de deploy\\n")
        
        f.write(f"""
### ❌ Archivos no encontrados ({len(not_found)}):
""")
        for file in not_found:
            f.write(f"- `{file}` - Ya no existe\\n")
        
        f.write(f"""
### 🎯 Sistema Resultante:
- **Frontend**: GitHub Pages únicamente (index.html, assets/, src/)
- **Backend**: Localhost FastAPI únicamente (backend/main.py puerto 8000)
- **Admin**: Dashboard híbrido localhost-only (admin/dashboard.html)
- **Base Datos**: SQLite local (datacrypt_admin.db)

### 📝 Lo que se mantiene:
- ✅ `index.html` - Sitio principal GitHub Pages
- ✅ `backend/main.py` - Backend FastAPI localhost
- ✅ `admin/dashboard.html` - Panel admin localhost-only
- ✅ `assets/`, `src/` - Recursos del sitio
- ✅ `README.md` - Documentación principal
- ✅ Certificaciones y material visual

### 🚫 Lo que se eliminó:
- ❌ Todo código Railway
- ❌ Todo código Vercel
- ❌ Docker/containers
- ❌ Archivos de deploy
- ❌ Documentación de hosting
- ❌ Configuraciones de cloud

### 🎯 Resultado:
Sistema completamente local con frontend en GitHub Pages.
No más confusión sobre hosting/deployment.
""")
    
    print("\\n📊 RESUMEN:")
    print(f"✅ Archivos hosting eliminados: {len(removed_files)}")
    print(f"✅ Docs eliminados: {len(removed_docs)}")
    print(f"❌ No encontrados: {len(not_found)}")
    print(f"📁 Inventario: {backup_dir}/HOSTING_REMOVED.md")
    print("\\n🎯 Sistema limpio - Solo local + GitHub Pages")

if __name__ == "__main__":
    cleanup_hosting_files()