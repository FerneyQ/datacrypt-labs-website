/**
 * 🐍 DATACRYPT LABS - PYTHON BACKEND INTEGRATION v2.2
 * Integración del frontend con el backend Python FastAPI
 * 
 * Filosofía Mejora Continua v2.2:
 * - Conexión real con APIs Python
 * - Data Science en tiempo real
 * - ML predictions desde el frontend
 * - Crypto data integration
 */

class PythonBackendIntegration {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.isConnected = false;
        this.retryAttempts = 3;
        this.init();
    }

    /**
     * 🚀 INICIALIZACIÓN
     */
    async init() {
        
        
        // GitHub Pages Mode: Usar APIs mock sin mostrar popup
        if (window.location.hostname.includes('github.io')) {
            
            this.setupEventListeners();
            this.createPythonDashboard();
            
            return;
        }
        
        try {
            await this.checkConnection();
            this.setupEventListeners();
            this.createPythonDashboard();
            
        } catch (error) {
            
            // NO mostrar popup en GitHub Pages - usar APIs mock silenciosamente
            this.setupEventListeners();
            this.createPythonDashboard();
        }
    }

    /**
     * 🔗 VERIFICAR CONEXIÓN CON BACKEND
     */
    async checkConnection() {
        // GitHub Pages: usar API mock directamente
        if (window.location.hostname.includes('github.io')) {
            
            try {
                const response = await fetch('./api/health.json');
                if (response.ok) {
                    const data = await response.json();
                    this.isConnected = true;
                    
                    return data;
                }
            } catch (error) {
                
            }
        }
        
        
        
        try {
            const response = await fetch(`${this.baseURL}/health`);
            
            
            if (response.ok) {
                const data = await response.json();
                this.isConnected = true;
                
                return data;
            } else {
                
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            
            this.isConnected = false;
            throw new Error('Backend no disponible');
        }
    }

    /**
     * 🎛️ CREAR DASHBOARD DE PYTHON
     */
    createPythonDashboard() {
        // Agregar sección de Python al portfolio
        const portfolioSection = document.querySelector('#portfolio') || document.querySelector('.portfolio');
        
        if (portfolioSection) {
            const pythonSection = document.createElement('div');
            pythonSection.className = 'python-integration-section';
            pythonSection.innerHTML = `
                <div class="python-dashboard">
                    <h3>🐍 Python Backend Live Demo</h3>
                    <div class="python-status ${this.isConnected ? 'connected' : 'disconnected'}">
                        Status: ${this.isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
                    </div>
                    
                    <div class="python-features">
                        <div class="feature-grid">
                            <div class="feature-card" data-feature="analytics">
                                <h4>📊 Data Analytics</h4>
                                <p>Análisis de datos en tiempo real con Pandas & NumPy</p>
                                <button class="btn btn-primary" onclick="pythonBackend.generateAnalytics()">
                                    Generar Análisis
                                </button>
                                <div class="analytics-result"></div>
                            </div>
                            
                            <div class="feature-card" data-feature="ml">
                                <h4>🤖 Machine Learning</h4>
                                <p>Predicciones ML con Scikit-Learn</p>
                                <button class="btn btn-primary" onclick="pythonBackend.showMLPredictor()">
                                    Predicción ML
                                </button>
                                <div class="ml-result"></div>
                            </div>
                            
                            <div class="feature-card" data-feature="crypto">
                                <h4>💰 Crypto Data</h4>
                                <p>Datos de criptomonedas en tiempo real</p>
                                <button class="btn btn-primary" onclick="pythonBackend.getCryptoPrices()">
                                    Ver Precios
                                </button>
                                <div class="crypto-result"></div>
                            </div>
                            
                            <div class="feature-card" data-feature="code">
                                <h4>⚡ Python Executor</h4>
                                <p>Ejecuta código Python desde el navegador</p>
                                <button class="btn btn-primary" onclick="pythonBackend.showCodeExecutor()">
                                    Ejecutar Código
                                </button>
                                <div class="code-result"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            portfolioSection.appendChild(pythonSection);
        }
    }

    /**
     * 🎯 CONFIGURAR EVENT LISTENERS
     */
    setupEventListeners() {
        // Auto-refresh de datos cada 30 segundos
        setInterval(() => {
            if (this.isConnected) {
                this.updatePortfolioStats();
            }
        }, 30000);

        // Listener para formulario de contacto
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitContactForm(new FormData(contactForm));
            });
        }
    }

    /**
     * 📊 GENERAR ANÁLISIS DE DATOS
     */
    async generateAnalytics() {
        if (!this.isConnected) {
            this.showOfflineMode();
            return;
        }

        const resultDiv = document.querySelector('.analytics-result');
        resultDiv.innerHTML = '<div class="loading">🔄 Generando análisis...</div>';

        try {
            const types = ['crypto', 'random', 'portfolio'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            
            const response = await fetch(`${this.baseURL}/analytics/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data_type: randomType,
                    parameters: {}
                })
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                this.displayAnalyticsResult(data, resultDiv);
            } else {
                throw new Error(data.detail || 'Error en análisis');
            }

        } catch (error) {
            
            resultDiv.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
        }
    }

    /**
     * 📈 MOSTRAR RESULTADO DE ANÁLISIS
     */
    displayAnalyticsResult(data, container) {
        const { summary, statistics, plots } = data;
        
        container.innerHTML = `
            <div class="analytics-display">
                <h5>📊 Análisis: ${data.data_type}</h5>
                <div class="summary">
                    ${Object.entries(summary).map(([key, value]) => 
                        `<div class="stat"><strong>${key}:</strong> ${value}</div>`
                    ).join('')}
                </div>
                
                ${plots && Object.keys(plots).length > 0 ? `
                    <div class="plots">
                        ${Object.entries(plots).map(([name, base64]) => 
                            name !== 'error' ? 
                            `<img src="data:image/png;base64,${base64}" alt="${name}" class="analysis-plot">` : 
                            `<div class="error">${base64}</div>`
                        ).join('')}
                    </div>
                ` : ''}
                
                <div class="timestamp">
                    <small>⏰ ${new Date(data.timestamp).toLocaleString()}</small>
                </div>
            </div>
        `;
    }

    /**
     * 🤖 MOSTRAR PREDICTOR ML
     */
    showMLPredictor() {
        const resultDiv = document.querySelector('.ml-result');
        
        resultDiv.innerHTML = `
            <div class="ml-predictor">
                <h5>🤖 Predictor ML</h5>
                <div class="predictor-form">
                    <label>Tipo de modelo:</label>
                    <select id="ml-model-type">
                        <option value="regression">Regresión</option>
                        <option value="classification">Clasificación</option>
                    </select>
                    
                    <label>Features (separadas por coma):</label>
                    <input type="text" id="ml-features" placeholder="1.5, 2.3, -0.5, 4.2" value="1.0, 2.0, 3.0">
                    
                    <button onclick="pythonBackend.runMLPrediction()" class="btn btn-sm btn-primary">
                        Ejecutar Predicción
                    </button>
                </div>
                <div class="ml-prediction-result"></div>
            </div>
        `;
    }

    /**
     * ⚡ EJECUTAR PREDICCIÓN ML
     */
    async runMLPrediction() {
        if (!this.isConnected) {
            this.showOfflineMode();
            return;
        }

        const modelType = document.getElementById('ml-model-type').value;
        const featuresStr = document.getElementById('ml-features').value;
        const resultDiv = document.querySelector('.ml-prediction-result');
        
        try {
            const features = featuresStr.split(',').map(f => parseFloat(f.trim()));
            
            if (features.some(isNaN)) {
                throw new Error('Features deben ser números válidos');
            }

            resultDiv.innerHTML = '<div class="loading">🤖 Entrenando modelo y prediciendo...</div>';

            const response = await fetch(`${this.baseURL}/ml/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model_type: modelType,
                    features: features,
                    train_size: 1000
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                resultDiv.innerHTML = `
                    <div class="prediction-result">
                        <h6>✅ Predicción Completada</h6>
                        <div class="prediction-details">
                            <div><strong>Modelo:</strong> ${data.model_type}</div>
                            <div><strong>Predicción:</strong> ${data.prediction}</div>
                            <div><strong>Precisión:</strong> ${data.model_accuracy.toFixed(2)}%</div>
                            <div><strong>Muestras entrenamiento:</strong> ${data.training_samples}</div>
                        </div>
                        <small>⏰ ${new Date(data.timestamp).toLocaleString()}</small>
                    </div>
                `;
            } else {
                throw new Error(data.detail || 'Error en predicción');
            }

        } catch (error) {
            
            resultDiv.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
        }
    }

    /**
     * 💰 OBTENER PRECIOS DE CRYPTO
     */
    async getCryptoPrices() {
        if (!this.isConnected) {
            this.showOfflineMode();
            return;
        }

        const resultDiv = document.querySelector('.crypto-result');
        resultDiv.innerHTML = '<div class="loading">💰 Obteniendo precios crypto...</div>';

        try {
            const response = await fetch(`${this.baseURL}/crypto/prices`);
            const data = await response.json();

            if (data.status === 'success') {
                this.displayCryptoPrices(data, resultDiv);
            } else {
                throw new Error('Error obteniendo precios');
            }

        } catch (error) {
            
            resultDiv.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
        }
    }

    /**
     * 📊 MOSTRAR PRECIOS DE CRYPTO
     */
    displayCryptoPrices(data, container) {
        const cryptos = data.data;
        
        container.innerHTML = `
            <div class="crypto-prices">
                <h5>💰 Precios Crypto Live</h5>
                <div class="crypto-grid">
                    ${Object.entries(cryptos).map(([name, info]) => `
                        <div class="crypto-item">
                            <div class="crypto-name">${name.toUpperCase()}</div>
                            <div class="crypto-price">$${info.usd.toLocaleString()}</div>
                            <div class="crypto-change ${info.usd_24h_change > 0 ? 'positive' : 'negative'}">
                                ${info.usd_24h_change > 0 ? '↗' : '↘'} ${Math.abs(info.usd_24h_change).toFixed(2)}%
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="crypto-source">
                    <small>📡 ${data.source} | ⏰ ${new Date(data.timestamp).toLocaleString()}</small>
                </div>
            </div>
        `;
    }

    /**
     * ⚡ MOSTRAR EXECUTOR DE CÓDIGO
     */
    showCodeExecutor() {
        const resultDiv = document.querySelector('.code-result');
        
        resultDiv.innerHTML = `
            <div class="code-executor">
                <h5>⚡ Python Code Executor</h5>
                <div class="code-form">
                    <textarea id="python-code" placeholder="# Escribe tu código Python aquí
import math
import statistics

# Ejemplo: Calcular estadísticas
datos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(f'Media: {statistics.mean(datos)}')
print(f'Mediana: {statistics.median(datos)}')
print(f'Desviación estándar: {statistics.stdev(datos):.2f}')">import math
import statistics

# Ejemplo: Calcular estadísticas
datos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(f'Media: {statistics.mean(datos)}')
print(f'Mediana: {statistics.median(datos)}')
print(f'Desviación estándar: {statistics.stdev(datos):.2f}')</textarea>
                    
                    <button onclick="pythonBackend.executePythonCode()" class="btn btn-primary">
                        🚀 Ejecutar Código
                    </button>
                </div>
                <div class="code-execution-result"></div>
            </div>
        `;
    }

    /**
     * 🚀 EJECUTAR CÓDIGO PYTHON
     */
    async executePythonCode() {
        if (!this.isConnected) {
            this.showOfflineMode();
            return;
        }

        const code = document.getElementById('python-code').value;
        const resultDiv = document.querySelector('.code-execution-result');

        if (!code.trim()) {
            resultDiv.innerHTML = '<div class="error">❌ Ingresa código Python para ejecutar</div>';
            return;
        }

        resultDiv.innerHTML = '<div class="loading">⚡ Ejecutando código Python...</div>';

        try {
            const response = await fetch(`${this.baseURL}/python/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    timeout: 30
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                resultDiv.innerHTML = `
                    <div class="execution-success">
                        <h6>✅ Ejecución Exitosa</h6>
                        <pre class="code-output">${data.output}</pre>
                        <small>⏰ ${data.execution_time} | ${new Date(data.timestamp).toLocaleString()}</small>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `
                    <div class="execution-error">
                        <h6>❌ Error de Ejecución</h6>
                        <pre class="error-output">${data.error}</pre>
                        <small>⏰ ${new Date(data.timestamp).toLocaleString()}</small>
                    </div>
                `;
            }

        } catch (error) {
            
            resultDiv.innerHTML = `<div class="error">❌ Error de conexión: ${error.message}</div>`;
        }
    }

    /**
     * 📧 ENVIAR FORMULARIO DE CONTACTO
     */
    async submitContactForm(formData) {
        if (!this.isConnected) {
            this.showOfflineMode();
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.showSuccessMessage('Mensaje enviado correctamente. Respuesta estimada: ' + data.estimated_response);
            } else {
                throw new Error(data.detail || 'Error enviando mensaje');
            }

        } catch (error) {
            
            this.showErrorMessage('Error enviando mensaje: ' + error.message);
        }
    }

    /**
     * 📊 ACTUALIZAR ESTADÍSTICAS DEL PORTFOLIO
     */
    async updatePortfolioStats() {
        if (!this.isConnected) return;

        try {
            const response = await fetch(`${this.baseURL}/portfolio/stats`);
            const stats = await response.json();

            // Actualizar elementos del DOM con las estadísticas
            this.updateStatElements(stats);

        } catch (error) {
            
        }
    }

    /**
     * 📈 ACTUALIZAR ELEMENTOS DE ESTADÍSTICAS
     */
    updateStatElements(stats) {
        // Buscar elementos de estadísticas en el DOM y actualizarlos
        const statElements = {
            'projects-count': stats.projects_completed,
            'clients-count': stats.clients_satisfied,
            'code-lines': stats.lines_of_code,
            'data-processed': stats.data_processed_gb + ' GB'
        };

        Object.entries(statElements).forEach(([id, value]) => {
            const element = document.getElementById(id) || document.querySelector(`[data-stat="${id}"]`);
            if (element) {
                element.textContent = value;
            }
        });
    }

    /**
     * 🔴 MOSTRAR MODO OFFLINE
     */
    showOfflineMode() {
        const notification = document.createElement('div');
        notification.className = 'python-offline-notification';
        notification.innerHTML = `
            <div class="notification error">
                🔴 Backend Python no disponible
                <br>
                <small>Para activar funcionalidades Python, ejecuta: <code>python backend/setup.py</code></small>
                <button onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * ✅ MOSTRAR MENSAJE DE ÉXITO
     */
    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'python-notification success';
        notification.innerHTML = `
            <div class="notification success">
                ✅ ${message}
                <button onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    /**
     * ❌ MOSTRAR MENSAJE DE ERROR
     */
    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'python-notification error';
        notification.innerHTML = `
            <div class="notification error">
                ❌ ${message}
                <button onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// 🚀 INICIALIZAR INTEGRACIÓN
window.pythonBackend = new PythonBackendIntegration();

// 📤 EXPORTAR PARA USO GLOBAL
window.PythonBackendIntegration = PythonBackendIntegration;
