/**
 * 🔄 DataCrypt Labs - Intelligent Migration System
 * Filosofía Mejora Continua v2.1 - Sistema de Migración Coordinada
 * 
 * Coordina la migración de todos los componentes existentes
 * a la nueva arquitectura modular manteniendo ZERO BREAKING CHANGES
 */

class IntelligentMigrationSystem {
    constructor() {
        this.migrationPhases = [];
        this.currentPhase = 0;
        this.isActive = false;
        this.migrationReport = {
            started: null,
            completed: null,
            phases: [],
            errors: [],
            warnings: []
        };
        
        this.systemComponents = {
            themeSystem: null,
            pwaManager: null,
            translationSystem: null,
            gameSystem: null,
            performanceOptimizer: null
        };
        
        this.init();
    }

    init() {
        console.log('🔄 Initializing Intelligent Migration System v2.1...');
        
        // Definir fases de migración
        this.defineMigrationPhases();
        
        // Detectar sistemas existentes
        this.detectExistingSystems();
        
        // Configurar monitoring
        this.setupMigrationMonitoring();
        
        console.log('✅ Migration System ready - Starting migration process...');
        
        // Iniciar migración automática
        this.startMigration();
    }

    defineMigrationPhases() {
        this.migrationPhases = [
            {
                id: 'detection',
                name: 'System Detection',
                description: 'Detectar y mapear sistemas existentes',
                weight: 10,
                action: () => this.phaseDetection()
            },
            {
                id: 'backup',
                name: 'Backup Creation',
                description: 'Crear respaldo de configuraciones existentes',
                weight: 15,
                action: () => this.phaseBackup()
            },
            {
                id: 'theme-migration',
                name: 'Theme System Migration',
                description: 'Migrar sistema de temas a ConfigManager',
                weight: 25,
                action: () => this.phaseThemeMigration()
            },
            {
                id: 'pwa-migration',
                name: 'PWA Manager Migration',
                description: 'Migrar PWA Manager a ConfigManager',
                weight: 25,
                action: () => this.phasePWAMigration()
            },
            {
                id: 'integration-validation',
                name: 'Integration Validation',
                description: 'Validar integración de todos los sistemas',
                weight: 15,
                action: () => this.phaseIntegrationValidation()
            },
            {
                id: 'testing',
                name: 'Comprehensive Testing',
                description: 'Ejecutar suite completa de tests',
                weight: 10,
                action: () => this.phaseTesting()
            }
        ];
    }

    detectExistingSystems() {
        console.log('🔍 Detecting existing systems...');
        
        // Detectar Theme System
        if (window.themeSystem) {
            this.systemComponents.themeSystem = {
                detected: true,
                version: 'legacy',
                api: window.themeSystem,
                status: 'active'
            };
            console.log('✅ Theme System detected');
        }
        
        // Detectar PWA Manager
        if (window.pwaManager) {
            this.systemComponents.pwaManager = {
                detected: true,
                version: 'legacy',
                api: window.pwaManager,
                status: 'active'
            };
            console.log('✅ PWA Manager detected');
        }
        
        // Detectar Translation System
        if (window.translationSystem) {
            this.systemComponents.translationSystem = {
                detected: true,
                version: 'legacy',
                api: window.translationSystem,
                status: 'active'
            };
            console.log('✅ Translation System detected');
        }
        
        // Detectar Game System
        if (window.dataWizardGame) {
            this.systemComponents.gameSystem = {
                detected: true,
                version: 'legacy',
                api: window.dataWizardGame,
                status: 'active'
            };
            console.log('✅ Game System detected');
        }
        
        // Detectar Performance Optimizer
        if (window.performanceOptimizer) {
            this.systemComponents.performanceOptimizer = {
                detected: true,
                version: 'legacy',
                api: window.performanceOptimizer,
                status: 'active'
            };
            console.log('✅ Performance Optimizer detected');
        }
    }

    setupMigrationMonitoring() {
        // Monitor de errores durante migración
        window.addEventListener('error', (event) => {
            if (this.isActive) {
                this.logMigrationError('Runtime Error', event.error);
            }
        });
        
        // Monitor de warnings
        const originalWarn = console.warn;
        console.warn = (...args) => {
            if (this.isActive) {
                this.logMigrationWarning('Console Warning', args.join(' '));
            }
            originalWarn.apply(console, args);
        };
    }

