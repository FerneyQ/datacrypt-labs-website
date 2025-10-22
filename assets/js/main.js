/**
 * 🚀 DATACRYPT_LABS - MAIN ENTRY POINT v3.0
 * Punto de entrada simplificado usando Sistema Unificado
 * Filosofía Mejora Continua: Eliminación de duplicaciones
 * 
 * IMPORTA Y USA:
 * - DataCryptUnifiedManager (2,700+ líneas de duplicación eliminadas)
 * - ConfigurationService (configuración centralizada)
 * 
 * REEMPLAZA:
 * - DataCryptLabsManager original (833 líneas)
 * - DATACRYPT_CONFIG fragmentado
 * - Lógica de inicialización duplicada
 */

/**
 * 🎯 MANAGER SIMPLIFICADO - DELEGACIÓN AL SISTEMA UNIFICADO
 * Esta clase se mantiene por compatibilidad pero delega toda la lógica
 * al DataCryptUnifiedManager para eliminar duplicaciones
 */
class DataCryptLabsManager {
    constructor() {
        // Singleton para evitar múltiples instancias
        if (DataCryptLabsManager.instance) {
            return DataCryptLabsManager.instance;
        }
        DataCryptLabsManager.instance = this;

        // Delegación al sistema unificado (solo si está disponible)
        this.unifiedManager = null;
        this.configService = null;

        // Estado de compatibilidad
        this.isInitialized = false;
        this.components = new Map();
        this.initStartTime = performance.now();

        // Auto-bind para compatibilidad
        this.initialize = this.initialize.bind(this);

        console.log('🎯 DataCryptLabsManager v3.0 - Modo Compatibilidad Activado');
    }

    /**
     * 🚀 INICIALIZACIÓN PRINCIPAL - DELEGADA AL SISTEMA UNIFICADO
     */
    async initialize() {
        try {
            console.log('🚀 Iniciando DataCrypt Labs...');

            // Intentar cargar sistema unificado
            await this.loadUnifiedSystem();

            // Si el sistema unificado está disponible, delegamos
            if (this.unifiedManager) {
                console.log('✅ Delegando a DataCryptUnifiedManager');
                const result = await this.unifiedManager.init();
                this.isInitialized = result;
                return result;
            }

            // Fallback: inicialización básica
            console.log('⚠️ Sistema unificado no disponible, usando fallback básico');
            return await this.fallbackInitialization();

        } catch (error) {
            console.error('❌ Error en inicialización:', error);
            return await this.fallbackInitialization();
        }
    }

    /**
     * 📦 CARGAR SISTEMA UNIFICADO
     */
    async loadUnifiedSystem() {
        try {
            // Intentar cargar DataCryptUnifiedManager
            if (window.DataCryptUnifiedManager) {
                this.unifiedManager = new window.DataCryptUnifiedManager();
                console.log('✅ DataCryptUnifiedManager cargado desde global');
            } else {
                // Intentar importación dinámica
                const { default: UnifiedManager } = await import('/src/core/DataCryptUnifiedManager.js');
                this.unifiedManager = new UnifiedManager();
                console.log('✅ DataCryptUnifiedManager importado dinámicamente');
            }

            // Intentar cargar ConfigurationService
            if (window.ConfigurationService) {
                this.configService = window.ConfigurationService.getInstance();
                console.log('✅ ConfigurationService cargado desde global');
            } else {
                const { default: ConfigService } = await import('/src/core/ConfigurationService.js');
                this.configService = ConfigService.getInstance();
                console.log('✅ ConfigurationService importado dinámicamente');
            }

        } catch (error) {
            console.warn('⚠️ No se pudo cargar sistema unificado:', error.message);
        }
    }

    /**
     * 🔄 INICIALIZACIÓN BÁSICA DE FALLBACK
     */
    async fallbackInitialization() {
        try {
            console.log('🔄 Ejecutando inicialización básica...');

            // 1. Mostrar loading básico
            this.showBasicLoading();

            // 2. Configuración mínima
            await this.loadBasicConfig();

            // 3. Inicializar componentes básicos
            await this.initializeBasicComponents();

            // 4. Eventos básicos
            this.setupBasicEvents();

            // 5. Ocultar loading
            this.hideBasicLoading();

            this.isInitialized = true;
            const totalTime = performance.now() - this.initStartTime;

            console.log(`✅ Inicialización básica completada en ${totalTime.toFixed(2)}ms`);

            // Disparar evento de inicialización
            document.dispatchEvent(new CustomEvent('datacrypt:ready', {
                detail: { manager: this, mode: 'fallback' }
            }));

            return true;

        } catch (error) {
            console.error('❌ Error en inicialización básica:', error);
            return false;
        }
    }

