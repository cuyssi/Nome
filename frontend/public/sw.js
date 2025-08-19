self.addEventListener("push", event => {
  const data = event.data?.json() || {};

  self.registration.showNotification(data.title || "Recordatorio", {
    body: data.body || "Tienes una tarea pendiente",
    icon: "/icons/pwa-icon-192.png"
  });
});
