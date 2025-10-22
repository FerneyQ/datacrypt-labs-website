/**
 * 🎨 INTELLIGENT VISUAL SYSTEM v2.1
 * Sistema visual inteligente con carga optimizada y fallbacks
 * 
 * Filosofía Mejora Continua v2.1:
 * - Carga inteligente de recursos visuales
 * - Fallbacks automáticos y graceful degradation
 * - Optimización de performance visual
 * - Responsive images y lazy loading
 */

class IntelligentVisualSystem {
    constructor() {
        this.loadedImages = new Map();
        this.fallbackImages = new Map();
        this.observers = new Map();
        this.imageCache = new Map();
        this.loadingQueue = [];
        this.isInitialized = false;
        
        // Configuración del sistema
        this.config = {
            lazyLoadThreshold: '50px',
            maxRetries: 3,
            retryDelay: 1000,
            cacheDuration: 1000 * 60 * 60, // 1 hora
            placeholderColor: '#f0f0f0',
            enableWebP: true,
            enableResponsive: true
        };
        
        this.init();
    }

    /**
     * 🚀 INICIALIZACIÓN DEL SISTEMA
     */
    async init() {
        
        
        try {
            // 1. Detectar capacidades del navegador
            await this.detectBrowserCapabilities();
            
            // 2. Configurar observadores de intersección
            this.setupIntersectionObservers();
            
            // 3. Configurar fallbacks por defecto
            this.setupDefaultFallbacks();
            
            // 4. Procesar imágenes existentes
            await this.processExistingImages();
            
            // 5. Configurar responsive images
            this.setupResponsiveImages();
            
            this.isInitialized = true;
            
            
            // Notificar al chatbot
            if (window.dataCryptChatbot) {
                window.dataCryptChatbot.addMessage(
                    '🎨 Sistema visual inteligente activado - Optimización de imágenes en curso',
                    'assistant'
                );
            }
            
        } catch (error) {
            
            this.handleSystemError(error);
        }
    }

    /**
     * 🔍 DETECTAR CAPACIDADES DEL NAVEGADOR
     */
    async detectBrowserCapabilities() {
        // Detectar soporte WebP
        this.supportsWebP = await this.checkWebPSupport();
        
        // Detectar soporte para lazy loading nativo
        this.supportsNativeLazyLoading = 'loading' in HTMLImageElement.prototype;
        
        // Detectar soporte para intersection observer
        this.supportsIntersectionObserver = 'IntersectionObserver' in window;
        
        // Detectar conexión de red
        this.detectNetworkConnection();
    }

    /**
     * 🌐 VERIFICAR SOPORTE WEBP
     */
    async checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    /**
     * 📶 DETECTAR CONEXIÓN DE RED
     */
    detectNetworkConnection() {
        if ('connection' in navigator) {
            this.networkInfo = {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                saveData: navigator.connection.saveData
            };
        } else {
            this.networkInfo = { effectiveType: '4g', downlink: 10, saveData: false };
        }
    }

