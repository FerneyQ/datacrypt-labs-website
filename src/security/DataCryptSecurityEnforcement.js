/**
 * 🛡️ DATACRYPT SECURITY ENFORCEMENT SYSTEM
 * Sistema de Seguridad Reforzado - Eliminación Completa Chatbot
 * Fecha: 21 Oct 2025
 * Política: ZERO CHATBOT TOLERANCE
 */

class DataCryptSecurityEnforcement {
    constructor() {
        this.securityLevel = 'MAXIMUM';
        this.chatbotPolicy = 'COMPLETELY_DISABLED';
        this.logLevel = 'DETAILED';
        
        // Inicializar monitoreo de seguridad
        this.initSecurityMonitoring();
        this.blockAllChatbotAttempts();
        this.logSecurityEvent('SECURITY_SYSTEM_INITIALIZED', {
            level: this.securityLevel,
            policy: this.chatbotPolicy,
            timestamp: Date.now()
        });
    }

    initSecurityMonitoring() {
        // Bloquear cualquier intento de crear chatbot
        const originalConsole = console.log;
        console.log = (...args) => {
            const message = args.join(' ');
            if (message.toLowerCase().includes('chatbot') || 
                message.toLowerCase().includes('alex') ||
                message.toLowerCase().includes('bot')) {
                this.logSecurityViolation('CHATBOT_REFERENCE_DETECTED', message);
            }
            originalConsole.apply(console, args);
        };

        // Interceptar intentos de DOM manipulation para chatbot
        this.interceptDOMManipulation();
        
        // Monitorear intentos de carga de scripts de chatbot
        this.monitorScriptLoading();
    }

    blockAllChatbotAttempts() {
        // Sobrescribir DataCryptChatbot para prevenir uso
        if (typeof window !== 'undefined') {
            window.DataCryptChatbot = function() {
                throw new Error('🚫 CHATBOT_BLOCKED: Sistema desactivado por políticas de seguridad');
            };

            // Bloquear variables globales relacionadas
            window.dataCryptChatbot = null;
            window.chatbotConfig = null;
            
            // Interceptar jQuery/DOM attempts
            this.interceptChatbotDOM();
        }
    }

