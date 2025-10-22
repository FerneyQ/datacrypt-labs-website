# 🚫 DEPLOYMENT NOTICE - SISTEMA LOCAL ÚNICAMENTE

## ⚠️ IMPORTANTE: Este proyecto está configurado para funcionar SOLO EN LOCALHOST

### 🎯 **ARQUITECTURA ACTUAL:**
- **Frontend:** GitHub Pages (archivos estáticos únicamente)
- **Backend:** FastAPI en localhost:8000 (NO compatible con hosting externo)
- **Base de datos:** SQLite local (NO en la nube)
- **Admin Panel:** localhost-only (NO accesible desde web)

### 🚨 **SI ESTÁS VIENDO ERRORES DE DEPLOYMENT:**

**Vercel/Railway/Otros servicios:** Este proyecto NO está diseñado para hosting externo.

#### **SOLUCIÓN RECOMENDADA:**
1. **Desconecta este repositorio** de cualquier servicio de hosting
2. **Elimina proyectos** asociados en Vercel/Railway
3. **Usa solo GitHub Pages** para el frontend estático

### 📱 **URLs FUNCIONALES:**
- **Sitio Web:** https://ferneyq.github.io/datacrypt-labs-website/
- **Backend Local:** http://127.0.0.1:8000 (solo localhost)
- **Admin Local:** http://127.0.0.1:8000/api/v1/admin/status

### 🔧 **PARA DESARROLLADORES:**
```bash
# Clonar repositorio
git clone https://github.com/FerneyQ/datacrypt-labs-website.git

# Instalar dependencias
cd datacrypt-labs-website
pip install -r requirements.txt

# Ejecutar backend local
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

### ❌ **NO INTENTES:**
- Hacer deploy a Vercel/Railway/Heroku
- Usar Docker en hosting externo
- Configurar variables de entorno de producción
- Exponer el backend a internet

### ✅ **SÍ PUEDES:**
- Usar GitHub Pages para el frontend
- Ejecutar backend localmente
- Desarrollar nuevas funcionalidades
- Hacer commits normalmente

---
**🎯 Filosofía:** Sistema modular, local-first, enfocado en desarrollo y testing local.