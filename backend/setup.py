#!/usr/bin/env python3
"""
🐍 DATACRYPT LABS - PYTHON BACKEND SETUP v2.2
Script de configuración automática para el backend Python

Filosofía Mejora Continua v2.2:
- Setup automático de entorno virtual
- Instalación de dependencias
- Verificación de funcionalidades
- Configuración de base de datos
"""

import subprocess
import sys
import os
import venv
from pathlib import Path

def print_banner():
    """Mostrar banner de DataCrypt Labs"""
    banner = """
    ╔══════════════════════════════════════════════════════════════╗
    ║                    🐍 DATACRYPT LABS 🐍                     ║
    ║                  Python Backend Setup v2.2                  ║
    ║              Filosofía Mejora Continua en acción            ║
    ╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)

def check_python_version():
    """Verificar versión de Python"""
    print("🔍 Verificando versión de Python...")
    
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8+ requerido")
        print(f"   Versión actual: {sys.version}")
        sys.exit(1)
    
    print(f"✅ Python {sys.version.split()[0]} detectado")

def create_virtual_environment():
    """Crear entorno virtual"""
    venv_path = Path("venv")
    
    if venv_path.exists():
        print("✅ Entorno virtual ya existe")
        return venv_path
    
    print("🔧 Creando entorno virtual...")
    try:
        venv.create(venv_path, with_pip=True)
        print("✅ Entorno virtual creado exitosamente")
        return venv_path
    except Exception as e:
        print(f"❌ Error creando entorno virtual: {e}")
        sys.exit(1)

def get_pip_path(venv_path):
    """Obtener ruta del pip del entorno virtual"""
    if os.name == 'nt':  # Windows
        return venv_path / "Scripts" / "pip.exe"
    else:  # Unix/Linux/macOS
        return venv_path / "bin" / "pip"

def get_python_path(venv_path):
    """Obtener ruta del python del entorno virtual"""
    if os.name == 'nt':  # Windows
        return venv_path / "Scripts" / "python.exe"
    else:  # Unix/Linux/macOS
        return venv_path / "bin" / "python"

def install_dependencies(venv_path):
    """Instalar dependencias de requirements.txt"""
    print("📦 Instalando dependencias de Python...")
    
    pip_path = get_pip_path(venv_path)
    requirements_file = Path("requirements.txt")
    
    if not requirements_file.exists():
        print("❌ Archivo requirements.txt no encontrado")
        sys.exit(1)
    
    try:
        # Actualizar pip primero
        subprocess.run([str(pip_path), "install", "--upgrade", "pip"], check=True)
        
        # Instalar dependencias
        subprocess.run([str(pip_path), "install", "-r", str(requirements_file)], check=True)
        
        print("✅ Dependencias instaladas exitosamente")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error instalando dependencias: {e}")
        print("💡 Intenta instalar manualmente con:")
        print(f"   {pip_path} install -r requirements.txt")
        sys.exit(1)

def verify_installation(venv_path):
    """Verificar que las librerías principales funcionan"""
    print("🧪 Verificando instalación...")
    
    python_path = get_python_path(venv_path)
    
    test_script = """
import sys
print(f"Python: {sys.version.split()[0]}")

try:
    import fastapi
    print(f"✅ FastAPI: {fastapi.__version__}")
except ImportError:
    print("❌ FastAPI no disponible")

try:
    import pandas as pd
    print(f"✅ Pandas: {pd.__version__}")
except ImportError:
    print("❌ Pandas no disponible")

try:
    import numpy as np
    print(f"✅ NumPy: {np.__version__}")
except ImportError:
    print("❌ NumPy no disponible")

try:
    import sklearn
    print(f"✅ Scikit-learn: {sklearn.__version__}")
except ImportError:
    print("❌ Scikit-learn no disponible")

try:
    import matplotlib
    print(f"✅ Matplotlib: {matplotlib.__version__}")
except ImportError:
    print("❌ Matplotlib no disponible")

print("🎉 Verificación completada!")
"""
    
    try:
        result = subprocess.run([str(python_path), "-c", test_script], 
                              capture_output=True, text=True, check=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en verificación: {e}")
        print("stdout:", e.stdout)
        print("stderr:", e.stderr)

def create_startup_script():
    """Crear script de inicio del servidor"""
    if os.name == 'nt':  # Windows
        startup_script = """@echo off
echo 🚀 Iniciando DataCrypt Labs Backend...
call venv\\Scripts\\activate
python main.py
pause
"""
        script_name = "start_server.bat"
    else:  # Unix/Linux/macOS
        startup_script = """#!/bin/bash
echo "🚀 Iniciando DataCrypt Labs Backend..."
source venv/bin/activate
python main.py
"""
        script_name = "start_server.sh"
    
    with open(script_name, "w") as f:
        f.write(startup_script)
    
    if os.name != 'nt':
        os.chmod(script_name, 0o755)  # Hacer ejecutable en Unix
    
    print(f"✅ Script de inicio creado: {script_name}")

def show_usage_instructions():
    """Mostrar instrucciones de uso"""
    instructions = """
    🎉 ¡SETUP COMPLETADO EXITOSAMENTE!
    
    📋 INSTRUCCIONES DE USO:
    
    1️⃣ Para iniciar el servidor:
       • Windows: Ejecuta 'start_server.bat'
       • Linux/Mac: Ejecuta './start_server.sh'
       • Manual: 
         - Activa entorno: venv\\Scripts\\activate (Windows) o source venv/bin/activate (Unix)
         - Ejecuta: python main.py
    
    2️⃣ API estará disponible en:
       • http://localhost:8000 (API endpoints)
       • http://localhost:8000/api/docs (Documentación interactiva)
    
    3️⃣ Endpoints principales:
       • GET /api/portfolio/stats - Estadísticas del portfolio
       • POST /api/analytics/generate - Análisis de datos
       • POST /api/ml/predict - Predicciones ML
       • GET /api/crypto/prices - Precios crypto en tiempo real
       • POST /api/python/execute - Ejecutor de código Python
    
    4️⃣ Para conectar con el frontend:
       • El backend acepta requests CORS desde cualquier origen
       • Usar fetch() desde JavaScript para consumir la API
    
    🐍 ¡Python Backend funcional y listo para Data Science!
    
    """
    print(instructions)

def main():
    """Función principal del setup"""
    print_banner()
    
    # Cambiar al directorio del backend
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print(f"📁 Directorio de trabajo: {os.getcwd()}")
    
    # Ejecutar pasos del setup
    check_python_version()
    venv_path = create_virtual_environment()
    install_dependencies(venv_path)
    verify_installation(venv_path)
    create_startup_script()
    show_usage_instructions()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n❌ Setup cancelado por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        sys.exit(1)