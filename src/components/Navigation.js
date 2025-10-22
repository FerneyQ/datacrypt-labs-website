/**
 * 🌱 FILOSOFÍA "LA MEJORA CONTINUA" v2.1
 * COMPONENTE NAVIGATION
 * Siguiendo metodología exitosa del Pescador Bot 2.0
 * 
 * ⭐ Una responsabilidad: Gestión de navegación y scroll
 * ⭐ Configuración centralizada
 * ⭐ Manejo robusto de errores
 */

import { getPortfolioConfig } from '../../config/settings.js';
import { 
    NavigationException,
    SectionNotFoundException,
    ScrollAnimationException,
    withRetry,
    safeExecute 
} from '../utils/exceptions.js';
import { 
    DOMHelper, 
    AnimationHelper, 
    PerformanceHelper 
} from '../utils/helpers.js';

/**
 * Componente de navegación modular
 * ⭐ PATRÓN COMPROBADO - Una clase, una responsabilidad
 */
export class NavigationComponent {
    
    constructor(config = null) {
        this.config = null;
        this.isInitialized = false;
        this.sections = new Map();
        this.currentSection = 'home';
        
        // Elements cache
        this.elements = {
            navbar: null,
            navLinks: [],
            mobileToggle: null,
            scrollProgress: null
        };
        
        // Event listeners cache para cleanup
        this.eventListeners = [];
        
        // Performance optimization
        this.throttledScrollHandler = PerformanceHelper.throttle(
            this.handleScroll.bind(this), 
            100
        );
        
        this.init(config);
    }
    
    /**
     * Inicialización del componente
     * ⭐ METODOLOGÍA COMPROBADA - validación en todos los puntos
     */
    async init(customConfig = null) {
        try {
            PerformanceHelper.startMark('navigation-init');
            
            // Cargar configuración
            this.config = customConfig || await getPortfolioConfig();
            const navConfig = this.config.getComponentConfig('navigation');
            
            // Validar y cachear elementos DOM
            this.cacheElements();
            this.validateElements();
            
            // Configurar secciones
            this.setupSections(navConfig.sections);
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup scroll progress
            this.setupScrollProgress();
            
            // Setup mobile menu
            this.setupMobileMenu();
            
            this.isInitialized = true;
            
            
            PerformanceHelper.endMark('navigation-init');
            
        } catch (error) {
            throw new NavigationException(
                'Error inicializando componente Navigation', 
                { originalError: error.message, config: customConfig }
            );
        }
    }
    
    /**
     * Cachear elementos DOM para performance
     * ⭐ PERFORMANCE - evitar queries repetitivas
     */
    @safeExecute(false, true)
    cacheElements() {
        this.elements.navbar = DOMHelper.getElementById('header');
        this.elements.navLinks = DOMHelper.querySelectorAll('.nav-link');
        this.elements.mobileToggle = DOMHelper.getElementById('mobile-menu-toggle');
        this.elements.scrollProgress = DOMHelper.getElementById('scroll-progress');
        
        return true;
    }
    
    /**
     * Validar elementos requeridos
     */
    validateElements() {
        const requiredElements = [
            { element: this.elements.navbar, name: 'navbar' },
            { element: this.elements.scrollProgress, name: 'scrollProgress' }
        ];
        
        const missing = requiredElements
            .filter(({ element }) => !element)
            .map(({ name }) => name);
            
        if (missing.length > 0) {
            throw new NavigationException(
                `Elementos DOM faltantes: ${missing.join(', ')}`,
                { missingElements: missing }
            );
        }
    }
    
    /**
     * Configurar mapeo de secciones
     */
    setupSections(sectionsConfig) {
        sectionsConfig.forEach(section => {
            const element = DOMHelper.getElementById(section.id);
            if (element) {
                this.sections.set(section.id, {
                    element,
                    config: section,
                    offset: this.calculateSectionOffset(element)
                });
            } else {
                
            }
        });
        
        
    }
    
    /**
     * Calcular offset de sección considerando header fijo
     */
    calculateSectionOffset(element) {
        const headerHeight = this.elements.navbar.offsetHeight;
        return element.offsetTop - headerHeight - 20; // 20px buffer
    }
    
    /**
     * Configurar event listeners con cleanup tracking
     * ⭐ PATRÓN ROBUSTO - cleanup automático de eventos
     */
    setupEventListeners() {
        // Scroll handler
        const scrollHandler = this.throttledScrollHandler;
        window.addEventListener('scroll', scrollHandler, { passive: true });
        this.eventListeners.push({ 
            element: window, 
            event: 'scroll', 
            handler: scrollHandler 
        });
        
        // Navigation links
        this.elements.navLinks.forEach(link => {
            const clickHandler = (e) => this.handleNavClick(e, link);
            link.addEventListener('click', clickHandler);
            this.eventListeners.push({ 
                element: link, 
                event: 'click', 
                handler: clickHandler 
            });
        });
        
        // Resize handler para recalcular offsets
        const resizeHandler = PerformanceHelper.debounce(() => {
            this.recalculateOffsets();
        }, 250);
        
        window.addEventListener('resize', resizeHandler);
        this.eventListeners.push({ 
            element: window, 
            event: 'resize', 
            handler: resizeHandler 
        });
    }
    
    /**
     * Manejar click en enlaces de navegación
     */
    @withRetry(2, 500)
    async handleNavClick(event, link) {
        event.preventDefault();
        
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) {
            throw new NavigationException(
                'Enlace de navegación inválido',
                { href, element: link }
            );
        }
        
        const targetId = href.substring(1);
        const targetSection = this.sections.get(targetId);
        
        if (!targetSection) {
            throw new SectionNotFoundException(targetId);
        }
        
