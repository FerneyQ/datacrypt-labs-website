# DATACRYPT LABS - INICIO SIMPLE
# Script sin emojis para evitar problemas de codificacion

Write-Host "=====================================" -ForegroundColor Green
Write-Host "   DATACRYPT LABS - SERVIDOR LOCAL  " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Configurar PYTHONPATH
$env:PYTHONPATH = "C:\mis_scripts_seguros\DataCrypt_Labs\Web-Portfolio"
Write-Host "PYTHONPATH configurado correctamente" -ForegroundColor Yellow

# Navegar al directorio
Set-Location "C:\mis_scripts_seguros\DataCrypt_Labs\Web-Portfolio"

Write-Host ""
Write-Host "URLs DISPONIBLES:" -ForegroundColor Magenta
Write-Host "  Local Backend:  http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  GitHub Pages:   https://ferneyq.github.io/datacrypt-labs-website/" -ForegroundColor White
Write-Host ""
Write-Host "Iniciando servidor FastAPI..." -ForegroundColor Green
Write-Host "Presiona CTRL+C para detener" -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Green

# Iniciar servidor con configuracion simple
$env:PYTHONIOENCODING = "utf-8"
.\.venv\Scripts\python.exe -c "
import os
os.environ['PYTHONPATH'] = r'C:\mis_scripts_seguros\DataCrypt_Labs\Web-Portfolio'
exec(open('backend/main.py').read())
"