/**
 * 🤖 DataCrypt Labs - Intelligent Chatbot Component
 * Filosofía Mejora Continua v2.1 - Componente Modular Reutilizable
 * 
 * Chatbot inteligente integrado como solicitado en la semilla
 * Arquitectura modular y configurable
 */

class DataCryptChatbot {
    constructor(config = {}) {
        // Prevenir múltiples instancias
        if (DataCryptChatbot.instance) {
            console.warn('Ya existe una instancia de DataCryptChatbot');
            return DataCryptChatbot.instance;
        }
        
        this.config = {
            // Configuración Comercial Consistente - DataCrypt_Labs
            container: document.body,
            position: 'bottom-right',
            theme: 'auto',
            minimized: true,
            avatar: '👨‍💼',
            title: 'Alex - Consultor DataCrypt',
            subtitle: 'Especialista en Soluciones de Datos',
            autoGreeting: true,
            responseDelay: 1000, // Respuesta comercial más pensada
            typingIndicator: true,
            maxHistory: 100,
            personality: 'commercial-expert',
            security: true, // Habilitar seguridad
            ...config
        };

        this.isOpen = false;
        this.isTyping = false;
        this.isProcessingMessage = false;
        this.chatHistory = [];
        this.currentTheme = 'dark';
        this.knowledgeBase = this.initializeKnowledgeBase();
        
        // Inicializar sistema de seguridad después
        this.security = null;
        this.rateLimiter = null;
        
        // Asignar instancia estática
        DataCryptChatbot.instance = this;
        
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.setupEventListeners();
        this.loadChatHistory();
        
        // Inicializar seguridad después de que todo esté listo
        this.initializeSecurity();
        
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

    initializeSecurity() {
        try {
            if (this.config.security && typeof ChatbotSecurity !== 'undefined' && typeof MessageRateLimit !== 'undefined') {
                this.security = new ChatbotSecurity();
                this.rateLimiter = new MessageRateLimit();
                console.log('🔒 Security system initialized');
            } else {
                console.log('⚠️ Security system disabled or classes not available');
                this.config.security = false;
            }
        } catch (error) {
            console.error('❌ Security initialization failed:', error);
            this.config.security = false;
        }
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
                            <div class="title-info">
                                <span class="title-text">${this.config.title}</span>
                                <span class="title-subtitle">${this.config.subtitle || 'Consultor Especializado'}</span>
                            </div>
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
                            <span class="typing-text">Alex está escribiendo...</span>
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
                "¡Hola! 👋 Soy **Alex**, tu consultor especializado de DataCrypt_Labs. Ayudo a empresas a transformar sus datos en ventajas competitivas reales. ¿Qué desafío empresarial necesitas resolver con datos? 🚀",
                "¡Perfecto! 💼 Soy **Alex**, consultor comercial de DataCrypt_Labs. Especializado en Business Intelligence, Machine Learning y Big Data que genera ROI medible. ¿Hablamos sobre tu proyecto? 📊",
                "¡Conectemos! 🌟 Como **Alex**, soy tu consultor especializado en soluciones de datos empresariales. Convertimos información en resultados rentables y decisiones inteligentes. ¿Qué necesita tu empresa? ⚡"
            ],
            services: {
                keywords: ['servicio', 'servicios', 'que hacen', 'ofrecen', 'especialidad', 'business intelligence', 'machine learning', 'big data', 'arquitectura', 'servidor', 'infraestructura', 'desarrollo', 'alex', 'consultor', 'técnico', 'soluciones'],
                responses: [
                    "� **NUESTROS SERVICIOS PREMIUM** que están revolucionando empresas:\n\n🎯 **BUSINESS INTELLIGENCE** - Dashboards que aumentan decisiones 75%\n🤖 **MACHINE LEARNING** - IA predictiva con 96% de precisión\n📊 **BIG DATA ANALYTICS** - Procesamos TB de datos en minutos\n�️ **GEORREFERENCIACIÓN** - Análisis espacial para optimizar operaciones\n\n**💰 ROI GARANTIZADO:** Nuestros clientes ven resultados en 30 días\n\n¿Te interesa una **demo gratuita** para tu sector? 🎁",
                    "🏆 **DataCrypt_Labs = RESULTADOS COMPROBADOS:**\n\n✅ **98% Satisfacción** de clientes\n✅ **340% ROI Promedio** en implementaciones\n✅ **50+ Empresas** transformadas\n✅ **15 Industrias** diferentes\n\n**� SERVICIOS TOP:**\n• Business Intelligence (dashboards ejecutivos)\n• Machine Learning (predicciones automatizadas)\n• Big Data (insights de millones de registros)\n• Consultoría Data-Driven (estrategia personalizada)\n\n**¿Cuál es tu mayor pain point con los datos?** Te muestro la solución exacta 🎯"
                ]
            },
            contact: {
                keywords: ['contacto', 'contactar', 'teléfono', 'email', 'ubicación', 'consulta', 'demo', 'reunión', 'agendar', 'whatsapp', 'llamar', 'escribir'],
                responses: [
                    "📧 **¡CONECTEMOS AHORA MISMO!** - Respuesta garantizada en **2 horas:**\n\n🔥 **CONTACTO DIRECTO:**\n• � **Email Ejecutivo:** ferneyquiroga101@gmail.com\n\n💼 **CONSULTA GRATUITA DISPONIBLE:**\n✅ Análisis de tu situación actual (sin costo)\n✅ Plan personalizado para tu empresa\n✅ Proyección de ROI específica\n\n**¡Escríbeme por email y te respondo personalmente!** 🚀",
                    "🎯 **FERNEY QUIROGA - CEO & Data Scientist**\n\n\n📧 **Email Personal:** ferneyquiroga101@gmail.com\n\n**🏆 MIS CREDENCIALES:**\n• 10+ Certificaciones DataCamp verificadas\n• Especialista en MySQL, NoSQL, Python\n• Metodología PDCA para mejora continua\n\n**💡 ¿QUÉ INCLUYE TU CONSULTA GRATUITA?**\n1. Diagnóstico de tu infraestructura de datos\n2. Plan de implementación personalizado\n3. Estimación precisa de ROI y timeframe\n\n**¡Escríbeme directamente y empezamos hoy!** 🚀"
                ]
            },
            about: {
                keywords: ['datacrypt', 'empresa', 'quienes son', 'sobre', 'información', 'experiencia', 'trayectoria', 'equipo', 'fundador', 'alex', 'consultor', 'quien eres', 'tu', 'presentate'],
                responses: [
                    "👨‍💼 **¡Hola! Soy ALEX, tu consultor especializado de DataCrypt_Labs!**\n\n**� MI PERFIL:**\nConsultor comercial certificado en soluciones de datos empresariales. Trabajo directamente con **Ferney Quiroga** (CEO y Data Scientist) para transformar empresas mediante **decisiones data-driven** rentables.\n\n**🎯 MI MISIÓN:** Ayudarte a convertir tus datos en ventajas competitivas que generen ROI medible\n\n**📊 MI ESPECIALIDAD:**\n• **Consultoría comercial** en Business Intelligence\n• **Propuestas personalizadas** de Machine Learning\n• **Análisis de ROI** y viabilidad empresarial\n• **Conexión directa** con el CEO para proyectos\n\n**¿Quieres que analice tu situación empresarial específica?** 🚀",
                    "🌟 **DATACRYPT_LABS - LÍDERES EN DATA INTELLIGENCE (según Alex)**\n\n**👨‍💼 SOBRE MÍ (ALEX):**\nSoy el consultor comercial que conecta empresas con las soluciones de **Ferney Quiroga** - nuestro CEO y Data Scientist certificado con metodología **PDCA de mejora continua**.\n\n**🔬 LO QUE OFREZCO COMO CONSULTOR:**\n✅ **Análisis comercial gratuito** de tu situación actual\n✅ **Propuestas personalizadas** con ROI proyectado\n✅ **Conexión directa** con el equipo técnico\n✅ **Seguimiento comercial** post-implementación\n\n**💎 NUESTROS RESULTADOS:**\n• **50+ empresas** transformadas exitosamente\n• **340% ROI promedio** documentado\n• **98% satisfacción** del cliente\n• **Metodología propia** PDCA comprobada\n\n**¡Como consultor, te garantizo una propuesta competitiva!** 📞"
                ]
            },
            pricing: {
                keywords: ['precio', 'precios', 'costo', 'costos', 'cotización', 'presupuesto', 'cuánto cuesta', 'inversión', 'caro', 'barato'],
                responses: [
                    "💰 **INVERSIÓN INTELIGENTE CON ROI GARANTIZADO**\n\n**🎯 NUESTRO ENFOQUE:**\nNo vendemos servicios, **creamos valor medible**. Cada peso invertido te retorna **3.4 pesos** en promedio (340% ROI documentado).\n\n**📊 ESTRUCTURA DE INVERSIÓN:**\n• **Consultoría Inicial:** GRATUITA (diagnóstico completo)\n• **Proyectos BI:** Desde $2M COP (ROI 6 meses)\n• **Machine Learning:** Desde $5M COP (automatización total)\n• **Big Data:** Desde $8M COP (insights enterprise)\n\n**💡 ¿Tu presupuesto?** Te armo una propuesta que **se pague sola** con los resultados obtenidos.\n\n**¡Hablemos de números reales!** 📞",
                    "🔥 **PRECIO vs VALOR - La diferencia DataCrypt_Labs**\n\n**❌ OTROS PROVEEDORES:**\n• Cobran por horas\n• Proyectos sin garantías\n• Implementación sin seguimiento\n\n**✅ DATACRYPT_LABS:**\n• **Cobramos por RESULTADOS**\n• Garantía de ROI en 30 días\n• **Metodología PDCA** de mejora continua\n• Soporte y optimización incluidos\n\n**💎 PROPUESTA ÚNICA:**\nSi no ves **resultados medibles** en 30 días, trabajamos GRATIS hasta lograrlo.\n\n**¿Conversamos sobre tu presupuesto específico?** Te muestro el plan exacto 🎯"
                ]
            },
            testimonials: {
                keywords: ['clientes', 'testimonios', 'casos de éxito', 'referencias', 'resultados', 'experiencias'],
                responses: [
                    "🏆 **CASOS DE ÉXITO REALES - RESULTADOS COMPROBADOS**\n\n**📈 RETAIL COLOMBIANO:**\n*\"DataCrypt_Labs aumentó nuestras ventas 45% con predicción de demanda. ROI: 380% en 4 meses\"* - Gerente General\n\n**🏭 MANUFACTURA:**\n*\"Redujimos costos operativos 30% optimizando la cadena de suministro con Big Data\"* - Director Operaciones\n\n**🏥 SECTOR SALUD:**\n*\"Automatizamos reportes que nos tomaban 3 días. Ahora son 15 minutos\"* - Coordinadora Administrativa\n\n**💡 ¿Tu sector?** Te muestro casos específicos de tu industria 🎯",
                    "✨ **TESTIMONIOS REALES DE NUESTROS CLIENTES**\n\n**🌟 5/5 ESTRELLAS PROMEDIO**\n\n*\"Ferney y su equipo transformaron completamente nuestra toma de decisiones. Los dashboards son increíbles y fáciles de usar.\"* - CEO Empresa Logística\n\n*\"En 2 meses recuperamos la inversión. El sistema de ML predice mejor que nuestros analistas senior.\"* - CFO Sector Financiero\n\n*\"Metodología PDCA aplicada a nuestros datos = mejora continua real y medible\"* - Gerente TI\n\n**📞 ¿Quieres referencias directas?** Te conecto con clientes de tu sector 🤝"
                ]
            },
            implementation: {
                keywords: ['implementación', 'tiempo', 'cronograma', 'proceso', 'metodología', 'pasos', 'fases', 'cuánto demora'],
                responses: [
                    "⚡ **IMPLEMENTACIÓN RÁPIDA Y EFICIENTE**\n\n**📋 METODOLOGÍA PDCA EN ACCIÓN:**\n\n**FASE 1 - PLAN (Semana 1):**\n• Diagnóstico técnico completo\n• Definición de KPIs y objetivos\n• Arquitectura de solución personalizada\n\n**FASE 2 - DO (Semanas 2-4):**\n• Implementación técnica\n• Configuración de dashboards\n• Integración de datos\n\n**FASE 3 - CHECK (Semana 5):**\n• Testing y validación\n• Capacitación del equipo\n• Métricas iniciales\n\n**FASE 4 - ACT (Ongoing):**\n• Optimización continua\n• Soporte 24/7\n• Nuevas funcionalidades\n\n**⏱️ TIEMPO TÍPICO:** 4-6 semanas para ver primeros resultados\n\n**¿Necesitas implementación urgente?** Tenemos plan express 🚀"
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
            urgency: {
                keywords: ['urgente', 'ya', 'ahora', 'inmediato', 'rápido', 'emergencia', 'necesito ya'],
                responses: [
                    "🚨 **SITUACIÓN URGENTE - RESPUESTA INMEDIATA**\n\n**� CONTACTO DIRECTO CEO:**\nFerney Quiroga: **ferneyquiroga101@gmail.com**\n\n**⚡ SOLUCIONES RÁPIDAS DISPONIBLES:**\n• Análisis express en 24 horas\n• Implementación de emergencia\n• Soporte técnico inmediato\n\n**💼 ¿Cuál es tu situación crítica?**\n¡Escríbeme por email y lo resolvemos juntos! 🚀\n\n*\"Los problemas urgentes requieren soluciones expertas\"* - DataCrypt_Labs"
                ]
            },
            competition: {
                keywords: ['vs', 'comparación', 'competencia', 'otros', 'diferencia', 'mejor', 'por qué elegir'],
                responses: [
                    "🏆 **¿POR QUÉ DATACRYPT_LABS ES LA MEJOR OPCIÓN?**\n\n**❌ OTROS PROVEEDORES:**\n• Prometen sin garantías\n• Implementaciones genéricas\n• Sin seguimiento post-venta\n• Equipos junior\n\n**✅ DATACRYPT_LABS:**\n• **ROI garantizado en 30 días**\n• CEO con 10+ certificaciones reales\n• **Metodología PDCA probada**\n• **98% satisfacción del cliente**\n• Soporte personalizado 24/7\n• **50+ casos de éxito documentados**\n\n**💎 DIFERENCIADOR ÚNICO:**\nSomos los únicos que aplicamos **mejora continua PDCA** a cada proyecto de datos.\n\n**¿Comparamos propuestas específicas?** Te muestro por qué somos superiores 📊"
                ]
            },
            default: [
                "🤔 **Excelente pregunta!** Como **Alex**, tu consultor especializado de DataCrypt_Labs, me gusta profundizar en cada consulta empresarial.\n\n**¿Podrías contarme más sobre:**\n• ¿Tu empresa maneja muchos datos?\n• ¿Qué decisiones te gustaría automatizar?\n• ¿Cuál es tu mayor pain point operativo?\n\n**💡 Como consultor:** ¿Te interesa una **consulta gratuita** donde analizo tu situación específica? 📞",
                "🚀 **¡Perfecto!** Soy **Alex** y me encanta cuando las empresas buscan **soluciones data-driven rentables**.\n\n**Como tu consultor comercial especializado**, necesito entender mejor tu contexto:\n\n**📊 ¿Tu empresa está buscando:**\n• Automatizar reportes y dashboards?\n• Predecir ventas o demanda?\n• Optimizar operaciones con datos?\n• Mejorar toma de decisiones?\n\n**¡Escríbeme por email!** ferneyquiroga101@gmail.com y armamos tu propuesta comercial personalizada 💼",
                "💡 **Interesante consulta empresarial!** Como **Alex** de DataCrypt_Labs, convierto **preguntas complejas** en **soluciones rentables**.\n\n**🎯 ¿Sabías que el 87% de las empresas** no aprovecha ni el 30% de sus datos?\n\n**Como tu consultor, te ayudo a:**\n✅ Identificar oportunidades ocultas en tus datos\n✅ Implementar soluciones que se paguen solas\n✅ Generar ROI desde el primer mes\n\n**¿Hablamos de tu proyecto empresarial específico?** Email: ferneyquiroga101@gmail.com 🚀"
            ]
        };
    }

    async sendMessage(text = null) {
        try {
            // Prevenir bucles infinitos
            if (this.isProcessingMessage) {
                console.warn('Mensaje ya en procesamiento, saltando...');
                return;
            }
            
            const message = text || this.chatInput.value.trim();
            if (!message) return;
            
            // Marcar como procesando
            this.isProcessingMessage = true;

        // 🔒 VALIDACIONES DE SEGURIDAD
        if (this.config.security && this.security && this.rateLimiter) {
            // Verificar rate limiting
            const rateLimitCheck = this.rateLimiter.checkRateLimit();
            if (!rateLimitCheck.allowed) {
                this.addMessage(`🚫 ${rateLimitCheck.reason}`, 'bot');
                return;
            }

            // Validar contenido del mensaje
            const securityCheck = this.security.validateMessage(message);
            if (!securityCheck.valid) {
                this.addMessage(`🛡️ ${securityCheck.reason}`, 'bot');
                return;
            }

            // Usar mensaje sanitizado
            const sanitizedMessage = securityCheck.message;
            
            // Agregar mensaje del usuario (sanitizado)
            this.addMessage(sanitizedMessage, 'user');
            this.chatInput.value = '';
            this.adjustInputHeight();

            // Mostrar typing indicator
            this.showTyping();

            // Simular delay de respuesta
            await this.delay(this.config.responseDelay);

            // Generar respuesta usando mensaje sanitizado
            const response = this.generateResponse(sanitizedMessage);
            
            this.hideTyping();
            this.addMessage(response, 'bot');
        } else {
            // Comportamiento original sin seguridad
            this.addMessage(message, 'user');
            this.chatInput.value = '';
            this.adjustInputHeight();

            this.showTyping();
            await this.delay(this.config.responseDelay);

            const response = this.generateResponse(message);
            
            this.hideTyping();
            this.addMessage(response, 'bot');
        }
        
        // Mostrar quick replies si es apropiado
        this.showQuickReplies();
        
        // Guardar historial
        this.saveChatHistory();
        
        // Limpiar bandera de procesamiento
        this.isProcessingMessage = false;
        } catch (error) {
            console.error('Error en sendMessage:', error);
            this.isProcessingMessage = false; // Asegurar que se limpia la bandera
            this.addMessage('⚠️ Disculpa, hubo un error procesando tu mensaje. Como Alex, tu consultor de DataCrypt_Labs, puedo ayudarte mejor si reformulas tu consulta comercial.', 'bot');
        }
    }

    generateResponse(message) {
        try {
            const lowerMessage = message.toLowerCase();
            
            // Saludos
            if (this.matchesKeywords(lowerMessage, ['hola', 'hello', 'hi', 'buenos', 'saludos', 'buenas'])) {
                return this.getRandomResponse(this.knowledgeBase.greetings);
            }

        // Urgencia - PRIORIDAD ALTA
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.urgency.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.urgency.responses);
        }

        // Precios - INTERÉS COMERCIAL ALTO
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.pricing.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.pricing.responses);
        }

        // Contacto - CONVERSIÓN DIRECTA
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.contact.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.contact.responses);
        }

        // Servicios
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.services.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.services.responses);
        }

        // Testimonios y casos de éxito
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.testimonials.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.testimonials.responses);
        }

        // Implementación y proceso
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.implementation.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.implementation.responses);
        }

        // Comparación con competencia
        if (this.matchesKeywords(lowerMessage, this.knowledgeBase.competition.keywords)) {
            return this.getRandomResponse(this.knowledgeBase.competition.responses);
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

        // Respuesta por defecto con enfoque comercial
        return this.getRandomResponse(this.knowledgeBase.default);
        } catch (error) {
            console.error('Error generando respuesta:', error);
            return "Disculpa, estoy experimentando algunas dificultades técnicas. Como Alex, tu consultor comercial de DataCrypt_Labs, normalmente puedo ayudarte con soluciones empresariales de datos. ¿Podrías intentar reformular tu consulta?";
        }
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
            
            // Greeting personalizado por contexto
            const currentHour = new Date().getHours();
            const timeGreeting = currentHour < 12 ? 'Buenos días' : 
                                currentHour < 18 ? 'Buenas tardes' : 'Buenas noches';
            
            const personalizedGreeting = `${timeGreeting}! 👋 Soy **Alex**, tu consultor comercial especializado de DataCrypt_Labs.\n\n💼 **MI ESPECIALIDAD:** Transformar datos empresariales en ventajas competitivas rentables y soluciones que generan ROI medible.\n\n¿Qué desafío empresarial necesitas resolver con datos? ⚡`;
            
            setTimeout(() => {
                this.addMessage(personalizedGreeting, 'bot');
                this.showCommercialQuickReplies();
            }, 1200);
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

    showCommercialQuickReplies() {
        // Crear quick replies comerciales dinámicamente
        const quickRepliesContainer = this.chatMessages.querySelector('.quick-replies') || 
                                    this.createCommercialQuickReplies();
        
        // Actualizar opciones comerciales
        quickRepliesContainer.innerHTML = `
            <button class="quick-reply commercial" data-text="¿Cuáles son sus servicios y precios?">💰 Servicios y Precios</button>
            <button class="quick-reply commercial" data-text="Necesito una consulta gratuita">📞 Consulta GRATIS</button>
            <button class="quick-reply commercial" data-text="¿Qué resultados obtienen sus clientes?">🏆 Casos de Éxito</button>
            <button class="quick-reply commercial" data-text="Contacto directo CEO">👨‍💼 Hablar con CEO</button>
        `;
        
        quickRepliesContainer.style.display = 'flex';
        
        setTimeout(() => {
            quickRepliesContainer.style.display = 'none';
        }, 15000); // Más tiempo para opciones comerciales
    }

    createCommercialQuickReplies() {
        const container = document.createElement('div');
        container.className = 'quick-replies commercial-replies';
        this.chatMessages.appendChild(container);
        return container;
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
    
    destroy() {
        // Limpiar event listeners para prevenir memory leaks
        try {
            if (this.chatButton) {
                this.chatButton.replaceWith(this.chatButton.cloneNode(true));
            }
            if (this.sendButton) {
                this.sendButton.replaceWith(this.sendButton.cloneNode(true));
            }
            
            // Remover elemento del DOM
            if (this.chatContainer && this.chatContainer.parentNode) {
                this.chatContainer.parentNode.removeChild(this.chatContainer);
            }
            
            // Limpiar instancia estática
            DataCryptChatbot.instance = null;
            
            console.log('Chatbot destruido correctamente');
        } catch (error) {
            console.error('Error al destruir chatbot:', error);
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
}

// 🔒 CLASES DE SEGURIDAD PARA CHATBOT
class ChatbotSecurity {
    constructor() {
        this.messageHistory = [];
        this.blockedPatterns = [
            /(.)\1{10,}/g, // Caracteres repetidos
            /https?:\/\/[^\s]+/g, // URLs sospechosas
            /(script|javascript|vbscript|onload|onclick)/gi, // Scripts maliciosos
            /(union|select|insert|delete|drop|update)/gi, // SQL injection
            /(viagra|casino|lottery|winner|hack|crack)/gi, // Spam común
            /[<>\"'&]/g // Caracteres HTML peligrosos
        ];
    }
    
    validateMessage(message) {
        // Validación básica
        if (!message || typeof message !== 'string') {
            return { valid: false, reason: 'Mensaje inválido' };
        }
        
        // Sanitizar mensaje
        const sanitized = this.sanitizeInput(message);
        
        // Validar longitud
        if (sanitized.length > 500) {
            this.logSecurityEvent('LONG_MESSAGE', { length: sanitized.length });
            return { 
                valid: false, 
                reason: 'Mensaje demasiado largo. Máximo 500 caracteres.' 
            };
        }
        
        if (sanitized.length < 1) {
            return { 
                valid: false, 
                reason: 'Mensaje vacío no permitido.' 
            };
        }
        
        // Detectar patrones maliciosos
        for (let pattern of this.blockedPatterns) {
            if (pattern.test(message)) {
                this.logSecurityEvent('MALICIOUS_PATTERN', { 
                    pattern: pattern.source,
                    message: sanitized 
                });
                return { 
                    valid: false, 
                    reason: 'Mensaje contiene contenido no permitido.' 
                };
            }
        }
        
        // Detectar spam repetitivo
        if (this.isRepetitiveSpam(sanitized)) {
            this.logSecurityEvent('REPETITIVE_SPAM', { message: sanitized });
            return { 
                valid: false, 
                reason: 'Por favor, evita repetir el mismo mensaje.' 
            };
        }
        
        return { valid: true, message: sanitized };
    }
    
    sanitizeInput(input) {
        return input
            .replace(/[<>\"'&]/g, (match) => {
                const entityMap = {
                    '<': '&lt;', '>': '&gt;', '"': '&quot;',
                    "'": '&#39;', '&': '&amp;'
                };
                return entityMap[match];
            })
            .trim();
    }
    
    isRepetitiveSpam(message) {
        this.messageHistory.push({
            message: message.toLowerCase(),
            timestamp: Date.now()
        });
        
        // Mantener solo los últimos 10 mensajes
        if (this.messageHistory.length > 10) {
            this.messageHistory = this.messageHistory.slice(-10);
        }
        
        // Contar mensajes similares en los últimos 5 minutos
        const fiveMinutesAgo = Date.now() - 300000;
        const recentSimilar = this.messageHistory.filter(m => 
            m.timestamp > fiveMinutesAgo && 
            m.message === message.toLowerCase()
        );
        
        return recentSimilar.length > 3;
    }
    
    logSecurityEvent(type, data) {
        const event = {
            type: `CHATBOT_${type}`,
            data,
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        };
        
        console.warn('🚨 Chatbot Security Event:', event);
        
        // Almacenar en logs de seguridad
        const logs = JSON.parse(localStorage.getItem('datacrypt_security_logs') || '[]');
        logs.push(event);
        localStorage.setItem('datacrypt_security_logs', JSON.stringify(logs.slice(-1000)));
    }
}

class MessageRateLimit {
    constructor() {
        this.messages = [];
        this.maxMessages = 10; // Máximo 10 mensajes
        this.timeWindow = 60000; // En 1 minuto
        this.blockDuration = 30000; // Bloquear por 30 segundos
        this.blocked = false;
        this.blockUntil = 0;
    }
    
    checkRateLimit() {
        const now = Date.now();
        
        // Verificar si está bloqueado
        if (this.blocked && now < this.blockUntil) {
            const remainingTime = Math.ceil((this.blockUntil - now) / 1000);
            return {
                allowed: false,
                reason: `Demasiados mensajes. Espera ${remainingTime} segundos.`
            };
        }
        
        // Resetear bloqueo si expiró
        if (this.blocked && now >= this.blockUntil) {
            this.blocked = false;
            this.messages = [];
        }
        
        // Limpiar mensajes antiguos
        this.messages = this.messages.filter(time => 
            now - time < this.timeWindow
        );
        
        // Verificar límite
        if (this.messages.length >= this.maxMessages) {
            this.blocked = true;
            this.blockUntil = now + this.blockDuration;
            
            // Log del evento de seguridad
            const event = {
                type: 'CHATBOT_RATE_LIMIT_EXCEEDED',
                data: { 
                    messageCount: this.messages.length,
                    timeWindow: this.timeWindow 
                },
                timestamp: now
            };
            
            const logs = JSON.parse(localStorage.getItem('datacrypt_security_logs') || '[]');
            logs.push(event);
            localStorage.setItem('datacrypt_security_logs', JSON.stringify(logs.slice(-1000)));
            
            return {
                allowed: false,
                reason: `Límite de mensajes excedido. Espera ${Math.ceil(this.blockDuration / 1000)} segundos.`
            };
        }
        
        // Registrar mensaje
        this.messages.push(now);
        return { allowed: true };
    }
}

// Auto-inicializar
if (typeof document !== 'undefined') {
    // Inicializar automáticamente si hay configuración
    document.addEventListener('DOMContentLoaded', () => {
        // Prevenir múltiples inicializaciones
        if (window.dataCryptChatbot) {
            console.log('Chatbot ya inicializado, saltando nueva instancia');
            return;
        }
        
        if (window.ConfigManager) {
            const chatbotConfig = window.ConfigManager.getConfig('chatbot');
            if (chatbotConfig && chatbotConfig.enabled) {
                window.dataCryptChatbot = new DataCryptChatbot(chatbotConfig);
            }
        }
    });
}

export default DataCryptChatbot;