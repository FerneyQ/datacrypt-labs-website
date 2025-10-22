#!/usr/bin/env python3
"""
DataCrypt Labs - Sistema de Base de Datos Administrativa
Creación e inicialización de esquema completo para administración
Filosofía de Mejora Continua - PDCA
"""

import sqlite3
import hashlib
import secrets
import json
from datetime import datetime, timedelta
from pathlib import Path
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AdminDatabaseManager:
    def __init__(self, db_path="datacrypt_admin.db"):
        self.db_path = Path(db_path)
        self.connection = None
        
    def connect(self):
        """Establecer conexión con la base de datos"""
        try:
            self.connection = sqlite3.connect(self.db_path, check_same_thread=False)
            self.connection.row_factory = sqlite3.Row  # Para acceso por nombre de columna
            logger.info(f"✅ Conexión establecida con {self.db_path}")
            return True
        except Exception as e:
            logger.error(f"❌ Error conectando a la base de datos: {e}")
            return False
    
    def create_admin_schema(self):
        """Crear esquema completo de administración"""
        if not self.connection:
            logger.error("❌ No hay conexión a la base de datos")
            return False
        
        try:
            cursor = self.connection.cursor()
            
            # 1. Tabla de usuarios administrativos
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS admin_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    salt VARCHAR(100) NOT NULL,
                    role VARCHAR(20) DEFAULT 'admin',
                    is_active BOOLEAN DEFAULT 1,
                    failed_login_attempts INTEGER DEFAULT 0,
                    locked_until DATETIME NULL,
                    last_login DATETIME NULL,
                    last_ip VARCHAR(45) NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # 2. Tabla de sesiones de usuario
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    session_token VARCHAR(255) UNIQUE NOT NULL,
                    ip_address VARCHAR(45) NOT NULL,
                    user_agent TEXT,
                    expires_at DATETIME NOT NULL,
                    is_active BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
                )
            """)
            
            # 3. Tabla de métricas del sistema
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS system_metrics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    metric_name VARCHAR(100) NOT NULL,
                    metric_value TEXT NOT NULL,
                    metric_type VARCHAR(50) NOT NULL,
                    category VARCHAR(50) DEFAULT 'general',
                    tags TEXT DEFAULT '{}',
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    created_by INTEGER NULL,
                    FOREIGN KEY (created_by) REFERENCES admin_users(id)
                )
            """)
            
            # 4. Tabla de logs de auditoría
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NULL,
                    action VARCHAR(100) NOT NULL,
                    resource VARCHAR(100) NULL,
                    resource_id VARCHAR(50) NULL,
                    old_values TEXT NULL,
                    new_values TEXT NULL,
                    ip_address VARCHAR(45) NOT NULL,
                    user_agent TEXT NULL,
                    success BOOLEAN DEFAULT 1,
                    error_message TEXT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES admin_users(id)
                )
            """)
            
            # 5. Tabla de configuración del sistema
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS system_config (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    config_key VARCHAR(100) UNIQUE NOT NULL,
                    config_value TEXT NOT NULL,
                    config_type VARCHAR(20) DEFAULT 'string',
                    category VARCHAR(50) DEFAULT 'general',
                    description TEXT NULL,
                    is_sensitive BOOLEAN DEFAULT 0,
                    updated_by INTEGER NOT NULL,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (updated_by) REFERENCES admin_users(id)
                )
            """)
            
            # 6. Tabla de alertas del sistema
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS system_alerts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    alert_type VARCHAR(50) NOT NULL,
                    severity VARCHAR(20) NOT NULL,
                    title VARCHAR(200) NOT NULL,
                    message TEXT NOT NULL,
                    source VARCHAR(100) DEFAULT 'system',
                    metadata TEXT DEFAULT '{}',
                    is_resolved BOOLEAN DEFAULT 0,
                    resolved_by INTEGER NULL,
                    resolved_at DATETIME NULL,
                    resolution_notes TEXT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (resolved_by) REFERENCES admin_users(id)
                )
            """)
            
            # 7. Tabla de métricas de rendimiento
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS performance_metrics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    metric_name VARCHAR(100) NOT NULL,
                    value REAL NOT NULL,
                    unit VARCHAR(20) DEFAULT 'count',
                    page_url VARCHAR(500) NULL,
                    user_agent TEXT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # 8. Tabla de visitantes y analytics
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS visitor_analytics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    visitor_id VARCHAR(100) NOT NULL,
                    ip_address VARCHAR(45) NOT NULL,
                    user_agent TEXT NOT NULL,
                    page_url VARCHAR(500) NOT NULL,
                    referrer VARCHAR(500) NULL,
                    session_duration INTEGER DEFAULT 0,
                    bounce_rate REAL DEFAULT 0,
                    country VARCHAR(100) NULL,
                    city VARCHAR(100) NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            logger.info("✅ Esquema de tablas creado exitosamente")
            
            # Crear índices para optimización
            self.create_indexes(cursor)
            
            self.connection.commit()
            return True
            
        except Exception as e:
            logger.error(f"❌ Error creando esquema: {e}")
            if self.connection:
                self.connection.rollback()
            return False
    
    def create_indexes(self, cursor):
        """Crear índices para optimización de consultas"""
        indexes = [
            # Índices para admin_users
            "CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username)",
            "CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email)",
            "CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active)",
            
            # Índices para user_sessions
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token)",
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at)",
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active)",
            
            # Índices para system_metrics
            "CREATE INDEX IF NOT EXISTS idx_system_metrics_name ON system_metrics(metric_name)",
            "CREATE INDEX IF NOT EXISTS idx_system_metrics_type ON system_metrics(metric_type)",
            "CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp)",
            "CREATE INDEX IF NOT EXISTS idx_system_metrics_category ON system_metrics(category)",
            
            # Índices para audit_logs
            "CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)",
            "CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)",
            "CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource)",
            
            # Índices para system_config
            "CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(config_key)",
            "CREATE INDEX IF NOT EXISTS idx_system_config_category ON system_config(category)",
            
            # Índices para system_alerts
            "CREATE INDEX IF NOT EXISTS idx_system_alerts_type ON system_alerts(alert_type)",
            "CREATE INDEX IF NOT EXISTS idx_system_alerts_severity ON system_alerts(severity)",
            "CREATE INDEX IF NOT EXISTS idx_system_alerts_resolved ON system_alerts(is_resolved)",
            "CREATE INDEX IF NOT EXISTS idx_system_alerts_created ON system_alerts(created_at)",
            
            # Índices para performance_metrics
            "CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON performance_metrics(metric_name)",
            "CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp)",
            
            # Índices para visitor_analytics
            "CREATE INDEX IF NOT EXISTS idx_visitor_analytics_visitor_id ON visitor_analytics(visitor_id)",
            "CREATE INDEX IF NOT EXISTS idx_visitor_analytics_ip ON visitor_analytics(ip_address)",
            "CREATE INDEX IF NOT EXISTS idx_visitor_analytics_timestamp ON visitor_analytics(timestamp)",
        ]
        
        for index_sql in indexes:
            cursor.execute(index_sql)
        
        logger.info("✅ Índices de optimización creados")
    
    def create_default_admin(self, username="admin", email="admin@datacrypt-labs.com", password="DataCrypt2025!"):
        """Crear usuario administrador por defecto"""
        if not self.connection:
            logger.error("❌ No hay conexión a la base de datos")
            return False
        
        try:
            cursor = self.connection.cursor()
            
            # Verificar si ya existe un admin
            cursor.execute("SELECT COUNT(*) FROM admin_users WHERE role = 'admin'")
            if cursor.fetchone()[0] > 0:
                logger.info("ℹ️ Ya existe un usuario administrador")
                return True
            
            # Generar salt y hash de contraseña
            salt = secrets.token_hex(32)
            password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
            password_hash_hex = password_hash.hex()
            
            # Insertar usuario administrador
            cursor.execute("""
                INSERT INTO admin_users (username, email, password_hash, salt, role, is_active)
                VALUES (?, ?, ?, ?, 'admin', 1)
            """, (username, email, password_hash_hex, salt))
            
            user_id = cursor.lastrowid
            
            # Log de auditoría
            cursor.execute("""
                INSERT INTO audit_logs (user_id, action, resource, ip_address, user_agent)
                VALUES (?, 'CREATE_ADMIN_USER', 'admin_users', '127.0.0.1', 'System')
            """, (user_id,))
            
            self.connection.commit()
            logger.info(f"✅ Usuario administrador creado: {username}")
            logger.info(f"🔑 Credenciales por defecto - Usuario: {username}, Email: {email}")
            logger.info("⚠️ IMPORTANTE: Cambie la contraseña por defecto inmediatamente")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error creando usuario administrador: {e}")
            if self.connection:
                self.connection.rollback()
            return False
    
    def insert_initial_config(self):
        """Insertar configuraciones iniciales del sistema"""
        if not self.connection:
            return False
        
        try:
            cursor = self.connection.cursor()
            
            # Obtener ID del admin
            cursor.execute("SELECT id FROM admin_users WHERE role = 'admin' LIMIT 1")
            admin_user = cursor.fetchone()
            if not admin_user:
                logger.error("❌ No se encontró usuario administrador")
                return False
            
            admin_id = admin_user[0]
            
            initial_configs = [
                ('site_title', 'DataCrypt Labs - Business Intelligence', 'string', 'general', 'Título principal del sitio web'),
                ('site_description', 'Automatizamos soluciones inteligentes de Business Intelligence', 'string', 'general', 'Descripción del sitio'),
                ('admin_email', 'admin@datacrypt-labs.com', 'string', 'contact', 'Email principal de contacto'),
                ('phone_number', '3232066197', 'string', 'contact', 'Número de teléfono principal'),
                ('session_timeout', '3600', 'integer', 'security', 'Tiempo de expiración de sesión en segundos'),
                ('max_login_attempts', '5', 'integer', 'security', 'Máximo número de intentos de login'),
                ('lockout_duration', '1800', 'integer', 'security', 'Duración del bloqueo en segundos'),
                ('backup_enabled', 'true', 'boolean', 'system', 'Habilitar backups automáticos'),
                ('backup_frequency', 'daily', 'string', 'system', 'Frecuencia de backups'),
                ('metrics_retention_days', '90', 'integer', 'metrics', 'Días de retención de métricas'),
                ('alert_email_enabled', 'true', 'boolean', 'alerts', 'Habilitar alertas por email'),
                ('maintenance_mode', 'false', 'boolean', 'system', 'Modo de mantenimiento activado'),
            ]
            
            for config_key, config_value, config_type, category, description in initial_configs:
                cursor.execute("""
                    INSERT OR IGNORE INTO system_config 
                    (config_key, config_value, config_type, category, description, updated_by)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (config_key, config_value, config_type, category, description, admin_id))
            
            self.connection.commit()
            logger.info("✅ Configuraciones iniciales insertadas")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error insertando configuraciones: {e}")
            return False
    
    def insert_sample_metrics(self):
        """Insertar métricas de ejemplo para demostración"""
        if not self.connection:
            return False
        
        try:
            cursor = self.connection.cursor()
            
            sample_metrics = [
                ('page_views', '1250', 'counter', 'analytics'),
                ('unique_visitors', '845', 'counter', 'analytics'),
                ('bounce_rate', '0.35', 'gauge', 'analytics'),
                ('avg_session_duration', '180', 'gauge', 'analytics'),
                ('conversion_rate', '0.08', 'gauge', 'business'),
                ('system_uptime', '99.9', 'gauge', 'performance'),
                ('response_time', '250', 'gauge', 'performance'),
                ('cpu_usage', '45.2', 'gauge', 'system'),
                ('memory_usage', '68.5', 'gauge', 'system'),
                ('disk_usage', '34.7', 'gauge', 'system'),
            ]
            
            for metric_name, metric_value, metric_type, category in sample_metrics:
                cursor.execute("""
                    INSERT INTO system_metrics (metric_name, metric_value, metric_type, category)
                    VALUES (?, ?, ?, ?)
                """, (metric_name, metric_value, metric_type, category))
            
            # Métricas de rendimiento de ejemplo
            performance_data = [
                ('page_load_time', 1.2, 'seconds', '/'),
                ('page_load_time', 0.8, 'seconds', '/servicios.html'),
                ('page_load_time', 1.1, 'seconds', '/portafolio.html'),
                ('first_contentful_paint', 0.9, 'seconds', '/'),
                ('largest_contentful_paint', 1.5, 'seconds', '/'),
            ]
            
            for metric_name, value, unit, page_url in performance_data:
                cursor.execute("""
                    INSERT INTO performance_metrics (metric_name, value, unit, page_url)
                    VALUES (?, ?, ?, ?)
                """, (metric_name, value, unit, page_url))
            
            self.connection.commit()
            logger.info("✅ Métricas de ejemplo insertadas")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error insertando métricas: {e}")
            return False
    
    def create_alert_sample(self):
        """Crear alertas de ejemplo"""
        if not self.connection:
            return False
        
        try:
            cursor = self.connection.cursor()
            
            sample_alerts = [
                ('system', 'info', 'Sistema Inicializado', 'El sistema de administración se ha inicializado correctamente'),
                ('performance', 'medium', 'Tiempo de Respuesta Elevado', 'El tiempo de respuesta promedio ha superado los 2 segundos'),
                ('security', 'low', 'Nuevo Login Administrativo', 'Se ha detectado un nuevo login en el panel administrativo'),
            ]
            
            for alert_type, severity, title, message in sample_alerts:
                cursor.execute("""
                    INSERT INTO system_alerts (alert_type, severity, title, message, source)
                    VALUES (?, ?, ?, ?, 'system')
                """, (alert_type, severity, title, message))
            
            self.connection.commit()
            logger.info("✅ Alertas de ejemplo creadas")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error creando alertas: {e}")
            return False
    
    def get_database_info(self):
        """Obtener información general de la base de datos"""
        if not self.connection:
            return None
        
        try:
            cursor = self.connection.cursor()
            
            # Contar registros en cada tabla
            tables_info = {}
            
            tables = [
                'admin_users', 'user_sessions', 'system_metrics', 'audit_logs', 
                'system_config', 'system_alerts', 'performance_metrics', 'visitor_analytics'
            ]
            
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                tables_info[table] = count
            
            # Información adicional
            cursor.execute("SELECT COUNT(*) FROM admin_users WHERE is_active = 1")
            active_users = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM system_alerts WHERE is_resolved = 0")
            pending_alerts = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM user_sessions WHERE is_active = 1 AND expires_at > datetime('now')")
            active_sessions = cursor.fetchone()[0]
            
            return {
                'tables': tables_info,
                'active_users': active_users,
                'pending_alerts': pending_alerts,
                'active_sessions': active_sessions,
                'database_path': str(self.db_path),
                'database_size': self.db_path.stat().st_size if self.db_path.exists() else 0
            }
            
        except Exception as e:
            logger.error(f"❌ Error obteniendo información de BD: {e}")
            return None
    
    def close(self):
        """Cerrar conexión"""
        if self.connection:
            self.connection.close()
            logger.info("✅ Conexión cerrada")

