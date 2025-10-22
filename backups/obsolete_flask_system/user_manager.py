"""
DataCrypt Labs - Gestor de Usuarios del Sistema
Sistema para crear y gestionar usuarios específicos del servidor
Filosofía de Mejora Continua - PDCA
"""

import sqlite3
import hashlib
import secrets
import json
from datetime import datetime
from pathlib import Path
import logging
from admin_auth_system import DataCryptAuthSystem

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class UserManager:
    def __init__(self, db_path="datacrypt_admin.db"):
        self.db_path = Path(db_path)
        self.auth_system = DataCryptAuthSystem(db_path)
        
        # Roles disponibles del sistema
        self.available_roles = {
            'super_admin': {
                'description': 'Administrador principal con acceso completo',
                'permissions': ['all']
            },
            'server_admin': {
                'description': 'Administrador del servidor con permisos técnicos',
                'permissions': ['server_management', 'metrics', 'logs', 'users_view']
            },
            'metrics_viewer': {
                'description': 'Solo visualización de métricas y reportes',
                'permissions': ['metrics_view', 'reports_view']
            },
            'operator': {
                'description': 'Operador con permisos limitados',
                'permissions': ['basic_operations', 'metrics_view']
            },
            'readonly': {
                'description': 'Solo lectura del sistema',
                'permissions': ['read_only']
            }
        }
    
    def connect_db(self):
        """Conectar a la base de datos"""
        try:
            self.connection = sqlite3.connect(self.db_path, check_same_thread=False)
            self.connection.row_factory = sqlite3.Row
            return True
        except Exception as e:
            logger.error(f"❌ Error conectando a BD: {e}")
            return False
    
    def close_db(self):
        """Cerrar conexión"""
        if hasattr(self, 'connection') and self.connection:
            self.connection.close()
    
    def create_user(self, username, email, password, role='server_admin', full_name=None):
        """Crear un nuevo usuario del sistema"""
        
        # Validar role
        if role not in self.available_roles:
            return {
                'success': False, 
                'message': f'Rol inválido. Roles disponibles: {list(self.available_roles.keys())}'
            }
        
        # Validar fortaleza de contraseña
        is_strong, errors = self.auth_system.validate_password_strength(password)
        if not is_strong:
            return {'success': False, 'message': 'Contraseña débil', 'errors': errors}
        
        if not self.connect_db():
            return {'success': False, 'message': 'Error de conexión a base de datos'}
        
        try:
            cursor = self.connection.cursor()
            
            # Verificar si el usuario ya existe
            cursor.execute("""
                SELECT username, email FROM admin_users 
                WHERE username = ? OR email = ?
            """, (username, email))
            
            existing_user = cursor.fetchone()
            if existing_user:
                return {'success': False, 'message': 'Usuario o email ya existe'}
            
            # Generar hash de contraseña
            password_hash, salt = self.auth_system.hash_password(password)
            
            # Crear usuario
            cursor.execute("""
                INSERT INTO admin_users (
                    username, email, password_hash, salt, role, full_name, 
                    is_active, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, (username, email, password_hash, salt, role, full_name or username))
            
            user_id = cursor.lastrowid
            
            # Log de auditoría
            cursor.execute("""
                INSERT INTO audit_logs (user_id, action, resource, details, success)
                VALUES (?, 'USER_CREATED', 'admin_users', ?, 1)
            """, (user_id, f'Usuario creado: {username} con rol {role}'))
            
            self.connection.commit()
            
            logger.info(f"✅ Usuario creado: {username} ({role})")
            
            return {
                'success': True,
                'message': 'Usuario creado exitosamente',
                'user': {
                    'id': user_id,
                    'username': username,
                    'email': email,
                    'role': role,
                    'permissions': self.available_roles[role]['permissions']
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Error creando usuario: {e}")
            return {'success': False, 'message': f'Error interno: {e}'}
        
        finally:
            self.close_db()
    
    def list_users(self):
        """Listar todos los usuarios del sistema"""
        if not self.connect_db():
            return {'success': False, 'message': 'Error de conexión'}
        
        try:
            cursor = self.connection.cursor()
            
            cursor.execute("""
                SELECT id, username, email, role, full_name, is_active, 
                       created_at, last_login, last_ip
                FROM admin_users
                ORDER BY created_at DESC
            """)
            
            users = []
            for row in cursor.fetchall():
                users.append({
                    'id': row[0],
                    'username': row[1],
                    'email': row[2],
                    'role': row[3],
                    'full_name': row[4],
                    'is_active': bool(row[5]),
                    'created_at': row[6],
                    'last_login': row[7],
                    'last_ip': row[8],
                    'role_description': self.available_roles.get(row[3], {}).get('description', 'Rol desconocido'),
                    'permissions': self.available_roles.get(row[3], {}).get('permissions', [])
                })
            
            return {'success': True, 'users': users}
            
        except Exception as e:
            logger.error(f"❌ Error listando usuarios: {e}")
            return {'success': False, 'message': f'Error interno: {e}'}
        
        finally:
            self.close_db()
    
    def update_user_role(self, user_id, new_role):
        """Actualizar rol de usuario"""
        if new_role not in self.available_roles:
            return {'success': False, 'message': f'Rol inválido. Disponibles: {list(self.available_roles.keys())}'}
        
        if not self.connect_db():
            return {'success': False, 'message': 'Error de conexión'}
        
        try:
            cursor = self.connection.cursor()
            
            # Obtener datos actuales del usuario
            cursor.execute("SELECT username, role FROM admin_users WHERE id = ?", (user_id,))
            user = cursor.fetchone()
            
            if not user:
                return {'success': False, 'message': 'Usuario no encontrado'}
            
            old_role = user[1]
            username = user[0]
            
            # Actualizar rol
            cursor.execute("""
                UPDATE admin_users 
                SET role = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (new_role, user_id))
            
            # Log de auditoría
            cursor.execute("""
                INSERT INTO audit_logs (user_id, action, resource, details, success)
                VALUES (?, 'ROLE_UPDATED', 'admin_users', ?, 1)
            """, (user_id, f'Rol cambiado de {old_role} a {new_role}'))
            
            self.connection.commit()
            
            logger.info(f"✅ Rol actualizado para {username}: {old_role} → {new_role}")
            
            return {
                'success': True,
                'message': f'Rol actualizado a {new_role}',
                'user': {
                    'id': user_id,
                    'username': username,
                    'old_role': old_role,
                    'new_role': new_role,
                    'permissions': self.available_roles[new_role]['permissions']
                }
            }
            
        except Exception as e:
            logger.error(f"❌ Error actualizando rol: {e}")
            return {'success': False, 'message': f'Error interno: {e}'}
        
        finally:
            self.close_db()
    
    def deactivate_user(self, user_id):
        """Desactivar usuario"""
        if not self.connect_db():
            return {'success': False, 'message': 'Error de conexión'}
        
        try:
            cursor = self.connection.cursor()
            
            # Obtener username
            cursor.execute("SELECT username FROM admin_users WHERE id = ?", (user_id,))
            user = cursor.fetchone()
            
            if not user:
                return {'success': False, 'message': 'Usuario no encontrado'}
            
            username = user[0]
            
            # Desactivar usuario
            cursor.execute("""
                UPDATE admin_users 
                SET is_active = 0, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (user_id,))
            
            # Invalidar todas las sesiones del usuario
            cursor.execute("""
                UPDATE user_sessions 
                SET is_active = 0 
                WHERE user_id = ?
            """, (user_id,))
            
            # Log de auditoría
            cursor.execute("""
                INSERT INTO audit_logs (user_id, action, resource, details, success)
                VALUES (?, 'USER_DEACTIVATED', 'admin_users', ?, 1)
            """, (user_id, f'Usuario {username} desactivado'))
            
            self.connection.commit()
            
            logger.info(f"✅ Usuario desactivado: {username}")
            
            return {
                'success': True,
                'message': f'Usuario {username} desactivado exitosamente'
            }
            
        except Exception as e:
            logger.error(f"❌ Error desactivando usuario: {e}")
            return {'success': False, 'message': f'Error interno: {e}'}
        
        finally:
            self.close_db()
    
    def reset_user_password(self, user_id, new_password):
        """Resetear contraseña de usuario"""
        # Validar fortaleza de contraseña
        is_strong, errors = self.auth_system.validate_password_strength(new_password)
        if not is_strong:
            return {'success': False, 'message': 'Contraseña débil', 'errors': errors}
        
        if not self.connect_db():
            return {'success': False, 'message': 'Error de conexión'}
        
        try:
            cursor = self.connection.cursor()
            
            # Obtener username
            cursor.execute("SELECT username FROM admin_users WHERE id = ? AND is_active = 1", (user_id,))
            user = cursor.fetchone()
            
            if not user:
                return {'success': False, 'message': 'Usuario no encontrado o inactivo'}
            
            username = user[0]
            
            # Generar nuevo hash
            password_hash, salt = self.auth_system.hash_password(new_password)
            
            # Actualizar contraseña
            cursor.execute("""
                UPDATE admin_users 
                SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (password_hash, salt, user_id))
            
            # Invalidar todas las sesiones del usuario
            cursor.execute("""
                UPDATE user_sessions 
                SET is_active = 0 
                WHERE user_id = ?
            """, (user_id,))
            
            # Log de auditoría
            cursor.execute("""
                INSERT INTO audit_logs (user_id, action, resource, details, success)
                VALUES (?, 'PASSWORD_RESET', 'admin_users', ?, 1)
            """, (user_id, f'Contraseña reseteada para {username}'))
            
            self.connection.commit()
            
            logger.info(f"✅ Contraseña reseteada para: {username}")
            
            return {
                'success': True,
                'message': f'Contraseña reseteada para {username}'
            }
            
        except Exception as e:
            logger.error(f"❌ Error reseteando contraseña: {e}")
            return {'success': False, 'message': f'Error interno: {e}'}
        
        finally:
            self.close_db()
    
    def get_role_info(self, role=None):
        """Obtener información de roles"""
        if role:
            if role in self.available_roles:
                return {
                    'success': True,
                    'role': role,
                    'info': self.available_roles[role]
                }
            else:
                return {'success': False, 'message': 'Rol no encontrado'}
        else:
            return {
                'success': True,
                'roles': self.available_roles
            }

