#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🛡️ SISTEMA DE SEGURIDAD REFORZADO - DATACRYPT LABS
==================================================

Reforzamiento completo de la seguridad del servidor y API
Implementación de múltiples capas de protección

Filosofía: CERO TOLERANCIA A VULNERABILIDADES
"""

import time
import hashlib
import secrets
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, session, abort
import sqlite3
import json
import logging
from collections import defaultdict, deque
import re
import ipaddress

class SecurityEnforcer:
    """Sistema de seguridad reforzado para el servidor"""
    
    def __init__(self):
        self.failed_attempts = defaultdict(deque)  # IP -> deque de intentos
        self.blocked_ips = {}  # IP -> timestamp de bloqueo
        self.suspicious_patterns = []
        self.rate_limits = defaultdict(lambda: deque())  # endpoint -> requests
        
        # Configuración de seguridad
        self.MAX_FAILED_ATTEMPTS = 3
        self.BLOCK_DURATION = 900  # 15 minutos
        self.RATE_LIMIT_WINDOW = 60  # 1 minuto
        self.RATE_LIMIT_MAX = 30  # máximo 30 requests por minuto
        
        # Patrones maliciosos
        self.malicious_patterns = [
            r'<script.*?>.*?</script>',  # XSS
            r'union.*select',  # SQL Injection
            r'drop.*table',  # SQL Injection
            r'\.\./',  # Directory Traversal
            r'php://input',  # File inclusion
            r'eval\(',  # Code injection
            r'system\(',  # Command injection
        ]
        
        self.setup_logging()
    
    def setup_logging(self):
        """Configurar logging de seguridad"""
        self.security_logger = logging.getLogger('datacrypt_security')
        handler = logging.FileHandler('security_events.log')
        formatter = logging.Formatter(
            '%(asctime)s - SECURITY - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        self.security_logger.addHandler(handler)
        self.security_logger.setLevel(logging.INFO)
    
    def log_security_event(self, event_type, details, ip_address, severity="INFO"):
        """Registrar evento de seguridad"""
        event_data = {
            'timestamp': datetime.now().isoformat(),
            'event_type': event_type,
            'ip_address': ip_address,
            'details': details,
            'severity': severity
        }
        
        self.security_logger.info(json.dumps(event_data))
        
        # Guardar en base de datos
        try:
            conn = sqlite3.connect('datacrypt_admin.db')
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO audit_logs 
                (event_type, ip_address, user_agent, endpoint, status_code, 
                 timestamp, details, severity)
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
            ''', (
                event_type, ip_address, 
                request.headers.get('User-Agent', 'Unknown')[:200] if request else 'System',
                request.endpoint if request else 'System',
                0, details, severity
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            print(f"Error logging security event: {e}")
    
    def is_ip_blocked(self, ip_address):
        """Verificar si una IP está bloqueada"""
        if ip_address in self.blocked_ips:
            block_time = self.blocked_ips[ip_address]
            if time.time() - block_time < self.BLOCK_DURATION:
                return True
            else:
                # Remover bloqueo expirado
                del self.blocked_ips[ip_address]
        return False
    
    def register_failed_attempt(self, ip_address, reason):
        """Registrar intento fallido de acceso"""
        current_time = time.time()
        
        # Limpiar intentos antiguos (older than 15 minutes)
        while (self.failed_attempts[ip_address] and 
               current_time - self.failed_attempts[ip_address][0] > 900):
            self.failed_attempts[ip_address].popleft()
        
        # Agregar nuevo intento fallido
        self.failed_attempts[ip_address].append(current_time)
        
        # Verificar si debe ser bloqueada
        if len(self.failed_attempts[ip_address]) >= self.MAX_FAILED_ATTEMPTS:
            self.blocked_ips[ip_address] = current_time
            self.log_security_event(
                'IP_BLOCKED', 
                f'IP blocked due to {len(self.failed_attempts[ip_address])} failed attempts. Reason: {reason}',
                ip_address,
                'WARNING'
            )
            return True
        
        self.log_security_event(
            'FAILED_ATTEMPT',
            f'Failed attempt #{len(self.failed_attempts[ip_address])}: {reason}',
            ip_address,
            'INFO'
        )
        return False
    
    def check_rate_limit(self, ip_address, endpoint):
        """Verificar límite de rate limiting"""
        current_time = time.time()
        key = f"{ip_address}:{endpoint}"
        
        # Limpiar requests antiguos
        while (self.rate_limits[key] and 
               current_time - self.rate_limits[key][0] > self.RATE_LIMIT_WINDOW):
            self.rate_limits[key].popleft()
        
        # Verificar límite
        if len(self.rate_limits[key]) >= self.RATE_LIMIT_MAX:
            self.log_security_event(
                'RATE_LIMIT_EXCEEDED',
                f'Rate limit exceeded: {len(self.rate_limits[key])} requests in {self.RATE_LIMIT_WINDOW}s',
                ip_address,
                'WARNING'
            )
            return False
        
        # Agregar request actual
        self.rate_limits[key].append(current_time)
        return True
    
    def validate_input(self, input_data, input_type="general"):
        """Validación avanzada de inputs"""
        if not input_data:
            return True, "OK"
        
        input_str = str(input_data).lower()
        
        # Verificar patrones maliciosos
        for pattern in self.malicious_patterns:
            if re.search(pattern, input_str, re.IGNORECASE):
                return False, f"Malicious pattern detected: {pattern}"
        
        # Validaciones específicas por tipo
        if input_type == "username":
            if not re.match(r'^[a-zA-Z0-9_\-\.\@\#\:\s]{3,50}$', input_data):
                return False, "Invalid username format"
        
        elif input_type == "password":
            if len(input_data) < 8:
                return False, "Password too short"
        
        elif input_type == "email":
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, input_data):
                return False, "Invalid email format"
        
        return True, "OK"
    
    def validate_headers(self, required_headers=None):
        """Validar headers de seguridad"""
        if required_headers is None:
            required_headers = ['User-Agent', 'Accept']
        
        missing_headers = []
        for header in required_headers:
            if not request.headers.get(header):
                missing_headers.append(header)
        
        if missing_headers:
            return False, f"Missing required headers: {missing_headers}"
        
        # Verificar User-Agent sospechoso (pero permitir navegadores legítimos)
        user_agent = request.headers.get('User-Agent', '').lower()
        
        # Navegadores legítimos permitidos
        legitimate_browsers = ['chrome', 'firefox', 'safari', 'edge', 'opera', 'vscode']
        
        # Solo bloquear si es claramente malicioso Y no es un navegador legítimo
        suspicious_agents = ['sqlmap', 'nikto', 'nmap', 'burp', 'metasploit']
        
        is_legitimate = any(browser in user_agent for browser in legitimate_browsers)
        is_suspicious = any(suspicious in user_agent for suspicious in suspicious_agents)
        
        if is_suspicious and not is_legitimate:
            return False, f"Suspicious User-Agent: {user_agent}"
        
        return True, "OK"
    
    def get_client_ip(self):
        """Obtener IP real del cliente"""
        # Verificar headers de proxy
        if request.headers.get('X-Forwarded-For'):
            ip = request.headers.get('X-Forwarded-For').split(',')[0].strip()
        elif request.headers.get('X-Real-IP'):
            ip = request.headers.get('X-Real-IP')
        else:
            ip = request.remote_addr
        
        # Validar formato de IP
        try:
            ipaddress.ip_address(ip)
            return ip
        except ValueError:
            return request.remote_addr

# Instancia global del sistema de seguridad
security_enforcer = SecurityEnforcer()

def security_required(endpoint_name=None):
    """Decorador para endpoints que requieren seguridad reforzada"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            ip_address = security_enforcer.get_client_ip()
            endpoint = endpoint_name or request.endpoint
            
            # 1. Verificar IP bloqueada
            if security_enforcer.is_ip_blocked(ip_address):
                security_enforcer.log_security_event(
                    'BLOCKED_ACCESS_ATTEMPT',
                    f'Blocked IP tried to access {endpoint}',
                    ip_address,
                    'ERROR'
                )
                abort(403, description="Access denied - IP blocked")
            
            # 2. Verificar rate limiting
            if not security_enforcer.check_rate_limit(ip_address, endpoint):
                security_enforcer.register_failed_attempt(ip_address, "Rate limit exceeded")
                abort(429, description="Too many requests")
            
            # 3. Validar headers
            valid_headers, header_msg = security_enforcer.validate_headers()
            if not valid_headers:
                security_enforcer.register_failed_attempt(ip_address, f"Invalid headers: {header_msg}")
                abort(400, description="Bad request - Invalid headers")
            
            # 4. Validar datos POST/PUT si existen
            if request.method in ['POST', 'PUT'] and request.get_json():
                data = request.get_json()
                for key, value in data.items():
                    valid_input, input_msg = security_enforcer.validate_input(value, key)
                    if not valid_input:
                        security_enforcer.register_failed_attempt(
                            ip_address, 
                            f"Malicious input in {key}: {input_msg}"
                        )
                        abort(400, description="Bad request - Invalid input detected")
            
            # 5. Log acceso legítimo
            security_enforcer.log_security_event(
                'LEGITIMATE_ACCESS',
                f'Valid access to {endpoint}',
                ip_address,
                'INFO'
            )
            
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def csrf_protection():
    """Protección CSRF básica"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if request.method == 'POST':
                # Verificar token CSRF en headers o datos
                csrf_token = (request.headers.get('X-CSRF-Token') or 
                             request.get_json().get('csrf_token') if request.get_json() else None)
                
                expected_token = session.get('csrf_token')
                
                if not csrf_token or csrf_token != expected_token:
                    ip_address = security_enforcer.get_client_ip()
                    security_enforcer.register_failed_attempt(ip_address, "Invalid CSRF token")
                    abort(403, description="CSRF token validation failed")
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def generate_csrf_token():
    """Generar token CSRF"""
    if 'csrf_token' not in session:
        session['csrf_token'] = secrets.token_hex(16)
    return session['csrf_token']

def secure_password_validation(password):
    """Validación ultra-segura de contraseñas"""
    if len(password) < 12:
        return False, "Contraseña debe tener al menos 12 caracteres"
    
    if not re.search(r'[A-Z]', password):
        return False, "Debe contener al menos una mayúscula"
    
    if not re.search(r'[a-z]', password):
        return False, "Debe contener al menos una minúscula"
    
    if not re.search(r'[0-9]', password):
        return False, "Debe contener al menos un número"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Debe contener al menos un carácter especial"
    
    # Verificar que no sea una contraseña común
    common_passwords = [
        'password', '123456', 'admin', 'qwerty', 'letmein',
        'password123', 'admin123', '123456789'
    ]
    
    if password.lower() in common_passwords:
        return False, "Contraseña demasiado común"
    
    return True, "Contraseña segura"

def secure_session_management():
    """Gestión ultra-segura de sesiones"""
    # Regenerar ID de sesión periódicamente
    session.permanent = True
    
    # Verificar integridad de sesión
    if 'session_hash' in session:
        expected_hash = hashlib.sha256(
            f"{session.get('user_id', '')}:{session.get('created_at', '')}".encode()
        ).hexdigest()
        
        if session['session_hash'] != expected_hash:
            session.clear()
            abort(401, description="Session integrity violation")
    
    # Agregar timestamp de última actividad
    session['last_activity'] = datetime.now().isoformat()

if __name__ == "__main__":
    print("🛡️ SISTEMA DE SEGURIDAD REFORZADO INICIALIZADO")
    print("✅ Rate Limiting activado")
    print("✅ Validación de inputs activada") 
    print("✅ Protección anti-ataques activada")
    print("✅ Logging de seguridad configurado")
    print("✅ Sistema listo para proteger el servidor")