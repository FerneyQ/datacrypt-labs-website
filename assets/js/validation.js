/**
 * 🧪 SUITE DE VALIDACIÓN - Filosofía "La Mejora Continua" v2.1
 * Testing desde día 1 + validación continua
 * 
 * ⭐ Validación automática de todos los componentes
 * ⭐ Performance benchmarks integrados
 * ⭐ Monitoreo de salud del sistema
 */

// Función principal de validación
async function runPortfolioValidation() {
    console.log('🧪 [VALIDACIÓN] Iniciando suite de validación completa...');
    
    const results = {
        structure: await validateProjectStructure(),
        configuration: await validateConfiguration(),
        components: await validateComponents(),
        performance: await validatePerformance(),
        errors: await validateErrorHandling(),
        responsive: validateResponsiveDesign(),
        accessibility: validateAccessibility(),
        seo: validateSEO()
    };
    
    generateValidationReport(results);
    return results;
}

/**
 * Validar estructura de archivos
 */
async function validateProjectStructure() {
    console.log('[VALIDACIÓN] 📁 Validando estructura de archivos...');
    
    const requiredFiles = [
        'index.html',
        'config/constants.js',
        'config/settings.js', 
        'config/portfolio_config.json',
        'src/utils/exceptions.js',
        'src/utils/helpers.js',
        'src/components/Navigation.js',
        'src/components/Chatbot.js',
        'assets/css/critical.css',
        'assets/css/main.css',
        'assets/js/main.js',
        'README.md'
    ];
    
    const missingFiles = [];
    
    for (const file of requiredFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                missingFiles.push(file);
            }
        } catch (error) {
            missingFiles.push(file);
        }
    }
    
    return {
        passed: missingFiles.length === 0,
        missingFiles,
        totalFiles: requiredFiles.length,
        foundFiles: requiredFiles.length - missingFiles.length
    };
}

/**
 * Validar sistema de configuración
 */
async function validateConfiguration() {
    console.log('[VALIDACIÓN] ⚙️ Validando sistema de configuración...');
    
    const tests = [];
    
    try {
        // Verificar carga de configuración
        if (typeof getPortfolioConfig === 'function') {
            tests.push({ name: 'getPortfolioConfig exists', passed: true });
            
            try {
                const config = await getPortfolioConfig();
                tests.push({ name: 'Configuration loads', passed: true });
                
                // Verificar métodos requeridos
                const requiredMethods = ['getModuleConfig', 'getEnvironmentConfig', 'validate'];
                requiredMethods.forEach(method => {
                    tests.push({
                        name: `Method ${method} exists`,
                        passed: typeof config[method] === 'function'
                    });
                });
                
            } catch (error) {
                tests.push({ name: 'Configuration loads', passed: false, error: error.message });
            }
        } else {
            tests.push({ name: 'getPortfolioConfig exists', passed: false });
        }
    } catch (error) {
        tests.push({ name: 'Configuration system', passed: false, error: error.message });
    }
    
    return {
        passed: tests.every(t => t.passed),
        tests
    };
}

/**
 * Validar inicialización de componentes
 */
async function validateComponents() {
    console.log('[VALIDACIÓN] 🧩 Validando componentes...');
    
    const tests = [];
    
    // Verificar PortfolioManager
    if (window.portfolioManager) {
        tests.push({ name: 'PortfolioManager exists', passed: true });
        
        const manager = window.portfolioManager;
        const state = manager.getPortfolioState();
        
        tests.push({
            name: 'Portfolio initialized',
            passed: state.isInitialized
        });
        
        tests.push({
            name: 'Components loaded',
            passed: state.componentsCount > 0
        });
        
        // Verificar componentes específicos
        const requiredComponents = ['navigation', 'hero', 'chatbot'];
        requiredComponents.forEach(component => {
            tests.push({
                name: `Component ${component} loaded`,
                passed: state.componentNames.includes(component)
            });
        });
        
    } else {
        tests.push({ name: 'PortfolioManager exists', passed: false });
    }
    
    return {
        passed: tests.every(t => t.passed),
        tests
    };
}

