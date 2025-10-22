# DATACRYPT LABS - INICIO SERVIDOR LOCAL
# Script optimizado para Windows PowerShell

Write-Host "DATACRYPT LABS - INICIANDO SERVIDOR LOCAL..." -ForegroundColor Cyan

# Configurar PYTHONPATH
$env:PYTHONPATH = "C:\mis_scripts_seguros\DataCrypt_Labs\Web-Portfolio"

Write-Host "PYTHONPATH configurado: $env:PYTHONPATH" -ForegroundColor Green

# Navegar al directorio del proyecto
Set-Location "C:\mis_scripts_seguros\DataCrypt_Labs\Web-Portfolio"

Write-Host "Iniciando servidor FastAPI..." -ForegroundColor Yellow
Write-Host "URL Local: http://127.0.0.1:8000" -ForegroundColor Magenta
Write-Host "GitHub Pages: https://ferneyq.github.io/datacrypt-labs-website/" -ForegroundColor Magenta
Write-Host "Presiona CTRL+C para detener el servidor" -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Cyan

# Iniciar servidor
.\.venv\Scripts\python.exe backend/main.py