    /**
     * ⏳ LOADING BÁSICO
     */
    showBasicLoading() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.style.display = 'flex';
            const text = loading.querySelector('p');
            if (text) text.textContent = 'Inicializando DataCrypt Labs...';
        }
    }

    hideBasicLoading() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            setTimeout(() => {
                loading.style.opacity = '0';
                setTimeout(() => loading.style.display = 'none', 500);
            }, 300);
        }
    }

    /**
     * 📋 CONFIGURACIÓN BÁSICA
     */
    async loadBasicConfig() {
        this.config = {
            app: {
                name: 'DataCrypt Labs',
                version: '3.0.0'
            },
            ui: {
                theme: 'corporate'
            },
            performance: {
                lazyLoading: true
            }
        };
    }

    /**
     * 🧩 COMPONENTES BÁSICOS
     */
    async initializeBasicComponents() {
        const components = [
            'navigation',
            'hero',
            'services',
            'portfolio',
            'contact'
        ];

        for (const componentName of components) {
            try {
                await this.initializeBasicComponent(componentName);
            } catch (error) {
                console.warn(`⚠️ Error inicializando ${componentName}:`, error.message);
            }
        }
    }

    async initializeBasicComponent(name) {
        // Inicialización genérica básica
        const element = document.getElementById(name) || document.querySelector(`[data-component="${name}"]`);
        if (element) {
            element.classList.add('initialized');
            this.components.set(name, { element, initialized: true });
            console.log(`✅ Componente básico ${name} inicializado`);
        }
    }

    /**
     * 🌐 EVENTOS BÁSICOS
     */
    setupBasicEvents() {
        // Evento de scroll básico
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleBasicScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Evento de resize básico
        window.addEventListener('resize', () => {
            this.handleBasicResize();
        });

        console.log('🌐 Eventos básicos configurados');
    }

    handleBasicScroll() {
        // Implementación básica de scroll
        const scrollY = window.scrollY;
        document.documentElement.style.setProperty('--scroll-y', scrollY + 'px');
    }

    handleBasicResize() {
        // Implementación básica de resize
        const width = window.innerWidth;
        document.documentElement.style.setProperty('--viewport-width', width + 'px');
    }

    /**
     * 📊 API PÚBLICA DE COMPATIBILIDAD
     */
    getComponent(name) {
        if (this.unifiedManager) {
            return this.unifiedManager.getComponent(name);
        }
        return this.components.get(name);
    }

    getConfig(path) {
        if (this.configService) {
            return this.configService.get(path);
        }
        return path ? this.config[path] : this.config;
    }

    isReady() {
        return this.isInitialized;
    }

    getState() {
        if (this.unifiedManager) {
            return this.unifiedManager.getState();
        }
        return {
            isInitialized: this.isInitialized,
            componentsCount: this.components.size,
            mode: 'fallback'
        };
    }

    /**
     * 🧹 DESTRUCCIÓN
     */
    destroy() {
        if (this.unifiedManager && this.unifiedManager.destroy) {
            this.unifiedManager.destroy();
        }
        this.isInitialized = false;
        console.log('🧹 DataCryptLabsManager destruido');
    }
}

// Singleton instance
DataCryptLabsManager.instance = null;

/**
 * 🚀 FUNCIÓN DE INICIALIZACIÓN GLOBAL
 */
async function initializeDataCrypt() {
    try {
        const manager = new DataCryptLabsManager();
        const success = await manager.initialize();

        if (success) {
            console.log('🎉 DataCrypt Labs inicializado exitosamente');

            // Hacer disponible globalmente
            window.dataCryptManager = manager;

            return manager;
        } else {
            throw new Error('Inicialización falló');
        }
    } catch (error) {
        console.error('❌ Error fatal en inicialización:', error);
        return null;
    }
}

