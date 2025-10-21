/**
 * 🌱 DATACRYPT_LABS - SISTEMA CORPORATIVO v2.1
 * JavaScript principal para empresa de Business Intelligence & Data Science
 * Basado en Filosofía "La Mejora Continua" y patrones probados
 * 
 * ⭐ COORDINADOR CENTRAL para funcionalidades corporativas
 * ⭐ Performance optimizado para aplicaciones B2B
 * ⭐ Analytics integrado y tracking empresarial
 */

// ==========================================
// CONFIGURACIÓN CORPORATIVA DATACRYPT_LABS
// ==========================================
const DATACRYPT_CONFIG = {
    company: {
        name: "DataCrypt_Labs",
        tagline: "Automatizamos Soluciones",
        phone: "3232066197",
        email: "info@datacrypt-labs.com",
        services: [
            "BUSINESS_INTELLIGENCE",
            "MACHINE_LEARNING", 
            "BIG_DATA",
            "DATA_VISUALIZATION",
            "CONSULTORIA_DATOS",
            "GEORREFERENCIACION"
        ]
    },
    ui: {
        theme: 'corporate',
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        accentColor: '#f59e0b',
        animationDuration: 300
    },
    analytics: {
        trackCorporateEvents: true,
        b2bMetrics: true,
        sessionTimeout: 30 * 60 * 1000 // 30 minutos
    }
};

// ==========================================
// DATACRYPT_LABS MANAGER PRINCIPAL
// ==========================================
class DataCryptLabsManager {
    
    constructor() {
        this.config = DATACRYPT_CONFIG;
        this.isInitialized = false;
        this.loadingScreen = null;
        this.currentTheme = 'dark'; // Solo modo oscuro permanente
        
        // Performance tracking
        this.performanceMetrics = {
            initStartTime: performance.now(),
            componentLoadTimes: new Map(),
            userInteractions: 0
        };
        
        // Business Intelligence metrics
        this.biMetrics = {
            pageViews: parseInt(localStorage.getItem('datacrypt-pageviews') || '0'),
            serviceClicks: parseInt(localStorage.getItem('datacrypt-serviceclicks') || '0'),
            contactForms: parseInt(localStorage.getItem('datacrypt-contactforms') || '0'),
            portfolioViews: parseInt(localStorage.getItem('datacrypt-portfolioviews') || '0')
        };
        
        // DOM elements cache
        this.elements = {
            loadingScreen: null,
            navbar: null,
            navToggle: null,
            navMenu: null,
            themeToggle: null,
            backToTop: null
        };
    }

