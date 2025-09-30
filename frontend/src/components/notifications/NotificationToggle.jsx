/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente NotificationToggle: botón de suscripción a notificaciones push.   │
 * Permite al usuario activar o desactivar notificaciones del navegador.        │
 * Muestra el estado actual mediante iconos (campana encendida/apagada)         │
 * y un mensaje de confirmación breve al realizar cambios.                      │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • isSubscribed → indica si el usuario está suscrito.                       │
 *   • message → mensaje temporal de estado (ej. "Suscripción activada").       │
 *   • permissionDenied → indica si el navegador ha bloqueado las notificaciones│
 *   • subscribeUser() → activa la suscripción a notificaciones push.           │
 *   • unsubscribeUser() → desactiva la suscripción.                            │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { usePushNotifications } from "../../hooks/notification/usePushNotifications";
import { Bell, BellOff, Settings2, Lock, Info } from "lucide-react";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { Modal } from "../commons/modals/Modal";

const HELP_URL = import.meta.env.VITE_HELP_URL;

export function NotificationToggle() {
    const { isSubscribed, message, permissionDenied, subscribeUser, unsubscribeUser } = usePushNotifications();

    const handleToggle = async () => {
        if (isSubscribed) {
            await unsubscribeUser();
        } else {
            await subscribeUser();
        }
    };

    return (
        <div>
            <button onClick={handleToggle} className="absolute top-3.5 right-12 z-50">
                {isSubscribed ? (
                    <Bell className="text-green-500 w-5 h-5" />
                ) : (
                    <BellOff className="text-red-500 w-5 h-5" />
                )}
            </button>

            {message && (
                <div className="absolute top-16 right-6 bg-white text-black px-3 py-1 rounded-lg shadow-md animate-fadeIn z-50">
                    {message}
                </div>
            )}

            {permissionDenied && (
                <Modal isOpen={true} className="z-[999]">
                    <div className="relative p-6 bg-white rounded-lg text-gray-600 text-base">
                        <h3 className="text-lg font-semibold mt-6 mb-3">🔕 Notificaciones bloqueadas</h3>
                        <p className="mb-3">
                            Has denegado las notificaciones en el navegador. No podemos volver a activarlas desde la
                            app.
                        </p>

                        <div className="mb-4">
                            <p className="font-medium mb-2">Sigue estos pasos:</p>
                            <ol className="flex flex-col list-decimal list-inside text-left mb-3 gap-2">
                                <li>
                                    Visita{" "}
                                    <a
                                        href={HELP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {HELP_URL}
                                    </a>
                                </li>
                                <li>
                                    Toca el icono a la izquierda de la URL (puede ser diferente en cada navegador{" "}
                                    <Lock className="inline w-4 h-4 text-purple-600" />,{" "}
                                    <Info className="inline w-4 h-4 text-purple-600" />,{" "}
                                    <Settings2 className="inline w-4 h-4 text-purple-600" />
                                    ).
                                </li>
                                <li>
                                    Busca <span className="text-gray-600 font-semibold">"Notificaciones"</span> y
                                    cámbialo a <em className="text-green-600 font-semibold">"Permitir"</em>.
                                </li>
                                <li>
                                    Luego cierra esta ventana y vuelve a darle a la campanita{" "}
                                    <Bell className="inline w-4 h-4 text-yellow-600" />.
                                </li>
                            </ol>
                            <p className="text-sm text-red-400">
                                * En iOS la gestión puede variar: Ajustes → Safari → Notificaciones del sitio.
                            </p>
                        </div>
                        <ButtonClose className="absolute" onClick={() => window.location.reload()} />
                    </div>
                </Modal>
            )}
        </div>
    );
}
