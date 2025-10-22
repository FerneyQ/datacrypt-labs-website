#!/usr/bin/env python3
"""
DataCrypt Labs - Diagnóstico Rápido del Sistema
Script para verificar el estado completo del ecosistema
"""

import os
import sys
import json
import subprocess
from pathlib import Path
import time

class SystemDiagnostics:
    def __init__(self):
        self.base_path = Path(__file__).parent
        self.results = {
            "system_info": {},
            "files_check": {},
            "dependencies": {},
            "services": {},
            "recommendations": []
        }
    
    def check_python_version(self):
        """Verificar versión de Python"""
        version = sys.version_info
        self.results["system_info"]["python_version"] = f"{version.major}.{version.minor}.{version.micro}"
        
        if version.major >= 3 and version.minor >= 7:
            print(f"✅ Python {self.results['system_info']['python_version']} - Compatible")
            return True
        else:
            print(f"❌ Python {self.results['system_info']['python_version']} - Requiere Python 3.7+")
            self.results["recommendations"].append("Actualizar Python a versión 3.7 o superior")
            return False
    
    def check_required_files(self):
        """Verificar archivos requeridos del sistema"""
        required_files = {
            "datacrypt_backend_v3_complete.py": "Backend principal",
            "admin/dashboard.html": "Dashboard administrativo",
            "index.html": "Página principal",
            "voice_test.html": "Página de prueba de voz"
        }
        
        print("\n📁 Verificando archivos del sistema...")
        all_present = True
        
        for file_path, description in required_files.items():
            full_path = self.base_path / file_path
            exists = full_path.exists()
            
            self.results["files_check"][file_path] = {
                "exists": exists,
                "description": description,
                "path": str(full_path)
            }
            
            status = "✅" if exists else "❌"
            print(f"{status} {description}: {file_path}")
            
            if not exists:
                all_present = False
                self.results["recommendations"].append(f"Crear archivo faltante: {file_path}")
        
        return all_present
    
    def check_dependencies(self):
        """Verificar dependencias opcionales"""
        optional_deps = {
            "fastapi": "Framework web principal",
            "uvicorn": "Servidor ASGI",
            "psutil": "Métricas del sistema",
            "requests": "Cliente HTTP"
        }
        
        print("\n📦 Verificando dependencias...")
        
        for module, description in optional_deps.items():
            try:
                __import__(module)
                print(f"✅ {description}: {module} disponible")
                self.results["dependencies"][module] = {"available": True, "description": description}
            except ImportError:
                print(f"⚠️ {description}: {module} no disponible (opcional)")
                self.results["dependencies"][module] = {"available": False, "description": description}
                if module in ["fastapi", "uvicorn"]:
                    self.results["recommendations"].append(f"Instalar dependencia: pip install {module}")
    
    def check_ports(self):
        """Verificar disponibilidad de puertos"""
        import socket
        
        ports_to_check = [8000, 8001]
        print("\n🔌 Verificando puertos...")
        
        for port in ports_to_check:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            
            try:
                result = sock.connect_ex(('localhost', port))
                if result == 0:
                    print(f"🟠 Puerto {port}: En uso")
                    self.results["services"][f"port_{port}"] = {"status": "in_use", "available": False}
                else:
                    print(f"✅ Puerto {port}: Disponible")
                    self.results["services"][f"port_{port}"] = {"status": "available", "available": True}
            except Exception as e:
                print(f"❌ Puerto {port}: Error verificando - {e}")
                self.results["services"][f"port_{port}"] = {"status": "error", "available": False}
            finally:
                sock.close()
    
    def test_backend_startup(self):
        """Probar inicio del backend"""
        backend_file = self.base_path / "datacrypt_backend_v3_complete.py"
        
        if not backend_file.exists():
            print("\n❌ Backend no encontrado, saltando prueba de inicio")
            return False
        
        print("\n🚀 Probando inicio del backend...")
        
        try:
            # Intentar ejecutar el backend por un momento
            process = subprocess.Popen([
                sys.executable, str(backend_file)
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            
            # Esperar un poco para ver si se inicia
            time.sleep(2)
            
            if process.poll() is None:
                print("✅ Backend se inicia correctamente")
                self.results["services"]["backend_startup"] = {"status": "success", "available": True}
                
                # Terminar el proceso
                process.terminate()
                process.wait(timeout=5)
                return True
            else:
                stdout, stderr = process.communicate()
                print(f"❌ Backend falló al iniciar: {stderr[:200]}...")
                self.results["services"]["backend_startup"] = {"status": "failed", "error": stderr[:200]}
                return False
                
        except Exception as e:
            print(f"❌ Error probando backend: {e}")
            self.results["services"]["backend_startup"] = {"status": "error", "error": str(e)}
            return False
    
    def check_system_resources(self):
        """Verificar recursos del sistema"""
        print("\n💾 Verificando recursos del sistema...")
        
        try:
            import psutil
            
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            self.results["system_info"]["resources"] = {
                "cpu_usage": cpu_percent,
                "memory_usage": memory.percent,
                "memory_total_gb": memory.total // (1024**3),
                "disk_usage": disk.percent,
                "disk_total_gb": disk.total // (1024**3)
            }
            
            print(f"✅ CPU: {cpu_percent:.1f}%")
            print(f"✅ Memoria: {memory.percent:.1f}% ({memory.total // (1024**3)}GB total)")
            print(f"✅ Disco: {disk.percent:.1f}% ({disk.total // (1024**3)}GB total)")
            
            # Verificar si hay recursos suficientes
            if cpu_percent > 80:
                self.results["recommendations"].append("Alto uso de CPU detectado")
            if memory.percent > 80:
                self.results["recommendations"].append("Alto uso de memoria detectado")
            if disk.percent > 90:
                self.results["recommendations"].append("Poco espacio en disco disponible")
            
            return True
            
        except ImportError:
            print("⚠️ psutil no disponible, saltando verificación de recursos")
            self.results["recommendations"].append("Instalar psutil para monitoreo de recursos: pip install psutil")
            return False
        except Exception as e:
            print(f"❌ Error verificando recursos: {e}")
            return False
    
    def generate_configuration_template(self):
        """Generar template de configuración"""
        config_template = {
            "server": {
                "host": "localhost",
                "port": 8000,
                "debug": False
            },
            "voice": {
                "enabled": True,
                "speed": 1.0,
                "pitch": 1.0,
                "language": "es"
            },
            "security": {
                "scan_interval": 300,
                "threat_threshold": "medium"
            },
            "monitoring": {
                "metrics_interval": 60,
                "alert_retention": 100
            }
        }
        
        config_file = self.base_path / "config.json"
        if not config_file.exists():
            try:
                with open(config_file, "w") as f:
                    json.dump(config_template, f, indent=2)
                print(f"✅ Archivo de configuración creado: {config_file}")
                self.results["files_check"]["config.json"] = {"exists": True, "created": True}
            except Exception as e:
                print(f"❌ Error creando configuración: {e}")
                self.results["recommendations"].append("Crear manualmente el archivo config.json")
    
    def run_full_diagnostics(self):
        """Ejecutar diagnósticos completos"""
        print("🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA DataCrypt Labs")
        print("=" * 60)
        
        # Verificaciones básicas
        python_ok = self.check_python_version()
        files_ok = self.check_required_files()
        self.check_dependencies()
        self.check_ports()
        
        # Generar configuración si no existe
        self.generate_configuration_template()
        
        # Verificaciones de sistema
        self.check_system_resources()
        
        # Probar backend
        backend_ok = self.test_backend_startup()
        
        # Resumen
        print("\n" + "=" * 60)
        print("📊 RESUMEN DEL DIAGNÓSTICO")
        print("=" * 60)
        
        overall_status = python_ok and files_ok and backend_ok
        
        if overall_status:
            print("🎉 SISTEMA LISTO PARA OPERAR")
            print("✅ Todos los componentes verificados correctamente")
            print("\n🚀 Para iniciar el sistema:")
            print("   python start_system.py")
            print("\n📊 Para monitoreo:")
            print("   python ecosystem_monitor.py")
        else:
            print("⚠️ SISTEMA REQUIERE ATENCIÓN")
            print("❌ Algunos componentes necesitan configuración")
            
            if self.results["recommendations"]:
                print("\n📋 RECOMENDACIONES:")
                for i, rec in enumerate(self.results["recommendations"], 1):
                    print(f"   {i}. {rec}")
        
        # Guardar resultados
        try:
            with open("system_diagnostics.json", "w") as f:
                json.dump(self.results, f, indent=2)
            print(f"\n💾 Resultados guardados en: system_diagnostics.json")
        except Exception as e:
            print(f"❌ Error guardando resultados: {e}")
        
        print("\n" + "=" * 60)
        return overall_status

def main():
    print("🏢 DataCrypt Labs - Diagnóstico del Sistema")
    print("🔄 Verificación completa del ecosistema")
    print("=" * 60)
    
    diagnostics = SystemDiagnostics()
    success = diagnostics.run_full_diagnostics()
    
    if success:
        print("✨ El sistema está listo para su uso")
        return 0
    else:
        print("🔧 Revise las recomendaciones antes de continuar")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)