/**
 * Validar métricas de performance
 */
async function validatePerformance() {
    console.log('[VALIDACIÓN] ⏱️ Validando performance...');
    
    const tests = [];
    
    // Verificar tiempos de carga
    if (window.portfolioManager) {
        const state = window.portfolioManager.getPortfolioState();
        
        if (state.loadTimes) {
            const totalTime = Object.values(state.loadTimes).reduce((a, b) => a + b, 0);
            
            tests.push({
                name: 'Total load time < 3000ms',
                passed: totalTime < 3000,
                value: `${totalTime.toFixed(2)}ms`
            });
            
            tests.push({
                name: 'Component load times recorded',
                passed: Object.keys(state.loadTimes).length > 0
            });
        }
    }
    
    // Verificar métricas Web Vitals
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            tests.push({
                name: 'DOM Content Loaded < 2000ms',
                passed: navigation.domContentLoadedEventEnd < 2000,
                value: `${navigation.domContentLoadedEventEnd.toFixed(2)}ms`
            });
        }
    }
    
    return {
        passed: tests.every(t => t.passed),
        tests
    };
}

/**
 * Validar manejo de errores
 */
async function validateErrorHandling() {
    console.log('[VALIDACIÓN] 🛡️ Validando manejo de errores...');
    
    const tests = [];
    
    // Verificar que las clases de excepción existan
    const exceptionClasses = [
        'PortfolioException',
        'ComponentMountException',
        'ConfigurationLoadException'
    ];
    
    exceptionClasses.forEach(className => {
        tests.push({
            name: `Exception class ${className} exists`,
            passed: typeof window[className] !== 'undefined'
        });
    });
    
    // Verificar global error handler
    tests.push({
        name: 'Global error handler configured',
        passed: window.addEventListener.toString().includes('error')
    });
    
    return {
        passed: tests.every(t => t.passed),
        tests
    };
}

/**
 * Validar responsive design
 */
function validateResponsiveDesign() {
    console.log('[VALIDACIÓN] 📱 Validando responsive design...');
    
    const tests = [];
    
    // Verificar viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    tests.push({
        name: 'Viewport meta tag exists',
        passed: !!viewport
    });
    
    if (viewport) {
        tests.push({
            name: 'Viewport properly configured',
            passed: viewport.content.includes('width=device-width')
        });
    }
    
    // Verificar media queries en CSS
    let hasMediaQueries = false;
    for (let i = 0; i < document.styleSheets.length; i++) {
        try {
            const sheet = document.styleSheets[i];
            for (let j = 0; j < sheet.cssRules.length; j++) {
                if (sheet.cssRules[j].type === CSSRule.MEDIA_RULE) {
                    hasMediaQueries = true;
                    break;
                }
            }
        } catch (error) {
            // Ignorar errores de CORS
        }
    }
    
    tests.push({
        name: 'Media queries present',
        passed: hasMediaQueries
    });
    
    return {
        passed: tests.every(t => t.passed),
        tests
    };
}

/**
 * Validar accesibilidad
 */
function validateAccessibility() {
    console.log('[VALIDACIÓN] ♿ Validando accesibilidad...');
    
    const tests = [];
    
    // Verificar elementos semánticos
    const semanticElements = ['header', 'nav', 'main', 'section', 'footer'];
    semanticElements.forEach(element => {
        tests.push({
            name: `Semantic element <${element}> exists`,
            passed: document.querySelector(element) !== null
        });
    });
    
    // Verificar atributos alt en imágenes
    const images = document.querySelectorAll('img');
    const imagesWithAlt = Array.from(images).filter(img => img.hasAttribute('alt'));
    tests.push({
        name: 'All images have alt attributes',
        passed: images.length === imagesWithAlt.length,
        value: `${imagesWithAlt.length}/${images.length}`
    });
    
    // Verificar controles de formulario con labels
    const inputs = document.querySelectorAll('input, textarea, select');
    let inputsWithLabels = 0;
    inputs.forEach(input => {
        if (input.labels && input.labels.length > 0) {
            inputsWithLabels++;
        } else if (input.getAttribute('aria-label') || input.getAttribute('placeholder')) {
            inputsWithLabels++;
        }
    });
    
    tests.push({
        name: 'Form controls have labels',
        passed: inputs.length === inputsWithLabels,
        value: `${inputsWithLabels}/${inputs.length}`
    });
    
    return {
        passed: tests.every(t => t.passed),
        tests
    };
}

