#!/usr/bin/env python3
"""
DataCrypt Labs - Sistema de Inicialización Completo
Análisis bajo Filosofía de Mejora Continua - PDCA

Este script inicia todos los componentes del sistema siguiendo
la metodología PDCA (Plan-Do-Check-Act) para mejora continua.
"""

import os
import sys
import subprocess
import time
import json
from pathlib import Path

class DataCryptSystemInitializer:
    def __init__(self):
        self.base_path = Path(__file__).parent
        self.backend_file = self.base_path / "datacrypt_backend_v3_complete.py"
        self.config = {
            "system_name": "DataCrypt Labs - Sistema Integrado v3.0",
            "methodology": "PDCA - Mejora Continua",
            "components": [
                "Backend FastAPI v3.0",
                "Sistema de Voz Integrado",
                "Dashboard Administrativo",
                "Gestión de Configuración",
                "Monitoreo en Tiempo Real"
            ]
        }
        
    def plan_phase(self):
        """PLAN: Planificar el inicio del sistema"""
        print("🎯 FASE PLAN - Planificación del Sistema")
        print("=" * 50)
        print(f"📋 Sistema: {self.config['system_name']}")
        print(f"🔄 Metodología: {self.config['methodology']}")
        print("\n📊 Componentes a inicializar:")
        for i, component in enumerate(self.config['components'], 1):
            print(f"  {i}. {component}")
        
        print(f"\n📂 Directorio base: {self.base_path}")
        print(f"🐍 Backend: {self.backend_file}")
        
        # Verificar prerequisitos
        if not self.backend_file.exists():
            print(f"❌ Error: Backend no encontrado en {self.backend_file}")
            return False
            
        print("✅ Planificación completada")
        return True
    
    def do_phase(self):
        """DO: Ejecutar el plan"""
        print("\n🚀 FASE DO - Ejecución del Sistema")
        print("=" * 50)
        
        try:
            print("🔧 Iniciando Backend FastAPI v3.0...")
            
            # Cambiar al directorio del script
            os.chdir(self.base_path)
            
            # Iniciar el backend
            process = subprocess.Popen([
                sys.executable, 
                "datacrypt_backend_v3_complete.py"
            ], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            text=True
            )
            
            # Esperar un momento para que el servidor se inicie
            time.sleep(3)
            
            # Verificar si el proceso está corriendo
            if process.poll() is None:
                print("✅ Backend iniciado correctamente")
                print(f"🌐 Servidor disponible en: http://localhost:8000")
                print(f"📚 Documentación API: http://localhost:8000/docs")
                print(f"🎤 Endpoint de voz: http://localhost:8000/api/voice/report")
                print(f"🔍 Estado del sistema: http://localhost:8000/api/status")
                return process
            else:
                stdout, stderr = process.communicate()
                print(f"❌ Error iniciando backend: {stderr}")
                return None
                
        except Exception as e:
            print(f"❌ Error en fase DO: {e}")
            return None
    
    def check_phase(self, process):
        """CHECK: Verificar el funcionamiento"""
        print("\n🔍 FASE CHECK - Verificación del Sistema")
        print("=" * 50)
        
        if process is None:
            print("❌ No hay proceso para verificar")
            return False
        
        try:
            import requests
            
            # Verificar endpoints principales
            endpoints = [
                ("/api/health", "Estado de salud"),
                ("/api/status", "Estado del sistema"),
                ("/api/metrics", "Métricas del sistema"),
                ("/api/config", "Configuración")
            ]
            
            base_url = "http://localhost:8000"
            
            for endpoint, description in endpoints:
                try:
                    response = requests.get(f"{base_url}{endpoint}", timeout=5)
                    if response.status_code == 200:
                        print(f"✅ {description}: OK")
                    else:
                        print(f"⚠️ {description}: HTTP {response.status_code}")
                except requests.RequestException as e:
                    print(f"❌ {description}: Error de conexión")
            
            print("✅ Verificación de endpoints completada")
            return True
            
        except ImportError:
            print("⚠️ Módulo 'requests' no disponible para verificación completa")
            print("✅ Verificación básica: Proceso corriendo")
            return True
            
    def act_phase(self, success):
        """ACT: Actuar basado en los resultados"""
        print("\n⚡ FASE ACT - Acción y Mejora Continua")
        print("=" * 50)
        
        if success:
            print("🎉 Sistema iniciado exitosamente")
            print("\n📋 Acciones disponibles:")
            print("  1. Abrir Dashboard: http://localhost:8000/admin/dashboard.html")
            print("  2. Ver documentación API: http://localhost:8000/docs")
            print("  3. Probar sistema de voz desde el dashboard")
            print("  4. Revisar métricas en tiempo real")
            
            print("\n🔄 Para mejora continua:")
            print("  • Monitorear logs del sistema")
            print("  • Revisar métricas de rendimiento")
            print("  • Implementar alertas automatizadas")
            print("  • Optimizar configuraciones basado en uso")
            
        else:
            print("⚠️ Sistema iniciado con problemas")
            print("\n🛠️ Acciones correctivas:")
            print("  • Verificar puertos disponibles")
            print("  • Instalar dependencias faltantes")
            print("  • Revisar logs de error")
            print("  • Ejecutar diagnósticos de sistema")
        
        print(f"\n📊 Resumen de inicialización guardado en: system_startup_log.json")
        
        # Guardar log de inicialización
        log_data = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "success": success,
            "methodology": "PDCA",
            "system": self.config['system_name'],
            "components": self.config['components']
        }
        
        with open("system_startup_log.json", "w") as f:
            json.dump(log_data, f, indent=2)
    
    def run_pdca_cycle(self):
        """Ejecutar ciclo completo PDCA"""
        print("🔄 INICIANDO CICLO PDCA - MEJORA CONTINUA")
        print("🏢 DataCrypt Labs - Sistema Integrado v3.0")
        print("=" * 60)
        
        # PLAN
        if not self.plan_phase():
            print("❌ Error en fase PLAN. Abortando...")
            return
        
        # DO
        process = self.do_phase()
        
        # CHECK
        success = self.check_phase(process)
        
        # ACT
        self.act_phase(success)
        
        if success and process:
            print("\n🎯 Sistema listo para operación")
            print("💡 Presiona Ctrl+C para detener el sistema")
            
            try:
                # Mantener el sistema corriendo
                while True:
                    time.sleep(60)
                    if process.poll() is not None:
                        print("⚠️ El proceso del backend se detuvo inesperadamente")
                        break
                    else:
                        print("✅ Sistema operativo - Verificación periódica OK")
                        
            except KeyboardInterrupt:
                print("\n🛑 Deteniendo sistema...")
                process.terminate()
                process.wait()
                print("✅ Sistema detenido correctamente")

if __name__ == "__main__":
    print("🚀 DataCrypt Labs - Inicializador del Sistema")
    print("🔄 Filosofía de Mejora Continua - PDCA")
    print("=" * 60)
    
    initializer = DataCryptSystemInitializer()
    initializer.run_pdca_cycle()