    /**
     * Inicialización principal del sistema corporativo
     */
    async initialize() {
        try {
            console.log('🚀 Iniciando DataCrypt_Labs Corporate System...');
            
            // Cache elementos DOM
            this.cacheElements();
            
            // Configurar tema inicial
            this.initializeTheme();
            
            // Mostrar loading screen
            this.showLoadingScreen();
            
            // Inicializar componentes principales
            await this.initializeComponents();
            
            // Configurar eventos
            this.setupEventListeners();
            
            // Inicializar analytics
            this.initializeAnalytics();
            
            // Configurar animaciones
            this.initializeAnimations();
            
            // Finalizar carga
            this.completeInitialization();
            
            console.log('✅ DataCrypt_Labs Corporate System initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing DataCrypt_Labs:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Cache de elementos DOM para mejor performance
     */
    cacheElements() {
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            navbar: document.querySelector('.header'),
            navToggle: document.getElementById('nav-toggle'),
            navMenu: document.getElementById('nav-menu'),
            themeToggle: document.getElementById('theme-toggle'),
            backToTop: document.querySelector('.back-to-top'),
            heroSection: document.getElementById('inicio'),
            servicesSection: document.getElementById('servicios'),
            portfolioSection: document.getElementById('portafolio'),
            contactSection: document.getElementById('contacto')
        };
    }

    /**
     * Inicializar tema corporativo - Solo Dark Mode
     */
    initializeTheme() {
        // Siempre establecer tema oscuro
        document.documentElement.setAttribute('data-theme', 'dark');
        this.currentTheme = 'dark';
        
        // No hay toggle de tema, solo modo oscuro permanente
        console.log('🌙 DataCrypt_Labs - Dark Mode inicializado como tema único');
    }

    /**
     * Mostrar pantalla de carga corporativa
     */
    showLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.style.display = 'flex';
            
            // Simular progreso de carga
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2000);
        }
    }

    /**
     * Ocultar pantalla de carga
     */
    hideLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                this.elements.loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Inicializar componentes principales
     */
    async initializeComponents() {
        const components = [
            { name: 'Translations', init: () => this.initializeTranslations() },
            { name: 'Navigation', init: () => this.initializeNavigation() },
            { name: 'Hero', init: () => this.initializeHero() },
            { name: 'Services', init: () => this.initializeServices() },
            { name: 'DataWizard', init: () => this.initializeDataWizard() },
            { name: 'Portfolio', init: () => this.initializePortfolio() },
            { name: 'Contact', init: () => this.initializeContact() },
            { name: 'Chatbot', init: () => this.initializeChatbot() }
        ];

        for (const component of components) {
            try {
                const startTime = performance.now();
                await component.init();
                const endTime = performance.now();
                this.performanceMetrics.componentLoadTimes.set(component.name, endTime - startTime);
                console.log(`✅ ${component.name} component loaded in ${(endTime - startTime).toFixed(2)}ms`);
            } catch (error) {
                console.error(`❌ Error loading ${component.name} component:`, error);
            }
        }
    }

    /**
     * Inicializar sistema de traducciones
     */
    initializeTranslations() {
        this.translationSystem = new TranslationSystem();
    }

    /**
     * Inicializar navegación corporativa
     */
    initializeNavigation() {
        // Mobile navigation toggle
        if (this.elements.navToggle && this.elements.navMenu) {
            this.elements.navToggle.addEventListener('click', () => {
                this.elements.navMenu.classList.toggle('active');
                this.performanceMetrics.userInteractions++;
            });
        }

        // Smooth scrolling para enlaces de navegación
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Cerrar menu móvil si está abierto
                    if (this.elements.navMenu) {
                        this.elements.navMenu.classList.remove('active');
                    }
                    
                    // Actualizar enlace activo
                    this.updateActiveNavLink(link);
                    
                    // Track analytics
                    this.trackCorporateEvent('navigation_click', { target: targetId });
                }
            });
        });

        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (this.elements.navbar) {
                if (currentScrollY > 100) {
                    this.elements.navbar.classList.add('scrolled');
                } else {
                    this.elements.navbar.classList.remove('scrolled');
                }
                
                // Auto-hide/show navbar
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    this.elements.navbar.style.transform = 'translateY(-100%)';
                } else {
                    this.elements.navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
            this.updateActiveNavOnScroll();
        });
    }

    /**
     * Actualizar enlace activo en navegación
     */
    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    /**
     * Actualizar navegación activa al hacer scroll
     */
    updateActiveNavOnScroll() {
        const sections = ['inicio', 'servicios', 'portafolio', 'contacto'];
        const scrollPos = window.scrollY + 100;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (section && navLink) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.updateActiveNavLink(navLink);
                }
            }
        });
    }

    /**
     * Inicializar sección hero con animaciones
     */
    initializeHero() {
        // Animación de las barras de datos
        const chartBars = document.querySelectorAll('.chart-bar');
        if (chartBars.length > 0) {
            const animateChartBars = () => {
                chartBars.forEach((bar, index) => {
                    const height = Math.random() * 80 + 20; // 20-100%
                    bar.style.height = `${height}%`;
                    bar.style.animationDelay = `${index * 0.2}s`;
                });
            };
            
            // Animar cada 3 segundos
            setInterval(animateChartBars, 3000);
            animateChartBars(); // Primera animación inmediata
        }

        // Animación de los puntos de datos
        const dataPoints = document.querySelectorAll('.point');
        if (dataPoints.length > 0) {
            let currentPoint = 0;
            const animateDataPoints = () => {
                dataPoints.forEach(point => point.classList.remove('active'));
                dataPoints[currentPoint].classList.add('active');
                currentPoint = (currentPoint + 1) % dataPoints.length;
            };
            
            setInterval(animateDataPoints, 1000);
            animateDataPoints();
        }

        // Typing effect para el título
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            heroTitle.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    heroTitle.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }

    /**
     * Inicializar sección de servicios
     */
    initializeServices() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach((card, index) => {
            // Animación de entrada con delay
            setTimeout(() => {
                card.classList.add('fade-in', 'visible');
            }, index * 200);
            
            // Track clicks en servicios
            card.addEventListener('click', () => {
                const serviceTitle = card.querySelector('.service-title')?.textContent || 'Unknown';
                this.trackCorporateEvent('service_click', { service: serviceTitle });
                this.biMetrics.serviceClicks++;
                this.saveBIMetrics();
            });
        });
    }

    /**
     * Inicializar Data Wizard Game
     */
    initializeDataWizard() {
        // Inicializar el juego Data Wizard
        this.dataWizardGame = new DataWizardGame();
        
        // Observer para trackear engagement del juego
        const gameSection = document.querySelector('#data-wizard');
        if (gameSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.trackEvent('game_section_view', {
                            timestamp: Date.now(),
                            section: 'data-wizard'
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(gameSection);
        }
    }

    /**
     * Inicializar galería del portafolio con carousel automático
     */
    initializePortfolio() {
        // Inicializar carousel del portafolio
        this.portfolioCarousel = new PortfolioCarousel();
        
        // Observer para trackear visualizaciones
        const portfolioSection = document.querySelector('#portafolio');
        if (portfolioSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.biMetrics.portfolioViews++;
                        this.saveBIMetrics();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(portfolioSection);
        }
        
        // Animación de entrada para el carousel
        const carouselContainer = document.querySelector('.portfolio-carousel-container');
        if (carouselContainer) {
            setTimeout(() => {
                carouselContainer.classList.add('fade-in', 'visible');
            }, 300);
        }
    }

    /**
     * Inicializar formulario de contacto
     */
    initializeContact() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e.target);
            });
        }
    }

    /**
     * Manejar envío del formulario de contacto
     */
    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validaciones básicas
        if (!data.nombre || !data.email || !data.mensaje) {
            this.showNotification('Por favor, complete todos los campos requeridos.', 'error');
            return;
        }
        
        // Simular envío (aquí iría la integración real)
        this.showNotification('¡Mensaje enviado correctamente! Nos contactaremos pronto.', 'success');
        form.reset();
        
        // Track analytics
        this.biMetrics.contactForms++;
        this.saveBIMetrics();
        this.trackCorporateEvent('contact_form_submit', data);
    }

    /**
     * Inicializar chatbot corporativo
     */
    initializeChatbot() {
        const chatbotToggle = document.querySelector('.chatbot-toggle');
        const chatbotContainer = document.querySelector('.chatbot-container');
        const chatbotClose = document.querySelector('.chatbot-close');
        const chatbotInput = document.querySelector('.chatbot-input input');
        const chatbotSend = document.querySelector('.chatbot-input button');
        
        if (chatbotToggle && chatbotContainer) {
            chatbotToggle.addEventListener('click', () => {
                chatbotContainer.classList.toggle('active');
                this.trackCorporateEvent('chatbot_toggle', { action: 'open' });
            });
        }
        
        if (chatbotClose && chatbotContainer) {
            chatbotClose.addEventListener('click', () => {
                chatbotContainer.classList.remove('active');
                this.trackCorporateEvent('chatbot_toggle', { action: 'close' });
            });
        }
        
        if (chatbotSend && chatbotInput) {
            const sendMessage = () => {
                const message = chatbotInput.value.trim();
                if (message) {
                    this.addChatMessage(message, 'user');
                    chatbotInput.value = '';
                    
                    // Respuesta automática simple
                    setTimeout(() => {
                        const response = this.generateChatbotResponse(message);
                        this.addChatMessage(response, 'bot');
                    }, 1000);
                    
                    this.trackCorporateEvent('chatbot_message', { message });
                }
            };
            
            chatbotSend.addEventListener('click', sendMessage);
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }

    /**
     * Agregar mensaje al chat
     */
    addChatMessage(message, sender) {
        const messagesContainer = document.querySelector('.chatbot-messages');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                ${sender === 'bot' ? 'DC' : 'U'}
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Generar respuesta del chatbot
     */
    generateChatbotResponse(message) {
        const responses = {
            'servicios': '¡Ofrecemos Business Intelligence, Machine Learning, Big Data, Data Visualization, Consultoría y Georreferenciación! ¿En qué servicio estás interesado?',
            'contacto': 'Puedes contactarnos al 3232066197 o llenar nuestro formulario de contacto. ¿En qué podemos ayudarte?',
            'portafolio': 'Tenemos proyectos exitosos en diversas industrias. ¿Te gustaría conocer algún proyecto específico?',
            'precio': 'Nuestros precios son competitivos y se adaptan a cada proyecto. ¿Podrías contarnos más sobre tus necesidades?',
            'default': '¡Hola! Soy el asistente virtual de DataCrypt_Labs. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre nuestros servicios, portafolio o contacto.'
        };
        
        const lowerMessage = message.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }

    /**
     * Configurar eventos principales
     */
    setupEventListeners() {
        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Back to top button
        this.initializeBackToTop();
        
        // Resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.biMetrics.pageViews++;
                this.saveBIMetrics();
            }
        });
    }

    /**
     * Toggle del tema
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('datacrypt-theme', this.currentTheme);
        
        // Actualizar icono
        const icon = this.elements.themeToggle.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.trackCorporateEvent('theme_toggle', { theme: this.currentTheme });
    }

    /**
     * Inicializar botón back to top
     */
    initializeBackToTop() {
        let backToTopBtn = this.elements.backToTop;
        
        if (!backToTopBtn) {
            // Crear botón si no existe
            backToTopBtn = document.createElement('button');
            backToTopBtn.className = 'back-to-top';
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            backToTopBtn.setAttribute('aria-label', 'Volver arriba');
            document.body.appendChild(backToTopBtn);
            this.elements.backToTop = backToTopBtn;
        }
        
        // Mostrar/ocultar basado en scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Click handler
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            this.trackCorporateEvent('back_to_top_click');
        });
    }

    /**
     * Manejar redimensionamiento de ventana
     */
    handleResize() {
        // Cerrar menú móvil si está abierto
        if (window.innerWidth > 768 && this.elements.navMenu) {
            this.elements.navMenu.classList.remove('active');
        }
    }

    /**
     * Inicializar animaciones de scroll
     */
    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observar elementos con clase fade-in
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Inicializar analytics corporativo
     */
    initializeAnalytics() {
        // Incrementar page views
        this.biMetrics.pageViews++;
        this.saveBIMetrics();
        
        // Configurar tracking de tiempo en página
        this.startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const sessionTime = Date.now() - this.startTime;
            this.trackCorporateEvent('session_end', { 
                sessionTime,
                metrics: this.biMetrics 
            });
        });
        
        console.log('📊 Corporate Analytics initialized:', this.biMetrics);
    }

    /**
     * Track evento corporativo
     */
    trackCorporateEvent(eventName, data = {}) {
        if (this.config.analytics.trackCorporateEvents) {
            const eventData = {
                event: eventName,
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                userAgent: navigator.userAgent,
                ...data
            };
            
            console.log('📊 Corporate Event:', eventData);
            
            // Aquí se integraría con Google Analytics, Mixpanel, etc.
            // gtag('event', eventName, data);
        }
    }

    /**
     * Guardar métricas BI en localStorage
     */
    saveBIMetrics() {
        localStorage.setItem('datacrypt-pageviews', this.biMetrics.pageViews.toString());
        localStorage.setItem('datacrypt-serviceclicks', this.biMetrics.serviceClicks.toString());
        localStorage.setItem('datacrypt-contactforms', this.biMetrics.contactForms.toString());
        localStorage.setItem('datacrypt-portfolioviews', this.biMetrics.portfolioViews.toString());
    }

    /**
     * Mostrar notificación
     */
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para asegurar visibilidad
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background-color: #10b981;' : ''}
            ${type === 'error' ? 'background-color: #dc2626;' : ''}
            ${type === 'info' ? 'background-color: #2563eb;' : ''}
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    /**
     * Manejar errores de inicialización
     */
    handleInitializationError(error) {
        console.error('❌ DataCrypt_Labs initialization failed:', error);
        
        // Ocultar loading screen en caso de error
        this.hideLoadingScreen();
        
        // Mostrar mensaje de error al usuario
        this.showNotification('Error al cargar la aplicación. Por favor, recarga la página.', 'error');
        
        // Track error
        this.trackCorporateEvent('initialization_error', { 
            error: error.message,
            stack: error.stack 
        });
    }

    /**
     * Finalizar inicialización
     */
    completeInitialization() {
        this.isInitialized = true;
        this.hideLoadingScreen();
        
        const totalTime = performance.now() - this.performanceMetrics.initStartTime;
        console.log(`🎉 DataCrypt_Labs loaded in ${totalTime.toFixed(2)}ms`);
        
        // Track successful initialization
        this.trackCorporateEvent('initialization_complete', {
            loadTime: totalTime,
            componentTimes: Object.fromEntries(this.performanceMetrics.componentLoadTimes)
        });
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('datacryptlabs:ready', {
            detail: { manager: this }
        }));
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ==========================================
// PORTFOLIO CAROUSEL MANAGER
// ==========================================
class PortfolioCarousel {
    constructor() {
        this.carousel = document.getElementById('portfolioCarousel');
        this.slides = document.querySelectorAll('.portfolio-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.transitionDuration = 600;
        
        this.initialize();
    }
    
    initialize() {
        if (!this.carousel || this.totalSlides === 0) return;
        
        this.setupEventListeners();
        this.startAutoPlay();
        this.updateSlidePosition();
        
        console.log('🎠 Portfolio Carousel initialized with', this.totalSlides, 'slides');
    }
    
    setupEventListeners() {
        // Botones de navegación
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pausar autoplay en hover
        if (this.carousel) {
            this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }
        
        // Control de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch events para móviles
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.pauseAutoPlay();
        });
        
