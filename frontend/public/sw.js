const CACHE_NAME = "nome-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/index-BB1GLqOR.js",
  "/assets/beep_start.mp3",
  "/assets/beep_end.mp3",
  "/icons/pwa-icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  console.log("📦 PUSH recibido con data:", data);

  self.registration.showNotification(data.title || "Recordatorio", {
    body: data.body || "Tienes una tarea pendiente",
    icon: "/icons/pwa-icon-192.png",
    data: { url: data.data?.url || "/" },
  });
});

self.addEventListener("notificationclick", (event) => {
  console.log("🖱️ Click en notificación con data:", event.notification.data);
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
