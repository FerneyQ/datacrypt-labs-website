/**
 * 🌱 DATACRYPT_LABS - ORQUESTADOR PRINCIPAL v2.1
 * Sistema de gestión corporativo para Business Intelligence & Data Science
 * Basado en Filosofía "La Mejora Continua" y patrones Pescador Bot 2.0
 * 
 * ⭐ COORDINADOR CENTRAL - gestiona todos los componentes corporativos
 * ⭐ Inicialización robusta con manejo de errores empresariales
 * ⭐ Performance optimizado para aplicaciones B2B
 */

/**
 * CONFIGURACIÓN CORPORATIVA DATACRYPT_LABS
 * Configuraciones específicas para empresa de BI y Data Science
 */
const DATACRYPT_CONFIG = {
    company: {
        name: "DataCrypt_Labs",
        tagline: "Automatizamos Soluciones",
        phone: "3232066197",
        services: [
            "BUSINESS_INTELLIGENCE",
            "MACHINE_LEARNING", 
            "BIG_DATA",
            "DATA_VISUALIZATION",
            "CONSULTORIA_DATOS",
            "GEORREFERENCIACION"
        ]
    },
    ui: {
        theme: 'corporate',
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        accentColor: '#f59e0b'
    },
    analytics: {
        trackCorporateEvents: true,
        b2bMetrics: true
    }
};

/**
 * DataCrypt_Labs Manager - Gestor corporativo principal
 * ⭐ PATRÓN MANAGER - coordinación centralizada para empresa BI/Data Science
 */
class DataCryptLabsManager {
    
    constructor() {
        this.config = DATACRYPT_CONFIG;
        this.components = new Map();
        this.isInitialized = false;
        this.loadingScreen = null;
        
        // Performance tracking empresarial
        this.initStartTime = performance.now();
        this.componentLoadTimes = new Map();
        this.analyticsData = new Map();
        
        // Component initialization order (dependencias corporativas)
        this.initializationOrder = [
            'navigation',
            'hero', 
            'services',
            'portfolio',
            'contact',
            'chatbot',
            'analytics'
        ];
        
        // Corporate event listeners
        this.corporateEventListeners = new Map();
        
        // Business Intelligence tracking
        this.biMetrics = {
            pageViews: 0,
            serviceClicks: 0,
            contactForms: 0,
            portfolioViews: 0
        };
    }

