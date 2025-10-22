/**
 * 🌱 FILOSOFÍA "LA MEJORA CONTINUA" v2.1
 * UTILIDADES TRANSVERSALES  
 * Siguiendo metodología exitosa del Pescador Bot 2.0
 * 
 * ⭐ Funciones auxiliares reutilizables
 * ⭐ Validación robusta integrada
 * ⭐ Performance optimizado
 */

import { 
    withRetry, 
    safeExecute,
    ResourceException,
    ImageLoadException,
    FormValidationException,
    PerformanceException 
} from './exceptions.js';

// ==========================================
// DOM UTILITIES
// ==========================================

/**
 * Selector robusto de elementos DOM con validación
 * ⭐ PATRÓN SEGURO - validación en todos los puntos
 */
export class DOMHelper {
    
    @safeExecute(null, true)
    static getElementById(id) {
        if (!id || typeof id !== 'string') {
            throw new Error('ID debe ser un string válido');
        }
        
        const element = document.getElementById(id);
        if (!element) {
            
        }
        
        return element;
    }
    
    @safeExecute([], true)
    static getElementsByClassName(className) {
        if (!className || typeof className !== 'string') {
            throw new Error('Clase debe ser un string válido');
        }
        
        return Array.from(document.getElementsByClassName(className));
    }
    
    @safeExecute(null, true)
    static querySelector(selector) {
        if (!selector || typeof selector !== 'string') {
            throw new Error('Selector debe ser un string válido');
        }
        
        return document.querySelector(selector);
    }
    
    @safeExecute([], true)
    static querySelectorAll(selector) {
        if (!selector || typeof selector !== 'string') {
            throw new Error('Selector debe ser un string válido');
        }
        
        return Array.from(document.querySelectorAll(selector));
    }
    
    /**
     * Crear elemento con atributos y clases
     * ⭐ BUILDER PATTERN para DOM
     */
    static createElement(tag, attributes = {}, classes = []) {
        if (!tag || typeof tag !== 'string') {
            throw new Error('Tag debe ser un string válido');
        }
        
        const element = document.createElement(tag);
        
        // Agregar atributos
        Object.entries(attributes).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                element.setAttribute(key, value);
            }
        });
        
        // Agregar clases
        if (Array.isArray(classes) && classes.length > 0) {
            element.classList.add(...classes);
        }
        
        return element;
    }
    
    /**
     * Verificar si elemento está visible en viewport
     * ⭐ PERFORMANCE - lazy loading y animaciones
     */
    static isElementInViewport(element, threshold = 0.1) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const vertInView = (rect.top <= windowHeight * (1 + threshold)) && 
                          ((rect.top + rect.height) >= windowHeight * threshold);
        
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
        
        return vertInView && horInView;
    }
}

// ==========================================
// ANIMATION UTILITIES
// ==========================================

/**
 * Sistema de animaciones con respeto a preferencias del usuario
 * ⭐ ACCESIBILIDAD - respeta prefers-reduced-motion
 */
export class AnimationHelper {
    
    static get shouldReduceMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    /**
     * Fade in con respeto a reduced motion
     */
    @safeExecute(false, true)
    static fadeIn(element, duration = 600, delay = 0) {
        if (!element) return false;
        
        if (this.shouldReduceMotion) {
            element.style.opacity = '1';
            return true;
        }
        
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, delay);
        
