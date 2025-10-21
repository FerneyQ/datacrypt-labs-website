/**
 * 🌱 FILOSOFÍA "LA MEJORA CONTINUA" v2.1
 * COMPONENTE CHATBOT
 * Siguiendo metodología exitosa del Pescador Bot 2.0
 * 
 * ⭐ Una responsabilidad: Gestión completa del chat bot
 * ⭐ IA básica con respuestas inteligentes
 * ⭐ Rate limiting y validación robusta
 */

import { getPortfolioConfig } from '../../config/settings.js';
import { 
    ChatbotException,
    ChatbotInitializationException,
    ChatbotMessageException,
    ChatbotRateLimitException,
    withRetry,
    safeExecute 
} from '../utils/exceptions.js';
import { 
    DOMHelper, 
    AnimationHelper, 
    StorageHelper,
    PerformanceHelper 
} from '../utils/helpers.js';

/**
 * Componente ChatBot modular con IA básica
 * ⭐ PATRÓN COMPROBADO - componente independiente y extensible
 */
export class ChatbotComponent {
    
    constructor(config = null) {
        this.config = null;
        this.isInitialized = false;
        this.isOpen = false;
        this.isTyping = false;
        this.messageHistory = [];
        this.rateLimitCounter = new Map(); // Para rate limiting por tiempo
        
        // Elements cache
        this.elements = {
            container: null,
            toggle: null,
            window: null,
            messages: null,
            form: null,
            input: null,
            sendButton: null,
            typing: null,
            notification: null,
            closeButton: null
        };
        
        // Event listeners para cleanup
        this.eventListeners = [];
        
        // Chat bot intelligence
        this.responses = new Map();
        this.keywords = new Map();
        this.conversationContext = {
            lastTopic: null,
            userPreferences: {},
            conversationStage: 'greeting'
        };
        
        this.init(config);
    }
    
    /**
     * Inicialización del componente
     */
    async init(customConfig = null) {
        try {
            PerformanceHelper.startMark('chatbot-init');
            
            // Cargar configuración
            this.config = customConfig || await getPortfolioConfig();
            const chatConfig = this.config.getComponentConfig('chatbot');
            
            // Validar y cachear elementos DOM
            this.cacheElements();
            this.validateElements();
            
            // Configurar sistema de respuestas
            this.setupResponseSystem(chatConfig);
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Cargar historial si existe
            this.loadChatHistory();
            
            // Mostrar mensaje de bienvenida
            this.showWelcomeMessage(chatConfig);
            
            // Configurar rate limiting
            this.setupRateLimiting();
            
            this.isInitialized = true;
            
            console.log('[Chatbot] Componente inicializado exitosamente');
            PerformanceHelper.endMark('chatbot-init');
            
        } catch (error) {
            throw new ChatbotInitializationException(error);
        }
    }
    
    /**
     * Cachear elementos DOM
     */
    @safeExecute(false, true)
    cacheElements() {
        this.elements.container = DOMHelper.getElementById('chatbot-container');
        this.elements.toggle = DOMHelper.getElementById('chatbot-toggle');
        this.elements.window = DOMHelper.getElementById('chatbot-window');
        this.elements.messages = DOMHelper.getElementById('chatbot-messages');
        this.elements.form = DOMHelper.getElementById('chatbot-form');
        this.elements.input = DOMHelper.getElementById('chatbot-input');
        this.elements.sendButton = DOMHelper.querySelector('#chatbot-form .chatbot-send');
        this.elements.typing = DOMHelper.getElementById('chatbot-typing');
        this.elements.notification = DOMHelper.getElementById('chatbot-notification');
        this.elements.closeButton = DOMHelper.getElementById('chatbot-close');
        
        return true;
    }
    
    /**
     * Validar elementos requeridos
     */
    validateElements() {
        const requiredElements = [
            { element: this.elements.container, name: 'container' },
            { element: this.elements.toggle, name: 'toggle' },
            { element: this.elements.window, name: 'window' },
            { element: this.elements.messages, name: 'messages' },
            { element: this.elements.form, name: 'form' },
            { element: this.elements.input, name: 'input' }
        ];
        
        const missing = requiredElements
            .filter(({ element }) => !element)
            .map(({ name }) => name);
            
        if (missing.length > 0) {
            throw new ChatbotException(
                `Elementos DOM faltantes: ${missing.join(', ')}`,
                { missingElements: missing }
            );
        }
    }
    
