#!/usr/bin/env python3
"""
🗄️ DataCrypt Labs - Database Migration Script
Filosofía Mejora Continua - Migración segura de datos para producción
"""

import sqlite3
import os
import shutil
import json
from datetime import datetime
from pathlib import Path

class DatabaseMigrator:
    def __init__(self, source_db="backend/datacrypt.db", target_db="data/datacrypt_production.db"):
        self.source_db = Path(source_db)
        self.target_db = Path(target_db)
        self.backup_dir = Path("backups")
        
    def create_backup(self):
        """Crear backup de la base de datos existente"""
        if self.source_db.exists():
            self.backup_dir.mkdir(exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = self.backup_dir / f"datacrypt_backup_{timestamp}.db"
            shutil.copy2(self.source_db, backup_path)
            print(f"✅ Backup creado: {backup_path}")
            return backup_path
        return None
    
    def init_production_database(self):
        """Inicializar base de datos de producción"""
        self.target_db.parent.mkdir(parents=True, exist_ok=True)
        
        conn = sqlite3.connect(self.target_db)
        cursor = conn.cursor()
        
        # Tabla para mensajes de contacto
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'new'
            )
        """)
        
        # Tabla para análisis de datos
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS analysis_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                analysis_type TEXT NOT NULL,
                parameters TEXT,
                results TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Tabla para ejecución de código
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS code_executions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code_hash TEXT NOT NULL,
                code TEXT NOT NULL,
                output TEXT,
                execution_time REAL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Tabla para scores del juego (ya existe en el código)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS game_scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT NOT NULL,
                score INTEGER NOT NULL,
                level INTEGER NOT NULL DEFAULT 1,
                data_points INTEGER DEFAULT 0,
                time_played INTEGER DEFAULT 0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Tabla para métricas de la aplicación
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS app_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                metric_name TEXT NOT NULL,
                metric_value TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Crear índices para performance
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_contact_timestamp ON contact_messages(timestamp)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_game_score ON game_scores(score DESC)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_game_timestamp ON game_scores(timestamp)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_analysis_type ON analysis_results(analysis_type)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_metrics_name ON app_metrics(metric_name)")
        
        conn.commit()
        conn.close()
        print(f"✅ Base de datos de producción inicializada: {self.target_db}")
    
    def migrate_data(self):
        """Migrar datos de desarrollo a producción"""
        if not self.source_db.exists():
            print("⚠️ No hay base de datos de desarrollo para migrar")
            return
        
        # Conectar a ambas bases de datos
        source_conn = sqlite3.connect(self.source_db)
        target_conn = sqlite3.connect(self.target_db)
        
        # Migrar tablas que existen en ambas bases de datos
        tables_to_migrate = ['contact_messages', 'analysis_results', 'code_executions', 'game_scores']
        
        for table in tables_to_migrate:
            try:
                # Verificar si la tabla existe en la fuente
                source_cursor = source_conn.cursor()
                source_cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}'")
                if source_cursor.fetchone():
                    # Copiar datos
                    source_cursor.execute(f"SELECT * FROM {table}")
                    rows = source_cursor.fetchall()
                    
                    if rows:
                        # Obtener columnas
                        source_cursor.execute(f"PRAGMA table_info({table})")
                        columns = [col[1] for col in source_cursor.fetchall()]
                        placeholders = ','.join(['?' for _ in columns])
                        
                        target_cursor = target_conn.cursor()
                        target_cursor.executemany(
                            f"INSERT OR IGNORE INTO {table} ({','.join(columns)}) VALUES ({placeholders})",
                            rows
                        )
                        print(f"✅ Migrados {len(rows)} registros de la tabla {table}")
                    
            except Exception as e:
                print(f"⚠️ Error migrando tabla {table}: {e}")
        
        source_conn.close()
        target_conn.commit()
        target_conn.close()
        print("✅ Migración de datos completada")
    
    def add_sample_data(self):
        """Añadir datos de ejemplo para demostración"""
        conn = sqlite3.connect(self.target_db)
        cursor = conn.cursor()
        
        # Datos de ejemplo para el juego (si no existen)
        cursor.execute("SELECT COUNT(*) FROM game_scores")
        if cursor.fetchone()[0] == 0:
            sample_scores = [
                ('DemoUser1', 2500, 8, 15, 240),
                ('DemoUser2', 1850, 6, 12, 200),
                ('DemoUser3', 1650, 5, 10, 190),
            ]
            cursor.executemany(
                "INSERT INTO game_scores (player_name, score, level, data_points, time_played) VALUES (?, ?, ?, ?, ?)",
                sample_scores
            )
            print("✅ Datos de ejemplo del juego añadidos")
        
        # Métricas iniciales
        cursor.execute("SELECT COUNT(*) FROM app_metrics")
        if cursor.fetchone()[0] == 0:
            initial_metrics = [
                ('deployment_date', datetime.now().isoformat()),
                ('version', '2.2.0'),
                ('environment', 'production')
            ]
            cursor.executemany(
                "INSERT INTO app_metrics (metric_name, metric_value) VALUES (?, ?)",
                initial_metrics
            )
            print("✅ Métricas iniciales añadidas")
        
        conn.commit()
        conn.close()

def main():
    """Ejecutar migración completa"""
    print("🚀 Iniciando migración de base de datos de DataCrypt Labs...")
    
    migrator = DatabaseMigrator()
    
    # 1. Crear backup
    migrator.create_backup()
    
    # 2. Inicializar base de datos de producción
    migrator.init_production_database()
    
    # 3. Migrar datos existentes
    migrator.migrate_data()
    
    # 4. Añadir datos de ejemplo
    migrator.add_sample_data()
    
    print("🎉 ¡Migración completada exitosamente!")
    print("📊 Base de datos lista para producción")

if __name__ == "__main__":
    main()