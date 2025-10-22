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
export default DataCryptLabsManager;