    /**
     * Configurar sistema inteligente de respuestas
     * ⭐ IA BÁSICA - detección de intención y contexto
     */
    setupResponseSystem(chatConfig) {
        // Respuestas base de configuración\n        Object.entries(chatConfig.responses).forEach(([key, response]) => {\n            this.responses.set(key, Array.isArray(response) ? response : [response]);\n        });\n        \n        // Keywords mapping para detección de intención\n        this.keywords.set('saludo', ['hola', 'buenos', 'buenas', 'hey', 'hi', 'hello', 'saludos']);\n        this.keywords.set('despedida', ['adios', 'bye', 'chao', 'hasta', 'nos vemos']);\n        this.keywords.set('portafolio', ['proyecto', 'trabajo', 'portafolio', 'portfolio', 'desarrollo', 'web']);\n        this.keywords.set('habilidades', ['skill', 'habilidad', 'tecnologia', 'lenguaje', 'framework', 'conocimiento']);\n        this.keywords.set('contacto', ['contacto', 'email', 'telefono', 'mensaje', 'comunicar', 'hablar']);\n        this.keywords.set('experiencia', ['experiencia', 'años', 'tiempo', 'carrera', 'profesional']);\n        this.keywords.set('educacion', ['estudio', 'universidad', 'curso', 'certificacion', 'educacion']);\n        this.keywords.set('servicios', ['servicio', 'precio', 'costo', 'freelance', 'contratar']);\n        this.keywords.set('about', ['sobre', 'quien', 'eres', 'tu', 'historia', 'biografia']);\n        \n        // Respuestas contextuales avanzadas\n        this.responses.set('portafolio_detail', [\n            'Tengo varios proyectos interesantes. ¿Te gustaría ver alguno en particular?',\n            'Mis proyectos incluyen desarrollo web, automatización y soluciones móviles. ¿Cuál te interesa más?',\n            'He trabajado con tecnologías como React, Node.js, Python y más. ¿Quieres saber sobre algún proyecto específico?'\n        ]);\n        \n        this.responses.set('habilidades_detail', [\n            'Domino JavaScript, Python, React, Node.js entre otras tecnologías. ¿Te interesa alguna en particular?',\n            'Mis principales fortalezas son desarrollo full-stack y automatización de procesos. ¿Quieres más detalles?',\n            'Trabajo tanto en frontend como backend, con experiencia en bases de datos y deployment. ¿Alguna área específica?'\n        ]);\n        \n        this.responses.set('contacto_detail', [\n            'Puedes contactarme directamente desde el formulario de esta página, o por email. ¿Prefieres algún método?',\n            '¡Me encantaría escuchar sobre tu proyecto! Usa el formulario de contacto o escríbeme directamente.',\n            'Estoy disponible para proyectos freelance. El formulario de contacto es la mejor forma de empezar.'\n        ]);\n        \n        this.responses.set('help', [\n            'Puedo ayudarte con información sobre mis proyectos, habilidades, experiencia o formas de contacto. ¿Qué te interesa?',\n            'Estoy aquí para resolver tus dudas sobre mi trabajo y servicios. ¿En qué puedo asistirte?',\n            'Pregúntame sobre mis proyectos, tecnologías que uso, mi experiencia o cómo podemos trabajar juntos.'\n        ]);\n        \n        console.log('[Chatbot] Sistema de respuestas configurado con IA básica');\n    }\n    \n    /**\n     * Configurar event listeners\n     */\n    setupEventListeners() {\n        // Toggle chatbot\n        const toggleHandler = () => this.toggleChat();\n        this.elements.toggle.addEventListener('click', toggleHandler);\n        this.eventListeners.push({\n            element: this.elements.toggle,\n            event: 'click',\n            handler: toggleHandler\n        });\n        \n        // Close button\n        if (this.elements.closeButton) {\n            const closeHandler = () => this.closeChat();\n            this.elements.closeButton.addEventListener('click', closeHandler);\n            this.eventListeners.push({\n                element: this.elements.closeButton,\n                event: 'click',\n                handler: closeHandler\n            });\n        }\n        \n        // Form submission\n        const submitHandler = (e) => this.handleMessageSubmit(e);\n        this.elements.form.addEventListener('submit', submitHandler);\n        this.eventListeners.push({\n            element: this.elements.form,\n            event: 'submit',\n            handler: submitHandler\n        });\n        \n        // Input events\n        const inputHandler = () => this.handleInputChange();\n        this.elements.input.addEventListener('input', inputHandler);\n        this.eventListeners.push({\n            element: this.elements.input,\n            event: 'input',\n            handler: inputHandler\n        });\n        \n        // Enter key handling\n        const keyHandler = (e) => this.handleKeyPress(e);\n        this.elements.input.addEventListener('keydown', keyHandler);\n        this.eventListeners.push({\n            element: this.elements.input,\n            event: 'keydown',\n            handler: keyHandler\n        });\n    }\n    \n    /**\n     * Mostrar mensaje de bienvenida\n     */\n    @safeExecute(false, true)\n    showWelcomeMessage(chatConfig) {\n        const welcomeMessage = chatConfig.welcomeMessage;\n        this.addMessage(welcomeMessage, 'bot', false);\n        \n        // Mostrar notificación si chat está cerrado\n        if (!this.isOpen && this.elements.notification) {\n            this.elements.notification.style.display = 'flex';\n        }\n        \n        return true;\n    }\n    \n    /**\n     * Toggle del chat\n     */\n    @safeExecute(false, true)\n    toggleChat() {\n        if (this.isOpen) {\n            this.closeChat();\n        } else {\n            this.openChat();\n        }\n        \n        return true;\n    }\n    \n    /**\n     * Abrir chat\n     */\n    @safeExecute(false, true)\n    openChat() {\n        this.elements.window.classList.add('open');\n        this.elements.container.classList.add('open');\n        this.isOpen = true;\n        \n        // Ocultar notificación\n        if (this.elements.notification) {\n            this.elements.notification.style.display = 'none';\n        }\n        \n        // Focus en input\n        setTimeout(() => {\n            this.elements.input.focus();\n        }, 300);\n        \n        // Scroll to bottom\n        this.scrollToBottom();\n        \n        console.log('[Chatbot] Chat abierto');\n        return true;\n    }\n    \n    /**\n     * Cerrar chat\n     */\n    @safeExecute(false, true)\n    closeChat() {\n        this.elements.window.classList.remove('open');\n        this.elements.container.classList.remove('open');\n        this.isOpen = false;\n        \n        console.log('[Chatbot] Chat cerrado');\n        return true;\n    }\n    \n    /**\n     * Manejar envío de mensaje\n     */\n    @withRetry(2, 1000)\n    async handleMessageSubmit(event) {\n        event.preventDefault();\n        \n        const message = this.elements.input.value.trim();\n        if (!message) return;\n        \n        // Validar rate limit\n        this.validateRateLimit();\n        \n        try {\n            // Agregar mensaje del usuario\n            this.addMessage(message, 'user');\n            this.elements.input.value = '';\n            \n            // Mostrar typing indicator\n            this.showTypingIndicator();\n            \n            // Procesar respuesta con delay para simular procesamiento\n            const typingDelay = this.config.getModuleConfig('chatbot').typingDelay;\n            \n            setTimeout(async () => {\n                const response = await this.processMessage(message);\n                this.hideTypingIndicator();\n                this.addMessage(response, 'bot');\n                \n                // Analytics tracking\n                this.trackMessage(message, response);\n                \n            }, typingDelay);\n            \n        } catch (error) {\n            this.hideTypingIndicator();\n            throw new ChatbotMessageException(error.message, { message });\n        }\n    }\n    \n    /**\n     * Procesar mensaje con IA básica\n     * ⭐ ALGORITMO DE IA - detección de intención y contexto\n     */\n    @safeExecute('Lo siento, no pude procesar tu mensaje. ¿Podrías reformularlo?', true)\n    async processMessage(message) {\n        const normalizedMessage = message.toLowerCase();\n        \n        // Detectar intención basada en keywords\n        const detectedIntention = this.detectIntention(normalizedMessage);\n        \n        // Actualizar contexto conversacional\n        this.updateConversationContext(detectedIntention, message);\n        \n        // Generar respuesta basada en intención y contexto\n        let response = this.generateResponse(detectedIntention, normalizedMessage);\n        \n        // Personalizar respuesta según contexto\n        response = this.personalizeResponse(response, detectedIntention);\n        \n        // Guardar en historial\n        this.messageHistory.push({\n            user: message,\n            bot: response,\n            timestamp: new Date().toISOString(),\n            intention: detectedIntention\n        });\n        \n        return response;\n    }\n    \n    /**\n     * Detectar intención del mensaje\n     * ⭐ NLP BÁSICO - análisis de keywords y patrones\n     */\n    detectIntention(message) {\n        // Buscar keywords en el mensaje\n        for (const [intention, keywords] of this.keywords.entries()) {\n            if (keywords.some(keyword => message.includes(keyword))) {\n                return intention;\n            }\n        }\n        \n        // Detección de patrones específicos\n        if (message.includes('?') && (message.includes('como') || message.includes('que') || message.includes('cuando'))) {\n            return 'question';\n        }\n        \n        if (message.includes('gracias') || message.includes('thank')) {\n            return 'thanks';\n        }\n        \n        if (message.length < 10 && !message.includes(' ')) {\n            return 'short_response';\n        }\n        \n        return 'general';\n    }\n    \n    /**\n     * Actualizar contexto conversacional\n     */\n    updateConversationContext(intention, message) {\n        this.conversationContext.lastTopic = intention;\n        \n        // Analizar preferencias del usuario\n        if (intention === 'portafolio' && message.includes('web')) {\n            this.conversationContext.userPreferences.interest = 'web_development';\n        }\n        \n        if (intention === 'habilidades' && (message.includes('backend') || message.includes('frontend'))) {\n            this.conversationContext.userPreferences.focus = message.includes('backend') ? 'backend' : 'frontend';\n        }\n        \n        // Determinar etapa de conversación\n        if (this.messageHistory.length === 0) {\n            this.conversationContext.conversationStage = 'initial';\n        } else if (this.messageHistory.length > 5) {\n            this.conversationContext.conversationStage = 'deep';\n        } else {\n            this.conversationContext.conversationStage = 'engaged';\n        }\n    }\n    \n    /**\n     * Generar respuesta basada en intención\n     */\n    generateResponse(intention, message) {\n        // Respuestas específicas por intención\n        const responseMap = {\n            'saludo': 'GREETING',\n            'despedida': ['¡Hasta luego! Fue un placer ayudarte.', 'Nos vemos pronto. ¡No dudes en volver!'],\n            'portafolio': 'portafolio_detail',\n            'habilidades': 'habilidades_detail',\n            'contacto': 'contacto_detail',\n            'thanks': ['¡De nada! ¿Hay algo más en lo que pueda ayudarte?', 'Un placer ayudarte. ¿Tienes más preguntas?'],\n            'question': 'help',\n            'general': 'DEFAULT'\n        };\n        \n        const responseKey = responseMap[intention] || 'DEFAULT';\n        const responses = this.responses.get(responseKey) || [this.responses.get('DEFAULT')[0]];\n        \n        // Seleccionar respuesta aleatoria para variedad\n        return responses[Math.floor(Math.random() * responses.length)];\n    }\n    \n    /**\n     * Personalizar respuesta según contexto\n     */\n    personalizeResponse(response, intention) {\n        const { conversationStage, userPreferences, lastTopic } = this.conversationContext;\n        \n        // Personalización por etapa de conversación\n        if (conversationStage === 'initial' && intention === 'saludo') {\n            const greetings = this.responses.get('GREETING');\n            response = greetings[Math.floor(Math.random() * greetings.length)];\n        }\n        \n        // Personalización por preferencias detectadas\n        if (userPreferences.interest === 'web_development' && intention === 'portafolio') {\n            response += ' Veo que te interesa el desarrollo web especialmente.';\n        }\n        \n        if (userPreferences.focus && intention === 'habilidades') {\n            response += ` Como mencionaste ${userPreferences.focus}, puedo contarte más sobre esa área.`;\n        }\n        \n        return response;\n    }\n    \n    /**\n     * Agregar mensaje al chat\n     */\n    @safeExecute(false, true)\n    addMessage(text, sender = 'bot', animate = true) {\n        const messageElement = this.createMessageElement(text, sender);\n        this.elements.messages.appendChild(messageElement);\n        \n        // Animación de entrada\n        if (animate) {\n            AnimationHelper.fadeIn(messageElement, 300);\n        }\n        \n        // Scroll automático\n        this.scrollToBottom();\n        \n        return true;\n    }\n    \n    /**\n     * Crear elemento de mensaje\n     */\n    createMessageElement(text, sender) {\n        const messageDiv = DOMHelper.createElement('div', {\n            'class': `message message-${sender}`\n        });\n        \n        if (sender === 'bot') {\n            const avatar = DOMHelper.createElement('div', { 'class': 'message-avatar' });\n            const avatarImg = DOMHelper.createElement('img', {\n                'src': this.config.getModuleConfig('chatbot').avatar,\n                'alt': 'Bot Avatar'\n            });\n            avatar.appendChild(avatarImg);\n            messageDiv.appendChild(avatar);\n        }\n        \n        const content = DOMHelper.createElement('div', { 'class': 'message-content' });\n        const bubble = DOMHelper.createElement('div', { 'class': 'message-bubble' });\n        bubble.textContent = text;\n        \n        const timestamp = DOMHelper.createElement('div', { 'class': 'message-time' });\n        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });\n        \n        content.appendChild(bubble);\n        content.appendChild(timestamp);\n        messageDiv.appendChild(content);\n        \n        return messageDiv;\n    }\n    \n    /**\n     * Mostrar indicador de escritura\n     */\n    @safeExecute(false, true)\n    showTypingIndicator() {\n        if (this.elements.typing) {\n            this.elements.typing.style.display = 'flex';\n            this.isTyping = true;\n            this.scrollToBottom();\n        }\n        \n        return true;\n    }\n    \n    /**\n     * Ocultar indicador de escritura\n     */\n    @safeExecute(false, true)\n    hideTypingIndicator() {\n        if (this.elements.typing) {\n            this.elements.typing.style.display = 'none';\n            this.isTyping = false;\n        }\n        \n        return true;\n    }\n    \n    /**\n     * Scroll automático al final\n     */\n    @safeExecute(false, false)\n    scrollToBottom() {\n        if (this.elements.messages) {\n            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;\n        }\n        \n        return true;\n    }\n    \n    /**\n     * Validar rate limiting\n     * ⭐ SEGURIDAD - prevención de spam\n     */\n    validateRateLimit() {\n        const now = Date.now();\n        const windowTime = 60000; // 1 minuto\n        const maxMessages = this.config.getModuleConfig('security').RATE_LIMITING.CHATBOT;\n        \n        // Limpiar contadores antiguos\n        for (const [timestamp, count] of this.rateLimitCounter.entries()) {\n            if (now - timestamp > windowTime) {\n                this.rateLimitCounter.delete(timestamp);\n            }\n        }\n        \n        // Contar mensajes en ventana actual\n        const currentCount = Array.from(this.rateLimitCounter.values())\n            .reduce((sum, count) => sum + count, 0);\n            \n        if (currentCount >= maxMessages) {\n            throw new ChatbotRateLimitException(maxMessages, windowTime);\n        }\n        \n        // Incrementar contador\n        const currentMinute = Math.floor(now / windowTime) * windowTime;\n        this.rateLimitCounter.set(currentMinute, \n            (this.rateLimitCounter.get(currentMinute) || 0) + 1\n        );\n    }\n    \n    /**\n     * Configurar rate limiting\n     */\n    setupRateLimiting() {\n        // Limpiar contadores cada 5 minutos\n        setInterval(() => {\n            const now = Date.now();\n            const cutoff = now - 300000; // 5 minutos\n            \n            for (const timestamp of this.rateLimitCounter.keys()) {\n                if (timestamp < cutoff) {\n                    this.rateLimitCounter.delete(timestamp);\n                }\n            }\n        }, 300000);\n    }\n    \n    /**\n     * Manejar cambios en input\n     */\n    @safeExecute(false, false)\n    handleInputChange() {\n        const message = this.elements.input.value;\n        const maxLength = this.config.getModuleConfig('chatbot').MAX_MESSAGE_LENGTH;\n        \n        // Validar longitud\n        if (message.length > maxLength) {\n            this.elements.input.value = message.substring(0, maxLength);\n        }\n        \n        // Enable/disable send button\n        if (this.elements.sendButton) {\n            this.elements.sendButton.disabled = message.trim().length === 0;\n        }\n        \n        return true;\n    }\n    \n    /**\n     * Manejar teclas especiales\n     */\n    @safeExecute(false, false)\n    handleKeyPress(event) {\n        if (event.key === 'Enter' && !event.shiftKey) {\n            event.preventDefault();\n            this.handleMessageSubmit(event);\n        }\n        \n        return true;\n    }\n    \n    /**\n     * Cargar historial del chat desde localStorage\n     */\n    @safeExecute(false, false)\n    loadChatHistory() {\n        const history = StorageHelper.getItem('chatbot_history', []);\n        \n        if (Array.isArray(history) && history.length > 0) {\n            // Cargar últimos 10 mensajes\n            const recentHistory = history.slice(-10);\n            \n            recentHistory.forEach(({ user, bot, timestamp }) => {\n                this.addMessage(user, 'user', false);\n                this.addMessage(bot, 'bot', false);\n            });\n            \n            this.messageHistory = recentHistory;\n        }\n        \n        return true;\n    }\n    \n    /**\n     * Guardar historial del chat\n     */\n    @safeExecute(false, false)\n    saveChatHistory() {\n        // Mantener solo últimos 50 mensajes\n        const historyToSave = this.messageHistory.slice(-50);\n        StorageHelper.setItem('chatbot_history', historyToSave, Date.now() + 86400000); // 24 horas\n        \n        return true;\n    }\n    \n    /**\n     * Tracking para analytics\n     */\n    @safeExecute(false, false)\n    trackMessage(userMessage, botResponse) {\n        if (window.gtag && this.config?.analytics?.ANALYTICS_ENABLED) {\n            window.gtag('event', this.config.analytics.EVENTS.CHATBOT_MESSAGE, {\n                message_length: userMessage.length,\n                response_type: this.conversationContext.lastTopic,\n                conversation_stage: this.conversationContext.conversationStage\n            });\n        }\n        \n        return true;\n    }\n    \n    /**\n     * API pública - enviar mensaje programáticamente\n     */\n    async sendMessage(message) {\n        if (!this.isInitialized) {\n            throw new ChatbotException('Chatbot no inicializado');\n        }\n        \n        this.elements.input.value = message;\n        const submitEvent = new Event('submit');\n        await this.handleMessageSubmit(submitEvent);\n    }\n    \n    /**\n     * API pública - obtener estado del chatbot\n     */\n    getChatbotState() {\n        return {\n            isOpen: this.isOpen,\n            isTyping: this.isTyping,\n            messageCount: this.messageHistory.length,\n            conversationContext: { ...this.conversationContext },\n            isInitialized: this.isInitialized\n        };\n    }\n    \n    /**\n     * Cleanup del componente\n     */\n    destroy() {\n        // Guardar historial antes de destruir\n        this.saveChatHistory();\n        \n        // Remover event listeners\n        this.eventListeners.forEach(({ element, event, handler }) => {\n            element.removeEventListener(event, handler);\n        });\n        \n        // Limpiar referencias\n        this.eventListeners = [];\n        this.messageHistory = [];\n        this.responses.clear();\n        this.keywords.clear();\n        this.rateLimitCounter.clear();\n        this.elements = {};\n        this.isInitialized = false;\n        \n        console.log('[Chatbot] Componente destruido');\n    }\n}\n\n// Export por defecto\nexport default ChatbotComponent;
        
        Object.entries(chatConfig.responses).forEach(([key, response]) => {
            this.responses.set(key, Array.isArray(response) ? response : [response]);
        });
        
        // Keywords mapping para detección de intención
        this.keywords.set('saludo', ['hola', 'buenos', 'buenas', 'hey', 'hi', 'hello', 'saludos']);
        this.keywords.set('despedida', ['adios', 'bye', 'chao', 'hasta', 'nos vemos']);
        this.keywords.set('portafolio', ['proyecto', 'trabajo', 'portafolio', 'portfolio', 'desarrollo', 'web']);
        this.keywords.set('habilidades', ['skill', 'habilidad', 'tecnologia', 'lenguaje', 'framework', 'conocimiento']);
        this.keywords.set('contacto', ['contacto', 'email', 'telefono', 'mensaje', 'comunicar', 'hablar']);
        this.keywords.set('experiencia', ['experiencia', 'años', 'tiempo', 'carrera', 'profesional']);
        this.keywords.set('educacion', ['estudio', 'universidad', 'curso', 'certificacion', 'educacion']);
        this.keywords.set('servicios', ['servicio', 'precio', 'costo', 'freelance', 'contratar']);
        this.keywords.set('about', ['sobre', 'quien', 'eres', 'tu', 'historia', 'biografia']);
        
        // Respuestas contextuales avanzadas
        this.responses.set('portafolio_detail', [
            'Tengo varios proyectos interesantes. ¿Te gustaría ver alguno en particular?',
            'Mis proyectos incluyen desarrollo web, automatización y soluciones móviles. ¿Cuál te interesa más?',
            'He trabajado con tecnologías como React, Node.js, Python y más. ¿Quieres saber sobre algún proyecto específico?'
        ]);
        
        this.responses.set('habilidades_detail', [
            'Domino JavaScript, Python, React, Node.js entre otras tecnologías. ¿Te interesa alguna en particular?',
            'Mis principales fortalezas son desarrollo full-stack y automatización de procesos. ¿Quieres más detalles?',
            'Trabajo tanto en frontend como backend, con experiencia en bases de datos y deployment. ¿Alguna área específica?'
        ]);
        
        this.responses.set('contacto_detail', [
            'Puedes contactarme directamente desde el formulario de esta página, o por email. ¿Prefieres algún método?',
            '¡Me encantaría escuchar sobre tu proyecto! Usa el formulario de contacto o escríbeme directamente.',
            'Estoy disponible para proyectos freelance. El formulario de contacto es la mejor forma de empezar.'
        ]);
        
        this.responses.set('help', [
            'Puedo ayudarte con información sobre mis proyectos, habilidades, experiencia o formas de contacto. ¿Qué te interesa?',
            'Estoy aquí para resolver tus dudas sobre mi trabajo y servicios. ¿En qué puedo asistirte?',
            'Pregúntame sobre mis proyectos, tecnologías que uso, mi experiencia o cómo podemos trabajar juntos.'
        ]);
        
        console.log('[Chatbot] Sistema de respuestas configurado con IA básica');
    }
    
    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Toggle chatbot
        const toggleHandler = () => this.toggleChat();
        this.elements.toggle.addEventListener('click', toggleHandler);
        this.eventListeners.push({
            element: this.elements.toggle,
            event: 'click',
            handler: toggleHandler
        });
        
