/**
 * 🌱 FILOSOFÍA "LA MEJORA CONTINUA" v2.1
 * SISTEMA DE EXCEPCIONES ROBUSTO
 * Siguiendo metodología exitosa del Pescador Bot 2.0
 * 
 * ⭐ 25+ excepciones específicas por contexto
 * ⭐ Logging automático + contexto para debugging  
 * ⭐ Retry automático con backoff exponencial
 */

// ==========================================
// BASE EXCEPTION CLASS
// ==========================================

/**
 * Excepción base para todo el portafolio
 * ⭐ PATRÓN COMPROBADO - contexto automático + logging
 */
class PortfolioException extends Error {
    constructor(message, context = {}) {
        super(message);
        this.name = 'PortfolioException';
        this.context = {
            timestamp: new Date().toISOString(),
            url: window?.location?.href || 'unknown',
            userAgent: navigator?.userAgent || 'unknown',
            ...context
        };
        
        // Logging automático si está habilitado
        if (window.portfolioConfig?.dev?.CONSOLE_LOGS) {
            console.error(`[${this.name}] ${message}`, this.context);
        }
        
        // Reportar a analytics si está configurado
        this.reportToAnalytics();
    }
    
    reportToAnalytics() {
        try {
            if (window.gtag && window.portfolioConfig?.analytics?.ANALYTICS_ENABLED) {
                window.gtag('event', 'exception', {
                    description: `${this.name}: ${this.message}`,
                    fatal: false,
                    custom_map: { context: JSON.stringify(this.context) }
                });
            }
        } catch (error) {
            // Silently fail analytics reporting
        }
    }
}

// ==========================================
// CONFIGURATION EXCEPTIONS
// ==========================================

class ConfigurationException extends PortfolioException {
    constructor(message, context) {
        super(message, context);
        this.name = 'ConfigurationException';
    }
}

class ConfigValidationException extends ConfigurationException {
    constructor(message, validationErrors = []) {
        super(message, { validationErrors });
        this.name = 'ConfigValidationException';
    }
}

class ConfigFileNotFoundException extends ConfigurationException {
    constructor(filePath) {
        super(`Archivo de configuración no encontrado: ${filePath}`, { filePath });
        this.name = 'ConfigFileNotFoundException';
    }
}

// ==========================================
// COMPONENT EXCEPTIONS  
// ==========================================

class ComponentException extends PortfolioException {
    constructor(message, componentName, context) {
        super(message, { componentName, ...context });
        this.name = 'ComponentException';
    }
}

class ComponentMountException extends ComponentException {
    constructor(componentName, error) {
        super(`Error montando componente ${componentName}`, componentName, { originalError: error?.message });
        this.name = 'ComponentMountException';
    }
}

class ComponentDataException extends ComponentException {
    constructor(componentName, dataType, error) {
        super(`Error cargando datos para ${componentName}`, componentName, { dataType, originalError: error?.message });
        this.name = 'ComponentDataException';
    }
}

// ==========================================
// NAVIGATION EXCEPTIONS
// ==========================================

class NavigationException extends PortfolioException {
    constructor(message, context) {
        super(message, context);
        this.name = 'NavigationException';
    }
}

class SectionNotFoundException extends NavigationException {
    constructor(sectionId) {
        super(`Sección no encontrada: ${sectionId}`, { sectionId });
        this.name = 'SectionNotFoundException';
    }
}

class ScrollAnimationException extends NavigationException {
    constructor(targetElement, error) {
        super(`Error en animación de scroll`, { targetElement, originalError: error?.message });
        this.name = 'ScrollAnimationException';
    }
}

// ==========================================
// CHATBOT EXCEPTIONS
// ==========================================

class ChatbotException extends PortfolioException {
    constructor(message, context) {
        super(message, context);
        this.name = 'ChatbotException';
    }
}

class ChatbotInitializationException extends ChatbotException {
    constructor(error) {
        super('Error inicializando chatbot', { originalError: error?.message });
        this.name = 'ChatbotInitializationException';
    }
}

