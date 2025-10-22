#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🛡️ REFORZAMIENTO DE BASE DE DATOS - SEGURIDAD AVANZADA
=====================================================

Creación de tablas adicionales para el sistema de seguridad reforzado
"""

import sqlite3
import os
from datetime import datetime

def create_security_tables():
    """Crear tablas adicionales para seguridad"""
    
    print("🛡️ REFORZANDO BASE DE DATOS CON SEGURIDAD AVANZADA")
    print("=" * 60)
    
    conn = sqlite3.connect('datacrypt_admin.db')
    cursor = conn.cursor()
    
    # Tabla para eventos de seguridad
    print("📋 Creando tabla: security_events")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS security_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type VARCHAR(50) NOT NULL,
            ip_address VARCHAR(45) NOT NULL,
            user_agent TEXT,
            endpoint VARCHAR(100),
            severity VARCHAR(20) DEFAULT 'INFO',
            details TEXT,
            blocked BOOLEAN DEFAULT FALSE,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            resolved BOOLEAN DEFAULT FALSE,
            resolution_notes TEXT
        )
    ''')
    
    # Tabla para IPs bloqueadas
    print("🚫 Creando tabla: blocked_ips")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS blocked_ips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address VARCHAR(45) NOT NULL UNIQUE,
            block_reason TEXT NOT NULL,
            blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            permanent BOOLEAN DEFAULT FALSE,
            failed_attempts INTEGER DEFAULT 0,
            last_attempt DATETIME,
            unblocked_at DATETIME NULL,
            unblock_reason TEXT NULL
        )
    ''')
    
    # Tabla para API keys (si se necesitan)
    print("🔑 Creando tabla: api_keys")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS api_keys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key_name VARCHAR(100) NOT NULL,
            api_key VARCHAR(64) NOT NULL UNIQUE,
            user_id INTEGER,
            permissions TEXT, -- JSON de permisos
            rate_limit INTEGER DEFAULT 1000,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            is_active BOOLEAN DEFAULT TRUE,
            last_used DATETIME,
            usage_count INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES admin_users (id)
        )
    ''')
    
    # Tabla para roles de usuario detallados
    print("🎭 Creando tabla: user_roles")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role_name VARCHAR(50) NOT NULL UNIQUE,
            description TEXT,
            permissions TEXT, -- JSON de permisos específicos
            can_create_users BOOLEAN DEFAULT FALSE,
            can_modify_users BOOLEAN DEFAULT FALSE,
            can_delete_users BOOLEAN DEFAULT FALSE,
            can_access_logs BOOLEAN DEFAULT FALSE,
            can_modify_system BOOLEAN DEFAULT FALSE,
            max_session_duration INTEGER DEFAULT 3600, -- en segundos
            require_2fa BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla para intentos de login
    print("🔐 Creando tabla: login_attempts")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS login_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(100),
            ip_address VARCHAR(45) NOT NULL,
            user_agent TEXT,
            success BOOLEAN NOT NULL,
            failure_reason VARCHAR(200),
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            session_id VARCHAR(64),
            blocked_after BOOLEAN DEFAULT FALSE
        )
    ''')
    
    # Tabla para configuración de seguridad
    print("⚙️ Creando tabla: security_config")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS security_config (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            config_key VARCHAR(100) NOT NULL UNIQUE,
            config_value TEXT NOT NULL,
            description TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_by INTEGER,
            FOREIGN KEY (updated_by) REFERENCES admin_users (id)
        )
    ''')
    
    # Insertar configuración de seguridad por defecto
    print("🔧 Insertando configuración de seguridad...")
    
    security_configs = [
        ('max_failed_attempts', '3', 'Máximo número de intentos fallidos antes de bloquear'),
        ('block_duration_minutes', '15', 'Duración del bloqueo en minutos'),
        ('rate_limit_per_minute', '30', 'Máximo de requests por minuto'),
        ('session_timeout_hours', '1', 'Tiempo de expiración de sesión en horas'),
        ('require_strong_passwords', 'true', 'Requiere contraseñas seguras'),
        ('enable_2fa', 'false', 'Habilitar autenticación de dos factores'),
        ('log_all_requests', 'true', 'Registrar todas las peticiones'),
        ('block_suspicious_ips', 'true', 'Bloquear IPs sospechosas automáticamente')
    ]
    
    for key, value, desc in security_configs:
        cursor.execute('''
            INSERT OR IGNORE INTO security_config (config_key, config_value, description)
            VALUES (?, ?, ?)
        ''', (key, value, desc))
    
    # Insertar roles por defecto
    print("👑 Insertando roles por defecto...")
    
    default_roles = [
        ('super_admin', 'Administrador supremo con todos los permisos', 
         '{"all": true}', True, True, True, True, True, 7200, False),
        ('admin', 'Administrador con permisos limitados',
         '{"read": true, "write": true, "users": true}', True, True, False, True, False, 3600, False),
        ('server_admin', 'Administrador de servidor',
         '{"read": true, "write": false, "server": true}', False, False, False, True, False, 1800, True),
        ('metrics_viewer', 'Solo visualización de métricas',
         '{"read": true}', False, False, False, False, False, 1800, False)
    ]
    
    for role_data in default_roles:
        cursor.execute('''
            INSERT OR IGNORE INTO user_roles 
            (role_name, description, permissions, can_create_users, can_modify_users,
             can_delete_users, can_access_logs, can_modify_system, max_session_duration,
             require_2fa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', role_data)
    
    # Crear índices para mejor rendimiento
    print("📊 Creando índices de rendimiento...")
    
    indices = [
        "CREATE INDEX IF NOT EXISTS idx_security_events_ip ON security_events(ip_address)",
        "CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(timestamp)",
        "CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip ON blocked_ips(ip_address)",
        "CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address)",
        "CREATE INDEX IF NOT EXISTS idx_login_attempts_timestamp ON login_attempts(timestamp)",
        "CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(api_key)",
        "CREATE INDEX IF NOT EXISTS idx_security_config_key ON security_config(config_key)"
    ]
    
    for index_sql in indices:
        cursor.execute(index_sql)
    
    conn.commit()
    
    # Verificar tablas creadas
    print("\n✅ VERIFICANDO TABLAS CREADAS:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = cursor.fetchall()
    
    expected_tables = [
        'admin_users', 'user_sessions', 'audit_logs', 'system_metrics',
        'api_keys', 'user_roles', 'system_config', 'security_events',
        'blocked_ips', 'login_attempts', 'security_config'
    ]
    
    for table_name in expected_tables:
        if any(table_name in table[0] for table in tables):
            print(f"   ✅ {table_name}")
        else:
            print(f"   ❌ {table_name} - FALTANTE")
    
    # Estadísticas finales
    cursor.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table'")
    total_tables = cursor.fetchone()[0]
    
    print(f"\n📊 ESTADÍSTICAS FINALES:")
    print(f"   📋 Total de tablas: {total_tables}")
    print(f"   🛡️ Configuraciones de seguridad: {len(security_configs)}")
    print(f"   🎭 Roles definidos: {len(default_roles)}")
    print(f"   📊 Índices creados: {len(indices)}")
    
    conn.close()
    
    print("\n🎉 BASE DE DATOS REFORZADA EXITOSAMENTE!")
    return True

if __name__ == "__main__":
    create_security_tables()