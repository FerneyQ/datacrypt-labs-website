/**
 * ⚡ DataCrypt Labs - Performance Optimizer
 * Advanced performance optimization system with lazy loading,
 * resource hints, compression, and intelligent caching
 */

class PerformanceOptimizer {
    constructor() {
        this.isOptimized = false;
        this.observedElements = new Set();
        this.resourceHints = new Set();
        this.lazyImages = [];
        this.performanceMetrics = {};
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.implementLazyLoading();
        this.addResourceHints();
        this.optimizeImages();
        this.implementCodeSplitting();
        this.setupPerformanceMonitoring();
        this.enableCompressionHeaders();
        
        
        this.isOptimized = true;
    }

    setupIntersectionObserver() {
        // Lazy loading observer with optimized settings
        this.lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadLazyElement(entry.target);
                    this.lazyObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Performance observer for animations
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.2
        });
    }

    implementLazyLoading() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Lazy load sections
        this.lazyLoadSections();
        
        // Lazy load scripts
        this.lazyLoadScripts();
        
        // Lazy load styles
        this.lazyLoadStyles();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        images.forEach(img => {
            // Add placeholder if not present
            if (!img.src && !img.dataset.src) return;
            
            // Create low-quality placeholder
            if (img.dataset.src && !img.src) {
                img.src = this.generatePlaceholder(img);
                img.classList.add('lazy-loading');
            }
            
            this.lazyObserver.observe(img);
            this.lazyImages.push(img);
        });
    }

    lazyLoadSections() {
        const sections = document.querySelectorAll('.lazy-section, .animate-on-scroll');
        
        sections.forEach(section => {
            this.animationObserver.observe(section);
        });
    }

    lazyLoadScripts() {
        const scripts = document.querySelectorAll('script[data-src]');
        
        scripts.forEach(script => {
            const triggerElement = document.querySelector(script.dataset.trigger) || document.body;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadScript(script.dataset.src).then(() => {
                            script.dispatchEvent(new Event('load'));
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(triggerElement);
        });
    }

    lazyLoadStyles() {
        const styles = document.querySelectorAll('link[data-href]');
        
        styles.forEach(link => {
            const triggerElement = document.querySelector(link.dataset.trigger) || document.body;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        link.href = link.dataset.href;
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(triggerElement);
        });
    }

    loadLazyElement(element) {
        if (element.tagName === 'IMG') {
            this.loadLazyImage(element);
        } else if (element.classList.contains('lazy-section')) {
            this.loadLazySection(element);
        }
    }

    loadLazyImage(img) {
        const src = img.dataset.src || img.src;
        
        if (src && src !== img.src) {
            const newImg = new Image();
            
            newImg.onload = () => {
                img.src = src;
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
                
                // Trigger custom event
                img.dispatchEvent(new CustomEvent('lazyLoaded'));
            };
            
            newImg.onerror = () => {
                img.classList.add('lazy-error');
            };
            
            newImg.src = src;
        }
    }

    loadLazySection(section) {
        // Load section content
        const content = section.dataset.content;
        if (content) {
            fetch(content)
                .then(response => response.text())
                .then(html => {
                    section.innerHTML = html;
                    section.classList.add('loaded');
                })
                .catch(error => {
                    
                    section.classList.add('error');
                });
        }
    }

    generatePlaceholder(img) {
        const width = img.dataset.width || 400;
        const height = img.dataset.height || 300;
        
        // Generate SVG placeholder
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#ccc">Loading...</text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
            { rel: 'prefetch', href: '/assets/css/main.css' },
            { rel: 'prefetch', href: '/assets/js/datacrypt.js' }
        ];

        hints.forEach(hint => {
            if (!this.resourceHints.has(hint.href)) {
                const link = document.createElement('link');
                Object.assign(link, hint);
                document.head.appendChild(link);
                this.resourceHints.add(hint.href);
            }
        });
    }

    optimizeImages() {
        // Convert images to WebP where supported
        if (this.supportsWebP()) {
            this.convertToWebP();
        }
        
        // Implement responsive images
        this.implementResponsiveImages();
        
        // Add image compression hints
        this.addImageCompressionHints();
    }

    supportsWebP() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    async convertToWebP() {
        const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]');
        
        for (const img of images) {
            const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/, '.webp');
            
            // Check if WebP version exists
            try {
                const response = await fetch(webpSrc, { method: 'HEAD' });
                if (response.ok) {
                    img.src = webpSrc;
                }
            } catch (error) {
                // WebP version doesn't exist, keep original
            }
        }
    }

    implementResponsiveImages() {
        const images = document.querySelectorAll('img:not([srcset])');
        
        images.forEach(img => {
            const src = img.src;
            if (!src) return;
            
            const baseSrc = src.replace(/\.[^/.]+$/, '');
            const ext = src.split('.').pop();
            
            // Generate srcset for different screen sizes
            const srcset = [
                `${baseSrc}-400w.${ext} 400w`,
                `${baseSrc}-800w.${ext} 800w`,
                `${baseSrc}-1200w.${ext} 1200w`,
                `${baseSrc}-1600w.${ext} 1600w`
            ].join(', ');
            
            img.srcset = srcset;
            img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
        });
    }

    addImageCompressionHints() {
        // Add image optimization headers
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    implementCodeSplitting() {
        // Dynamic import for non-critical features
        this.splitNonCriticalCode();
        
        // Lazy load feature modules
        this.lazyLoadFeatures();
    }

    splitNonCriticalCode() {
        // Defer non-critical JavaScript
        const nonCriticalScripts = [
            'analytics',
            'social-widgets',
            'chat-widget',
            'third-party-integrations'
        ];

        nonCriticalScripts.forEach(scriptType => {
            const elements = document.querySelectorAll(`[data-type="${scriptType}"]`);
            elements.forEach(element => {
                this.lazyObserver.observe(element);
            });
        });
    }

    lazyLoadFeatures() {
        // Load features on demand
        const features = {
            'dataWizardGame': () => import('./data-wizard-game.js'),
            'themeSystem': () => import('./theme-system.js'),
            'translationSystem': () => import('./translations.js'),
            'pwaManager': () => import('./pwa-manager.js')
        };

        Object.entries(features).forEach(([featureName, loader]) => {
            const trigger = document.querySelector(`[data-feature="${featureName}"]`);
            if (trigger) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loader().then(module => {
                                
                            }).catch(error => {
                                
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                });
                observer.observe(trigger);
            }
        });
    }

    async loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupPerformanceMonitoring() {
        // Web Vitals monitoring
        this.monitorWebVitals();
        
        // Resource timing
        this.monitorResourceTiming();
        
        // Custom metrics
        this.setupCustomMetrics();
    }

    monitorWebVitals() {
        // First Contentful Paint
        new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.performanceMetrics.fcp = entry.startTime;
                    
                }
            });
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                this.performanceMetrics.lcp = entry.startTime;
                
            });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
            let cls = 0;
            list.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            });
            this.performanceMetrics.cls = cls;
            
        }).observe({ entryTypes: ['layout-shift'] });
    }

    monitorResourceTiming() {
        new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.duration > 1000) {
                    
                }
            });
        }).observe({ entryTypes: ['resource'] });
    }

    setupCustomMetrics() {
        // Time to Interactive estimation
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.entryType === 'navigation') {
                    this.performanceMetrics.tti = entry.loadEventEnd - entry.navigationStart;
                    
                }
            });
        });
        observer.observe({ entryTypes: ['navigation'] });
    }

    enableCompressionHeaders() {
        // Add compression hints for browsers
        if ('serviceWorker' in navigator) {
            // Service worker will handle compression
            return;
        }

        // Fallback: add meta tags for compression
        const compressionMeta = document.createElement('meta');
        compressionMeta.httpEquiv = 'Content-Encoding';
        compressionMeta.content = 'gzip, deflate, br';
        document.head.appendChild(compressionMeta);
    }

    // Public API for external optimization
    optimizeElement(element) {
        if (element.tagName === 'IMG') {
            this.lazyObserver.observe(element);
        } else {
            this.animationObserver.observe(element);
        }
    }

    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            isOptimized: this.isOptimized,
            lazyImagesLoaded: this.lazyImages.filter(img => img.classList.contains('lazy-loaded')).length,
            totalLazyImages: this.lazyImages.length
        };
    }

    // Cleanup method
    destroy() {
        this.lazyObserver?.disconnect();
        this.animationObserver?.disconnect();
        this.observedElements.clear();
        this.lazyImages.length = 0;
        this.isOptimized = false;
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.performanceOptimizer = new PerformanceOptimizer();
    });
} else {
    window.performanceOptimizer = new PerformanceOptimizer();
}

// Export for external use
window.PerformanceOptimizer = PerformanceOptimizer;
