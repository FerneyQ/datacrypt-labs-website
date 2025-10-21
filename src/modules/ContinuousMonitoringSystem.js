/**
 * 📊 DataCrypt Labs - Continuous Monitoring System
 * Filosofía Mejora Continua v2.1 - Monitoreo en Tiempo Real
 * 
 * Sistema de monitoreo continuo que valida el funcionamiento
 * de todos los sistemas en tiempo real y reporta anomalías
 */

class ContinuousMonitoringSystem {
    constructor() {
        this.isActive = false;
        this.monitoringInterval = null;
        this.healthCheckInterval = null;
        this.performanceMetrics = {
            startTime: Date.now(),
            samples: [],
            alerts: [],
            thresholds: {
                memoryUsage: 100 * 1024 * 1024, // 100MB
                responseTime: 1000, // 1 second
                errorRate: 0.05, // 5%
                cpuUsage: 80 // 80%
            }
        };
        
        this.systemMetrics = new Map();
        this.alertSubscribers = new Set();
        
        this.init();
    }

    init() {
        console.log('📊 Initializing Continuous Monitoring System...');
        
        // Configurar monitoreo de sistemas críticos
        this.setupSystemMonitoring();
        
        // Configurar monitoreo de performance
        this.setupPerformanceMonitoring();
        
        // Configurar alertas
        this.setupAlertSystem();
        
        // Iniciar monitoreo
        this.startMonitoring();
        
        console.log('✅ Continuous Monitoring System active');
    }

    setupSystemMonitoring() {
        // Definir sistemas a monitorear
        this.monitoredSystems = [
            {
                name: 'ConfigManager',
                check: () => this.checkConfigManager(),
                critical: true,
                interval: 5000
            },
            {
                name: 'EnhancedThemeSystem',
                check: () => this.checkThemeSystem(),
                critical: true,
                interval: 10000
            },
            {
                name: 'EnhancedPWAManager',
                check: () => this.checkPWAManager(),
                critical: false,
                interval: 15000
            },
            {
                name: 'ChatbotIntegration',
                check: () => this.checkChatbotIntegration(),
                critical: false,
                interval: 20000
            },
            {
                name: 'MigrationMonitor',
                check: () => this.checkMigrationMonitor(),
                critical: false,
                interval: 30000
            }
        ];
    }

    setupPerformanceMonitoring() {
        // Monitoreo de métricas de performance
        this.performanceChecks = [
            {
                name: 'MemoryUsage',
                check: () => this.checkMemoryUsage(),
                threshold: this.performanceMetrics.thresholds.memoryUsage
            },
            {
                name: 'ResponseTime',
                check: () => this.checkResponseTime(),
                threshold: this.performanceMetrics.thresholds.responseTime
            },
            {
                name: 'ErrorRate',
                check: () => this.checkErrorRate(),
                threshold: this.performanceMetrics.thresholds.errorRate
            },
            {
                name: 'DOMHealth',
                check: () => this.checkDOMHealth(),
                threshold: 10000 // Max DOM nodes
            }
        ];
    }

