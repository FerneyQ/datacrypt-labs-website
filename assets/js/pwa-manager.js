/**
 * 📱 DataCrypt Labs - PWA Manager
 * Progressive Web App registration and management system
 * with installation prompts and update notifications
 */

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isOnline = navigator.onLine;
        this.registration = null;
        this.updateAvailable = false;
        
        this.init();
    }

    async init() {
        // Check PWA support
        if (!this.isPWASupported()) {
            
            return;
        }

        await this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupUpdateNotification();
        this.setupOnlineStatus();
        this.createPWAUI();
        
        
    }

    isPWASupported() {
        return 'serviceWorker' in navigator && 'caches' in window;
    }

    async registerServiceWorker() {
        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
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
            
            this.hideInstallButton();
            this.showInstalledMessage();
        });
    }

    setupUpdateNotification() {
        // Listen for controller change (new service worker activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }

    setupOnlineStatus() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateOnlineStatus();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateOnlineStatus();
        });

        this.updateOnlineStatus();
    }

    createPWAUI() {
        // Create install button
        this.createInstallButton();
        
        // Create offline indicator
        this.createOfflineIndicator();
        
        // Create update notification
        this.createUpdateNotification();
    }

    createInstallButton() {
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.className = 'pwa-install-btn hidden';
        installBtn.innerHTML = `
            <span class="install-icon">📱</span>
            <span class="install-text" data-translate="pwa.install">Instalar App</span>
        `;
        
        installBtn.addEventListener('click', () => this.promptInstall());
        document.body.appendChild(installBtn);
    }

    createOfflineIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.className = 'offline-indicator hidden';
        indicator.innerHTML = `
            <div class="offline-content">
                <span class="offline-icon">📡</span>
                <span class="offline-text" data-translate="pwa.offline">Modo Offline</span>
                <button class="offline-close" onclick="this.parentElement.parentElement.classList.add('hidden')">×</button>
            </div>
        `;
        
        document.body.appendChild(indicator);
    }

    createUpdateNotification() {
        const notification = document.createElement('div');
        notification.id = 'update-notification';
        notification.className = 'update-notification hidden';
        notification.innerHTML = `
            <div class="update-content">
                <span class="update-icon">🔄</span>
                <span class="update-text" data-translate="pwa.updateAvailable">Nueva versión disponible</span>
                <button class="update-btn" onclick="window.pwaManager.applyUpdate()">
                    <span data-translate="pwa.update">Actualizar</span>
                </button>
                <button class="update-close" onclick="this.parentElement.parentElement.classList.add('hidden')">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
    }

    async promptInstall() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const result = await this.deferredPrompt.userChoice;
        
        if (result.outcome === 'accepted') {
            
        } else {
            
        }
        
        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    showInstallButton() {
        const btn = document.getElementById('pwa-install-btn');
        if (btn) {
            btn.classList.remove('hidden');
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                btn.classList.add('minimized');
            }, 10000);
        }
    }

    hideInstallButton() {
        const btn = document.getElementById('pwa-install-btn');
        if (btn) btn.classList.add('hidden');
    }

    showInstalledMessage() {
        const message = document.createElement('div');
        message.className = 'pwa-success-message';
        message.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✅</span>
                <span class="success-text">¡App instalada correctamente!</span>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    showUpdateNotification() {
        const notification = document.getElementById('update-notification');
        if (notification) {
            notification.classList.remove('hidden');
        }
    }

    async applyUpdate() {
        if (!this.registration || !this.registration.waiting) return;

        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    updateOnlineStatus() {
        const indicator = document.getElementById('offline-indicator');
        if (!indicator) return;

        if (this.isOnline) {
            indicator.classList.add('hidden');
        } else {
            indicator.classList.remove('hidden');
        }

        // Update UI based on online status
        document.body.classList.toggle('offline', !this.isOnline);
    }

    // Share API support
    async shareContent(shareData) {
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                
            } catch (error) {
                if (error.name !== 'AbortError') {
                    
                    this.fallbackShare(shareData);
                }
            }
        } else {
            this.fallbackShare(shareData);
        }
    }

    fallbackShare(shareData) {
        // Fallback share implementation
        const url = shareData.url || window.location.href;
        const text = shareData.text || document.title;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`${text} - ${url}`);
            this.showShareSuccess('Enlace copiado al portapapeles');
        } else {
            // Traditional copy method
            const textArea = document.createElement('textarea');
            textArea.value = `${text} - ${url}`;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showShareSuccess('Enlace copiado');
        }
    }

    showShareSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 2000);
    }

    // Notification permission
    async requestNotificationPermission() {
        if (!('Notification' in window)) return false;

        if (Notification.permission === 'granted') return true;

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    // Background sync registration
    async registerBackgroundSync(tag) {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register(tag);
            
        }
    }

    // Performance metrics
    getConnectionInfo() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        return null;
    }

    // Check if app is running in standalone mode
    isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pwaManager = new PWAManager();
    });
} else {
    window.pwaManager = new PWAManager();
}

// Export for external use
window.PWAManager = PWAManager;
