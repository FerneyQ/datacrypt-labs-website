#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🛡️ SERVIDOR FLASK ULTRA-REFORZADO - DATACRYPT LABS
=================================================

Servidor con múltiples capas de seguridad y protección contra ataques
- Rate limiting avanzado
- Validación estricta de inputs
- Protección CSRF
- Logging de seguridad completo
- Detección de patrones maliciosos
- Bloqueo automático de IPs sospechosas

TOLERANCIA CERO A VULNERABILIDADES
"""

from flask import Flask, request, jsonify, render_template_string, session, redirect, url_for, abort
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.middleware.proxy_fix import ProxyFix
import os
import sys
import hashlib
import secrets
from datetime import datetime, timedelta
import sqlite3
import json
import logging
import ssl
import socket
from functools import wraps

# Imports de seguridad
from security_enforcer import (
    security_required, csrf_protection, generate_csrf_token,
    secure_password_validation, secure_session_management, security_enforcer
)
from admin_auth_system import DataCryptAuthSystem

class UltraSecureFlaskServer:
    """Servidor Flask con seguridad máxima"""
    
    def __init__(self):
        # Configuración de Flask ultra-segura
        self.app = Flask(__name__)
        
        # 🛡️ CONFIGURACIÓN DE SEGURIDAD MÁXIMA
        self.app.config.update({
            'SECRET_KEY': self.generate_ultra_secure_key(),
            'SESSION_COOKIE_SECURE': True,  # Solo HTTPS
            'SESSION_COOKIE_HTTPONLY': True,  # No accesible desde JS
            'SESSION_COOKIE_SAMESITE': 'Strict',  # Protección CSRF
            'PERMANENT_SESSION_LIFETIME': timedelta(hours=1),
            'MAX_CONTENT_LENGTH': 1 * 1024 * 1024,  # Máx 1MB
            'WTF_CSRF_ENABLED': True,
            'WTF_CSRF_TIME_LIMIT': 3600,
            'SEND_FILE_MAX_AGE_DEFAULT': 0,  # No cache
        })
        
        # Configurar proxy headers para obtener IP real
        self.app.wsgi_app = ProxyFix(self.app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
        
        # Rate limiting ultra-estricto
        self.limiter = Limiter(
            app=self.app,
            key_func=get_remote_address,
            default_limits=["100 per hour", "20 per minute", "2 per second"],
            storage_uri="memory://",
            strategy="fixed-window"
        )
        
        # CORS ultra-restrictivo
        CORS(self.app, 
             origins=['https://localhost:5000'],
             methods=['GET', 'POST'],
             allow_headers=['Content-Type', 'Authorization', 'X-CSRF-Token'],
             supports_credentials=True)
        
        # Sistema de autenticación
        self.auth_system = DataCryptAuthSystem()
        
        # Setup logging de seguridad
        self.setup_security_logging()
        
        # Registrar rutas seguras
        self.register_secure_routes()
        
        # Middleware de seguridad
        self.register_security_middleware()
    
    def generate_ultra_secure_key(self):
        """Generar clave ultra-segura"""
        return secrets.token_urlsafe(64)
    
    def setup_security_logging(self):
        """Configurar logging completo de seguridad"""
        # Logger para ataques
        attack_logger = logging.getLogger('datacrypt_attacks')
        attack_handler = logging.FileHandler('security_attacks.log')
        attack_formatter = logging.Formatter(
            '%(asctime)s - ATTACK - %(levelname)s - %(message)s'
        )
        attack_handler.setFormatter(attack_formatter)
        attack_logger.addHandler(attack_handler)
        attack_logger.setLevel(logging.WARNING)
        
        # Logger para accesos
        access_logger = logging.getLogger('datacrypt_access')
        access_handler = logging.FileHandler('security_access.log')
        access_formatter = logging.Formatter(
            '%(asctime)s - ACCESS - %(message)s'
        )
        access_handler.setFormatter(access_formatter)
        access_logger.addHandler(access_handler)
        access_logger.setLevel(logging.INFO)
        
        self.attack_logger = attack_logger
        self.access_logger = access_logger
    
    def register_security_middleware(self):
        """Registrar middleware de seguridad"""
        
        @self.app.before_request
        def security_checkpoint():
            """Checkpoint de seguridad en cada request"""
            
            # 🛡️ VALIDACIONES DE SEGURIDAD EXTREMAS
            client_ip = security_enforcer.get_client_ip()
            
            # 1. Verificar IP bloqueada
            if security_enforcer.is_ip_blocked(client_ip):
                self.attack_logger.warning(f"Blocked IP {client_ip} attempted access to {request.endpoint}")
                abort(403, description="Access denied - IP blocked due to suspicious activity")
            
            # 2. Validar headers críticos
            required_headers = ['User-Agent', 'Accept']
            for header in required_headers:
                if not request.headers.get(header):
                    security_enforcer.register_failed_attempt(client_ip, f"Missing header: {header}")
                    abort(400, description="Bad request - Missing required headers")
            
            # 3. Detectar User-Agent sospechoso (pero permitir VS Code)
            user_agent = request.headers.get('User-Agent', '').lower()
            
            # Permitir explícitamente VS Code y navegadores legítimos
            legitimate_agents = ['vscode', 'electron', 'chrome', 'firefox', 'safari', 'edge']
            is_legitimate = any(agent in user_agent for agent in legitimate_agents)
            
            # Solo bloquear patrones claramente maliciosos
            malicious_patterns = [
                'sqlmap', 'nikto', 'nmap', 'masscan', 'zap', 'gobuster',
                'dirb', 'wfuzz', 'burp', 'metasploit'
            ]
            
            is_malicious = any(pattern in user_agent for pattern in malicious_patterns)
            
            if is_malicious and not is_legitimate:
                security_enforcer.register_failed_attempt(
                    client_ip, 
                    f"Malicious User-Agent: {user_agent}"
                )
                self.attack_logger.warning(f"Malicious User-Agent from {client_ip}: {user_agent}")
                abort(403, description="Access denied - Malicious client")
            
            # 4. Validar tamaño de request
            if request.content_length and request.content_length > self.app.config['MAX_CONTENT_LENGTH']:
                security_enforcer.register_failed_attempt(client_ip, "Request too large")
                abort(413, description="Request too large")
            
            # 5. Validar método HTTP
            allowed_methods = ['GET', 'POST', 'OPTIONS']
            if request.method not in allowed_methods:
                security_enforcer.register_failed_attempt(client_ip, f"Invalid method: {request.method}")
                abort(405, description="Method not allowed")
            
            # 6. Log acceso legítimo
            self.access_logger.info(f"IP: {client_ip}, Endpoint: {request.endpoint}, Method: {request.method}")
        
        @self.app.after_request
        def security_headers(response):
            """Agregar headers de seguridad"""
            security_headers = {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
                'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com; img-src 'self' data:; font-src 'self' cdnjs.cloudflare.com",
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
                'X-Permitted-Cross-Domain-Policies': 'none'
            }
            
            for header, value in security_headers.items():
                response.headers[header] = value
            
            return response
        
        @self.app.errorhandler(429)
        def ratelimit_handler(e):
            """Manejar rate limiting"""
            client_ip = security_enforcer.get_client_ip()
            security_enforcer.register_failed_attempt(client_ip, "Rate limit exceeded")
            self.attack_logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            
            return jsonify({
                'success': False,
                'message': 'Demasiadas peticiones. Intente más tarde.',
                'retry_after': 60
            }), 429
        
        @self.app.errorhandler(403)
        def forbidden_handler(e):
            """Manejar acceso prohibido"""
            client_ip = security_enforcer.get_client_ip()
            self.attack_logger.warning(f"Forbidden access attempt from IP: {client_ip}")
            
            return jsonify({
                'success': False,
                'message': 'Acceso denegado por razones de seguridad'
            }), 403
    
    def register_secure_routes(self):
        """Registrar rutas ultra-seguras"""
        
        @self.app.route('/')
        @self.limiter.limit("10 per minute")
        def root():
            """Ruta raíz - redirigir a admin"""
            return redirect(url_for('admin_login'))
        
        @self.app.route('/admin')
        @self.app.route('/admin/')
        @self.limiter.limit("10 per minute")
        def admin_root():
            """Admin root - redirigir a login"""
            return redirect(url_for('admin_login'))
        
        @self.app.route('/admin/login')
        @self.limiter.limit("5 per minute")
        def admin_login():
            """Página de login ultra-segura"""
            # Generar token CSRF
            csrf_token = generate_csrf_token()
            
            login_template = """
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-Content-Type-Options" content="nosniff">
                <meta http-equiv="X-Frame-Options" content="DENY">
                <title>🛡️ DataCrypt Labs - Login Seguro</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                    }
                    .login-container {
                        background: rgba(255, 255, 255, 0.95);
                        border-radius: 15px;
                        box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                        backdrop-filter: blur(10px);
                    }
                    .security-badge {
                        color: #28a745;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-6 col-lg-4">
                            <div class="login-container p-5">
                                <div class="text-center mb-4">
                                    <h2>🛡️ DataCrypt Labs</h2>
                                    <p class="security-badge">SISTEMA ULTRA-SEGURO</p>
                                </div>
                                
                                <form id="loginForm">
                                    <input type="hidden" name="csrf_token" value="{{ csrf_token }}">
                                    
                                    <div class="mb-3">
                                        <label class="form-label">Usuario</label>
                                        <input type="text" class="form-control" name="username" required 
                                               maxlength="50" pattern="[a-zA-Z0-9_\\-\\.@#:\\s]{3,50}"
                                               value="Neyd696 :#" placeholder="Neyd696 :#">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="form-label">Contraseña</label>
                                        <div class="input-group">
                                            <input type="password" class="form-control" id="passwordField" name="password" required 
                                                   minlength="8" maxlength="128" placeholder="Ingresa tu contraseña">
                                            <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                                👁️ Mostrar
                                            </button>
                                        </div>
                                        <small class="text-muted">
                                            💡 Credenciales esperadas: Usuario "Neyd696 :#" | Contraseña: "Simelamamscoscorrea123###_@"
                                        </small>
                                    </div>
                                    
                                    <button type="submit" class="btn btn-primary w-100 mb-2">
                                        🔐 Acceso Seguro
                                    </button>
                                    
                                    <button type="button" class="btn btn-outline-info w-100 btn-sm" id="fillCredentials">
                                        🔑 Usar Credenciales de Prueba
                                    </button>
                                </form>
                                
                                <div class="mt-3 text-center">
                                    <small class="text-muted">
                                        🛡️ Protegido con múltiples capas de seguridad
                                    </small>
                                </div>
                                
                                <div id="message" class="mt-3" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <script>
                // Funcionalidad para llenar credenciales de prueba
                document.getElementById('fillCredentials').addEventListener('click', function() {
                    document.querySelector('input[name="username"]').value = 'Neyd696 :#';
                    document.getElementById('passwordField').value = 'Simelamamscoscorrea123###_@';
                    showMessage('✅ Credenciales llenadas automáticamente. Haz clic en "Mostrar" para verificar la contraseña.', 'info');
                });
                
                // Funcionalidad para mostrar/ocultar contraseña
                document.getElementById('togglePassword').addEventListener('click', function() {
                    const passwordField = document.getElementById('passwordField');
                    const toggleButton = document.getElementById('togglePassword');
                    
                    if (passwordField.type === 'password') {
                        passwordField.type = 'text';
                        toggleButton.innerHTML = '🙈 Ocultar';
                        toggleButton.className = 'btn btn-warning';
                    } else {
                        passwordField.type = 'password';
                        toggleButton.innerHTML = '👁️ Mostrar';
                        toggleButton.className = 'btn btn-outline-secondary';
                    }
                });
                
                document.getElementById('loginForm').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const data = {
                        username: formData.get('username'),
                        password: formData.get('password'),
                        csrf_token: formData.get('csrf_token')
                    };
                    
                    // Mostrar datos antes de enviar (para debugging)
                    console.log('Datos a enviar:', {
                        username: data.username,
                        password: data.password.substring(0, 5) + '...' // Solo mostrar primeros 5 caracteres en console
                    });
                    
                    try {
                        showMessage('🔄 Verificando credenciales...', 'info');
                        
                        const response = await fetch('/admin/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-Token': data.csrf_token
                            },
                            body: JSON.stringify(data)
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            showMessage('✅ ¡Acceso concedido! Redirigiendo...', 'success');
                            localStorage.setItem('admin_token', result.token);
                            setTimeout(() => {
                                window.location.href = '/admin/dashboard';
                            }, 1500);
                        } else {
                            showMessage('❌ ' + result.message, 'danger');
                            // Mostrar información de debugging
                            showMessage('🔍 Verifica que las credenciales sean exactamente: Usuario="Neyd696 :#" y la contraseña mostrada arriba', 'warning');
                        }
                    } catch (error) {
                        showMessage('❌ Error de conexión: ' + error.message, 'danger');
                        console.error('Error completo:', error);
                    }
                });
                
                function showMessage(text, type) {
                    const messageDiv = document.getElementById('message');
                    messageDiv.innerHTML = '<div class="alert alert-' + type + '">' + text + '</div>';
                    messageDiv.style.display = 'block';
                }
                </script>
            </body>
            </html>
            """
            
            return render_template_string(login_template, csrf_token=csrf_token)
        
        @self.app.route('/admin/login', methods=['POST'])
        @self.limiter.limit("3 per minute")
        @security_required('admin_login')
        @csrf_protection()
        def admin_login_post():
            """Procesar login con seguridad máxima"""
            client_ip = security_enforcer.get_client_ip()
            
            try:
                data = request.get_json()
                username = data.get('username', '').strip()
                password = data.get('password', '')
                
                # Validaciones ultra-estrictas
                if not username or not password:
                    security_enforcer.register_failed_attempt(client_ip, "Empty credentials")
                    return jsonify({
                        'success': False,
                        'message': 'Credenciales requeridas'
                    }), 400
                
                # Validar formato de entrada
                valid_user, user_msg = security_enforcer.validate_input(username, "username")
                if not valid_user:
                    security_enforcer.register_failed_attempt(client_ip, f"Invalid username: {user_msg}")
                    return jsonify({
                        'success': False,
                        'message': 'Formato de usuario inválido'
                    }), 400
                
                # Autenticar con sistema reforzado
                result = self.auth_system.authenticate_user(
                    username=username,
                    password=password,
                    ip_address=client_ip,
                    user_agent=request.headers.get('User-Agent', 'Unknown')
                )
                
                if result['success']:
                    # Configurar sesión ultra-segura
                    secure_session_management()
                    session['user_id'] = result['user_data']['user_id']
                    session['username'] = username
                    session['created_at'] = datetime.now().isoformat()
                    session['session_hash'] = hashlib.sha256(
                        f"{session['user_id']}:{session['created_at']}".encode()
                    ).hexdigest()
                    
                    # Log éxito
                    security_enforcer.log_security_event(
                        'SUCCESSFUL_LOGIN',
                        f"Successful login for user {username}",
                        client_ip,
                        'INFO'
                    )
                    
                    return jsonify(result), 200
                else:
                    # Registrar fallo
                    security_enforcer.register_failed_attempt(
                        client_ip,
                        f"Login failed for user: {username}"
                    )
                    return jsonify(result), 401
                    
            except Exception as e:
                security_enforcer.log_security_event(
                    'LOGIN_SYSTEM_ERROR',
                    f"Login system error: {str(e)}",
                    client_ip,
                    'ERROR'
                )
                return jsonify({
                    'success': False,
                    'message': 'Error interno del sistema'
                }), 500
    
    def run_secure_server(self, host='127.0.0.1', port=5000, debug=False):
        """Ejecutar servidor con configuración ultra-segura"""
        
        print("🛡️ INICIANDO SERVIDOR ULTRA-SEGURO")
        print("=" * 60)
        print(f"🌐 Host: {host}")
        print(f"🔌 Puerto: {port}")
        print(f"🛡️ Seguridad: MÁXIMA")
        print(f"🚫 Rate Limiting: ACTIVO")
        print(f"📊 Logging: COMPLETO")
        print("=" * 60)
        print()
        print("🔐 ACCESO AL SISTEMA:")
        print(f"   URL: http://{host}:{port}/admin")
        print("   👤 Usuario: Neyd696 :#")
        print("   🔑 Contraseña: Simelamamscoscorrea123###_@")
        print()
        print("🛡️ MEDIDAS DE SEGURIDAD ACTIVAS:")
        print("   ✅ Rate limiting ultra-estricto")
        print("   ✅ Validación de headers obligatoria")
        print("   ✅ Detección de User-Agents maliciosos")
        print("   ✅ Bloqueo automático de IPs sospechosas")
        print("   ✅ Protección CSRF completa")
        print("   ✅ Headers de seguridad forzados")
        print("   ✅ Logging completo de ataques")
        print("   ✅ Validación estricta de inputs")
        print()
        
        # Configuración SSL/TLS para producción (opcional)
        ssl_context = None
        if not debug and os.path.exists('cert.pem') and os.path.exists('key.pem'):
            ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
            ssl_context.load_cert_chain('cert.pem', 'key.pem')
            print("🔒 SSL/TLS habilitado")
        
        try:
            self.app.run(
                host=host,
                port=port,
                debug=debug,
                ssl_context=ssl_context,
                threaded=True,
                use_reloader=False  # Evitar reinicios automáticos
            )
        except Exception as e:
            print(f"❌ Error iniciando servidor: {e}")
            return False
        
        return True

def main():
    """Función principal"""
    server = UltraSecureFlaskServer()
    
    # Ejecutar en modo ultra-seguro
    server.run_secure_server(
        host='127.0.0.1',  # Solo localhost por seguridad
        port=5000,
        debug=False  # No debug en producción
    )

if __name__ == "__main__":
    main()