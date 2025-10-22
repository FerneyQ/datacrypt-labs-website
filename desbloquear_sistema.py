#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔓 DESBLOQUEADOR DE IP - DataCrypt Labs
Resetea bloqueos de seguridad para desarrollo
"""

import sqlite3
import os
from datetime import datetime

def desbloquear_sistema():
    """Desbloquea IPs y resetea contadores de seguridad"""
    print("🔓 DESBLOQUEADOR DE SISTEMA DE SEGURIDAD")
    print("=" * 50)
    
    db_path = 'datacrypt_admin.db'
    
    if not os.path.exists(db_path):
        print("❌ Base de datos no encontrada")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Limpiar IPs bloqueadas
        print("🧹 Limpiando IPs bloqueadas...")
        cursor.execute("DELETE FROM blocked_ips")
        deleted_ips = cursor.rowcount
        print(f"   ✅ {deleted_ips} IPs desbloqueadas")
        
        # Resetear intentos fallidos de usuarios
        print("🔄 Reseteando intentos fallidos...")
        cursor.execute("""
            UPDATE admin_users 
            SET failed_login_attempts = 0, 
                locked_until = NULL,
                login_attempts = 0
            WHERE failed_login_attempts > 0 OR locked_until IS NOT NULL
        """)
        updated_users = cursor.rowcount
        print(f"   ✅ {updated_users} usuarios desbloqueados")
        
        # Limpiar eventos de seguridad antiguos (opcional)
        print("🗑️ Limpiando eventos de seguridad...")
        cursor.execute("DELETE FROM security_events WHERE event_type IN ('IP_BLOCKED', 'FAILED_ATTEMPT')")
        deleted_events = cursor.rowcount
        print(f"   ✅ {deleted_events} eventos de bloqueo eliminados")
        
        conn.commit()
        
        print("\n" + "=" * 50)
        print("✅ SISTEMA DESBLOQUEADO EXITOSAMENTE")
        print("🎯 Ahora puedes intentar el login nuevamente")
        print("=" * 50)
        
        # Mostrar estadísticas actuales
        cursor.execute("SELECT COUNT(*) FROM admin_users WHERE is_active = 1")
        active_users = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM blocked_ips")
        blocked_ips = cursor.fetchone()[0]
        
        print(f"📊 Usuarios activos: {active_users}")
        print(f"🚫 IPs bloqueadas: {blocked_ips}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    desbloquear_sistema()