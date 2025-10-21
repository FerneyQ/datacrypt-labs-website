/**
 * 🔍 DataCrypt Labs - Migration Monitor & Validator
 * Filosofía Mejora Continua v2.1 - Sistema de Monitoreo
 * 
 * Monitorea y valida que la migración se ejecute correctamente
 * y que todos los sistemas mantengan funcionalidad
 */

class MigrationMonitor {
    constructor() {
        this.isActive = false;
        this.validationResults = {
            preMigration: null,
            postMigration: null,
            continuousMonitoring: []
        };
        
        this.systemChecks = {
            themeSystem: false,
            pwaManager: false,
            chatbot: false,
            configManager: false,
            testRunner: false
        };
        
        this.init();
    }

    init() {
        console.log('🔍 Initializing Migration Monitor...');
        
        // Validación pre-migración
        this.runPreMigrationValidation();
        
        // Configurar monitoreo
        this.setupEventListeners();
        
        // Configurar monitoreo continuo
        this.setupContinuousMonitoring();
        
        console.log('✅ Migration Monitor initialized');
    }

    setupEventListeners() {
        // Escuchar eventos de migración
        window.addEventListener('migrationComplete', (event) => {
            this.handleMigrationComplete(event.detail);
        });
        
        // Escuchar eventos de sistemas
        window.addEventListener('themeSystemReady', () => {
            this.systemChecks.themeSystem = true;
            this.logSystemStatus('Theme System', 'ready');
        });
        
        window.addEventListener('pwaManagerReady', () => {
            this.systemChecks.pwaManager = true;
            this.logSystemStatus('PWA Manager', 'ready');
        });
        
        window.addEventListener('themeSystemReady', () => {
            this.systemChecks.chatbot = true;
            this.logSystemStatus('Chatbot Integration', 'ready');
        });
        
        // Monitor de errores críticos
        window.addEventListener('error', (event) => {
            this.handleCriticalError(event);
        });
    }

    runPreMigrationValidation() {
        console.log('📋 Running pre-migration validation...');
        
        const validation = {
            timestamp: new Date().toISOString(),
            systems: {},
            domReady: document.readyState === 'complete',
            criticalDependencies: this.checkCriticalDependencies()
        };
        
        // Validar sistemas existentes
        validation.systems.themeSystem = this.validateExistingThemeSystem();
        validation.systems.pwaManager = this.validateExistingPWAManager();
        validation.systems.translationSystem = this.validateExistingTranslationSystem();
        
        // Validar DOM y recursos
        validation.domStructure = this.validateDOMStructure();
        validation.cssResources = this.validateCSSResources();
        validation.jsResources = this.validateJSResources();
        
        this.validationResults.preMigration = validation;
        
        console.log('📊 Pre-migration validation results:', validation);
        
        return validation;
    }

    checkCriticalDependencies() {
        const dependencies = {
            ConfigManager: !!window.ConfigManager,
            TestRunner: !!window.TestRunner,
            EnhancedThemeSystem: !!window.EnhancedThemeSystem,
            EnhancedPWAManager: !!window.EnhancedPWAManager,
            DataCryptChatbot: !!window.DataCryptChatbot
        };
        
        const missing = Object.entries(dependencies)
            .filter(([name, exists]) => !exists)
            .map(([name]) => name);
        
        if (missing.length > 0) {
            console.warn('⚠️ Missing critical dependencies:', missing);
        }
        
        return dependencies;
    }

    validateExistingThemeSystem() {
        if (!window.themeSystem) {
            return { exists: false };
        }
        
        return {
            exists: true,
            hasThemes: !!window.themeSystem.themes,
            hasCurrentTheme: !!window.themeSystem.currentTheme,
            apiMethods: {
                getCurrentTheme: typeof window.themeSystem.getCurrentTheme === 'function',
                setTheme: typeof window.themeSystem.setTheme === 'function'
            }
        };
    }

    validateExistingPWAManager() {
        if (!window.pwaManager) {
            return { exists: false };
        }
        
        return {
            exists: true,
            hasServiceWorker: !!navigator.serviceWorker,
            apiMethods: {
                install: typeof window.pwaManager.install === 'function',
                isInstalled: typeof window.pwaManager.isInstalled === 'function'
            }
        };
    }

