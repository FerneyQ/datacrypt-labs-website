/**
 * 🚀 DATACRYPT UNIFIED LOADER v3.0
 * Sistema de inicialización unificado para todos los archivos HTML
 * Filosofía Mejora Continua: Un solo punto de entrada
 * 
 * REEMPLAZA:
 * - Múltiples scripts individuales en HTML
 * - Lógica de carga dispersa
 * - Dependencias desorganizadas
 * 
 * PROPORCIONA:
 * - Carga ordenada y optimizada
 * - Manejo de dependencias
 * - Fallbacks inteligentes
 * - Performance mejorado
 */

class DataCryptUnifiedLoader {
    constructor() {
        this.loadStartTime = performance.now();
        this.loadedModules = new Set();
        this.failedModules = new Set();
        this.loadOrder = [];

        // Configuración de carga
        this.config = {
            timeout: 10000,
            retries: 2,
            parallel: true,
            fallback: true
        };

        // Módulos del sistema unificado
        this.coreModules = [
            // SISTEMA UNIFICADO (PRIORIDAD MÁXIMA)
            {
                id: 'unified-manager',
                path: '/src/core/DataCryptUnifiedManager.js',
                type: 'module',
                critical: true,
                fallback: '/assets/js/main_unified.js'
            },
            {
                id: 'configuration-service',
                path: '/src/core/ConfigurationService.js',
                type: 'module',
                critical: true
            },

            // COMPONENTES ESPECÍFICOS REFACTORIZADOS
            {
                id: 'datacrypt-specifics',
                path: '/assets/js/datacrypt_refactored.js',
                type: 'module',
                depends: ['unified-manager']
            }
        ];

        // Módulos legacy (carga condicional)
        this.legacyModules = [
            {
                id: 'translations',
                path: '/assets/js/translations.js',
                type: 'script',
                condition: () => !this.hasModernSupport()
            },
            {
                id: 'theme-system',
                path: '/assets/js/theme-system.js',
                type: 'script',
                condition: () => !this.loadedModules.has('unified-manager')
            },
            {
                id: 'visual-fixes',
                path: '/src/fixes/visual-bugs-fix.js',
                type: 'script',
                defer: true
            }
        ];

        // CSS modular
        this.stylesheets = [
            {
                id: 'main-styles',
                path: '/assets/css/main_modular.css',
                critical: true
            }
        ];
    }

    /**
     * 🚀 INICIALIZACIÓN PRINCIPAL
     */
    async init() {
        try {
            console.log('🚀 DataCrypt Unified Loader v3.0 - Iniciando...');

            // 1. Mostrar loading inmediato
            this.showLoadingScreen();

            // 2. Detectar capacidades del navegador
            this.detectCapabilities();

            // 3. Cargar CSS crítico primero
            await this.loadCriticalStyles();

            // 4. Cargar sistema unificado
            await this.loadCoreSystem();

            // 5. Cargar módulos específicos
            await this.loadSpecificModules();

            // 6. Cargar módulos legacy si es necesario
            await this.loadLegacyModules();

            // 7. Inicializar sistema principal
            await this.initializeMainSystem();

            // 8. Finalizar carga
            this.completeLoad();

            return true;

        } catch (error) {
            console.error('❌ Error en DataCrypt Unified Loader:', error);
            return this.handleLoadError(error);
        }
    }

    /**
     * 📱 DETECTAR CAPACIDADES DEL NAVEGADOR
     */
    detectCapabilities() {
        this.capabilities = {
            moduleSupport: this.supportsModules(),
            es6: this.supportsES6(),
            asyncAwait: this.supportsAsyncAwait(),
            customElements: this.supportsCustomElements(),
            intersection: this.supportsIntersectionObserver(),
            serviceWorker: this.supportsServiceWorker()
        };

        console.log('📱 Capacidades detectadas:', this.capabilities);
    }

    /**
     * 🎨 CARGAR CSS CRÍTICO
     */
    async loadCriticalStyles() {
        const criticalCSS = this.stylesheets.filter(sheet => sheet.critical);

        for (const sheet of criticalCSS) {
            try {
                await this.loadStylesheet(sheet);
                console.log(`✅ CSS cargado: ${sheet.id}`);
            } catch (error) {
                console.warn(`⚠️ Error cargando CSS ${sheet.id}:`, error);
            }
        }
    }

    /**
     * 🎯 CARGAR SISTEMA UNIFICADO PRINCIPAL
     */
    async loadCoreSystem() {
        console.log('🎯 Cargando sistema unificado...');

        for (const module of this.coreModules) {
            try {
                const loaded = await this.loadModule(module);
                if (loaded) {
                    this.loadedModules.add(module.id);
                    console.log(`✅ Sistema core cargado: ${module.id}`);
                } else if (module.critical) {
                    throw new Error(`Módulo crítico falló: ${module.id}`);
                }
            } catch (error) {
                console.error(`❌ Error cargando módulo core ${module.id}:`, error);

                // Intentar fallback si está disponible
                if (module.fallback) {
                    console.log(`🔄 Intentando fallback para ${module.id}...`);
                    const fallbackModule = { ...module, path: module.fallback, type: 'script' };
                    const fallbackLoaded = await this.loadModule(fallbackModule);

                    if (fallbackLoaded) {
                        this.loadedModules.add(module.id);
                        console.log(`✅ Fallback exitoso: ${module.id}`);
                    } else {
                        this.failedModules.add(module.id);
                    }
                }
            }
        }
    }

