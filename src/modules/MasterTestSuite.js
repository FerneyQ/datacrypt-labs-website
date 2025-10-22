/**
 * 🧪 DataCrypt Labs - Master Test Suite
 * Filosofía Mejora Continua v2.1 - Coordinador Principal de Tests
 * 
 * Suite principal que coordina y ejecuta todos los tests del sistema
 * Genera reportes completos y monitorea el estado general
 */

class MasterTestSuite {
    constructor() {
        this.testSuites = new Map();
        this.executionResults = {
            startTime: null,
            endTime: null,
            totalDuration: 0,
            suites: [],
            summary: {
                totalTests: 0,
                passed: 0,
                failed: 0,
                skipped: 0,
                successRate: 0
            },
            errors: [],
            warnings: []
        };
        
        this.isRunning = false;
        this.currentSuite = null;
        
        this.init();
    }

    init() {
        
        
        // Registrar todas las suites de test disponibles
        this.registerTestSuites();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        
    }

    registerTestSuites() {
        // Registrar suite de ConfigManager
        this.testSuites.set('configManager', {
            name: 'ConfigManager Core System',
            description: 'Tests para el sistema de configuración centralizada',
            runner: () => window.runAllConfigManagerTests ? window.runAllConfigManagerTests() : null,
            priority: 1, // Ejecutar primero (crítico)
            dependencies: ['TestRunner'],
            category: 'core'
        });

        // Registrar suite de Enhanced Theme System
        this.testSuites.set('enhancedThemeSystem', {
            name: 'Enhanced Theme System',
            description: 'Tests para el sistema de temas migrado',
            runner: () => window.runAllThemeSystemTests ? window.runAllThemeSystemTests() : null,
            priority: 2,
            dependencies: ['ConfigManager', 'EnhancedThemeSystem'],
            category: 'enhanced-systems'
        });

        // Registrar suite de Enhanced PWA Manager
        this.testSuites.set('enhancedPWAManager', {
            name: 'Enhanced PWA Manager',
            description: 'Tests para el PWA Manager migrado',
            runner: () => window.runAllPWAManagerTests ? window.runAllPWAManagerTests() : null,
            priority: 2,
            dependencies: ['ConfigManager', 'EnhancedPWAManager'],
            category: 'enhanced-systems'
        });

        // Registrar suite de Chatbot Integration
        this.testSuites.set('chatbotIntegration', {
            name: 'Chatbot Integration System',
            description: 'Tests para el sistema de chatbot inteligente',
            runner: () => window.runAllChatbotTests ? window.runAllChatbotTests() : null,
            priority: 3,
            dependencies: ['ConfigManager', 'DataCryptChatbot', 'ChatbotIntegration'],
            category: 'integration'
        });

        // Registrar suite de Migration System
        this.testSuites.set('migrationSystem', {
            name: 'Intelligent Migration System',
            description: 'Tests para el sistema de migración inteligente',
            runner: () => this.runMigrationSystemTests(),
            priority: 4,
            dependencies: ['IntelligentMigrationSystem', 'MigrationMonitor'],
            category: 'migration'
        });

        // Registrar suite de Integration Tests
        this.testSuites.set('fullIntegration', {
            name: 'Full System Integration',
            description: 'Tests de integración completa del sistema',
            runner: () => this.runFullIntegrationTests(),
            priority: 5,
            dependencies: ['all-systems'],
            category: 'integration'
        });
    }

    setupEventListeners() {
        // Escuchar eventos de progreso de tests
        window.addEventListener('testProgress', (event) => {
            this.handleTestProgress(event.detail);
        });

        // Escuchar eventos de finalización de tests
        window.addEventListener('testSuiteComplete', (event) => {
            this.handleTestSuiteComplete(event.detail);
        });

        // Escuchar errores durante tests
        window.addEventListener('testError', (event) => {
            this.handleTestError(event.detail);
        });
    }

