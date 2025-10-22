#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧪 TESTING MANUAL PASO A PASO - Sistema Administrativo JWT
==========================================================
Vamos a hacer un testing manual con tu ayuda para ver exactamente qué está pasando.
"""

import time
import subprocess
import sys

def print_header(title):
    print("\n" + "="*70)
    print(f"🧪 {title}")
    print("="*70)

def test_manual():
    print("🚀 TESTING MANUAL DEL SISTEMA ADMINISTRATIVO JWT")
    print("📅 Fecha:", time.strftime("%Y-%m-%d %H:%M:%S"))
    
    # Paso 1: Verificar procesos de Python
    print_header("PASO 1: VERIFICAR PROCESOS ACTIVOS")
    try:
        result = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq python.exe'], 
                               capture_output=True, text=True, shell=True)
        python_processes = result.stdout
        print("🔍 Procesos de Python ejecutándose:")
        if "python.exe" in python_processes:
            print("✅ Hay procesos de Python activos")
            lines = [line for line in python_processes.split('\n') if 'python.exe' in line]
            for line in lines[:3]:  # Mostrar máximo 3 líneas
                print(f"   📋 {line.strip()}")
        else:
            print("❌ No hay procesos de Python ejecutándose")
    except Exception as e:
        print(f"⚠️ Error verificando procesos: {e}")
    
    # Paso 2: Test básico de conectividad
    print_header("PASO 2: TEST DE CONECTIVIDAD BÁSICO")
    
    print("🔍 Vamos a probar conectividad en diferentes puertos...")
    
    import socket
    
    ports_to_test = [5000, 8000, 3000]
    for port in ports_to_test:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            
            if result == 0:
                print(f"✅ Puerto {port}: ABIERTO - ¡Hay algo ejecutándose aquí!")
            else:
                print(f"❌ Puerto {port}: CERRADO")
                
        except Exception as e:
            print(f"⚠️ Error probando puerto {port}: {e}")
    
    # Paso 3: Información de red
    print_header("PASO 3: INFORMACIÓN DE RED")
    
    try:
        result = subprocess.run(['netstat', '-an'], capture_output=True, text=True, shell=True)
        netstat_output = result.stdout
        
        listening_ports = [line for line in netstat_output.split('\n') 
                          if ':5000 ' in line and 'LISTENING' in line]
        
        if listening_ports:
            print("✅ Puerto 5000 está en modo LISTENING:")
            for port_line in listening_ports[:2]:
                print(f"   🌐 {port_line.strip()}")
        else:
            print("❌ Puerto 5000 NO está en modo LISTENING")
            print("🔍 Buscando otros puertos Flask comunes:")
            for common_port in ['5000', '8000', '3000']:
                common_listening = [line for line in netstat_output.split('\n') 
                                  if f':{common_port} ' in line and 'LISTENING' in line]
                if common_listening:
                    print(f"   ✅ Puerto {common_port} activo: {common_listening[0].strip()}")
                    
    except Exception as e:
        print(f"⚠️ Error en netstat: {e}")
    
    # Paso 4: Testing directo con requests
    print_header("PASO 4: TEST DIRECTO DE HTTP")
    
    print("🔄 Instalando requests si es necesario...")
    try:
        import requests
        print("✅ Requests disponible")
    except ImportError:
        print("⚠️ Instalando requests...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'requests'], check=True)
        import requests
        print("✅ Requests instalado")
    
    # Probar diferentes URLs
    test_urls = [
        'http://localhost:5000',
        'http://localhost:5000/admin',
        'http://127.0.0.1:5000',
        'http://127.0.0.1:5000/admin'
    ]
    
    for url in test_urls:
        try:
            print(f"\n🔍 Probando: {url}")
            response = requests.get(url, timeout=5)
            print(f"✅ Status: {response.status_code}")
            
            if response.status_code == 200:
                content_preview = response.text[:200].replace('\n', ' ')
                print(f"📄 Contenido: {content_preview}...")
                
                # Verificar si es HTML
                if '<html' in response.text.lower() or '<!doctype' in response.text.lower():
                    print("✅ Respuesta es HTML válido")
                else:
                    print("⚠️ Respuesta no parece HTML")
                    
        except requests.exceptions.ConnectionError:
            print(f"❌ No se puede conectar a {url}")
        except requests.exceptions.Timeout:
            print(f"⏰ Timeout conectando a {url}")
        except Exception as e:
            print(f"⚠️ Error: {e}")
    
    print_header("RESUMEN DEL DIAGNÓSTICO")
    print("📊 Basándose en estos resultados, podemos determinar:")
    print("   1. Si hay procesos de Flask ejecutándose")
    print("   2. Si los puertos están abiertos")
    print("   3. Si el servidor responde a HTTP")
    print("   4. Qué URL específica funciona")
    
    print("\n💡 SIGUIENTE PASO:")
    print("   Basándome en estos resultados, puedo ajustar el testing")
    print("   para usar la configuración correcta de tu sistema.")

if __name__ == "__main__":
    test_manual()