    interceptDOMManipulation() {
        if (typeof document !== 'undefined') {
            const originalCreateElement = document.createElement;
            document.createElement = function(tagName) {
                const element = originalCreateElement.call(this, tagName);
                
                // Interceptar elementos con clases de chatbot
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name === 'class' && typeof value === 'string') {
                        if (value.includes('chat') || value.includes('bot')) {
                            console.error('🚫 BLOCKED: Intento de crear elemento chatbot');
                            return;
                        }
                    }
                    originalSetAttribute.call(this, name, value);
                };
                
                return element;
            };
        }
    }

    interceptChatbotDOM() {
        // Interceptar intentos de agregar elementos de chatbot al DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.scanForChatbotElements(node);
                        }
                    });
                }
            });
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
    }

    scanForChatbotElements(element) {
        // Escanear elementos por contenido de chatbot
        const chatbotKeywords = ['chat-widget', 'chat-button', 'chat-window', 'alex', 'bot-'];
        
        if (element.className) {
            const className = element.className.toLowerCase();
            chatbotKeywords.forEach(keyword => {
                if (className.includes(keyword)) {
                    this.logSecurityViolation('DOM_CHATBOT_ATTEMPT', {
                        element: element.tagName,
                        className: className,
                        action: 'BLOCKED_AND_REMOVED'
                    });
                    
                    // Remover elemento inmediatamente
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                }
            });
        }
    }

    monitorScriptLoading() {
        // Interceptar carga de scripts relacionados con chatbot
        const originalAppendChild = Node.prototype.appendChild;
        Node.prototype.appendChild = function(child) {
            if (child.tagName === 'SCRIPT') {
                const src = child.src || child.innerHTML || '';
                if (src.toLowerCase().includes('chatbot') || 
                    src.toLowerCase().includes('alex') ||
                    src.toLowerCase().includes('datacryptchat')) {
                    
                    console.error('🚫 SCRIPT BLOCKED: Intento de cargar script de chatbot');
                    this.logSecurityViolation('SCRIPT_LOAD_BLOCKED', src);
                    return child; // No ejecutar appendChild
                }
            }
            return originalAppendChild.call(this, child);
        }.bind(this);
    }

    logSecurityViolation(type, details) {
        const violation = {
            type: type,
            timestamp: Date.now(),
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href,
            severity: 'HIGH'
        };

        console.error(`🚨 SECURITY VIOLATION: ${type}`, violation);
        
        // Guardar en localStorage para auditoría
        const violations = JSON.parse(localStorage.getItem('datacrypt_security_violations') || '[]');
        violations.push(violation);
        localStorage.setItem('datacrypt_security_violations', JSON.stringify(violations.slice(-50)));
    }

    logSecurityEvent(type, data) {
        const event = {
            type: type,
            timestamp: Date.now(),
            data: data,
            severity: 'INFO'
        };

        console.info(`🛡️ SECURITY EVENT: ${type}`, event);
        
        const events = JSON.parse(localStorage.getItem('datacrypt_security_events') || '[]');
        events.push(event);
        localStorage.setItem('datacrypt_security_events', JSON.stringify(events.slice(-100)));
    }

    // Método para verificar integridad del sistema
    performSecurityAudit() {
        console.log('🔍 EJECUTANDO AUDITORÍA DE SEGURIDAD...');
        
        const audit = {
            timestamp: Date.now(),
            chatbotBlocked: window.DataCryptChatbot === undefined || typeof window.DataCryptChatbot === 'function',
            domElements: document.querySelectorAll('[class*="chat"], [class*="bot"]').length,
            violations: JSON.parse(localStorage.getItem('datacrypt_security_violations') || '[]').length,
            securityLevel: this.securityLevel,
            status: 'SECURE'
        };

        if (audit.domElements > 0) {
            audit.status = 'COMPROMISED';
            console.error('🚨 COMPROMISO DETECTADO: Elementos de chatbot en DOM');
        }

        console.log('📊 REPORTE DE AUDITORÍA:', audit);
        return audit;
    }

    // Método de emergencia para limpiar todo rastro de chatbot
    emergencyCleanup() {
        console.warn('🧹 EJECUTANDO LIMPIEZA DE EMERGENCIA...');
        
        // Remover todos los elementos sospechosos del DOM
        const suspiciousSelectors = [
            '[class*="chat"]',
            '[class*="bot"]',
            '[id*="chat"]',
            '[id*="bot"]',
            '[data-chatbot]'
        ];

        suspiciousSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                    console.log(`🗑️ Removido: ${element.tagName}.${element.className}`);
                }
            });
        });

        // Limpiar variables globales
        delete window.DataCryptChatbot;
        delete window.dataCryptChatbot;
        delete window.chatbotConfig;
        
        // Limpiar localStorage de datos de chatbot
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('chat') || key.includes('bot'))) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            console.log(`🗑️ Removido localStorage: ${key}`);
        });

        this.logSecurityEvent('EMERGENCY_CLEANUP_EXECUTED', {
            removedElements: suspiciousSelectors.length,
            removedKeys: keysToRemove.length
        });
        
        console.log('✅ LIMPIEZA DE EMERGENCIA COMPLETADA');
    }

    // Generar reporte de seguridad
    generateSecurityReport() {
        const report = {
            timestamp: Date.now(),
            securityLevel: this.securityLevel,
            chatbotPolicy: this.chatbotPolicy,
            violations: JSON.parse(localStorage.getItem('datacrypt_security_violations') || '[]'),
            events: JSON.parse(localStorage.getItem('datacrypt_security_events') || '[]'),
            audit: this.performSecurityAudit(),
            recommendations: [
                'Mantener chatbot desactivado',
                'Monitorear intentos de reactivación',
                'Realizar auditorías regulares',
                'Contacto directo: ferneyquiroga101@gmail.com'
            ]
        };

        console.log('📋 REPORTE DE SEGURIDAD GENERADO:', report);
        return report;
    }
}

// Auto-inicialización del sistema de seguridad
if (typeof window !== 'undefined') {
    window.DataCryptSecurityEnforcement = DataCryptSecurityEnforcement;
    
    // Inicializar inmediatamente
    document.addEventListener('DOMContentLoaded', () => {
        window.dataCryptSecurity = new DataCryptSecurityEnforcement();
        console.log('🛡️ SISTEMA DE SEGURIDAD REFORZADO ACTIVADO');
    });
    
    // Inicializar también si el DOM ya está listo
    if (document.readyState === 'loading') {
        // DOM aún cargando
    } else {
        // DOM ya listo
        window.dataCryptSecurity = new DataCryptSecurityEnforcement();
        console.log('🛡️ SISTEMA DE SEGURIDAD REFORZADO ACTIVADO (DOM READY)');
    }
}

export default DataCryptSecurityEnforcement;