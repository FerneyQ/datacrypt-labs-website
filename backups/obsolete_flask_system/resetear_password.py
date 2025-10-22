#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔄 RESETEAR CONTRASEÑA - DataCrypt Labs
Actualiza la contraseña del usuario admin
"""

import sqlite3
import hashlib
import os
from datetime import datetime

def hash_password_pbkdf2(password, salt=None):
    """Genera hash PBKDF2 con los mismos parámetros del sistema"""
    if salt is None:
        salt = os.urandom(32)
    
    # Usar exactamente los mismos parámetros que el sistema
    hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 150000)
    return salt + hash_obj

def resetear_password():
    """Resetea la contraseña del usuario admin"""
    print("🔄 RESETEAR CONTRASEÑA - DATACRYPT LABS")
    print("=" * 50)
    
    username = "Neyd696 :#"
    new_password = "Simelamamscoscorrea123###_@"
    
    try:
        # Conectar a la base de datos
        conn = sqlite3.connect('datacrypt_admin.db')
        cursor = conn.cursor()
        
        # Verificar que el usuario existe
        cursor.execute("SELECT id, username FROM admin_users WHERE username = ?", (username,))
        user = cursor.fetchone()
        
        if not user:
            print(f"❌ Usuario '{username}' no encontrado")
            return
        
        print(f"✅ Usuario encontrado: {user[1]}")
        print(f"🔑 Nueva contraseña: {new_password}")
        
        # Generar nuevo hash
        password_hash = hash_password_pbkdf2(new_password)
        
        # Actualizar en la base de datos
        cursor.execute("""
            UPDATE admin_users 
            SET password_hash = ?, 
                last_password_change = ?,
                failed_login_attempts = 0,
                locked_until = NULL,
                updated_at = ?
            WHERE username = ?
        """, (password_hash, datetime.now(), datetime.now(), username))
        
        conn.commit()
        
        print("✅ ¡Contraseña actualizada exitosamente!")
        print()
        
        # Verificar que el cambio funcionó
        print("🔍 Verificando nueva contraseña...")
        cursor.execute("SELECT password_hash FROM admin_users WHERE username = ?", (username,))
        stored_hash = cursor.fetchone()[0]
        
        # Verificar que coincide
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode('latin-1')
        
        salt = stored_hash[:32]
        stored_key = stored_hash[32:]
        test_key = hashlib.pbkdf2_hmac('sha256', new_password.encode('utf-8'), salt, 150000)
        
        if test_key == stored_key:
            print("✅ ¡VERIFICACIÓN EXITOSA! La nueva contraseña funciona correctamente.")
        else:
            print("❌ ERROR: La verificación falló")
        
        conn.close()
        
        print("\n" + "=" * 50)
        print("🎯 CREDENCIALES ACTUALIZADAS:")
        print(f"👤 Usuario: {username}")
        print(f"🔑 Contraseña: {new_password}")
        print(f"🌐 URL: http://127.0.0.1:5000/admin")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    resetear_password()