#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔒 VERIFICADOR DE PROXY/FIREWALL - DataCrypt Labs
Verifica configuraciones que pueden estar bloqueando el acceso
"""

import subprocess
import json
import socket
import requests
from urllib.parse import urlparse

def verificar_proxy_firewall():
    """Verifica configuraciones de proxy y firewall"""
    
    print("🔒 VERIFICADOR DE PROXY/FIREWALL")
    print("=" * 50)
    
    # 1. Verificar proxy del sistema
    print("🌐 Verificando configuración de proxy...")
    try:
        result = subprocess.run(['netsh', 'winhttp', 'show', 'proxy'], 
                               capture_output=True, text=True)
        if result.returncode == 0:
            if "Configuración de proxy directa" in result.stdout:
                print("   ✅ Sin proxy configurado")
            else:
                print("   ⚠️ Proxy detectado:")
                print(f"   {result.stdout}")
    except Exception as e:
        print(f"   ❌ Error verificando proxy: {e}")
    
    # 2. Verificar firewall de Windows
    print("\n🛡️ Verificando Windows Firewall...")
    try:
        result = subprocess.run(['netsh', 'advfirewall', 'show', 'allprofiles', 'state'], 
                               capture_output=True, text=True)
        if result.returncode == 0:
            if "ACTIVADO" in result.stdout or "ON" in result.stdout:
                print("   ⚠️ Firewall activo - puede estar bloqueando conexiones locales")
            else:
                print("   ✅ Firewall no está bloqueando")
    except Exception as e:
        print(f"   ❌ Error verificando firewall: {e}")
    
    # 3. Test de conectividad local
    print("\n🔌 Probando conectividad local...")
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex(('127.0.0.1', 5000))
        sock.close()
        
        if result == 0:
            print("   ✅ Puerto 5000 accesible desde localhost")
        else:
            print("   ❌ Puerto 5000 NO accesible - posible bloqueo")
            
    except Exception as e:
        print(f"   ❌ Error probando conectividad: {e}")
    
    # 4. Test HTTP directo
    print("\n🌐 Probando acceso HTTP directo...")
    try:
        response = requests.get('http://127.0.0.1:5000/admin', timeout=10)
        print(f"   ✅ Respuesta HTTP: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Servidor responde correctamente")
        else:
            print(f"   ⚠️ Servidor responde con código: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("   ❌ Error de conexión - servidor no accesible")
    except requests.exceptions.Timeout:
        print("   ❌ Timeout - conexión muy lenta")
    except Exception as e:
        print(f"   ❌ Error HTTP: {e}")
    
    # 5. Verificar variables de entorno de proxy
    print("\n🔧 Verificando variables de entorno...")
    import os
    proxy_vars = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy']
    proxy_found = False
    
    for var in proxy_vars:
        value = os.environ.get(var)
        if value:
            print(f"   ⚠️ {var}: {value}")
            proxy_found = True
    
    if not proxy_found:
        print("   ✅ Sin variables de proxy configuradas")
    
    print("\n" + "=" * 50)
    print("🎯 RECOMENDACIONES:")
    print("1. Si hay proxy activo, configura excepción para 127.0.0.1")
    print("2. Si firewall bloquea, permite puerto 5000 para localhost")
    print("3. Reinicia VS Code si es necesario")
    print("4. Usa navegador externo como alternativa")

if __name__ == "__main__":
    verificar_proxy_firewall()