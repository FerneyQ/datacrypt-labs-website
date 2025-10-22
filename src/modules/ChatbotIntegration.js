/**
 * 🔗 DataCrypt Labs - Chatbot Integration
 * Filosofía Mejora Continua v2.1 - Integración Modular
 * 
 * Sistema de integración que conecta el chatbot con todos los sistemas existentes
 * Siguiendo el principio de "Zero Breaking Changes"
 */

class ChatbotIntegration {
    constructor() {
        this.chatbot = null;
        this.configManager = null;
        this.themeSystem = null;
        this.translationSystem = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            // Esperar a que los sistemas estén listos
            await this.waitForSystems();
            
            // Configurar referencias
            this.setupSystemReferences();
            
            // Integrar con ConfigManager
            this.integrateWithConfigManager();
            
            // Integrar con Theme System
            this.integrateWithThemeSystem();
            
            // Integrar con Translation System
            this.integrateWithTranslationSystem();
            
            // Inicializar chatbot
            await this.initializeChatbot();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            
            
        } catch (error) {
            
        }
    }

    async waitForSystems() {
        const maxAttempts = 50;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            if (window.ConfigManager && 
                window.DataCryptChatbot &&
                document.readyState === 'complete') {
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (attempts >= maxAttempts) {
            throw new Error('Required systems not available after timeout');
        }
    }

    setupSystemReferences() {
        this.configManager = window.ConfigManager;
        this.themeSystem = window.themeSystem;
        this.translationSystem = window.translationSystem;
    }

    integrateWithConfigManager() {
        if (!this.configManager) return;
        
        // Suscribirse a cambios de configuración
        this.configManager.onChange('chatbot', (newConfig) => {
            this.updateChatbotConfig(newConfig);
        });
        
        
    }

    integrateWithThemeSystem() {
        if (!this.themeSystem) return;
        
        // Escuchar cambios de tema
        window.addEventListener('themeChanged', (event) => {
            this.updateChatbotTheme(event.detail.themeData);
        });
        
        
    }

    integrateWithTranslationSystem() {
        if (!this.translationSystem) return;
        
        // Escuchar cambios de idioma
        window.addEventListener('languageChanged', (event) => {
            this.updateChatbotLanguage(event.detail.language);
        });
        
        
    }

    async initializeChatbot() {
        const chatbotConfig = this.configManager.getConfig('chatbot');
        
        if (!chatbotConfig.enabled) {
            
            return;
        }

        // Configuración mejorada con datos del ConfigManager
        const enhancedConfig = this.enhanceChatbotConfig(chatbotConfig);
        
        // Crear instancia del chatbot
        this.chatbot = new window.DataCryptChatbot(enhancedConfig);
        
        // Hacer referencia global para debugging
        window.dataCryptChatbot = this.chatbot;
        
        
    }

    enhanceChatbotConfig(baseConfig) {
        // Obtener tema actual
        const currentTheme = this.themeSystem ? this.themeSystem.getCurrentTheme() : null;
        
        // Obtener idioma actual
        const currentLanguage = this.translationSystem ? 
            this.translationSystem.getCurrentLanguage() : 'es';
        
        // Configuración mejorada
        return {
            // Configuración base del ConfigManager
            ...baseConfig.appearance,
            ...baseConfig.behavior,
            
            // Integración con sistemas
            theme: currentTheme ? currentTheme.id : 'dark-matrix',
            language: currentLanguage,
            
            // Knowledge base personalizada
            knowledgeBase: this.buildKnowledgeBase(baseConfig.knowledgeBase, currentLanguage),
            
            // Respuestas localizadas
            responses: this.localizeResponses(baseConfig.responses, currentLanguage),
            
            // Quick replies localizadas
            quickReplies: this.localizeQuickReplies(baseConfig.quickReplies, currentLanguage),
            
            // Callbacks de integración
            onThemeChange: (themeData) => this.handleThemeChange(themeData),
            onLanguageChange: (language) => this.handleLanguageChange(language),
            onConfigChange: (config) => this.handleConfigChange(config)
        };
    }

    buildKnowledgeBase(baseKB, language) {
        const kb = { ...baseKB };
        
        // Agregar información dinámica del sitio
        if (this.configManager) {
            const gameConfig = this.configManager.getConfig('game');
            const themeConfig = this.configManager.getConfig('themes');
            const pwaConfig = this.configManager.getConfig('pwa');
            
            // Información del juego
            if (gameConfig) {
                kb.game = {
                    name: gameConfig.name || 'Data Wizard Game',
                    description: language === 'es' ? 
                        'Minijuego pixelado donde puedes experimentar patrones de análisis de datos reales' :
                        'Pixel mini-game where you can experience real data analysis patterns',
                    levels: gameConfig.levels || 5,
                    difficulty: gameConfig.difficulty || 'progressive'
                };
            }
            
            // Información de temas
            if (themeConfig && themeConfig.themes) {
                kb.themes = Object.values(themeConfig.themes).map(theme => ({
                    id: theme.id,
                    name: theme.name,
                    description: theme.description || ''
                }));
            }
            
            // Información PWA
            if (pwaConfig) {
                kb.pwa = {
                    installable: pwaConfig.installable,
                    offline: pwaConfig.offlineCapability,
                    features: pwaConfig.features || []
                };
            }
        }
        
        return kb;
    }

    localizeResponses(responses, language) {
        if (language === 'en') {
            return {
                greetings: [
                    "Hello! I'm the DataCrypt Labs assistant. How can I help you today?",
                    "Welcome! I'm here to answer your questions about our services.",
                    "Hi! Are you interested in learning more about data analysis and cybersecurity?"
                ],
                fallbacks: [
                    "🤔 Interesting question. Let me connect you with our specialized team for the best answer.",
                    "📧 For specific inquiries, I recommend contacting us directly. Our expert team will help you!",
                    "💡 That's an excellent question. Would you like to schedule a free consultation with our specialists?"
                ]
            };
        }
        
        return responses; // Español por defecto
    }

    localizeQuickReplies(quickReplies, language) {
        if (language === 'en') {
            return [
                { text: "What services do you offer?", icon: "💼", category: "services" },
                { text: "How can I contact you?", icon: "📞", category: "contact" },
                { text: "Tell me about DataCrypt Labs", icon: "ℹ️", category: "about" },
                { text: "What is the Data Wizard Game?", icon: "🎮", category: "game" },
                { text: "Show available themes", icon: "🎨", category: "themes" }
            ];
        }
        
        return quickReplies; // Español por defecto
    }

    setupEventListeners() {
        // Listener para cambios en el juego
        window.addEventListener('gameStateChanged', (event) => {
            this.notifyChatbotGameUpdate(event.detail);
        });
        
        // Listener para certificaciones
        window.addEventListener('certificationsLoaded', (event) => {
            this.updateChatbotCertifications(event.detail);
        });
        
        // Listener para PWA
        window.addEventListener('pwaInstalled', () => {
            this.chatbot?.sendProgrammaticMessage(
                '🎉 ¡Excelente! Has instalado DataCrypt Labs como PWA. Ahora puedes acceder offline.'
            );
        });
    }

    // Métodos de actualización
    updateChatbotConfig(newConfig) {
        if (!this.chatbot) return;
        
        this.chatbot.updateConfig(newConfig);
        
    }

    updateChatbotTheme(themeData) {
        if (!this.chatbot) return;
        
        this.chatbot.updateTheme(themeData);
        
    }

    updateChatbotLanguage(language) {
        if (!this.chatbot) return;
        
        // Actualizar respuestas y quick replies
        const chatbotConfig = this.configManager.getConfig('chatbot');
        const localizedResponses = this.localizeResponses(chatbotConfig.responses, language);
        const localizedQuickReplies = this.localizeQuickReplies(chatbotConfig.quickReplies, language);
        
        this.chatbot.updateConfig({
            language,
            responses: localizedResponses,
            quickReplies: localizedQuickReplies
        });
        
        
    }

    // Handlers de eventos
    handleThemeChange(themeData) {
        
    }

    handleLanguageChange(language) {
        
    }

    handleConfigChange(config) {
        
    }

    notifyChatbotGameUpdate(gameState) {
        if (!this.chatbot) return;
        
        if (gameState.levelCompleted) {
            this.chatbot.sendProgrammaticMessage(
                `🎮 ¡Felicidades! Completaste el nivel ${gameState.level} del Data Wizard Game. ¡Sigue así!`
            );
        }
    }

    updateChatbotCertifications(certifications) {
        if (!this.chatbot || !certifications.length) return;
        
        // Actualizar knowledge base con certificaciones
        const kb = this.chatbot.knowledgeBase;
        kb.certifications = certifications.map(cert => ({
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date,
            verified: cert.verified
        }));
    }

    // API pública
    getChatbot() {
        return this.chatbot;
    }

    isReady() {
        return this.isInitialized && this.chatbot;
    }

    sendMessage(message) {
        if (this.chatbot) {
            this.chatbot.sendProgrammaticMessage(message);
        }
    }

    openChat() {
        if (this.chatbot) {
            this.chatbot.openChat();
        }
    }

    closeChat() {
        if (this.chatbot) {
            this.chatbot.closeChat();
        }
    }

    // Métodos de testing para TestRunner
    runTests() {
        if (!window.TestRunner) {
            
            return;
        }

        const tests = window.TestRunner.createSuite('ChatbotIntegration');
        
        tests.describe('Chatbot Integration', () => {
            tests.it('should initialize successfully', () => {
                tests.expect(this.isInitialized).toBe(true);
            });
            
            tests.it('should have chatbot instance', () => {
                tests.expect(this.chatbot).toBeTruthy();
            });
            
            tests.it('should integrate with ConfigManager', () => {
                tests.expect(this.configManager).toBeTruthy();
            });
            
            tests.it('should respond to theme changes', () => {
                const initialTheme = this.chatbot.currentTheme;
                this.updateChatbotTheme({ name: 'test-theme', primary: '#ff0000' });
                tests.expect(this.chatbot.currentTheme).not.toBe(initialTheme);
            });
        });
        
        return tests.run();
    }
}

// Auto-inicialización
if (typeof window !== 'undefined') {
    window.ChatbotIntegration = ChatbotIntegration;
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.chatbotIntegration = new ChatbotIntegration();
        });
    } else {
        window.chatbotIntegration = new ChatbotIntegration();
    }
}

export default ChatbotIntegration;