    setupAlertSystem() {
        // Configurar diferentes niveles de alerta
        this.alertLevels = {
            INFO: { color: '#00d4ff', emoji: 'ℹ️' },
            WARNING: { color: '#ffa500', emoji: '⚠️' },
            CRITICAL: { color: '#ff4444', emoji: '🚨' },
            SUCCESS: { color: '#00ff41', emoji: '✅' }
        };
        
        // Configurar handlers de error globales
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledRejection(event);
        });
    }

    startMonitoring() {
        if (this.isActive) return;
        
        this.isActive = true;
        
        // Monitoreo principal cada 30 segundos
        this.monitoringInterval = setInterval(() => {
            this.runSystemHealthCheck();
        }, 30000);
        
        // Monitoreo de performance cada 5 segundos
        this.performanceInterval = setInterval(() => {
            this.runPerformanceCheck();
        }, 5000);
        
        // Health check inicial
        setTimeout(() => {
            this.runSystemHealthCheck();
        }, 1000);
        
        console.log('🔄 Continuous monitoring started');
    }

    stopMonitoring() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        if (this.performanceInterval) {
            clearInterval(this.performanceInterval);
            this.performanceInterval = null;
        }
        
        console.log('⏹️ Continuous monitoring stopped');
    }

    async runSystemHealthCheck() {
        const healthReport = {
            timestamp: new Date().toISOString(),
            overall: 'healthy',
            systems: {},
            alerts: []
        };
        
        for (const system of this.monitoredSystems) {
            try {
                const startTime = performance.now();
                const result = await system.check();
                const responseTime = performance.now() - startTime;
                
                healthReport.systems[system.name] = {
                    status: result.status || 'healthy',
                    responseTime: Math.round(responseTime),
                    details: result.details || {},
                    critical: system.critical
                };
                
                // Verificar thresholds
                if (responseTime > 500 && system.critical) {
                    this.createAlert('WARNING', `${system.name} slow response: ${Math.round(responseTime)}ms`);
                }
                
                if (result.status === 'error' && system.critical) {
                    healthReport.overall = 'critical';
                    this.createAlert('CRITICAL', `${system.name} critical error: ${result.error}`);
                } else if (result.status === 'warning') {
                    if (healthReport.overall === 'healthy') {
                        healthReport.overall = 'degraded';
                    }
                    this.createAlert('WARNING', `${system.name} warning: ${result.message}`);
                }
                
            } catch (error) {
                healthReport.systems[system.name] = {
                    status: 'error',
                    error: error.message,
                    critical: system.critical
                };
                
                if (system.critical) {
                    healthReport.overall = 'critical';
                    this.createAlert('CRITICAL', `${system.name} check failed: ${error.message}`);
                }
            }
        }
        
        // Guardar métricas
        this.systemMetrics.set(Date.now(), healthReport);
        
        // Limpiar métricas antiguas (mantener solo últimas 100)
        if (this.systemMetrics.size > 100) {
            const oldestKey = Math.min(...this.systemMetrics.keys());
            this.systemMetrics.delete(oldestKey);
        }
        
        console.log(`📊 Health Check: ${healthReport.overall} (${Object.keys(healthReport.systems).length} systems)`);
        
        return healthReport;
    }

    runPerformanceCheck() {
        const performanceReport = {
            timestamp: Date.now(),
            metrics: {}
        };
        
        for (const check of this.performanceChecks) {
            try {
                const result = check.check();
                performanceReport.metrics[check.name] = result;
                
                // Verificar thresholds
                if (typeof result === 'number' && result > check.threshold) {
                    this.createAlert('WARNING', `${check.name} exceeded threshold: ${result} > ${check.threshold}`);
                }
                
            } catch (error) {
                performanceReport.metrics[check.name] = { error: error.message };
            }
        }
        
        // Agregar a samples
        this.performanceMetrics.samples.push(performanceReport);
        
        // Mantener solo últimas 50 samples
        if (this.performanceMetrics.samples.length > 50) {
            this.performanceMetrics.samples.shift();
        }
    }

    // Checks específicos de sistemas
    checkConfigManager() {
        if (!window.ConfigManager) {
            return { status: 'error', error: 'ConfigManager not available' };
        }
        
        if (!window.ConfigManager.isReady()) {
            return { status: 'error', error: 'ConfigManager not ready' };
        }
        
        // Test básico de funcionalidad
        try {
            const testConfig = window.ConfigManager.getConfig('themes');
            if (!testConfig) {
                return { status: 'warning', message: 'No theme config available' };
            }
            
            return {
                status: 'healthy',
                details: {
                    configsCount: Object.keys(testConfig).length,
                    isReady: true
                }
            };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }

    checkThemeSystem() {
        if (!window.enhancedThemeSystem) {
            return { status: 'warning', message: 'Enhanced Theme System not available' };
        }
        
        if (!window.enhancedThemeSystem.isReady()) {
            return { status: 'error', error: 'Theme System not ready' };
        }
        
        try {
            const currentTheme = window.enhancedThemeSystem.getCurrentTheme();
            const themes = window.enhancedThemeSystem.getThemes();
            
            return {
                status: 'healthy',
                details: {
                    currentTheme: currentTheme?.name || 'unknown',
                    themesCount: themes?.length || 0,
                    backwardCompatible: !!window.themeSystem
                }
            };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }

    checkPWAManager() {
        if (!window.enhancedPWAManager) {
            return { status: 'warning', message: 'Enhanced PWA Manager not available' };
        }
        
        try {
            const status = window.enhancedPWAManager.getStatus();
            
            return {
                status: status.initialized ? 'healthy' : 'warning',
                details: {
                    initialized: status.initialized,
                    online: status.online,
                    serviceWorkerActive: status.serviceWorkerRegistered,
                    backwardCompatible: !!window.pwaManager
                }
            };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }

    checkChatbotIntegration() {
        if (!window.chatbotIntegration) {
            return { status: 'warning', message: 'Chatbot Integration not available' };
        }
        
        try {
            const isReady = window.chatbotIntegration.isReady();
            const chatbot = window.chatbotIntegration.getChatbot();
            
            return {
                status: isReady ? 'healthy' : 'warning',
                details: {
                    integrationReady: isReady,
                    chatbotAvailable: !!chatbot,
                    configManagerConnected: !!window.chatbotIntegration.configManager
                }
            };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }

    checkMigrationMonitor() {
        if (!window.migrationMonitor) {
            return { status: 'info', message: 'Migration Monitor not available' };
        }
        
        try {
            const results = window.migrationMonitor.getValidationResults();
            
            return {
                status: 'healthy',
                details: {
                    hasResults: !!results,
                    isMonitoring: window.migrationMonitor.isMonitoring(),
                    systemChecks: window.migrationMonitor.getSystemChecks()
                }
            };
        } catch (error) {
            return { status: 'error', error: error.message };
        }
    }

    // Checks de performance
    checkMemoryUsage() {
        if (!performance.memory) {
            return null; // Not supported
        }
        
        return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit,
            usedMB: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
        };
    }

    checkResponseTime() {
        // Medir tiempo de respuesta de operaciones críticas
        const startTime = performance.now();
        
        try {
            // Test de operaciones críticas
            window.ConfigManager?.getConfig('themes');
            window.enhancedThemeSystem?.getCurrentTheme();
            
            return performance.now() - startTime;
        } catch (error) {
            return -1; // Error
        }
    }

    checkErrorRate() {
        // Calcular tasa de errores basada en alertas recientes
        const recentAlerts = this.performanceMetrics.alerts.filter(
            alert => Date.now() - alert.timestamp < 60000 // Últimos 60 segundos
        );
        
        const errorAlerts = recentAlerts.filter(alert => alert.level === 'CRITICAL');
        
        return recentAlerts.length > 0 ? errorAlerts.length / recentAlerts.length : 0;
    }

    checkDOMHealth() {
        return {
            totalNodes: document.querySelectorAll('*').length,
            scripts: document.scripts.length,
            stylesheets: document.styleSheets.length,
            eventListeners: this.estimateEventListeners()
        };
    }

    estimateEventListeners() {
        // Estimación básica de event listeners
        let count = 0;
        const elements = document.querySelectorAll('*');
        
        elements.forEach(el => {
            // Verificar algunos eventos comunes
            if (el.onclick || el.onload || el.onerror) count++;
        });
        
        return count;
    }

    // Sistema de alertas
    createAlert(level, message, details = null) {
        const alert = {
            id: Date.now() + Math.random(),
            level,
            message,
            details,
            timestamp: Date.now(),
            acknowledged: false
        };
        
        this.performanceMetrics.alerts.push(alert);
        
        // Mantener solo últimas 50 alertas
        if (this.performanceMetrics.alerts.length > 50) {
            this.performanceMetrics.alerts.shift();
        }
        
        // Log en consola
        const config = this.alertLevels[level];
        console.log(`${config.emoji} [${level}] ${message}`);
        
        // Notificar suscriptores
        this.notifyAlertSubscribers(alert);
        
        // Mostrar alerta visual para críticas
        if (level === 'CRITICAL') {
            this.showVisualAlert(alert);
        }
        
        return alert;
    }

    showVisualAlert(alert) {
        // Crear alerta visual temporal
        const alertDiv = document.createElement('div');
        alertDiv.className = 'monitoring-alert critical';
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(255, 68, 68, 0.3);
            font-family: 'Courier New', monospace;
            font-size: 12px;
        `;
        
        alertDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">🚨 SISTEMA CRÍTICO</div>
            <div>${alert.message}</div>
            <button onclick="this.parentElement.remove()" style="
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
            ">×</button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove después de 10 segundos
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 10000);
    }

    notifyAlertSubscribers(alert) {
        for (const subscriber of this.alertSubscribers) {
            try {
                subscriber(alert);
            } catch (error) {
                console.warn('Alert subscriber error:', error);
            }
        }
    }

    // Event handlers
    handleGlobalError(event) {
        this.createAlert('CRITICAL', `Global Error: ${event.error?.message || event.message}`, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
        });
    }

    handleUnhandledRejection(event) {
        this.createAlert('CRITICAL', `Unhandled Promise Rejection: ${event.reason}`, {
            reason: event.reason
        });
    }

    // API pública
    subscribeToAlerts(callback) {
        this.alertSubscribers.add(callback);
        return () => this.alertSubscribers.delete(callback);
    }

    getSystemMetrics() {
        return Array.from(this.systemMetrics.values());
    }

    getPerformanceMetrics() {
        return this.performanceMetrics;
    }

    getRecentAlerts(limit = 10) {
        return this.performanceMetrics.alerts
            .slice(-limit)
            .sort((a, b) => b.timestamp - a.timestamp);
    }

    acknowledgeAlert(alertId) {
        const alert = this.performanceMetrics.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
        }
    }

    getSystemStatus() {
        const latestMetrics = Array.from(this.systemMetrics.values()).pop();
        
        return {
            isActive: this.isActive,
            overall: latestMetrics?.overall || 'unknown',
            systemsCount: this.monitoredSystems.length,
            activeAlerts: this.performanceMetrics.alerts.filter(a => !a.acknowledged).length,
            uptime: Date.now() - this.performanceMetrics.startTime
        };
    }

    generateReport() {
        const status = this.getSystemStatus();
        const recentAlerts = this.getRecentAlerts(5);
        const latestPerformance = this.performanceMetrics.samples.slice(-1)[0];
        
        return {
            timestamp: new Date().toISOString(),
            status,
            recentAlerts,
            performance: latestPerformance,
            metrics: this.getSystemMetrics().slice(-5)
        };
    }
}

// Auto-inicialización
if (typeof window !== 'undefined') {
    window.ContinuousMonitoringSystem = ContinuousMonitoringSystem;
    
    // Inicializar después de que todos los sistemas estén listos
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!window.continuousMonitoring) {
                window.continuousMonitoring = new ContinuousMonitoringSystem();
                
                // Integrar con chatbot si está disponible
                if (window.chatbotIntegration) {
                    window.continuousMonitoring.subscribeToAlerts((alert) => {
                        if (alert.level === 'CRITICAL' && window.chatbotIntegration.isReady()) {
                            window.chatbotIntegration.sendMessage(
                                `🚨 Alerta crítica detectada: ${alert.message}`
                            );
                        }
                    });
                }
            }
        }, 5000); // Esperar a que todo esté inicializado
    });
}

export default ContinuousMonitoringSystem;