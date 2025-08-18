self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("v1").then((cache) => {
            return cache.addAll([
                "/",
                "/index.html",
                "/manifest.json",
                "/icons/pwa-icon-192.png",
                "/icons/pwa-icon-512.png"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // 🚫 Si la petición es a /transcribe o a tu backend, no la cacheamos ni interceptamos
    if (
        url.pathname.startsWith("/transcribe") ||
        url.origin.includes("localhost:8083") ||
        url.origin.includes("api.nome.anacas.dev")
    ) {
        return; // El navegador hará la petición normal
    }

    // 🗃 Para todo lo demás, usamos caché o fetch normal
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/pwa-icon-192.png",
    })
  );
});