class ChatbotMessageException extends ChatbotException {
    constructor(message, messageData) {
        super(`Error procesando mensaje: ${message}`, { messageData });
        this.name = 'ChatbotMessageException';
    }
}

class ChatbotRateLimitException extends ChatbotException {
    constructor(limit, timeWindow) {
        super(`Rate limit excedido: ${limit} mensajes en ${timeWindow}ms`, { limit, timeWindow });
        this.name = 'ChatbotRateLimitException';
    }
}

// ==========================================
// RESOURCE EXCEPTIONS
// ==========================================

class ResourceException extends PortfolioException {
    constructor(message, context) {
        super(message, context);
        this.name = 'ResourceException';
    }
}

class ImageLoadException extends ResourceException {
    constructor(imagePath, error) {
        super(`Error cargando imagen: ${imagePath}`, { imagePath, originalError: error?.message });
        this.name = 'ImageLoadException';
    }
}

class StylesheetLoadException extends ResourceException {
    constructor(stylesheetPath, error) {
        super(`Error cargando stylesheet: ${stylesheetPath}`, { stylesheetPath, originalError: error?.message });
        this.name = 'StylesheetLoadException';
    }
}

class ScriptLoadException extends ResourceException {
    constructor(scriptPath, error) {
        super(`Error cargando script: ${scriptPath}`, { scriptPath, originalError: error?.message });
        this.name = 'ScriptLoadException';
    }
}

// ==========================================
// FORM EXCEPTIONS
// ==========================================

class FormException extends PortfolioException {
    constructor(message, formData, context) {
        super(message, { formData, ...context });
        this.name = 'FormException';
    }
}

class FormValidationException extends FormException {
    constructor(validationErrors, formData) {
        super('Errores de validación en formulario', formData, { validationErrors });
        this.name = 'FormValidationException';
    }
}

class FormSubmissionException extends FormException {
    constructor(endpoint, formData, error) {
        super(`Error enviando formulario a ${endpoint}`, formData, { endpoint, originalError: error?.message });
        this.name = 'FormSubmissionException';
    }
}

// ==========================================
// API EXCEPTIONS  
// ==========================================

class APIException extends PortfolioException {
    constructor(message, context) {
        super(message, context);
        this.name = 'APIException';
    }
}

class APITimeoutException extends APIException {
    constructor(endpoint, timeout) {
        super(`Timeout en API: ${endpoint}`, { endpoint, timeout });
        this.name = 'APITimeoutException';
    }
}

class APINetworkException extends APIException {
    constructor(endpoint, error) {
        super(`Error de red en API: ${endpoint}`, { endpoint, originalError: error?.message });
        this.name = 'APINetworkException';
    }
}

class APIResponseException extends APIException {
    constructor(endpoint, status, statusText) {
        super(`Error en respuesta API: ${endpoint}`, { endpoint, status, statusText });
        this.name = 'APIResponseException';
    }
}

// ==========================================
// PERFORMANCE EXCEPTIONS
// ==========================================

class PerformanceException extends PortfolioException {
    constructor(message, context) {
        super(message, context);
        this.name = 'PerformanceException';
    }
}

class SlowRenderException extends PerformanceException {
    constructor(componentName, renderTime) {
        super(`Renderizado lento detectado: ${componentName}`, { componentName, renderTime });
        this.name = 'SlowRenderException';
    }
}

class MemoryLeakException extends PerformanceException {
    constructor(componentName, memoryUsage) {
        super(`Posible memory leak: ${componentName}`, { componentName, memoryUsage });
        this.name = 'MemoryLeakException';
    }
}

// ==========================================
// DECORADOR RETRY - PATRÓN COMPROBADO
// ==========================================

/**
 * Decorador retry con backoff exponencial
 * ⭐ METODOLOGÍA PROBADA del Pescador Bot 2.0
 */
