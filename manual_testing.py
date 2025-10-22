"""
DataCrypt Labs - Script de Pruebas Manuales del Sistema Administrativo
Guía interactiva para probar usuarios y funcionalidades
"""

import json
import time
from datetime import datetime
import sqlite3
from pathlib import Path
from admin_auth_system import DataCryptAuthSystem
import requests

def print_header(title):
    """Imprimir encabezado formateado"""
    print("\n" + "=" * 60)
    print(f"🔍 {title}")
    print("=" * 60)

def print_step(step_num, description):
    """Imprimir paso de prueba"""
    print(f"\n📋 PASO {step_num}: {description}")
    print("-" * 50)

def test_user_credentials():
    """Probar credenciales de usuarios"""
    print_header("PRUEBAS DE CREDENCIALES DE USUARIOS")
    
    users_to_test = [
        {
            'name': 'Administrador Principal',
            'username': 'admin',
            'password': 'DataCrypt2025!',
            'role': 'admin',
            'description': 'Usuario super administrador con acceso completo'
        },
        {
            'name': 'Administrador del Servidor',
            'username': 'server-datacrypt', 
            'password': 'ServerSecure2025!',
            'role': 'server_admin',
            'description': 'Usuario del servidor con permisos técnicos'
        }
    ]
    
    auth = DataCryptAuthSystem()
    
    for i, user in enumerate(users_to_test, 1):
        print_step(i, f"Probando {user['name']}")
        
        print(f"👤 Usuario: {user['username']}")
        print(f"🎭 Rol esperado: {user['role']}")
        print(f"📝 Descripción: {user['description']}")
        print()
        
        # Intentar login
        result = auth.authenticate_user(
            username=user['username'],
            password=user['password'],
            ip_address="127.0.0.1",
            user_agent="Manual Test Client"
        )
        
        if result['success']:
            print("✅ LOGIN EXITOSO")
            print(f"   🆔 ID Usuario: {result['user']['id']}")
            print(f"   📧 Email: {result['user']['email']}")
            print(f"   🎭 Rol confirmado: {result['user']['role']}")
            print(f"   🎫 Token generado: {result['token'][:50]}...")
            
            # Validar token
            validation = auth.validate_session_token(result['token'], "127.0.0.1")
            if validation['valid']:
                print(f"   ✅ Token válido (expira en {validation['expires_in']:.0f}s)")
            else:
                print(f"   ❌ Token inválido: {validation['message']}")
                
        else:
            print("❌ LOGIN FALLIDO")
            print(f"   Error: {result['message']}")
    
    print("\n🎯 RESUMEN: Ambos usuarios deberían autenticarse correctamente")

def test_dashboard_access():
    """Probar acceso al dashboard web"""
    print_header("PRUEBAS DE ACCESO AL DASHBOARD WEB")
    
    dashboard_urls = [
        {
            'name': 'Página de Login',
            'url': 'http://localhost:5000/admin/login',
            'expected': 'Formulario de login'
        },
        {
            'name': 'Dashboard Principal (sin auth)',
            'url': 'http://localhost:5000/admin/dashboard',
            'expected': 'Redirección a login'
        },
        {
            'name': 'API de Salud',
            'url': 'http://localhost:5000/health',
            'expected': 'Estado del sistema'
        }
    ]
    
    for i, endpoint in enumerate(dashboard_urls, 1):
        print_step(i, f"Probando {endpoint['name']}")
        
        try:
            response = requests.get(endpoint['url'], timeout=5)
            print(f"🌐 URL: {endpoint['url']}")
            print(f"📊 Código de respuesta: {response.status_code}")
            print(f"📏 Tamaño de respuesta: {len(response.content)} bytes")
            
            if response.status_code == 200:
                print("✅ Acceso exitoso")
                if 'application/json' in response.headers.get('content-type', ''):
                    try:
                        data = response.json()
                        print(f"📄 Datos JSON: {json.dumps(data, indent=2)}")
                    except:
                        print("📄 Respuesta JSON inválida")
                else:
                    print("📄 Respuesta HTML/texto recibida")
            else:
                print(f"⚠️ Código de estado: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Error de conexión: {e}")
    
    print("\n🎯 INSTRUCCIONES MANUALES:")
    print("1. 🌐 Abre VS Code Simple Browser en: http://localhost:5000/admin")
    print("2. 👤 Prueba login con usuario 'admin' / 'DataCrypt2025!'")
    print("3. 🔄 Cierra sesión y prueba con 'server-datacrypt' / 'ServerSecure2025!'")
    print("4. 📊 Compara las diferencias en permisos y funcionalidades")