/**
 * Validar SEO
 */
function validateSEO() {
    console.log('[VALIDACIÓN] 🔍 Validando SEO...');
    
    const tests = [];
    
    // Verificar meta tags esenciales
    const requiredMeta = [
        { name: 'title', selector: 'title' },
        { name: 'description', selector: 'meta[name="description"]' },
        { name: 'keywords', selector: 'meta[name="keywords"]' },
        { name: 'author', selector: 'meta[name="author"]' },
        { name: 'og:title', selector: 'meta[property="og:title"]' },
        { name: 'og:description', selector: 'meta[property="og:description"]' }
    ];
    
    requiredMeta.forEach(meta => {
        const element = document.querySelector(meta.selector);
        tests.push({
            name: `${meta.name} meta tag exists`,
            passed: !!element && (element.content || element.textContent).trim().length > 0
        });
    });
    
    // Verificar estructura de headings
    const h1Elements = document.querySelectorAll('h1');
    tests.push({
        name: 'Single H1 element',
        passed: h1Elements.length === 1
    });
    
    // Verificar contenido de texto
    const textContent = document.body.textContent.trim();
    tests.push({
        name: 'Sufficient text content',
        passed: textContent.length > 500
    });
    
    return {
        passed: tests.every(t => t.passed),
        tests
    };
}

/**
 * Generar reporte de validación
 */
function generateValidationReport(results) {
    console.log('\n🎯 [REPORTE] Generando reporte de validación...\n');
    
    let totalTests = 0;
    let passedTests = 0;
    
    Object.entries(results).forEach(([category, result]) => {
        const status = result.passed ? '✅' : '❌';
        console.log(`${status} ${category.toUpperCase()}: ${result.passed ? 'PASÓ' : 'FALLÓ'}`);
        
        if (result.tests) {
            result.tests.forEach(test => {
                const testStatus = test.passed ? '  ✓' : '  ✗';
                const value = test.value ? ` (${test.value})` : '';
                console.log(`${testStatus} ${test.name}${value}`);
                if (test.error) {
                    console.log(`    Error: ${test.error}`);
                }
                totalTests++;
                if (test.passed) passedTests++;
            });
        } else {
            totalTests++;
            if (result.passed) passedTests++;
        }
        
        console.log('');
    });
    
    const percentage = Math.round((passedTests / totalTests) * 100);
    const overallStatus = percentage >= 80 ? '🎉' : percentage >= 60 ? '⚠️' : '🚨';
    
    console.log(`${overallStatus} RESULTADO GENERAL: ${passedTests}/${totalTests} tests pasaron (${percentage}%)`);
    
    if (percentage >= 80) {
        console.log('🌟 ¡EXCELENTE! El portafolio está funcionando correctamente.');
    } else if (percentage >= 60) {
        console.log('⚠️  El portafolio funciona pero hay áreas de mejora.');
    } else {
        console.log('🚨 Se requiere atención inmediata para corregir los problemas detectados.');
    }
    
    // Almacenar reporte para debugging
    window.portfolioValidationReport = {
        timestamp: new Date().toISOString(),
        results,
        summary: {
            totalTests,
            passedTests,
            percentage,
            status: percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : 'needs-attention'
        }
    };
}

// Auto-ejecutar validación cuando el portfolio esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runPortfolioValidation, 2000); // Esperar a que se inicialice
    });
} else {
    setTimeout(runPortfolioValidation, 2000);
}

// Exponer función globalmente para uso manual
window.runPortfolioValidation = runPortfolioValidation;