/**
 * 🎯 CONFIGURATION SERVICE CENTRALIZADO v2.0
 * Servicio singleton que centraliza TODAS las configuraciones
 * Filosofía Mejora Continua: Single Source of Truth
 * 
 * REEMPLAZA:
 * - ConfigManager.js (374 líneas)  
 * - Configuraciones dispersas en main.js
 * - Settings fragmentados en datacrypt.js
 * - Variables hardcodeadas en múltiples archivos
 */

class ConfigurationService {
    constructor() {
        // Singleton enforcement
        if (ConfigurationService.instance) {
            return ConfigurationService.instance;
        }
        ConfigurationService.instance = this;

        // Estado del servicio
        this.state = {
            isLoaded: false,
            lastUpdate: null,
            source: 'default'
        };

        // Cache de configuración
        this.cache = new Map();

        // Configuración por defecto unificada
        this.defaultConfig = {
            // === CONFIGURACIÓN DE LA APLICACIÓN ===
            app: {
                name: 'DataCrypt Labs',
                version: '3.0.0',
                environment: this.detectEnvironment(),
                debug: this.isDebugMode(),
                locale: 'es-ES',
                timezone: 'America/Mexico_City'
            },

            // === CONFIGURACIÓN DE UI ===
            ui: {
                theme: 'corporate',
                animations: {
                    enabled: true,
                    duration: 300,
                    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
                    reducedMotion: false
                },
                loading: {
                    minDisplayTime: 1000,
                    fadeOutDuration: 500,
                    showProgress: true,
                    showLogo: true
                },
                navigation: {
                    sticky: true,
                    hideOnScroll: false,
                    mobileBreakpoint: 768,
                    animateLinks: true
                },
                layout: {
                    maxWidth: '1200px',
                    padding: '2rem',
                    gridColumns: 12,
                    responsive: true
                }
            },

            // === CONFIGURACIÓN DE RENDIMIENTO ===
            performance: {
                lazyLoading: {
                    enabled: true,
                    threshold: 100,
                    rootMargin: '50px'
                },
                preloading: {
                    enabled: true,
                    priority: ['hero', 'navigation', 'services']
                },
                bundling: {
                    splitChunks: true,
                    dynamicImports: true
                },
                caching: {
                    enabled: true,
                    duration: 86400000, // 24 horas
                    strategy: 'cache-first'
                },
                optimization: {
                    minifyHTML: true,
                    compressImages: true,
                    deferNonCritical: true
                }
            },

            // === CONFIGURACIÓN DE SERVICIOS ===
            services: {
                analytics: {
                    enabled: false, // Deshabilitado por defecto
                    provider: null,
                    trackingId: null,
                    anonymize: true,
                    respectDNT: true
                },
                api: {
                    baseUrl: this.getAPIBaseUrl(),
                    timeout: 10000,
                    retries: 3,
                    rateLimit: {
                        enabled: true,
                        requests: 100,
                        window: 3600000 // 1 hora
                    }
                },
                chatbot: {
                    enabled: true,
                    provider: 'internal',
                    welcomeMessage: '¡Hola! ¿En qué puedo ayudarte?',
                    responseDelay: 1000,
                    maxMessages: 50
                },
                notifications: {
                    enabled: true,
                    position: 'top-right',
                    duration: 5000,
                    maxVisible: 3
                }
            },

            // === CONFIGURACIÓN DE COMPONENTES ===
            components: {
                hero: {
                    autoplay: true,
                    interval: 5000,
                    showIndicators: true,
                    pauseOnHover: true,
                    height: 'auto'
                },
                portfolio: {
                    itemsPerPage: 6,
                    lazyLoad: true,
                    filterAnimation: true,
                    lightbox: true
                },
                contact: {
                    validation: {
                        enabled: true,
                        realTime: true,
                        showErrors: true
                    },
                    spam: {
                        protection: true,
                        honeypot: true,
                        rateLimit: true
                    },
                    autoResponse: {
                        enabled: true,
                        message: 'Gracias por tu mensaje. Te responderemos pronto.'
                    }
                },
                services: {
                    expandable: true,
                    animations: true,
                    loadOnDemand: false
                }
            },

            // === CONFIGURACIÓN DE SEGURIDAD ===
            security: {
                csp: {
                    enabled: true,
                    reportUri: null
                },
                sanitization: {
                    enabled: true,
                    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
                    allowedAttributes: ['href', 'title', 'target']
                },
                rateLimit: {
                    enabled: true,
                    windowMs: 900000, // 15 minutos
                    max: 100
                }
            },

            // === CONFIGURACIÓN DE DESARROLLO ===
            development: {
                hotReload: this.isDebugMode(),
                sourceMap: this.isDebugMode(),
                logging: {
                    level: this.isDebugMode() ? 'debug' : 'warn',
                    console: true,
                    remote: false
                },
                mockData: this.isDebugMode(),
                devTools: this.isDebugMode()
            },

            // === CONFIGURACIÓN ESPECÍFICA DE DATACRYPT ===
            datacrypt: {
                branding: {
                    primaryColor: '#2c3e50',
                    secondaryColor: '#3498db',
                    accentColor: '#e74c3c',
                    logo: '/assets/images/logo-datacrypt.png'
                },
                contact: {
                    email: 'contacto@datacrypt.com',
                    phone: '+52 (555) 123-4567',
                    address: 'México',
                    social: {
                        linkedin: null, // Eliminado completamente
                        github: 'https://github.com/datacrypt-labs',
                        website: 'https://datacrypt-labs.github.io/Web-Portfolio/'
                    }
                },
                services: {
                    categories: [
                        'Consultoría en Ciberseguridad',
                        'Desarrollo Web Seguro',
                        'Análisis de Vulnerabilidades',
                        'Auditorías de Seguridad'
                    ],
                    featured: ['cybersecurity', 'web-development', 'security-audit']
                },
                portfolio: {
                    projects: [
                        'Sistema de Autenticación Multifactor',
                        'Plataforma de Monitoreo de Seguridad',
                        'Framework de Desarrollo Seguro'
                    ],
                    technologies: ['Python', 'JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Docker']
                }
            }
        };

        // Configuración actual (iniciada con defaults)
        this.config = { ...this.defaultConfig };
    }

