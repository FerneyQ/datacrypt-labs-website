/**
 * 🔒 DataCrypt Labs - Sistema de Seguridad Avanzado
 * Implementación de múltiples capas de seguridad para protección enterprise
 */

class DataCryptSecurity {
    constructor() {
        this.securityLevel = 'HIGH';
        this.monitor = new SecurityMonitor();
        this.antiBot = new AntiBot();
        this.validator = new SecurityValidator();
        this.backup = new SecurityBackup();
        this.dashboard = new SecurityDashboard();
        
        this.initializeSecurity();
    }

    initializeSecurity() {
        this.implementSecurityHeaders();
        this.setupAntiTampering();
        this.initializeMonitoring();
        this.setupRateLimiting();
        
        
        
    }

    // Headers de seguridad HTTP
    implementSecurityHeaders() {
        const head = document.head;
        
        // Content Security Policy
        const csp = document.createElement('meta');
        csp.httpEquiv = 'Content-Security-Policy';
        csp.content = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
            font-src 'self' https://fonts.gstatic.com;
            img-src 'self' data: https:;
            connect-src 'self' https:;
            frame-ancestors 'none';
        `.replace(/\s+/g, ' ').trim();
        head.appendChild(csp);

        // X-Frame-Options
        const xFrame = document.createElement('meta');
        xFrame.httpEquiv = 'X-Frame-Options';
        xFrame.content = 'DENY';
        head.appendChild(xFrame);

        // X-Content-Type-Options
        const xContent = document.createElement('meta');
        xContent.httpEquiv = 'X-Content-Type-Options';
        xContent.content = 'nosniff';
        head.appendChild(xContent);

        // Referrer Policy
        const referrer = document.createElement('meta');
        referrer.name = 'referrer';
        referrer.content = 'strict-origin-when-cross-origin';
        head.appendChild(referrer);
    }

    // Protección anti-tampering
    setupAntiTampering() {
        // Desactivar herramientas de desarrollo
        document.addEventListener('keydown', (e) => {
            // F12, Ctrl+Shift+I, Ctrl+U
            if (e.keyCode === 123 || 
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                (e.ctrlKey && e.keyCode === 85)) {
                e.preventDefault();
                this.logSecurityEvent('DEV_TOOLS_ATTEMPT');
                return false;
            }
        });

        // Desactivar menú contextual
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.logSecurityEvent('CONTEXT_MENU_ATTEMPT');
            return false;
        });

        // Detección de DevTools
        setInterval(() => {
            if (this.detectDevTools()) {
                this.logSecurityEvent('DEV_TOOLS_DETECTED');
                console.clear();
            }
        }, 1000);
    }

    detectDevTools() {
        const threshold = 160;
        return (
            window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold
        );
    }

    initializeMonitoring() {
        // Monitorear errores JavaScript
        window.addEventListener('error', (e) => {
            this.logSecurityEvent('JS_ERROR', {
                message: e.message,
                source: e.filename,
                line: e.lineno,
                column: e.colno
            });
        });

        // Monitorear cambios en el DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 10) {
                    this.logSecurityEvent('SUSPICIOUS_DOM_CHANGES', {
                        nodesAdded: mutation.addedNodes.length
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupRateLimiting() {
        const originalFetch = window.fetch;
        let requestCount = 0;
        const maxRequests = 30;
        const timeWindow = 60000; // 1 minuto
        let windowStart = Date.now();

        window.fetch = (...args) => {
            const now = Date.now();
            
            if (now - windowStart >= timeWindow) {
                requestCount = 0;
                windowStart = now;
            }
            
            requestCount++;
            
            if (requestCount > maxRequests) {
                this.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
                    requests: requestCount,
                    timeWindow: timeWindow
                });
                return Promise.reject(new Error('Rate limit exceeded'));
            }
            
            return originalFetch.apply(window, args);
        };
    }

    logSecurityEvent(type, data = {}) {
        const event = {
            id: this.generateEventId(),
            type,
            data,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Almacenar en localStorage
        const logs = JSON.parse(localStorage.getItem('datacrypt_security_logs') || '[]');
        logs.push(event);
        
        // Mantener solo los últimos 1000 eventos
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }
        
        localStorage.setItem('datacrypt_security_logs', JSON.stringify(logs));

        // Log en consola
        

        // Analizar patrones sospechosos
        this.analyzeSecurityPatterns(logs);
    }

    analyzeSecurityPatterns(logs) {
        const recentEvents = logs.filter(log => 
            Date.now() - log.timestamp < 300000 // Últimos 5 minutos
        );

        if (recentEvents.length > 20) {
            this.triggerSecurityAlert('HIGH_ACTIVITY', {
                eventCount: recentEvents.length,
                timespan: '5 minutes'
            });
        }

        // Detectar patrones específicos
        const devToolsAttempts = recentEvents.filter(e => 
            e.type.includes('DEV_TOOLS')).length;
        
        if (devToolsAttempts > 5) {
            this.triggerSecurityAlert('PERSISTENT_DEV_TOOLS_ATTEMPTS', {
                attempts: devToolsAttempts
            });
        }
    }

    triggerSecurityAlert(type, data) {
        const alert = {
            type,
            data,
            timestamp: Date.now(),
            severity: 'HIGH'
        };

        
        
        // En producción: enviar al servidor de monitoreo
        // this.sendToSecurityServer(alert);
    }

    generateEventId() {
        return 'SEC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Validación y sanitización
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input
            .replace(/[<>\"'&]/g, (match) => {
                const entityMap = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                    '&': '&amp;'
                };
                return entityMap[match];
            })
            .trim()
            .substring(0, 1000);
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) && email.length < 100;
    }

    // Backup de seguridad
    createSecurityBackup() {
        const backupData = {
            timestamp: Date.now(),
            securityLogs: localStorage.getItem('datacrypt_security_logs'),
            chatHistory: localStorage.getItem('datacrypt_chat_history'),
            userPreferences: localStorage.getItem('datacrypt_preferences'),
            version: '2.0'
        };

        localStorage.setItem('datacrypt_security_backup', JSON.stringify(backupData));
        
        return true;
    }

    // Dashboard de seguridad
    getSecurityStatus() {
        const logs = JSON.parse(localStorage.getItem('datacrypt_security_logs') || '[]');
        const recentLogs = logs.filter(log => 
            Date.now() - log.timestamp < 86400000 // Últimas 24 horas
        );

        const eventTypes = {};
        recentLogs.forEach(log => {
            eventTypes[log.type] = (eventTypes[log.type] || 0) + 1;
        });

        return {
            status: 'SECURE',
            level: this.securityLevel,
            totalEvents: logs.length,
            recentEvents: recentLogs.length,
            eventTypes,
            lastUpdate: Date.now(),
            protections: {
                antiTampering: true,
                rateLimit: true,
                inputValidation: true,
                monitoring: true,
                backup: true
            }
        };
    }

    // Integración con chatbot
    validateChatMessage(message) {
        // Sanitizar mensaje
        const sanitized = this.sanitizeInput(message);
        
        // Validar longitud
        if (sanitized.length > 500) {
            this.logSecurityEvent('LONG_MESSAGE_ATTEMPT', { length: sanitized.length });
            return {
                valid: false,
                message: 'Mensaje demasiado largo. Máximo 500 caracteres.'
            };
        }

        // Detectar spam
        const spamPatterns = [
            /(.)\1{10,}/g, // Caracteres repetidos
            /https?:\/\/[^\s]+/g, // URLs
            /(viagra|casino|lottery|winner|hack|crack)/gi
        ];

        for (let pattern of spamPatterns) {
            if (pattern.test(sanitized)) {
                this.logSecurityEvent('SPAM_DETECTED', { pattern: pattern.source });
                return {
                    valid: false,
                    message: 'Mensaje contiene contenido no permitido.'
                };
            }
        }

        return {
            valid: true,
            message: sanitized
        };
    }

    // Método público para inicializar
    static initialize() {
        if (typeof window !== 'undefined') {
            window.DataCryptSecurity = new DataCryptSecurity();
            return window.DataCryptSecurity;
        }
    }
}

// Clases auxiliares (simplificadas para el archivo principal)
class SecurityMonitor {
    constructor() {
        this.events = [];
        this.maxEvents = 1000;
    }
}

class AntiBot {
    constructor() {
        this.requestCount = 0;
        this.maxRequests = 30;
    }
}

class SecurityValidator {
    static sanitizeInput(input) {
        return input.replace(/[<>\"'&]/g, '').trim();
    }
}

class SecurityBackup {
    constructor() {
        this.backupInterval = 24 * 60 * 60 * 1000;
    }
}

class SecurityDashboard {
    constructor() {
        this.metrics = {
            totalRequests: 0,
            blockedRequests: 0,
            securityEvents: 0
        };
    }
}

// Auto-inicializar cuando se carga el script
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        DataCryptSecurity.initialize();
    });
}

// Exportar para uso en Node.js si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataCryptSecurity;
}
