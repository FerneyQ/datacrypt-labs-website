/**
 * 🤖 DataCrypt Labs - Intelligent Chatbot Component
 * Filosofía Mejora Continua v2.1 - Componente Modular Reutilizable
 * 
 * Chatbot inteligente integrado como solicitado en la semilla
 * Arquitectura modular y configurable
 */

class DataCryptChatbot {
    constructor(config = {}) {
        this.config = {
            // Configuración por defecto
            container: document.body,
            position: 'bottom-right',
            theme: 'auto',
            minimized: true,
            avatar: '🤖',
            title: 'DataCrypt Assistant',
            autoGreeting: true,
            responseDelay: 1000,
            typingIndicator: true,
            maxHistory: 50,
            ...config
        };

        this.isOpen = false;
        this.isTyping = false;
        this.chatHistory = [];
        this.currentTheme = 'dark';
        this.knowledgeBase = this.initializeKnowledgeBase();
        
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.setupEventListeners();
        this.loadChatHistory();
        
        // Integración con sistema de temas
        if (window.themeSystem) {
            window.addEventListener('themeChanged', (e) => {
                this.updateTheme(e.detail.themeData);
            });
        }

        if (this.config.autoGreeting) {
            setTimeout(() => this.showGreeting(), 2000);
        }

        console.log('🤖 DataCrypt Chatbot initialized');
    }

    createChatbotUI() {
        // Container principal
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'datacrypt-chatbot';
        this.chatContainer.innerHTML = this.getChatbotHTML();
        
        this.config.container.appendChild(this.chatContainer);

        // Referencias a elementos
        this.chatWidget = this.chatContainer.querySelector('.chat-widget');
        this.chatButton = this.chatContainer.querySelector('.chat-button');
        this.chatWindow = this.chatContainer.querySelector('.chat-window');
        this.chatMessages = this.chatContainer.querySelector('.chat-messages');
        this.chatInput = this.chatContainer.querySelector('.chat-input');
        this.sendButton = this.chatContainer.querySelector('.send-button');
        this.closeButton = this.chatContainer.querySelector('.close-button');
        this.minimizeButton = this.chatContainer.querySelector('.minimize-button');
    }

