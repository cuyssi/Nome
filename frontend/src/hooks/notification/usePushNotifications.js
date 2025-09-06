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
        const baseURL = import.meta.env.VITE_API_URL;
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const registration = await navigator.serviceWorker.ready;
        const vapidKeyRes = await axios.get(`${baseURL}/vapid-public-key`);
        const applicationServerKey = urlBase64ToUint8Array(vapidKeyRes.data);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
        });

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
