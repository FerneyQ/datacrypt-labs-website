/**
 * ✨ AESTHETIC MICROINTERACTIONS SYSTEM v2.1
 * Sistema JavaScript para microinteracciones y estética avanzada
 * 
 * Filosofía Mejora Continua v2.1:
 * - Feedback visual intuitivo
 * - Animaciones performantes
 * - Interacciones naturales
 * - Accesibilidad prioritaria
 * - UX excepcional
 */

class AestheticMicrointeractions {
    constructor() {
        this.config = {
            name: 'AestheticMicrointeractions',
            version: '2.1',
            animations: {
                enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                duration: {
                    instant: 50,
                    fast: 150,
                    normal: 300,
                    slow: 500,
                    slower: 800
                }
            },
            intersection: {
                threshold: 0.1,
                rootMargin: '50px'
            },
            ripple: {
                duration: 600,
                maxSize: 200
            },
            toast: {
                duration: 4000,
                maxStack: 5
            }
        };

        this.state = {
            toasts: [],
            animations: new Map(),
            observers: new Map(),
            ripples: new Set(),
            particles: new Map(),
            isInitialized: false
        };

        this.init();
    }

    /**
     * 🚀 Inicialización del sistema
     */
    async init() {
        try {
            // Detectar capacidades del dispositivo
            await this.detectCapabilities();
            this.setupIntersectionObservers();
            this.initializeComponents();
            this.setupEventListeners();
            this.createToastContainer();
            this.initializeProgressBars();
            this.setupFormEnhancements();
            this.initializeParticleEffects();

            // Integración con ConfigManager
            if (window.ConfigManager) {
                window.ConfigManager.set('aestheticSystem', this);
            }

            this.state.isInitialized = true;
            this.triggerEvent('system:ready');

        } catch (error) {
            if (window.ContinuousMonitoring) {
                window.ContinuousMonitoring.logError('AestheticMicrointeractions', 'init', error);
            }
        }
    }

    /**
     * 🔍 Detectar capacidades del dispositivo
     */
    async detectCapabilities() {
        this.capabilities = {
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            highContrast: window.matchMedia('(prefers-contrast: high)').matches,
            touchDevice: 'ontouchstart' in window,
            webGL: this.detectWebGL(),
            intersectionObserver: 'IntersectionObserver' in window,
            performanceObserver: 'PerformanceObserver' in window
        };

        // Actualizar configuración basada en capacidades
        if (this.capabilities.reducedMotion) {
            this.config.animations.enabled = false;
            this.config.animations.duration = {
                instant: 1,
                fast: 1,
                normal: 1,
                slow: 1,
                slower: 1
            };
        }
    }