        try {
            // Scroll suave a la sección
            await AnimationHelper.scrollToElement(
                targetSection.element,
                this.elements.navbar.offsetHeight + 20,
                this.config.getModuleConfig('navigation').animationDuration
            );
            
            // Actualizar estado activo
            this.setActiveSection(targetId);
            
            // Analytics tracking
            this.trackNavigation(targetId);
            
        } catch (error) {
            throw new ScrollAnimationException(targetSection.element, error);
        }
    }
    
    /**
     * Manejar scroll de página
     * ⭐ PERFORMANCE OPTIMIZADA - throttling + intersection observer
     */
    @safeExecute(false, false)
    handleScroll() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Actualizar progress bar
        this.updateScrollProgress(scrollY, documentHeight, windowHeight);
        
        // Actualizar header style en scroll
        this.updateHeaderStyle(scrollY);
        
        // Detectar sección activa
        this.detectActiveSection(scrollY);
        
        return true;
    }
    
    /**
     * Actualizar barra de progreso de scroll
     */
    updateScrollProgress(scrollY, documentHeight, windowHeight) {
        const scrollPercent = (scrollY / (documentHeight - windowHeight)) * 100;
        const clampedPercent = Math.min(Math.max(scrollPercent, 0), 100);
        
        if (this.elements.scrollProgress) {
            this.elements.scrollProgress.style.width = `${clampedPercent}%`;
        }
    }
    
    /**
     * Actualizar estilo del header en scroll
     */
    updateHeaderStyle(scrollY) {
        if (scrollY > 50) {
            this.elements.navbar.classList.add('scrolled');
        } else {
            this.elements.navbar.classList.remove('scrolled');
        }
    }
    
    /**
     * Detectar sección activa basada en scroll
     * ⭐ ALGORITMO OPTIMIZADO - detección precisa
     */
    detectActiveSection(scrollY) {
        let activeSection = 'home'; // default
        const buffer = 100; // pixels de buffer para transición
        
        // Iterar secciones en orden inverso para encontrar la más cercana
        const sectionsArray = Array.from(this.sections.entries());
        
        for (let i = sectionsArray.length - 1; i >= 0; i--) {
            const [sectionId, sectionData] = sectionsArray[i];
            const sectionTop = sectionData.element.offsetTop - this.elements.navbar.offsetHeight;
            
            if (scrollY >= sectionTop - buffer) {
                activeSection = sectionId;
                break;
            }
        }
        
        // Actualizar si cambió
        if (activeSection !== this.currentSection) {
            this.setActiveSection(activeSection);
        }
    }
    
    /**
     * Establecer sección activa
     */
    setActiveSection(sectionId) {
        // Remover clase active de todos los enlaces
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Agregar clase active al enlace correspondiente
        const activeLink = DOMHelper.querySelector(`a[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        this.currentSection = sectionId;
        
        
    }
    
    /**
     * Configurar menú móvil
     */
    setupMobileMenu() {
        if (!this.elements.mobileToggle) return;
        
        const toggleHandler = () => this.toggleMobileMenu();
        this.elements.mobileToggle.addEventListener('click', toggleHandler);
        this.eventListeners.push({
            element: this.elements.mobileToggle,
            event: 'click',
            handler: toggleHandler
        });
    }
    
    /**
     * Toggle del menú móvil
     */
    @safeExecute(false, true)
    toggleMobileMenu() {
        const navbarMenu = DOMHelper.getElementById('navbar-menu');
        if (navbarMenu) {
            navbarMenu.classList.toggle('mobile-open');
            this.elements.mobileToggle.classList.toggle('active');
            
            // Prevenir scroll del body cuando menú está abierto
            document.body.classList.toggle('mobile-menu-open');
        }
        
        return true;
    }
    
    /**
     * Recalcular offsets de secciones (en resize)
     */
    @safeExecute(false, true)
    recalculateOffsets() {
        this.sections.forEach((sectionData, sectionId) => {
            sectionData.offset = this.calculateSectionOffset(sectionData.element);
        });
        
        
        return true;
    }
    
    /**
     * Tracking de navegación para analytics
     */
    @safeExecute(false, false)
    trackNavigation(sectionId) {
        if (window.gtag && this.config?.analytics?.ANALYTICS_ENABLED) {
            window.gtag('event', this.config.analytics.EVENTS.SECTION_NAVIGATION, {
                section_name: sectionId,
                navigation_method: 'click'
            });
        }
        
        return true;
    }
    
    /**
     * Navegación programática a sección
     * ⭐ API PÚBLICA para uso externo
     */
    async navigateToSection(sectionId) {
        if (!this.sections.has(sectionId)) {
            throw new SectionNotFoundException(sectionId);
        }
        
        const targetSection = this.sections.get(sectionId);
        
        try {
            await AnimationHelper.scrollToElement(
                targetSection.element,
                this.elements.navbar.offsetHeight + 20,
                800
            );
            
            this.setActiveSection(sectionId);
            this.trackNavigation(sectionId);
            
            return true;
        } catch (error) {
            throw new ScrollAnimationException(targetSection.element, error);
        }
    }
    
    /**
     * Obtener estado actual de navegación
     */
    getNavigationState() {
        return {
            currentSection: this.currentSection,
            sectionsCount: this.sections.size,
            scrollPosition: window.pageYOffset,
            isInitialized: this.isInitialized,
            sections: Array.from(this.sections.keys())
        };
    }
    
    /**
     * Cleanup del componente
     * ⭐ PATRÓN ROBUSTO - limpieza de recursos
     */
    destroy() {
        // Remover todos los event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        
        // Limpiar referencias
        this.eventListeners = [];
        this.sections.clear();
        this.elements = {};
        this.isInitialized = false;
        
        
    }
}

// Export por defecto para uso directo
export default NavigationComponent;
