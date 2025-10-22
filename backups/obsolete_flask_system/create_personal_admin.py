"""
DataCrypt Labs - Creador de Usuario Administrador Personal
Filosofía de Mejora Continua - Sistemas Robustos de Administración
"""

import sqlite3
import hashlib
import secrets
from pathlib import Path
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def create_personal_admin_user():
    """Crear usuario administrador personal según la Filosofía de Mejora Continua"""
    
    print("🔐 DATACRYPT LABS - CREACIÓN DE USUARIO ADMINISTRADOR PERSONAL")
    print("=" * 70)
    print("📋 Filosofía de Mejora Continua: Sistemas Robustos de Administración")
    print("=" * 70)
    
    # Credenciales del usuario administrador personal
    user_config = {
        'username': 'Neyd696 :#',
        'password': 'Simelamamscoscorrea123###_@',
        'email': 'ferneyquiroga101@gmail.com',
        'role': 'super_admin',
        'full_name': 'Ferney Quiroga - Administrador Principal'
    }
    
    print("👤 INFORMACIÓN DEL USUARIO ADMINISTRADOR:")
    print(f"   🆔 Usuario: {user_config['username']}")
    print(f"   📧 Email: {user_config['email']}")
    print(f"   🎭 Rol: {user_config['role']} (Control total del sistema)")
    print(f"   👨‍💼 Nombre: {user_config['full_name']}")
    print()
    
    # Validación avanzada de contraseña
    print("🔍 VALIDANDO FORTALEZA DE LA CONTRASEÑA:")
    
    password = user_config['password']
    validations = {
        'longitud': len(password) >= 12,
        'mayusculas': any(c.isupper() for c in password),
        'minusculas': any(c.islower() for c in password), 
        'numeros': any(c.isdigit() for c in password),
        'especiales': any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password),
        'muy_especiales': any(c in '#_@' for c in password)
    }
    
    for criterio, cumple in validations.items():
        status = "✅" if cumple else "❌"
        print(f"   {status} {criterio.capitalize()}: {'Cumple' if cumple else 'No cumple'}")
    
    if all(validations.values()):
        print("🛡️ CONTRASEÑA ULTRA SEGURA - Cumple todos los criterios")
    else:
        print("⚠️ ADVERTENCIA - La contraseña podría ser más segura")
    
    print()
    
    # Crear hash ultra seguro
    print("🔐 GENERANDO HASH DE SEGURIDAD AVANZADO:")
    
    # Usar más iteraciones para mayor seguridad
    salt = secrets.token_hex(32)  # Salt de 64 caracteres
    iterations = 150000  # Más iteraciones = mayor seguridad
    
    print(f"   🧂 Salt generado: {salt[:20]}... (64 caracteres)")
    print(f"   🔄 Iteraciones PBKDF2: {iterations:,}")
    
    password_hash = hashlib.pbkdf2_hmac(
        'sha256', 
        password.encode('utf-8'), 
        salt.encode('utf-8'), 
        iterations
    ).hex()
    
    print(f"   🔒 Hash generado: {password_hash[:20]}... (64 bytes)")
    print()
    
    # Conectar a base de datos
    db_path = Path("datacrypt_admin.db")
    
    if not db_path.exists():
        print("❌ Base de datos no encontrada")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("📊 VERIFICANDO USUARIO EXISTENTE:")
        
        # Verificar si el usuario ya existe
        cursor.execute("""
            SELECT id, username, email FROM admin_users 
            WHERE username = ? OR email = ?
        """, (user_config['username'], user_config['email']))
        
        existing_user = cursor.fetchone()
        
        if existing_user:
            print(f"⚠️ USUARIO EXISTENTE ENCONTRADO:")
            print(f"   🆔 ID: {existing_user[0]}")
            print(f"   👤 Usuario: {existing_user[1]}")
            print(f"   📧 Email: {existing_user[2]}")
            print()
            
            update_choice = input("¿Deseas actualizar el usuario existente? (s/N): ").strip().lower()
            
            if update_choice == 's':
                print("🔄 ACTUALIZANDO USUARIO EXISTENTE...")
                
                cursor.execute("""
                    UPDATE admin_users 
                    SET password_hash = ?, salt = ?, email = ?, full_name = ?, 
                        role = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE username = ?
                """, (password_hash, salt, user_config['email'], 
                      user_config['full_name'], user_config['role'], user_config['username']))
                
                user_id = existing_user[0]
                action = "actualizado"
            else:
                print("❌ Operación cancelada")
                return False
        else:
            print("✅ Usuario nuevo - Procediendo con la creación")
            print()
            print("💾 INSERTANDO EN BASE DE DATOS:")
            
            # Crear nuevo usuario
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
            action = "creado"
        
        # Invalidar sesiones anteriores (si las hay)
        cursor.execute("""
            UPDATE user_sessions 
            SET is_active = 0 
            WHERE user_id = ?
        """, (user_id,))
        
        # Log de auditoría (sin detalles para evitar errores de columna)
        cursor.execute("""
            INSERT INTO audit_logs (user_id, action, resource, success, timestamp)
            VALUES (?, ?, 'admin_users', 1, CURRENT_TIMESTAMP)
        """, (user_id, f'USER_{action.upper()}'))
        
        conn.commit()
        conn.close()
        
        print(f"✅ USUARIO {action.upper()} EXITOSAMENTE")
        print()
        print("🎉 CREDENCIALES DEL ADMINISTRADOR PRINCIPAL:")
        print("=" * 50)
        print(f"🆔 ID de Usuario: {user_id}")
        print(f"👤 Usuario: {user_config['username']}")
        print(f"🔑 Contraseña: {user_config['password']}")
        print(f"📧 Email: {user_config['email']}")
        print(f"🎭 Rol: {user_config['role']}")
        print(f"👨‍💼 Nombre: {user_config['full_name']}")
        print()
        print("🔐 PERMISOS DE SUPER ADMINISTRADOR:")
        print("   ✅ Control total del sistema")
        print("   ✅ Crear/editar/eliminar usuarios")
        print("   ✅ Acceso completo a métricas")
        print("   ✅ Configuración del sistema")
        print("   ✅ Gestión de la base de datos")
        print("   ✅ Logs y auditorías completas")
        print("   ✅ Control total del servidor")
        print()
        print("🌐 ACCESO AL DASHBOARD:")
        print("   🔗 URL: http://localhost:5000/admin")
        print(f"   👤 Usuario: {user_config['username']}")
        print(f"   🔑 Contraseña: {user_config['password']}")
        print()
        print("📋 SIGUIENTE PASO:")
        print("   1. Abre VS Code Simple Browser")
        print("   2. Ve a: http://localhost:5000/admin") 
        print("   3. Usa tus credenciales personalizadas")
        print("   4. Explora el panel con permisos completos")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creando usuario: {e}")
        print(f"❌ ERROR: {e}")
        return False

