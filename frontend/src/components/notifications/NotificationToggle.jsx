import { usePushNotifications } from "../../hooks/notification/usePushNotifications";
import { Bell, BellOff } from "lucide-react";
import { Button } from "../commons/Button";

function NotificationToggle() {
  const { isSubscribed, message, subscribeUser, unsubscribeUser } = usePushNotifications();

  const handleToggle = async () => {
    if (navigator.vibrate) navigator.vibrate(150);
    isSubscribed ? await unsubscribeUser() : await subscribeUser();
  };

  return (
    <div style={{ fontSize: "1.5rem" }} className="absolute top-0 right-0">
      <Button
        onClick={handleToggle}
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
