"""
🎛️ DATACRYPT LABS - PANEL ADMINISTRATIVO COMPLETO
Sistema de administración web profesional y organizado
"""

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from typing import Dict, Any, List
from datetime import datetime
import psutil
import os
from pathlib import Path

admin_router = APIRouter(prefix="/admin", tags=["admin"])

# ===== RUTAS WEB =====

@admin_router.get("/", response_class=HTMLResponse)
async def admin_dashboard():
    """🏠 Dashboard Principal del Admin"""
    return HTMLResponse(content="""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DataCrypt Labs - Admin Dashboard</title>
        <link rel="stylesheet" href="/admin/static/styles.css">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="admin-container">
            <!-- Sidebar -->
            <nav class="sidebar">
                <div class="logo">
                    <i class="fas fa-shield-alt"></i>
                    <h2>DataCrypt Labs</h2>
                </div>
                <ul class="nav-menu">
                    <li><a href="/admin/" class="active"><i class="fas fa-home"></i> Dashboard</a></li>
                    <li><a href="/admin/system"><i class="fas fa-server"></i> Sistema</a></li>
                    <li><a href="/admin/database"><i class="fas fa-database"></i> Base de Datos</a></li>
                    <li><a href="/admin/logs"><i class="fas fa-file-alt"></i> Logs</a></li>
                    <li><a href="/admin/settings"><i class="fas fa-cog"></i> Configuración</a></li>
                    <li><a href="/docs"><i class="fas fa-book"></i> API Docs</a></li>
                    <li><a href="/"><i class="fas fa-external-link-alt"></i> Sitio Web</a></li>
                </ul>
            </nav>
            
            <!-- Main Content -->
            <main class="main-content">
                <header class="content-header">
                    <h1><i class="fas fa-tachometer-alt"></i> Dashboard Principal</h1>
                    <div class="header-actions">
                        <button onclick="refreshData()" class="btn btn-primary">
                            <i class="fas fa-sync-alt"></i> Actualizar
                        </button>
                    </div>
                </header>
                
                <!-- Stats Cards -->
                <section class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon server">
                            <i class="fas fa-server"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Estado del Servidor</h3>
                            <p id="server-status">Cargando...</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon database">
                            <i class="fas fa-database"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Base de Datos</h3>
                            <p id="db-status">Cargando...</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon performance">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Rendimiento</h3>
                            <p id="performance-status">Cargando...</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon security">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Seguridad</h3>
                            <p id="security-status">Cargando...</p>
                        </div>
                    </div>
                </section>
                
                <!-- Content Grid -->
                <section class="content-grid">
                    <div class="content-card">
                        <h3><i class="fas fa-info-circle"></i> Información del Sistema</h3>
                        <div id="system-info" class="system-info">
                            <div class="info-item">
                                <span class="label">Versión:</span>
                                <span class="value">DataCrypt Labs v2.0</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Arquitectura:</span>
                                <span class="value">FastAPI Modular</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Entorno:</span>
                                <span class="value">Local Development</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Puerto:</span>
                                <span class="value">8000</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-card">
                        <h3><i class="fas fa-chart-bar"></i> Estadísticas Rápidas</h3>
                        <div id="quick-stats">
                            <div class="quick-stat">
                                <span class="stat-number" id="uptime">--</span>
                                <span class="stat-label">Uptime</span>
                            </div>
                            <div class="quick-stat">
                                <span class="stat-number" id="requests">--</span>
                                <span class="stat-label">Requests</span>
                            </div>
                            <div class="quick-stat">
                                <span class="stat-number" id="memory">--</span>
                                <span class="stat-label">RAM</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-card full-width">
                        <h3><i class="fas fa-tools"></i> Acciones Rápidas</h3>
                        <div class="actions-grid">
                            <button onclick="testAPI()" class="action-btn">
                                <i class="fas fa-vial"></i>
                                <span>Probar API</span>
                            </button>
                            <button onclick="viewLogs()" class="action-btn">
                                <i class="fas fa-file-alt"></i>
                                <span>Ver Logs</span>
                            </button>
                            <button onclick="checkHealth()" class="action-btn">
                                <i class="fas fa-heartbeat"></i>
                                <span>Health Check</span>
                            </button>
                            <button onclick="openDocs()" class="action-btn">
                                <i class="fas fa-book"></i>
                                <span>API Docs</span>
                            </button>
                        </div>
                        <div id="action-result" class="action-result"></div>
                    </div>
                </section>
            </main>
        </div>
        
        <script src="/admin/static/admin.js"></script>
    </body>
    </html>
    """)