        // Close button
        if (this.elements.closeButton) {
            const closeHandler = () => this.closeChat();
            this.elements.closeButton.addEventListener('click', closeHandler);
            this.eventListeners.push({
                element: this.elements.closeButton,
                event: 'click',
                handler: closeHandler
            });
        }
        
        // Form submission
        const submitHandler = (e) => this.handleMessageSubmit(e);
        this.elements.form.addEventListener('submit', submitHandler);
        this.eventListeners.push({
            element: this.elements.form,
            event: 'submit',
            handler: submitHandler
        });
        
        // Input events
        const inputHandler = () => this.handleInputChange();
        this.elements.input.addEventListener('input', inputHandler);
        this.eventListeners.push({
            element: this.elements.input,
            event: 'input',
            handler: inputHandler
        });
        
        // Enter key handling
        const keyHandler = (e) => this.handleKeyPress(e);
        this.elements.input.addEventListener('keydown', keyHandler);
        this.eventListeners.push({
            element: this.elements.input,
            event: 'keydown',
            handler: keyHandler
        });
    }
    
    /**
     * Mostrar mensaje de bienvenida
     */
    @safeExecute(false, true)
    showWelcomeMessage(chatConfig) {
        const welcomeMessage = chatConfig.welcomeMessage;
        this.addMessage(welcomeMessage, 'bot', false);
        
        // Mostrar notificación si chat está cerrado
        if (!this.isOpen && this.elements.notification) {
            this.elements.notification.style.display = 'flex';
        }
        
        return true;
    }
    
    /**
     * Toggle del chat
     */
    @safeExecute(false, true)
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
        
        return true;
    }
    
    /**
     * Abrir chat
     */
    @safeExecute(false, true)
    openChat() {
        this.elements.window.classList.add('open');
        this.elements.container.classList.add('open');
        this.isOpen = true;
        
        // Ocultar notificación
        if (this.elements.notification) {
            this.elements.notification.style.display = 'none';
        }
        
        // Focus en input
        setTimeout(() => {
            this.elements.input.focus();
        }, 300);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        console.log('[Chatbot] Chat abierto');
        return true;
    }
    
    /**
     * Cerrar chat
     */
    @safeExecute(false, true)
    closeChat() {
        this.elements.window.classList.remove('open');
        this.elements.container.classList.remove('open');
        this.isOpen = false;
        
        console.log('[Chatbot] Chat cerrado');
        return true;
    }
    
    /**
     * Manejar envío de mensaje
     */
    @withRetry(2, 1000)
    async handleMessageSubmit(event) {
        event.preventDefault();
        
        const message = this.elements.input.value.trim();
        if (!message) return;
        
        // Validar rate limit
        this.validateRateLimit();
        
        try {
            // Agregar mensaje del usuario
            this.addMessage(message, 'user');
            this.elements.input.value = '';
            
            // Mostrar typing indicator
            this.showTypingIndicator();
            
            // Procesar respuesta con delay para simular procesamiento
            const typingDelay = this.config.getModuleConfig('chatbot').typingDelay;
            
            setTimeout(async () => {
                const response = await this.processMessage(message);
                this.hideTypingIndicator();
                this.addMessage(response, 'bot');
                
                // Analytics tracking
                this.trackMessage(message, response);
                
            }, typingDelay);
            
        } catch (error) {
            this.hideTypingIndicator();
            throw new ChatbotMessageException(error.message, { message });
        }
    }
    
    /**
     * Procesar mensaje con IA básica
     * ⭐ ALGORITMO DE IA - detección de intención y contexto
     */
    @safeExecute('Lo siento, no pude procesar tu mensaje. ¿Podrías reformularlo?', true)
    async processMessage(message) {
        const normalizedMessage = message.toLowerCase();
        
        // Detectar intención basada en keywords
        const detectedIntention = this.detectIntention(normalizedMessage);
        
        // Actualizar contexto conversacional
        this.updateConversationContext(detectedIntention, message);
        
        // Generar respuesta basada en intención y contexto
        let response = this.generateResponse(detectedIntention, normalizedMessage);
        
        // Personalizar respuesta según contexto
        response = this.personalizeResponse(response, detectedIntention);
        
        // Guardar en historial
        this.messageHistory.push({
            user: message,
            bot: response,
            timestamp: new Date().toISOString(),
            intention: detectedIntention
        });
        
        return response;
    }
    
    /**
     * Detectar intención del mensaje
     * ⭐ NLP BÁSICO - análisis de keywords y patrones
     */
    detectIntention(message) {
        // Buscar keywords en el mensaje
        for (const [intention, keywords] of this.keywords.entries()) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return intention;
            }
        }
        
        // Detección de patrones específicos
        if (message.includes('?') && (message.includes('como') || message.includes('que') || message.includes('cuando'))) {
            return 'question';
        }
        
        if (message.includes('gracias') || message.includes('thank')) {
            return 'thanks';
        }
        
        if (message.length < 10 && !message.includes(' ')) {
            return 'short_response';
        }
        
        return 'general';
    }
    
    /**
     * Actualizar contexto conversacional
     */
    updateConversationContext(intention, message) {
        this.conversationContext.lastTopic = intention;
        
        // Analizar preferencias del usuario
        if (intention === 'portafolio' && message.includes('web')) {
            this.conversationContext.userPreferences.interest = 'web_development';
        }
        
        if (intention === 'habilidades' && (message.includes('backend') || message.includes('frontend'))) {
            this.conversationContext.userPreferences.focus = message.includes('backend') ? 'backend' : 'frontend';
        }
        
        // Determinar etapa de conversación
        if (this.messageHistory.length === 0) {
            this.conversationContext.conversationStage = 'initial';
        } else if (this.messageHistory.length > 5) {
            this.conversationContext.conversationStage = 'deep';
        } else {
            this.conversationContext.conversationStage = 'engaged';
        }
    }
    
    /**
     * Generar respuesta basada en intención
     */
    generateResponse(intention, message) {
        // Respuestas específicas por intención
        const responseMap = {
            'saludo': 'GREETING',
            'despedida': ['¡Hasta luego! Fue un placer ayudarte.', 'Nos vemos pronto. ¡No dudes en volver!'],
            'portafolio': 'portafolio_detail',
            'habilidades': 'habilidades_detail',
            'contacto': 'contacto_detail',
            'thanks': ['¡De nada! ¿Hay algo más en lo que pueda ayudarte?', 'Un placer ayudarte. ¿Tienes más preguntas?'],
            'question': 'help',
            'general': 'DEFAULT'
        };
        
        const responseKey = responseMap[intention] || 'DEFAULT';
        const responses = this.responses.get(responseKey) || [this.responses.get('DEFAULT')[0]];
        
        // Seleccionar respuesta aleatoria para variedad
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    /**
     * Personalizar respuesta según contexto
     */
    personalizeResponse(response, intention) {
        const { conversationStage, userPreferences, lastTopic } = this.conversationContext;
        
        // Personalización por etapa de conversación
        if (conversationStage === 'initial' && intention === 'saludo') {
            const greetings = this.responses.get('GREETING');
            response = greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // Personalización por preferencias detectadas
        if (userPreferences.interest === 'web_development' && intention === 'portafolio') {
            response += ' Veo que te interesa el desarrollo web especialmente.';
        }
        
        if (userPreferences.focus && intention === 'habilidades') {
            response += ` Como mencionaste ${userPreferences.focus}, puedo contarte más sobre esa área.`;
        }
        
        return response;
    }
    
    /**
     * Agregar mensaje al chat
     */
    @safeExecute(false, true)
    addMessage(text, sender = 'bot', animate = true) {
        const messageElement = this.createMessageElement(text, sender);
        this.elements.messages.appendChild(messageElement);
        
        // Animación de entrada
        if (animate) {
            AnimationHelper.fadeIn(messageElement, 300);
        }
        
        // Scroll automático
        this.scrollToBottom();
        
        return true;
    }
    
    /**
     * Crear elemento de mensaje
     */
    createMessageElement(text, sender) {
        const messageDiv = DOMHelper.createElement('div', {
            'class': `message message-${sender}`
        });
        
        if (sender === 'bot') {
            const avatar = DOMHelper.createElement('div', { 'class': 'message-avatar' });
            const avatarImg = DOMHelper.createElement('img', {
                'src': this.config.getModuleConfig('chatbot').avatar,
                'alt': 'Bot Avatar'
            });
            avatar.appendChild(avatarImg);
            messageDiv.appendChild(avatar);
        }
        
        const content = DOMHelper.createElement('div', { 'class': 'message-content' });
        const bubble = DOMHelper.createElement('div', { 'class': 'message-bubble' });
        bubble.textContent = text;
        
        const timestamp = DOMHelper.createElement('div', { 'class': 'message-time' });
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        content.appendChild(bubble);
        content.appendChild(timestamp);
        messageDiv.appendChild(content);
        
        return messageDiv;
    }
    
    /**
     * Mostrar indicador de escritura
     */
    @safeExecute(false, true)
    showTypingIndicator() {
        if (this.elements.typing) {
            this.elements.typing.style.display = 'flex';
            this.isTyping = true;
            this.scrollToBottom();
        }
        
        return true;
    }
    
    /**
     * Ocultar indicador de escritura
     */
    @safeExecute(false, true)
    hideTypingIndicator() {
        if (this.elements.typing) {
            this.elements.typing.style.display = 'none';
            this.isTyping = false;
        }
        
        return true;
    }
    
    /**
     * Scroll automático al final
     */
    @safeExecute(false, false)
    scrollToBottom() {
        if (this.elements.messages) {
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        }
        
        return true;
    }
    
    /**
     * Validar rate limiting
     * ⭐ SEGURIDAD - prevención de spam
     */
    validateRateLimit() {
        const now = Date.now();
        const windowTime = 60000; // 1 minuto
        const maxMessages = this.config.getModuleConfig('security').RATE_LIMITING.CHATBOT;
        
        // Limpiar contadores antiguos
        for (const [timestamp, count] of this.rateLimitCounter.entries()) {
            if (now - timestamp > windowTime) {
                this.rateLimitCounter.delete(timestamp);
            }
        }
        
        // Contar mensajes en ventana actual
        const currentCount = Array.from(this.rateLimitCounter.values())
            .reduce((sum, count) => sum + count, 0);
            
        if (currentCount >= maxMessages) {
            throw new ChatbotRateLimitException(maxMessages, windowTime);
        }
        
        // Incrementar contador
        const currentMinute = Math.floor(now / windowTime) * windowTime;
        this.rateLimitCounter.set(currentMinute, 
            (this.rateLimitCounter.get(currentMinute) || 0) + 1
        );
    }
    
    /**
     * Configurar rate limiting
     */
    setupRateLimiting() {
        // Limpiar contadores cada 5 minutos
        setInterval(() => {
            const now = Date.now();
            const cutoff = now - 300000; // 5 minutos
            
            for (const timestamp of this.rateLimitCounter.keys()) {
                if (timestamp < cutoff) {
                    this.rateLimitCounter.delete(timestamp);
                }
            }
        }, 300000);
    }
    
    /**
     * Manejar cambios en input
     */
    @safeExecute(false, false)
    handleInputChange() {
        const message = this.elements.input.value;
        const maxLength = this.config.getModuleConfig('chatbot').MAX_MESSAGE_LENGTH;
        
        // Validar longitud
        if (message.length > maxLength) {
            this.elements.input.value = message.substring(0, maxLength);
        }
        
        // Enable/disable send button
        if (this.elements.sendButton) {
            this.elements.sendButton.disabled = message.trim().length === 0;
        }
        
        return true;
    }
    
    /**
     * Manejar teclas especiales
     */
    @safeExecute(false, false)
    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleMessageSubmit(event);
        }
        
        return true;
    }
    
    /**
     * Cargar historial del chat desde localStorage
     */
    @safeExecute(false, false)
    loadChatHistory() {
        const history = StorageHelper.getItem('chatbot_history', []);
        
        if (Array.isArray(history) && history.length > 0) {
            // Cargar últimos 10 mensajes
            const recentHistory = history.slice(-10);
            
            recentHistory.forEach(({ user, bot, timestamp }) => {
                this.addMessage(user, 'user', false);
                this.addMessage(bot, 'bot', false);
            });
            
            this.messageHistory = recentHistory;
        }
        
        return true;
    }
    
    /**
     * Guardar historial del chat
     */
    @safeExecute(false, false)
    saveChatHistory() {
        // Mantener solo últimos 50 mensajes
        const historyToSave = this.messageHistory.slice(-50);
        StorageHelper.setItem('chatbot_history', historyToSave, Date.now() + 86400000); // 24 horas
        
        return true;
    }
    
    /**
     * Tracking para analytics
     */
    @safeExecute(false, false)
    trackMessage(userMessage, botResponse) {
        if (window.gtag && this.config?.analytics?.ANALYTICS_ENABLED) {
            window.gtag('event', this.config.analytics.EVENTS.CHATBOT_MESSAGE, {
                message_length: userMessage.length,
                response_type: this.conversationContext.lastTopic,
                conversation_stage: this.conversationContext.conversationStage
            });
        }
        
        return true;
    }
    
    /**
     * API pública - enviar mensaje programáticamente
     */
    async sendMessage(message) {
        if (!this.isInitialized) {
            throw new ChatbotException('Chatbot no inicializado');
        }
        
        this.elements.input.value = message;
        const submitEvent = new Event('submit');
        await this.handleMessageSubmit(submitEvent);
    }
    
    /**
     * API pública - obtener estado del chatbot
     */
    getChatbotState() {
        return {
            isOpen: this.isOpen,
            isTyping: this.isTyping,
            messageCount: this.messageHistory.length,
            conversationContext: { ...this.conversationContext },
            isInitialized: this.isInitialized
        };
    }
    
    /**
     * Cleanup del componente
     */
    destroy() {
        // Guardar historial antes de destruir
        this.saveChatHistory();
        
        // Remover event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        
        // Limpiar referencias
        this.eventListeners = [];
        this.messageHistory = [];
        this.responses.clear();
        this.keywords.clear();
        this.rateLimitCounter.clear();
        this.elements = {};
        this.isInitialized = false;
        
        console.log('[Chatbot] Componente destruido');
    }
}

// Export por defecto
export default ChatbotComponent;