        this.carousel.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevenir scroll
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
            this.resumeAutoPlay();
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50; // Minimum swipe distance
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide(); // Swipe left - next slide
            } else {
                this.previousSlide(); // Swipe right - previous slide
            }
        }
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlidePosition();
        this.trackCarouselInteraction('next');
    }
    
    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlidePosition();
        this.trackCarouselInteraction('previous');
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateSlidePosition();
            this.trackCarouselInteraction('indicator');
        }
    }
    
    updateSlidePosition() {
        if (!this.carousel) return;
        
        // Smooth transition
        this.carousel.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Update indicators
        this.updateIndicators();
        
        // Update slide states
        this.updateSlideStates();
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    updateSlideStates() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoPlay() {
        if (!this.isAutoPlaying) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying && !this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }
    
    toggleAutoPlay() {
        this.isAutoPlaying = !this.isAutoPlaying;
        
        if (this.isAutoPlaying) {
            this.startAutoPlay();
        } else {
            this.pauseAutoPlay();
        }
    }
    
    trackCarouselInteraction(action) {
        // Track analytics if DataCryptLabs manager is available
        if (window.DataCryptLabs && window.DataCryptLabs.trackEvent) {
            window.DataCryptLabs.trackEvent('carousel_interaction', {
                action: action,
                slide: this.currentSlide,
                timestamp: Date.now()
            });
        }
        
        // Update portfolio views metric
        const portfolioViews = parseInt(localStorage.getItem('datacrypt-portfolioviews') || '0') + 1;
        localStorage.setItem('datacrypt-portfolioviews', portfolioViews.toString());
    }
    
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    destroy() {
        this.pauseAutoPlay();
        // Remove event listeners if needed
    }
}