    /**
     * 🚀 CARGA LA CONFIGURACIÓN
     */
    async load() {
        try {
            console.log('📋 Cargando configuración centralizada...');

            // 1. Cargar configuración desde localStorage
            this.loadFromStorage();

            // 2. Cargar configuración desde archivo (si existe)
            await this.loadFromFile();

            // 3. Aplicar configuración de URL params
            this.loadFromURLParams();

            // 4. Validar configuración
            this.validateConfig();

            // 5. Aplicar configuración de entorno
            this.applyEnvironmentConfig();

            this.state.isLoaded = true;
            this.state.lastUpdate = new Date();

            console.log('✅ Configuración cargada exitosamente');
            this.triggerEvent('config:loaded', this.config);

        } catch (error) {
            console.error('❌ Error cargando configuración:', error);
            this.handleLoadError(error);
        }
    }

    /**
     * 📱 CARGAR DESDE LOCALSTORAGE
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('datacrypt-config');
            if (stored) {
                const parsedConfig = JSON.parse(stored);
                this.config = this.mergeConfig(this.config, parsedConfig);
                this.state.source = 'localStorage';
                console.log('📱 Configuración cargada desde localStorage');
            }
        } catch (error) {
            console.warn('⚠️ Error leyendo configuración de localStorage:', error);
        }
    }

    /**
     * 📄 CARGAR DESDE ARCHIVO
     */
    async loadFromFile() {
        try {
            const response = await fetch('/config/app.json');
            if (response.ok) {
                const fileConfig = await response.json();
                this.config = this.mergeConfig(this.config, fileConfig);
                this.state.source = 'file';
                console.log('📄 Configuración cargada desde archivo');
            }
        } catch (error) {
            console.warn('⚠️ Archivo de configuración no encontrado (usando defaults)');
        }
    }

    /**
     * 🔗 CARGAR DESDE PARÁMETROS URL
     */
    loadFromURLParams() {
        const params = new URLSearchParams(window.location.search);
        const urlConfig = {};

        // Mapear parámetros específicos
        if (params.has('theme')) {
            urlConfig.ui = { theme: params.get('theme') };
        }
        if (params.has('debug')) {
            urlConfig.app = { debug: params.get('debug') === 'true' };
        }
        if (params.has('lang')) {
            urlConfig.app = { locale: params.get('lang') };
        }

        if (Object.keys(urlConfig).length > 0) {
            this.config = this.mergeConfig(this.config, urlConfig);
            console.log('🔗 Parámetros URL aplicados a configuración');
        }
    }

