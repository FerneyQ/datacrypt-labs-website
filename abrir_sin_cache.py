#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🌐 ABRIR NAVEGADOR SIN CACHÉ - DataCrypt Labs
Fuerza apertura del navegador sin cache para evitar problemas
"""

import webbrowser
import os
import time

def abrir_sin_cache():
    """Abre el navegador con configuraciones anti-cache"""
    
    print("🌐 ABRIENDO NAVEGADOR SIN CACHÉ")
    print("=" * 40)
    
    # URL con parámetros anti-cache
    timestamp = int(time.time())
    url_sin_cache = f"http://127.0.0.1:5000/admin?nocache={timestamp}&refresh=true"
    
    print(f"🎯 URL: {url_sin_cache}")
    print("🔄 Forzando recarga sin caché...")
    
    try:
        # Abrir en navegador predeterminado
        webbrowser.open(url_sin_cache)
        print("✅ Navegador abierto exitosamente")
        
        # También mostrar instrucciones para VS Code
        print("\n📋 INSTRUCCIONES ADICIONALES:")
        print("1. En VS Code, presiona Ctrl+Shift+P")
        print("2. Busca 'Simple Browser: Show'")
        print("3. Pega esta URL:")
        print(f"   {url_sin_cache}")
        print("4. O usa Ctrl+F5 para forzar recarga")
        
    except Exception as e:
        print(f"❌ Error al abrir navegador: {e}")
        print("🔧 Usa la URL manualmente:")
        print(f"   {url_sin_cache}")

if __name__ == "__main__":
    abrir_sin_cache()