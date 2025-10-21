/**
 * 🚀 AUTOMATIC FINAL VALIDATION v2.1
 * Script de validación automática que se ejecuta al cargar la página
 * 
 * Filosofía Mejora Continua v2.1:
 * - Validación automática al inicio
 * - Reporte completo de estado
 * - Preparación para deployment
 * - Optimización continua
 */

class AutomaticFinalValidation {
    constructor() {
        this.validationStarted = false;
        this.validationResults = null;
        this.deploymentResults = null;
    }

    /**
     * 🚀 INICIAR VALIDACIÓN AUTOMÁTICA
     */
    async startAutomaticValidation() {
        if (this.validationStarted) {
            console.log('⚠️ Validación ya iniciada');
            return;
        }

        this.validationStarted = true;
        console.log('🚀 INICIANDO VALIDACIÓN AUTOMÁTICA FINAL...');
        console.log('='.repeat(70));

        try {
            // Esperar a que todos los sistemas estén cargados
            await this.waitForSystemsReady();

            // 1. Ejecutar validación comprensiva
            console.log('🔍 Paso 1: Ejecutando validación comprensiva...');
            await this.runComprehensiveValidation();

            // 2. Ejecutar verificación de deployment
            console.log('🚀 Paso 2: Ejecutando verificación de deployment...');
            await this.runDeploymentCheck();

            // 3. Ejecutar suite de tests
            console.log('🧪 Paso 3: Ejecutando suite completa de tests...');
            await this.runMasterTestSuite();

            // 4. Generar reporte final
            console.log('📊 Paso 4: Generando reporte final...');
            await this.generateFinalReport();

            console.log('✅ VALIDACIÓN AUTOMÁTICA COMPLETADA');

        } catch (error) {
            console.error('❌ Error en validación automática:', error);
            this.handleValidationError(error);
        }
    }

    /**
     * ⏳ ESPERAR A QUE SISTEMAS ESTÉN LISTOS
     */
    async waitForSystemsReady() {
        const requiredSystems = [
            'configManager',
            'themeSystem', 
            'pwaManager',
            'dataCryptChatbot',
            'continuousMonitoring',
            'ComprehensiveValidator',
            'FinalDeploymentChecker'
        ];

        const maxWaitTime = 10000; // 10 segundos
        const checkInterval = 100; // 100ms
        let waitTime = 0;

        while (waitTime < maxWaitTime) {
            const allReady = requiredSystems.every(system => window[system] !== undefined);
            
            if (allReady) {
                console.log('✅ Todos los sistemas están listos');
                return;
            }

            await new Promise(resolve => setTimeout(resolve, checkInterval));
            waitTime += checkInterval;
        }

        console.warn('⚠️ Algunos sistemas no están listos, continuando con validación...');
    }

    /**
     * 🔍 EJECUTAR VALIDACIÓN COMPRENSIVA
     */
    async runComprehensiveValidation() {
        if (!window.ComprehensiveValidator) {
            throw new Error('ComprehensiveValidator no disponible');
        }

        const validator = new window.ComprehensiveValidator();
        this.validationResults = await validator.validateComplete();

        console.log('🔍 Validación comprensiva completada:', 
                   this.validationResults.overallStatus);
    }

    /**
     * 🚀 EJECUTAR VERIFICACIÓN DE DEPLOYMENT
     */
    async runDeploymentCheck() {
        if (!window.FinalDeploymentChecker) {
            throw new Error('FinalDeploymentChecker no disponible');
        }

        const checker = new window.FinalDeploymentChecker();
        this.deploymentResults = await checker.runCompleteDeploymentCheck();

        console.log('🚀 Verificación de deployment completada:', 
                   this.deploymentResults.status);
    }

    /**
     * 🧪 EJECUTAR SUITE COMPLETA DE TESTS
     */
    async runMasterTestSuite() {
        if (!window.MasterTestSuite) {
            console.warn('⚠️ MasterTestSuite no disponible, saltando tests');
            return;
        }

        try {
            const masterSuite = new window.MasterTestSuite();
            await masterSuite.runAllTestSuites();
            console.log('🧪 Suite de tests completada');
        } catch (error) {
            console.warn('⚠️ Error en suite de tests:', error.message);
        }
    }