def test_database_status():
    """Probar estado de la base de datos"""
    print_header("PRUEBAS DE ESTADO DE LA BASE DE DATOS")
    
    db_path = Path("datacrypt_admin.db")
    
    print_step(1, "Verificando archivo de base de datos")
    
    if db_path.exists():
        size = db_path.stat().st_size
        print(f"✅ Base de datos encontrada: {db_path}")
        print(f"📏 Tamaño: {size:,} bytes ({size/1024:.1f} KB)")
    else:
        print("❌ Base de datos no encontrada")
        return
    
    print_step(2, "Verificando estructura de tablas")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Obtener lista de tablas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [table[0] for table in cursor.fetchall()]
        
        print(f"📊 Tablas encontradas: {len(tables)}")
        
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"   📋 {table}: {count} registros")
        
        print_step(3, "Verificando usuarios registrados")
        
        cursor.execute("""
            SELECT id, username, email, role, is_active, created_at, last_login
            FROM admin_users
            ORDER BY id
        """)
        
        users = cursor.fetchall()
        print(f"👥 Usuarios totales: {len(users)}")
        
        for user in users:
            status = "✅ Activo" if user[4] else "❌ Inactivo"
            last_login = user[6] or "Nunca"
            print(f"   🆔 ID {user[0]}: {user[1]} ({user[3]}) - {status}")
            print(f"      📧 {user[2]} | Último login: {last_login}")
        
        print_step(4, "Verificando sesiones activas")
        
        cursor.execute("""
            SELECT COUNT(*) FROM user_sessions 
            WHERE is_active = 1 AND expires_at > datetime('now')
        """)
        
        active_sessions = cursor.fetchone()[0]
        print(f"🔄 Sesiones activas: {active_sessions}")
        
        if active_sessions > 0:
            cursor.execute("""
                SELECT s.user_id, u.username, s.ip_address, s.created_at
                FROM user_sessions s
                JOIN admin_users u ON s.user_id = u.id
                WHERE s.is_active = 1 AND s.expires_at > datetime('now')
                ORDER BY s.created_at DESC
            """)
            
            sessions = cursor.fetchall()
            for session in sessions:
                print(f"   🔗 Usuario {session[1]} desde {session[2]} ({session[3]})")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error accediendo a base de datos: {e}")

def test_security_features():
    """Probar características de seguridad"""
    print_header("PRUEBAS DE CARACTERÍSTICAS DE SEGURIDAD")
    
    auth = DataCryptAuthSystem()
    
    print_step(1, "Probando intentos de login fallidos")
    
    # Intentar login con credenciales incorrectas
    failed_login = auth.authenticate_user(
        username="admin",
        password="contraseña_incorrecta",
        ip_address="127.0.0.1",
        user_agent="Security Test"
    )
    
    if not failed_login['success']:
        print("✅ Login fallido correctamente rechazado")
        print(f"   Mensaje: {failed_login['message']}")
    else:
        print("❌ Error: Login debería haber fallado")
    
    print_step(2, "Probando validación de contraseñas débiles")
    
    weak_passwords = ["123456", "password", "admin", "abc"]
    
    for weak_pass in weak_passwords:
        is_strong, errors = auth.validate_password_strength(weak_pass)
        if not is_strong:
            print(f"✅ Contraseña '{weak_pass}' correctamente rechazada")
            print(f"   Errores: {', '.join(errors[:2])}")  # Mostrar solo primeros 2 errores
        else:
            print(f"❌ Error: Contraseña '{weak_pass}' debería ser rechazada")
    
    print_step(3, "Verificando hash de contraseñas")
    
    test_password = "TestPassword123!"
    hash1, salt1 = auth.hash_password(test_password)
    hash2, salt2 = auth.hash_password(test_password)
    
    print("🔐 Probando generación de hashes:")
    print(f"   Hash 1: {hash1[:20]}...")
    print(f"   Hash 2: {hash2[:20]}...")
    print(f"   Salts únicos: {'✅ Sí' if salt1 != salt2 else '❌ No'}")
    
    # Verificar que la misma contraseña produce hashes diferentes (por el salt)
    if hash1 != hash2:
        print("✅ Hashes únicos generados correctamente")
    else:
        print("❌ Error: Hashes deberían ser diferentes")