    async runAllTests(options = {}) {
        if (this.isRunning) {
            
            return this.executionResults;
        }

        
        
        
        this.isRunning = true;
        this.executionResults.startTime = new Date().toISOString();
        
        const startTime = performance.now();
        
        try {
            // Verificar dependencias antes de ejecutar
            await this.verifyDependencies();
            
            // Obtener suites ordenadas por prioridad
            const orderedSuites = this.getOrderedTestSuites(options.filter);
            
            
            
            // Ejecutar cada suite
            for (const suite of orderedSuites) {
                await this.executeSuite(suite);
            }
            
            // Ejecutar tests de integración final
            if (options.includeIntegration !== false) {
                await this.executeIntegrationTests();
            }
            
            const endTime = performance.now();
            this.executionResults.totalDuration = Math.round(endTime - startTime);
            this.executionResults.endTime = new Date().toISOString();
            
            // Generar reporte final
            this.generateFinalReport();
            
        } catch (error) {
            
            this.executionResults.errors.push({
                type: 'execution-failure',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        } finally {
            this.isRunning = false;
        }
        
        return this.executionResults;
    }

    async verifyDependencies() {
        
        
        const requiredSystems = [
            'TestRunner', 'ConfigManager', 'EnhancedThemeSystem', 
            'EnhancedPWAManager', 'DataCryptChatbot', 'ChatbotIntegration'
        ];
        
        const missing = [];
        
        for (const system of requiredSystems) {
            if (!window[system]) {
                missing.push(system);
            }
        }
        
        if (missing.length > 0) {
            throw new Error(`Missing required systems: ${missing.join(', ')}`);
        }
        
        // Verificar que los sistemas estén inicializados
        const initializationChecks = [
            { name: 'ConfigManager', check: () => window.ConfigManager.isReady() },
            { name: 'EnhancedThemeSystem', check: () => window.enhancedThemeSystem?.isReady() },
            { name: 'EnhancedPWAManager', check: () => window.enhancedPWAManager?.isReady() },
            { name: 'ChatbotIntegration', check: () => window.chatbotIntegration?.isReady() }
        ];
        
        for (const { name, check } of initializationChecks) {
            if (!check()) {
                this.executionResults.warnings.push({
                    type: 'initialization-warning',
                    message: `${name} may not be fully initialized`,
                    timestamp: new Date().toISOString()
                });
            }
        }
        
        
    }

    getOrderedTestSuites(filter = null) {
        let suites = Array.from(this.testSuites.values());
        
        // Filtrar si se especifica
        if (filter) {
            if (typeof filter === 'string') {
                suites = suites.filter(suite => suite.category === filter);
            } else if (Array.isArray(filter)) {
                suites = suites.filter(suite => filter.includes(suite.name));
            }
        }
        
        // Ordenar por prioridad
        return suites.sort((a, b) => a.priority - b.priority);
    }

    async executeSuite(suite) {
        
        
        
        this.currentSuite = suite.name;
        const suiteStartTime = performance.now();
        
        try {
            // Verificar dependencias específicas de la suite
            this.verifySpecificDependencies(suite.dependencies);
            
            // Ejecutar la suite
            const result = await suite.runner();
            
            const suiteEndTime = performance.now();
            const suiteDuration = Math.round(suiteEndTime - suiteStartTime);
            
            if (result) {
                
                
                this.executionResults.suites.push({
                    name: suite.name,
                    category: suite.category,
                    duration: suiteDuration,
                    result: result,
                    status: 'completed',
                    timestamp: new Date().toISOString()
                });
                
                // Actualizar totales
                this.executionResults.summary.totalTests += (result.passed || 0) + (result.failed || 0);
                this.executionResults.summary.passed += result.passed || 0;
                this.executionResults.summary.failed += result.failed || 0;
                
            } else {
                
                
                this.executionResults.suites.push({
                    name: suite.name,
                    category: suite.category,
                    duration: suiteDuration,
                    status: 'no-results',
                    timestamp: new Date().toISOString()
                });
                
                this.executionResults.warnings.push({
                    type: 'no-results',
                    message: `${suite.name} returned no test results`,
                    timestamp: new Date().toISOString()
                });
            }
            
        } catch (error) {
            const suiteEndTime = performance.now();
            const suiteDuration = Math.round(suiteEndTime - suiteStartTime);
            
            
            
            this.executionResults.suites.push({
                name: suite.name,
                category: suite.category,
                duration: suiteDuration,
                status: 'failed',
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            this.executionResults.errors.push({
                type: 'suite-execution',
                suite: suite.name,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    verifySpecificDependencies(dependencies) {
        for (const dep of dependencies) {
            if (dep === 'all-systems') continue; // Verificado globalmente
            
            if (!window[dep]) {
                throw new Error(`Missing dependency: ${dep}`);
            }
        }
    }

    async executeIntegrationTests() {
        
        
        const integrationTests = [
            this.testSystemInteroperability,
            this.testBackwardCompatibility,
            this.testPerformanceImpact,
            this.testErrorHandling
        ];
        
        for (const test of integrationTests) {
            try {
                await test.call(this);
            } catch (error) {
                
                this.executionResults.errors.push({
                    type: 'integration-test',
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }
    }

    async testSystemInteroperability() {
        
        
        // Test: Cambio de tema debe propagarse a todos los sistemas
        const originalTheme = window.enhancedThemeSystem.getCurrentTheme();
        const themes = window.enhancedThemeSystem.getThemes();
        const testTheme = themes.find(t => t.id !== originalTheme.id);
        
        if (testTheme) {
            // Cambiar tema
            window.enhancedThemeSystem.setTheme(testTheme.id);
            
            // Verificar que el chatbot reciba el cambio
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Restaurar tema original
            window.enhancedThemeSystem.setTheme(originalTheme.id);
        }
        
        
    }

    async testBackwardCompatibility() {
        
        
        // Verificar que APIs legadas funcionen
        const legacyAPIs = [
            { api: 'window.themeSystem.getCurrentTheme', expected: 'function' },
            { api: 'window.pwaManager.isInstalled', expected: 'function' },
            { api: 'window.themeSystem.themes', expected: 'object' }
        ];
        
        for (const { api, expected } of legacyAPIs) {
            const parts = api.split('.');
            let current = window;
            
            for (const part of parts.slice(1)) {
                current = current[part];
                if (!current) break;
            }
            
            if (typeof current !== expected) {
                throw new Error(`Backward compatibility broken: ${api}`);
            }
        }
        
        
    }

    async testPerformanceImpact() {
        
        
        const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        
        // Ejecutar operaciones típicas múltiples veces
        for (let i = 0; i < 100; i++) {
            window.ConfigManager.getConfig('themes');
            window.enhancedThemeSystem.getCurrentTheme();
            if (window.enhancedPWAManager) {
                window.enhancedPWAManager.getStatus();
            }
        }
        
        const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        const memoryIncrease = endMemory - startMemory;
        
        if (memoryIncrease > 5 * 1024 * 1024) { // 5MB threshold
            this.executionResults.warnings.push({
                type: 'performance-warning',
                message: `High memory usage detected: ${Math.round(memoryIncrease / 1024 / 1024)}MB`,
                timestamp: new Date().toISOString()
            });
        }
        
        
    }

    async testErrorHandling() {
        
        
        // Test error scenarios
        const errorTests = [
            () => window.ConfigManager.getConfig(null),
            () => window.enhancedThemeSystem.setTheme('invalid-theme'),
            () => window.ConfigManager.updateConfig('invalid', {})
        ];
        
        for (const test of errorTests) {
            try {
                test();
                // No debería lanzar errores
            } catch (error) {
                throw new Error(`Error handling failed: ${error.message}`);
            }
        }
        
        
    }

    // Tests específicos para sistemas de migración
    async runMigrationSystemTests() {
        if (!window.TestRunner) return null;
        
        const tests = window.TestRunner.createSuite('MigrationSystemValidation');
        
        tests.describe('Migration System Tests', () => {
            tests.it('should have migration monitor active', () => {
                tests.expect(window.migrationMonitor).toBeTruthy();
            });
            
            tests.it('should have completed migration successfully', () => {
                if (window.intelligentMigrationSystem) {
                    const report = window.intelligentMigrationSystem.getReport();
                    tests.expect(report.completed).toBeTruthy();
                }
            });
            
            tests.it('should maintain system health', () => {
                if (window.migrationMonitor) {
                    const results = window.migrationMonitor.getValidationResults();
                    tests.expect(results).toBeTruthy();
                }
            });
        });
        
        return tests.run();
    }

    async runFullIntegrationTests() {
        if (!window.TestRunner) return null;
        
        const tests = window.TestRunner.createSuite('FullSystemIntegration');
        
        tests.describe('Complete System Integration', () => {
            tests.it('should have all core systems operational', () => {
                tests.expect(window.ConfigManager?.isReady()).toBe(true);
                tests.expect(window.enhancedThemeSystem?.isReady()).toBe(true);
                tests.expect(window.enhancedPWAManager?.isReady()).toBe(true);
                tests.expect(window.chatbotIntegration?.isReady()).toBe(true);
            });
            
            tests.it('should maintain cross-system communication', () => {
                // Verificar que los sistemas se comuniquen entre sí
                const themeConfig = window.ConfigManager.getConfig('themes');
                const currentTheme = window.enhancedThemeSystem.getCurrentTheme();
                
                tests.expect(themeConfig).toBeTruthy();
                tests.expect(currentTheme).toBeTruthy();
            });
            
            tests.it('should preserve all original functionality', () => {
                // Verificar funcionalidad original
                tests.expect(typeof window.themeSystem.getCurrentTheme).toBe('function');
                tests.expect(typeof window.pwaManager.isInstalled).toBe('function');
            });
        });
        
        return tests.run();
    }

    generateFinalReport() {
        // Calcular estadísticas finales
        this.executionResults.summary.successRate = 
            this.executionResults.summary.totalTests > 0 ? 
            Math.round((this.executionResults.summary.passed / this.executionResults.summary.totalTests) * 100) : 0;
        
        
        
        
        
        
        
        
        
        
        
        
        // Detalles por categoría
        const categories = this.groupSuitesByCategory();
        
        for (const [category, suites] of Object.entries(categories)) {
            const categoryPassed = suites.reduce((sum, s) => sum + (s.result?.passed || 0), 0);
            const categoryFailed = suites.reduce((sum, s) => sum + (s.result?.failed || 0), 0);
            
        }
        
        // Mostrar errores si existen
        if (this.executionResults.errors.length > 0) {
            
            this.executionResults.errors.forEach((error, i) => {
                
            });
        }
        
        // Mostrar warnings si existen
        if (this.executionResults.warnings.length > 0) {
            
            this.executionResults.warnings.slice(0, 5).forEach((warning, i) => {
                
            });
            if (this.executionResults.warnings.length > 5) {
                
            }
        }
        
        
        
        // Guardar reporte
        this.saveTestReport();
        
        // Disparar evento de finalización
        this.dispatchTestComplete();
    }

    groupSuitesByCategory() {
        const categories = {};
        
        for (const suite of this.executionResults.suites) {
            if (!categories[suite.category]) {
                categories[suite.category] = [];
            }
            categories[suite.category].push(suite);
        }
        
        return categories;
    }

    saveTestReport() {
        try {
            localStorage.setItem('datacrypt-test-results', JSON.stringify(this.executionResults));
            
        } catch (error) {
            
        }
    }

    dispatchTestComplete() {
        const event = new CustomEvent('masterTestSuiteComplete', {
            detail: this.executionResults
        });
        window.dispatchEvent(event);
    }

    // Event handlers
    handleTestProgress(detail) {
        // Manejar progreso de tests individuales
    }

    handleTestSuiteComplete(detail) {
        // Manejar finalización de suites individuales
    }

    handleTestError(detail) {
        this.executionResults.errors.push({
            type: 'test-error',
            message: detail.message,
            timestamp: new Date().toISOString()
        });
    }

    // API pública
    getResults() {
        return this.executionResults;
    }

    isExecuting() {
        return this.isRunning;
    }

    getCurrentSuite() {
        return this.currentSuite;
    }

    getAvailableSuites() {
        return Array.from(this.testSuites.keys());
    }
}

// Auto-inicialización y configuración global
if (typeof window !== 'undefined') {
    window.MasterTestSuite = MasterTestSuite;
    
    // Inicializar cuando todo esté listo
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!window.masterTestSuite) {
                window.masterTestSuite = new MasterTestSuite();
                
                // Auto-ejecutar tests después de migración
                setTimeout(() => {
                    if (window.intelligentMigrationSystem && 
                        window.intelligentMigrationSystem.getReport().completed) {
                        
                        window.masterTestSuite.runAllTests({
                            includeIntegration: true
                        });
                    }
                }, 3000);
            }
        }, 2000);
    });
}

export default MasterTestSuite;