/**
 * 🎯 AUTO-INICIALIZACIÓN
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDataCrypt);
} else {
    initializeDataCrypt();
}

// Exports para compatibilidad
if (typeof window !== 'undefined') {
    window.DataCryptLabsManager = DataCryptLabsManager;
    window.initializeDataCrypt = initializeDataCrypt;
}

// Export modular
export { DataCryptLabsManager, initializeDataCrypt };
export default DataCryptLabsManager;    /**
     * Inicialización principal del sistema corporativo
     * ⭐ ROBUSTO - manejo completo de errores empresariales
     */
    async initialize() {
    try {


        // Configurar manejo global de errores
        this.setupCorporateErrorHandling();

        // Mostrar loading screen corporativo
        this.showLoadingScreen();

        // Cargar configuración corporativa
        await this.loadCorporateConfig();

        // Inicializar componentes en orden
        await this.initializeComponents();

        // Configurar eventos corporativos
        this.setupCorporateEvents();

        // Inicializar analytics B2B
        this.initializeAnalytics();

        // Configurar SEO corporativo
        this.optimizeCorporateSEO();

        // Finalizar carga
        this.completeInitialization();



    } catch (error) {

        this.handleInitializationError(error);
    }
}
try {

    PerformanceHelper.startMark('portfolio-total-init');

    // 1. Setup global error handling
    this.setupErrorHandling();

    // 2. Mostrar loading screen
    this.showLoadingScreen();

    // 3. Cargar configuración centralizada
    await this.loadConfiguration();

    // 4. Verificar compatibilidad del navegador
    this.checkBrowserCompatibility();

    // 5. Inicializar componentes en orden
    await this.initializeComponents();

    // 6. Setup de eventos globales
    this.setupGlobalEvents();

    // 7. Aplicar tema guardado
    this.applyUserPreferences();

    // 8. Ocultar loading screen
    await this.hideLoadingScreen();

    // 9. Mostrar animaciones de entrada
    this.triggerEntryAnimations();

    this.isInitialized = true;

    const totalTime = PerformanceHelper.endMark('portfolio-total-init');


    // Reportar métricas de performance
    this.reportPerformanceMetrics();

} catch (error) {
    this.handleInitializationError(error);
}
    }

/**
 * Configurar manejo global de errores
 */
setupErrorHandling() {
    setupGlobalErrorHandling();

    // Handler adicional para errores del portfolio
    window.addEventListener('portfolioerror', (event) => {

        this.handleComponentError(event.detail);
    });


}

/**
 * Mostrar pantalla de carga
 */
showLoadingScreen() {
    try {
        this.loadingScreen = DOMHelper.getElementById('loading-screen');

        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');

            // Agregar progreso de carga
            const progressText = DOMHelper.querySelector('.loading-spinner p');
            if (progressText) {
                progressText.textContent = 'Inicializando componentes...';
            }
        }

        return true;
    } catch (error) {

        return false;
    }
}

    /**
     * Cargar configuración centralizada
     */
    async loadConfiguration() {
    PerformanceHelper.startMark('config-loading');

    try {
        this.config = await getPortfolioConfig();


        // Aplicar configuración global
        this.applyGlobalConfiguration();

    } catch (error) {

        // Usar configuración por defecto
        this.config = await getPortfolioConfig({});
    } finally {
        PerformanceHelper.endMark('config-loading');
    }
}

/**
 * Aplicar configuración global al DOM
 */
applyGlobalConfiguration() {
    try {
        const config = this.config.getEnvironmentConfig();

        // Aplicar configuración de development/production
        if (config.isDevelopment) {
            document.body.classList.add('dev-mode');

        }

        // Configurar analytics si está habilitado
        if (config.enableAnalytics && window.gtag) {
            const analyticsConfig = this.config.getModuleConfig('analytics');
            window.gtag('config', analyticsConfig.GA_TRACKING_ID);

        }

        return true;
    } catch (error) {

        return false;
    }
}

/**
 * Verificar compatibilidad del navegador
 */