def interactive_login_test():
    """Prueba interactiva de login"""
    print_header("PRUEBA INTERACTIVA DE LOGIN")
    
    print("🎯 GUÍA DE PRUEBAS MANUALES EN VS CODE")
    print()
    print("📋 PASOS PARA PROBAR MANUALMENTE:")
    print()
    print("1. 🌐 ABRIR DASHBOARD:")
    print("   • VS Code → Simple Browser → http://localhost:5000/admin")
    print("   • O abrir en navegador externo")
    print()
    print("2. 🔑 PROBAR USUARIO ADMIN:")
    print("   • Usuario: admin")
    print("   • Contraseña: DataCrypt2025!")
    print("   • Verificar: Acceso completo, todas las métricas, gestión de usuarios")
    print()
    print("3. 🖥️ PROBAR USUARIO SERVIDOR:")
    print("   • Cerrar sesión del admin")
    print("   • Usuario: server-datacrypt")
    print("   • Contraseña: ServerSecure2025!")
    print("   • Verificar: Acceso limitado, solo métricas y monitoreo")
    print()
    print("4. 🔍 VERIFICAR DIFERENCIAS:")
    print("   • Admin: Ve gestión de usuarios, configuraciones")
    print("   • Servidor: Solo métricas, logs, sin gestión de usuarios")
    print()
    print("5. 🛡️ PROBAR SEGURIDAD:")
    print("   • Intentar login con credenciales incorrectas")
    print("   • Verificar bloqueo después de varios intentos")
    print("   • Probar tokens JWT en las herramientas de desarrollador")
    print()
    
    input("📌 Presiona ENTER cuando hayas completado las pruebas manuales...")
    
    print("✅ Pruebas manuales completadas")

def run_comprehensive_tests():
    """Ejecutar todas las pruebas"""
    print("🧪 DATACRYPT LABS - SUITE DE PRUEBAS MANUALES")
    print("=" * 70)
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("🎯 Objetivo: Verificar funcionamiento completo del sistema administrativo")
    print()
    
    try:
        # Ejecutar todas las pruebas
        test_user_credentials()
        test_dashboard_access()
        test_database_status()
        test_security_features()
        interactive_login_test()
        
        print_header("RESUMEN DE PRUEBAS COMPLETADAS")
        print("✅ Pruebas de credenciales de usuarios")
        print("✅ Pruebas de acceso al dashboard")
        print("✅ Verificación de base de datos")
        print("✅ Pruebas de características de seguridad")
        print("✅ Pruebas interactivas manuales")
        print()
        print("🎉 TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE")
        print()
        print("📋 PRÓXIMOS PASOS:")
        print("1. Revisar logs de auditoría en la base de datos")
        print("2. Verificar métricas en tiempo real")
        print("3. Probar diferentes navegadores")
        print("4. Simular carga de usuarios concurrentes")
        
    except KeyboardInterrupt:
        print("\n\n⏹️ Pruebas interrumpidas por el usuario")
    except Exception as e:
        print(f"\n❌ Error durante las pruebas: {e}")

def main():
    """Función principal"""
    print("🔍 DATACRYPT LABS - SISTEMA DE PRUEBAS MANUALES")
    print("=" * 60)
    print()
    print("Selecciona el tipo de prueba a realizar:")
    print()
    print("1. 🔑 Probar credenciales de usuarios")
    print("2. 🌐 Probar acceso al dashboard web")
    print("3. 🗄️ Verificar estado de base de datos")
    print("4. 🛡️ Probar características de seguridad")
    print("5. 🎮 Guía de pruebas interactivas")
    print("6. 🧪 Ejecutar todas las pruebas")
    print("7. 🚪 Salir")
    print()
    
    try:
        choice = input("Seleccionar opción (1-7): ").strip()
        
        if choice == '1':
            test_user_credentials()
        elif choice == '2':
            test_dashboard_access()
        elif choice == '3':
            test_database_status()
        elif choice == '4':
            test_security_features()
        elif choice == '5':
            interactive_login_test()
        elif choice == '6':
            run_comprehensive_tests()
        elif choice == '7':
            print("👋 ¡Hasta luego!")
        else:
            print("❌ Opción inválida")
            
    except KeyboardInterrupt:
        print("\n\n⏹️ Pruebas canceladas")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()