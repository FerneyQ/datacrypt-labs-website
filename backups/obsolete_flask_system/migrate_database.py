"""
DataCrypt Labs - Migración de Base de Datos
Actualizar esquema para soporte completo de usuarios
"""

import sqlite3
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def migrate_database():
    """Migrar base de datos para añadir campos faltantes"""
    db_path = Path("datacrypt_admin.db")
    
    if not db_path.exists():
        logger.error("❌ Base de datos no encontrada")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar estructura actual de admin_users
        cursor.execute("PRAGMA table_info(admin_users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        print("📊 Columnas actuales en admin_users:")
        for col in columns:
            print(f"   • {col}")
        
        # Añadir columna full_name si no existe
        if 'full_name' not in columns:
            print("\n🔄 Añadiendo columna 'full_name'...")
            cursor.execute("ALTER TABLE admin_users ADD COLUMN full_name TEXT")
            logger.info("✅ Columna 'full_name' añadida")
        
        # Actualizar usuarios existentes con full_name si es NULL
        cursor.execute("""
            UPDATE admin_users 
            SET full_name = username 
            WHERE full_name IS NULL OR full_name = ''
        """)
        
        affected_rows = cursor.rowcount
        if affected_rows > 0:
            logger.info(f"✅ Actualizados {affected_rows} usuarios con full_name")
        
        # Verificar y añadir otras columnas necesarias
        additional_columns = [
            ('created_by', 'INTEGER DEFAULT NULL'),
            ('last_password_change', 'TIMESTAMP DEFAULT NULL'),
            ('login_attempts', 'INTEGER DEFAULT 0'),
            ('locked_until', 'TIMESTAMP DEFAULT NULL')
        ]
        
        for col_name, col_definition in additional_columns:
            if col_name not in columns:
                print(f"🔄 Añadiendo columna '{col_name}'...")
                cursor.execute(f"ALTER TABLE admin_users ADD COLUMN {col_name} {col_definition}")
                logger.info(f"✅ Columna '{col_name}' añadida")
        
        conn.commit()
        
        # Verificar estructura final
        cursor.execute("PRAGMA table_info(admin_users)")
        final_columns = [column[1] for column in cursor.fetchall()]
        
        print(f"\n📊 Estructura final de admin_users ({len(final_columns)} columnas):")
        for col in final_columns:
            print(f"   • {col}")
        
        conn.close()
        
        print("\n✅ Migración de base de datos completada exitosamente")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error en migración: {e}")
        return False

def verify_database():
    """Verificar integridad de la base de datos"""
    db_path = Path("datacrypt_admin.db")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar todas las tablas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print("📋 VERIFICACIÓN DE TABLAS:")
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"   • {table_name}: {count} registros")
        
        # Verificar usuarios
        cursor.execute("""
            SELECT id, username, email, role, full_name, is_active 
            FROM admin_users
        """)
        
        users = cursor.fetchall()
        print(f"\n👥 USUARIOS EN EL SISTEMA ({len(users)}):")
        for user in users:
            status = "✅ Activo" if user[5] else "❌ Inactivo"
            print(f"   • ID {user[0]}: {user[1]} ({user[2]}) - {user[3]} - {status}")
            print(f"     Nombre completo: {user[4] or 'No definido'}")
        
        conn.close()
        return True
        
    except Exception as e:
        logger.error(f"❌ Error verificando base de datos: {e}")
        return False

def main():
    """Función principal"""
    print("🔧 DATACRYPT LABS - MIGRACIÓN DE BASE DE DATOS")
    print("=" * 60)
    
    print("1. 🔄 Migrar base de datos")
    print("2. 🔍 Verificar base de datos")
    print("3. ✅ Migrar y verificar")
    
    choice = input("\nSeleccionar opción (1-3): ").strip()
    
    if choice == '1':
        migrate_database()
    elif choice == '2':
        verify_database()
    elif choice == '3':
        if migrate_database():
            print("\n" + "="*50)
            verify_database()
    else:
        print("❌ Opción inválida")

if __name__ == "__main__":
    main()