// ==========================================
// DATA WIZARD GAME MANAGER
// ==========================================
class DataWizardGame {
    constructor() {
        this.canvas = document.getElementById('dataWizardCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.gameOverlay = document.getElementById('gameOverlay');
        this.startBtn = document.getElementById('startGameBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.contactUsBtn = document.getElementById('contactUsBtn');
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.dataPoints = 0;
        this.gameTimer = null;
        
        // Game objects
        this.pixels = [];
        this.connections = [];
        this.particles = [];
        this.selectedPixels = [];
        
        // Game settings
        this.pixelSize = 32;
        this.gridWidth = 20;
        this.gridHeight = 15;
        this.colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316'];
        this.targetScore = 1000;
        
        this.initialize();
    }
    
    initialize() {
        if (!this.canvas || !this.ctx) return;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.generatePixelField();
        this.setupThemeIntegration();
    }

    setupThemeIntegration() {
        // Escuchar cambios de tema
        window.addEventListener('themeChanged', (e) => {
            const themeData = e.detail.themeData;
            this.updateTheme(themeData);
        });

        // Aplicar tema inicial si existe
        if (window.themeSystem) {
            const currentTheme = window.themeSystem.getCurrentTheme();
            this.updateTheme(currentTheme.data);
        }
    }

    updateTheme(themeData) {
        // Actualizar colores del juego según el tema
        this.colors = [
            '#000000',           // Negro (siempre)
            themeData.accent,    // Color primario del tema
            themeData.text,      // Color de texto
            themeData.secondary, // Color secundario
            themeData.accentGlow, // Color de glow
            '#ffffff'            // Blanco (siempre)
        ];

        // Actualizar color de partículas
        this.particleColor = themeData.particleColor || themeData.accent;
        
        // Redibujar si el juego está activo
        if (this.isPlaying) {
            this.draw();
        }
        
        console.log('🎮 Data Wizard Game initialized');
    }
    
    setupCanvas() {
        // Set up canvas dimensions
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Enable pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
    }
    
    setupEventListeners() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startGame());
        }
        
