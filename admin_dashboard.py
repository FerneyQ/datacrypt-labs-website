"""
DataCrypt Labs - Dashboard Administrativo Web
Sistema completo de administración con autenticación
Filosofía de Mejora Continua - PDCA
"""

from flask import Flask, request, jsonify, render_template_string, session, redirect, url_for
from flask_cors import CORS
import json
import os
import hashlib
from datetime import datetime
import sqlite3
from admin_auth_system import DataCryptAuthSystem
from pathlib import Path
import logging

# 🛡️ SISTEMA DE SEGURIDAD REFORZADO
from security_enforcer import (
    security_required, csrf_protection, generate_csrf_token,
    secure_password_validation, secure_session_management, security_enforcer
)

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'DataCrypt_Secure_Key_2025!'
CORS(app, origins=['http://localhost:5000', 'http://127.0.0.1:5000'])

# Inicializar sistema de autenticación
auth_system = DataCryptAuthSystem()

# Template HTML del Dashboard
DASHBOARD_TEMPLATE = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DataCrypt Labs - Panel Administrativo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-height: 100vh;
        }
        .dashboard-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            margin: 20px;
            padding: 30px;
        }
        .metric-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px;
            padding: 25px;
            margin: 10px 0;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            transition: transform 0.3s ease;
        }
        .metric-card:hover {
            transform: translateY(-5px);
        }
        .metric-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin: 10px 0;
        }
        .navbar-custom {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .nav-link {
            color: white !important;
            font-weight: 500;
        }
        .btn-logout {
            background: linear-gradient(45deg, #ff6b6b, #ee5a52);
            border: none;
            color: white;
            font-weight: 500;
        }
        .chart-container {
            background: white;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .table-custom {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .alert-custom {
            border-radius: 15px;
            border: none;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom">
        <div class="container-fluid">
            <a class="navbar-brand text-white fw-bold" href="#">
                <i class="fas fa-shield-alt me-2"></i>
                DataCrypt Labs Admin
            </a>
            <div class="navbar-nav ms-auto">
                <span class="nav-link">
                    <i class="fas fa-user me-2"></i>
                    Bienvenido, {{ username }}
                </span>
                <button class="btn btn-logout btn-sm ms-2" onclick="logout()">
                    <i class="fas fa-sign-out-alt me-2"></i>Salir
                </button>
            </div>
        </div>
    </nav>

    <div class="container-fluid">
        <div class="dashboard-container">
            <!-- Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="display-6 fw-bold text-center mb-1">
                        <i class="fas fa-chart-line me-3"></i>Panel de Control Administrativo
                    </h1>
                    <p class="text-center text-muted">Filosofía de Mejora Continua - PDCA</p>
                    <p class="text-center">
                        <span class="badge bg-success">ACTIVO</span>
                        <span class="text-muted ms-2">Última actualización: {{ current_time }}</span>
                    </p>
                </div>
            </div>

            <!-- Métricas principales -->
            <div class="row">
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-0">Visitantes Hoy</h6>
                                <div class="metric-value" id="visitantes-hoy">{{ metrics.visitantes_hoy or 0 }}</div>
                                <small><i class="fas fa-arrow-up me-1"></i>+12% vs ayer</small>
                            </div>
                            <i class="fas fa-users fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-0">Proyectos Activos</h6>
                                <div class="metric-value" id="proyectos-activos">{{ metrics.proyectos_activos or 0 }}</div>
                                <small><i class="fas fa-arrow-up me-1"></i>+3 nuevos</small>
                            </div>
                            <i class="fas fa-project-diagram fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-0">Sesiones Activas</h6>
                                <div class="metric-value" id="sesiones-activas">{{ metrics.sesiones_activas or 0 }}</div>
                                <small><i class="fas fa-circle text-success me-1"></i>En línea</small>
                            </div>
                            <i class="fas fa-wifi fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-0">Rendimiento</h6>
                                <div class="metric-value" id="rendimiento">{{ metrics.rendimiento or 0 }}%</div>
                                <small><i class="fas fa-tachometer-alt me-1"></i>Óptimo</small>
                            </div>
                            <i class="fas fa-chart-bar fa-2x opacity-75"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="row">
                <div class="col-md-6">
                    <div class="chart-container">
                        <h5><i class="fas fa-chart-line me-2"></i>Tráfico Web - Últimos 7 días</h5>
                        <canvas id="trafficChart" width="400" height="200"></canvas>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="chart-container">
                        <h5><i class="fas fa-chart-pie me-2"></i>Fuentes de Tráfico</h5>
                        <canvas id="sourceChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>

            <!-- Alertas y Notificaciones -->
            <div class="row">
                <div class="col-12">
                    <h5><i class="fas fa-bell me-2"></i>Alertas del Sistema</h5>
                    {% if alerts %}
                        {% for alert in alerts %}
                        <div class="alert alert-{{ alert.type }} alert-custom mb-2">
                            <i class="fas fa-{{ alert.icon }} me-2"></i>
                            <strong>{{ alert.title }}</strong> - {{ alert.message }}
                            <small class="float-end">{{ alert.timestamp }}</small>
                        </div>
                        {% endfor %}
                    {% else %}
                        <div class="alert alert-success alert-custom">
                            <i class="fas fa-check-circle me-2"></i>
                            <strong>Sistema Estable</strong> - No hay alertas activas
                        </div>
                    {% endif %}
                </div>
            </div>

            <!-- Tabla de Actividad Reciente -->
            <div class="row">
                <div class="col-12">
                    <h5><i class="fas fa-history me-2"></i>Actividad Reciente</h5>
                    <div class="table-custom">
                        <table class="table table-hover mb-0">
                            <thead class="table-dark">
                                <tr>
                                    <th>Hora</th>
                                    <th>Usuario</th>
                                    <th>Acción</th>
                                    <th>IP</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {% if recent_activity %}
                                    {% for activity in recent_activity %}
                                    <tr>
                                        <td>{{ activity.timestamp }}</td>
                                        <td>{{ activity.user }}</td>
                                        <td>{{ activity.action }}</td>
                                        <td>{{ activity.ip }}</td>
                                        <td>
                                            <span class="badge bg-{{ 'success' if activity.success else 'danger' }}">
                                                {{ 'Éxito' if activity.success else 'Fallo' }}
                                            </span>
                                        </td>
                                    </tr>
                                    {% endfor %}
                                {% else %}
                                    <tr>
                                        <td colspan="5" class="text-center text-muted">No hay actividad reciente</td>
                                    </tr>
                                {% endif %}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Configurar gráficos
        const trafficCtx = document.getElementById('trafficChart').getContext('2d');
        new Chart(trafficCtx, {
            type: 'line',
            data: {
                labels: {{ traffic_labels | safe }},
                datasets: [{
                    label: 'Visitantes',
                    data: {{ traffic_data | safe }},
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });

        const sourceCtx = document.getElementById('sourceChart').getContext('2d');
        new Chart(sourceCtx, {
            type: 'doughnut',
            data: {
                labels: {{ source_labels | safe }},
                datasets: [{
                    data: {{ source_data | safe }},
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });

        // Función de logout
        function logout() {
            if (confirm('¿Está seguro de cerrar sesión?')) {
                fetch('/admin/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
                    }
                })
                .then(() => {
                    localStorage.removeItem('admin_token');
                    window.location.href = '/admin/login';
                })
                .catch(error => {
                    console.error('Error:', error);
                    localStorage.removeItem('admin_token');
                    window.location.href = '/admin/login';
                });
            }
        }

        // Auto-actualizar métricas cada 30 segundos
        setInterval(() => {
            fetch('/admin/api/metrics', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('visitantes-hoy').textContent = data.metrics.visitantes_hoy || 0;
                    document.getElementById('proyectos-activos').textContent = data.metrics.proyectos_activos || 0;
                    document.getElementById('sesiones-activas').textContent = data.metrics.sesiones_activas || 0;
                    document.getElementById('rendimiento').textContent = (data.metrics.rendimiento || 0) + '%';
                }
            })
            .catch(error => console.error('Error actualizando métricas:', error));
        }, 30000);

        // Verificar autenticación al cargar
        document.addEventListener('DOMContentLoaded', function() {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                window.location.href = '/admin/login';
            }
        });
    </script>
</body>
</html>
"""

# Template de Login
LOGIN_TEMPLATE = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DataCrypt Labs - Login Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
        }
        .login-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            padding: 40px;
            max-width: 400px;
            width: 100%;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo i {
            font-size: 3rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .btn-login {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-weight: 500;
            width: 100%;
            padding: 12px;
            border-radius: 10px;
        }
        .form-control {
            border-radius: 10px;
            border: 2px solid #e9ecef;
            padding: 12px;
        }
        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .input-group-text {
            background: transparent;
            border-right: none;
            border-radius: 10px 0 0 10px;
            border: 2px solid #e9ecef;
            border-right: none;
        }
        .input-group .form-control {
            border-left: none;
            border-radius: 0 10px 10px 0;
        }
        .alert {
            border-radius: 10px;
            border: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="login-container">
                    <div class="logo">
                        <i class="fas fa-shield-alt"></i>
                        <h3 class="fw-bold">DataCrypt Labs</h3>
                        <p class="text-muted mb-0">Panel Administrativo</p>
                    </div>

                    <div id="alert-container"></div>

                    <form id="loginForm">
                        <div class="mb-3">
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="fas fa-user"></i>
                                </span>
                                <input type="text" class="form-control" id="username" placeholder="Usuario" required>
                            </div>
                        </div>

                        <div class="mb-4">
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="fas fa-lock"></i>
                                </span>
                                <input type="password" class="form-control" id="password" placeholder="Contraseña" required>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-login" id="loginBtn">
                            <i class="fas fa-sign-in-alt me-2"></i>
                            Iniciar Sesión
                        </button>
                    </form>

                    <div class="text-center mt-3">
                        <small class="text-muted">
                            Sistema seguro con autenticación JWT
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const alertContainer = document.getElementById('alert-container');
            const loginBtn = document.getElementById('loginBtn');
            
            // Mostrar loading
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Iniciando sesión...';
            loginBtn.disabled = true;
            
            try {
                const response = await fetch('/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('admin_token', data.token);
                    alertContainer.innerHTML = `
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle me-2"></i>
                            Login exitoso. Redirigiendo...
                        </div>
                    `;
                    
                    setTimeout(() => {
                        window.location.href = '/admin/dashboard';
                    }, 1000);
                } else {
                    alertContainer.innerHTML = `
                        <div class="alert alert-danger">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            ${data.message}
                        </div>
                    `;
                }
            } catch (error) {
                alertContainer.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Error de conexión. Intente nuevamente.
                    </div>
                `;
            } finally {
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión';
                loginBtn.disabled = false;
            }
        });

        // Verificar si ya está logueado
        document.addEventListener('DOMContentLoaded', function() {
            const token = localStorage.getItem('admin_token');
            if (token) {
                window.location.href = '/admin/dashboard';
            }
        });
    </script>
</body>
</html>
"""

def get_client_ip():
    """Obtener IP del cliente"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
    else:
        return request.environ.get('REMOTE_ADDR', '127.0.0.1')

def get_user_agent():
    """Obtener User Agent del cliente"""
    return request.headers.get('User-Agent', 'Unknown')

def get_dashboard_data():
    """Obtener datos para el dashboard"""
    try:
        conn = sqlite3.connect('datacrypt_admin.db')
        cursor = conn.cursor()
        
        # Métricas básicas
        cursor.execute("SELECT metric_name, metric_value FROM system_metrics WHERE is_active = 1")
        metrics_data = cursor.fetchall()
        metrics = {metric[0]: metric[1] for metric in metrics_data}
        
        # Sesiones activas
        cursor.execute("""
            SELECT COUNT(*) FROM user_sessions 
            WHERE is_active = 1 AND expires_at > datetime('now')
        """)
        metrics['sesiones_activas'] = cursor.fetchone()[0]
        
        # Alertas activas
        cursor.execute("""
            SELECT alert_type, message, created_at 
            FROM system_alerts 
            WHERE status = 'active' 
            ORDER BY created_at DESC LIMIT 5
        """)
        alerts_data = cursor.fetchall()
        alerts = []
        for alert in alerts_data:
            alert_type_map = {
                'warning': {'type': 'warning', 'icon': 'exclamation-triangle'},
                'error': {'type': 'danger', 'icon': 'times-circle'},
                'info': {'type': 'info', 'icon': 'info-circle'},
                'success': {'type': 'success', 'icon': 'check-circle'}
            }
            alert_config = alert_type_map.get(alert[0], {'type': 'info', 'icon': 'info-circle'})
            alerts.append({
                'type': alert_config['type'],
                'icon': alert_config['icon'],
                'title': alert[0].title(),
                'message': alert[1],
                'timestamp': alert[2]
            })
        
        # Actividad reciente
        cursor.execute("""
            SELECT a.timestamp, COALESCE(u.username, 'Sistema') as user, a.action, a.ip_address, a.success
            FROM audit_logs a
            LEFT JOIN admin_users u ON a.user_id = u.id
            ORDER BY a.timestamp DESC LIMIT 10
        """)
        activity_data = cursor.fetchall()
        recent_activity = []
        for activity in activity_data:
            recent_activity.append({
                'timestamp': activity[0],
                'user': activity[1],
                'action': activity[2],
                'ip': activity[3],
                'success': bool(activity[4])
            })
        
        conn.close()
        
        return {
            'metrics': metrics,
            'alerts': alerts,
            'recent_activity': recent_activity,
            'traffic_labels': json.dumps(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']),
            'traffic_data': json.dumps([120, 150, 180, 220, 200, 170, 160]),
            'source_labels': json.dumps(['Directo', 'Google', 'Social', 'Referidos']),
            'source_data': json.dumps([45, 30, 15, 10]),
            'current_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo datos del dashboard: {e}")
        return {
            'metrics': {},
            'alerts': [],
            'recent_activity': [],
            'traffic_labels': json.dumps([]),
            'traffic_data': json.dumps([]),
            'source_labels': json.dumps([]),
            'source_data': json.dumps([]),
            'current_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

@app.route('/admin')
@app.route('/admin/')
def admin_root():
    """Redirigir a login"""
    return redirect(url_for('admin_login'))

@app.route('/admin/login')
def admin_login():
    """Página de login administrativo"""
    return render_template_string(LOGIN_TEMPLATE)

@app.route('/admin/login', methods=['POST'])
@security_required('admin_login')
@csrf_protection()
def admin_login_post():
    """Procesar login administrativo - SEGURIDAD REFORZADA"""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # 🛡️ VALIDACIÓN ULTRA-SEGURA
        if not username or not password:
            security_enforcer.register_failed_attempt(
                security_enforcer.get_client_ip(),
                "Missing username or password"
            )
            return jsonify({
                'success': False, 
                'message': 'Usuario y contraseña son requeridos'
            }), 400
        
        # Validar formato de entrada
        valid_user, user_msg = security_enforcer.validate_input(username, "username")
        if not valid_user:
            security_enforcer.register_failed_attempt(
                security_enforcer.get_client_ip(),
                f"Invalid username format: {user_msg}"
            )
            return jsonify({
                'success': False,
                'message': 'Formato de usuario inválido'
            }), 400
        
        # Autenticar usuario
        result = auth_system.authenticate_user(
            username=username,
            password=password,
            ip_address=security_enforcer.get_client_ip(),
            user_agent=get_user_agent()
        )
        
        if result['success']:
            # 🛡️ GESTIÓN SEGURA DE SESIONES
            secure_session_management()
            session['user_id'] = result['user_data']['user_id']
            session['created_at'] = datetime.now().isoformat()
            session['session_hash'] = hashlib.sha256(
                f"{session['user_id']}:{session['created_at']}".encode()
            ).hexdigest()
            
            security_enforcer.log_security_event(
                'SUCCESSFUL_LOGIN',
                f"User {username} logged in successfully",
                security_enforcer.get_client_ip(),
                'INFO'
            )
            
            return jsonify(result), 200
        else:
            # Registrar intento fallido
            security_enforcer.register_failed_attempt(
                security_enforcer.get_client_ip(),
                f"Failed login for user: {username}"
            )
            return jsonify(result), 401
            
    except Exception as e:
        logger.error(f"❌ Error en login: {e}")
        security_enforcer.log_security_event(
            'LOGIN_ERROR',
            f"Login system error: {str(e)}",
            security_enforcer.get_client_ip(),
            'ERROR'
        )
        return jsonify({
            'success': False, 
            'message': 'Error interno del servidor'
        }), 500

@app.route('/admin/logout', methods=['POST'])
def admin_logout():
    """Cerrar sesión administrativo"""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'success': False, 'message': 'Token requerido'}), 401
        
        token = auth_header.split(' ')[1]
        
        result = auth_system.logout_user(
            token=token,
            ip_address=get_client_ip(),
            user_agent=get_user_agent()
        )
        
        return jsonify(result), 200 if result['success'] else 401
        
    except Exception as e:
        logger.error(f"❌ Error en logout: {e}")
        return jsonify({'success': False, 'message': 'Error interno'}), 500

@app.route('/admin/dashboard')
@security_required('admin_dashboard')
def admin_dashboard():
    """Dashboard administrativo principal - ULTRA SEGURO"""
    try:
        # 🛡️ VALIDACIÓN MULTI-CAPA DE AUTENTICACIÓN
        auth_header = request.headers.get('Authorization')
        session_valid = False
        
        # Verificar sesión de usuario
        if 'user_id' in session and 'session_hash' in session:
            expected_hash = hashlib.sha256(
                f"{session.get('user_id')}:{session.get('created_at')}".encode()
            ).hexdigest()
            
            if session['session_hash'] == expected_hash:
                session_valid = True
        
        # Verificar token JWT si está presente
        token_valid = False
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            # Validar token con el sistema de autenticación
            validation = auth_system.validate_session_token(token, session.get('session_id', ''))
            if validation.get('valid'):
                token_valid = True
        
        # Permitir acceso solo si hay sesión válida O token válido
        if not (session_valid or token_valid):
            security_enforcer.register_failed_attempt(
                security_enforcer.get_client_ip(),
                "Unauthorized dashboard access attempt"
            )
            return redirect(url_for('admin_login'))
        
        # 🛡️ GESTIÓN SEGURA DE SESIONES
        secure_session_management()
        
        # Obtener datos del dashboard
        dashboard_data = get_dashboard_data()
        dashboard_data['username'] = session.get('username', 'Admin')
        dashboard_data['csrf_token'] = generate_csrf_token()
        
        # Log acceso autorizado
        security_enforcer.log_security_event(
            'DASHBOARD_ACCESS',
            f"Authorized access to dashboard by user {session.get('user_id', 'unknown')}",
            security_enforcer.get_client_ip(),
            'INFO'
        )
        
        return render_template_string(DASHBOARD_TEMPLATE, **dashboard_data)
        
    except Exception as e:
        logger.error(f"❌ Error en dashboard: {e}")
        security_enforcer.log_security_event(
            'DASHBOARD_ERROR',
            f"Dashboard error: {str(e)}",
            security_enforcer.get_client_ip(),
            'ERROR'
        )
        return redirect(url_for('admin_login'))

@app.route('/admin/api/metrics')
@security_required('api_metrics')
def api_metrics():
    """API para obtener métricas actualizadas - ULTRA SEGURO"""
    try:
        # 🛡️ VALIDACIÓN RIGUROSA DE AUTENTICACIÓN
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            security_enforcer.register_failed_attempt(
                security_enforcer.get_client_ip(),
                "API access without valid token"
            )
            return jsonify({'success': False, 'message': 'Token requerido'}), 401
        
        token = auth_header.split(' ')[1]
        
        # Validar token
        validation = auth_system.validate_session_token(token, get_client_ip())
        if not validation['valid']:
            return jsonify({'success': False, 'message': validation['message']}), 401
        
        # Obtener métricas actualizadas
        dashboard_data = get_dashboard_data()
        
        return jsonify({
            'success': True,
            'metrics': dashboard_data['metrics']
        })
        
    except Exception as e:
        logger.error(f"❌ Error en API métricas: {e}")
        return jsonify({'success': False, 'message': 'Error interno'}), 500

@app.route('/admin/api/validate-token', methods=['POST'])
def api_validate_token():
    """Validar token de autenticación"""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'valid': False, 'message': 'Token requerido'}), 401
        
        token = auth_header.split(' ')[1]
        validation = auth_system.validate_session_token(token, get_client_ip())
        
        if validation['valid']:
            return jsonify({
                'valid': True,
                'user': {
                    'id': validation['user_id'],
                    'username': validation['username'],
                    'role': validation['role']
                }
            })
        else:
            return jsonify({'valid': False, 'message': validation['message']}), 401
            
    except Exception as e:
        logger.error(f"❌ Error validando token: {e}")
        return jsonify({'valid': False, 'message': 'Error interno'}), 500

@app.route('/health')
def health_check():
    """Endpoint de salud del sistema"""
    return jsonify({
        'status': 'healthy',
        'service': 'DataCrypt Labs Admin Dashboard',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    print("🚀 DATACRYPT LABS - DASHBOARD ADMINISTRATIVO")
    print("=" * 60)
    print("🔗 URL: http://localhost:5000/admin")
    print("👤 Usuario: admin")
    print("🔑 Contraseña: DataCrypt2025!")
    print("📊 Dashboard: http://localhost:5000/admin/dashboard")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)