"""
DataCrypt Labs - Monitor de Sistema VS Code
Panel integrado para VS Code con comandos y estado del sistema
"""

import json
import sqlite3
import os
from datetime import datetime
from pathlib import Path

class VSCodeSystemMonitor:
    def __init__(self):
        self.db_path = Path("datacrypt_admin.db")
        self.status_file = Path("system_status.json")
    
    def get_system_status(self):
        """Obtener estado completo del sistema"""
        status = {
            "timestamp": datetime.now().isoformat(),
            "database": self.check_database(),
            "server": self.check_server_status(),
            "authentication": self.check_auth_system(),
            "metrics": self.get_quick_metrics()
        }
        
        # Guardar estado en archivo para VS Code
        with open(self.status_file, 'w', encoding='utf-8') as f:
            json.dump(status, f, indent=2, ensure_ascii=False)
        
        return status
    
    def check_database(self):
        """Verificar estado de la base de datos"""
        if not self.db_path.exists():
            return {"status": "❌ No encontrada", "size": 0, "tables": 0}
        
        try:
            size = os.path.getsize(self.db_path)
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Contar tablas
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            
            # Contar usuarios
            cursor.execute("SELECT COUNT(*) FROM admin_users WHERE is_active = 1")
            users = cursor.fetchone()[0]
            
            # Contar sesiones activas
            cursor.execute("""
                SELECT COUNT(*) FROM user_sessions 
                WHERE is_active = 1 AND expires_at > datetime('now')
            """)
            active_sessions = cursor.fetchone()[0]
            
            conn.close()
            
            return {
                "status": "✅ Conectada",
                "size": f"{size:,} bytes",
                "tables": len(tables),
                "users": users,
                "active_sessions": active_sessions,
                "table_names": [table[0] for table in tables]
            }
            
        except Exception as e:
            return {"status": f"❌ Error: {e}", "size": 0, "tables": 0}
    
    def check_server_status(self):
        """Verificar si el servidor Flask está ejecutándose"""
        try:
            import requests
            response = requests.get("http://localhost:5000/health", timeout=2)
            if response.status_code == 200:
                return {
                    "status": "✅ Ejecutándose",
                    "url": "http://localhost:5000/admin",
                    "health": response.json()
                }
        except:
            pass
        
        return {
            "status": "❌ No disponible",
            "url": "http://localhost:5000/admin",
            "note": "Ejecutar tarea '🚀 Iniciar Dashboard Administrativo'"
        }
    
    def check_auth_system(self):
        """Verificar sistema de autenticación"""
        try:
            from admin_auth_system import DataCryptAuthSystem
            auth = DataCryptAuthSystem()
            
            return {
                "status": "✅ Disponible",
                "config": {
                    "session_timeout": auth.config['session_timeout'],
                    "max_login_attempts": auth.config['max_login_attempts'],
                    "lockout_duration": auth.config['lockout_duration']
                }
            }
        except Exception as e:
            return {"status": f"❌ Error: {e}"}
    
    def get_quick_metrics(self):
        """Obtener métricas rápidas"""
        if not self.db_path.exists():
            return {"status": "❌ Base de datos no disponible"}
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Métricas del sistema
            cursor.execute("SELECT metric_name, metric_value FROM system_metrics LIMIT 5")
            metrics = dict(cursor.fetchall())
            
            # Último login
            cursor.execute("""
                SELECT u.username, a.timestamp 
                FROM audit_logs a 
                JOIN admin_users u ON a.user_id = u.id 
                WHERE a.action = 'LOGIN_SUCCESS' 
                ORDER BY a.timestamp DESC LIMIT 1
            """)
            last_login = cursor.fetchone()
            
            conn.close()
            
            return {
                "status": "✅ Disponibles",
                "metrics": metrics,
                "last_login": {
                    "user": last_login[0] if last_login else "N/A",
                    "time": last_login[1] if last_login else "N/A"
                }
            }
            
        except Exception as e:
            return {"status": f"❌ Error: {e}"}
    
    def print_status_report(self):
        """Imprimir reporte de estado para la consola"""
        status = self.get_system_status()
        
        print("🔍 DATACRYPT LABS - ESTADO DEL SISTEMA")
        print("=" * 60)
        print(f"⏰ Timestamp: {status['timestamp']}")
        print()
        
        # Estado de la base de datos
        db = status['database']
        print("📊 BASE DE DATOS:")
        print(f"   Estado: {db['status']}")
        if 'size' in db:
            print(f"   Tamaño: {db['size']}")
            print(f"   Tablas: {db.get('tables', 0)}")
            print(f"   Usuarios: {db.get('users', 0)}")
            print(f"   Sesiones: {db.get('active_sessions', 0)}")
        print()
        
        # Estado del servidor
        server = status['server']
        print("🌐 SERVIDOR FLASK:")
        print(f"   Estado: {server['status']}")
        print(f"   URL: {server['url']}")
        if 'note' in server:
            print(f"   Nota: {server['note']}")
        print()
        
        # Sistema de autenticación
        auth = status['authentication']
        print("🔐 AUTENTICACIÓN:")
        print(f"   Estado: {auth['status']}")
        if 'config' in auth:
            print(f"   Timeout: {auth['config']['session_timeout']}s")
            print(f"   Max intentos: {auth['config']['max_login_attempts']}")
        print()
        
        # Métricas
        metrics = status['metrics']
        print("📈 MÉTRICAS:")
        print(f"   Estado: {metrics['status']}")
        if 'metrics' in metrics and metrics['metrics']:
            for key, value in list(metrics['metrics'].items())[:3]:
                print(f"   {key}: {value}")
        if 'last_login' in metrics:
            print(f"   Último login: {metrics['last_login']['user']} ({metrics['last_login']['time']})")
        print()
        
        print("=" * 60)
        print("💡 COMANDOS DISPONIBLES:")
        print("   • Ctrl+Shift+P → 'Tasks: Run Task' → '🚀 Iniciar Dashboard Administrativo'")
        print("   • Navegador VS Code: http://localhost:5000/admin")
        print("   • Credenciales: admin / DataCrypt2025!")
        print("=" * 60)

def main():
    """Función principal"""
    monitor = VSCodeSystemMonitor()
    monitor.print_status_report()

if __name__ == "__main__":
    main()