        if (this.playAgainBtn) {
            this.playAgainBtn.addEventListener('click', () => this.resetGame());
        }
        
        if (this.contactUsBtn) {
            this.contactUsBtn.addEventListener('click', () => {
                document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        if (this.canvas) {
            this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        }
    }
    
    startGame() {
        this.isPlaying = true;
        this.score = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.dataPoints = 0;
        this.selectedPixels = [];
        this.connections = [];
        
        this.hideOverlay();
        this.generatePixelField();
        this.startGameTimer();
        this.gameLoop();
        
        this.updateUI();
    }
    
    resetGame() {
        this.stopGame();
        this.showStartScreen();
    }
    
    stopGame() {
        this.isPlaying = false;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }
    
    startGameTimer() {
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateUI();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    generatePixelField() {
        this.pixels = [];
        const offsetX = (this.canvas.width - this.gridWidth * this.pixelSize) / 2;
        const offsetY = (this.canvas.height - this.gridHeight * this.pixelSize) / 2;
        
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                this.pixels.push({
                    x: offsetX + x * this.pixelSize,
                    y: offsetY + y * this.pixelSize,
                    gridX: x,
                    gridY: y,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    isSelected: false,
                    alpha: 1,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        }
    }
    
    handleCanvasClick(e) {
        if (!this.isPlaying) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Scale for canvas resolution
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const scaledX = clickX * scaleX;
        const scaledY = clickY * scaleY;
        
        const clickedPixel = this.getPixelAt(scaledX, scaledY);
        
        if (clickedPixel) {
            this.selectPixel(clickedPixel);
        }
    }
    
    handleMouseMove(e) {
        if (!this.isPlaying) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Scale for canvas resolution
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const scaledX = mouseX * scaleX;
        const scaledY = mouseY * scaleY;
        
        this.hoveredPixel = this.getPixelAt(scaledX, scaledY);
    }
    
    getPixelAt(x, y) {
        return this.pixels.find(pixel => 
            x >= pixel.x && x < pixel.x + this.pixelSize &&
            y >= pixel.y && y < pixel.y + this.pixelSize
        );
    }
    
    selectPixel(pixel) {
        if (pixel.isSelected) return;
        
        // Check if this pixel can connect to selected pixels
        if (this.selectedPixels.length > 0) {
            const lastSelected = this.selectedPixels[this.selectedPixels.length - 1];
            if (!this.canConnect(lastSelected, pixel)) return;
        }
        
        pixel.isSelected = true;
        this.selectedPixels.push(pixel);
        
        // Check for valid connections (3 or more of same color)
        if (this.selectedPixels.length >= 3) {
            const sameColor = this.selectedPixels.every(p => p.color === this.selectedPixels[0].color);
            if (sameColor) {
                this.scoreConnection();
            }
        }
    }
    
    canConnect(pixel1, pixel2) {
        const dx = Math.abs(pixel1.gridX - pixel2.gridX);
        const dy = Math.abs(pixel1.gridY - pixel2.gridY);
        return (dx <= 1 && dy <= 1) && pixel1.color === pixel2.color;
    }
    
    scoreConnection() {
        const points = this.selectedPixels.length * 100 * this.level;
        this.score += points;
        this.dataPoints += this.selectedPixels.length;
        
        // Create particle effects
        this.selectedPixels.forEach(pixel => {
            this.createParticleExplosion(pixel.x + this.pixelSize/2, pixel.y + this.pixelSize/2, pixel.color);
        });
        
        // Remove connected pixels
        this.selectedPixels.forEach(pixel => {
            const index = this.pixels.indexOf(pixel);
            if (index > -1) {
                this.pixels.splice(index, 1);
            }
        });
        
        this.selectedPixels = [];
        this.addNewPixels();
        this.updateUI();
        
        // Check for level up
        if (this.score >= this.targetScore * this.level) {
            this.levelUp();
        }
    }
    
    createParticleExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: color,
                life: 1,
                decay: 0.02
            });
        }
    }
    
