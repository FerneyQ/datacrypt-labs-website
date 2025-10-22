#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔄 ADAPTADOR PARA RAILWAY EXISTENTE
Redirecciona desde el backend actual al sistema administrativo
"""

import os
import sys

# Agregar el directorio actual al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importar y usar el servidor Railway
from servidor_railway import server

# La aplicación para uvicorn/gunicorn
app = server.app

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)