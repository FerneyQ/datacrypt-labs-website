/**
 * 🚀 DataCrypt Labs - Service Worker PWA
 * Advanced Service Worker with intelligent caching strategies
 * and offline capabilities for optimal performance
 */

const CACHE_NAME = 'datacrypt-labs-v3.0';
const STATIC_CACHE = 'static-v3.0';
const DYNAMIC_CACHE = 'dynamic-v3.0';

// Assets to cache immediately
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/js/datacrypt.js',
    '/assets/js/theme-system.js',
    '/assets/js/translations.js',
    '/manifest.json',
    // Core images (will be added when available)
    '/assets/images/icon-192x192.png',
    '/assets/images/icon-512x512.png'
];

// Dynamic content patterns
const DYNAMIC_PATTERNS = [
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    /\.(?:css|js)$/,
    /\/api\//
];

// Network-first patterns (always try network first)
const NETWORK_FIRST = [
    /\/api\//,
    /\.json$/,
    /\/share-target\//
];

// Cache-first patterns (serve from cache if available)
const CACHE_FIRST = [
    /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
    /\.(?:css|js)$/,
    /\/assets\//
];

/**
 * Service Worker Installation
 */
self.addEventListener('install', (event) => {
    console.log('🚀 Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Caching core assets');
                return cache.addAll(CORE_ASSETS);
            })
            .then(() => {
                console.log('✅ Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Installation failed:', error);
            })
    );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ]).then(() => {
            console.log('✅ Activation complete');
        })
    );
});

/**
 * Fetch Event Handler with Intelligent Caching
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests and external domains
    if (request.method !== 'GET' || url.origin !== location.origin) {
        return;
    }
    
    // Determine caching strategy
    if (isNetworkFirst(request.url)) {
        event.respondWith(networkFirstStrategy(request));
    } else if (isCacheFirst(request.url)) {
        event.respondWith(cacheFirstStrategy(request));
    } else {
        event.respondWith(staleWhileRevalidateStrategy(request));
    }
});

/**
 * Network First Strategy
 * Try network first, fallback to cache
 */
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('🌐 Network failed, trying cache for:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

/**
 * Cache First Strategy  
 * Try cache first, fallback to network
 */
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Both cache and network failed for:', request.url);
        throw error;
    }
}

/**
 * Stale While Revalidate Strategy
 * Serve from cache while updating in background
 */
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Background fetch to update cache
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Silent fail for background updates
        return null;
    });
    
    // Return cached version immediately or wait for network
    return cachedResponse || fetchPromise;
}

/**
 * Background Sync for offline actions
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('🔄 Background sync triggered');
        event.waitUntil(handleBackgroundSync());
    }
});

async function handleBackgroundSync() {
    // Handle offline form submissions, analytics, etc.
    try {
        // Implement background sync logic here
        console.log('✅ Background sync completed');
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

/**
 * Push Notifications
 */
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'Nueva actualización disponible',
        icon: '/assets/images/icon-192x192.png',
        badge: '/assets/images/icon-72x72.png',
        tag: data.tag || 'datacrypt-notification',
        requireInteraction: data.requireInteraction || false,
        actions: data.actions || [
            {
                action: 'open',
                title: 'Abrir App',
                icon: '/assets/images/icon-72x72.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/assets/images/icon-72x72.png'
            }
        ],
        data: data.url || '/'
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'DataCrypt Labs', options)
    );
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    const urlToOpen = event.notification.data || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

/**
 * Share Target Handler (for sharing data to the app)
 */
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    if (url.pathname === '/share-target/' && event.request.method === 'POST') {
        event.respondWith(handleShareTarget(event.request));
    }
});

async function handleShareTarget(request) {
    const formData = await request.formData();
    const title = formData.get('title') || '';
    const text = formData.get('text') || '';
    const url = formData.get('url') || '';
    
    // Store shared data for the app to retrieve
    const shareData = { title, text, url, timestamp: Date.now() };
    
    // You can store this in IndexedDB or send to your API
    console.log('📤 Shared data received:', shareData);
    
    // Redirect to app with share data
    return Response.redirect('/?shared=true', 303);
}

/**
 * Utility Functions
 */
function isNetworkFirst(url) {
    return NETWORK_FIRST.some(pattern => pattern.test(url));
}

function isCacheFirst(url) {
    return CACHE_FIRST.some(pattern => pattern.test(url));
}

/**
 * Performance Monitoring
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Cache size management
async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxItems) {
        const keysToDelete = keys.slice(0, keys.length - maxItems);
        await Promise.all(keysToDelete.map(key => cache.delete(key)));
        console.log(`🗑️ Trimmed ${keysToDelete.length} items from ${cacheName}`);
    }
}

// Periodic cache cleanup
setInterval(() => {
    trimCache(DYNAMIC_CACHE, 50);
}, 24 * 60 * 60 * 1000); // Daily cleanup