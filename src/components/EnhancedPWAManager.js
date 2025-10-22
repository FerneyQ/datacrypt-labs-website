/**
 * 📱 DataCrypt Labs - Enhanced PWA Manager v2.1
 * Filosofía Mejora Continua - PWA Manager migrado con ConfigManager
 * 
 * Sistema PWA mejorado con:
 * - Integración con ConfigManager  
 * - Backward compatibility total
 * - Tests integrados
 * - Performance optimizada
 */

class EnhancedPWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isOnline = navigator.onLine;
        this.registration = null;
        this.updateAvailable = false;
        this.isInitialized = false;
        this.configManager = null;
        this.originalAPI = null;
        
        this.init();
    }

    async init() {
        try {
            // Esperar a ConfigManager
            await this.waitForConfigManager();
            
            // Configurar referencias
            this.configManager = window.ConfigManager;
            
            // Migrar configuración existente
            await this.migrateExistingPWA();
            
            // Configurar compatibilidad
            this.setupBackwardCompatibility();
            
            // Check PWA support
            if (!this.isPWASupported()) {
                
                return;
            }

            // Inicializar componentes PWA
            await this.registerServiceWorker();
            this.setupInstallPrompt();
            this.setupUpdateNotification();
            this.setupOnlineStatus();
            this.createEnhancedPWAUI();
            
            this.isInitialized = true;
            
            
            this.dispatchPWAReady();
            
        } catch (error) {
            
            this.fallbackToOriginal();
        }
    }

    async waitForConfigManager() {
        const maxAttempts = 100;
        let attempts = 0;
        
        while (!window.ConfigManager && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
        }
        
        if (!window.ConfigManager) {
            throw new Error('ConfigManager not available');
        }
    }

    async migrateExistingPWA() {
        // Mantener referencia al sistema original si existe
        if (window.pwaManager) {
            
            this.originalAPI = window.pwaManager;
        }
    }

    setupBackwardCompatibility() {
        // Mantener API original para evitar breaking changes
        if (!window.pwaManager) {
            window.pwaManager = {};
        }

        // Mapear métodos antiguos a nueva implementación
        window.pwaManager.install = () => this.install();
        window.pwaManager.checkForUpdates = () => this.checkForUpdates();
        window.pwaManager.isInstalled = () => this.isInstalled();
        window.pwaManager.isOnline = () => this.isOnline;
        window.pwaManager.showInstallPrompt = () => this.showInstallPrompt();

        
    }

    isPWASupported() {
        return 'serviceWorker' in navigator && 'caches' in window;
    }

    async registerServiceWorker() {
        const config = this.configManager.getConfig('pwa');
        
        try {
            this.registration = await navigator.serviceWorker.register(config.serviceWorker.file, {
                scope: config.serviceWorker.scope
            });

            

            // Handle updates
            this.registration.addEventListener('updatefound', () => {
                const newWorker = this.registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.updateAvailable = true;
                        this.showUpdateNotification();
                    }
                });
            });

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                this.handleServiceWorkerMessage(event);
            });

        } catch (error) {
            
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
            
            
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            this.hideInstallButton();
            this.showInstalledMessage();
            this.trackInstallation();
            
            // Notificar al chatbot
            this.notifyChatbotInstallation();
        });
    }

    setupUpdateNotification() {
        const config = this.configManager.getConfig('pwa');
        
        if (config.features.autoUpdate) {
            // Check for updates periodically
            setInterval(() => {
                this.checkForUpdates();
            }, config.updateCheck.interval);
        }
    }

    setupOnlineStatus() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showOnlineStatus();
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineStatus();
        });
    }

    createEnhancedPWAUI() {
        const config = this.configManager.getConfig('pwa');
        
        if (!config.ui.showControls) return;

        // Create PWA controls container
        const pwaContainer = document.createElement('div');
        pwaContainer.className = 'pwa-controls enhanced';
        pwaContainer.innerHTML = this.getPWAControlsHTML();
        
        // Add to page
        document.body.appendChild(pwaContainer);
        
        // Setup event listeners
        this.setupPWAControlsEvents(pwaContainer);
    }

    getPWAControlsHTML() {
        return `
            <div class="pwa-install-prompt" style="display: none;">
                <div class="pwa-prompt-content">
                    <div class="pwa-prompt-header">
                        <span class="pwa-icon">📱</span>
                        <h3>Instalar DataCrypt Labs</h3>
                        <button class="pwa-close" aria-label="Cerrar">×</button>
                    </div>
                    <p>Instala nuestra app para acceso rápido y funcionalidad offline</p>
                    <div class="pwa-prompt-actions">
                        <button class="pwa-install-btn">Instalar App</button>
                        <button class="pwa-later-btn">Más tarde</button>
                    </div>
                </div>
            </div>
            
            <div class="pwa-update-notification" style="display: none;">
                <div class="pwa-update-content">
                    <span class="pwa-update-icon">🔄</span>
                    <span class="pwa-update-text">Nueva versión disponible</span>
                    <button class="pwa-update-btn">Actualizar</button>
                    <button class="pwa-dismiss-btn">×</button>
                </div>
            </div>
            
            <div class="pwa-status-indicator">
                <span class="pwa-online-status" title="Estado de conexión">
                    <i class="fas fa-wifi"></i>
                </span>
            </div>
        `;
    }

    setupPWAControlsEvents(container) {
        // Install prompt events
        const installBtn = container.querySelector('.pwa-install-btn');
        const laterBtn = container.querySelector('.pwa-later-btn');
        const closeBtn = container.querySelector('.pwa-close');
        
        installBtn?.addEventListener('click', () => this.install());
        laterBtn?.addEventListener('click', () => this.hideInstallPrompt());
        closeBtn?.addEventListener('click', () => this.hideInstallPrompt());
        
        // Update notification events
        const updateBtn = container.querySelector('.pwa-update-btn');
        const dismissBtn = container.querySelector('.pwa-dismiss-btn');
        
        updateBtn?.addEventListener('click', () => this.applyUpdate());
        dismissBtn?.addEventListener('click', () => this.hideUpdateNotification());
    }

    // API Principal - Métodos mejorados
    async install() {
        if (!this.deferredPrompt) {
            
            return false;
        }

        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            
            
            if (outcome === 'accepted') {
                this.trackInstallation();
                return true;
            }
            
            return false;
            
        } catch (error) {
            
            return false;
        } finally {
            this.deferredPrompt = null;
        }
    }

    async checkForUpdates() {
        if (!this.registration) return;

        try {
            await this.registration.update();
            
        } catch (error) {
            
        }
    }

    async applyUpdate() {
        if (!this.registration || !this.updateAvailable) return;

        const newWorker = this.registration.waiting;
        if (newWorker) {
            newWorker.postMessage({ action: 'skipWaiting' });
            window.location.reload();
        }
    }

    isInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    // UI Methods
    showInstallButton() {
        const prompt = document.querySelector('.pwa-install-prompt');
        if (prompt) {
            prompt.style.display = 'block';
            setTimeout(() => prompt.classList.add('visible'), 100);
        }
    }

    hideInstallButton() {
        const prompt = document.querySelector('.pwa-install-prompt');
        if (prompt) {
            prompt.classList.remove('visible');
            setTimeout(() => prompt.style.display = 'none', 300);
        }
    }

    showInstallPrompt() {
        this.showInstallButton();
    }

    hideInstallPrompt() {
        this.hideInstallButton();
    }

    showUpdateNotification() {
        const notification = document.querySelector('.pwa-update-notification');
        if (notification) {
            notification.style.display = 'block';
            setTimeout(() => notification.classList.add('visible'), 100);
        }
    }

    hideUpdateNotification() {
        const notification = document.querySelector('.pwa-update-notification');
        if (notification) {
            notification.classList.remove('visible');
            setTimeout(() => notification.style.display = 'none', 300);
        }
    }

    showInstalledMessage() {
        // Mostrar mensaje de instalación exitosa
        this.showNotification('✅ DataCrypt Labs instalado correctamente', 'success');
    }

    showOnlineStatus() {
        const indicator = document.querySelector('.pwa-online-status');
        if (indicator) {
            indicator.classList.remove('offline');
            indicator.classList.add('online');
            indicator.title = 'Conectado';
        }
        
        this.showNotification('🌐 Conexión restaurada', 'success');
    }

    showOfflineStatus() {
        const indicator = document.querySelector('.pwa-online-status');
        if (indicator) {
            indicator.classList.remove('online');
            indicator.classList.add('offline');
            indicator.title = 'Sin conexión - Modo offline activo';
        }
        
        this.showNotification('📱 Trabajando en modo offline', 'warning');
    }

    showNotification(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `pwa-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('visible'), 100);
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Event handlers
    handleServiceWorkerMessage(event) {
        const { type, payload } = event.data;
        
        switch (type) {
            case 'CACHE_UPDATED':
                
                break;
            case 'OFFLINE_FALLBACK':
                
                break;
            default:
                
        }
    }

    async syncOfflineData() {
        // Sincronizar datos offline cuando vuelva la conexión
        if (this.registration && this.registration.sync) {
            try {
                await this.registration.sync.register('background-sync');
                
            } catch (error) {
                
            }
        }
    }

    // Analytics y tracking
    trackInstallation() {
        const config = this.configManager.getConfig('pwa');
        
        if (config.analytics.enabled) {
            // Track installation event
            
            
            // Si hay Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pwa_install', {
                    'event_category': 'PWA',
                    'event_label': 'DataCrypt Labs',
                    'value': 1
                });
            }
        }
    }

    notifyChatbotInstallation() {
        // Notificar al chatbot sobre la instalación
        window.dispatchEvent(new CustomEvent('pwaInstalled', {
            detail: { timestamp: Date.now() }
        }));
    }

    // Eventos
    dispatchPWAReady() {
        const event = new CustomEvent('pwaManagerReady', {
            detail: { manager: this, version: '2.1' }
        });
        window.dispatchEvent(event);
    }

    // Fallback
    fallbackToOriginal() {
        
        if (this.originalAPI) {
            window.pwaManager = this.originalAPI;
        }
    }

    // Testing
    runTests() {
        if (!window.TestRunner) {
            
            return;
        }

        const tests = window.TestRunner.createSuite('EnhancedPWAManager');
        
        tests.describe('Enhanced PWA Manager v2.1', () => {
            tests.it('should initialize with ConfigManager', () => {
                tests.expect(this.isInitialized).toBe(true);
                tests.expect(this.configManager).toBeTruthy();
            });
            
            tests.it('should maintain backward compatibility', () => {
                tests.expect(window.pwaManager.install).toBeTruthy();
                tests.expect(window.pwaManager.isInstalled).toBeTruthy();
            });
            
            tests.it('should detect PWA support', () => {
                const isSupported = this.isPWASupported();
                tests.expect(typeof isSupported).toBe('boolean');
            });
            
            tests.it('should track online status', () => {
                tests.expect(typeof this.isOnline).toBe('boolean');
            });
        });
        
        return tests.run();
    }

    // Utilities
    isReady() {
        return this.isInitialized && this.configManager;
    }

    getStatus() {
        return {
            initialized: this.isInitialized,
            online: this.isOnline,
            installed: this.isInstalled(),
            updateAvailable: this.updateAvailable,
            serviceWorkerRegistered: !!this.registration
        };
    }
}

// Inicialización
if (typeof window !== 'undefined') {
    window.EnhancedPWAManager = EnhancedPWAManager;
    
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.enhancedPWAManager) {
            window.enhancedPWAManager = new EnhancedPWAManager();
        }
    });
}

export default EnhancedPWAManager;
