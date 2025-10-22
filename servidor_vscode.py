#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🚀 SERVIDOR SIMPLIFICADO PARA VS CODE - DataCrypt Labs
Versión optimizada para VS Code Simple Browser
"""

from flask import Flask, request, render_template_string, jsonify, redirect, url_for, session
import sqlite3
import hashlib
import os
from datetime import datetime

class ServidorVSCode:
    """Servidor optimizado para VS Code Simple Browser"""
    
    def __init__(self):
        self.app = Flask(__name__)
        self.app.secret_key = 'datacrypt-vscode-key-2025'
        
        # Configuración relajada para VS Code
        self.app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
        
        self.setup_routes()
    
    def setup_routes(self):
        """Configurar rutas optimizadas"""
        
        @self.app.before_request
        def before_request():
            """Validación mínima para VS Code"""
            # Solo validar lo esencial
            pass
        
        @self.app.after_request
        def after_request(response):
            """Headers optimizados para VS Code"""
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
            return response
        
        @self.app.route('/admin', methods=['GET'])
        def admin_login():
            """Página de login optimizada"""
            return render_template_string('''
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DataCrypt Labs - Admin (VS Code)</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; padding: 20px; min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
        }
        .container {
            background: white; padding: 40px; border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1); max-width: 400px; width: 100%;
        }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo h1 { color: #667eea; margin: 0; font-size: 28px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
        input[type="text"], input[type="password"] {
            width: 100%; padding: 12px; border: 2px solid #ddd;
            border-radius: 5px; font-size: 16px; box-sizing: border-box;
        }
        input[type="text"]:focus, input[type="password"]:focus {
            outline: none; border-color: #667eea;
        }
        .btn { 
            width: 100%; padding: 12px; background: #667eea; color: white;
            border: none; border-radius: 5px; font-size: 16px; cursor: pointer;
            margin-bottom: 10px; transition: background 0.3s;
        }
        .btn:hover { background: #5a6fd8; }
        .btn-secondary { background: #6c757d; }
        .btn-secondary:hover { background: #5a6268; }
        .password-toggle { position: relative; }
        .toggle-btn {
            position: absolute; right: 10px; top: 50%;
            transform: translateY(-50%); background: none; border: none;
            cursor: pointer; color: #667eea; font-size: 14px;
        }
        .status { margin-top: 15px; padding: 10px; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>🔐 DataCrypt Labs</h1>
            <p style="color: #666; margin: 0;">Panel Administrativo (VS Code)</p>
        </div>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="username">👤 Usuario:</label>
                <input type="text" id="username" name="username" value="Neyd696 :#" required>
            </div>
            
            <div class="form-group">
                <label for="password">🔑 Contraseña:</label>
                <div class="password-toggle">
                    <input type="password" id="password" name="password" required>
                    <button type="button" class="toggle-btn" onclick="togglePassword()">👁️</button>
                </div>
            </div>
            
            <button type="button" class="btn btn-secondary" onclick="fillCredentials()">
                🔄 Llenar Credenciales
            </button>
            
            <button type="submit" class="btn">
                🚀 Iniciar Sesión
            </button>
        </form>
        
        <div id="status"></div>
        
        <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>✅ Optimizado para VS Code Simple Browser</p>
            <p>🕒 {{ timestamp }}</p>
        </div>
    </div>
    
    <script>
        function fillCredentials() {
            document.getElementById('username').value = 'Neyd696 :#';
            document.getElementById('password').value = 'Simelamamscoscorrea123###_@';
            showStatus('✅ Credenciales llenadas correctamente', 'success');
        }
        
        function togglePassword() {
            const passwordField = document.getElementById('password');
            const toggleBtn = document.querySelector('.toggle-btn');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                passwordField.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        }
        
        function showStatus(message, type) {
            const statusDiv = document.getElementById('status');
            statusDiv.innerHTML = message;
            statusDiv.className = 'status ' + type;
        }
        
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            showStatus('🔄 Verificando credenciales...', 'info');
            
            fetch('/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showStatus('✅ ¡Login exitoso! Redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = '/admin/dashboard';
                    }, 1000);
                } else {
                    showStatus('❌ ' + data.message, 'error');
                }
            })
            .catch(error => {
                showStatus('❌ Error de conexión: ' + error.message, 'error');
            });
        });
        
        // Auto-llenar credenciales al cargar
        setTimeout(fillCredentials, 500);
    </script>
</body>
</html>
            ''', timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        
        @self.app.route('/admin/login', methods=['POST'])
        def admin_login_post():
            """Procesar login"""
            try:
                data = request.get_json()
                username = data.get('username')
                password = data.get('password')
                
                # Verificar credenciales en base de datos
                if self.verify_credentials(username, password):
                    session['user'] = username
                    session['authenticated'] = True
                    return jsonify({
                        'success': True,
                        'message': 'Login exitoso',
                        'redirect': '/admin/dashboard'
                    })
                else:
                    return jsonify({
                        'success': False,
                        'message': 'Credenciales inválidas'
                    })
                    
            except Exception as e:
                return jsonify({
                    'success': False,
                    'message': f'Error del servidor: {str(e)}'
                })
        
        @self.app.route('/admin/dashboard')
        def admin_dashboard():
            """Dashboard administrativo"""
            if not session.get('authenticated'):
                return redirect(url_for('admin_login'))
            
            return render_template_string('''
<!DOCTYPE html>
<html>
<head>
    <title>DataCrypt Labs - Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #667eea; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .welcome { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .btn { padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 ¡Bienvenido al Panel Administrativo!</h1>
        <p>Usuario: {{ session.user }} | Acceso: {{ timestamp }}</p>
    </div>
    
    <div class="welcome">
        <h2>✅ ¡Sistema Funcionando Perfectamente!</h2>
        <p>🚀 Has accedido exitosamente al sistema administrativo DataCrypt Labs</p>
        <p>🛡️ Todas las validaciones de seguridad pasaron correctamente</p>
        <p>🔐 Tu sesión está autenticada y segura</p>
        
        <div style="margin-top: 20px;">
            <a href="/admin/users" class="btn">👥 Gestión de Usuarios</a>
            <a href="/admin/security" class="btn">🛡️ Configuración de Seguridad</a>
            <a href="/admin/logs" class="btn">📊 Logs del Sistema</a>
            <a href="/admin/logout" class="btn" style="background: #dc3545;">🚪 Cerrar Sesión</a>
        </div>
    </div>
</body>
</html>
            ''', timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    def verify_credentials(self, username, password):
        """Verificar credenciales en base de datos"""
        try:
            conn = sqlite3.connect('datacrypt_admin.db')
            cursor = conn.cursor()
            
            cursor.execute("SELECT password_hash FROM admin_users WHERE username = ? AND is_active = 1", (username,))
            result = cursor.fetchone()
            
            if result:
                stored_hash = result[0]
                if isinstance(stored_hash, str):
                    stored_hash = stored_hash.encode('latin-1')
                
                # Verificar hash PBKDF2
                salt = stored_hash[:32]
                stored_key = stored_hash[32:]
                test_key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 150000)
                
                conn.close()
                return test_key == stored_key
            
            conn.close()
            return False
            
        except Exception as e:
            print(f"Error verificando credenciales: {e}")
            return False
    
    def run(self, host='127.0.0.1', port=5001, debug=False):
        """Ejecutar servidor"""
        print("🚀 SERVIDOR VS CODE OPTIMIZADO")
        print("=" * 40)
        print(f"🌐 URL: http://{host}:{port}/admin")
        print("✅ Optimizado para VS Code Simple Browser")
        print("🔐 Credenciales: Neyd696 :# / Simelamamscoscorrea123###_@")
        print("=" * 40)
        
        self.app.run(host=host, port=port, debug=debug)

if __name__ == "__main__":
    servidor = ServidorVSCode()
    servidor.run()