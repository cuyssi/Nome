/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * usePushNotifications: hook para gestionar notificaciones push en el navegador.                  │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Comprueba si el usuario ya está suscrito a notificaciones push.                             │
 *   • Permite suscribirse usando VAPID y Service Workers.                                         │
 *   • Permite cancelar la suscripción de notificaciones.                                          │
 *   • Genera mensajes temporales para indicar el estado de la suscripción (activado/desactivado). │
 *   • Gestiona un `deviceId` único en localStorage para identificar el dispositivo.               │
 *   • Detecta si el permiso ha sido denegado y expone `permissionDenied`.                         │
 *   • Realiza vibración si el dispositivo lo soporta.                                             │
 *                                                                                                 │
 * Devuelve:                                                                                       │
 *   - isSubscribed: booleano que indica si el usuario está suscrito.                              │
 *   - message: string con mensaje temporal de estado.                                             │
 *   - permissionDenied: booleano que indica si el navegador ha bloqueado las notificaciones.      │
 *   - subscribeUser(): función que suscribe al usuario a las push notifications.                  │
 *   - unsubscribeUser(): función que cancela la suscripción a push notifications.                 │
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
    const [permissionDenied, setPermissionDenied] = useState(false);

    const vibrate = () => {
        if (navigator.vibrate) navigator.vibrate(150);
    };

    const showMessage = (msg, duration = 3000) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), duration);
    };

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            return subscription !== null;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        checkSubscription().then(setIsSubscribed);
    }, []);

    const subscribeUser = async () => {
        vibrate();

        try {
            if (Notification.permission === "denied") {
                setPermissionDenied(true);
                return "denied";
            }

            const permission = await Notification.requestPermission();
            if (permission === "denied") {
                setPermissionDenied(true);
                return "denied";
            }

            if (permission !== "granted") return "pending";

            setIsSubscribed(true);
            showMessage("🔔 Notificaciones activadas");

            const baseURL = import.meta.env.VITE_API_URL;
            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                const vapidKeyRes = await axios.get(`${baseURL}/vapid-public-key`);
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidKeyRes.data),
                });
            }

            let deviceId = localStorage.getItem("deviceId");
            if (!deviceId) {
                deviceId = crypto.randomUUID();
                localStorage.setItem("deviceId", deviceId);
            }

            await axios.post(`${baseURL}/subscribe`, { deviceId, subscription });
            return "subscribed";
        } catch (err) {
            console.error(err);
            showMessage("⚠️ Error al activar notificaciones");
            return "error";
        }
    };

    const unsubscribeUser = async () => {
        vibrate();

        try {
            setIsSubscribed(false);
            showMessage("🔕 Notificaciones desactivadas");

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (!subscription) return;

            const baseURL = import.meta.env.VITE_API_URL;
            await axios.post(`${baseURL}/unsubscribe`, { endpoint: subscription.endpoint });
            await subscription.unsubscribe();
        } catch (err) {
            console.error(err);
        }
    };

    return { isSubscribed, message, permissionDenied, subscribeUser, unsubscribeUser };
};
