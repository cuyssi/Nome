/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * usePushNotifications: hook para gestionar notificaciones push en el navegador.                  │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Comprueba si el usuario ya está suscrito a notificaciones push.                             │
 *   • Permite suscribirse usando VAPID y Service Workers.                                         │
 *   • Permite cancelar la suscripción de notificaciones.                                          │
 *   • Genera mensajes temporales para indicar el estado de la suscripción (activado/desactivado). │
 *   • Gestiona un `deviceId` único en localStorage para identificar el dispositivo.               │
 *                                                                                                 │
 * Devuelve:                                                                                       │
 *   - isSubscribed: booleano que indica si el usuario está suscrito.                              │
 *   - message: string con mensaje temporal de estado.                                             │
 *   - subscribeUser(): función que suscribe al usuario a las push notifications.                  │
 *   - unsubscribeUser(): función que cancela la suscripción a push notifications.                 │
 *                                                                                                 │
 * Internamente:                                                                                   │
 *   • urlBase64ToUint8Array(base64String): convierte la clave pública VAPID a Uint8Array.         │
 *   • requestPermission(): solicita permiso de notificaciones al usuario.                         │
 *   • navigator.serviceWorker y pushManager se usan para suscribir y desuscribir.                 │
 *   • axios realiza las llamadas al backend para registrar o eliminar la suscripción.             │
 *                                                                                                 │
 * Uso típico:                                                                                     │
 *   const { isSubscribed, message, subscribeUser, unsubscribeUser } = usePushNotifications();     │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";
import axios from "axios";

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export const usePushNotifications = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        checkSubscription().then(setIsSubscribed);
    }, []);

    const checkSubscription = async () => {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return subscription !== null;
    };

    const subscribeUser = async () => {
        try {
            const baseURL = import.meta.env.VITE_API_URL;
            console.log("VITE_API_URL:", baseURL);

            const permission = await Notification.requestPermission();
            console.log("Permiso de notificación:", permission);
            if (permission !== "granted") return;

            const registration = await navigator.serviceWorker.ready;
            const existingSubscription = await registration.pushManager.getSubscription();

            let subscription = existingSubscription;
            if (!subscription) {
                const vapidKeyRes = await axios.get(`${baseURL}/vapid-public-key`);
                const applicationServerKey = urlBase64ToUint8Array(vapidKeyRes.data);

                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey,
                });
            }

            let deviceId = localStorage.getItem("deviceId");
            if (!deviceId) {
                deviceId = crypto.randomUUID();
                localStorage.setItem("deviceId", deviceId);
            }

            await axios.post(`${baseURL}/subscribe`, {
                deviceId,
                subscription,
            });

            setIsSubscribed(true);
            showMessage("🔔 Notificaciones activadas");
        } catch (err) {
            console.error("❌ Error en subscribeUser:", err);
        }
    };

    const unsubscribeUser = async () => {
        const baseURL = import.meta.env.VITE_API_URL;
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) return;

        await axios.post(`${baseURL}/unsubscribe`, {
            endpoint: subscription.endpoint,
        });
        await subscription.unsubscribe();

        setIsSubscribed(false);
        showMessage("🔕 Notificaciones desactivadas");
    };

    const showMessage = (msg, duration = 2000) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), duration);
    };

    return {
        isSubscribed,
        message,
        subscribeUser,
        unsubscribeUser,
    };
};
