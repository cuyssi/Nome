const CACHE_NAME = 'nome-cache-v1';
const urlsToCache = ['/', '/index.html', '/index-BB1GLqOR.js', '/assets/beep_start.mp3', '/assets/beep_end.mp3', '/icons/pwa-icon-192.png'];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
});

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});

self.addEventListener('push', (event) => {
    event.waitUntil(
        (async () => {
            try {
                const data = event.data ? event.data.json() : {};
                console.log('📦 PUSH recibido con data:', data);

                await self.registration.showNotification(data.title || 'Recordatorio', {
                    body: data.body || 'Tienes una tarea pendiente',
                    icon: '/icons/pwa-icon-192.png',
                    data: { url: data.data?.url || '/' },
                });

                console.log('✅ Notificación mostrada');
            } catch (error) {
                console.error('❌ Error al mostrar la notificación:', error);
            }
        })(),
    );
});



self.addEventListener('notificationclick', (event) => {
    console.log('🖱️ Click en notificación con data:', event.notification.data);
    event.notification.close();

    const targetUrl = new URL(
        event.notification.data?.url || '/',
        self.location.origin
    ).href;

    event.waitUntil(self.clients.openWindow(targetUrl));
});