    addNewPixels() {
        // Add new pixels from top
        const offsetX = (this.canvas.width - this.gridWidth * this.pixelSize) / 2;
        const offsetY = (this.canvas.height - this.gridHeight * this.pixelSize) / 2;
        
        for (let i = 0; i < 5; i++) {
            this.pixels.push({
                x: offsetX + Math.random() * (this.gridWidth - 1) * this.pixelSize,
                y: offsetY - this.pixelSize,
                gridX: Math.floor(Math.random() * this.gridWidth),
                gridY: -1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                isSelected: false,
                alpha: 1,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    levelUp() {
        this.level++;
        this.timeLeft += 30; // Bonus time
        this.targetScore = 1000 * this.level;
        
        // Visual feedback
        this.createLevelUpEffect();
        this.updateUI();
    }
    
    createLevelUpEffect() {
        // Create celebration particles
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: '#f59e0b',
                life: 1,
                decay: 0.01
            });
        }
    }
    
    gameLoop() {
        if (!this.isPlaying) return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            return particle.life > 0;
        });
        
        // Update pixel animations
        this.pixels.forEach(pixel => {
            pixel.pulsePhase += 0.1;
        });
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background grid
        this.drawGrid();
        
        // Draw pixels
        this.pixels.forEach(pixel => this.drawPixel(pixel));
        
        // Draw connections
        this.drawConnections();
        
        // Draw particles
        this.particles.forEach(particle => this.drawParticle(particle));
        
