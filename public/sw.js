// PayMatch Service Worker
// Version: 1.0.0

// const CACHE_NAME = 'paymatch-v1.0.0';
// const STATIC_CACHE = 'paymatch-static-v1.0.0';
const DYNAMIC_CACHE = 'paymatch-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/invoices',
  '/clients',
  '/settings',
  '/manifest.json',
  '/offline.html',
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^\/api\/invoices/,
  /^\/api\/clients/,
  /^\/api\/payments/,
  /^\/api\/dashboard/,
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', request.url);
        return cachedResponse;
      }

      // Check if it's an API request
      const isApiRequest = API_CACHE_PATTERNS.some((pattern) =>
        pattern.test(url.pathname)
      );

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          // Cache API responses
          if (isApiRequest) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }

          return response;
        })
        .catch((error) => {
          console.error('[SW] Fetch failed:', error);

          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }

          // Return a generic error response for other requests
          return new Response('Offline - Please check your connection', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'invoice-sync') {
    event.waitUntil(syncInvoices());
  } else if (event.tag === 'payment-sync') {
    event.waitUntil(syncPayments());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const options = {
    body: event.data ? event.data.text() : 'New notification from PayMatch',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View in PayMatch',
        icon: '/icons/action-view.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification('PayMatch', options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/dashboard'));
  }
});

// Helper functions
async function syncInvoices() {
  try {
    console.log('[SW] Syncing invoices...');
    // Implement invoice sync logic here
    // This would sync any offline-created invoices when back online
  } catch (error) {
    console.error('[SW] Invoice sync failed:', error);
  }
}

async function syncPayments() {
  try {
    console.log('[SW] Syncing payments...');
    // Implement payment sync logic here
    // This would sync any offline payment reconciliations when back online
  } catch (error) {
    console.error('[SW] Payment sync failed:', error);
  }
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