    /**
     * 🧩 CARGAR MÓDULOS ESPECÍFICOS
     */
    async loadSpecificModules() {
        console.log('🧩 Cargando módulos específicos...');

        // Cargar solo si el sistema unificado está disponible
        if (this.loadedModules.has('unified-manager')) {
            const specificModule = this.coreModules.find(m => m.id === 'datacrypt-specifics');
            if (specificModule) {
                try {
                    await this.loadModule(specificModule);
                    this.loadedModules.add(specificModule.id);
                    console.log('✅ Módulos específicos cargados');
                } catch (error) {
                    console.warn('⚠️ Error cargando módulos específicos:', error);
                }
            }
        }
    }

    /**
     * 🔄 CARGAR MÓDULOS LEGACY
     */
    async loadLegacyModules() {
        console.log('🔄 Evaluando módulos legacy...');

        const legacyToLoad = this.legacyModules.filter(module => {
            if (module.condition) {
                return module.condition();
            }
            return true;
        });

        for (const module of legacyToLoad) {
            try {
                await this.loadModule(module);
                this.loadedModules.add(module.id);
                console.log(`✅ Legacy cargado: ${module.id}`);
            } catch (error) {
                console.warn(`⚠️ Error cargando legacy ${module.id}:`, error);
            }
        }
    }

    /**
     * 🎯 INICIALIZAR SISTEMA PRINCIPAL
     */
    async initializeMainSystem() {
        console.log('🎯 Inicializando sistema principal...');

        // Intentar inicializar sistema unificado
        if (window.DataCryptUnifiedManager || window.initializeDataCrypt) {
            try {
                let manager;

                if (window.initializeDataCrypt) {
                    manager = await window.initializeDataCrypt();
                } else if (window.DataCryptUnifiedManager) {
                    manager = new window.DataCryptUnifiedManager();
                    await manager.init();
                }

                if (manager) {
                    window.dataCryptSystem = manager;
                    console.log('✅ Sistema unificado inicializado exitosamente');

                    // Disparar evento de sistema listo
                    document.dispatchEvent(new CustomEvent('datacrypt:system:ready', {
                        detail: { manager, loader: this }
                    }));

                    return true;
                }
            } catch (error) {
                console.error('❌ Error inicializando sistema unificado:', error);
            }
        }

        // Fallback a inicialización legacy
        return this.initializeLegacySystem();
    }

    /**
     * 🔄 INICIALIZACIÓN LEGACY FALLBACK
     */
    async initializeLegacySystem() {
        console.log('🔄 Inicializando sistema legacy fallback...');

        try {
            // Intentar diferentes métodos de inicialización legacy
            const initMethods = [
                () => window.DataCryptLabsManager && new window.DataCryptLabsManager(),
                () => window.PortfolioManager && new window.PortfolioManager(),
                () => window.initializePortfolio && window.initializePortfolio()
            ];

            for (const initMethod of initMethods) {
                try {
                    const result = initMethod();
                    if (result) {
                        if (result.initialize) {
                            await result.initialize();
                        }
                        window.dataCryptSystem = result;
                        console.log('✅ Sistema legacy inicializado');
                        return true;
                    }
                } catch (error) {
                    console.warn('⚠️ Método de inicialización legacy falló:', error);
                }
            }

            console.warn('⚠️ Ningún sistema de inicialización funcionó');
            return false;

        } catch (error) {
            console.error('❌ Error en inicialización legacy:', error);
            return false;
        }
    }

    /**
     * ✅ COMPLETAR CARGA
     */
    completeLoad() {
        const totalTime = performance.now() - this.loadStartTime;

        console.log(`🎉 DataCrypt carga completa en ${totalTime.toFixed(2)}ms`);
        console.log(`📊 Módulos cargados: ${this.loadedModules.size}`);
        console.log(`❌ Módulos fallidos: ${this.failedModules.size}`);

        // Ocultar loading screen
        this.hideLoadingScreen();

        // Disparar evento de carga completa
        document.dispatchEvent(new CustomEvent('datacrypt:load:complete', {
            detail: {
                totalTime,
                loadedModules: Array.from(this.loadedModules),
                failedModules: Array.from(this.failedModules),
                capabilities: this.capabilities
            }
        }));

        // Limpiar referencias innecesarias
        this.cleanup();
    }

