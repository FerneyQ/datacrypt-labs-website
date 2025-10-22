"""
🔄 Script de Migración - DataCrypt Labs
Migración del sistema monolítico al modular
"""

import os
import shutil
from pathlib import Path
from datetime import datetime

def main():
    print("🔄 INICIANDO MIGRACIÓN AL SISTEMA MODULAR")
    print("=" * 50)
    
    # Crear directorio de backup
    backup_dir = Path("backups") / f"migration_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    # Backup del main.py monolítico
    main_file = Path("backend/main.py")
    if main_file.exists():
        shutil.copy2(main_file, backup_dir / "main_monolithic.py")
        print(f"✅ Backup creado: {backup_dir}/main_monolithic.py")
    
    # Backup de la base de datos
    db_file = Path("datacrypt_admin.db")
    if db_file.exists():
        shutil.copy2(db_file, backup_dir / "datacrypt_admin_backup.db")
        print(f"✅ Base de datos respaldada: {backup_dir}/datacrypt_admin_backup.db")
    
    print(f"📦 Backup completado en: {backup_dir}")
    
    # Validar estructura modular
    print("\n🔍 Validando estructura modular...")
    
    required_files = [
        "backend/config/__init__.py",
        "backend/config/settings.py", 
        "backend/models/__init__.py",
        "backend/services/__init__.py",
        "backend/core/__init__.py",
        "backend/utils/__init__.py",
        "backend/utils/logger.py",
        "backend/api/__init__.py",
        "backend/api/v1/auth.py",
        "backend/api/v1/admin.py",
        "backend/api/v1/contact.py",
        "backend/api/v1/portfolio.py",
        "backend/api/v1/games.py",
        "backend/api/v1/health.py",
        "backend/api/v1/ml.py",
        "backend/api/v1/data.py"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Archivos faltantes:")
        for file in missing_files:
            print(f"   - {file}")
    else:
        print("✅ Estructura modular completa")
    
    print("\n🎉 MIGRACIÓN LISTA PARA COMPLETAR")
    print("📋 Próximos pasos:")
    print("1. Revisar estructura modular")
    print("2. Probar nuevo sistema")
    print("3. Actualizar documentación")

if __name__ == "__main__":
    main()