def verify_new_admin():
    """Verificar que el nuevo administrador funciona"""
    print("\n🧪 VERIFICANDO NUEVO ADMINISTRADOR...")
    
    try:
        from admin_auth_system import DataCryptAuthSystem
        
        auth = DataCryptAuthSystem()
        
        # Probar autenticación
        result = auth.authenticate_user(
            username="Neyd696 :#",
            password="Simelamamscoscorrea123###_@",
            ip_address="127.0.0.1",
            user_agent="Admin Verification Test"
        )
        
        if result['success']:
            print("✅ AUTENTICACIÓN EXITOSA")
            print(f"   👤 Usuario confirmado: {result['user']['username']}")
            print(f"   🎭 Rol confirmado: {result['user']['role']}")
            print(f"   📧 Email confirmado: {result['user']['email']}")
            print(f"   🎫 Token JWT: {result['token'][:30]}...")
        else:
            print(f"❌ Error de autenticación: {result['message']}")
            
    except Exception as e:
        print(f"❌ Error en verificación: {e}")

def main():
    """Función principal"""
    print("🎯 CREADOR DE ADMINISTRADOR PERSONAL")
    print("Filosofía de Mejora Continua - DataCrypt Labs")
    print()
    
    if create_personal_admin_user():
        verify_new_admin()
        
        print("\n🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!")
        print("Tu usuario administrador personal está listo para usar.")
    else:
        print("\n❌ Error en el proceso de creación")

if __name__ == "__main__":
    main()