def interactive_user_creation():
    """Función interactiva para crear usuarios"""
    print("🔐 DATACRYPT LABS - CREADOR DE USUARIOS")
    print("=" * 60)
    
    manager = UserManager()
    
    # Mostrar roles disponibles
    roles_info = manager.get_role_info()
    print("📋 ROLES DISPONIBLES:")
    for role, info in roles_info['roles'].items():
        print(f"   • {role}: {info['description']}")
        print(f"     Permisos: {', '.join(info['permissions'])}")
    print()
    
    try:
        # Solicitar datos del usuario
        username = input("👤 Nombre de usuario: ").strip()
        if not username:
            print("❌ El nombre de usuario es requerido")
            return
        
        email = input("📧 Email: ").strip()
        if not email:
            print("❌ El email es requerido")
            return
        
        password = input("🔑 Contraseña: ").strip()
        if not password:
            print("❌ La contraseña es requerida")
            return
        
        print("\n📋 Roles disponibles:")
        role_list = list(roles_info['roles'].keys())
        for i, role in enumerate(role_list, 1):
            print(f"   {i}. {role}")
        
        try:
            role_choice = int(input("Seleccionar rol (número): ")) - 1
            if 0 <= role_choice < len(role_list):
                role = role_list[role_choice]
            else:
                print("❌ Selección inválida, usando 'server_admin' por defecto")
                role = 'server_admin'
        except ValueError:
            print("❌ Entrada inválida, usando 'server_admin' por defecto")
            role = 'server_admin'
        
        full_name = input("📝 Nombre completo (opcional): ").strip() or None
        
        # Crear usuario
        print("\n🔄 Creando usuario...")
        result = manager.create_user(username, email, password, role, full_name)
        
        if result['success']:
            print("✅ ¡Usuario creado exitosamente!")
            print(f"👤 Usuario: {result['user']['username']}")
            print(f"📧 Email: {result['user']['email']}")
            print(f"🎭 Rol: {result['user']['role']}")
            print(f"🔐 Permisos: {', '.join(result['user']['permissions'])}")
        else:
            print(f"❌ Error: {result['message']}")
            if 'errors' in result:
                for error in result['errors']:
                    print(f"   • {error}")
        
    except KeyboardInterrupt:
        print("\n\n⏹️ Operación cancelada por el usuario")
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")