        // Draw hover effect
        if (this.hoveredPixel && !this.hoveredPixel.isSelected) {
            this.drawHoverEffect(this.hoveredPixel);
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
        this.ctx.lineWidth = 1;
        
        const offsetX = (this.canvas.width - this.gridWidth * this.pixelSize) / 2;
        const offsetY = (this.canvas.height - this.gridHeight * this.pixelSize) / 2;
        
        for (let x = 0; x <= this.gridWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX + x * this.pixelSize, offsetY);
            this.ctx.lineTo(offsetX + x * this.pixelSize, offsetY + this.gridHeight * this.pixelSize);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.gridHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX, offsetY + y * this.pixelSize);
            this.ctx.lineTo(offsetX + this.gridWidth * this.pixelSize, offsetY + y * this.pixelSize);
            this.ctx.stroke();
        }
    }
    
    drawPixel(pixel) {
        const pulse = Math.sin(pixel.pulsePhase) * 0.1 + 1;
        const size = (this.pixelSize - 4) * pulse;
        
        this.ctx.fillStyle = pixel.color;
        this.ctx.fillRect(
            pixel.x + (this.pixelSize - size) / 2,
            pixel.y + (this.pixelSize - size) / 2,
            size,
            size
        );
        
        if (pixel.isSelected) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pixel.x + 2, pixel.y + 2, this.pixelSize - 4, this.pixelSize - 4);
        }
    }
    
    drawConnections() {
        if (this.selectedPixels.length > 1) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            
            for (let i = 0; i < this.selectedPixels.length - 1; i++) {
                const current = this.selectedPixels[i];
                const next = this.selectedPixels[i + 1];
                
                const currentX = current.x + this.pixelSize / 2;
                const currentY = current.y + this.pixelSize / 2;
                const nextX = next.x + this.pixelSize / 2;
                const nextY = next.y + this.pixelSize / 2;
                
                this.ctx.moveTo(currentX, currentY);
                this.ctx.lineTo(nextX, nextY);
            }
            
            this.ctx.stroke();
        }
    }
    
    drawParticle(particle) {
        this.ctx.globalAlpha = particle.life;
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        this.ctx.globalAlpha = 1;
    }
    
    drawHoverEffect(pixel) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(pixel.x + 1, pixel.y + 1, this.pixelSize - 2, this.pixelSize - 2);
    }
    
    updateUI() {
        const scoreEl = document.getElementById('gameScore');
        const levelEl = document.getElementById('gameLevel');
        const timeEl = document.getElementById('gameTime');
        const pointsEl = document.getElementById('dataPoints');
        
        if (scoreEl) scoreEl.textContent = this.score.toLocaleString();
        if (levelEl) levelEl.textContent = this.level;
        if (timeEl) timeEl.textContent = this.timeLeft;
        if (pointsEl) pointsEl.textContent = this.dataPoints;
        
        // Add animation to score updates
        if (scoreEl) {
            scoreEl.classList.add('score-animation');
            setTimeout(() => scoreEl.classList.remove('score-animation'), 300);
        }
    }
    
    endGame() {
        this.stopGame();
        this.showGameOverScreen();
    }
    
    showStartScreen() {
        if (this.gameOverlay) {
            this.gameOverlay.classList.remove('hidden');
            document.querySelector('.game-start').classList.remove('hidden');
            document.querySelector('.game-over').classList.add('hidden');
        }
    }
    
    showGameOverScreen() {
        if (this.gameOverlay) {
            this.gameOverlay.classList.remove('hidden');
            document.querySelector('.game-start').classList.add('hidden');
            document.querySelector('.game-over').classList.remove('hidden');
            
            // Update final stats
            const finalScore = document.getElementById('finalScore');
            const finalLevel = document.getElementById('finalLevel');
            const gameRating = document.getElementById('gameRating');
            
            if (finalScore) finalScore.textContent = this.score.toLocaleString();
            if (finalLevel) finalLevel.textContent = this.level;
            if (gameRating) gameRating.textContent = this.getGameRating();
        }
    }
    
    hideOverlay() {
        if (this.gameOverlay) {
            this.gameOverlay.classList.add('hidden');
        }
    }
    
    getGameRating() {
        if (this.score >= 10000) return 'Data Scientist 🧬';
        if (this.score >= 7500) return 'Senior Analyst 🎯';
        if (this.score >= 5000) return 'Data Analyst 📊';
        if (this.score >= 2500) return 'Junior Analyst 📈';
        return 'Data Apprentice 🌱';
    }
}

// ==========================================
// MULTILANGUAGE TRANSLATION SYSTEM
// ==========================================
class TranslationSystem {
    constructor() {
        this.currentLanguage = localStorage.getItem('datacrypt-language') || 'es';
        this.translations = window.TRANSLATIONS || {};
        this.languageToggle = document.getElementById('language-toggle');
        this.languageDropdown = document.getElementById('language-dropdown');
        this.currentLangSpan = document.getElementById('current-lang');
        
        this.initialize();
    }
    
