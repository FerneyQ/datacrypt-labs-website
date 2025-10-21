/**
 * 🌱 FILOSOFÍA "LA MEJORA CONTINUA" v2.1  
 * CONFIGURACIÓN CENTRALIZADA - SETTINGS
 * Siguiendo metodología exitosa del Pescador Bot 2.0
 * 
 * ⭐ CONFIGURACIÓN TIPADA - 100% externalizada
 */

import { PROJECT, NAVIGATION, THEME, CHATBOT, RESPONSIVE, PERFORMANCE, DEV_CONFIG, ANALYTICS, SECURITY } from './constants.js';

/**
 * Configuración principal del portafolio
 * Todas las configuraciones centralizadas en un lugar
 */
class PortfolioConfig {
    constructor(customConfig = {}) {
        // Configuración por defecto fusionada con personalizada
        this.config = {
            // Información del proyecto
            project: { ...PROJECT, ...customConfig.project },
            
            // Configuración de navegación
            navigation: { ...NAVIGATION, ...customConfig.navigation },
            
            // Tema y estilos
            theme: { ...THEME, ...customConfig.theme },
            
            // Chat bot
            chatbot: { ...CHATBOT, ...customConfig.chatbot },
            
            // Responsive design
            responsive: { ...RESPONSIVE, ...customConfig.responsive },
            
            // Performance
            performance: { ...PERFORMANCE, ...customConfig.performance },
            
            // Desarrollo
            dev: { ...DEV_CONFIG, ...customConfig.dev },
            
            // Analytics
            analytics: { ...ANALYTICS, ...customConfig.analytics },
            
            // Seguridad
            security: { ...SECURITY, ...customConfig.security }
        };
        
        this.validateConfiguration();
    }
    
    /**
     * Validación automática de configuración
     * ⭐ PATRÓN COMPROBADO - validación en todos los puntos de entrada
     */
    validateConfiguration() {
        const errors = [];
        
        // Validar navegación
        if (!Array.isArray(this.config.navigation.SECTIONS)) {
            errors.push("navigation.SECTIONS debe ser un array");
        }
        
        // Validar colores del tema
        const requiredColors = ['PRIMARY', 'SECONDARY', 'SUCCESS', 'WARNING', 'DANGER'];
        requiredColors.forEach(color => {
            if (!this.config.theme.COLORS[color]) {
                errors.push(`theme.COLORS.${color} es requerido`);
            }
        });
        
        // Validar configuración del chatbot
        if (!this.config.chatbot.NAME || this.config.chatbot.NAME.length < 2) {
            errors.push("chatbot.NAME debe tener al menos 2 caracteres");
        }
        
        if (errors.length > 0) {
            throw new ConfigValidationError("Errores de configuración encontrados", { errors });
        }
    }
    
    /**
     * Obtener configuración específica por módulo
     * @param {string} module - Módulo solicitado
     * @returns {object} Configuración del módulo
     */
    getModuleConfig(module) {
        if (!this.config[module]) {
            throw new ConfigNotFoundError(`Configuración '${module}' no encontrada`);
        }
        return { ...this.config[module] };
    }
    
    /**
     * Cargar configuración desde archivo JSON externo
     * ⭐ METODOLOGÍA COMPROBADA - configuración externa personalizable
     */
    static async fromFile(configPath = './config/portfolio_config.json') {
        try {
            const response = await fetch(configPath);
            if (!response.ok) {
                throw new Error(`No se pudo cargar configuración: ${response.status}`);
            }
            
            const customConfig = await response.json();
            return new PortfolioConfig(customConfig);
        } catch (error) {
            console.warn('Usando configuración por defecto. Error:', error.message);
            return new PortfolioConfig();
        }
    }
    
    /**
     * Configuración para desarrollo vs producción
     * ⭐ PATRÓN ENVIRONMENT-AWARE
     */
    getEnvironmentConfig() {
        return {
            isDevelopment: this.config.dev.DEBUG_MODE,
            isProduction: !this.config.dev.DEBUG_MODE,
            enableLogs: this.config.dev.CONSOLE_LOGS,
            enableAnalytics: this.config.analytics.ANALYTICS_ENABLED
        };
    }
    
    /**
     * Obtener configuración para componente específico
     */
    getComponentConfig(componentName) {
        const componentConfigs = {
            navigation: () => ({
                sections: this.config.navigation.SECTIONS,
                animationDuration: this.config.navigation.ANIMATION_DURATION,
                scrollOffset: this.config.navigation.SCROLL_OFFSET,
                theme: this.config.theme
            }),
            
            chatbot: () => ({
                name: this.config.chatbot.NAME,
                avatar: this.config.chatbot.AVATAR,
                welcomeMessage: this.config.chatbot.WELCOME_MESSAGE,
                typingDelay: this.config.chatbot.TYPING_DELAY,
                responses: this.config.chatbot.RESPONSES,
                theme: this.config.theme
            }),
            
            portfolio: () => ({
                theme: this.config.theme,
                performance: this.config.performance,
                analytics: this.config.analytics
            })
        };
        
        const configGetter = componentConfigs[componentName.toLowerCase()];
        if (!configGetter) {
            throw new ComponentConfigError(`Configuración para componente '${componentName}' no encontrada`);
        }
        
        return configGetter();
    }
}

/**
 * ⭐ SISTEMA DE EXCEPCIONES ESPECÍFICAS
 * Siguiendo patrón comprobado del Pescador Bot 2.0
 */
class ConfigError extends Error {
    constructor(message, context = {}) {
        super(message);
        this.name = 'ConfigError';
        this.context = context;
        this.timestamp = new Date().toISOString();
    }
}

class ConfigValidationError extends ConfigError {
    constructor(message, context) {
        super(message, context);
        this.name = 'ConfigValidationError';
    }
}

class ConfigNotFoundError extends ConfigError {
    constructor(message, context) {
        super(message, context);
        this.name = 'ConfigNotFoundError';
    }
}

class ComponentConfigError extends ConfigError {
    constructor(message, context) {
        super(message, context);
        this.name = 'ComponentConfigError';
    }
}

// Instancia global de configuración (singleton pattern)
let portfolioConfigInstance = null;

/**
 * Factory function para obtener configuración
 * ⭐ PATRÓN SINGLETON COMPROBADO
 */
export async function getPortfolioConfig(customConfig = null) {
    if (!portfolioConfigInstance) {
        if (customConfig) {
            portfolioConfigInstance = new PortfolioConfig(customConfig);
        } else {
            portfolioConfigInstance = await PortfolioConfig.fromFile();
        }
    }
    return portfolioConfigInstance;
}

// Exports
export { 
    PortfolioConfig,
    ConfigError,
    ConfigValidationError, 
    ConfigNotFoundError,
    ComponentConfigError
};