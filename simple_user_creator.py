"""
DataCrypt Labs - Creador Simple de Usuario del Servidor
Crear usuario del servidor sin dependencias complejas
"""

import sqlite3
import hashlib
import secrets
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def hash_password(password, salt=None):
    """Crear hash de contraseña con salt"""
    if salt is None:
        salt = secrets.token_hex(32)
    
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return password_hash.hex(), salt

def create_server_user_simple():
    """Crear usuario del servidor de forma simple"""
    print("🖥️ CREANDO USUARIO DEL SERVIDOR - MÉTODO SIMPLE")
    print("=" * 60)
    
    db_path = Path("datacrypt_admin.db")
    
    if not db_path.exists():
        print("❌ Base de datos no encontrada")
        return False
    
    # Configuración del usuario del servidor
    user_config = {
        'username': 'server-datacrypt',
        'email': 'server@datacrypt-labs.com',
        'password': 'ServerSecure2025!',
        'role': 'server_admin',
        'full_name': 'DataCrypt Server Administrator'
    }
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar si el usuario ya existe
        cursor.execute("""
            SELECT username, email FROM admin_users 
            WHERE username = ? OR email = ?
        """, (user_config['username'], user_config['email']))
        
        existing_user = cursor.fetchone()
        if existing_user:
            print(f"⚠️ El usuario '{user_config['username']}' ya existe")
            return False
        
        # Generar hash de contraseña
        password_hash, salt = hash_password(user_config['password'])
        
        print(f"👤 Creando usuario: {user_config['username']}")
        print(f"📧 Email: {user_config['email']}")
        print(f"🎭 Rol: {user_config['role']}")
        print(f"👨‍💼 Nombre completo: {user_config['full_name']}")
        print()
        
        # Insertar usuario
        cursor.execute("""
            INSERT INTO admin_users (
                username, email, password_hash, salt, role, full_name, 
                is_active, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """, (
            user_config['username'], 
            user_config['email'], 
            password_hash, 
            salt, 
            user_config['role'],
            user_config['full_name']
        ))
        
        user_id = cursor.lastrowid
        
        # Log básico de auditoría (sin usar columna 'details')
        cursor.execute("""
            INSERT INTO audit_logs (user_id, action, resource, success, timestamp)
            VALUES (?, 'USER_CREATED', 'admin_users', 1, CURRENT_TIMESTAMP)
        """, (user_id,))
        
        conn.commit()
        conn.close()
        
        print("✅ ¡Usuario del servidor creado exitosamente!")
        print()
        print("📋 DETALLES DEL USUARIO CREADO:")
        print(f"   🆔 ID: {user_id}")
        print(f"   👤 Usuario: {user_config['username']}")
        print(f"   📧 Email: {user_config['email']}")
        print(f"   🎭 Rol: {user_config['role']}")
        print(f"   👨‍💼 Nombre: {user_config['full_name']}")
        print()
        print("🔑 CREDENCIALES DE ACCESO:")
        print(f"   Usuario: {user_config['username']}")
        print(f"   Contraseña: {user_config['password']}")
        print()
        print("🔐 PERMISOS DEL ROL 'server_admin':")
        print("   • Gestión del servidor")
        print("   • Visualización de métricas")
        print("   • Acceso a logs del sistema")
        print("   • Visualización de usuarios")
        print()
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creando usuario: {e}")
        return False