        return true;
    }
    
    /**
     * Slide in con dirección configurable
     */
    @safeExecute(false, true)
    static slideIn(element, direction = 'up', duration = 400, delay = 0) {
        if (!element) return false;
        
        if (this.shouldReduceMotion) {
            element.style.transform = 'none';
            element.style.opacity = '1';
            return true;
        }
        
        const transforms = {
            up: 'translateY(30px)',
            down: 'translateY(-30px)',
            left: 'translateX(30px)',
            right: 'translateX(-30px)'
        };
        
        element.style.transform = transforms[direction] || transforms.up;
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.transform = 'none';
            element.style.opacity = '1';
        }, delay);
        
        return true;
    }
    
    /**
     * Scroll suave a elemento con offset
     */
    @withRetry(2, 500)
    static async scrollToElement(elementOrId, offset = 0, duration = 800) {
        const element = typeof elementOrId === 'string' 
            ? DOMHelper.getElementById(elementOrId) 
            : elementOrId;
            
        if (!element) {
            throw new Error(`Elemento para scroll no encontrado: ${elementOrId}`);
        }
        
        const targetPosition = element.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();
        
        if (this.shouldReduceMotion) {
            window.scrollTo(0, targetPosition);
            return;
        }
        
        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// ==========================================
// RESOURCE LOADING UTILITIES  
// ==========================================

/**
 * Cargador de recursos con retry automático
 * ⭐ PATTERN COMPROBADO - retry con backoff
 */
export class ResourceLoader {
    
    /**
     * Cargar imagen con lazy loading y fallback
     */
    @withRetry(3, 1000)
    static async loadImage(src, fallbackSrc = null) {
        return new Promise((resolve, reject) => {
            if (!src) {
                reject(new ImageLoadException('URL de imagen requerida'));
                return;
            }
            
            const img = new Image();
            
            img.onload = () => resolve(img);
            
            img.onerror = () => {
                if (fallbackSrc && fallbackSrc !== src) {
                    // Intentar con imagen de fallback
                    this.loadImage(fallbackSrc, null)
                        .then(resolve)
                        .catch(() => reject(new ImageLoadException(src)));
                } else {
                    reject(new ImageLoadException(src));
                }
            };
            
            img.src = src;
        });
    }
    
    /**
     * Precargar múltiples imágenes
     */
    static async preloadImages(imageUrls, onProgress = null) {
        if (!Array.isArray(imageUrls)) {
            throw new Error('imageUrls debe ser un array');
        }
        
        const results = [];
        const total = imageUrls.length;
        
        for (let i = 0; i < total; i++) {
            try {
                const img = await this.loadImage(imageUrls[i]);
                results.push({ url: imageUrls[i], image: img, success: true });
                
                if (onProgress) {
                    onProgress((i + 1) / total, imageUrls[i], true);
                }
            } catch (error) {
                results.push({ url: imageUrls[i], error, success: false });
                
                if (onProgress) {
                    onProgress((i + 1) / total, imageUrls[i], false);
                }
            }
        }
        
        return results;
    }
    
    /**
     * Cargar CSS dinámicamente
     */
    @withRetry(2, 1000)
    static async loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            
            link.onload = () => resolve(link);
            link.onerror = () => reject(new Error(`Error cargando CSS: ${href}`));
            
            document.head.appendChild(link);
        });
    }
}

// ==========================================
// FORM VALIDATION UTILITIES
// ==========================================

/**
 * Validador robusto de formularios
 * ⭐ VALIDACIÓN ESPECÍFICA por tipo de campo
 */
export class FormValidator {
    
    static validators = {
        required: (value) => {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                return 'Este campo es requerido';
            }
            return null;
        },
        
        email: (value) => {
            if (!value) return null;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Formato de email inválido';
            }
            return null;
        },
        
        minLength: (minLength) => (value) => {
            if (!value) return null;
            if (value.length < minLength) {
                return `Mínimo ${minLength} caracteres requeridos`;
            }
            return null;
        },
        
        maxLength: (maxLength) => (value) => {
            if (!value) return null;
            if (value.length > maxLength) {
                return `Máximo ${maxLength} caracteres permitidos`;
            }
            return null;
        },
        
        pattern: (regex, message = 'Formato inválido') => (value) => {
            if (!value) return null;
            if (!regex.test(value)) {
                return message;
            }
            return null;
        }
    };
    
    /**
     * Validar formulario completo
     */
    static validateForm(formData, validationRules) {
        const errors = {};
        
        Object.entries(validationRules).forEach(([fieldName, rules]) => {
            const fieldValue = formData[fieldName];
            const fieldErrors = [];
            
            rules.forEach(rule => {
                if (typeof rule === 'string') {
                    // Regla simple como 'required'
                    const validator = this.validators[rule];
                    if (validator) {
                        const error = validator(fieldValue);
                        if (error) fieldErrors.push(error);
                    }
                } else if (typeof rule === 'object') {
                    // Regla con parámetros como { type: 'minLength', value: 3 }
                    const validator = this.validators[rule.type];
                    if (validator) {
                        const validatorFn = typeof validator === 'function' && rule.value !== undefined
                            ? validator(rule.value)
                            : validator;
                        const error = validatorFn(fieldValue);
                        if (error) fieldErrors.push(error);
                    }
                } else if (typeof rule === 'function') {
                    // Validador personalizado
                    const error = rule(fieldValue, formData);
                    if (error) fieldErrors.push(error);
                }
            });
            
            if (fieldErrors.length > 0) {
                errors[fieldName] = fieldErrors;
            }
        });
        
        if (Object.keys(errors).length > 0) {
            throw new FormValidationException(errors, formData);
        }
        
        return true;
    }
    
    /**
     * Sanitizar datos de entrada
     * ⭐ SEGURIDAD - prevención XSS
     */
    static sanitizeFormData(formData) {
        const sanitized = {};
        
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === 'string') {
                // Escape HTML básico
                sanitized[key] = value
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;')
                    .trim();
            } else {
                sanitized[key] = value;
            }
        });
        
        return sanitized;
    }
}

