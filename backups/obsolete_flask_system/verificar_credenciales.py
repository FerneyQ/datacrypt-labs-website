#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 VERIFICADOR DE CREDENCIALES - DataCrypt Labs
Diagnóstico completo del sistema de autenticación
"""

import sqlite3
import hashlib
import os
from datetime import datetime

def hash_password_pbkdf2(password, salt=None):
    """Genera hash PBKDF2 igual al sistema"""
    if salt is None:
        salt = os.urandom(32)
    elif isinstance(salt, str):
        salt = salt.encode('utf-8')
    
    # Usar los mismos parámetros que el sistema principal
    hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 150000)
    return salt + hash_obj

def verificar_credenciales():
    """Verificación completa de credenciales"""
    print("🔍 VERIFICADOR DE CREDENCIALES DATACRYPT LABS")
    print("=" * 60)
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Verificar base de datos
    db_path = 'datacrypt_admin.db'
    if not os.path.exists(db_path):
        print("❌ ERROR: Base de datos no encontrada")
        return
    
    print(f"✅ Base de datos encontrada: {db_path}")
    print(f"📊 Tamaño: {os.path.getsize(db_path)} bytes")
    print()
    
    try:
        # Conectar a la base de datos
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar estructura de tabla
        print("🏗️ ESTRUCTURA DE TABLA admin_users:")
        cursor.execute("PRAGMA table_info(admin_users)")
        columns = cursor.fetchall()
        for col in columns:
            print(f"   📋 {col[1]} ({col[2]})")
        print()
        
        # Listar todos los usuarios
        print("👥 USUARIOS EN LA BASE DE DATOS:")
        cursor.execute("SELECT id, username, email, role, created_at, is_active FROM admin_users")
        users = cursor.fetchall()
        
        if not users:
            print("❌ No se encontraron usuarios en la base de datos")
            return
        
        for user in users:
            print(f"   🆔 ID: {user[0]}")
            print(f"   👤 Usuario: '{user[1]}'")
            print(f"   📧 Email: {user[2]}")
            print(f"   🏷️ Rol: {user[3]}")
            print(f"   📅 Creado: {user[4]}")
            print(f"   🟢 Activo: {user[5]}")
            print("   " + "-" * 40)
        print()
        
        # Verificar credenciales específicas
        print("🔐 VERIFICACIÓN DE CREDENCIALES ESPECÍFICAS:")
        test_username = "Neyd696 :#"
        test_password = "Simelamamscoscorrea123###_@"
        
        print(f"   🧪 Probando usuario: '{test_username}'")
        print(f"   🧪 Probando contraseña: '{test_password}'")
        print()
        
        # Buscar usuario
        cursor.execute("SELECT username, password_hash FROM admin_users WHERE username = ?", (test_username,))
        user_data = cursor.fetchone()
        
        if user_data:
            print(f"✅ Usuario encontrado: '{user_data[0]}'")
            stored_hash = user_data[1]
            print(f"🔒 Hash almacenado: {stored_hash[:50]}...")
            print()
            
            # Verificar contraseña
            if isinstance(stored_hash, str):
                stored_hash = stored_hash.encode('latin-1')  # Decodificar del string
            
            salt = stored_hash[:32]  # Primeros 32 bytes son el salt
            stored_key = stored_hash[32:]  # El resto es el hash
            
            # Generar hash con la contraseña de prueba
            test_key = hashlib.pbkdf2_hmac('sha256', test_password.encode('utf-8'), salt, 150000)
            
            if test_key == stored_key:
                print("✅ ¡CONTRASEÑA CORRECTA! Las credenciales coinciden.")
            else:
                print("❌ CONTRASEÑA INCORRECTA. El hash no coincide.")
                print(f"   🔍 Hash esperado: {stored_key.hex()[:50]}...")
                print(f"   🔍 Hash generado: {test_key.hex()[:50]}...")
        else:
            print(f"❌ Usuario '{test_username}' NO encontrado en la base de datos")
            print()
            print("📝 USUARIOS DISPONIBLES:")
            cursor.execute("SELECT username FROM admin_users")
            available_users = cursor.fetchall()
            for user in available_users:
                print(f"   - '{user[0]}'")
        
        print()
        
        # Estadísticas adicionales
        print("📊 ESTADÍSTICAS DE LA BASE DE DATOS:")
        cursor.execute("SELECT COUNT(*) FROM admin_users")
        total_users = cursor.fetchone()[0]
        print(f"   👥 Total usuarios: {total_users}")
        
        cursor.execute("SELECT COUNT(*) FROM admin_users WHERE role = 'admin'")
        admin_users = cursor.fetchone()[0]
        print(f"   👑 Usuarios admin: {admin_users}")
        
        cursor.execute("SELECT COUNT(*) FROM admin_users WHERE is_active = 1")
        active_users = cursor.fetchone()[0]
        print(f"   🟢 Usuarios activos: {active_users}")
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"❌ Error de base de datos: {e}")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
    
    print("\n" + "=" * 60)
    print("🔍 Verificación completada")

if __name__ == "__main__":
    verificar_credenciales()