#!/usr/bin/env python3
"""
🧹 LIMPIEZA DE SISTEMA OBSOLETO
Identifica y mueve archivos del sistema Flask obsoleto (puerto 5000)
a carpeta de backup para mantener limpio el proyecto actual (FastAPI puerto 8000)
"""

import os
import shutil
from pathlib import Path
from datetime import datetime

def cleanup_obsolete_files():
    """Identifica y organiza archivos obsoletos del sistema Flask"""
    
    obsolete_files = [
        # Sistema Flask obsoleto (puerto 5000)
        'servidor_ultra_seguro.py',
        'admin_dashboard.py', 
        'admin_auth_system.py',
        'create_personal_admin.py',
        'demo_jwt_explicacion.py',
        'manual_testing.py',
        'testing_completo.py',
        'testing_manual.py',
        'create_server_user.py',
        'simple_user_creator.py',
        'user_manager.py',
        'verificar_credenciales.py',
        'resetear_password.py',
        'verify_server_users.py',
        'verificar_usuario.py',
        
        # Archivos de migración/setup que ya no se usan
        'admin_database_setup.py',
        'migrate_database.py',
        'reforzar_database.py',
        'ecosystem_monitor.py',
        'vscode_monitor.py',
        'system_diagnostics.py',
        
        # Scripts de testing obsoletos
        'security_test.py',
        'security_enforcer.py',
        'desbloquear_sistema.py'
    ]
    
    # Crear carpeta de backup
    backup_dir = Path('backups/obsolete_flask_system')
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    moved_files = []
    not_found = []
    
    print("🧹 LIMPIEZA DE ARCHIVOS OBSOLETOS")
    print("=" * 50)
    
    for file in obsolete_files:
        file_path = Path(file)
        if file_path.exists():
            backup_path = backup_dir / file
            try:
                shutil.move(str(file_path), str(backup_path))
                moved_files.append(file)
                print(f"✅ Movido: {file} → backups/obsolete_flask_system/")
            except Exception as e:
                print(f"❌ Error moviendo {file}: {e}")
        else:
            not_found.append(file)
    
    # Crear archivo de inventario
    with open(backup_dir / 'INVENTORY.md', 'w', encoding='utf-8') as f:
        f.write(f"""# 📋 INVENTARIO DE ARCHIVOS OBSOLETOS
## Sistema Flask (Puerto 5000) - Movido el {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

### ✅ Archivos movidos ({len(moved_files)}):
""")
        for file in moved_files:
            f.write(f"- `{file}` - Sistema Flask obsoleto\n")
        
        f.write(f"""
### ❌ Archivos no encontrados ({len(not_found)}):
""")
        for file in not_found:
            f.write(f"- `{file}` - Ya no existe\n")
        
        f.write(f"""
### 🎯 Sistema Actual Activo:
- **Backend Principal**: `backend/main.py` (FastAPI)
- **Puerto**: 8000 
- **Admin Panel**: http://localhost:8000/admin
- **Dashboard**: `admin/dashboard.html` (GitHub Pages + localhost integration)

### 📝 Notas:
- Estos archivos eran del sistema Flask anterior (puerto 5000)
- El sistema actual usa FastAPI integrado con el backend principal
- Los archivos están preservados en esta carpeta por si se necesitan referencias
""")
    
    print("\n📊 RESUMEN:")
    print(f"✅ Archivos movidos: {len(moved_files)}")
    print(f"❌ No encontrados: {len(not_found)}")
    print(f"📁 Ubicación backup: {backup_dir}")
    print("\n🎯 Sistema actual limpio - Solo archivos activos permanecen")

if __name__ == "__main__":
    cleanup_obsolete_files()