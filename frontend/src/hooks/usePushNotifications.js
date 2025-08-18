import { useEffect } from "react";
import axios from "axios";

export function usePushNotifications() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    async function subscribeUser() {
      // 1️⃣ Pedir permiso
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      // 2️⃣ Registrar Service Worker
      const sw = await navigator.serviceWorker.ready;

      // 3️⃣ Obtener clave pública VAPID
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/vapid-public-key/`);
      const vapidPublicKey = data.publicKey;

      // 4️⃣ Suscribirse al push
      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // 5️⃣ Enviar la suscripción al backend
      await axios.post(`${import.meta.env.VITE_API_URL}/subscribe/`, subscription);

      console.log("✅ Usuario suscrito:", subscription);
    }

    subscribeUser().catch(console.error);
  }, []);
}

// Convierte base64 a UInt8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
