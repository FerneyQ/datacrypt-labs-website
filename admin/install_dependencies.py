"""
🔧 INSTALLER - DataCrypt Labs Management Console
Instalador automático de dependencias Python
"""

import subprocess
import sys
import os

def install_package(package):
    """Instalar paquete de Python"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ {package} instalado correctamente")
        return True
    except subprocess.CalledProcessError:
        print(f"❌ Error instalando {package}")
        return False

def main():
    print("🎛️ DATACRYPT LABS - MANAGEMENT CONSOLE INSTALLER")
    print("=" * 60)
    print("🔧 Instalando dependencias Python...")
    print()
    
    # Lista de paquetes requeridos
    required_packages = [
        "fastapi",
        "uvicorn[standard]", 
        "requests",
        "psutil",
        "python-multipart"
    ]
    
    success_count = 0
    
    for package in required_packages:
        print(f"📦 Instalando {package}...")
        if install_package(package):
            success_count += 1
        print()
    
    print("=" * 60)
    print(f"📊 RESULTADO: {success_count}/{len(required_packages)} paquetes instalados")
    
    if success_count == len(required_packages):
        print("✅ INSTALACIÓN COMPLETADA EXITOSAMENTE")
        print()
        print("🚀 INSTRUCCIONES DE USO:")
        print("1. Ejecuta: python admin/management_backend.py")
        print("2. Abre: http://localhost:8000")
        print("3. ¡Disfruta tu consola interactiva!")
    else:
        print("⚠️ INSTALACIÓN INCOMPLETA")
        print("Algunos paquetes fallaron. Inténtalo manualmente:")
        for package in required_packages:
            print(f"   pip install {package}")
    
    print("=" * 60)

if __name__ == "__main__":
    main()