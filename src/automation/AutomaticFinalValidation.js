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
            
            return;
        }

        this.validationStarted = true;
        
        

        try {
            // Esperar a que todos los sistemas estén cargados
            await this.waitForSystemsReady();

            // 1. Ejecutar validación comprensiva
            
            await this.runComprehensiveValidation();

            // 2. Ejecutar verificación de deployment
            
            await this.runDeploymentCheck();

            // 3. Ejecutar suite de tests
            
            await this.runMasterTestSuite();

            // 4. Generar reporte final
            
            await this.generateFinalReport();

            

        } catch (error) {
            
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
                
                return;
            }

            await new Promise(resolve => setTimeout(resolve, checkInterval));
            waitTime += checkInterval;
        }

        
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
            
            return;
        }

        try {
            const masterSuite = new window.MasterTestSuite();
            await masterSuite.runAllTestSuites();
            
        } catch (error) {
            
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
        
        
        
        
        
        
        

        if (report.validation) {
            
        }

        if (report.deployment) {
            
        }

        
        
        report.recommendations.forEach((rec, index) => {
            
        });

        if (report.readyForProduction) {
            
            
            
            
            
        }
    }

    /**
     * ❌ MANEJAR ERRORES DE VALIDACIÓN
     */
    handleValidationError(error) {
        
        
        
        
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
    
    
    // Pequeña espera para asegurar que todos los scripts estén cargados
    setTimeout(async () => {
        const automaticValidation = new AutomaticFinalValidation();
        await automaticValidation.startAutomaticValidation();
    }, 2000); // 2 segundos de espera
});

// 🔄 EXPORTAR PARA USO GLOBAL
window.AutomaticFinalValidation = AutomaticFinalValidation;