def create_multiple_server_users():
    """Crear múltiples usuarios del servidor"""
    print("👥 CREANDO USUARIOS MÚLTIPLES DEL SERVIDOR")
    print("=" * 60)
    
    users_config = [
        {
            'username': 'server-main',
            'email': 'server-main@datacrypt-labs.com',
            'password': 'MainServer2025!',
            'role': 'server_admin',
            'full_name': 'Main Server Administrator'
        },
        {
            'username': 'server-backup',
            'email': 'server-backup@datacrypt-labs.com',
            'password': 'BackupServer2025!',
            'role': 'server_admin',
            'full_name': 'Backup Server Administrator'
        },
        {
            'username': 'metrics-server',
            'email': 'metrics-server@datacrypt-labs.com',
            'password': 'MetricsServer2025!',
            'role': 'metrics_viewer',
            'full_name': 'Metrics Server Monitor'
        }
    ]
    
    db_path = Path("datacrypt_admin.db")
    created_users = []
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        for user_config in users_config:
            print(f"\n🔄 Creando: {user_config['username']}")
            
            # Verificar si existe
            cursor.execute("""
                SELECT username FROM admin_users WHERE username = ?
            """, (user_config['username'],))
            
            if cursor.fetchone():
                print(f"   ⚠️ Ya existe, saltando...")
                continue
            
            # Crear hash
            password_hash, salt = hash_password(user_config['password'])
            
            # Insertar usuario
            cursor.execute("""
                INSERT INTO admin_users (
                    username, email, password_hash, salt, role, full_name, 
                    is_active, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, (
                user_config['username'], 
                user_config['email'], 
                password_hash, 
                salt, 
                user_config['role'],
                user_config['full_name']
            ))
            
            user_id = cursor.lastrowid
            
            # Log de auditoría
            cursor.execute("""
                INSERT INTO audit_logs (user_id, action, resource, success, timestamp)
                VALUES (?, 'USER_CREATED', 'admin_users', 1, CURRENT_TIMESTAMP)
            """, (user_id,))
            
            print(f"   ✅ Creado con ID {user_id}")
            created_users.append({
                'id': user_id,
                'username': user_config['username'],
                'password': user_config['password'],
                'role': user_config['role']
            })
        
        conn.commit()
        conn.close()
        
        if created_users:
            print(f"\n🎉 ¡{len(created_users)} usuarios creados exitosamente!")
            print("\n📋 RESUMEN DE CREDENCIALES:")
            print("=" * 60)
            
            for user in created_users:
                print(f"👤 {user['username']} (ID: {user['id']})")
                print(f"   🎭 Rol: {user['role']}")
                print(f"   🔑 Contraseña: {user['password']}")
                print()
        
        return created_users
        
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        return []

def list_all_users():
    """Listar todos los usuarios del sistema"""
    print("👥 USUARIOS DEL SISTEMA")
    print("=" * 40)
    
    db_path = Path("datacrypt_admin.db")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, username, email, role, full_name, is_active, 
                   created_at, last_login
            FROM admin_users
            ORDER BY created_at DESC
        """)
        
        users = cursor.fetchall()
        
        print(f"📊 Total de usuarios: {len(users)}")
        print()
        
        for user in users:
            status = "✅ Activo" if user[5] else "❌ Inactivo"
            print(f"🆔 ID {user[0]}: {user[1]}")
            print(f"   📧 Email: {user[2]}")
            print(f"   🎭 Rol: {user[3]}")
            print(f"   👨‍💼 Nombre: {user[4] or 'No definido'}")
            print(f"   📊 Estado: {status}")
            print(f"   📅 Creado: {user[6]}")
            if user[7]:
                print(f"   🔗 Último login: {user[7]}")
            print()
        
        conn.close()
        return users
        
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        return []

def main():
    """Función principal"""
    print("🔐 DATACRYPT LABS - CREADOR SIMPLE DE USUARIOS")
    print("=" * 60)
    print("¿Qué deseas hacer?")
    print()
    print("1. 🖥️ Crear usuario único del servidor")
    print("2. 👥 Crear múltiples usuarios del servidor")
    print("3. 📋 Ver todos los usuarios actuales")
    print("4. 🚪 Salir")
    print()
    
    try:
        choice = input("Seleccionar opción (1-4): ").strip()
        
        if choice == '1':
            create_server_user_simple()
        elif choice == '2':
            create_multiple_server_users()
        elif choice == '3':
            list_all_users()
        elif choice == '4':
            print("👋 ¡Hasta luego!")
        else:
            print("❌ Opción inválida")
            
    except KeyboardInterrupt:
        print("\n\n⏹️ Operación cancelada")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()