    /**
     * 🌐 Detectar WebGL
     */
    detectWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }

    /**
     * 👁️ Configurar Intersection Observers
     */
    setupIntersectionObservers() {
        if (!this.capabilities.intersectionObserver) return;

        // Observer para animaciones de entrada
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateIn(entry.target);
                }
            });
        }, this.config.intersection);

        // Observer para contadores animados
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, this.config.intersection);

        // Observer para barras de progreso
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgress(entry.target);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, this.config.intersection);

        this.state.observers.set('animation', animationObserver);
        this.state.observers.set('counter', counterObserver);
        this.state.observers.set('progress', progressObserver);

        // Observar elementos existentes
        this.observeElements();
    }

    /**
     * 👁️ Observar elementos para animaciones
     */
    observeElements() {
        const animationObserver = this.state.observers.get('animation');
        const counterObserver = this.state.observers.get('counter');
        const progressObserver = this.state.observers.get('progress');

        // Elementos para animación de entrada
        document.querySelectorAll('.fade-in, .slide-in-up, .slide-in-down, .slide-in-left, .slide-in-right, .scale-in, .zoom-in').forEach(el => {
            if (animationObserver) animationObserver.observe(el);
        });

        // Contadores animados
        document.querySelectorAll('[data-counter]').forEach(el => {
            if (counterObserver) counterObserver.observe(el);
        });

        // Barras de progreso
        document.querySelectorAll('.progress-modern').forEach(el => {
            if (progressObserver) progressObserver.observe(el);
        });
    }

    /**
     * 🎭 Inicializar componentes
     */
    initializeComponents() {
        this.initializeButtons();
        this.initializeCards();
        this.initializeModals();
        this.initializeFAB();
        this.initializeTooltips();
        this.setupHoverEffects();
    }

    /**
     * 🎯 Inicializar botones con efectos
     */
    initializeButtons() {
        // Ripple effect
        document.querySelectorAll('.btn-ripple, .btn-microinteraction').forEach(btn => {
            btn.addEventListener('click', (e) => this.createRipple(btn, e));
        });

        // Hover effects
        document.querySelectorAll('.btn-microinteraction').forEach(btn => {
            this.setupButtonHover(btn);
        });
    }

    /**
     * 🌊 Crear efecto ripple
     */
    createRipple(element, event) {
        if (!this.config.animations.enabled) return;

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        element.appendChild(ripple);
        this.state.ripples.add(ripple);

        // Limpiar después de la animación
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
            this.state.ripples.delete(ripple);
        }, this.config.ripple.duration);
    }

    /**
     * 🎯 Configurar hover de botón
     */
    setupButtonHover(button) {
        button.addEventListener('mouseenter', () => {
            if (this.config.animations.enabled) {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = 'var(--shadow-lg)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (this.config.animations.enabled) {
                button.style.transform = '';
                button.style.boxShadow = '';
            }
        });

        button.addEventListener('mousedown', () => {
            if (this.config.animations.enabled) {
                button.style.transform = 'translateY(0)';
            }
        });

        button.addEventListener('mouseup', () => {
            if (this.config.animations.enabled) {
                button.style.transform = 'translateY(-2px)';
            }
        });
    }

    /**
     * 🃏 Inicializar tarjetas interactivas
     */
    initializeCards() {
        document.querySelectorAll('.card-interactive').forEach(card => {
            this.setupCardInteractions(card);
        });
    }

    /**
     * 🃏 Configurar interacciones de tarjeta
     */
    setupCardInteractions(card) {
        if (!this.config.animations.enabled) return;

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.background = 'rgba(255, 255, 255, 0.08)';
            card.style.boxShadow = 'var(--shadow-xl)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.background = '';
            card.style.boxShadow = '';
        });

        card.addEventListener('click', () => {
            this.triggerCardClick(card);
        });
    }

    /**
     * 🃏 Trigger click de tarjeta
     */
    triggerCardClick(card) {
        if (!this.config.animations.enabled) return;

        card.style.transform = 'translateY(-4px) scale(0.98)';

        setTimeout(() => {
            card.style.transform = 'translateY(-8px)';
        }, 150);

        // Efecto de onda
        this.createCardWave(card);
    }

    /**
     * 🌊 Crear onda en tarjeta
     */
    createCardWave(card) {
        const wave = document.createElement('div');
        wave.style.position = 'absolute';
        wave.style.top = '0';
        wave.style.left = '0';
        wave.style.right = '0';
        wave.style.height = '2px';
        wave.style.background = 'var(--gradient-cosmic)';
        wave.style.transform = 'scaleX(0)';
        wave.style.transformOrigin = 'left';
        wave.style.transition = 'transform 0.3s ease-out';

        card.style.position = 'relative';
        card.appendChild(wave);

        requestAnimationFrame(() => {
            wave.style.transform = 'scaleX(1)';
        });

        setTimeout(() => {
            if (wave.parentNode) {
                wave.parentNode.removeChild(wave);
            }
        }, 300);
    }

    /**
     * 🎭 Inicializar modales
     */
    initializeModals() {
        document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modalTrigger;
                this.openModal(modalId);
            });
        });

        document.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        });
    }

    /**
     * 🎭 Abrir modal
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Accesibilidad
        modal.setAttribute('aria-hidden', 'false');
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();

        this.triggerEvent('modal:open', { modalId });
    }

    /**
     * 🎭 Cerrar modal
     */
    closeModal() {
        const activeModal = document.querySelector('.modal-backdrop.show');
        if (!activeModal) return;

        activeModal.classList.remove('show');
        document.body.style.overflow = '';

        // Accesibilidad
        activeModal.setAttribute('aria-hidden', 'true');

        this.triggerEvent('modal:close');
    }

    /**
     * 🎯 Inicializar FAB
     */
    initializeFAB() {
        // Selector más específico para evitar conflicto con iconos Font Awesome
        const fab = document.querySelector('.floating-action-btn, .fab-button, button.fab');
        if (!fab) return;

        fab.addEventListener('click', () => {
            this.triggerFABClick(fab);
        });

        // Ocultar/mostrar en scroll
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                fab.style.transform = 'translateY(100px)';
            } else {
                // Scrolling up
                fab.style.transform = '';
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    /**
     * 🎯 Click en FAB
     */
    triggerFABClick(fab) {
        if (!this.config.animations.enabled) return;

        // Animación de click
        fab.style.transform = 'translateY(-2px) scale(1.05)';

        setTimeout(() => {
            fab.style.transform = '';
        }, 150);

        // Crear onda expansiva
        this.createFABWave(fab);
    }

    /**
     * 🌊 Crear onda en FAB
     */
    createFABWave(fab) {
        const wave = document.createElement('div');
        wave.style.position = 'absolute';
        wave.style.top = '50%';
        wave.style.left = '50%';
        wave.style.width = '0';
        wave.style.height = '0';
        wave.style.borderRadius = '50%';
        wave.style.border = '2px solid var(--accent-primary)';
        wave.style.transform = 'translate(-50%, -50%)';
        wave.style.transition = 'all 0.6s ease-out';
        wave.style.pointerEvents = 'none';

        fab.style.position = 'relative';
        fab.appendChild(wave);

        requestAnimationFrame(() => {
            wave.style.width = '120px';
            wave.style.height = '120px';
            wave.style.opacity = '0';
        });

        setTimeout(() => {
            if (wave.parentNode) {
                wave.parentNode.removeChild(wave);
            }
        }, 600);
    }

    /**
     * 💬 Crear contenedor de toast
     */
    createToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '1000';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '10px';
            document.body.appendChild(container);
        }
    }

    /**
     * 💬 Mostrar toast
     */
    showToast(message, type = 'info', duration = this.config.toast.duration) {
        if (this.state.toasts.length >= this.config.toast.maxStack) {
            this.hideToast(this.state.toasts[0]);
        }

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;

        const container = document.getElementById('toast-container');
        container.appendChild(toast);

        this.state.toasts.push(toast);

        // Mostrar con animación
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-hide
        const timeoutId = setTimeout(() => {
            this.hideToast(toast);
        }, duration);

        // Click para cerrar
        toast.addEventListener('click', () => {
            clearTimeout(timeoutId);
            this.hideToast(toast);
        });

        this.triggerEvent('toast:show', { message, type });
        return toast;
    }

    /**
     * 💬 Ocultar toast
     */
    hideToast(toast) {
        if (!toast || !toast.parentNode) return;

        toast.classList.remove('show');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            const index = this.state.toasts.indexOf(toast);
            if (index > -1) {
                this.state.toasts.splice(index, 1);
            }
        }, 300);

        this.triggerEvent('toast:hide');
    }

    /**
     * 📊 Animar contador
     */
    animateCounter(element) {
        if (!this.config.animations.enabled) return;

        const target = parseInt(element.dataset.counter) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);

        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    /**
     * 📊 Animar barra de progreso
     */
    animateProgress(element) {
        if (!this.config.animations.enabled) return;

        const target = parseInt(element.dataset.progress) || 0;
        const duration = parseInt(element.dataset.duration) || 1500;

        element.style.setProperty('--progress', '0%');

        requestAnimationFrame(() => {
            element.style.transition = `--progress ${duration}ms ease-out`;
            element.style.setProperty('--progress', `${target}%`);
        });
    }

    /**
     * 🎭 Animar entrada de elemento
     */
    animateIn(element) {
        if (!this.config.animations.enabled) {
            element.style.opacity = '1';
            return;
        }

        const animationType = this.getAnimationType(element);
        const delay = parseInt(element.dataset.delay) || 0;

        setTimeout(() => {
            element.classList.add(`animate-${animationType}`);
        }, delay);
    }

    /**
     * 🎭 Obtener tipo de animación
     */
    getAnimationType(element) {
        if (element.classList.contains('fade-in')) return 'fadeIn';
        if (element.classList.contains('slide-in-up')) return 'slideInUp';
        if (element.classList.contains('slide-in-down')) return 'slideInDown';
        if (element.classList.contains('slide-in-left')) return 'slideInLeft';
        if (element.classList.contains('slide-in-right')) return 'slideInRight';
        if (element.classList.contains('scale-in')) return 'scaleIn';
        if (element.classList.contains('zoom-in')) return 'zoomIn';
        return 'fadeIn';
    }

    /**
     * 📊 Inicializar barras de progreso
     */
    initializeProgressBars() {
        document.querySelectorAll('.progress-modern').forEach(progress => {
            const value = parseInt(progress.dataset.progress) || 0;
            progress.style.setProperty('--progress', `${value}%`);
        });
    }

    /**
     * 📝 Configurar mejoras de formularios
     */
    setupFormEnhancements() {
        document.querySelectorAll('.form-input-advanced').forEach(input => {
            this.enhanceFormInput(input);
        });
    }

    /**
     * 📝 Mejorar input de formulario
     */
    enhanceFormInput(input) {
        input.addEventListener('focus', () => {
            const parent = input.closest('.form-group-advanced');
            if (parent) parent.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            const parent = input.closest('.form-group-advanced');
            if (parent) parent.classList.remove('focused');
        });

        input.addEventListener('input', () => {
            const parent = input.closest('.form-group-advanced');
            if (parent) {
                if (input.value) {
                    parent.classList.add('has-value');
                } else {
                    parent.classList.remove('has-value');
                }
            }
        });
    }

    /**
     * ✨ Inicializar efectos de partículas
     */
    initializeParticleEffects() {
        document.querySelectorAll('.particle-background').forEach(element => {
            this.createParticleEffect(element);
        });
    }

    /**
     * ✨ Crear efecto de partículas
     */
    createParticleEffect(container) {
        if (!this.config.animations.enabled || !this.capabilities.webGL) return;

        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'rgba(59, 130, 246, 0.3)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';

            container.appendChild(particle);
            particles.push({
                element: particle,
                x: Math.random() * container.offsetWidth,
                y: Math.random() * container.offsetHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        this.state.particles.set(container, particles);
        this.animateParticles(container);
    }

    /**
     * ✨ Animar partículas
     */
    animateParticles(container) {
        const particles = this.state.particles.get(container);
        if (!particles) return;

        const animate = () => {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > container.offsetWidth) particle.vx *= -1;
                if (particle.y < 0 || particle.y > container.offsetHeight) particle.vy *= -1;

                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
            });

            if (this.config.animations.enabled) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * 🎯 Configurar event listeners
     */
    setupEventListeners() {
        // Preferencias de movimiento
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.config.animations.enabled = !e.matches;
            this.updateAnimationPreferences();
        });

        // Escape para cerrar modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Click fuera del modal para cerrar
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeModal();
            }
        });
    }

    /**
     * 🎨 Configurar efectos hover
     */
    setupHoverEffects() {
        if (this.capabilities.touchDevice) return;

        document.querySelectorAll('.hover-lift').forEach(el => {
            this.setupHoverLift(el);
        });

        document.querySelectorAll('.hover-scale').forEach(el => {
            this.setupHoverScale(el);
        });

        document.querySelectorAll('.hover-glow').forEach(el => {
            this.setupHoverGlow(el);
        });
    }

    /**
     * 🎨 Configurar hover lift
     */
    setupHoverLift(element) {
        element.addEventListener('mouseenter', () => {
            if (this.config.animations.enabled) {
                element.style.transform = 'translateY(-4px)';
                element.style.boxShadow = 'var(--shadow-lg)';
            }
        });

        element.addEventListener('mouseleave', () => {
            if (this.config.animations.enabled) {
                element.style.transform = '';
                element.style.boxShadow = '';
            }
        });
    }

    /**
     * 🎨 Configurar hover scale
     */
    setupHoverScale(element) {
        element.addEventListener('mouseenter', () => {
            if (this.config.animations.enabled) {
                element.style.transform = 'scale(1.05)';
            }
        });

        element.addEventListener('mouseleave', () => {
            if (this.config.animations.enabled) {
                element.style.transform = '';
            }
        });
    }

    /**
     * 🎨 Configurar hover glow
     */
    setupHoverGlow(element) {
        element.addEventListener('mouseenter', () => {
            if (this.config.animations.enabled) {
                element.style.boxShadow = 'var(--glow-lg)';
            }
        });

        element.addEventListener('mouseleave', () => {
            if (this.config.animations.enabled) {
                element.style.boxShadow = '';
            }
        });
    }

    /**
     * 🔄 Actualizar preferencias de animación
     */
    updateAnimationPreferences() {
        const elements = document.querySelectorAll('.animate-float, .animate-pulse, .animate-bounce');
        elements.forEach(el => {
            if (this.config.animations.enabled) {
                el.style.animationPlayState = 'running';
            } else {
                el.style.animationPlayState = 'paused';
            }
        });
    }

    /**
     * 🎭 Sistema de eventos
     */
    triggerEvent(eventName, data = {}) {
        const event = new CustomEvent(`aesthetic:${eventName}`, {
            detail: { ...data, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    /**
     * 📊 API pública para otros sistemas
     */

    // Mostrar notificación
    notify(message, type = 'info') {
        return this.showToast(message, type);
    }

    // Animar elemento
    animate(element, animation) {
        if (!this.config.animations.enabled) return;
        element.classList.add(`animate-${animation}`);
    }

    // Crear efecto ripple en elemento específico
    ripple(element, event) {
        this.createRipple(element, event);
    }

    // Obtener estado del sistema
    getState() {
        return {
            ...this.state,
            config: this.config,
            capabilities: this.capabilities
        };
    }

    /**
     * 🔧 Corregir transforms problemáticos en iconos sociales
     */
    fixSocialIconsTransform() {
        // Seleccionar todos los iconos Font Awesome en contenedores sociales
        const socialIcons = document.querySelectorAll('.social-icons i.fab, .social-links i.fab');

        socialIcons.forEach(icon => {
            // Limpiar cualquier transform inline problemático
            if (icon.style.transform && icon.style.transform.includes('translateY(100px)')) {
                icon.style.transform = '';
            }
        });

        // Observador para prevenir futuros cambios problemáticos
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.classList.contains('fab') &&
                        target.closest('.social-icons, .social-links') &&
                        target.style.transform &&
                        target.style.transform.includes('translateY(100px)')) {
                        target.style.transform = '';
                    }
                }
            });
        });

        // Observar cambios en iconos sociales
        socialIcons.forEach(icon => {
            observer.observe(icon, {
                attributes: true,
                attributeFilter: ['style']
            });
        });
    }

    /**
     * 🧹 Limpiar recursos
     */
    destroy() {
        // Limpiar observers
        this.state.observers.forEach(observer => observer.disconnect());
        this.state.observers.clear();

        // Limpiar partículas
        this.state.particles.forEach((particles, container) => {
            particles.forEach(particle => {
                if (particle.element.parentNode) {
                    particle.element.parentNode.removeChild(particle.element);
                }
            });
        });
        this.state.particles.clear();

        // Limpiar toasts
        this.state.toasts.forEach(toast => this.hideToast(toast));

        // Limpiar ripples
        this.state.ripples.forEach(ripple => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        });
        this.state.ripples.clear();
    }
}

// 🚀 Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    window.AestheticMicrointeractions = new AestheticMicrointeractions();

    // Corregir bugs visuales después de la inicialización
    setTimeout(() => {
        if (window.AestheticMicrointeractions) {
            window.AestheticMicrointeractions.fixSocialIconsTransform();
        }
    }, 100);
});

// 📤 Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AestheticMicrointeractions;
}