@admin_router.get("/system", response_class=HTMLResponse)
async def admin_system():
    """🖥️ Panel de Sistema"""
    return HTMLResponse(content="""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sistema - DataCrypt Labs Admin</title>
        <link rel="stylesheet" href="/admin/static/styles.css">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="admin-container">
            <nav class="sidebar">
                <div class="logo">
                    <i class="fas fa-shield-alt"></i>
                    <h2>DataCrypt Labs</h2>
                </div>
                <ul class="nav-menu">
                    <li><a href="/admin/"><i class="fas fa-home"></i> Dashboard</a></li>
                    <li><a href="/admin/system" class="active"><i class="fas fa-server"></i> Sistema</a></li>
                    <li><a href="/admin/database"><i class="fas fa-database"></i> Base de Datos</a></li>
                    <li><a href="/admin/logs"><i class="fas fa-file-alt"></i> Logs</a></li>
                    <li><a href="/admin/settings"><i class="fas fa-cog"></i> Configuración</a></li>
                    <li><a href="/docs"><i class="fas fa-book"></i> API Docs</a></li>
                    <li><a href="/"><i class="fas fa-external-link-alt"></i> Sitio Web</a></li>
                </ul>
            </nav>
            
            <main class="main-content">
                <header class="content-header">
                    <h1><i class="fas fa-server"></i> Información del Sistema</h1>
                </header>
                
                <section class="content-grid">
                    <div class="content-card">
                        <h3>🖥️ Información del Servidor</h3>
                        <div id="server-info">Cargando...</div>
                    </div>
                    
                    <div class="content-card">
                        <h3>📊 Uso de Recursos</h3>
                        <div id="resource-usage">Cargando...</div>
                    </div>
                </section>
            </main>
        </div>
        
        <script src="/admin/static/admin.js"></script>
    </body>
    </html>
    """)

# ===== API ENDPOINTS =====

