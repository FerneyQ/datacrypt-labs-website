"""
DataCrypt Labs - Verificador de Usuarios del Servidor
Verificar y gestionar usuarios creados
"""

import sqlite3
from pathlib import Path
from admin_auth_system import DataCryptAuthSystem

def verify_server_users():
    """Verificar usuarios del servidor"""
    print("🔍 VERIFICACIÓN DE USUARIOS DEL SERVIDOR")
    print("=" * 60)
    
    db_path = Path("datacrypt_admin.db")
    
    if not db_path.exists():
        print("❌ Base de datos no encontrada")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Obtener todos los usuarios
        cursor.execute("""
            SELECT id, username, email, role, full_name, is_active, 
                   created_at, last_login, last_ip
            FROM admin_users
            ORDER BY created_at DESC
        """)
        
        users = cursor.fetchall()
        
        print(f"👥 USUARIOS REGISTRADOS: {len(users)}")
        print()
        
        for user in users:
            status = "✅ Activo" if user[5] else "❌ Inactivo"
            print(f"🆔 ID {user[0]}: {user[1]}")
            print(f"   📧 Email: {user[2]}")
            print(f"   🎭 Rol: {user[3]}")
            print(f"   👨‍💼 Nombre: {user[4] or 'No definido'}")
            print(f"   📊 Estado: {status}")
            print(f"   📅 Creado: {user[6]}")
            
            if user[7]:  # last_login
                print(f"   🔗 Último login: {user[7]} desde {user[8] or 'IP desconocida'}")
            else:
                print("   🔗 Nunca ha iniciado sesión")
            print()
        
        conn.close()
        return users
        
    except Exception as e:
        print(f"❌ Error verificando usuarios: {e}")
        return []

def test_server_login():
    """Probar login del usuario del servidor"""
    print("🔐 PRUEBA DE LOGIN DEL SERVIDOR")
    print("=" * 50)
    
    auth = DataCryptAuthSystem()
    
    # Credenciales del usuario del servidor
    server_credentials = [
        {
            'username': 'server-datacrypt',
            'password': 'ServerSecure2025!',
            'description': 'Usuario principal del servidor'
        }
    ]
    
    for creds in server_credentials:
        print(f"\n🧪 Probando login: {creds['username']}")
        print(f"📝 Descripción: {creds['description']}")
        
        result = auth.authenticate_user(
            username=creds['username'],
            password=creds['password'],
            ip_address="127.0.0.1",
            user_agent="Server Test Client"
        )
        
        if result['success']:
            print("✅ Login exitoso")
            print(f"👤 Usuario autenticado: {result['user']['username']}")
            print(f"📧 Email: {result['user']['email']}")
            print(f"🎭 Rol: {result['user']['role']}")
            print(f"🎫 Token JWT: {result['token'][:50]}...")
            
            # Validar token
            validation = auth.validate_session_token(result['token'], "127.0.0.1")
            if validation['valid']:
                print("✅ Token válido")
                print(f"⏰ Expira en: {validation['expires_in']:.0f} segundos")
            else:
                print(f"❌ Token inválido: {validation['message']}")
        else:
            print(f"❌ Login fallido: {result['message']}")

def get_role_permissions():
    """Mostrar permisos de los roles"""
    print("🎭 PERMISOS DE ROLES DEL SISTEMA")
    print("=" * 50)
    
    roles = {
        'super_admin': {
            'description': 'Administrador principal con acceso completo',
            'permissions': [
                'Crear/editar/eliminar usuarios',
                'Acceso completo a métricas',
                'Configuración del sistema',
                'Gestión de la base de datos',
                'Logs y auditorías completas',
                'Control total del servidor'
            ]
        },
        'server_admin': {
            'description': 'Administrador del servidor con permisos técnicos',
            'permissions': [
                'Gestión técnica del servidor',
                'Visualización de métricas del sistema',
                'Acceso a logs del servidor',
                'Visualización de usuarios (sin edición)',
                'Monitoreo de rendimiento',
                'Configuraciones técnicas básicas'
            ]
        },
        'metrics_viewer': {
            'description': 'Solo visualización de métricas y reportes',
            'permissions': [
                'Visualización de métricas',
                'Acceso a reportes',
                'Gráficos y estadísticas',
                'Dashboard de solo lectura'
            ]
        }
    }
    
    for role, info in roles.items():
        print(f"\n🎭 ROL: {role.upper()}")
        print(f"📋 Descripción: {info['description']}")
        print("🔐 Permisos:")
        for perm in info['permissions']:
            print(f"   • {perm}")

def create_additional_users():
    """Crear usuarios adicionales del servidor"""
    print("➕ CREAR USUARIOS ADICIONALES")
    print("=" * 40)
    
    additional_users = [
        {
            'username': 'backup-server',
            'email': 'backup@datacrypt-labs.com',
            'password': 'BackupSecure2025!',
            'role': 'server_admin',
            'full_name': 'Backup Server Administrator'
        },
        {
            'username': 'monitoring-server',
            'email': 'monitoring@datacrypt-labs.com', 
            'password': 'MonitorSecure2025!',
            'role': 'metrics_viewer',
            'full_name': 'Server Monitoring User'
        }
    ]
    
    try:
        conn = sqlite3.connect("datacrypt_admin.db")
        cursor = conn.cursor()
        
        import hashlib, secrets
        
        for user_config in additional_users:
            # Verificar si existe
            cursor.execute("SELECT username FROM admin_users WHERE username = ?", (user_config['username'],))
            if cursor.fetchone():
                print(f"⚠️ Usuario '{user_config['username']}' ya existe")
                continue
            
            # Generar hash
            salt = secrets.token_hex(32)
            password_hash = hashlib.pbkdf2_hmac('sha256', 
                user_config['password'].encode('utf-8'), 
                salt.encode('utf-8'), 100000).hex()
            
            # Crear usuario
            cursor.execute("""
                INSERT INTO admin_users (
                    username, email, password_hash, salt, role, full_name, 
                    is_active, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, (
                user_config['username'], user_config['email'], 
                password_hash, salt, user_config['role'], user_config['full_name']
            ))
            
            user_id = cursor.lastrowid
            print(f"✅ Usuario '{user_config['username']}' creado con ID {user_id}")
            print(f"   🔑 Contraseña: {user_config['password']}")
        
        conn.commit()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Función principal"""
    print("🔐 DATACRYPT LABS - VERIFICADOR DE USUARIOS DEL SERVIDOR")
    print("=" * 70)
    print()
    print("1. 🔍 Verificar usuarios existentes")
    print("2. 🧪 Probar login del servidor")
    print("3. 🎭 Ver permisos de roles")
    print("4. ➕ Crear usuarios adicionales")
    print("5. 🎯 Ejecutar verificación completa")
    print("6. 🚪 Salir")
    print()
    
    try:
        choice = input("Seleccionar opción (1-6): ").strip()
        
        if choice == '1':
            verify_server_users()
        elif choice == '2':
            test_server_login()
        elif choice == '3':
            get_role_permissions()
        elif choice == '4':
            create_additional_users()
        elif choice == '5':
            print("🎯 VERIFICACIÓN COMPLETA DEL SISTEMA")
            print("=" * 60)
            verify_server_users()
            print("\n" + "="*60)
            test_server_login()
            print("\n" + "="*60)
            get_role_permissions()
        elif choice == '6':
            print("👋 ¡Hasta luego!")
        else:
            print("❌ Opción inválida")
            
    except KeyboardInterrupt:
        print("\n\n⏹️ Operación cancelada")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()