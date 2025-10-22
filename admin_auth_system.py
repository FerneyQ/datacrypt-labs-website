#!/usr/bin/env python3
"""
DataCrypt Labs - Sistema de Autenticación Administrativo
Sistema completo de login, sesiones y control de acceso
Filosofía de Mejora Continua - PDCA
"""

import sqlite3
import hashlib
import secrets
import jwt
import json
from datetime import datetime, timedelta
from pathlib import Path
import logging
from functools import wraps
import ipaddress
import re

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DataCryptAuthSystem:
    def __init__(self, db_path="datacrypt_admin.db", secret_key=None):
        self.db_path = Path(db_path)
        self.secret_key = secret_key or secrets.token_hex(32)
        self.connection = None
        
        # Configuraciones de seguridad
        self.config = {
            'session_timeout': 3600,  # 1 hora
            'max_login_attempts': 5,
            'lockout_duration': 1800,  # 30 minutos
            'password_min_length': 8,
            'password_require_special': True,
            'jwt_algorithm': 'HS256',
            'token_refresh_threshold': 300  # 5 minutos
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
        if self.connection:
            self.connection.close()
    
    def validate_password_strength(self, password):
        """Validar fortaleza de contraseña"""
        errors = []
        
        if len(password) < self.config['password_min_length']:
            errors.append(f"La contraseña debe tener al menos {self.config['password_min_length']} caracteres")
        
        if not re.search(r"[A-Z]", password):
            errors.append("La contraseña debe contener al menos una mayúscula")
        
        if not re.search(r"[a-z]", password):
            errors.append("La contraseña debe contener al menos una minúscula")
        
        if not re.search(r"\d", password):
            errors.append("La contraseña debe contener al menos un número")
        
        if self.config['password_require_special'] and not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            errors.append("La contraseña debe contener al menos un carácter especial")
        
        return len(errors) == 0, errors
    
    def hash_password(self, password, salt=None):
        """Crear hash de contraseña con salt"""
        if salt is None:
            salt = secrets.token_hex(32)
        
        password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return password_hash.hex(), salt
    
    def verify_password(self, password, stored_hash, salt):
        """Verificar contraseña"""
        password_hash, _ = self.hash_password(password, salt)
        return password_hash == stored_hash
    
    def is_user_locked(self, user_id):
        """Verificar si el usuario está bloqueado"""
        if not self.connection:
            return True
        
        try:
            cursor = self.connection.cursor()
            cursor.execute("""
                SELECT locked_until, failed_login_attempts 
                FROM admin_users 
                WHERE id = ? AND is_active = 1
            """, (user_id,))
            
            user = cursor.fetchone()
            if not user:
                return True
            
            locked_until, failed_attempts = user
            
            # Verificar si está bloqueado por tiempo
            if locked_until:
                locked_until_dt = datetime.fromisoformat(locked_until)
                if datetime.now() < locked_until_dt:
                    return True
            
            # Verificar si excedió intentos máximos
            if failed_attempts >= self.config['max_login_attempts']:
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"❌ Error verificando bloqueo: {e}")
            return True
    
    def update_login_attempt(self, user_id, success, ip_address, user_agent=""):
        """Actualizar intentos de login"""
        if not self.connection:
            return False
        
        try:
            cursor = self.connection.cursor()
            
            if success:
                # Login exitoso - resetear contador y actualizar último login
                cursor.execute("""
                    UPDATE admin_users 
                    SET failed_login_attempts = 0, 
                        locked_until = NULL, 
                        last_login = CURRENT_TIMESTAMP,
                        last_ip = ?
                    WHERE id = ?
                """, (ip_address, user_id))
                
                # Log de auditoría
                cursor.execute("""
                    INSERT INTO audit_logs (user_id, action, resource, ip_address, user_agent, success)
                    VALUES (?, 'LOGIN_SUCCESS', 'auth', ?, ?, 1)
                """, (user_id, ip_address, user_agent))
                
            else:
                # Login fallido - incrementar contador
                cursor.execute("""
                    UPDATE admin_users 
                    SET failed_login_attempts = failed_login_attempts + 1
                    WHERE id = ?
                """, (user_id,))
                
                # Verificar si debe bloquear
                cursor.execute("SELECT failed_login_attempts FROM admin_users WHERE id = ?", (user_id,))
                attempts = cursor.fetchone()[0]
                
                if attempts >= self.config['max_login_attempts']:
                    lockout_until = datetime.now() + timedelta(seconds=self.config['lockout_duration'])
                    cursor.execute("""
                        UPDATE admin_users 
                        SET locked_until = ?
                        WHERE id = ?
                    """, (lockout_until.isoformat(), user_id))
                
                # Log de auditoría
                cursor.execute("""
                    INSERT INTO audit_logs (user_id, action, resource, ip_address, user_agent, success)
                    VALUES (?, 'LOGIN_FAILED', 'auth', ?, ?, 0)
                """, (user_id, ip_address, user_agent))
            
            self.connection.commit()
            return True
            
        except Exception as e:
            logger.error(f"❌ Error actualizando intento de login: {e}")
            return False
    
    def authenticate_user(self, username, password, ip_address, user_agent=""):
        """Autenticar usuario y crear sesión"""
        if not self.connect_db():
            return {'success': False, 'message': 'Error de conexión'}
        
        try:
            cursor = self.connection.cursor()
            
            # Buscar usuario
            cursor.execute("""
                SELECT id, username, email, password_hash, salt, role, is_active
                FROM admin_users 
                WHERE (username = ? OR email = ?) AND is_active = 1
            """, (username, username))
            
            user = cursor.fetchone()
            
            if not user:
                # Log de intento con usuario inexistente
                cursor.execute("""
                    INSERT INTO audit_logs (user_id, action, resource, ip_address, user_agent, success, error_message)
                    VALUES (NULL, 'LOGIN_FAILED', 'auth', ?, ?, 0, 'Usuario no encontrado')
                """, (ip_address, user_agent))
                self.connection.commit()
                return {'success': False, 'message': 'Credenciales inválidas'}
            
            user_id, username, email, stored_hash, salt, role, is_active = user
            
            # Verificar si está bloqueado
            if self.is_user_locked(user_id):
                return {'success': False, 'message': 'Usuario bloqueado. Intente más tarde.'}
            
            # Verificar contraseña
            if not self.verify_password(password, stored_hash, salt):
                self.update_login_attempt(user_id, False, ip_address, user_agent)
                return {'success': False, 'message': 'Credenciales inválidas'}
            
            # Login exitoso
            self.update_login_attempt(user_id, True, ip_address, user_agent)
            
            # Crear token JWT
            session_token = self.create_session_token(user_id, username, role, ip_address, user_agent)
            
            if session_token:
                return {
                    'success': True, 
                    'message': 'Login exitoso',
                    'token': session_token,
                    'user': {
                        'id': user_id,
                        'username': username,
                        'email': email,
                        'role': role
                    }
                }
            else:
                return {'success': False, 'message': 'Error creando sesión'}
            
        except Exception as e:
            logger.error(f"❌ Error en autenticación: {e}")
            return {'success': False, 'message': 'Error interno del servidor'}
        
        finally:
            self.close_db()
    
    def create_session_token(self, user_id, username, role, ip_address, user_agent):
        """Crear token de sesión JWT"""
        try:
            # Generar token único para la sesión
            session_id = secrets.token_hex(32)
            expires_at = datetime.now() + timedelta(seconds=self.config['session_timeout'])
            
            # Payload del JWT
            payload = {
                'user_id': user_id,
                'username': username,
                'role': role,
                'session_id': session_id,
                'ip_address': ip_address,
                'issued_at': datetime.now().timestamp(),
                'expires_at': expires_at.timestamp()
            }
            
            # Generar JWT
            token = jwt.encode(payload, self.secret_key, algorithm=self.config['jwt_algorithm'])
            
            # Guardar sesión en base de datos
            cursor = self.connection.cursor()
            cursor.execute("""
                INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at, is_active)
                VALUES (?, ?, ?, ?, ?, 1)
            """, (user_id, session_id, ip_address, user_agent, expires_at.isoformat()))
            
            self.connection.commit()
            
            logger.info(f"✅ Sesión creada para usuario {username}")
            return token
            
        except Exception as e:
            logger.error(f"❌ Error creando token: {e}")
            return None
    
    def validate_session_token(self, token, ip_address=None):
        """Validar token de sesión"""
        if not self.connect_db():
            return {'valid': False, 'message': 'Error de conexión'}
        
        try:
            # Decodificar JWT
            payload = jwt.decode(token, self.secret_key, algorithms=[self.config['jwt_algorithm']])
            
            user_id = payload['user_id']
            session_id = payload['session_id']
            token_ip = payload['ip_address']
            expires_at = payload['expires_at']
            
            # Verificar expiración
            if datetime.now().timestamp() > expires_at:
                return {'valid': False, 'message': 'Token expirado'}
            
            # Verificar IP (opcional, para mayor seguridad)
            if ip_address and token_ip != ip_address:
                logger.warning(f"⚠️ IP diferente en sesión. Token: {token_ip}, Actual: {ip_address}")
            
            # Verificar sesión en BD
            cursor = self.connection.cursor()
            cursor.execute("""
                SELECT s.id, s.is_active, u.username, u.role, u.is_active as user_active
                FROM user_sessions s
                JOIN admin_users u ON s.user_id = u.id
                WHERE s.session_token = ? AND s.user_id = ?
            """, (session_id, user_id))
            
            session = cursor.fetchone()
            
            if not session:
                return {'valid': False, 'message': 'Sesión no encontrada'}
            
            session_active, user_active, username, role = session[1], session[4], session[2], session[3]
            
            if not session_active or not user_active:
                return {'valid': False, 'message': 'Sesión o usuario inactivo'}
            
            # Verificar si necesita renovar el token
            time_until_expire = expires_at - datetime.now().timestamp()
            needs_refresh = time_until_expire < self.config['token_refresh_threshold']
            
            return {
                'valid': True,
                'user_id': user_id,
                'username': username,
                'role': role,
                'session_id': session_id,
                'needs_refresh': needs_refresh,
                'expires_in': time_until_expire
            }
            
        except jwt.ExpiredSignatureError:
            return {'valid': False, 'message': 'Token expirado'}
        except jwt.InvalidTokenError:
            return {'valid': False, 'message': 'Token inválido'}
        except Exception as e:
            logger.error(f"❌ Error validando token: {e}")
            return {'valid': False, 'message': 'Error interno'}
        
        finally:
            self.close_db()
    
    def refresh_session_token(self, current_token, ip_address, user_agent):
        """Renovar token de sesión"""
        validation = self.validate_session_token(current_token, ip_address)
        
        if not validation['valid']:
            return {'success': False, 'message': validation['message']}
        
        # Crear nuevo token
        if not self.connect_db():
            return {'success': False, 'message': 'Error de conexión'}
        
        try:
            new_token = self.create_session_token(
                validation['user_id'], 
                validation['username'], 
                validation['role'],
                ip_address, 
                user_agent
            )
            
            if new_token:
                # Marcar sesión anterior como inactiva
                cursor = self.connection.cursor()
                cursor.execute("""
                    UPDATE user_sessions 
                    SET is_active = 0 
                    WHERE session_token = ?
                """, (validation['session_id'],))
                
                self.connection.commit()
                
                return {
                    'success': True, 
                    'token': new_token,
                    'message': 'Token renovado exitosamente'
                }
            else:
                return {'success': False, 'message': 'Error renovando token'}
                
        finally:
            self.close_db()
    
    def logout_user(self, token, ip_address, user_agent):
        """Cerrar sesión de usuario"""
        validation = self.validate_session_token(token, ip_address)
        
        if not validation['valid']:
            return {'success': False, 'message': 'Sesión inválida'}
        
        if not self.connect_db():
            return {'success': False, 'message': 'Error de conexión'}
        
        try:
            cursor = self.connection.cursor()
            
            # Marcar sesión como inactiva
            cursor.execute("""
                UPDATE user_sessions 
                SET is_active = 0 
                WHERE session_token = ?
            """, (validation['session_id'],))
            
            # Log de auditoría
            cursor.execute("""
                INSERT INTO audit_logs (user_id, action, resource, ip_address, user_agent, success)
                VALUES (?, 'LOGOUT', 'auth', ?, ?, 1)
            """, (validation['user_id'], ip_address, user_agent))
            
            self.connection.commit()
            
            logger.info(f"✅ Logout exitoso para usuario {validation['username']}")
            return {'success': True, 'message': 'Logout exitoso'}
            
        except Exception as e:
            logger.error(f"❌ Error en logout: {e}")
            return {'success': False, 'message': 'Error interno'}
        
        finally:
            self.close_db()
    
    def change_password(self, user_id, current_password, new_password, ip_address, user_agent):
        """Cambiar contraseña de usuario"""
        # Validar fortaleza de nueva contraseña
        is_strong, errors = self.validate_password_strength(new_password)
        if not is_strong:
            return {'success': False, 'message': 'Contraseña débil', 'errors': errors}
        
        if not self.connect_db():
            return {'success': False, 'message': 'Error de conexión'}
        
        try:
            cursor = self.connection.cursor()
            
            # Obtener datos actuales del usuario
            cursor.execute("""
                SELECT password_hash, salt, username 
                FROM admin_users 
                WHERE id = ? AND is_active = 1
            """, (user_id,))
            
            user = cursor.fetchone()
            if not user:
                return {'success': False, 'message': 'Usuario no encontrado'}
            
            stored_hash, salt, username = user
            
            # Verificar contraseña actual
            if not self.verify_password(current_password, stored_hash, salt):
                # Log de intento fallido
                cursor.execute("""
                    INSERT INTO audit_logs (user_id, action, resource, ip_address, user_agent, success, error_message)
                    VALUES (?, 'PASSWORD_CHANGE_FAILED', 'admin_users', ?, ?, 0, 'Contraseña actual incorrecta')
                """, (user_id, ip_address, user_agent))
                self.connection.commit()
                return {'success': False, 'message': 'Contraseña actual incorrecta'}
            
            # Generar nuevo hash
            new_hash, new_salt = self.hash_password(new_password)
            
            # Actualizar contraseña
            cursor.execute("""
                UPDATE admin_users 
                SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (new_hash, new_salt, user_id))
            
            # Invalidar todas las sesiones activas del usuario
            cursor.execute("""
                UPDATE user_sessions 
                SET is_active = 0 
                WHERE user_id = ? AND is_active = 1
            """, (user_id,))
            
            # Log de auditoría
            cursor.execute("""
                INSERT INTO audit_logs (user_id, action, resource, ip_address, user_agent, success)
                VALUES (?, 'PASSWORD_CHANGED', 'admin_users', ?, ?, 1)
            """, (user_id, ip_address, user_agent))
            
            self.connection.commit()
            
            logger.info(f"✅ Contraseña cambiada para usuario {username}")
            return {'success': True, 'message': 'Contraseña cambiada exitosamente'}
            
        except Exception as e:
            logger.error(f"❌ Error cambiando contraseña: {e}")
            return {'success': False, 'message': 'Error interno'}
        
        finally:
            self.close_db()
    
    def get_active_sessions(self, user_id=None):
        """Obtener sesiones activas"""
        if not self.connect_db():
            return []
        
        try:
            cursor = self.connection.cursor()
            
            if user_id:
                cursor.execute("""
                    SELECT s.id, s.user_id, u.username, s.ip_address, s.user_agent, 
                           s.created_at, s.expires_at
                    FROM user_sessions s
                    JOIN admin_users u ON s.user_id = u.id
                    WHERE s.user_id = ? AND s.is_active = 1 AND s.expires_at > datetime('now')
                    ORDER BY s.created_at DESC
                """, (user_id,))
            else:
                cursor.execute("""
                    SELECT s.id, s.user_id, u.username, s.ip_address, s.user_agent, 
                           s.created_at, s.expires_at
                    FROM user_sessions s
                    JOIN admin_users u ON s.user_id = u.id
                    WHERE s.is_active = 1 AND s.expires_at > datetime('now')
                    ORDER BY s.created_at DESC
                """)
            
            sessions = []
            for row in cursor.fetchall():
                sessions.append({
                    'session_id': row[0],
                    'user_id': row[1],
                    'username': row[2],
                    'ip_address': row[3],
                    'user_agent': row[4],
                    'created_at': row[5],
                    'expires_at': row[6]
                })
            
            return sessions
            
        except Exception as e:
            logger.error(f"❌ Error obteniendo sesiones: {e}")
            return []
        
        finally:
            self.close_db()
    
    def cleanup_expired_sessions(self):
        """Limpiar sesiones expiradas"""
        if not self.connect_db():
            return False
        
        try:
            cursor = self.connection.cursor()
            
            # Marcar sesiones expiradas como inactivas
            cursor.execute("""
                UPDATE user_sessions 
                SET is_active = 0 
                WHERE expires_at <= datetime('now') AND is_active = 1
            """)
            
            expired_count = cursor.rowcount
            self.connection.commit()
            
            if expired_count > 0:
                logger.info(f"✅ {expired_count} sesiones expiradas limpiadas")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error limpiando sesiones: {e}")
            return False
        
        finally:
            self.close_db()

# Decorador para requerir autenticación
def require_auth(auth_system):
    """Decorador para endpoints que requieren autenticación"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Aquí iría la lógica para obtener el token de la request
            # Por ahora es un placeholder
            token = kwargs.get('token')
            ip_address = kwargs.get('ip_address', '127.0.0.1')
            
            if not token:
                return {'success': False, 'message': 'Token requerido', 'code': 401}
            
            validation = auth_system.validate_session_token(token, ip_address)
            
            if not validation['valid']:
                return {'success': False, 'message': validation['message'], 'code': 401}
            
            # Añadir información del usuario a kwargs
            kwargs['user_info'] = {
                'user_id': validation['user_id'],
                'username': validation['username'],
                'role': validation['role']
            }
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

def main():
    """Función de prueba del sistema de autenticación"""
    print("🔐 DATACRYPT LABS - SISTEMA DE AUTENTICACIÓN")
    print("=" * 60)
    
    auth = DataCryptAuthSystem()
    
    print("🧪 Realizando pruebas del sistema...")
    
    # Prueba de autenticación
    result = auth.authenticate_user(
        username="admin",
        password="DataCrypt2025!",
        ip_address="127.0.0.1",
        user_agent="Test Browser"
    )
    
    if result['success']:
        print("✅ Login exitoso")
        print(f"👤 Usuario: {result['user']['username']}")
        print(f"🎫 Token generado: {result['token'][:50]}...")
        
        # Prueba de validación de token
        validation = auth.validate_session_token(result['token'], "127.0.0.1")
        if validation['valid']:
            print("✅ Token válido")
            print(f"⏰ Expira en: {validation['expires_in']:.0f} segundos")
        else:
            print("❌ Token inválido")
        
        # Prueba de sesiones activas
        sessions = auth.get_active_sessions()
        print(f"🔄 Sesiones activas: {len(sessions)}")
        
    else:
        print(f"❌ Login fallido: {result['message']}")
    
    # Limpiar sesiones expiradas
    auth.cleanup_expired_sessions()
    
    print("✅ Pruebas completadas")

if __name__ == "__main__":
    main()