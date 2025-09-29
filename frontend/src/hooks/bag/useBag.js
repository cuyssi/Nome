/**─────────────────────────────────────────────────────────────────────────────┐
 * useBag: hook para gestionar mochilas y sus notificaciones en Nome.           │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Añadir, actualizar y eliminar mochilas usando el store principal.        │
 *   • Programa recordatorios automáticos al backend según la configuración.    │
 *   • Cancela notificaciones previas al actualizar o eliminar una mochila.     │
 *                                                                              │
 * Funciones devueltas:                                                         │
 *   - addBag(bag): añade una mochila y programa su notificación.               │
 *   - updateBag(bag): actualiza una mochila y reprograma la notificación.      │
 *   - deleteBag(id): elimina una mochila y cancela su notificación.            │
 *                                                                              │
 * Utilidades internas:                                                         │
 *   - calculateReminderDateTime(bag): calcula la fecha y hora del recordatorio │
 *     según tipo de mochila y días de notificación.                            │
 *   - scheduleNotification(bag): envía la tarea al backend.                    │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { useBagsStore } from "../../store/useBagsStore";
import { notifyBackend, cancelTaskBackend } from "../../services/notifyBackend";
import { buildReminderUrl } from "../../utils/buildReminderUrl";
import { toLocalDateTimeString } from "../../utils/dateUtils";
import { calculateReminderDateTime } from "../../utils/calculateReminder";
import { DAYS_TO_NUMBER } from "../../utils/constants";

export const useBag = () => {
    const { addBag: baseAddBag, updateBag: baseUpdateBag, deleteBag: baseDeleteBag } = useBagsStore();

    const scheduleNotification = async (bag) => {
        const deviceId = localStorage.getItem("deviceId");
        const localDate = calculateReminderDateTime(bag);
        const dateTimeString = toLocalDateTimeString(localDate);
        const url = buildReminderUrl("bag", bag.name);

        if (!deviceId) return console.log("❌ No hay deviceId, saliendo");

        const notifyDaysIndices = (bag.notifyDays || [])
            .map((day) => DAYS_TO_NUMBER[day])
            .filter((i) => i !== undefined);

        try {
            await notifyBackend(
                bag.id,
                `🎒 Prepara tu mochila de ${bag.name}!`,
                dateTimeString,
                deviceId,
                "bag",
                0,
                url,
                bag.notifyDayBefore || false,
                "custom",
                notifyDaysIndices
            );
        } catch (e) {
            console.error("❌ Error en notifyBackend:", e);
        }
    };

    const wrappedAddBag = async (bag) => {
        baseAddBag(bag);
        await scheduleNotification(bag);
    };

    const wrappedUpdateBag = async (bag) => {
        baseUpdateBag(bag);
        const deviceId = localStorage.getItem("deviceId");

        if (deviceId) {
            await cancelTaskBackend(bag.id, deviceId);
        }
        await scheduleNotification(bag);
    };

    const wrappedDeleteBag = async (id) => {
        baseDeleteBag(id);
        const deviceId = localStorage.getItem("deviceId");

        if (deviceId) {
            await cancelTaskBackend(id, deviceId);
        }
    };

    return {
        addBag: wrappedAddBag,
        updateBag: wrappedUpdateBag,
        deleteBag: wrappedDeleteBag,
    };
};
