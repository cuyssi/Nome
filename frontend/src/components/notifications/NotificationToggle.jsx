import { useEffect, useState } from "react";
import axios from "axios";
import { subscribeUser } from "../../hooks/usePushNotifications";
import { Bell, BellOff } from "lucide-react";

function NotificationToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    checkSubscription().then(setIsSubscribed);
  }, []);
  

  const checkSubscription = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  };

  const handleToggle = async () => {
    const baseURL = import.meta.env.VITE_API_URL;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await axios.post(`${baseURL}/unsubscribe`, {
        endpoint: subscription.endpoint
      });
      await subscription.unsubscribe();
      setIsSubscribed(false);
      console.log("🔕 Notificaciones desactivadas");
    } else {
      await subscribeUser();
      setIsSubscribed(true);
      console.log("🔔 Notificaciones activadas");
    }
  };

  return (
    <button onClick={() => {
    if (navigator.vibrate) {
      navigator.vibrate(150);
      handleToggle();
    }
  }} style={{ fontSize: "1.5rem" }} className="absolute top-6 right-6">
      {isSubscribed ? <Bell className="text-green-500" /> : <BellOff className="text-red-500" />}
    </button>
  );
}

export default NotificationToggle;