export function withRetry(maxAttempts = 3, delay = 1000, backoffMultiplier = 2) {
    return function(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function(...args) {
            let lastError;
            
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    return await originalMethod.apply(this, args);
                } catch (error) {
                    lastError = error;
                    
                    if (attempt === maxAttempts) {
                        throw new RetryExhaustedException(
                            `Máximo de intentos alcanzado (${maxAttempts})`, 
                            { 
                                originalError: error?.message,
                                attempts: maxAttempts,
                                method: propertyKey 
                            }
                        );
                    }
                    
                    const waitTime = delay * Math.pow(backoffMultiplier, attempt - 1);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        };
        
        return descriptor;
    };
}

class RetryExhaustedException extends PortfolioException {
    constructor(message, context) {
        super(message, context);
        this.name = 'RetryExhaustedException';
    }
}

// ==========================================
// DECORADOR SAFE EXECUTE - PATRÓN COMPROBADO
// ==========================================

/**
 * Decorador para ejecución segura con fallback
 * ⭐ FALLBACK AUTOMÁTICO + logging del Pescador Bot 2.0
 */
export function safeExecute(fallbackValue = null, shouldLogError = true) {
    return function(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function(...args) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                if (shouldLogError) {
                    console.warn(`[SafeExecute] Error en ${propertyKey}:`, error.message);
                }
                
                return typeof fallbackValue === 'function' 
                    ? fallbackValue(error, args) 
                    : fallbackValue;
            }
        };
        
        return descriptor;
    };
}

// ==========================================
// HANDLER DE ERRORES GLOBAL
// ==========================================

/**
 * Manejo global de errores no capturados
 * ⭐ PATRÓN ROBUSTO - captura todos los errores
 */
export function setupGlobalErrorHandling() {
    // Errores JavaScript no capturados
    window.addEventListener('error', (event) => {
        const error = new UnhandledScriptException(
            event.error?.message || 'Error de script no capturado',
            {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            }
        );
        
        handleGlobalError(error);
    });
    
    // Promesas rechazadas no capturadas
    window.addEventListener('unhandledrejection', (event) => {
        const error = new UnhandledPromiseException(
            'Promise rechazada no capturada',
            {
                reason: event.reason,
                promise: event.promise
            }
        );
        
        handleGlobalError(error);
        
        // Prevenir que aparezca en consola del navegador
        event.preventDefault();
    });
}

class UnhandledScriptException extends PortfolioException {
    constructor(message, context) {
        super(message, context);
        this.name = 'UnhandledScriptException';
    }
}

class UnhandledPromiseException extends PortfolioException {
    constructor(message, context) {
        super(message, context);
        this.name = 'UnhandledPromiseException';
    }
}

function handleGlobalError(error) {
    console.error('[GlobalErrorHandler]', error);
    
    // Enviar a sistema de monitoreo si está configurado
    if (window.portfolioConfig?.dev?.ERROR_REPORTING) {
        // Aquí se puede integrar con servicios como Sentry, LogRocket, etc.
        reportErrorToMonitoring(error);
    }
}

function reportErrorToMonitoring(error) {
    // Placeholder para integración con servicios de monitoreo
    // Ejemplo: Sentry.captureException(error);
}

// ==========================================
// EXPORTS
// ==========================================

export {
    // Base
    PortfolioException,
    
    // Configuration
    ConfigurationException,
    ConfigValidationException,
    ConfigFileNotFoundException,
    
    // Components
    ComponentException,
    ComponentMountException,
    ComponentDataException,
    
    // Navigation
    NavigationException,
    SectionNotFoundException,
    ScrollAnimationException,
    
    // Chatbot
    ChatbotException,
    ChatbotInitializationException,
    ChatbotMessageException,
    ChatbotRateLimitException,
    
    // Resources
    ResourceException,
    ImageLoadException,
    StylesheetLoadException,
    ScriptLoadException,
    
    // Forms
    FormException,
    FormValidationException,
    FormSubmissionException,
    
    // API
    APIException,
    APITimeoutException,
    APINetworkException,
    APIResponseException,
    
    // Performance
    PerformanceException,
    SlowRenderException,
    MemoryLeakException,
    
    // Global
    UnhandledScriptException,
    UnhandledPromiseException,
    RetryExhaustedException,
    
    // Setup
    setupGlobalErrorHandling
};