/**
 * 📱 RESPONSIVE DESIGN SYSTEM v2.1
 * Sistema JavaScript para diseño responsive avanzado
 * 
 * Filosofía Mejora Continua v2.1:
 * - Mobile-first JavaScript
 * - Touch gestures avanzados
 * - Viewport adaptativo
 * - Performance optimizado
 * - Accesibilidad mejorada
 */

class ResponsiveDesignSystem {
    constructor() {
        this.config = {
            name: 'ResponsiveDesignSystem',
            version: '2.1',
            breakpoints: {
                xs: 320,
                sm: 576,
                md: 768,
                lg: 1024,
                xl: 1200,
                xxl: 1400
            },
            touchThreshold: 50,
            swipeThreshold: 100,
            debounceDelay: 150
        };

        this.state = {
            currentBreakpoint: 'xs',
            isTouch: false,
            orientation: 'portrait',
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            isMenuOpen: false,
            touches: new Map(),
            observers: new Map()
        };

        this.events = new Map();
        this.init();
    }

    /**
     * 🚀 Inicialización del sistema
     */
    async init() {
        try {
            console.log(`🎨 Inicializando ${this.config.name} v${this.config.version}...`);

            await this.detectCapabilities();
            this.setupEventListeners();
            this.initializeNavigation();
            this.setupTouchGestures();
            this.setupViewportHandling();
            this.setupIntersectionObservers();
            this.updateBreakpoint();
            this.initializeComponents();

            // Integración con ConfigManager
            if (window.ConfigManager) {
                window.ConfigManager.set('responsiveSystem', this);
                console.log('✅ ResponsiveDesignSystem integrado con ConfigManager');
            }

            console.log('✅ ResponsiveDesignSystem inicializado correctamente');
            this.triggerEvent('system:ready', { system: this });

        } catch (error) {
            console.error('❌ Error inicializando ResponsiveDesignSystem:', error);
            if (window.ContinuousMonitoring) {
                window.ContinuousMonitoring.logError('ResponsiveDesignSystem', 'init', error);
            }
        }
    }

    /**
     * 📱 Detectar capacidades del dispositivo
     */
    async detectCapabilities() {
        // Touch support
        this.state.isTouch = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0 || 
                            navigator.msMaxTouchPoints > 0;

        // Orientación
        this.state.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

        // User agent info
        this.state.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.state.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.state.isAndroid = /Android/.test(navigator.userAgent);

        // Network info si está disponible
        if ('connection' in navigator) {
            this.state.connection = navigator.connection.effectiveType;
        }

        // Preferencias del usuario
        this.state.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.state.prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        this.state.prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        console.log('📱 Capacidades detectadas:', this.state);
    }