    validateExistingTranslationSystem() {
        if (!window.translationSystem) {
            return { exists: false };
        }
        
        return {
            exists: true,
            hasTranslations: !!window.translationSystem.translations,
            currentLanguage: window.translationSystem.currentLanguage || 'unknown'
        };
    }

    validateDOMStructure() {
        const requiredElements = [
            'nav',
            '.hero-section',
            '.services-section',
            '.about-section',
            '.contact-section',
            'footer'
        ];
        
        const validation = {
            complete: true,
            missing: [],
            present: []
        };
        
        requiredElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                validation.present.push(selector);
            } else {
                validation.missing.push(selector);
                validation.complete = false;
            }
        });
        
        return validation;
    }

    validateCSSResources() {
        const stylesheets = Array.from(document.styleSheets);
        const validation = {
            totalStylesheets: stylesheets.length,
            loaded: 0,
            failed: 0,
            critical: {
                main: false,
                chatbot: false
            }
        };
        
        stylesheets.forEach(sheet => {
            try {
                // Intentar acceder a las reglas para verificar carga
                sheet.cssRules;
                validation.loaded++;
                
                // Verificar hojas críticas
                if (sheet.href && sheet.href.includes('main.css')) {
                    validation.critical.main = true;
                }
                if (sheet.href && sheet.href.includes('DataCryptChatbot.css')) {
                    validation.critical.chatbot = true;
                }
            } catch (e) {
                validation.failed++;
            }
        });
        
        return validation;
    }

    validateJSResources() {
        const scripts = Array.from(document.scripts);
        const validation = {
            totalScripts: scripts.length,
            modularScripts: 0,
            critical: {
                configManager: false,
                testRunner: false,
                chatbot: false
            }
        };
        
        scripts.forEach(script => {
            if (script.src) {
                if (script.src.includes('src/')) {
                    validation.modularScripts++;
                }
                
                // Verificar scripts críticos
                if (script.src.includes('ConfigManager.js')) {
                    validation.critical.configManager = true;
                }
                if (script.src.includes('TestRunner.js')) {
                    validation.critical.testRunner = true;
                }
                if (script.src.includes('DataCryptChatbot.js')) {
                    validation.critical.chatbot = true;
                }
            }
        });
        
        return validation;
    }

    setupContinuousMonitoring() {
        // Monitoreo cada 5 segundos durante la migración
        setInterval(() => {
            if (this.isActive) {
                this.runContinuousValidation();
            }
        }, 5000);
        
        // Monitoreo menos frecuente post-migración
        setInterval(() => {
            if (!this.isActive) {
                this.runHealthCheck();
            }
        }, 30000);
    }

    runContinuousValidation() {
        const validation = {
            timestamp: new Date().toISOString(),
            systemHealth: this.checkSystemHealth(),
            performance: this.checkPerformance(),
            errors: this.getRecentErrors()
        };
        
        this.validationResults.continuousMonitoring.push(validation);
        
        // Mantener solo los últimos 20 registros
        if (this.validationResults.continuousMonitoring.length > 20) {
            this.validationResults.continuousMonitoring.shift();
        }
        
        // Detectar problemas críticos
        this.detectCriticalIssues(validation);
    }

    checkSystemHealth() {
        return {
            configManager: this.checkConfigManagerHealth(),
            themeSystem: this.checkThemeSystemHealth(),
            pwaManager: this.checkPWAManagerHealth(),
            chatbot: this.checkChatbotHealth(),
            memoryUsage: this.checkMemoryUsage()
        };
    }

    checkConfigManagerHealth() {
        if (!window.ConfigManager) return { status: 'missing' };
        
        try {
            const testConfig = window.ConfigManager.getConfig('themes');
            return {
                status: 'healthy',
                responsive: true,
                hasConfigs: !!testConfig
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message
            };
        }
    }

    checkThemeSystemHealth() {
        const health = {
            legacy: !!window.themeSystem,
            enhanced: !!window.enhancedThemeSystem,
            apiWorking: false
        };
        
        try {
            if (window.themeSystem && window.themeSystem.getCurrentTheme) {
                const currentTheme = window.themeSystem.getCurrentTheme();
                health.apiWorking = !!currentTheme;
                health.currentTheme = currentTheme?.name || 'unknown';
            }
        } catch (error) {
            health.error = error.message;
        }
        
        return health;
    }

    checkPWAManagerHealth() {
        const health = {
            legacy: !!window.pwaManager,
            enhanced: !!window.enhancedPWAManager,
            serviceWorkerActive: false
        };
        
        try {
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                health.serviceWorkerActive = true;
            }
        } catch (error) {
            health.error = error.message;
        }
        
        return health;
    }

    checkChatbotHealth() {
        const health = {
            integration: !!window.chatbotIntegration,
            chatbot: !!window.dataCryptChatbot,
            ready: false
        };
        
        try {
            if (window.chatbotIntegration) {
                health.ready = window.chatbotIntegration.isReady();
            }
        } catch (error) {
            health.error = error.message;
        }
        
        return health;
    }

    checkPerformance() {
        return {
            loadTime: performance.timing ? 
                performance.timing.loadEventEnd - performance.timing.navigationStart : 0,
            domNodes: document.querySelectorAll('*').length,
            stylesheets: document.styleSheets.length,
            scripts: document.scripts.length
        };
    }

    checkMemoryUsage() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return { supported: false };
    }

    getRecentErrors() {
        // Implementar tracking de errores si es necesario
        return [];
    }

    runHealthCheck() {
        const healthCheck = {
            timestamp: new Date().toISOString(),
            overall: 'healthy',
            systems: this.checkSystemHealth(),
            issues: []
        };
        
        // Verificar problemas conocidos
        if (!healthCheck.systems.configManager.responsive) {
            healthCheck.issues.push('ConfigManager not responsive');
            healthCheck.overall = 'degraded';
        }
        
        if (!healthCheck.systems.themeSystem.apiWorking) {
            healthCheck.issues.push('Theme System API not working');
            healthCheck.overall = 'degraded';
        }
        
        if (healthCheck.issues.length > 2) {
            healthCheck.overall = 'critical';
        }
        
        console.log('🔍 Health Check:', healthCheck);
        
        return healthCheck;
    }

    detectCriticalIssues(validation) {
        const issues = [];
        
        if (!validation.systemHealth.configManager.responsive) {
            issues.push('ConfigManager unresponsive');
        }
        
        if (!validation.systemHealth.themeSystem.apiWorking) {
            issues.push('Theme System API broken');
        }
        
        if (issues.length > 0) {
            console.error('🚨 Critical issues detected:', issues);
            this.handleCriticalIssues(issues);
        }
    }

    handleCriticalIssues(issues) {
        // Notificar problemas críticos
        const event = new CustomEvent('criticalIssuesDetected', {
            detail: { issues, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
    }

    handleMigrationComplete(migrationReport) {
        console.log('🎉 Migration completed - Running post-migration validation...');
        
        this.isActive = false;
        
        // Ejecutar validación post-migración
        setTimeout(() => {
            this.runPostMigrationValidation(migrationReport);
        }, 2000);
    }

    runPostMigrationValidation(migrationReport) {
        const validation = {
            timestamp: new Date().toISOString(),
            migrationReport,
            systemValidation: this.validateAllSystems(),
            functionalityTest: this.runFunctionalityTests(),
            performanceCheck: this.checkPerformance(),
            backwardCompatibility: this.validateBackwardCompatibility()
        };
        
        this.validationResults.postMigration = validation;
        
        console.log('📊 Post-migration validation results:', validation);
        
        // Generar reporte final
        this.generateFinalReport();
    }

    validateAllSystems() {
        return {
            configManager: !!window.ConfigManager && window.ConfigManager.isReady(),
            enhancedThemeSystem: !!window.enhancedThemeSystem && window.enhancedThemeSystem.isReady(),
            enhancedPWAManager: !!window.enhancedPWAManager && window.enhancedPWAManager.isReady(),
            chatbotIntegration: !!window.chatbotIntegration && window.chatbotIntegration.isReady(),
            testRunner: !!window.TestRunner
        };
    }

    runFunctionalityTests() {
        const tests = {
            themeChange: false,
            configUpdate: false,
            chatbotResponse: false
        };
        
        try {
            // Test theme change
            if (window.themeSystem && window.themeSystem.getCurrentTheme) {
                const currentTheme = window.themeSystem.getCurrentTheme();
                tests.themeChange = !!currentTheme;
            }
            
            // Test config update
            if (window.ConfigManager) {
                const config = window.ConfigManager.getConfig('themes');
                tests.configUpdate = !!config;
            }
            
            // Test chatbot
            if (window.chatbotIntegration) {
                tests.chatbotResponse = window.chatbotIntegration.isReady();
            }
        } catch (error) {
            console.warn('Functionality test error:', error);
        }
        
        return tests;
    }

    validateBackwardCompatibility() {
        const compatibility = {
            themeSystemAPI: false,
            pwaManagerAPI: false,
            globalVariables: false
        };
        
        try {
            // Verificar API de Theme System
            compatibility.themeSystemAPI = 
                window.themeSystem &&
                typeof window.themeSystem.getCurrentTheme === 'function' &&
                typeof window.themeSystem.setTheme === 'function';
            
            // Verificar API de PWA Manager
            compatibility.pwaManagerAPI = 
                window.pwaManager &&
                typeof window.pwaManager.install === 'function' &&
                typeof window.pwaManager.isInstalled === 'function';
            
            // Verificar variables globales críticas
            compatibility.globalVariables = 
                !!window.themeSystem &&
                !!window.pwaManager;
                
        } catch (error) {
            console.error('Compatibility validation error:', error);
        }
        
        return compatibility;
    }

    generateFinalReport() {
        const report = {
            timestamp: new Date().toISOString(),
            migrationSuccess: this.evaluateMigrationSuccess(),
            summary: this.generateSummary(),
            recommendations: this.generateRecommendations(),
            validationResults: this.validationResults
        };
        
        console.log('\n📋 MIGRATION FINAL REPORT');
        console.log('========================');
        console.log(`Success: ${report.migrationSuccess ? '✅' : '❌'}`);
        console.log(`Summary: ${report.summary}`);
        
        if (report.recommendations.length > 0) {
            console.log('\n📝 Recommendations:');
            report.recommendations.forEach((rec, i) => {
                console.log(`${i + 1}. ${rec}`);
            });
        }
        
        // Guardar reporte
        try {
            localStorage.setItem('datacrypt-migration-final-report', JSON.stringify(report));
        } catch (error) {
            console.warn('Could not save final report:', error);
        }
        
        return report;
    }

    evaluateMigrationSuccess() {
        const post = this.validationResults.postMigration;
        if (!post) return false;
        
        const systemsOK = Object.values(post.systemValidation).every(v => v === true);
        const functionalityOK = Object.values(post.functionalityTest).every(v => v === true);
        const compatibilityOK = Object.values(post.backwardCompatibility).every(v => v === true);
        
        return systemsOK && functionalityOK && compatibilityOK;
    }

    generateSummary() {
        const success = this.evaluateMigrationSuccess();
        if (success) {
            return 'All systems migrated successfully with full backward compatibility maintained';
        } else {
            return 'Migration completed with some issues - see recommendations';
        }
    }

    generateRecommendations() {
        const recommendations = [];
        const post = this.validationResults.postMigration;
        
        if (!post) return recommendations;
        
        // Verificar sistemas
        Object.entries(post.systemValidation).forEach(([system, status]) => {
            if (!status) {
                recommendations.push(`Review ${system} integration`);
            }
        });
        
        // Verificar funcionalidad
        Object.entries(post.functionalityTest).forEach(([test, passed]) => {
            if (!passed) {
                recommendations.push(`Fix ${test} functionality`);
            }
        });
        
        // Verificar compatibilidad
        Object.entries(post.backwardCompatibility).forEach(([api, working]) => {
            if (!working) {
                recommendations.push(`Restore ${api} backward compatibility`);
            }
        });
        
        return recommendations;
    }

    logSystemStatus(system, status) {
        console.log(`🔍 ${system}: ${status}`);
    }

    handleCriticalError(event) {
        if (this.isActive) {
            console.error('🚨 Critical error during migration:', event.error);
        }
    }

    // API pública
    getValidationResults() {
        return this.validationResults;
    }

    getSystemChecks() {
        return this.systemChecks;
    }

    isMonitoring() {
        return this.isActive;
    }
}

// Auto-inicialización
if (typeof window !== 'undefined') {
    window.MigrationMonitor = MigrationMonitor;
    
    // Inicializar inmediatamente para capturar pre-migración
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.migrationMonitor = new MigrationMonitor();
        });
    } else {
        window.migrationMonitor = new MigrationMonitor();
    }
}

export default MigrationMonitor;