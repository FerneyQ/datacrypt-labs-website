@echo off
echo 🎛️ DATACRYPT LABS - MANAGEMENT CONSOLE LAUNCHER
echo ============================================================
echo 🚀 Iniciando servidor backend...
echo.

cd /d "%~dp0.."
start /B python admin\management_backend.py

echo ⏳ Esperando que el servidor inicie...
timeout /t 3 /nobreak > nul

echo 🌐 Abriendo consola de gestión...
start http://localhost:8000

echo.
echo ✅ CONSOLA INTERACTIVA INICIADA
echo 📡 Backend: http://localhost:8000/api
echo 🎛️ Dashboard: http://localhost:8000
echo 📋 API Docs: http://localhost:8000/docs
echo.
echo 💡 Para cerrar: Presiona Ctrl+C en la ventana del servidor
echo ============================================================
pause