def main():
    """Función principal"""
    print("🔐 DATACRYPT LABS - GESTOR DE USUARIOS")
    print("=" * 60)
    
    manager = UserManager()
    
    while True:
        print("\n📋 OPCIONES DISPONIBLES:")
        print("1. 👤 Crear nuevo usuario")
        print("2. 📋 Listar usuarios existentes")
        print("3. 🎭 Actualizar rol de usuario")
        print("4. ❌ Desactivar usuario")
        print("5. 🔑 Resetear contraseña")
        print("6. 📖 Ver información de roles")
        print("7. 🚪 Salir")
        
        try:
            choice = input("\nSeleccionar opción (1-7): ").strip()
            
            if choice == '1':
                interactive_user_creation()
            
            elif choice == '2':
                print("\n👥 USUARIOS EXISTENTES:")
                result = manager.list_users()
                if result['success']:
                    for user in result['users']:
                        status = "✅ Activo" if user['is_active'] else "❌ Inactivo"
                        print(f"   • {user['username']} ({user['email']}) - {user['role']} - {status}")
                        print(f"     ID: {user['id']}, Creado: {user['created_at']}")
                        if user['last_login']:
                            print(f"     Último login: {user['last_login']} desde {user['last_ip']}")
                        print()
                else:
                    print(f"❌ Error: {result['message']}")
            
            elif choice == '3':
                user_id = input("🆔 ID del usuario a actualizar: ").strip()
                try:
                    user_id = int(user_id)
                    roles_info = manager.get_role_info()
                    print("📋 Roles disponibles:")
                    role_list = list(roles_info['roles'].keys())
                    for i, role in enumerate(role_list, 1):
                        print(f"   {i}. {role}")
                    
                    role_choice = int(input("Nuevo rol (número): ")) - 1
                    if 0 <= role_choice < len(role_list):
                        new_role = role_list[role_choice]
                        result = manager.update_user_role(user_id, new_role)
                        if result['success']:
                            print(f"✅ {result['message']}")
                        else:
                            print(f"❌ Error: {result['message']}")
                    else:
                        print("❌ Selección inválida")
                except ValueError:
                    print("❌ ID inválido")
            
            elif choice == '4':
                user_id = input("🆔 ID del usuario a desactivar: ").strip()
                try:
                    user_id = int(user_id)
                    confirm = input(f"⚠️ ¿Confirma desactivar usuario ID {user_id}? (s/N): ").strip().lower()
                    if confirm == 's':
                        result = manager.deactivate_user(user_id)
                        if result['success']:
                            print(f"✅ {result['message']}")
                        else:
                            print(f"❌ Error: {result['message']}")
                    else:
                        print("❌ Operación cancelada")
                except ValueError:
                    print("❌ ID inválido")
            
            elif choice == '5':
                user_id = input("🆔 ID del usuario: ").strip()
                new_password = input("🔑 Nueva contraseña: ").strip()
                try:
                    user_id = int(user_id)
                    result = manager.reset_user_password(user_id, new_password)
                    if result['success']:
                        print(f"✅ {result['message']}")
                    else:
                        print(f"❌ Error: {result['message']}")
                        if 'errors' in result:
                            for error in result['errors']:
                                print(f"   • {error}")
                except ValueError:
                    print("❌ ID inválido")
            
            elif choice == '6':
                roles_info = manager.get_role_info()
                print("\n🎭 INFORMACIÓN DE ROLES:")
                for role, info in roles_info['roles'].items():
                    print(f"\n📌 {role.upper()}:")
                    print(f"   Descripción: {info['description']}")
                    print(f"   Permisos: {', '.join(info['permissions'])}")
            
            elif choice == '7':
                print("\n👋 ¡Hasta luego!")
                break
            
            else:
                print("❌ Opción inválida")
                
        except KeyboardInterrupt:
            print("\n\n⏹️ Saliendo...")
            break
        except Exception as e:
            print(f"\n❌ Error inesperado: {e}")

if __name__ == "__main__":
    main()