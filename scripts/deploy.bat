@echo off
REM 🚀 DataCrypt Labs - Windows Production Deployment Script
REM Filosofía Mejora Continua - Despliegue automatizado para Windows

echo 🚀 Iniciando despliegue de DataCrypt Labs en producción (Windows)...

REM Check if Docker Desktop is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop no está ejecutándose. Por favor, inicia Docker Desktop.
    pause
    exit /b 1
)

echo ✅ Docker Desktop detectado

REM Create necessary directories
echo ✅ Creando directorios necesarios...
if not exist "data" mkdir data
if not exist "logs" mkdir logs
if not exist "backups" mkdir backups
if not exist "ssl" mkdir ssl

REM Set production environment
set PRODUCTION=true

REM Migrate database
echo ✅ Ejecutando migración de base de datos...
python scripts/migrate_database.py
if %errorlevel% neq 0 (
    echo ❌ Error en la migración de base de datos
    pause
    exit /b 1
)

REM Build and start services
echo ✅ Construyendo imágenes Docker...
docker-compose build
if %errorlevel% neq 0 (
    echo ❌ Error construyendo imágenes
    pause
    exit /b 1
)

echo ✅ Iniciando servicios...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ❌ Error iniciando servicios
    pause
    exit /b 1
)

REM Wait for services to be ready
echo ✅ Esperando que los servicios estén listos...
timeout /t 30 /nobreak >nul

REM Health check
echo ✅ Verificando salud de los servicios...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost/health' -UseBasicParsing | Out-Null; Write-Host '✅ Aplicación desplegada correctamente!' -ForegroundColor Green } catch { Write-Host '❌ Error en el health check' -ForegroundColor Red; docker-compose logs datacrypt-api; exit 1 }"

echo.
echo 🌐 Aplicación accesible en: http://localhost
echo 📚 Documentación API: http://localhost/docs
echo 📊 Monitoreo Grafana: http://localhost:3000
echo.

REM Show running services
echo ✅ Servicios en ejecución:
docker-compose ps

echo.
echo 📋 Comandos útiles:
echo    Ver logs:           docker-compose logs -f
echo    Parar servicios:    docker-compose down
echo    Reiniciar:          docker-compose restart
echo    Backup DB:          python scripts/migrate_database.py
echo.

echo 🎉 ¡Despliegue completado exitosamente!
pause