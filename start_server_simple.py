"""
DATACRYPT LABS - SERVIDOR LOCAL SIMPLIFICADO
Archivo de inicio sin problemas de codificacion
"""

import sys
import os
from pathlib import Path

# Configurar PYTHONPATH
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))
os.environ['PYTHONPATH'] = str(project_root)

print("=" * 50)
print("   DATACRYPT LABS - SERVIDOR LOCAL")
print("=" * 50)
print(f"PYTHONPATH: {project_root}")
print("URL Local: http://127.0.0.1:8000")
print("GitHub Pages: https://ferneyq.github.io/datacrypt-labs-website/")
print("Presiona CTRL+C para detener")
print("=" * 50)

# Importar y ejecutar
try:
    import uvicorn
    from backend.main_new import app
    
    # Configurar uvicorn sin logs complejos
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )
    
except Exception as e:
    print(f"Error: {e}")
    print("Intentando con main.py...")
    
    try:
        from backend.main import app
        uvicorn.run(
            app,
            host="127.0.0.1", 
            port=8000,
            reload=False,
            log_level="info"
        )
    except Exception as e2:
        print(f"Error con main.py: {e2}")