checkBrowserCompatibility() {
    const requiredFeatures = [
        'addEventListener',
        'querySelector',
        'Promise',
        'fetch',
        'localStorage'
    ];

    const unsupportedFeatures = requiredFeatures.filter(feature => {
        return !window[feature];
    });

    if (unsupportedFeatures.length > 0) {

    } else {

    }
}

    /**
     * Inicializar todos los componentes en orden
     */
    async initializeComponents() {


    for (const componentName of this.initializationOrder) {
        await this.initializeComponent(componentName);
    }


}

    /**
     * Inicializar componente individual
     */
    async initializeComponent(componentName) {
    try {
        PerformanceHelper.startMark(`component-${componentName}`);

        let component = null;

        switch (componentName) {
            case 'navigation':
                component = new NavigationComponent(this.config);
                break;

            case 'chatbot':
                component = new ChatbotComponent(this.config);
                break;

            case 'hero':
                component = await this.initializeHeroComponent();
                break;

            case 'about':
                component = await this.initializeAboutComponent();
                break;

            case 'skills':
                component = await this.initializeSkillsComponent();
                break;

            case 'portfolio':
                component = await this.initializePortfolioComponent();
                break;

            case 'contact':
                component = await this.initializeContactComponent();
                break;

            case 'footer':
                component = await this.initializeFooterComponent();
                break;

            default:

                return;
        }

        if (component) {
            this.components.set(componentName, component);

            const loadTime = PerformanceHelper.endMark(`component-${componentName}`);
            this.componentLoadTimes.set(componentName, loadTime.duration);



            // Actualizar progreso de loading
            this.updateLoadingProgress(componentName);
        }

    } catch (error) {
        const errorDetails = {
            component: componentName,
            error: error.message,
            timestamp: new Date().toISOString()
        };



        // Emitir evento de error personalizado
        window.dispatchEvent(new CustomEvent('portfolioerror', { detail: errorDetails }));

        throw new ComponentMountException(componentName, error);
    }
}

/**
 * Actualizar progreso de la pantalla de carga
 */
updateLoadingProgress(componentName) {
    try {
        const progressText = DOMHelper.querySelector('.loading-spinner p');
        if (progressText) {
            const completedComponents = this.components.size;
            const totalComponents = this.initializationOrder.length;
            const percentage = Math.round((completedComponents / totalComponents) * 100);

            progressText.textContent = `Cargando ${componentName}... (${percentage}%)`;
        }

        return true;
    } catch (error) {
        return false;
    }
}

    /**
     * Inicializar componente Hero
     */
    async initializeHeroComponent() {
    return {
        name: 'hero',
        init: () => {
            this.setupTextAnimations();
            this.setupParallaxEffects();
            this.setupSocialLinksTracking();
        },
        destroy: () => { }
    };
}

    /**
     * Inicializar componente About
     */
    async initializeAboutComponent() {
    return {
        name: 'about',
        init: () => {
            this.setupCounterAnimations();
            this.setupImageLazyLoading('#about');
        },
        destroy: () => { }
    };
}

    /**
     * Inicializar componente Skills
     */
    async initializeSkillsComponent() {
    return {
        name: 'skills',
        init: () => {
            this.setupSkillBarsAnimation();
        },
        destroy: () => { }
    };
}

    /**
     * Inicializar componente Portfolio
     */
    async initializePortfolioComponent() {
    return {
        name: 'portfolio',
        init: () => {
            this.setupPortfolioFilters();
            this.setupPortfolioLazyLoading();
        },
        destroy: () => { }
    };
}

    /**
     * Inicializar componente Contact
     */
    async initializeContactComponent() {
    return {
        name: 'contact',
        init: () => {
            this.setupFormValidation();
            this.setupFormSubmission();
        },
        destroy: () => { }
    };
}

    /**
     * Inicializar componente Footer
     */
    async initializeFooterComponent() {
    return {
        name: 'footer',
        init: () => {
            this.setupBackToTop();
        },
        destroy: () => { }
    };
}

/**
 * Configurar eventos globales
 */
setupGlobalEvents() {
    this.setupThemeToggle();

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            this.handlePageHidden();
        } else {
            this.handlePageVisible();
        }
    });


}

/**
 * Configurar toggle de tema
 */
setupThemeToggle() {
    try {
        const themeToggle = DOMHelper.getElementById('theme-toggle');

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        return true;
    } catch (error) {

        return false;
    }
}

/**
 * Toggle entre tema claro y oscuro
 */
toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);

        // Actualizar icono del toggle
        const themeIcon = DOMHelper.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }

        // Guardar preferencia
        StorageHelper.setItem('theme_preference', newTheme);



        return true;
    } catch (error) {

        return false;
    }
}

/**
 * Aplicar preferencias guardadas del usuario
 */
applyUserPreferences() {
    try {
        const savedTheme = StorageHelper.getItem('theme_preference');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            document.documentElement.setAttribute('data-theme', savedTheme);

            const themeIcon = DOMHelper.querySelector('#theme-toggle i');
            if (themeIcon) {
                themeIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }

        return true;
    } catch (error) {
        return false;
    }
}

    /**
     * Ocultar pantalla de carga con animación
     */
    async hideLoadingScreen() {
    if (!this.loadingScreen) return;

    return new Promise(resolve => {
        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');

            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
                resolve();
            }, 500);
        }, 500);
    });
}