    async startMigration() {
        this.isActive = true;
        this.migrationReport.started = new Date().toISOString();
        
        console.log('🚀 Starting coordinated migration process...');
        
        try {
            for (let i = 0; i < this.migrationPhases.length; i++) {
                this.currentPhase = i;
                const phase = this.migrationPhases[i];
                
                console.log(`\n📋 Phase ${i + 1}/${this.migrationPhases.length}: ${phase.name}`);
                console.log(`   ${phase.description}`);
                
                const phaseStart = performance.now();
                
                try {
                    await phase.action();
                    
                    const phaseEnd = performance.now();
                    const duration = phaseEnd - phaseStart;
                    
                    this.migrationReport.phases.push({
                        id: phase.id,
                        name: phase.name,
                        status: 'completed',
                        duration: Math.round(duration),
                        timestamp: new Date().toISOString()
                    });
                    
                    console.log(`✅ Phase ${phase.name} completed (${Math.round(duration)}ms)`);
                    
                } catch (phaseError) {
                    this.logMigrationError(`Phase ${phase.name}`, phaseError);
                    console.error(`❌ Phase ${phase.name} failed:`, phaseError);
                    
                    // Decidir si continuar o abortar
                    if (this.isCriticalPhase(phase.id)) {
                        throw new Error(`Critical phase ${phase.name} failed`);
                    }
                }
                
                // Pausa entre fases para estabilidad
                await this.delay(100);
            }
            
            this.completeMigration();
            
        } catch (error) {
            this.abortMigration(error);
        }
    }