    initialize() {
        this.setupEventListeners();
        this.updateLanguageDisplay();
        this.translatePage();
        
        console.log('🌐 Translation System initialized with language:', this.currentLanguage);
    }
    
    setupEventListeners() {
        // Language toggle click
        if (this.languageToggle) {
            this.languageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLanguageDropdown();
            });
        }
        
        // Language option clicks
        if (this.languageDropdown) {
            this.languageDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                const langOption = e.target.closest('.lang-option');
                if (langOption) {
                    const newLang = langOption.dataset.lang;
                    this.changeLanguage(newLang);
                }
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const selector = document.querySelector('.language-selector');
            if (selector && !selector.contains(e.target)) {
                this.closeLanguageDropdown();
            }
        });
        
        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLanguageDropdown();
            }
        });
    }
    
    toggleLanguageDropdown() {
        const selector = document.querySelector('.language-selector');
        if (selector) {
            const isActive = selector.classList.contains('active');
            
            // Close any other open dropdowns first
            document.querySelectorAll('.language-selector.active').forEach(el => {
                if (el !== selector) {
                    el.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            selector.classList.toggle('active');
            
            // Add ripple effect
            if (!isActive) {
                this.addRippleEffect(this.languageToggle);
            }
        }
    }
    
    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        ripple.style.pointerEvents = 'none';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    closeLanguageDropdown() {
        const selector = document.querySelector('.language-selector');
        if (selector) {
            selector.classList.remove('active');
        }
    }
    
    changeLanguage(newLanguage) {
        if (newLanguage !== this.currentLanguage && this.translations[newLanguage]) {
            this.currentLanguage = newLanguage;
            localStorage.setItem('datacrypt-language', newLanguage);
            
            this.updateLanguageDisplay();
            this.translatePage();
            this.closeLanguageDropdown();
            
            // Track language change
            if (window.DataCryptLabs && window.DataCryptLabs.trackEvent) {
                window.DataCryptLabs.trackEvent('language_change', {
                    from: this.currentLanguage,
                    to: newLanguage,
                    timestamp: Date.now()
                });
            }
            
            console.log('🌐 Language changed to:', newLanguage);
        }
    }
    
    updateLanguageDisplay() {
        if (this.currentLangSpan) {
            this.currentLangSpan.textContent = this.currentLanguage.toUpperCase();
        }
        
        // Update document language attribute
        document.documentElement.lang = this.currentLanguage;
    }
    
    translatePage() {
        const translations = this.translations[this.currentLanguage];
        if (!translations) return;
        
        // Translate elements with data-translate attribute
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const key = element.dataset.translate;
            const translation = this.getNestedTranslation(translations, key);
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Translate attributes with data-translate-attr
        const elementsWithAttrs = document.querySelectorAll('[data-translate-attr]');
        elementsWithAttrs.forEach(element => {
            const attrs = element.dataset.translateAttr.split(',');
            attrs.forEach(attr => {
                const [attrName, key] = attr.split(':');
                const translation = this.getNestedTranslation(translations, key);
                if (translation) {
                    element.setAttribute(attrName.trim(), translation);
                }
            });
        });
        
        // Update page title and meta
        this.updateSEO();
    }
    
    updateSEO() {
        if (this.currentLanguage === 'en') {
            document.title = 'DataCrypt_Labs - Business Intelligence & Data Science Solutions | ML Consulting';
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.content = 'DataCrypt_Labs - Leading company in Business Intelligence, Machine Learning and Data Science. We automate data-driven solutions for enterprises. Contact: 3232066197';
            }
        } else {
            document.title = 'DataCrypt_Labs - Business Intelligence y Data Science | Consultoría ML';
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.content = 'DataCrypt_Labs - Empresa líder en Business Intelligence, Machine Learning y Data Science. Automatizamos soluciones data-driven para empresas. Contacto: 3232066197';
            }
        }
    }
    
    getNestedTranslation(translations, key) {
        const keys = key.split('.');
        let current = translations;
        
        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }
        
        return typeof current === 'string' ? current : null;
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getTranslation(key) {
        return this.getNestedTranslation(this.translations[this.currentLanguage], key);
    }
}

// ==========================================
// INICIALIZACIÓN AUTOMÁTICA
// ==========================================

// Crear instancia global del manager
window.DataCryptLabs = new DataCryptLabsManager();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.DataCryptLabs.initialize();
    });
} else {
    window.DataCryptLabs.initialize();
}

// Exportar para uso en módulos (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataCryptLabsManager;
}

console.log('🌱 DataCrypt_Labs Corporate System loaded successfully!');