/**
 * Activar animaciones de entrada
 */
triggerEntryAnimations() {
    try {
        const fadeElements = DOMHelper.querySelectorAll('.fade-in');

        const observer = PerformanceHelper.createIntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(element => {
            observer.observe(element);
        });

        return true;
    } catch (error) {

        return false;
    }
}

/**
 * Configurar animaciones de contador
 */
setupCounterAnimations() {
    try {
        const counters = DOMHelper.querySelectorAll('.stat-number[data-count]');

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        };

        const observer = PerformanceHelper.createIntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));

        return true;
    } catch (error) {

        return false;
    }
}

/**
 * Configurar animaciones de barras de habilidades
 */
setupSkillBarsAnimation() {
    try {
        const skillBars = DOMHelper.querySelectorAll('.skill-progress[data-progress]');

        const animateSkillBar = (bar) => {
            const progress = bar.getAttribute('data-progress');

            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, 200);
        };

        const observer = PerformanceHelper.createIntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });

        skillBars.forEach(bar => observer.observe(bar));

        return true;
    } catch (error) {

        return false;
    }
}

/**
 * Reportar métricas de performance
 */
reportPerformanceMetrics() {
    const totalInitTime = performance.now() - this.initStartTime;

    const metrics = {
        totalInitialization: totalInitTime,
        components: Object.fromEntries(this.componentLoadTimes),
        timestamp: new Date().toISOString()
    };



    if (this.config?.analytics?.ANALYTICS_ENABLED && window.gtag) {
        window.gtag('event', 'portfolio_performance', {
            total_load_time: Math.round(totalInitTime),
            components_count: this.components.size
        });
    }
}

/**
 * Manejar errores de inicialización
 */
handleInitializationError(error) {


    this.showErrorMessage('Ocurrió un error al cargar el portafolio. Por favor, recarga la página.');

    if (this.loadingScreen) {
        this.loadingScreen.style.display = 'none';
    }

    if (window.gtag) {
        window.gtag('event', 'exception', {
            description: error.message,
            fatal: true
        });
    }
}

/**
 * Mostrar mensaje de error al usuario
 */
showErrorMessage(message) {
    try {
        const errorDiv = DOMHelper.createElement('div', {
            class: 'error-message',
            style: 'position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white; padding: 1rem; border-radius: 8px; z-index: 10000;'
        });

        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 10000);

        return true;
    } catch (error) {

        return false;
    }
}

/**
 * Manejar error de componente individual
 */
handleComponentError(errorDetails) {

}

/**
 * Handlers para visibilidad de página
 */
handlePageHidden() {

}

handlePageVisible() {
    // Página visible - reanudando operaciones
}

/**
 * Stubs para funciones que implementaremos después
 */
setupTextAnimations() { }
setupParallaxEffects() { }
setupSocialLinksTracking() { }
setupImageLazyLoading(selector) { }
setupPortfolioFilters() { }
setupPortfolioLazyLoading() { }
setupFormValidation() { }
setupFormSubmission() { }
setupBackToTop() { }

/**
 * Obtener estado del portfolio
 */
getPortfolioState() {
    return {
        isInitialized: this.isInitialized,
        componentsCount: this.components.size,
        componentNames: Array.from(this.components.keys()),
        loadTimes: Object.fromEntries(this.componentLoadTimes),
        configuration: this.config ? 'loaded' : 'not loaded',
        theme: document.documentElement.getAttribute('data-theme') || 'light'
    };
}

/**
 * Cleanup del portfolio
 */
destroy() {


    this.components.forEach((component, name) => {
        if (component && typeof component.destroy === 'function') {
            component.destroy();

        }
    });

    this.components.clear();
    this.componentLoadTimes.clear();
    this.isInitialized = false;


}
}

/**
 * Inicialización automática cuando el DOM esté listo
 */
function initializePortfolio() {
    const manager = new PortfolioManager();

    // Exponer manager globalmente para debugging
    window.portfolioManager = manager;

    // Inicializar
    manager.init().catch(error => {

    });
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

// Export para uso modular
export { PortfolioManager };
export default PortfolioManager;
