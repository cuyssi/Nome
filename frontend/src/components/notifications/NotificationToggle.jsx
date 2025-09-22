/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente NotificationToggle: botón de suscripción a notificaciones push.   │
 * Permite al usuario activar o desactivar notificaciones del navegador.        │
 * Muestra el estado actual mediante iconos (campana encendida/apagada)         │
 * y un mensaje de confirmación breve al realizar cambios.                      │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • isSubscribed → indica si el usuario está suscrito.                       │
 *   • message → mensaje temporal de estado (ej. "Suscripción activada").       │
 *   • subscribeUser() → activa la suscripción a notificaciones push.           │
 *   • unsubscribeUser() → desactiva la suscripción.                            │
 *   • handleToggle() → alterna entre suscripción y desuscripción.              │
 *   • Vibración opcional si el dispositivo lo soporta.                         │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { usePushNotifications } from "../../hooks/notification/usePushNotifications";
import { Bell, BellOff } from "lucide-react";

export function NotificationToggle() {
    const { isSubscribed, message, subscribeUser, unsubscribeUser } = usePushNotifications();

    const handleToggle = async () => {
        if (navigator.vibrate) navigator.vibrate(150);
        isSubscribed ? await unsubscribeUser() : await subscribeUser();
    };

    return (
        <>
            <button onClick={handleToggle} className="absolute top-3.5 right-12">
                {isSubscribed ? <Bell className="text-green-500 w-5 h-5" /> : <BellOff className="text-red-500 w-5 h-5" />}
            </button>

            {message && (
                <p className="absolute top-16 right-6 bg-white text-black px-3 py-1 rounded-lg shadow-md animate-fadeIn">
                    {message}
                </p>
            )}
        </>
    );
}
