import { useEffect, useState } from "react";
import axios from "axios";
import { subscribeUser } from "../../hooks/notification/usePushNotifications";
import { Bell, BellOff } from "lucide-react";
import { Button } from "../commons/Button"

function NotificationToggle() {
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
      showMessage("🔕 Notificaciones desactivadas");
    } else {
      await subscribeUser();
      setIsSubscribed(true);
      showMessage("🔔 Notificaciones activadas");
    }
  };

  const showMessage = (msg, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), duration);
  };

  return (
    <div style={{ fontSize: "1.5rem" }} className="absolute top-0 right-0">
      <Button
        onClick={() => {
          if (navigator.vibrate) navigator.vibrate(150);
          handleToggle();
        }}
        style={{ fontSize: "1.5rem" }}
        className="absolute top-6 right-6"
      >
        {isSubscribed ? <Bell className="text-green-500" /> : <BellOff className="text-red-500" />}
      </Button>

      {message && (
        <p className="absolute top-16 right-6 bg-white text-black px-3 py-1 rounded-lg shadow-md animate-fadeIn">
          {message}
        </p>
      )}
    </div>
  );
}

export default NotificationToggle;