    /**
     * 📦 CARGAR MÓDULO INDIVIDUAL
     */
    async loadModule(module) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Timeout cargando ${module.id}`));
            }, this.config.timeout);

            if (module.type === 'module') {
                // Carga ES6 module
                import(module.path)
                    .then((moduleExports) => {
                        clearTimeout(timeout);
                        resolve(moduleExports);
                    })
                    .catch((error) => {
                        clearTimeout(timeout);
                        reject(error);
                    });
            } else {
                // Carga script tradicional
                const script = document.createElement('script');
                script.src = module.path;
                script.async = true;

                if (module.defer) {
                    script.defer = true;
                }

                script.onload = () => {
                    clearTimeout(timeout);
                    resolve(true);
                };

                script.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Error cargando script ${module.id}`));
                };

                document.head.appendChild(script);
            }
        });
    }

    /**
     * 🎨 CARGAR STYLESHEET
     */
    async loadStylesheet(sheet) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = sheet.path;

            link.onload = () => resolve(true);
            link.onerror = () => reject(new Error(`Error cargando CSS ${sheet.id}`));

            document.head.appendChild(link);
        });
    }

    /**
     * 🔍 MÉTODOS DE DETECCIÓN DE SOPORTE
     */
    supportsModules() {
        const script = document.createElement('script');
        return 'noModule' in script;
    }

    supportsES6() {
        try {
            new Function('(a = 0) => a');
            return true;
        } catch (error) {
            return false;
        }
    }

    supportsAsyncAwait() {
        try {
            new Function('async function test() { await Promise.resolve(); }');
            return true;
        } catch (error) {
            return false;
        }
    }

    supportsCustomElements() {
        return 'customElements' in window;
    }

    supportsIntersectionObserver() {
        return 'IntersectionObserver' in window;
    }

    supportsServiceWorker() {
        return 'serviceWorker' in navigator;
    }

    hasModernSupport() {
        return this.capabilities.moduleSupport &&
            this.capabilities.es6 &&
            this.capabilities.asyncAwait;
    }

    /**
     * 📺 LOADING SCREEN
     */
    showLoadingScreen() {
        const loadingHTML = `
            <div id="datacrypt-unified-loading" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            ">
                <div style="
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(59, 130, 246, 0.3);
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">DataCrypt Labs</h2>
                <p style="margin: 0; opacity: 0.8; font-size: 16px;">Cargando sistema unificado...</p>
                <div id="loading-progress" style="
                    width: 200px;
                    height: 4px;
                    background: rgba(59, 130, 246, 0.2);
                    border-radius: 2px;
                    margin-top: 20px;
                    overflow: hidden;
                ">
                    <div style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #3b82f6, #fbbf24);
                        transition: width 0.3s ease;
                        animation: progress 2s ease-in-out infinite;
                    "></div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes progress {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
            </style>
        `;

        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    }

    hideLoadingScreen() {
        const loading = document.getElementById('datacrypt-unified-loading');
        if (loading) {
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.5s ease';
            setTimeout(() => loading.remove(), 500);
        }
    }

    /**
     * 🚨 MANEJO DE ERRORES
     */
    handleLoadError(error) {
        console.error('🚨 Error crítico en DataCrypt Unified Loader:', error);

        // Intentar carga básica de emergencia
        this.emergencyLoad();

        return false;
    }

    async emergencyLoad() {
        console.log('🚑 Activando carga de emergencia...');

        try {
            // Cargar solo lo absolutamente esencial
            const essentialScript = document.createElement('script');
            essentialScript.src = '/assets/js/datacrypt.js';
            essentialScript.onload = () => {
                console.log('✅ Carga de emergencia exitosa');
                this.hideLoadingScreen();
            };
            document.head.appendChild(essentialScript);
        } catch (error) {
            console.error('❌ Carga de emergencia también falló:', error);
            this.hideLoadingScreen();
        }
    }

    /**
     * 🧹 LIMPIEZA
     */
    cleanup() {
        // Limpiar referencias para liberar memoria
        this.coreModules = null;
        this.legacyModules = null;
        this.stylesheets = null;
    }

    /**
     * 📊 API PÚBLICA
     */
    getLoadInfo() {
        return {
            totalTime: performance.now() - this.loadStartTime,
            loadedModules: Array.from(this.loadedModules),
            failedModules: Array.from(this.failedModules),
            capabilities: this.capabilities
        };
    }
}

/**
 * 🚀 AUTO-INICIALIZACIÓN INTELIGENTE
 */
(() => {
    'use strict';

    const initLoader = async () => {
        try {
            window.dataCryptLoader = new DataCryptUnifiedLoader();
            const success = await window.dataCryptLoader.init();

            if (success) {
                console.log('🎉 DataCrypt Unified Loader completado exitosamente');
            } else {
                console.warn('⚠️ DataCrypt Unified Loader completado con advertencias');
            }
        } catch (error) {
            console.error('❌ Error fatal en DataCrypt Unified Loader:', error);
        }
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoader);
    } else {
        initLoader();
    }
})();

// Export para uso modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataCryptUnifiedLoader;
}

if (typeof window !== 'undefined') {
    window.DataCryptUnifiedLoader = DataCryptUnifiedLoader;
}