    /**
     * 📊 GENERAR REPORTE FINAL
     */
    async generateFinalReport() {
        const report = {
            timestamp: new Date().toISOString(),
            validation: this.validationResults,
            deployment: this.deploymentResults,
            overallStatus: this.calculateOverallStatus(),
            recommendations: this.generateRecommendations(),
            readyForProduction: this.isReadyForProduction()
        };

        this.displayFinalReport(report);
        
        // Guardar reporte en el storage para referencia
        if (window.configManager) {
            window.configManager.set('validation.lastReport', report);
        }

        return report;
    }

    /**
     * 📊 CALCULAR ESTADO GENERAL
     */
    calculateOverallStatus() {
        if (!this.validationResults || !this.deploymentResults) {
            return 'INCOMPLETE';
        }

        const validationOK = this.validationResults.overallStatus === 'PASS';
        const deploymentOK = this.deploymentResults.deploymentReady;

        if (validationOK && deploymentOK) return 'EXCELLENT';
        if (validationOK || deploymentOK) return 'GOOD';
        return 'NEEDS_IMPROVEMENT';
    }

    /**
     * 💡 GENERAR RECOMENDACIONES
     */
    generateRecommendations() {
        const recommendations = [];

        if (this.validationResults?.errors?.length > 0) {
            recommendations.push({
                type: 'CRITICAL',
                message: `Resolver ${this.validationResults.errors.length} errores críticos`
            });
        }

        if (this.deploymentResults && !this.deploymentResults.deploymentReady) {
            recommendations.push({
                type: 'DEPLOYMENT',
                message: 'Completar verificaciones de deployment antes de producción'
            });
        }

        if (this.validationResults?.overallStatus === 'WARNING') {
            recommendations.push({
                type: 'OPTIMIZATION',
                message: 'Optimizar warnings para mejor rendimiento'
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                type: 'SUCCESS',
                message: '🎉 Sistema completamente validado y listo para producción'
            });
        }

        return recommendations;
    }

    /**
     * ✅ VERIFICAR SI ESTÁ LISTO PARA PRODUCCIÓN
     */
    isReadyForProduction() {
        return this.validationResults?.overallStatus === 'PASS' &&
               this.deploymentResults?.deploymentReady === true;
    }

    /**
     * 📊 MOSTRAR REPORTE FINAL
     */
    displayFinalReport(report) {
        console.log('');
        console.log('📊 REPORTE FINAL DE VALIDACIÓN AUTOMÁTICA');
        console.log('='.repeat(70));
        console.log(`⏰ Timestamp: ${report.timestamp}`);
        console.log(`📊 Estado General: ${report.overallStatus}`);
        console.log(`🚀 Listo para Producción: ${report.readyForProduction ? 'SÍ' : 'NO'}`);
        console.log('');

        if (report.validation) {
            console.log(`🔍 Validación: ${report.validation.overallStatus}`);
        }

        if (report.deployment) {
            console.log(`🚀 Deployment: ${report.deployment.status}`);
        }

        console.log('');
        console.log('💡 RECOMENDACIONES:');
        report.recommendations.forEach((rec, index) => {
            console.log(`  ${index + 1}. [${rec.type}] ${rec.message}`);
        });

        if (report.readyForProduction) {
            console.log('');
            console.log('🎉 ¡FELICITACIONES!');
            console.log('✅ El sistema ha pasado todas las validaciones');
            console.log('🚀 Está listo para deployment en producción');
            console.log('📊 Monitoreo continuo activo');
        }
    }

    /**
     * ❌ MANEJAR ERRORES DE VALIDACIÓN
     */
    handleValidationError(error) {
        console.error('❌ ERROR CRÍTICO EN VALIDACIÓN:');
        console.error(`   Mensaje: ${error.message}`);
        console.error(`   Stack: ${error.stack}`);
        
        // Notificar al chatbot si está disponible
        if (window.dataCryptChatbot) {
            window.dataCryptChatbot.addMessage(
                `❌ Error crítico en validación: ${error.message}`,
                'assistant'
            );
        }
    }
}

// 🚀 EJECUTAR VALIDACIÓN AUTOMÁTICA AL CARGAR
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando validación automática...');
    
    // Pequeña espera para asegurar que todos los scripts estén cargados
    setTimeout(async () => {
        const automaticValidation = new AutomaticFinalValidation();
        await automaticValidation.startAutomaticValidation();
    }, 2000); // 2 segundos de espera
});

// 🔄 EXPORTAR PARA USO GLOBAL
window.AutomaticFinalValidation = AutomaticFinalValidation;