    /**
     * Inicialización principal del sistema corporativo
     * ⭐ ROBUSTO - manejo completo de errores empresariales
     */
    async initialize() {
        try {
            console.log('🚀 Iniciando DataCrypt_Labs Corporate System...');
            
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
            
            console.log('✅ DataCrypt_Labs Corporate System initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing DataCrypt_Labs:', error);
            this.handleInitializationError(error);
        }
    }
            'portfolio',
            'contact',
            'chatbot',
            'footer'
        ];
    }
    
    /**
     * Inicialización principal del portafolio
     */
    async init() {
        try {
            console.log('[PortfolioManager] 🚀 Iniciando portafolio con Filosofía Mejora Continua v2.1');
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
            console.log(`[PortfolioManager] ✅ Portafolio inicializado exitosamente en ${totalTime.duration.toFixed(2)}ms`);
            
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
            console.error('[PortfolioManager] Error en componente:', event.detail);
            this.handleComponentError(event.detail);
        });
        
        console.log('[PortfolioManager] 🛡️ Manejo global de errores configurado');
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
            console.warn('[PortfolioManager] Error mostrando loading screen:', error);
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
            console.log('[PortfolioManager] ⚙️ Configuración cargada exitosamente');
            
            // Aplicar configuración global
            this.applyGlobalConfiguration();
            
        } catch (error) {
            console.error('[PortfolioManager] Error cargando configuración:', error);
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
                console.log('[PortfolioManager] 🔧 Modo desarrollo activado');
            }
            
            // Configurar analytics si está habilitado
            if (config.enableAnalytics && window.gtag) {
                const analyticsConfig = this.config.getModuleConfig('analytics');
                window.gtag('config', analyticsConfig.GA_TRACKING_ID);
                console.log('[PortfolioManager] 📊 Analytics configurado');
            }
            
            return true;
        } catch (error) {
            console.warn('[PortfolioManager] Error aplicando configuración global:', error);
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
            console.warn('[PortfolioManager] ⚠️ Características no soportadas:', unsupportedFeatures);
        } else {
            console.log('[PortfolioManager] ✅ Navegador compatible detectado');
        }
    }
    
    /**
     * Inicializar todos los componentes en orden
     */
    async initializeComponents() {
        console.log('[PortfolioManager] 🔄 Inicializando componentes modulares...');
        
        for (const componentName of this.initializationOrder) {
            await this.initializeComponent(componentName);
        }
        
        console.log(`[PortfolioManager] ✅ ${this.components.size} componentes inicializados`);
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
                    console.warn(`[PortfolioManager] Componente desconocido: ${componentName}`);
                    return;
            }
            
            if (component) {
                this.components.set(componentName, component);
                
                const loadTime = PerformanceHelper.endMark(`component-${componentName}`);
                this.componentLoadTimes.set(componentName, loadTime.duration);
                
                console.log(`[PortfolioManager] ✅ ${componentName} inicializado (${loadTime.duration.toFixed(2)}ms)`);
                
                // Actualizar progreso de loading
                this.updateLoadingProgress(componentName);
            }
            
        } catch (error) {
            const errorDetails = {
                component: componentName,
                error: error.message,
                timestamp: new Date().toISOString()
            };
            
            console.error(`[PortfolioManager] ❌ Error inicializando ${componentName}:`, error);
            
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
            destroy: () => {}
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
            destroy: () => {}
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
            destroy: () => {}
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
            destroy: () => {}
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
            destroy: () => {}
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
            destroy: () => {}
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
        
        console.log('[PortfolioManager] 🌐 Eventos globales configurados');
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
            console.warn('[PortfolioManager] Error configurando theme toggle:', error);
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
            
            console.log(`[PortfolioManager] 🎨 Tema cambiado a: ${newTheme}`);
            
            return true;
        } catch (error) {
            console.warn('[PortfolioManager] Error cambiando tema:', error);
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
            console.warn('[PortfolioManager] Error en animaciones de entrada:', error);
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
            console.warn('[PortfolioManager] Error en animaciones de contador:', error);
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
            console.warn('[PortfolioManager] Error en animaciones de skills:', error);
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
        
        console.log('[PortfolioManager] 📊 Métricas de performance:', metrics);
        
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
        console.error('[PortfolioManager] ❌ Error crítico en inicialización:', error);
        
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
            console.error('[PortfolioManager] Error mostrando mensaje de error:', error);
            return false;
        }
    }
    
    /**
     * Manejar error de componente individual
     */
    handleComponentError(errorDetails) {
        console.warn(`[PortfolioManager] ⚠️ Error en componente ${errorDetails.component}:`, errorDetails);
    }
    
    /**
     * Handlers para visibilidad de página
     */
    handlePageHidden() {
        console.log('[PortfolioManager] Página oculta - pausando operaciones no críticas');
    }
    
    handlePageVisible() {
        console.log('[PortfolioManager] Página visible - reanudando operaciones');
    }
    
    /**
     * Stubs para funciones que implementaremos después
     */
    setupTextAnimations() {}
    setupParallaxEffects() {}
    setupSocialLinksTracking() {}
    setupImageLazyLoading(selector) {}
    setupPortfolioFilters() {}
    setupPortfolioLazyLoading() {}
    setupFormValidation() {}
    setupFormSubmission() {}
    setupBackToTop() {}
    
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
        console.log('[PortfolioManager] 🧹 Destruyendo portfolio...');
        
        this.components.forEach((component, name) => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
                console.log(`[PortfolioManager] ✅ Componente ${name} destruido`);
            }
        });
        
        this.components.clear();
        this.componentLoadTimes.clear();
        this.isInitialized = false;
        
        console.log('[PortfolioManager] ✅ Portfolio destruido completamente');
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
        console.error('[Portfolio] Error fatal en inicialización:', error);
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