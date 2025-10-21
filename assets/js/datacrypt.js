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
        this.currentTheme = localStorage.getItem('datacrypt-theme') || 'light';
        
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
     * Inicializar tema corporativo
     */
    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        if (this.elements.themeToggle) {
            const icon = this.elements.themeToggle.querySelector('i');
            if (icon) {
                icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
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
            { name: 'Navigation', init: () => this.initializeNavigation() },
            { name: 'Hero', init: () => this.initializeHero() },
            { name: 'Services', init: () => this.initializeServices() },
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