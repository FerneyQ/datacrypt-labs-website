#!/usr/bin/env python3
"""
DataCrypt Labs - Monitor del Ecosistema Completo
Sistema de Monitoreo bajo Filosofía de Mejora Continua

Este script monitorea todos los componentes del sistema y
proporciona reportes en tiempo real siguiendo PDCA.
"""

import asyncio
import json
import time
import psutil
import os
from datetime import datetime
from pathlib import Path

class DataCryptEcosystemMonitor:
    def __init__(self):
        self.base_path = Path(__file__).parent
        self.monitoring_active = True
        self.metrics_history = []
        self.alerts = []
        
        self.components = {
            "backend": {
                "name": "FastAPI Backend v3.0",
                "status": "unknown",
                "port": 8000,
                "health_endpoint": "/api/health"
            },
            "voice_system": {
                "name": "Sistema de Voz Integrado",
                "status": "unknown",
                "endpoint": "/api/voice/report"
            },
            "dashboard": {
                "name": "Dashboard Administrativo",
                "status": "unknown",
                "file": "admin/dashboard.html"
            },
            "config_manager": {
                "name": "Gestor de Configuración",
                "status": "unknown",
                "endpoint": "/api/config"
            }
        }
    
    def get_system_metrics(self):
        """Obtener métricas del sistema"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            # Obtener información de red
            net_io = psutil.net_io_counters()
            
            metrics = {
                "timestamp": datetime.now().isoformat(),
                "cpu_usage": cpu_percent,
                "memory_usage": memory.percent,
                "memory_total": memory.total // (1024**3),  # GB
                "memory_available": memory.available // (1024**3),  # GB
                "disk_usage": disk.percent,
                "disk_total": disk.total // (1024**3),  # GB
                "network_bytes_sent": net_io.bytes_sent,
                "network_bytes_recv": net_io.bytes_recv,
                "active_processes": len(psutil.pids()),
                "system_uptime": time.time() - psutil.boot_time()
            }
            
            return metrics
            
        except Exception as e:
            print(f"❌ Error obteniendo métricas: {e}")
            return None
    
    def check_backend_health(self):
        """Verificar salud del backend"""
        try:
            import requests
            
            url = f"http://localhost:{self.components['backend']['port']}/api/health"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                self.components['backend']['status'] = 'healthy'
                return {
                    "status": "healthy",
                    "response_time": response.elapsed.total_seconds(),
                    "data": data
                }
            else:
                self.components['backend']['status'] = 'unhealthy'
                return {
                    "status": "unhealthy",
                    "http_code": response.status_code
                }
                
        except Exception as e:
            self.components['backend']['status'] = 'offline'
            return {
                "status": "offline",
                "error": str(e)
            }
    
    def check_voice_system(self):
        """Verificar sistema de voz"""
        try:
            import requests
            
            url = f"http://localhost:{self.components['backend']['port']}/api/voice/report"
            data = {"report_type": "status"}
            
            response = requests.post(url, json=data, timeout=10)
            
            if response.status_code == 200:
                self.components['voice_system']['status'] = 'operational'
                return {
                    "status": "operational",
                    "response_time": response.elapsed.total_seconds()
                }
            else:
                self.components['voice_system']['status'] = 'error'
                return {
                    "status": "error",
                    "http_code": response.status_code
                }
                
        except Exception as e:
            self.components['voice_system']['status'] = 'offline'
            return {
                "status": "offline",
                "error": str(e)
            }
    
    def check_dashboard_files(self):
        """Verificar archivos del dashboard"""
        dashboard_file = self.base_path / self.components['dashboard']['file']
        
        if dashboard_file.exists():
            file_size = dashboard_file.stat().st_size
            modification_time = dashboard_file.stat().st_mtime
            
            self.components['dashboard']['status'] = 'available'
            return {
                "status": "available",
                "file_size": file_size,
                "last_modified": datetime.fromtimestamp(modification_time).isoformat()
            }
        else:
            self.components['dashboard']['status'] = 'missing'
            return {
                "status": "missing",
                "expected_path": str(dashboard_file)
            }
    
    def generate_alert(self, component, severity, message):
        """Generar alerta del sistema"""
        alert = {
            "timestamp": datetime.now().isoformat(),
            "component": component,
            "severity": severity,  # low, medium, high, critical
            "message": message
        }
        
        self.alerts.append(alert)
        
        # Mantener solo las últimas 100 alertas
        if len(self.alerts) > 100:
            self.alerts = self.alerts[-100:]
        
        print(f"🚨 ALERTA [{severity.upper()}] {component}: {message}")
        
        return alert
    
    def analyze_metrics(self, metrics):
        """Analizar métricas y generar alertas"""
        if not metrics:
            return
        
        # Análisis de CPU
        if metrics['cpu_usage'] > 80:
            self.generate_alert('System', 'high', f"Alto uso de CPU: {metrics['cpu_usage']:.1f}%")
        elif metrics['cpu_usage'] > 60:
            self.generate_alert('System', 'medium', f"Uso moderado de CPU: {metrics['cpu_usage']:.1f}%")
        
        # Análisis de memoria
        if metrics['memory_usage'] > 85:
            self.generate_alert('System', 'high', f"Alta uso de memoria: {metrics['memory_usage']:.1f}%")
        elif metrics['memory_usage'] > 70:
            self.generate_alert('System', 'medium', f"Uso moderado de memoria: {metrics['memory_usage']:.1f}%")
        
        # Análisis de disco
        if metrics['disk_usage'] > 90:
            self.generate_alert('System', 'critical', f"Espacio en disco crítico: {metrics['disk_usage']:.1f}%")
        elif metrics['disk_usage'] > 80:
            self.generate_alert('System', 'high', f"Poco espacio en disco: {metrics['disk_usage']:.1f}%")
    
    def generate_comprehensive_report(self):
        """Generar reporte completo del ecosistema"""
        print("\n" + "="*80)
        print("📊 REPORTE COMPLETO DEL ECOSISTEMA - DataCrypt Labs")
        print("🔄 Filosofía de Mejora Continua - PDCA")
        print("="*80)
        
        # Obtener métricas del sistema
        metrics = self.get_system_metrics()
        if metrics:
            print(f"\n🖥️ MÉTRICAS DEL SISTEMA ({metrics['timestamp']})")
            print("-" * 50)
            print(f"💾 CPU: {metrics['cpu_usage']:.1f}%")
            print(f"🧠 Memoria: {metrics['memory_usage']:.1f}% ({metrics['memory_available']}GB disponible)")
            print(f"💿 Disco: {metrics['disk_usage']:.1f}% ({metrics['disk_total']}GB total)")
            print(f"🌐 Red: ↑{metrics['network_bytes_sent']//1024//1024}MB ↓{metrics['network_bytes_recv']//1024//1024}MB")
            print(f"⚡ Procesos activos: {metrics['active_processes']}")
            print(f"⏱️ Tiempo actividad: {metrics['system_uptime']/3600:.1f} horas")
        
        # Estado de componentes
        print(f"\n🔧 ESTADO DE COMPONENTES")
        print("-" * 50)
        
        # Backend
        backend_health = self.check_backend_health()
        status_icon = "✅" if backend_health['status'] == 'healthy' else "❌"
        print(f"{status_icon} Backend: {backend_health['status']}")
        if 'response_time' in backend_health:
            print(f"   ⏱️ Tiempo respuesta: {backend_health['response_time']*1000:.1f}ms")
        
        # Sistema de voz
        voice_health = self.check_voice_system()
        status_icon = "✅" if voice_health['status'] == 'operational' else "❌"
        print(f"{status_icon} Sistema de Voz: {voice_health['status']}")
        if 'response_time' in voice_health:
            print(f"   ⏱️ Tiempo respuesta: {voice_health['response_time']*1000:.1f}ms")
        
        # Dashboard
        dashboard_health = self.check_dashboard_files()
        status_icon = "✅" if dashboard_health['status'] == 'available' else "❌"
        print(f"{status_icon} Dashboard: {dashboard_health['status']}")
        if 'file_size' in dashboard_health:
            print(f"   📁 Tamaño: {dashboard_health['file_size']//1024}KB")
        
        # Alertas recientes
        recent_alerts = [a for a in self.alerts if 
                        (datetime.now() - datetime.fromisoformat(a['timestamp'])).seconds < 3600]
        
        if recent_alerts:
            print(f"\n🚨 ALERTAS RECIENTES (última hora): {len(recent_alerts)}")
            print("-" * 50)
            for alert in recent_alerts[-5:]:  # Mostrar últimas 5
                severity_icon = {"low": "💙", "medium": "💛", "high": "🟠", "critical": "🔴"}
                icon = severity_icon.get(alert['severity'], "⚪")
                time_str = alert['timestamp'].split('T')[1][:8]
                print(f"{icon} [{time_str}] {alert['component']}: {alert['message']}")
        else:
            print(f"\n✅ Sin alertas en la última hora")
        
        # Análisis de rendimiento
        if metrics:
            self.analyze_metrics(metrics)
            
            # Guardar métricas en historial
            self.metrics_history.append(metrics)
            if len(self.metrics_history) > 1440:  # Mantener 24 horas (1 por minuto)
                self.metrics_history = self.metrics_history[-1440:]
        
        print("\n" + "="*80)
        return {
            "system_metrics": metrics,
            "backend_health": backend_health,
            "voice_health": voice_health,
            "dashboard_health": dashboard_health,
            "recent_alerts": recent_alerts
        }
    
    def save_monitoring_data(self):
        """Guardar datos de monitoreo"""
        monitoring_data = {
            "timestamp": datetime.now().isoformat(),
            "components": self.components,
            "metrics_history": self.metrics_history[-100:],  # Últimas 100 métricas
            "alerts": self.alerts[-50:],  # Últimas 50 alertas
            "monitoring_duration": time.time()
        }
        
        try:
            with open("ecosystem_monitoring.json", "w") as f:
                json.dump(monitoring_data, f, indent=2)
            print("💾 Datos de monitoreo guardados en ecosystem_monitoring.json")
        except Exception as e:
            print(f"❌ Error guardando datos: {e}")
    
    async def run_continuous_monitoring(self, interval=60):
        """Ejecutar monitoreo continuo"""
        print("🚀 Iniciando monitoreo continuo del ecosistema")
        print(f"⏱️ Intervalo: {interval} segundos")
        print("💡 Presiona Ctrl+C para detener el monitoreo")
        
        cycle_count = 0
        
        try:
            while self.monitoring_active:
                cycle_count += 1
                print(f"\n🔄 Ciclo de monitoreo #{cycle_count}")
                
                # Generar reporte completo
                report = self.generate_comprehensive_report()
                
                # Guardar datos cada 10 ciclos
                if cycle_count % 10 == 0:
                    self.save_monitoring_data()
                
                # Esperar al siguiente ciclo
                await asyncio.sleep(interval)
                
        except KeyboardInterrupt:
            print("\n\n🛑 Deteniendo monitoreo...")
            self.monitoring_active = False
            self.save_monitoring_data()
            print("✅ Monitoreo detenido. Datos guardados.")

def main():
    print("🏢 DataCrypt Labs - Monitor del Ecosistema")
    print("🔄 Sistema de Monitoreo con Mejora Continua")
    print("="*60)
    
    monitor = DataCryptEcosystemMonitor()
    
    print("\n📋 Opciones:")
    print("1. Generar reporte único")
    print("2. Monitoreo continuo (60s)")
    print("3. Monitoreo continuo (30s)")
    print("4. Monitoreo continuo (10s)")
    
    choice = input("\n🔸 Selecciona una opción (1-4): ").strip()
    
    if choice == "1":
        print("\n📊 Generando reporte único...")
        report = monitor.generate_comprehensive_report()
        monitor.save_monitoring_data()
        
    elif choice == "2":
        asyncio.run(monitor.run_continuous_monitoring(60))
        
    elif choice == "3":
        asyncio.run(monitor.run_continuous_monitoring(30))
        
    elif choice == "4":
        asyncio.run(monitor.run_continuous_monitoring(10))
        
    else:
        print("❌ Opción no válida")
        return
    
    print("\n🎯 Monitoreo completado")

if __name__ == "__main__":
    main()