def main():
    """Función principal para inicializar el sistema de base de datos"""
    print("🗄️ DATACRYPT LABS - INICIALIZACIÓN DE BASE DE DATOS ADMINISTRATIVA")
    print("=" * 80)
    
    db_manager = AdminDatabaseManager()
    
    # Conectar a la base de datos
    if not db_manager.connect():
        print("❌ Error: No se pudo conectar a la base de datos")
        return False
    
    print("🔨 Creando esquema de base de datos...")
    if not db_manager.create_admin_schema():
        print("❌ Error creando esquema")
        return False
    
    print("👤 Creando usuario administrador por defecto...")
    if not db_manager.create_default_admin():
        print("❌ Error creando usuario administrador")
        return False
    
    print("⚙️ Insertando configuraciones iniciales...")
    if not db_manager.insert_initial_config():
        print("❌ Error insertando configuraciones")
        return False
    
    print("📊 Insertando métricas de ejemplo...")
    if not db_manager.insert_sample_metrics():
        print("❌ Error insertando métricas")
        return False
    
    print("🚨 Creando alertas de ejemplo...")
    if not db_manager.create_alert_sample():
        print("❌ Error creando alertas")
        return False
    
    # Mostrar información de la base de datos
    print("\n📊 INFORMACIÓN DE LA BASE DE DATOS:")
    print("-" * 50)
    
    db_info = db_manager.get_database_info()
    if db_info:
        print(f"📁 Archivo: {db_info['database_path']}")
        print(f"📏 Tamaño: {db_info['database_size']} bytes")
        print(f"👥 Usuarios activos: {db_info['active_users']}")
        print(f"🚨 Alertas pendientes: {db_info['pending_alerts']}")
        print(f"🔐 Sesiones activas: {db_info['active_sessions']}")
        print()
        
        print("📋 REGISTROS POR TABLA:")
        for table, count in db_info['tables'].items():
            print(f"  • {table}: {count} registros")
    
    db_manager.close()
    
    print("\n✅ BASE DE DATOS ADMINISTRATIVA INICIALIZADA EXITOSAMENTE")
    print("=" * 80)
    print("🔑 CREDENCIALES POR DEFECTO:")
    print("   Usuario: admin")
    print("   Email: admin@datacrypt-labs.com")
    print("   Contraseña: DataCrypt2025!")
    print()
    print("⚠️ IMPORTANTE: Cambiar contraseña inmediatamente después del primer login")
    print("🛡️ El sistema está listo para autenticación y administración completa")
    
    return True

if __name__ == "__main__":
    main()