    /**
     * 👀 CONFIGURAR OBSERVADORES DE INTERSECCIÓN
     */
    setupIntersectionObservers() {
        if (!this.supportsIntersectionObserver) return;

        // Observer para lazy loading
        this.lazyLoadObserver = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                rootMargin: this.config.lazyLoadThreshold,
                threshold: 0.1
            }
        );

        // Observer para animaciones
        this.animationObserver = new IntersectionObserver(
            (entries) => this.handleAnimationIntersection(entries),
            {
                rootMargin: '0px',
                threshold: 0.3
            }
        );
    }

    /**
     * 🔧 CONFIGURAR FALLBACKS POR DEFECTO
     */
    setupDefaultFallbacks() {
        // Fallback para logo
        this.fallbackImages.set('logo', this.generatePlaceholderSVG(200, 80, 'DataCrypt Labs'));
        
        // Fallback para imágenes de portafolio
        for (let i = 1; i <= 7; i++) {
            this.fallbackImages.set(`portfolio-${i}`, 
                this.generatePlaceholderSVG(400, 300, `Proyecto ${i}`)
            );
        }
        
        // Fallback genérico
        this.fallbackImages.set('default', 
            this.generatePlaceholderSVG(300, 200, 'Imagen no disponible')
        );
    }

    /**
     * 🖼️ GENERAR PLACEHOLDER SVG
     */
    generatePlaceholderSVG(width, height, text = '') {
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.1" />
                        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad)" stroke="#e5e7eb" stroke-width="2"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                      fill="#6b7280" font-family="Arial, sans-serif" font-size="14">
                    ${text}
                </text>
                <circle cx="50%" cy="35%" r="20" fill="#3b82f6" opacity="0.3"/>
                <rect x="30%" y="60%" width="40%" height="4" fill="#3b82f6" opacity="0.3" rx="2"/>
                <rect x="25%" y="70%" width="50%" height="3" fill="#8b5cf6" opacity="0.2" rx="1.5"/>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    /**
     * 🔄 PROCESAR IMÁGENES EXISTENTES
     */
    async processExistingImages() {
        const images = document.querySelectorAll('img');
        
        
        for (const img of images) {
            await this.processImage(img);
        }
    }

    /**
     * 🖼️ PROCESAR IMAGEN INDIVIDUAL
     */
    async processImage(img, options = {}) {
        try {
            // 1. Configurar placeholder inmediato
            this.setPlaceholder(img);
            
            // 2. Determinar URL optimizada
            const optimizedSrc = this.getOptimizedImageUrl(img.src || img.dataset.src);
            
            // 3. Configurar lazy loading
            if (this.shouldLazyLoad(img)) {
                this.setupLazyLoading(img, optimizedSrc);
            } else {
                await this.loadImageWithFallback(img, optimizedSrc);
            }
            
            // 4. Configurar responsive
            this.setupResponsiveImage(img);
            
            // 5. Añadir efectos de carga
            this.addLoadingEffects(img);
            
        } catch (error) {
            
            this.setFallbackImage(img);
        }
    }

    /**
     * 🔧 CONFIGURAR PLACEHOLDER
     */
    setPlaceholder(img) {
        if (!img.src && !img.dataset.src) return;
        
        // Añadir clases para styling
        img.classList.add('visual-loading');
        
        // Configurar placeholder mientras carga
        if (!img.src) {
            img.src = this.generatePlaceholderSVG(
                img.width || 300, 
                img.height || 200, 
                'Cargando...'
            );
        }
    }

    /**
     * 🎯 OBTENER URL OPTIMIZADA
     */
    getOptimizedImageUrl(originalSrc) {
        if (!originalSrc) return null;
        
        // Normalizar ruta
        let src = originalSrc;
        
        // Corregir rutas problemáticas
        if (src.includes('Material visual/')) {
            src = src.replace('Material visual/', 'Material%20visual/');
        }
        
        // Si soporta WebP y tenemos versión WebP, usarla
        if (this.supportsWebP && this.config.enableWebP) {
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            // En un caso real, verificaríamos si existe
            // Por ahora, usamos la original
        }
        
        return src;
    }

    /**
     * 🔍 DETERMINAR SI DEBE USAR LAZY LOADING
     */
    shouldLazyLoad(img) {
        // No lazy load si está en viewport inmediato
        const rect = img.getBoundingClientRect();
        const isInImmediateViewport = rect.top < window.innerHeight * 1.5;
        
        // No lazy load para imágenes críticas
        const isCritical = img.classList.contains('critical') || 
                          img.closest('.hero') || 
                          img.closest('.header');
        
        return !isInImmediateViewport && !isCritical && this.supportsIntersectionObserver;
    }

    /**
     * 🏃‍♂️ CONFIGURAR LAZY LOADING
     */
    setupLazyLoading(img, src) {
        img.dataset.src = src;
        img.classList.add('lazy-load');
        
        if (this.supportsNativeLazyLoading) {
            img.loading = 'lazy';
            img.src = src;
        } else {
            this.lazyLoadObserver.observe(img);
        }
    }

    /**
     * 📐 CONFIGURAR IMAGEN RESPONSIVE
     */
    setupResponsiveImage(img) {
        if (!this.config.enableResponsive) return;
        
        const src = img.src || img.dataset.src;
        if (!src) return;
        
        // Generar srcset para diferentes tamaños
        const baseSrc = src.replace(/\.[^/.]+$/, '');
        const ext = src.split('.').pop();
        
        // Configurar srcset (las imágenes deben existir en el servidor)
        const srcset = [
            `${src} 1x`,
            // En un caso real, tendríamos diferentes tamaños
            `${src} 2x`
        ].join(', ');
        
        img.srcset = srcset;
        img.sizes = this.calculateImageSizes(img);
    }

    /**
     * 📏 CALCULAR TAMAÑOS DE IMAGEN
     */
    calculateImageSizes(img) {
        const container = img.closest('.container');
        
        if (img.closest('.hero')) {
            return '100vw';
        } else if (img.closest('.portfolio-grid')) {
            return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
        } else if (container) {
            return '(max-width: 768px) 100vw, 80vw';
        }
        
        return '100vw';
    }

    /**
     * 🎭 AÑADIR EFECTOS DE CARGA
     */
    addLoadingEffects(img) {
        // Efecto shimmer mientras carga
        img.classList.add('image-shimmer');
        
        // Listener para cuando termine de cargar
        img.addEventListener('load', () => {
            img.classList.remove('visual-loading', 'image-shimmer', 'lazy-load');
            img.classList.add('visual-loaded');
            
            // Efecto de fade-in
            this.animateImageLoad(img);
        });
        
        img.addEventListener('error', () => {
            this.handleImageError(img);
        });
    }

    /**
     * ✨ ANIMAR CARGA DE IMAGEN
     */
    animateImageLoad(img) {
        img.style.opacity = '0';
        img.style.transform = 'scale(1.1)';
        
        requestAnimationFrame(() => {
            img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        });
    }

    /**
     * 🔄 CARGAR IMAGEN CON FALLBACK
     */
    async loadImageWithFallback(img, src, retryCount = 0) {
        try {
            await this.loadImage(src);
            img.src = src;
            
        } catch (error) {
            if (retryCount < this.config.maxRetries) {
                
                
                await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
                return this.loadImageWithFallback(img, src, retryCount + 1);
            } else {
                
                this.setFallbackImage(img);
            }
        }
    }

    /**
     * 📥 CARGAR IMAGEN (PROMESA)
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Error cargando: ${src}`));
            img.src = src;
        });
    }

    /**
     * 🔧 CONFIGURAR IMAGEN DE FALLBACK
     */
    setFallbackImage(img) {
        // Determinar tipo de fallback según contexto
        let fallbackKey = 'default';
        
        if (img.alt && img.alt.toLowerCase().includes('logo')) {
            fallbackKey = 'logo';
        } else if (img.closest('.portfolio')) {
            const index = Array.from(img.closest('.portfolio').parentElement.children).indexOf(img.closest('.portfolio')) + 1;
            fallbackKey = `portfolio-${index}`;
        }
        
        const fallbackSrc = this.fallbackImages.get(fallbackKey) || this.fallbackImages.get('default');
        img.src = fallbackSrc;
        img.classList.add('fallback-image');
    }

    /**
     * 👀 MANEJAR INTERSECCIÓN (LAZY LOADING)
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                
                if (src) {
                    this.loadImageWithFallback(img, src);
                    this.lazyLoadObserver.unobserve(img);
                }
            }
        });
    }

    /**
     * 🎬 MANEJAR INTERSECCIÓN DE ANIMACIONES
     */
    handleAnimationIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('animate-in-view');
            }
        });
    }

    /**
     * 🚨 MANEJAR ERROR DE IMAGEN
     */
    handleImageError(img) {
        
        this.setFallbackImage(img);
        
        // Reportar al sistema de monitoreo
        if (window.continuousMonitoring) {
            window.continuousMonitoring.reportError({
                type: 'IMAGE_LOAD_ERROR',
                src: img.src,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * 🔧 MANEJAR ERROR DEL SISTEMA
     */
    handleSystemError(error) {
        
        
        // Fallback a modo básico
        this.enableBasicMode();
        
        // Notificar al sistema de monitoreo
        if (window.continuousMonitoring) {
            window.continuousMonitoring.reportError({
                type: 'VISUAL_SYSTEM_ERROR',
                error: error.message,
                stack: error.stack
            });
        }
    }

    /**
     * 🏥 HABILITAR MODO BÁSICO
     */
    enableBasicMode() {
        
        
        // Procesar imágenes de forma básica
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.src) {
                this.setFallbackImage(img);
            }
        });
    }

    /**
     * 🔄 REFRESCAR IMAGEN
     */
    async refreshImage(img) {
        const originalSrc = img.dataset.originalSrc || img.src;
        img.classList.add('visual-loading');
        
        try {
            const newSrc = `${originalSrc}?refresh=${Date.now()}`;
            await this.loadImageWithFallback(img, newSrc);
            
        } catch (error) {
            
            this.setFallbackImage(img);
        }
    }

    /**
     * 📊 OBTENER ESTADÍSTICAS
     */
    getStats() {
        const totalImages = document.querySelectorAll('img').length;
        const loadedImages = document.querySelectorAll('img.visual-loaded').length;
        const fallbackImages = document.querySelectorAll('img.fallback-image').length;
        const loadingImages = document.querySelectorAll('img.visual-loading').length;
        
        return {
            total: totalImages,
            loaded: loadedImages,
            fallback: fallbackImages,
            loading: loadingImages,
            loadedPercentage: Math.round((loadedImages / totalImages) * 100),
            capabilities: {
                webP: this.supportsWebP,
                nativeLazyLoading: this.supportsNativeLazyLoading,
                intersectionObserver: this.supportsIntersectionObserver
            }
        };
    }

    /**
     * 🎨 OPTIMIZAR TODAS LAS IMÁGENES
     */
    async optimizeAllImages() {
        
        
        const images = document.querySelectorAll('img');
        const promises = Array.from(images).map(img => this.processImage(img));
        
        try {
            await Promise.allSettled(promises);
            
            
            return this.getStats();
            
        } catch (error) {
            
            throw error;
        }
    }
}

// 🎨 EXPORTAR PARA USO GLOBAL
window.IntelligentVisualSystem = IntelligentVisualSystem;

// 🔄 AUTO-INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    
    window.intelligentVisualSystem = new IntelligentVisualSystem();
});
