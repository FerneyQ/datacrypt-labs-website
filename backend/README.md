# 🐍 DataCrypt Labs - Python Backend API v2.2

**Filosofía Mejora Continua v2.2: ¡Ahora con Python FUNCIONAL!**

Backend completo de **Data Science, Machine Learning y Crypto Analysis** integrado con el portfolio frontend.

---

## 🚀 Características Principales

### 📊 **Data Analytics Engine**
- Análisis de datos en tiempo real con **Pandas & NumPy**
- Generación automática de gráficos con **Matplotlib & Seaborn**
- Soporte para múltiples tipos de datos: crypto, portfolio, random data
- Estadísticas descriptivas y correlaciones automáticas

### 🤖 **Machine Learning API**
- Modelos de **Regresión** y **Clasificación** con Scikit-Learn
- Entrenamiento dinámico de Random Forest models
- Predicciones en tiempo real desde el frontend
- Métricas de accuracy y performance automáticas

### 💰 **Crypto Data Integration**
- API de precios en tiempo real via **CoinGecko**
- Análisis de tendencias y volatilidad
- Fallbacks inteligentes para demos offline
- Soporte para múltiples criptomonedas

### ⚡ **Python Code Executor**
- Ejecutor seguro de código Python desde el navegador
- Sandbox limitado con módulos permitidos
- Output en tiempo real con syntax highlighting
- Prevención de código malicioso

### 📧 **Portfolio Integration**
- API completa para formularios de contacto
- Base de datos SQLite integrada
- Estadísticas del portfolio en tiempo real
- Background tasks para notificaciones

---

## 🛠️ Instalación Rápida

### **Opción 1: Setup Automático (Recomendado)**
```bash
# Navegar al directorio backend
cd backend

# Ejecutar setup automático
python setup.py
```

### **Opción 2: Instalación Manual**
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate

# Activar entorno (Linux/Mac)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python main.py
```

---

## 🔧 Dependencias Principales

```txt
# Framework Web
fastapi==0.104.1          # API moderna y rápida
uvicorn==0.24.0           # Servidor ASGI

# Data Science
pandas==2.1.3             # Análisis de datos
numpy==1.25.2             # Computación numérica
scikit-learn==1.3.2       # Machine Learning
matplotlib==3.8.2         # Visualización
seaborn==0.13.0           # Gráficos estadísticos

# APIs y HTTP
requests==2.31.0          # HTTP requests
aiohttp==3.9.1           # Async HTTP

# Base de Datos
sqlite3                   # DB integrada (built-in)
```

---

## 🌐 API Endpoints

### **📊 Analytics**
- `POST /api/analytics/generate` - Generar análisis de datos
- `GET /api/portfolio/stats` - Estadísticas del portfolio

### **🤖 Machine Learning**
- `POST /api/ml/predict` - Predicciones ML en tiempo real

### **💰 Crypto Data**
- `GET /api/crypto/prices` - Precios de criptomonedas live

### **⚡ Code Execution**
- `POST /api/python/execute` - Ejecutar código Python

### **📧 Contact & Portfolio**
- `POST /api/contact` - Enviar mensaje de contacto
- `GET /api/contact/messages` - Obtener mensajes (admin)

### **🔍 System**
- `GET /` - Info del API
- `GET /api/health` - Health check
- `GET /api/docs` - Documentación interactiva

---

## 🎯 Ejemplos de Uso

### **Análisis de Datos**
```python
# POST /api/analytics/generate
{
    "data_type": "crypto",
    "parameters": {}
}

# Response
{
    "status": "success",
    "summary": {
        "total_cryptos": 5,
        "total_market_cap": 1847000000000,
        "avg_change_24h": 1.2,
        "best_performer": "cardano"
    },
    "plots": {
        "crypto_analysis": "base64_image_data"
    }
}
```

### **Predicción ML**
```python
# POST /api/ml/predict
{
    "model_type": "regression",
    "features": [1.0, 2.0, 3.0, 4.0],
    "train_size": 1000
}

# Response
{
    "status": "success",
    "prediction": 10.23,
    "model_accuracy": 94.5,
    "training_samples": 1000
}
```

### **Ejecución de Código**
```python
# POST /api/python/execute
{
    "code": "import statistics\ndata = [1,2,3,4,5]\nprint(f'Media: {statistics.mean(data)}')"
}

# Response
{
    "status": "success",
    "output": "Media: 3.0",
    "execution_time": "< 1s"
}
```

---

## 🚀 Cómo Ejecutar

### **1. Iniciar Backend**
```bash
# Con script de inicio (Windows)
start_server.bat

# Con script de inicio (Linux/Mac)
./start_server.sh

# Manual
python main.py
```

### **2. Verificar Funcionamiento**
- **API:** http://localhost:8000
- **Docs:** http://localhost:8000/api/docs
- **Health:** http://localhost:8000/api/health

### **3. Conectar Frontend**
El frontend automáticamente detectará el backend y activará las funcionalidades Python.

---

## 🔒 Seguridad

### **Code Executor Sandbox**
- Lista blanca de módulos permitidos
- Filtrado de keywords peligrosos
- Timeout de ejecución limitado
- Sin acceso a sistema de archivos

### **API Security**
- CORS configurado correctamente
- Validación de input con Pydantic
- Rate limiting (en roadmap)
- Input sanitization

---

## 📊 Arquitectura

```
backend/
├── main.py                 # FastAPI app principal
├── requirements.txt        # Dependencias Python
├── setup.py               # Script de instalación
├── datacrypt.db           # Base de datos SQLite
├── start_server.bat       # Inicio Windows
├── start_server.sh        # Inicio Unix/Linux
└── venv/                  # Entorno virtual
```

---

## 🐛 Troubleshooting

### **Error: ModuleNotFoundError**
```bash
# Verificar entorno virtual activo
pip list

# Reinstalar dependencias
pip install -r requirements.txt
```

### **Error: Port 8000 in use**
```python
# En main.py, cambiar puerto
uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
```

### **Frontend no se conecta**
```bash
# Verificar CORS y URL
# Frontend busca: http://localhost:8000
# Verificar que el backend esté corriendo
```

---

## 🔄 Filosofía Mejora Continua v2.2

### **✅ Problemas Resueltos**
- ❌ "Le falta más Python" → ✅ **Backend Python completo**
- ❌ "No tienen funcionalidad" → ✅ **APIs funcionales reales**
- ❌ "Solo frontend estático" → ✅ **Full-stack con Data Science**

### **🚀 Próximas Mejoras**
- WebSocket para datos en tiempo real
- Más modelos ML (Deep Learning con TensorFlow)
- Dashboard interactivo con Streamlit
- Deploy automático en cloud
- Rate limiting y autenticación

---

## 📞 Soporte

**DataCrypt Labs**  
📧 Email: info@datacrypt-labs.com  
📱 Tel: +57 323 206 6197  
🌐 Web: https://datacrypt-labs.com

---

## 🎉 ¡Resultado Final!

**Tu portfolio ahora tiene:**
- ✅ **Backend Python funcional** con FastAPI
- ✅ **Data Science en tiempo real** con Pandas/NumPy  
- ✅ **Machine Learning** con Scikit-Learn
- ✅ **Crypto data integration** en vivo
- ✅ **Python code executor** desde el browser
- ✅ **Full-stack portfolio** completo

**¡La "Filosofía Mejora Continua" sigue cumpliendo!** 🐍⚡✨