// ==========================================
// PERFORMANCE UTILITIES
// ==========================================

/**
 * Utilidades de performance y monitoreo
 * ⭐ MÉTRICAS AUTOMÁTICAS de rendimiento
 */
export class PerformanceHelper {
    
    static performanceMarks = new Map();
    
    /**
     * Iniciar medición de performance
     */
    static startMark(name) {
        const markName = `${name}-start`;
        performance.mark(markName);
        this.performanceMarks.set(name, { 
            start: performance.now(),
            markName 
        });
    }
    
    /**
     * Finalizar medición y obtener resultado
     */
    static endMark(name, logToConsole = true) {
        const markData = this.performanceMarks.get(name);
        if (!markData) {
            
            return null;
        }
        
        const endTime = performance.now();
        const duration = endTime - markData.start;
        
        const endMarkName = `${name}-end`;
        performance.mark(endMarkName);
        performance.measure(name, markData.markName, endMarkName);
        
        if (logToConsole) {
            
        }
        
        // Alertar si es muy lento
        if (duration > 1000) {
            
        }
        
        this.performanceMarks.delete(name);
        
        return {
            name,
            duration,
            timestamp: endTime
        };
    }
    
    /**
     * Debounce function para optimizar eventos
     */
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    /**
     * Throttle function para limitar frecuencia
     */
    static throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Observer para elementos en viewport (Intersection Observer)
     */
    static createIntersectionObserver(callback, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1,
            ...options
        };
        
        return new IntersectionObserver(callback, defaultOptions);
    }
}

// ==========================================
// LOCAL STORAGE UTILITIES
// ==========================================

/**
 * Wrapper seguro para localStorage con validación
 * ⭐ MANEJO ROBUSTO de storage con fallbacks
 */
export class StorageHelper {
    
    static isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    @safeExecute(null, false)
    static setItem(key, value, expiration = null) {
        if (!this.isStorageAvailable()) {
            
            return false;
        }
        
        const item = {
            value: value,
            timestamp: Date.now(),
            expiration: expiration
        };
        
        localStorage.setItem(key, JSON.stringify(item));
        return true;
    }
    
    @safeExecute(null, false)
    static getItem(key, defaultValue = null) {
        if (!this.isStorageAvailable()) {
            return defaultValue;
        }
        
        const itemStr = localStorage.getItem(key);
        if (!itemStr) {
            return defaultValue;
        }
        
        try {
            const item = JSON.parse(itemStr);
            
            // Verificar expiración
            if (item.expiration && Date.now() > item.expiration) {
                localStorage.removeItem(key);
                return defaultValue;
            }
            
            return item.value;
        } catch (e) {
            
            return defaultValue;
        }
    }
    
    @safeExecute(false, false)
    static removeItem(key) {
        if (!this.isStorageAvailable()) {
            return false;
        }
        
        localStorage.removeItem(key);
        return true;
    }
    
    @safeExecute(false, false)
    static clear() {
        if (!this.isStorageAvailable()) {
            return false;
        }
        
        localStorage.clear();
        return true;
    }
}

// ==========================================
// EXPORTS
// ==========================================

export {
    DOMHelper,
    AnimationHelper,
    ResourceLoader,
    FormValidator,
    PerformanceHelper,
    StorageHelper
};
