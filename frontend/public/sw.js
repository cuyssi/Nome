self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    console.log("📦 PUSH recibido con data:", data);

    self.registration.showNotification(data.title || "Recordatorio", {
        body: data.body || "Tienes una tarea pendiente",
        icon: "/icons/pwa-icon-192.png",
        data: {
            url: data.data?.url || "/",
        },
    });
});

self.addEventListener("notificationclick", (event) => {
    console.log("🖱️ Click en notificación con data:", event.notification.data);
    event.notification.close();

    const targetUrl = event.notification.data?.url || "/";

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && "focus" in client) {
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })
    );
});
