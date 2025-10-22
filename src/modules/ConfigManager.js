/**
 * 🏗️ DataCrypt Labs - Configuration Manager
 * Filosofía Mejora Continua v2.1 - Fase 1: Fundación Arquitectónica
 * 
 * Sistema de configuración centralizado y modular
 * Elimina hardcoding y permite configuración dinámica
 */

class ConfigManager {
    constructor() {
        this.configs = new Map();
        this.environment = this.detectEnvironment();
        this.loadDefaultConfigs();
    }

    detectEnvironment() {
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return 'development';
            } else if (window.location.hostname.includes('.github.io')) {
                return 'production';
            }
            return 'staging';
        }
        return 'development';
    }

    loadDefaultConfigs() {
        // Configuración del Sistema de Temas
        this.setConfig('themes', {
            default: 'dark',
            available: ['dark', 'light', 'cyberpunk', 'forest', 'sunset', 'ocean'],
            transitionDuration: '0.5s',
            persistKey: 'datacrypt-theme'
        });

        // Configuración PWA
        this.setConfig('pwa', {
            cacheVersion: 'v4.0',
            offlinePages: ['/', '/index.html'],
            updateCheckInterval: 60000, // 1 minuto
            notificationSettings: {
                enabled: true,
                requestPermission: true,
                badge: '/assets/images/icon-72x72.png'
            }
        });

        // Configuración del Game
        this.setConfig('dataWizardGame', {
            canvas: {
                width: 640,
                height: 480,
                pixelSize: 32,
                gridWidth: 20,
                gridHeight: 15
            },
            gameplay: {
                initialTime: 60,
                targetScore: 1000,
                colors: 6,
                particleCount: 50
            },
            performance: {
                maxFPS: 60,
                enableParticles: true,
                enableAnimations: true
            }
        });

        // Configuración de Performance
        this.setConfig('performance', {
            lazyLoading: {
                enabled: true,
                rootMargin: '50px 0px',
                threshold: 0.1
            },
            webVitals: {
                enabled: true,
                reportingEndpoint: null,
                thresholds: {
                    fcp: 2000,
                    lcp: 2500,
                    cls: 0.1
                }
            },
            codesplitting: {
                enabled: true,
                chunkSize: 'auto',
                preload: ['critical']
            }
        });

        // Configuración de Traducciones
        this.setConfig('i18n', {
            defaultLanguage: 'es',
            supportedLanguages: ['es', 'en'],
            persistKey: 'datacrypt-language',
            fallbackEnabled: true,
            autoDetect: true
        });

        // 🚫 CHATBOT COMPLETAMENTE DESACTIVADO POR SEGURIDAD
        this.setConfig('chatbot', {
            enabled: false,  // DESACTIVADO PERMANENTEMENTE
            provider: 'local', // 'local', 'openai', 'custom'
            appearance: {
                position: 'bottom-right',
                theme: 'auto', // seguirá el tema activo
                minimized: true,
                avatar: '🤖',
                title: 'DataCrypt Assistant',
                width: 380,
                height: 500,
                borderRadius: 15,
                boxShadow: true,
                backdrop: true
            },
            behavior: {
                autoGreeting: true,
                responseDelay: 1000,
                typingIndicator: true,
                maxHistory: 50,
                persistHistory: true,
                showQuickReplies: true,
                autoHideReplies: 10000,
                notificationDuration: 5000,
                greetingDelay: 2000
            },
            features: {
                quickReplies: true,
                fileUpload: false,
                voiceInput: false,
                suggestions: true,
                themes: true,
                markdown: true,
                history: true
            },
            
            // Base de conocimiento expandida
            knowledgeBase: {
                services: [
                    'Ciberseguridad Empresarial',
                    'Análisis de Datos Avanzado', 
                    'Inteligencia Artificial',
                    'Business Intelligence',
                    'Auditorías de Seguridad'
                ],
                contact: {
                    email: 'info@datacrypt-labs.com',
                    phone: '+1 (555) 123-4567',
                    whatsapp: '+1 (555) 123-4567',
                    website: 'datacrypt-labs.com',
                    location: 'Ciudad Tech, País'
                },
                company: {
                    name: 'DataCrypt Labs',
                    mission: 'Democratizar el acceso a tecnologías avanzadas de análisis de datos y ciberseguridad',
                    experience: '+5 años protegiendo y analizando datos empresariales',
                    specialty: 'Transformación digital y ventajas competitivas'
                },
                features: {
                    game: 'Data Wizard Game - Minijuego pixelado de análisis de datos',
                    themes: [
                        'Dark Matrix', 'Light Code', 'Cyberpunk 2077',
                        'Forest Code', 'Sunset Vibes', 'Deep Ocean'
                    ],
                    pwa: 'Aplicación Web Progresiva con instalación offline',
                    performance: 'Optimización extrema de rendimiento'
                }
            },
            
            // Respuestas personalizadas
            responses: {
                greetings: [
                    "¡Hola! Soy el asistente de DataCrypt Labs. ¿En qué puedo ayudarte hoy?",
                    "¡Bienvenido! Estoy aquí para resolver tus dudas sobre nuestros servicios.",
                    "¡Hola! ¿Te interesa conocer más sobre análisis de datos y ciberseguridad?"
                ],
                fallbacks: [
                    "🤔 Interesante pregunta. Permíteme conectarte con nuestro equipo especializado para darte la mejor respuesta.",
                    "📧 Para consultas específicas, te recomiendo contactarnos directamente. ¡Nuestro equipo experto te ayudará!",
                    "💡 Esa es una excelente pregunta. ¿Te gustaría agendar una consulta gratuita con nuestros especialistas?"
                ]
            },
            
            // Quick replies predefinidas
            quickReplies: [
                { text: "¿Qué servicios ofrecen?", icon: "💼", category: "services" },
                { text: "¿Cómo puedo contactarlos?", icon: "📞", category: "contact" },
                { text: "Cuéntame sobre DataCrypt Labs", icon: "ℹ️", category: "about" },
                { text: "¿Qué es el Data Wizard Game?", icon: "🎮", category: "game" },
                { text: "Mostrar temas disponibles", icon: "🎨", category: "themes" }
            ]
        });

        // Configuración específica por ambiente
        this.loadEnvironmentConfigs();
    }

    loadEnvironmentConfigs() {
        const envConfigs = {
            development: {
                debug: true,
                logging: 'verbose',
                hotReload: true,
                mockData: true,
                apiEndpoint: 'http://localhost:3000/api'
            },
            production: {
                debug: false,
                logging: 'error',
                hotReload: false,
                mockData: false,
                apiEndpoint: 'https://api.datacrypt-labs.com'
            },
            staging: {
                debug: true,
                logging: 'info',
                hotReload: false,
                mockData: false,
                apiEndpoint: 'https://staging-api.datacrypt-labs.com'
            }
        };

        this.setConfig('environment', envConfigs[this.environment]);
    }

    setConfig(key, value) {
        this.configs.set(key, value);
        this.notifyConfigChange(key, value);
    }

    getConfig(key, defaultValue = null) {
        return this.configs.get(key) || defaultValue;
    }

    updateConfig(key, updates) {
        const current = this.getConfig(key, {});
        const updated = { ...current, ...updates };
        this.setConfig(key, updated);
        return updated;
    }

    // Sistema de configuración dinámica
    setDynamicConfig(key, value) {
        localStorage.setItem(`datacrypt-config-${key}`, JSON.stringify(value));
        this.setConfig(key, value);
    }

    getDynamicConfig(key) {
        try {
            const stored = localStorage.getItem(`datacrypt-config-${key}`);
            return stored ? JSON.parse(stored) : this.getConfig(key);
        } catch (error) {
            console.warn('Failed to load dynamic config:', key, error);
            return this.getConfig(key);
        }
    }

    // Validación de configuración
    validateConfig(key, schema) {
        const config = this.getConfig(key);
        if (!config) return false;

        try {
            // Validación básica de tipos
            for (const [field, expectedType] of Object.entries(schema)) {
                if (typeof config[field] !== expectedType) {
                    console.error(`Config validation failed for ${key}.${field}: expected ${expectedType}, got ${typeof config[field]}`);
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.error('Config validation error:', error);
            return false;
        }
    }

    // Sistema de notificaciones de cambios
    notifyConfigChange(key, value) {
        const event = new CustomEvent('configChanged', {
            detail: { key, value, timestamp: Date.now() }
        });
        
        if (typeof window !== 'undefined') {
            window.dispatchEvent(event);
        }
    }

    // Exportar configuración para debugging
    exportConfig() {
        const config = {};
        for (const [key, value] of this.configs.entries()) {
            config[key] = value;
        }
        return {
            environment: this.environment,
            timestamp: new Date().toISOString(),
            config
        };
    }

    // Importar configuración
    importConfig(configData) {
        try {
            if (configData.config) {
                for (const [key, value] of Object.entries(configData.config)) {
                    this.setConfig(key, value);
                }
                console.log('Configuration imported successfully');
                return true;
            }
        } catch (error) {
            console.error('Failed to import configuration:', error);
            return false;
        }
    }

    // Reset a configuración por defecto
    resetConfig(key = null) {
        if (key) {
            this.configs.delete(key);
            this.loadDefaultConfigs(); // Recarga solo la configuración específica
        } else {
            this.configs.clear();
            this.loadDefaultConfigs();
        }
    }

    // API para componentes
    subscribe(key, callback) {
        const handler = (event) => {
            if (event.detail.key === key) {
                callback(event.detail.value);
            }
        };
        
        if (typeof window !== 'undefined') {
            window.addEventListener('configChanged', handler);
            
            // Retornar función de cleanup
            return () => window.removeEventListener('configChanged', handler);
        }
        
        return () => {}; // Noop cleanup para environments sin window
    }

    // Configuración reactiva
    getReactiveConfig(key) {
        return {
            get: () => this.getConfig(key),
            set: (value) => this.setConfig(key, value),
            update: (updates) => this.updateConfig(key, updates),
            subscribe: (callback) => this.subscribe(key, callback)
        };
    }
}

// Singleton instance
const configManager = new ConfigManager();

// Export para uso en módulos ES6
if (typeof window !== 'undefined') {
    window.ConfigManager = configManager;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
}

export default configManager;