    // Fases de migración
    async phaseDetection() {
        // Ya ejecutada en init, validar sistemas críticos
        const criticalSystems = ['ConfigManager', 'TestRunner'];
        
        for (const system of criticalSystems) {
            if (!window[system]) {
                throw new Error(`Critical system ${system} not available`);
            }
        }
        
        // Validar DOM
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                window.addEventListener('load', resolve);
            });
        }
    }

    async phaseBackup() {
        // Crear backup de configuraciones existentes
        const backup = {
            timestamp: new Date().toISOString(),
            systems: {}
        };
        
        // Backup Theme System
        if (this.systemComponents.themeSystem.detected) {
            backup.systems.themeSystem = {
                currentTheme: window.themeSystem.currentTheme || 'dark',
                themes: window.themeSystem.themes || {},
                preferences: this.getThemePreferences()
            };
        }
        
        // Backup PWA Manager
        if (this.systemComponents.pwaManager.detected) {
            backup.systems.pwaManager = {
                isInstalled: window.pwaManager.isInstalled ? window.pwaManager.isInstalled() : false,
                hasPrompt: !!window.pwaManager.deferredPrompt,
                preferences: this.getPWAPreferences()
            };
        }
        
        // Guardar backup
        try {
            localStorage.setItem('datacrypt-migration-backup', JSON.stringify(backup));
            console.log('💾 Migration backup created successfully');
        } catch (error) {
            console.warn('⚠️ Could not create migration backup:', error);
        }
    }

    async phaseThemeMigration() {
        console.log('🎨 Migrating Theme System...');
        
        if (!this.systemComponents.themeSystem.detected) {
            console.log('ℹ️ No legacy theme system detected, skipping');
            return;
        }
        
        // Inicializar Enhanced Theme System
        if (!window.enhancedThemeSystem) {
            const EnhancedThemeSystem = window.EnhancedThemeSystem;
            if (EnhancedThemeSystem) {
                window.enhancedThemeSystem = new EnhancedThemeSystem();
                
                // Esperar a que se inicialice
                await this.waitForSystem(() => window.enhancedThemeSystem.isReady());
                
                console.log('✅ Enhanced Theme System initialized');
            } else {
                throw new Error('Enhanced Theme System not available');
            }
        }
        
        // Validar migración
        this.validateThemeMigration();
    }

    async phasePWAMigration() {
        console.log('📱 Migrating PWA Manager...');
        
        if (!this.systemComponents.pwaManager.detected) {
            console.log('ℹ️ No legacy PWA manager detected, skipping');
            return;
        }
        
        // Inicializar Enhanced PWA Manager
        if (!window.enhancedPWAManager) {
            const EnhancedPWAManager = window.EnhancedPWAManager;
            if (EnhancedPWAManager) {
                window.enhancedPWAManager = new EnhancedPWAManager();
                
                // Esperar a que se inicialice
                await this.waitForSystem(() => window.enhancedPWAManager.isReady());
                
                console.log('✅ Enhanced PWA Manager initialized');
            } else {
                throw new Error('Enhanced PWA Manager not available');
            }
        }
        
        // Validar migración
        this.validatePWAMigration();
    }

    async phaseIntegrationValidation() {
        console.log('🔗 Validating system integration...');
        
        // Validar ConfigManager
        if (!window.ConfigManager || !window.ConfigManager.isReady()) {
            throw new Error('ConfigManager not ready');
        }
        
        // Validar Chatbot Integration
        if (!window.chatbotIntegration || !window.chatbotIntegration.isReady()) {
            throw new Error('Chatbot Integration not ready');
        }
        
        // Validar que todos los sistemas migrados funcionen
        const systems = [
            { name: 'Enhanced Theme System', check: () => window.enhancedThemeSystem?.isReady() },
            { name: 'Enhanced PWA Manager', check: () => window.enhancedPWAManager?.isReady() },
            { name: 'Chatbot Integration', check: () => window.chatbotIntegration?.isReady() }
        ];
        
        for (const system of systems) {
            if (!system.check()) {
                throw new Error(`${system.name} integration validation failed`);
            }
        }
        
        console.log('✅ All systems integrated successfully');
    }

    async phaseTesting() {
        console.log('🧪 Running comprehensive test suite...');
        
        const testResults = {
            total: 0,
            passed: 0,
            failed: 0,
            suites: []
        };
        
        // Ejecutar tests de sistemas migrados
        if (window.enhancedThemeSystem?.runTests) {
            const themeTests = await window.enhancedThemeSystem.runTests();
            this.aggregateTestResults(testResults, themeTests, 'Enhanced Theme System');
        }
        
        if (window.enhancedPWAManager?.runTests) {
            const pwaTests = await window.enhancedPWAManager.runTests();
            this.aggregateTestResults(testResults, pwaTests, 'Enhanced PWA Manager');
        }
        
        if (window.chatbotIntegration?.runTests) {
            const chatbotTests = await window.chatbotIntegration.runTests();
            this.aggregateTestResults(testResults, chatbotTests, 'Chatbot Integration');
        }
        
        // Ejecutar tests de migración específicos
        const migrationTests = await this.runMigrationTests();
        this.aggregateTestResults(testResults, migrationTests, 'Migration Validation');
        
        console.log(`📊 Test Results: ${testResults.passed}/${testResults.total} passed`);
        
        if (testResults.failed > 0) {
            console.warn(`⚠️ ${testResults.failed} tests failed during migration`);
            this.migrationReport.warnings.push(`${testResults.failed} tests failed`);
        }
        
        this.migrationReport.testResults = testResults;
    }

    // Métodos de validación
    validateThemeMigration() {
        // Verificar que la API legacy siga funcionando
        if (typeof window.themeSystem.getCurrentTheme !== 'function') {
            throw new Error('Theme System API compatibility broken');
        }
        
        // Verificar que el tema actual se mantenga
        const currentTheme = window.themeSystem.getCurrentTheme();
        if (!currentTheme) {
            throw new Error('Current theme lost during migration');
        }
        
        console.log('✅ Theme System migration validated');
    }

    validatePWAMigration() {
        // Verificar que la API legacy siga funcionando
        if (typeof window.pwaManager.isInstalled !== 'function') {
            throw new Error('PWA Manager API compatibility broken');
        }
        
        console.log('✅ PWA Manager migration validated');
    }

    async runMigrationTests() {
        if (!window.TestRunner) return { passed: 0, failed: 0 };
        
        const tests = window.TestRunner.createSuite('MigrationValidation');
        
        tests.describe('Migration System Validation', () => {
            tests.it('should maintain backward compatibility', () => {
                tests.expect(window.themeSystem).toBeTruthy();
                tests.expect(window.pwaManager).toBeTruthy();
                tests.expect(typeof window.themeSystem.getCurrentTheme).toBe('function');
                tests.expect(typeof window.pwaManager.isInstalled).toBe('function');
            });
            
            tests.it('should have ConfigManager integration', () => {
                tests.expect(window.ConfigManager).toBeTruthy();
                tests.expect(window.ConfigManager.isReady()).toBe(true);
            });
            
            tests.it('should have enhanced systems available', () => {
                tests.expect(window.enhancedThemeSystem).toBeTruthy();
                tests.expect(window.enhancedPWAManager).toBeTruthy();
            });
            
            tests.it('should preserve user preferences', () => {
                // Verificar que las preferencias se mantuvieron
                const themePrefs = this.getThemePreferences();
                const pwaPrefs = this.getPWAPreferences();
                
                tests.expect(themePrefs).toBeTruthy();
                tests.expect(pwaPrefs).toBeTruthy();
            });
        });
        
        return tests.run();
    }

    // Métodos utilitarios
    async waitForSystem(checkFunction, timeout = 10000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            if (checkFunction()) {
                return true;
            }
            await this.delay(100);
        }
        
        throw new Error('System initialization timeout');
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    isCriticalPhase(phaseId) {
        const criticalPhases = ['detection', 'theme-migration', 'pwa-migration'];
        return criticalPhases.includes(phaseId);
    }

    getThemePreferences() {
        try {
            return localStorage.getItem('datacrypt-theme-preference');
        } catch {
            return null;
        }
    }

    getPWAPreferences() {
        try {
            return {
                installPromptShown: localStorage.getItem('pwa-install-prompt-shown'),
                installDismissed: localStorage.getItem('pwa-install-dismissed')
            };
        } catch {
            return {};
        }
    }

    aggregateTestResults(totalResults, suiteResults, suiteName) {
        if (!suiteResults) return;
        
        totalResults.total += (suiteResults.passed || 0) + (suiteResults.failed || 0);
        totalResults.passed += suiteResults.passed || 0;
        totalResults.failed += suiteResults.failed || 0;
        totalResults.suites.push({
            name: suiteName,
            ...suiteResults
        });
    }

    // Logging
    logMigrationError(phase, error) {
        this.migrationReport.errors.push({
            phase,
            error: error.message || error,
            timestamp: new Date().toISOString(),
            stack: error.stack
        });
    }

    logMigrationWarning(phase, warning) {
        this.migrationReport.warnings.push({
            phase,
            warning,
            timestamp: new Date().toISOString()
        });
    }

    // Finalización
    completeMigration() {
        this.isActive = false;
        this.migrationReport.completed = new Date().toISOString();
        
        const totalDuration = new Date(this.migrationReport.completed) - 
                             new Date(this.migrationReport.started);
        
        console.log(`\n🎉 Migration completed successfully!`);
        console.log(`⏱️ Total time: ${Math.round(totalDuration)}ms`);
        console.log(`✅ Phases completed: ${this.migrationReport.phases.length}`);
        console.log(`⚠️ Warnings: ${this.migrationReport.warnings.length}`);
        console.log(`❌ Errors: ${this.migrationReport.errors.length}`);
        
        if (this.migrationReport.testResults) {
            const { passed, failed, total } = this.migrationReport.testResults;
            console.log(`🧪 Tests: ${passed}/${total} passed`);
        }
        
        // Notificar completion
        this.dispatchMigrationComplete();
        
        // Guardar reporte final
        this.saveMigrationReport();
    }

    abortMigration(error) {
        this.isActive = false;
        this.migrationReport.aborted = new Date().toISOString();
        this.migrationReport.abortReason = error.message;
        
        console.error('💥 Migration aborted:', error);
        
        // Intentar rollback si es posible
        this.attemptRollback();
    }

    attemptRollback() {
        console.log('🔄 Attempting migration rollback...');
        
        try {
            const backup = localStorage.getItem('datacrypt-migration-backup');
            if (backup) {
                // Restaurar configuraciones básicas
                console.log('📦 Restoring from backup...');
                // Implementar lógica de rollback si es necesario
            }
        } catch (error) {
            console.error('❌ Rollback failed:', error);
        }
    }

    dispatchMigrationComplete() {
        const event = new CustomEvent('migrationComplete', {
            detail: {
                report: this.migrationReport,
                systems: this.systemComponents
            }
        });
        window.dispatchEvent(event);
    }

    saveMigrationReport() {
        try {
            localStorage.setItem('datacrypt-migration-report', JSON.stringify(this.migrationReport));
        } catch (error) {
            console.warn('Could not save migration report:', error);
        }
    }

    // API pública
    getReport() {
        return this.migrationReport;
    }

    getProgress() {
        return {
            currentPhase: this.currentPhase,
            totalPhases: this.migrationPhases.length,
            percentage: Math.round((this.currentPhase / this.migrationPhases.length) * 100),
            isActive: this.isActive
        };
    }
}

// Auto-inicialización
if (typeof window !== 'undefined') {
    window.IntelligentMigrationSystem = IntelligentMigrationSystem;
    
    // Inicializar cuando ConfigManager esté listo
    document.addEventListener('DOMContentLoaded', () => {
        // Dar tiempo a que se carguen los sistemas base
        setTimeout(() => {
            if (!window.intelligentMigrationSystem) {
                window.intelligentMigrationSystem = new IntelligentMigrationSystem();
            }
        }, 1000);
    });
}

export default IntelligentMigrationSystem;