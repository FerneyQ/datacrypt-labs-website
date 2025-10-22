# 🚀 DataCrypt Labs - Railway Deployment Guide

## 🎯 Sistema Optimizado v3.1 - Listo para Railway

### ✅ Archivos de Configuración Incluidos

- `railway.toml` - Configuración principal de Railway
- `requirements-railway.txt` - Dependencias optimizadas para producción
- `Procfile` - Comando de inicio para Railway
- `nixpacks.toml` - Configuración de build
- `main_admin.py` - Aplicación principal con soporte para Railway

### 🔧 Configuración Automática

El sistema está configurado para:
- ✅ Usar variable de entorno `PORT` de Railway
- ✅ Health check en `/api/health`
- ✅ Detección automática de entorno (desarrollo/producción)
- ✅ Logging optimizado para Railway
- ✅ Panel administrativo completo disponible

### 🌐 URLs Disponibles (Post-Deploy)

```
https://tu-dominio.railway.app/              # Página principal
https://tu-dominio.railway.app/api/docs      # Documentación API
https://tu-dominio.railway.app/api/health    # Health check
https://tu-dominio.railway.app/admin/dashboard  # Panel admin
https://tu-dominio.railway.app/admin/login   # Login admin
```

### 🔐 Credenciales de Administrador

**Por defecto (cambiar en producción):**
- Usuario: `admin`
- Password: `datacrypt2025`

### 🚀 Pasos para Deploy en Railway

1. **Conectar Repositorio:**
   - Ve a Railway Dashboard
   - Conecta tu repositorio GitHub: `FerneyQ/datacrypt-labs-website`

2. **Configurar Variables de Entorno (Opcional):**
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=tu_password_seguro
   FASTAPI_ENV=production
   ```

3. **Deploy Automático:**
   - Railway detectará automáticamente la configuración
   - El build usará `requirements-railway.txt`
   - La aplicación iniciará con `main_admin.py`

4. **Generar Dominio:**
   - Railway asignará automáticamente un dominio
   - Formato: `https://datacrypt-labs-[hash].railway.app`

### 📊 Funcionalidades Incluidas

#### 🎛️ **Panel Administrativo Completo:**
- Control de servidor (conectar/desconectar)
- Métricas en tiempo real (CPU, memoria, disco)
- Dashboard responsive
- Logs del sistema
- Auto-refresh cada 30 segundos

#### 🚀 **API Backend:**
- FastAPI con documentación automática
- Endpoints de sistema y salud
- CORS configurado para producción
- Servicio de archivos estáticos

#### 🔐 **Seguridad:**
- Autenticación HTTP básica
- Protección de endpoints administrativos
- Headers de seguridad configurados

### 🔍 Health Check

Railway verificará automáticamente la salud de la aplicación en:
```
GET /api/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "service": "DataCrypt Labs Sistema Completo",
  "version": "2.0.0",
  "timestamp": "2025-10-22T...",
  "uptime": "running",
  "admin_panel": "available"
}
```

### ⚡ Performance Optimizado

- **Dependencias mínimas:** Solo las necesarias para producción
- **Sistema consolidado:** Una sola aplicación vs múltiples módulos
- **Monitoring integrado:** psutil para métricas del sistema
- **Carga rápida:** Arquitectura optimizada v3.1

### 🚨 Troubleshooting

**Si el deploy falla:**

1. **Verificar logs de Railway** en el dashboard
2. **Comprobar requirements-railway.txt** - todas las dependencias disponibles
3. **Validar variables de entorno** si se configuraron custom
4. **Health check endpoint** debe responder correctamente

**Problemas comunes:**
- Puerto: La aplicación usa automáticamente `$PORT` de Railway
- Build: Railway usa `nixpacks` para detectar Python automáticamente
- Start: El comando está definido en `Procfile`

### 📱 Acceso Post-Deploy

Una vez deployado exitosamente:

1. **Panel Admin:** Accede a `/admin/dashboard`
2. **Login:** Usa las credenciales configuradas
3. **API:** Explora la documentación en `/api/docs`
4. **Monitoreo:** Verifica métricas en el dashboard admin

### ✅ Sistema Listo

El código está optimizado y configurado para Railway. ¡Solo conecta el repositorio y obtendrás tu dominio automáticamente!

---

*Configuración Railway para DataCrypt Labs v3.1*  
*Sistema Optimizado - Panel Administrativo Avanzado*  
*Deploy Ready - Octubre 2025*