    /**
     * 🎯 Configurar event listeners
     */
    setupEventListeners() {
        // Resize con debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, this.config.debounceDelay);
        });

        // Orientación
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 100);
        });

        // Scroll optimizado
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.handleScroll();
                    scrollTimeout = null;
                }, 16); // 60fps
            }
        }, { passive: true });

        // Preferencias del sistema
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.state.prefersReducedMotion = e.matches;
            this.updateMotionPreferences();
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.state.prefersDarkMode = e.matches;
            this.triggerEvent('theme:systemChange', { isDark: e.matches });
        });
    }

    /**
     * 🧭 Inicializar navegación responsive
     */
    initializeNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-menu a');

        if (!navToggle || !navMenu) return;

        // Toggle menu
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        // Cerrar menu al hacer click en enlaces
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.state.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });

        // Cerrar menu con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Cerrar menu al hacer click fuera
        document.addEventListener('click', (e) => {
            if (this.state.isMenuOpen && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * 📱 Toggle del menú mobile
     */
    toggleMobileMenu() {
        if (this.state.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * 📱 Abrir menú mobile
     */
    openMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.classList.add('active');
            navMenu.classList.add('active');
            this.state.isMenuOpen = true;

            // Prevenir scroll del body
            document.body.style.overflow = 'hidden';

            // Accesibilidad
            navToggle.setAttribute('aria-expanded', 'true');
            navMenu.setAttribute('aria-hidden', 'false');

            this.triggerEvent('navigation:menuOpen');
        }
    }

    /**
     * 📱 Cerrar menú mobile
     */
    closeMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            this.state.isMenuOpen = false;

            // Restaurar scroll del body
            document.body.style.overflow = '';

            // Accesibilidad
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');

            this.triggerEvent('navigation:menuClose');
        }
    }

    /**
     * 👆 Configurar gestos táctiles
     */
    setupTouchGestures() {
        if (!this.state.isTouch) return;

        let startX, startY, startTime;

        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();

            this.state.touches.set(e.touches[0].identifier, {
                startX,
                startY,
                startTime,
                element: e.target
            });
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const touchData = this.state.touches.get(touch.identifier);
                
                if (touchData) {
                    const deltaX = touch.clientX - touchData.startX;
                    const deltaY = touch.clientY - touchData.startY;
                    
                    this.handleTouchMove(touchData.element, deltaX, deltaY, touch);
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            e.changedTouches.forEach(touch => {
                const touchData = this.state.touches.get(touch.identifier);
                
                if (touchData) {
                    const deltaX = touch.clientX - touchData.startX;
                    const deltaY = touch.clientY - touchData.startY;
                    const deltaTime = Date.now() - touchData.startTime;
                    
                    this.handleTouchEnd(touchData.element, deltaX, deltaY, deltaTime);
                    this.state.touches.delete(touch.identifier);
                }
            });
        }, { passive: true });
    }

    /**
     * 👆 Manejar movimiento táctil
     */
    handleTouchMove(element, deltaX, deltaY, touch) {
        // Detectar swipe horizontal en navegación
        if (Math.abs(deltaX) > this.config.touchThreshold && 
            Math.abs(deltaX) > Math.abs(deltaY)) {
            
            if (element.closest('.nav-menu') || element.closest('.swipe-container')) {
                this.triggerEvent('touch:swipeMove', {
                    element,
                    direction: deltaX > 0 ? 'right' : 'left',
                    distance: Math.abs(deltaX),
                    touch
                });
            }
        }

        // Pull to refresh en elementos específicos
        if (deltaY > this.config.touchThreshold && 
            window.scrollY === 0 && 
            element.closest('.pull-refresh-container')) {
            
            this.handlePullRefresh(element, deltaY);
        }
    }

    /**
     * 👆 Manejar fin de toque
     */
    handleTouchEnd(element, deltaX, deltaY, deltaTime) {
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const velocity = distance / deltaTime;

        // Detectar swipe rápido
        if (distance > this.config.swipeThreshold && velocity > 0.3) {
            const direction = Math.abs(deltaX) > Math.abs(deltaY) 
                ? (deltaX > 0 ? 'right' : 'left')
                : (deltaY > 0 ? 'down' : 'up');

            this.triggerEvent('touch:swipe', {
                element,
                direction,
                distance,
                velocity,
                deltaX,
                deltaY
            });

            // Swipe para abrir/cerrar menú
            if (direction === 'right' && deltaX > this.config.swipeThreshold && !this.state.isMenuOpen) {
                this.openMobileMenu();
            } else if (direction === 'left' && Math.abs(deltaX) > this.config.swipeThreshold && this.state.isMenuOpen) {
                this.closeMobileMenu();
            }
        }
    }

    /**
     * 🔄 Manejar pull to refresh
     */
    handlePullRefresh(element, deltaY) {
        const container = element.closest('.pull-refresh-container');
        if (!container) return;

        const pullDistance = Math.min(deltaY, 100);
        container.style.transform = `translateY(${pullDistance}px)`;

        if (pullDistance > 50) {
            container.classList.add('pull-ready');
            this.triggerEvent('pullRefresh:ready', { container });
        }
    }

    /**
     * 📐 Configurar manejo de viewport
     */
    setupViewportHandling() {
        // Configurar viewport meta tag dinámicamente
        this.updateViewportMeta();

        // Manejar cambios de viewport en iOS
        if (this.state.isIOS) {
            this.handleiOSViewport();
        }

        // Safe area para dispositivos con notch
        this.setupSafeArea();
    }

    /**
     * 📱 Actualizar viewport meta tag
     */
    updateViewportMeta() {
        let viewport = document.querySelector('meta[name="viewport"]');
        
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }

        let content = 'width=device-width, initial-scale=1.0';

        // Ajustes para diferentes dispositivos
        if (this.state.isIOS) {
            content += ', viewport-fit=cover';
        }

        if (this.state.isMobile) {
            content += ', user-scalable=no';
        }

        viewport.content = content;
    }

    /**
     * 🍎 Manejar viewport específico de iOS
     */
    handleiOSViewport() {
        // Prevenir zoom en inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (parseFloat(getComputedStyle(input).fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });

        // Manejar cambios de orientación en iOS
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        });
    }

    /**
     * 🛡️ Configurar safe area
     */
    setupSafeArea() {
        const root = document.documentElement;
        
        // Detectar safe area
        const safeAreaTop = getComputedStyle(root).getPropertyValue('env(safe-area-inset-top)') || '0px';
        const safeAreaBottom = getComputedStyle(root).getPropertyValue('env(safe-area-inset-bottom)') || '0px';
        
        root.style.setProperty('--safe-area-top', safeAreaTop);
        root.style.setProperty('--safe-area-bottom', safeAreaBottom);
    }

    /**
     * 👁️ Configurar Intersection Observers
     */
    setupIntersectionObservers() {
        // Observer para animaciones de entrada
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.triggerEvent('element:visible', { element: entry.target });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observer para lazy loading
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleLazyLoad(entry.target);
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '200px'
        });

        this.state.observers.set('animation', animationObserver);
        this.state.observers.set('lazy', lazyObserver);

        // Observar elementos existentes
        document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
            animationObserver.observe(el);
        });

        document.querySelectorAll('[data-lazy]').forEach(el => {
            lazyObserver.observe(el);
        });
    }

    /**
     * 🔄 Manejar cambio de tamaño
     */
    handleResize() {
        this.state.viewportWidth = window.innerWidth;
        this.state.viewportHeight = window.innerHeight;

        this.updateBreakpoint();
        this.updateViewportMeta();
        
        // Cerrar menú mobile en resize a desktop
        if (this.getCurrentBreakpoint() !== 'xs' && this.getCurrentBreakpoint() !== 'sm') {
            this.closeMobileMenu();
        }

        this.triggerEvent('viewport:resize', {
            width: this.state.viewportWidth,
            height: this.state.viewportHeight,
            breakpoint: this.state.currentBreakpoint
        });
    }

    /**
     * 🔄 Manejar cambio de orientación
     */
    handleOrientationChange() {
        const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        
        if (newOrientation !== this.state.orientation) {
            this.state.orientation = newOrientation;
            document.body.classList.remove('orientation-portrait', 'orientation-landscape');
            document.body.classList.add(`orientation-${newOrientation}`);

            this.triggerEvent('viewport:orientationChange', {
                orientation: newOrientation,
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
    }

    /**
     * 📜 Manejar scroll
     */
    handleScroll() {
        const scrollY = window.scrollY;
        const scrollPercent = scrollY / (document.documentElement.scrollHeight - window.innerHeight);

        this.triggerEvent('viewport:scroll', {
            scrollY,
            scrollPercent,
            direction: scrollY > (this.state.lastScrollY || 0) ? 'down' : 'up'
        });

        this.state.lastScrollY = scrollY;
    }

    /**
     * 📐 Actualizar breakpoint actual
     */
    updateBreakpoint() {
        const width = this.state.viewportWidth;
        let newBreakpoint = 'xs';

        if (width >= this.config.breakpoints.xxl) newBreakpoint = 'xxl';
        else if (width >= this.config.breakpoints.xl) newBreakpoint = 'xl';
        else if (width >= this.config.breakpoints.lg) newBreakpoint = 'lg';
        else if (width >= this.config.breakpoints.md) newBreakpoint = 'md';
        else if (width >= this.config.breakpoints.sm) newBreakpoint = 'sm';

        if (newBreakpoint !== this.state.currentBreakpoint) {
            const oldBreakpoint = this.state.currentBreakpoint;
            this.state.currentBreakpoint = newBreakpoint;

            // Actualizar clases en body
            document.body.classList.remove(`breakpoint-${oldBreakpoint}`);
            document.body.classList.add(`breakpoint-${newBreakpoint}`);

            this.triggerEvent('breakpoint:change', {
                from: oldBreakpoint,
                to: newBreakpoint,
                width
            });
        }
    }

    /**
     * 🎯 Inicializar componentes
     */
    initializeComponents() {
        // Inicializar botones con ripple effect
        this.initializeRippleButtons();
        
        // Inicializar tooltips responsive
        this.initializeTooltips();

        // Inicializar modales responsive
        this.initializeModals();

        // Configurar smooth scroll
        this.setupSmoothScroll();
    }

    /**
     * ⭕ Inicializar efecto ripple en botones
     */
    initializeRippleButtons() {
        document.querySelectorAll('.btn-touch').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.state.prefersReducedMotion) {
                    this.createRippleEffect(btn, e);
                }
            });
        });
    }

    /**
     * ⭕ Crear efecto ripple
     */
    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * 💬 Inicializar tooltips responsive
     */
    initializeTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            this.setupTooltip(element);
        });
    }

    /**
     * 🎭 Inicializar modales responsive
     */
    initializeModals() {
        document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modalTrigger;
                this.openModal(modalId);
            });
        });
    }

    /**
     * 🔗 Configurar smooth scroll
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    e.preventDefault();
                    this.smoothScrollTo(target);
                }
            });
        });
    }

    /**
     * 🔗 Smooth scroll a elemento
     */
    smoothScrollTo(target) {
        const offset = 80; // Para header fijo
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * 📱 Obtener breakpoint actual
     */
    getCurrentBreakpoint() {
        return this.state.currentBreakpoint;
    }

    /**
     * 📱 Verificar si es mobile
     */
    isMobile() {
        return ['xs', 'sm'].includes(this.state.currentBreakpoint);
    }

    /**
     * 📱 Verificar si es tablet
     */
    isTablet() {
        return this.state.currentBreakpoint === 'md';
    }

    /**
     * 🖥️ Verificar si es desktop
     */
    isDesktop() {
        return ['lg', 'xl', 'xxl'].includes(this.state.currentBreakpoint);
    }

    /**
     * 🎭 Eventos personalizados
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    }

    off(event, callback) {
        if (this.events.has(event)) {
            const callbacks = this.events.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    triggerEvent(event, data = {}) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error en callback de evento ${event}:`, error);
                }
            });
        }
    }

    /**
     * 📊 Obtener información del sistema
     */
    getSystemInfo() {
        return {
            ...this.state,
            config: this.config
        };
    }

    /**
     * 🧹 Limpiar recursos
     */
    destroy() {
        // Limpiar observers
        this.state.observers.forEach(observer => observer.disconnect());
        this.state.observers.clear();

        // Limpiar event listeners
        this.events.clear();

        // Limpiar touches
        this.state.touches.clear();

        console.log('🧹 ResponsiveDesignSystem limpiado');
    }
}

// 🚀 Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    window.ResponsiveDesignSystem = new ResponsiveDesignSystem();
});

// 📤 Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveDesignSystem;
}