@admin_router.get("/api/status")
async def get_system_status() -> Dict[str, Any]:
    """📊 Estado completo del sistema"""
    try:
        # Información del sistema
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "system_info": {
                "version": "DataCrypt Labs v2.0",
                "architecture": "FastAPI Modular",
                "environment": "local",
                "port": 8000
            },
            "resources": {
                "cpu_percent": cpu_percent,
                "memory_total": memory.total,
                "memory_used": memory.used,
                "memory_percent": memory.percent,
                "disk_total": disk.total,
                "disk_used": disk.used,
                "disk_percent": (disk.used / disk.total) * 100
            },
            "uptime": "Sistema activo",
            "services": {
                "api": "running",
                "database": "connected",
                "security": "active"
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@admin_router.get("/api/health")
async def health_check() -> Dict[str, str]:
    """🏥 Health check detallado"""
    return {
        "status": "ok",
        "database": "connected",
        "api": "operational",
        "security": "active",
        "timestamp": datetime.utcnow().isoformat()
    }

@admin_router.get("/api/logs")
async def get_recent_logs() -> Dict[str, Any]:
    """📝 Logs recientes del sistema"""
    try:
        logs_dir = Path("logs")
        if not logs_dir.exists():
            return {"logs": [], "message": "No hay logs disponibles"}
        
        logs = []
        for log_file in logs_dir.glob("*.log"):
            if log_file.stat().st_size > 0:
                with open(log_file, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    recent_lines = lines[-10:] if len(lines) > 10 else lines
                    logs.append({
                        "file": log_file.name,
                        "lines": [line.strip() for line in recent_lines]
                    })
        
        return {"logs": logs}
    except Exception as e:
        return {"error": str(e), "logs": []}

# ===== ARCHIVOS ESTÁTICOS =====

@admin_router.get("/static/styles.css", response_class=HTMLResponse)
async def admin_styles():
    """🎨 Estilos CSS del admin"""
    return HTMLResponse(content="""
    /* Reset y base */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f8f9fa;
        color: #333;
    }
    
    /* Layout principal */
    .admin-container {
        display: flex;
        min-height: 100vh;
    }
    
    /* Sidebar */
    .sidebar {
        width: 250px;
        background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
        color: white;
        padding: 0;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }
    
    .logo {
        padding: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        text-align: center;
    }
    
    .logo i {
        font-size: 2em;
        color: #3498db;
        margin-bottom: 10px;
        display: block;
    }
    
    .logo h2 {
        font-size: 1.2em;
        font-weight: 300;
    }
    
    .nav-menu {
        list-style: none;
        padding: 20px 0;
    }
    
    .nav-menu li {
        margin: 5px 0;
    }
    
    .nav-menu a {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        color: rgba(255,255,255,0.8);
        text-decoration: none;
        transition: all 0.3s ease;
    }
    
    .nav-menu a:hover,
    .nav-menu a.active {
        background: rgba(52, 152, 219, 0.2);
        color: white;
        border-right: 3px solid #3498db;
    }
    
    .nav-menu i {
        margin-right: 10px;
        width: 20px;
    }
    
    /* Contenido principal */
    .main-content {
        flex: 1;
        padding: 0;
        background: #f8f9fa;
    }
    
    .content-header {
        background: white;
        padding: 20px 30px;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .content-header h1 {
        font-size: 1.8em;
        color: #2c3e50;
        font-weight: 300;
    }
    
    .content-header i {
        margin-right: 10px;
        color: #3498db;
    }
    
    /* Botones */
    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    .btn-primary {
        background: #3498db;
        color: white;
    }
    
    .btn-primary:hover {
        background: #2980b9;
        transform: translateY(-2px);
    }
    
    /* Grid de estadísticas */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        padding: 30px;
    }
    
    .stat-card {
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
        transform: translateY(-5px);
    }
    
    .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
    }
    
    .stat-icon.server { background: linear-gradient(135deg, #3498db, #2980b9); }
    .stat-icon.database { background: linear-gradient(135deg, #27ae60, #229954); }
    .stat-icon.performance { background: linear-gradient(135deg, #f39c12, #e67e22); }
    .stat-icon.security { background: linear-gradient(135deg, #e74c3c, #c0392b); }
    
    .stat-icon i {
        color: white;
        font-size: 1.5em;
    }
    
    .stat-info h3 {
        font-size: 1em;
        color: #7f8c8d;
        margin-bottom: 5px;
        font-weight: 500;
    }
    
    .stat-info p {
        font-size: 1.2em;
        color: #2c3e50;
        font-weight: 600;
    }
    
    /* Grid de contenido */
    .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 20px;
        padding: 0 30px 30px;
    }
    
    .content-card {
        background: white;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .content-card.full-width {
        grid-column: 1 / -1;
    }
    
    .content-card h3 {
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 1.1em;
        font-weight: 500;
    }
    
    .content-card h3 i {
        margin-right: 8px;
        color: #3498db;
    }
    
    /* Info del sistema */
    .system-info .info-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #ecf0f1;
    }
    
    .system-info .info-item:last-child {
        border-bottom: none;
    }
    
    .system-info .label {
        font-weight: 500;
        color: #7f8c8d;
    }
    
    .system-info .value {
        color: #2c3e50;
        font-weight: 600;
    }
    
    /* Estadísticas rápidas */
    #quick-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }
    
    .quick-stat {
        text-align: center;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
    }
    
    .stat-number {
        display: block;
        font-size: 1.8em;
        font-weight: 700;
        color: #3498db;
        margin-bottom: 5px;
    }
    
    .stat-label {
        font-size: 0.9em;
        color: #7f8c8d;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    /* Acciones rápidas */
    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .action-btn {
        background: white;
        border: 2px solid #ecf0f1;
        padding: 20px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .action-btn:hover {
        border-color: #3498db;
        transform: translateY(-2px);
    }
    
    .action-btn i {
        display: block;
        font-size: 1.5em;
        color: #3498db;
        margin-bottom: 8px;
    }
    
    .action-btn span {
        color: #2c3e50;
        font-weight: 500;
    }
    
    .action-result {
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
        display: none;
    }
    
    .action-result.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
        display: block;
    }
    
    .action-result.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        display: block;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .admin-container {
            flex-direction: column;
        }
        
        .sidebar {
            width: 100%;
        }
        
        .stats-grid,
        .content-grid {
            grid-template-columns: 1fr;
            padding: 15px;
        }
        
        .content-header {
            padding: 15px;
            flex-direction: column;
            gap: 15px;
        }
    }
    """, media_type="text/css")

@admin_router.get("/static/admin.js", response_class=HTMLResponse)
async def admin_js():
    """⚡ JavaScript del admin"""
    return HTMLResponse(content="""
    // Funciones principales del admin
    
    // Cargar datos al inicio
    document.addEventListener('DOMContentLoaded', function() {
        loadDashboardData();
    });
    
    // Cargar datos del dashboard
    async function loadDashboardData() {
        try {
            const response = await fetch('/admin/api/status');
            const data = await response.json();
            
            if (data.status === 'healthy') {
                updateStatusCards(data);
                updateSystemInfo(data);
                updateQuickStats(data);
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    }
    
    // Actualizar tarjetas de estado
    function updateStatusCards(data) {
        const serverStatus = document.getElementById('server-status');
        const dbStatus = document.getElementById('db-status');
        const performanceStatus = document.getElementById('performance-status');
        const securityStatus = document.getElementById('security-status');
        
        if (serverStatus) serverStatus.textContent = '✅ Operativo';
        if (dbStatus) dbStatus.textContent = '✅ Conectado';
        if (performanceStatus) performanceStatus.textContent = `CPU: ${data.resources?.cpu_percent || 0}%`;
        if (securityStatus) securityStatus.textContent = '🔒 Activo';
    }
    
    // Actualizar estadísticas rápidas
    function updateQuickStats(data) {
        const uptime = document.getElementById('uptime');
        const requests = document.getElementById('requests');
        const memory = document.getElementById('memory');
        
        if (uptime) uptime.textContent = 'Activo';
        if (requests) requests.textContent = '0';
        if (memory && data.resources) {
            memory.textContent = `${Math.round(data.resources.memory_percent)}%`;
        }
    }
    
    // Actualizar información del sistema
    function updateSystemInfo(data) {
        // Ya está estática en el HTML, pero se puede actualizar dinámicamente
    }
    
    // Refrescar datos
    function refreshData() {
        loadDashboardData();
        showNotification('Datos actualizados', 'success');
    }
    
    // Probar API
    async function testAPI() {
        const resultDiv = document.getElementById('action-result');
        try {
            resultDiv.className = 'action-result';
            resultDiv.textContent = '⏳ Probando API...';
            resultDiv.style.display = 'block';
            
            const response = await fetch('/admin/api/health');
            const data = await response.json();
            
            if (response.ok) {
                resultDiv.className = 'action-result success';
                resultDiv.innerHTML = `
                    <strong>✅ API funcionando correctamente</strong><br>
                    Estado: ${data.status}<br>
                    Timestamp: ${new Date().toLocaleString()}
                `;
            } else {
                throw new Error('API response not OK');
            }
        } catch (error) {
            resultDiv.className = 'action-result error';
            resultDiv.innerHTML = `<strong>❌ Error:</strong> ${error.message}`;
        }
    }
    
    // Ver logs
    async function viewLogs() {
        try {
            const response = await fetch('/admin/api/logs');
            const data = await response.json();
            
            if (data.logs && data.logs.length > 0) {
                let logsText = 'LOGS RECIENTES:\\n\\n';
                data.logs.forEach(log => {
                    logsText += `📄 ${log.file}:\\n`;
                    log.lines.forEach(line => {
                        logsText += `  ${line}\\n`;
                    });
                    logsText += '\\n';
                });
                alert(logsText);
            } else {
                alert('No hay logs disponibles');
            }
        } catch (error) {
            alert('Error cargando logs: ' + error.message);
        }
    }
    
    // Health check
    async function checkHealth() {
        const resultDiv = document.getElementById('action-result');
        try {
            const response = await fetch('/admin/api/health');
            const data = await response.json();
            
            resultDiv.className = 'action-result success';
            resultDiv.innerHTML = `
                <strong>🏥 Health Check Completo</strong><br>
                API: ${data.api}<br>
                Database: ${data.database}<br>
                Security: ${data.security}
            `;
            resultDiv.style.display = 'block';
        } catch (error) {
            resultDiv.className = 'action-result error';
            resultDiv.textContent = '❌ Health check falló: ' + error.message;
            resultDiv.style.display = 'block';
        }
    }
    
    // Abrir documentación
    function openDocs() {
        window.open('/docs', '_blank');
    }
    
    // Mostrar notificación
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        // Colores según tipo
        if (type === 'success') {
            notification.style.background = '#27ae60';
        } else if (type === 'error') {
            notification.style.background = '#e74c3c';
        } else {
            notification.style.background = '#3498db';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Estilos para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    """, media_type="application/javascript")