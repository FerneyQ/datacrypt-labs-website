"""
DataCrypt Labs - Script de Creación Rápida de Usuarios
Crear usuarios del servidor con diferentes roles y permisos
"""

from user_manager import UserManager
import json

def create_server_user():
    """Crear usuario específico para el servidor"""
    print("🖥️ CREANDO USUARIO DEL SERVIDOR")
    print("=" * 50)
    
    manager = UserManager()
    
    # Configuración del usuario del servidor
    server_user_config = {
        'username': 'server-datacrypt',
        'email': 'server@datacrypt-labs.com',
        'password': 'ServerSecure2025!',
        'role': 'server_admin',
        'full_name': 'DataCrypt Server Administrator'
    }
    
    print(f"👤 Creando usuario: {server_user_config['username']}")
    print(f"📧 Email: {server_user_config['email']}")
    print(f"🎭 Rol: {server_user_config['role']}")
    print()
    
    # Crear el usuario
    result = manager.create_user(
        username=server_user_config['username'],
        email=server_user_config['email'],
        password=server_user_config['password'],
        role=server_user_config['role'],
        full_name=server_user_config['full_name']
    )
    
    if result['success']:
        print("✅ ¡Usuario del servidor creado exitosamente!")
        print()
        print("📋 DETALLES DEL USUARIO:")
        print(f"   🆔 ID: {result['user']['id']}")
        print(f"   👤 Usuario: {result['user']['username']}")
        print(f"   📧 Email: {result['user']['email']}")
        print(f"   🎭 Rol: {result['user']['role']}")
        print(f"   🔐 Permisos: {', '.join(result['user']['permissions'])}")
        print()
        print("🔑 CREDENCIALES DE ACCESO:")
        print(f"   Usuario: {server_user_config['username']}")
        print(f"   Contraseña: {server_user_config['password']}")
        print()
        return result['user']
    else:
        print(f"❌ Error creando usuario: {result['message']}")
        if 'errors' in result:
            print("   Errores de validación:")
            for error in result['errors']:
                print(f"   • {error}")
        return None

def create_multiple_users():
    """Crear múltiples usuarios con diferentes roles"""
    print("👥 CREANDO USUARIOS MÚLTIPLES DEL SISTEMA")
    print("=" * 60)
    
    manager = UserManager()
    
    # Configuración de usuarios predefinidos
    users_config = [
        {
            'username': 'server-main',
            'email': 'server-main@datacrypt-labs.com',
            'password': 'MainServer2025!',
            'role': 'server_admin',
            'full_name': 'Main Server Administrator',
            'description': 'Administrador principal del servidor'
        },
        {
            'username': 'metrics-monitor',
            'email': 'metrics@datacrypt-labs.com',
            'password': 'MetricsView2025!',
            'role': 'metrics_viewer',
            'full_name': 'Metrics Monitor User',
            'description': 'Usuario para monitoreo de métricas'
        },
        {
            'username': 'operator-sys',
            'email': 'operator@datacrypt-labs.com',
            'password': 'OperatorSys2025!',
            'role': 'operator',
            'full_name': 'System Operator',
            'description': 'Operador del sistema con permisos limitados'
        },
        {
            'username': 'readonly-viewer',
            'email': 'readonly@datacrypt-labs.com',
            'password': 'ReadOnly2025!',
            'role': 'readonly',
            'full_name': 'Read-Only Viewer',
            'description': 'Usuario de solo lectura'
        }
    ]
    
    created_users = []
    
    for user_config in users_config:
        print(f"\n🔄 Creando: {user_config['username']} ({user_config['description']})")
        
        result = manager.create_user(
            username=user_config['username'],
            email=user_config['email'],
            password=user_config['password'],
            role=user_config['role'],
            full_name=user_config['full_name']
        )
        
        if result['success']:
            print(f"✅ Usuario creado: {user_config['username']}")
            created_users.append({
                'username': user_config['username'],
                'password': user_config['password'],
                'role': user_config['role'],
                'id': result['user']['id']
            })
        else:
            print(f"❌ Error: {result['message']}")
    
    if created_users:
        print(f"\n🎉 ¡{len(created_users)} usuarios creados exitosamente!")
        print("\n📋 RESUMEN DE USUARIOS CREADOS:")
        print("=" * 60)
        
        for user in created_users:
            print(f"👤 {user['username']}")
            print(f"   🎭 Rol: {user['role']}")
            print(f"   🔑 Contraseña: {user['password']}")
            print(f"   🆔 ID: {user['id']}")
            print()
    
    return created_users

def list_current_users():
    """Listar usuarios actuales del sistema"""
    print("👥 USUARIOS ACTUALES DEL SISTEMA")
    print("=" * 50)
    
    manager = UserManager()
    result = manager.list_users()
    
    if result['success']:
        users = result['users']
        print(f"📊 Total de usuarios: {len(users)}")
        print()
        
        for user in users:
            status = "✅ Activo" if user['is_active'] else "❌ Inactivo"
            print(f"🆔 ID {user['id']}: {user['username']}")
            print(f"   📧 Email: {user['email']}")
            print(f"   🎭 Rol: {user['role']} ({user['role_description']})")
            print(f"   📊 Estado: {status}")
            print(f"   🔐 Permisos: {', '.join(user['permissions'])}")
            print(f"   📅 Creado: {user['created_at']}")
            if user['last_login']:
                print(f"   🔗 Último login: {user['last_login']} desde {user['last_ip']}")
            print()
    else:
        print(f"❌ Error: {result['message']}")
    
    return result

def main():
    """Función principal con opciones"""
    print("🔐 DATACRYPT LABS - CREADOR RÁPIDO DE USUARIOS")
    print("=" * 60)
    print("¿Qué tipo de usuario deseas crear?")
    print()
    print("1. 🖥️ Usuario único del servidor (server-admin)")
    print("2. 👥 Múltiples usuarios con diferentes roles")
    print("3. 📋 Ver usuarios actuales del sistema")
    print("4. 🚪 Salir")
    print()
    
    try:
        choice = input("Seleccionar opción (1-4): ").strip()
        
        if choice == '1':
            create_server_user()
        elif choice == '2':
            create_multiple_users()
        elif choice == '3':
            list_current_users()
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