    /**
     * ✅ VALIDAR CONFIGURACIÓN
     */
    validateConfig() {
        // Validaciones básicas
        if (!this.config.app.name) {
            console.warn('⚠️ Nombre de aplicación no definido');
        }

        // Validar URLs
        if (this.config.services.api.baseUrl && !this.isValidURL(this.config.services.api.baseUrl)) {
            console.warn('⚠️ URL de API inválida');
        }

        // Validar colores
        if (this.config.datacrypt.branding.primaryColor && !this.isValidColor(this.config.datacrypt.branding.primaryColor)) {
            console.warn('⚠️ Color primario inválido');
        }
    }

    /**
     * 🌍 APLICAR CONFIGURACIÓN DE ENTORNO
     */
    applyEnvironmentConfig() {
        const env = this.config.app.environment;

        switch (env) {
            case 'development':
                this.config.development.hotReload = true;
                this.config.development.sourceMap = true;
                this.config.development.logging.level = 'debug';
                break;

            case 'staging':
                this.config.development.sourceMap = false;
                this.config.services.analytics.enabled = false;
                break;

            case 'production':
                this.config.development.hotReload = false;
                this.config.development.sourceMap = false;
                this.config.development.logging.level = 'error';
                this.config.app.debug = false;
                break;
        }

        console.log(`🌍 Configuración aplicada para entorno: ${env}`);
    }

    /**
     * 🔧 MÉTODOS DE ACCESO
     */
    get(path) {
        return this.getNestedValue(this.config, path);
    }

    set(path, value) {
        this.setNestedValue(this.config, path, value);
        this.saveToStorage();
        this.triggerEvent('config:changed', { path, value });
    }

    getAll() {
        return { ...this.config };
    }

    reset() {
        this.config = { ...this.defaultConfig };
        localStorage.removeItem('datacrypt-config');
        this.triggerEvent('config:reset');
    }

    /**
     * 💾 GUARDAR EN LOCALSTORAGE
     */
    saveToStorage() {
        try {
            localStorage.setItem('datacrypt-config', JSON.stringify(this.config));
        } catch (error) {
            console.warn('⚠️ Error guardando configuración:', error);
        }
    }

    /**
     * 🛠️ UTILIDADES PRIVADAS
     */
    detectEnvironment() {
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            return 'development';
        }
        if (location.hostname.includes('staging') || location.hostname.includes('test')) {
            return 'staging';
        }
        return 'production';
    }

    isDebugMode() {
        return location.hostname === 'localhost' ||
            location.search.includes('debug=true') ||
            localStorage.getItem('datacrypt-debug') === 'true';
    }

    getAPIBaseUrl() {
        const env = this.detectEnvironment();
        switch (env) {
            case 'development': return 'http://localhost:8000/api';
            case 'staging': return 'https://staging-api.datacrypt.com';
            case 'production': return 'https://api.datacrypt.com';
            default: return null;
        }
    }

    mergeConfig(target, source) {
        const result = { ...target };

        for (const key in source) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                result[key] = this.mergeConfig(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key]) current[key] = {};
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    }

    isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }

    handleLoadError(error) {
        console.error('📋 Fallback a configuración por defecto debido a error:', error);
        this.config = { ...this.defaultConfig };
        this.state.isLoaded = true;
    }

    triggerEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * 🎯 MÉTODOS DE CONFIGURACIÓN ESPECÍFICA
     */
    getTheme() {
        return this.get('ui.theme');
    }

    setTheme(theme) {
        this.set('ui.theme', theme);
    }

    getLanguage() {
        return this.get('app.locale');
    }

    setLanguage(locale) {
        this.set('app.locale', locale);
    }

    isFeatureEnabled(feature) {
        return this.get(`features.${feature}`) || false;
    }

    enableFeature(feature) {
        this.set(`features.${feature}`, true);
    }

    disableFeature(feature) {
        this.set(`features.${feature}`, false);
    }

    /**
     * 📊 MÉTODOS DE INFORMACIÓN
     */
    getInfo() {
        return {
            isLoaded: this.state.isLoaded,
            lastUpdate: this.state.lastUpdate,
            source: this.state.source,
            environment: this.config.app.environment,
            version: this.config.app.version
        };
    }

    /**
     * 🔧 FACTORY METHOD PARA SINGLETON
     */
    static getInstance() {
        if (!ConfigurationService.instance) {
            ConfigurationService.instance = new ConfigurationService();
        }
        return ConfigurationService.instance;
    }
}

// Singleton instance
ConfigurationService.instance = null;

// Auto-exportación global
if (typeof window !== 'undefined') {
    window.ConfigurationService = ConfigurationService;
}

export default ConfigurationService;