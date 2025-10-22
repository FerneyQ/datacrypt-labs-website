# 🚀 DataCrypt Labs - Sitio Web Corporativo & Sistema Administrativo

> Portfolio empresarial moderno con backend Python integrado y sistema de administración localhost-only

![DataCrypt_Labs](Material%20visual/Identidad.JPG)

## 🎯 Sistema Actual - Octubre 2025

### 🏗️ **Arquitectura Híbrida**
- **Frontend**: GitHub Pages (Static Website)
- **Backend**: FastAPI Python (localhost:8000)
- **Admin Panel**: Integración localhost-only
- **Base de Datos**: SQLite con 15 tablas optimizadas

### 🔒 **Seguridad localhost-only**
- ✅ Admin panel solo funciona en servidor local
- ✅ Verificación automática de servidor cada 30 segundos
- ✅ Botones auto-deshabilitados sin conexión local
- ✅ Mensajes claros de restricción

---

## 🌐 **URLs del Sistema**

### 📱 **Sitio Web Público**
- **GitHub Pages**: https://ferneyq.github.io/datacrypt-labs-website/
- **Estado**: ✅ LIVE - Actualización automática

### 🎛️ **Panel Administrativo (localhost-only)**
- **Consola Estática**: `admin/dashboard.html` (GitHub Pages)
- **Admin Backend**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/docs
- **Estado**: 🔒 Solo funciona con servidor local

---

## 🛠️ **Inicio Rápido**

### 1️⃣ **Iniciar Servidor Local**
```bash
cd C:\mis_scripts_seguros\DataCrypt_Labs\Web-Portfolio
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### 2️⃣ **Acceder al Admin**
- Abrir: `admin/dashboard.html` (desde GitHub Pages)
- El sistema verificará automáticamente localhost:8000
- Los botones se habilitarán solo si el servidor está activo

### 3️⃣ **Credenciales Admin**
- **Usuario**: `Neyd696 :#`
- **Contraseña**: `Str0ng_P@ssw0rd_2025!`

---

## 📊 **Funcionalidades del Sistema**

### 🎯 **Sitio Web Corporativo**
- ✅ Diseño responsive y profesional
- ✅ SEO optimizado para BI/Data Science
- ✅ Formularios de contacto funcionales
- ✅ Certificaciones y servicios destacados
- ✅ Performance optimizado

### 🔧 **Backend Python (FastAPI)**
- ✅ API REST completa con 50+ endpoints
- ✅ Data Science endpoints funcionales
- ✅ Machine Learning integrado
- ✅ Sistema de métricas en tiempo real
- ✅ Análisis de datos automatizado

### 🎛️ **Panel Administrativo**
- ✅ Dashboard interactivo con métricas live
- ✅ Sistema de voz integrado
- ✅ Monitoreo de seguridad
- ✅ Reportes automatizados
- ✅ Control total del sistema

---

## 🏗️ **Estructura del Proyecto (Limpiado)**

```
📁 DataCrypt_Labs/
├── 🌐 Frontend (GitHub Pages)
│   ├── index.html              # Sitio principal
│   ├── admin/dashboard.html    # Consola administrativa
│   ├── assets/                 # Recursos estáticos
│   └── src/                    # JavaScript modular
│
├── 🐍 Backend (FastAPI)
│   ├── backend/main.py         # Servidor principal (puerto 8000)
│   ├── datacrypt_admin.db      # Base de datos SQLite
│   └── requirements.txt        # Dependencias Python
│
├── 📁 Backups
│   └── obsolete_flask_system/  # Sistema Flask obsoleto (puerto 5000)
│
├── 🔧 Scripts Utilitarios
│   ├── start_system.py         # Iniciador principal
│   ├── railway_start.py        # Deploy Railway
│   └── cleanup_obsolete.py     # Limpieza automática
│
└── 📚 Documentación
    ├── README.md               # Este archivo
    ├── requirements.txt        # Dependencias actuales
    └── *.md                    # Reportes y guías
```

---

## 🔄 **Workflow de Desarrollo**

### 🎯 **Desarrollo Normal**
1. Modificar código frontend/backend
2. Commit a GitHub → Deploy automático a GitHub Pages
3. Testing con servidor local (puerto 8000)

### 🎛️ **Admin Tasks**
1. Iniciar servidor local: `python -m uvicorn backend.main:app --port 8000`
2. Abrir consola admin desde GitHub Pages
3. Verificación automática de localhost
4. Funcionalidad habilitada solo con servidor activo

### 🧹 **Mantenimiento**
- Archivos obsoletos → `backups/obsolete_flask_system/`
- Logs de seguridad → `security_*.log`
- Base de datos → `datacrypt_admin.db`

---

## 📈 **Estado del Sistema - Octubre 2025**

### ✅ **Completado**
- [x] Sitio web corporativo LIVE en GitHub Pages
- [x] Backend FastAPI funcional con APIs completas
- [x] Sistema admin con autenticación JWT
- [x] Integración localhost-only security
- [x] Limpieza de archivos obsoletos (24 archivos Flask → backup)
- [x] Base de datos SQLite con 15 tablas optimizadas

### 🎯 **Sistema Actual**
- **Frontend**: GitHub Pages (automático)
- **Backend**: localhost:8000 (FastAPI)
- **Admin**: Híbrido (estático + dinámico)
- **Seguridad**: localhost-only restriction

---

## 🧹 **Limpieza Reciente (22 Oct 2025)**

**Archivos Flask obsoletos movidos a backup:**
- `servidor_ultra_seguro.py` → Puerto 5000 (obsoleto)
- `admin_dashboard.py` → Flask admin (obsoleto)
- 22 archivos adicionales del sistema anterior

**Inventario completo**: `backups/obsolete_flask_system/INVENTORY.md`

---

## 📞 **DataCrypt Labs - Contacto**

- **Empresa**: DataCrypt Labs
- **Servicios**: Business Intelligence, Machine Learning, Data Science
- **Teléfono**: 3232066197
- **Ubicación**: Colombia
- **Web**: https://ferneyq.github.io/datacrypt-labs-website/

---

## 📝 **Notas Técnicas**

### 🔒 **Seguridad localhost-only**
El sistema admin está diseñado para funcionar exclusivamente en servidor local. La consola estática (GitHub Pages) actúa como interfaz que verifica la disponibilidad del servidor localhost:8000 antes de habilitar cualquier funcionalidad.

### 🎯 **Sistema Limpio**
Después de la limpieza del 22 Oct 2025, el proyecto mantiene solo los archivos activos y funcionales. Todo el sistema Flask anterior está preservado en `backups/` por si se necesitan referencias.

### 📊 **Performance**
- Sitio web: Optimizado para GitHub Pages
- Backend: FastAPI con respuestas sub-segundo
- Admin: Verificación automática cada 30 segundos
- Base datos: SQLite optimizada con índices

---

**🎉 Sistema completamente operativo y optimizado - Octubre 2025**