    getChatbotHTML() {
        return `
            <div class="chat-widget">
                <!-- Botón flotante -->
                <div class="chat-button">
                    <span class="chat-avatar">${this.config.avatar}</span>
                    <div class="chat-notification" style="display: none;">
                        <span class="notification-count">1</span>
                    </div>
                </div>

                <!-- Ventana de chat -->
                <div class="chat-window" style="display: none;">
                    <div class="chat-header">
                        <div class="chat-title">
                            <span class="chat-avatar">${this.config.avatar}</span>
                            <span class="title-text">${this.config.title}</span>
                            <span class="online-status"></span>
                        </div>
                        <div class="chat-controls">
                            <button class="minimize-button" title="Minimizar">−</button>
                            <button class="close-button" title="Cerrar">×</button>
                        </div>
                    </div>
                    
                    <div class="chat-body">
                        <div class="chat-messages"></div>
                        
                        <div class="typing-indicator" style="display: none;">
                            <div class="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span class="typing-text">DataCrypt Assistant está escribiendo...</span>
                        </div>
                    </div>

                    <div class="chat-footer">
                        <div class="quick-replies" style="display: none;">
                            <button class="quick-reply" data-text="¿Qué servicios ofrecen?">💼 Servicios</button>
                            <button class="quick-reply" data-text="¿Cómo puedo contactarlos?">📞 Contacto</button>
                            <button class="quick-reply" data-text="Cuéntame sobre DataCrypt Labs">ℹ️ Sobre nosotros</button>
                        </div>
                        
                        <div class="chat-input-container">
                            <input type="text" class="chat-input" placeholder="Escribe tu mensaje..." maxlength="500">
                            <button class="send-button" title="Enviar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Toggle chat
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.closeButton.addEventListener('click', () => this.closeChat());
        this.minimizeButton.addEventListener('click', () => this.minimizeChat());

        // Envío de mensajes
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick replies
        this.chatContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                const text = e.target.dataset.text;
                this.sendMessage(text);
            }
        });

        // Auto-resize input
        this.chatInput.addEventListener('input', () => {
            this.adjustInputHeight();
        });
    }

    initializeKnowledgeBase() {
        return {
            greetings: [
                "¡Hola! Soy el asistente de DataCrypt Labs. ¿En qué puedo ayudarte hoy?",
                "¡Bienvenido! Estoy aquí para resolver tus dudas sobre nuestros servicios.",
                "¡Hola! ¿Te interesa conocer más sobre análisis de datos y ciberseguridad?"
            ],
            services: {
                keywords: ['servicio', 'servicios', 'que hacen', 'ofrecen', 'especialidad'],
                responses: [
                    "🚀 En DataCrypt Labs nos especializamos en:\n\n• 🔒 **Ciberseguridad Empresarial**\n• 📊 **Análisis de Datos Avanzado**\n• 🤖 **Inteligencia Artificial**\n• 📈 **Business Intelligence**\n• 🛡️ **Auditorías de Seguridad**\n\n¿Te interesa algún servicio en particular?"
                ]
            },
            contact: {
                keywords: ['contacto', 'contactar', 'teléfono', 'email', 'ubicación'],
                responses: [
                    "📞 **Contáctanos:**\n\n• 📧 Email: info@datacrypt-labs.com\n• 📱 WhatsApp: +1 (555) 123-4567\n• 🌐 Web: datacrypt-labs.com\n• 📍 Ubicación: Ciudad Tech, País\n\n¡Respondemos en menos de 24 horas!"
                ]
            },
            about: {
                keywords: ['datacrypt', 'empresa', 'quienes son', 'sobre', 'información'],
                responses: [
                    "🏢 **DataCrypt Labs** es una empresa líder en transformación digital que convierte datos en ventajas competitivas.\n\n✨ **Nuestra misión:** Democratizar el acceso a tecnologías avanzadas de análisis de datos y ciberseguridad.\n\n🎯 **Experiencia:** +5 años protegiendo y analizando datos empresariales."
                ]
            },
            game: {
                keywords: ['juego', 'game', 'data wizard', 'minijuego'],
                responses: [
                    "🎮 ¡El **Data Wizard Game** es nuestra forma divertida de mostrar cómo trabajamos con datos!\n\nEs un minijuego pixelado donde puedes experimentar patrones de análisis de datos reales. ¿Ya lo probaste? ¡Dale una oportunidad!"
                ]
            },
            themes: {
                keywords: ['tema', 'temas', 'colores', 'dark', 'light', 'cyberpunk'],
                responses: [
                    "🎨 ¡Tenemos 6 temas increíbles!\n\n• 🌙 Dark Matrix\n• ☀️ Light Code\n• 🔥 Cyberpunk 2077\n• 🌲 Forest Code\n• 🌅 Sunset Vibes\n• 🌊 Deep Ocean\n\n¡Puedes cambiarlos desde el selector en la navegación!"
                ]
            },
            default: [
                "🤔 Interesante pregunta. Permíteme conectarte con nuestro equipo especializado para darte la mejor respuesta.",
                "📧 Para consultas específicas, te recomiendo contactarnos directamente. ¡Nuestro equipo experto te ayudará!",
                "💡 Esa es una excelente pregunta. ¿Te gustaría agendar una consulta gratuita con nuestros especialistas?"
            ]
        };
    }

    async sendMessage(text = null) {
        const message = text || this.chatInput.value.trim();
        if (!message) return;

        // Agregar mensaje del usuario
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.adjustInputHeight();

        // Mostrar typing indicator
        this.showTyping();

        // Simular delay de respuesta
        await this.delay(this.config.responseDelay);

        // Generar respuesta
        const response = this.generateResponse(message);
        
        this.hideTyping();
        this.addMessage(response, 'bot');
        
        // Mostrar quick replies si es apropiado
        this.showQuickReplies();
        
        // Guardar historial
        this.saveChatHistory();
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Saludos
        if (this.matchesKeywords(lowerMessage, ['hola', 'hello', 'hi', 'buenos', 'saludos'])) {
            return this.getRandomResponse(this.knowledgeBase.greetings);
        }

        // Servicios
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.services.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.services.responses);
        }

        // Contacto
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.contact.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.contact.responses);
        }

        // Información de la empresa
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.about.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.about.responses);
        }

        // Game
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.game.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.game.responses);
        }

        // Temas
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.themes.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.themes.responses);
        }

        // Respuesta por defecto
        return this.getRandomResponse(this.knowledgeBase.default);
    }

    matchesKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                ${sender === 'bot' ? `<span class="message-avatar">${this.config.avatar}</span>` : ''}
                <div class="message-text">${this.formatMessage(text)}</div>
            </div>
            <div class="message-time">${timestamp}</div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Agregar al historial
        this.chatHistory.push({
            text,
            sender,
            timestamp: Date.now()
        });

        // Limitar historial
        if (this.chatHistory.length > this.config.maxHistory) {
            this.chatHistory.shift();
        }
    }

    formatMessage(text) {
        // Convertir markdown básico a HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    showGreeting() {
        if (this.chatHistory.length === 0) {
            this.showNotification();
            const greeting = this.getRandomResponse(this.knowledgeBase.greetings);
            setTimeout(() => {
                this.addMessage(greeting, 'bot');
                this.showQuickReplies();
            }, 1000);
        }
    }

    showNotification() {
        const notification = this.chatContainer.querySelector('.chat-notification');
        notification.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    showQuickReplies() {
        const quickReplies = this.chatContainer.querySelector('.quick-replies');
        quickReplies.style.display = 'flex';
        
        setTimeout(() => {
            quickReplies.style.display = 'none';
        }, 10000);
    }

    showTyping() {
        this.isTyping = true;
        const typingIndicator = this.chatContainer.querySelector('.typing-indicator');
        typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        const typingIndicator = this.chatContainer.querySelector('.typing-indicator');
        typingIndicator.style.display = 'none';
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.chatWindow.style.display = 'block';
        this.chatButton.style.display = 'none';
        
        // Hide notification
        const notification = this.chatContainer.querySelector('.chat-notification');
        notification.style.display = 'none';
        
        // Focus input
        setTimeout(() => {
            this.chatInput.focus();
        }, 100);
        
        this.scrollToBottom();
    }

    closeChat() {
        this.isOpen = false;
        this.chatWindow.style.display = 'none';
        this.chatButton.style.display = 'flex';
    }

    minimizeChat() {
        this.closeChat();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    adjustInputHeight() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 100) + 'px';
    }

    updateTheme(themeData) {
        this.currentTheme = themeData;
        const widget = this.chatWidget;
        
        // Aplicar variables de tema
        widget.style.setProperty('--chat-primary', themeData.primary);
        widget.style.setProperty('--chat-secondary', themeData.secondary);
        widget.style.setProperty('--chat-accent', themeData.accent);
        widget.style.setProperty('--chat-text', themeData.text);
        widget.style.setProperty('--chat-border', themeData.border);
    }

    // Persistencia
    saveChatHistory() {
        try {
            localStorage.setItem('datacrypt-chat-history', JSON.stringify(this.chatHistory));
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('datacrypt-chat-history');
            if (saved) {
                this.chatHistory = JSON.parse(saved);
                // Restaurar últimos 5 mensajes
                this.chatHistory.slice(-5).forEach(msg => {
                    this.addMessage(msg.text, msg.sender);
                });
            }
        } catch (error) {
            console.warn('Failed to load chat history:', error);
        }
    }

    clearHistory() {
        this.chatHistory = [];
        this.chatMessages.innerHTML = '';
        localStorage.removeItem('datacrypt-chat-history');
    }

    // Utilidades
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // API pública
    sendProgrammaticMessage(text) {
        this.addMessage(text, 'bot');
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    destroy() {
        this.chatContainer.remove();
    }
}

// Auto-inicialización si está configurado
if (typeof window !== 'undefined') {
    window.DataCryptChatbot = DataCryptChatbot;
    
    // Inicializar automáticamente si hay configuración
    document.addEventListener('DOMContentLoaded', () => {
        if (window.ConfigManager) {
            const chatbotConfig = window.ConfigManager.getConfig('chatbot');
            if (chatbotConfig && chatbotConfig.enabled) {
                window.dataCryptChatbot = new DataCryptChatbot(chatbotConfig);
            }
        }
    });
}

export default DataCryptChatbot;