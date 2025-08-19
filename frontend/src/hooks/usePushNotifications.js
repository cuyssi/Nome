import axios from "axios";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export async function subscribeUser() {
  const baseURL = import.meta.env.VITE_API_URL;
  if (!("serviceWorker" in navigator)) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;


  const vapidKeyRes = await axios.get(`${baseURL}/vapid-public-key`);
  const applicationServerKey = urlBase64ToUint8Array(vapidKeyRes.data);

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey
  });

  await axios.post(`${baseURL}/subscribe`, subscription);
  console.log("✅ Usuario suscrito a notificaciones push");
}
