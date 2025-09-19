/**─────────────────────────────────────────────────────────────────────────────────────────────────┐
 * notifyBackend & cancelTaskBackend: funciones para comunicar tareas y cancelaciones al backend.   │
 *                                                                                                  │
 * Funcionalidad:                                                                                   │
 *   • cancelTaskBackend(id, deviceId)                                                              │
 *       - Envía al backend la solicitud de cancelación de una tarea.                               │
 *       - Parámetros:                                                                              │
 *           • id: ID de la tarea a cancelar.                                                       │
 *           • deviceId: identificador del dispositivo que solicita la cancelación.                 │
 *       - Maneja errores con console.error.                                                        │
 *                                                                                                  │
 *   • notifyBackend(id, text, dateTime, deviceId, type, notifyMinutesBefore, url)                  │
 *       - Envía al backend los detalles de una tarea para programación de notificación.            │
 *       - Parámetros:                                                                              │
 *           • id: ID de la tarea.                                                                  │
 *           • text: texto de la tarea.                                                             │
 *           • dateTime: fecha y hora de la tarea (ISO o string válido).                            │
 *           • deviceId: identificador del dispositivo.                                             │
 *           • type: tipo de tarea (por defecto "task").                                            │
 *           • notifyMinutesBefore: minutos antes de la tarea para la notificación (por defecto 15).│
 *           • url: URL opcional para la tarea/notificación.                                        │
 *       - Consolida logs de depuración para seguimiento.                                           │
 *       - Maneja errores con console.error.                                                        │
 *                                                                                                  │
 * Autor: Ana Castro                                                                                │
└──────────────────────────────────────────────────────────────────────────────────────────────────*/

import axios from "axios";

export const cancelTaskBackend = async (id, deviceId) => {
    const baseURL = import.meta.env.VITE_API_URL;
    try {
        await axios.post(`${baseURL}/cancel-task`, { id, deviceId });
    } catch (error) {
        console.error("❌ Error cancelando tarea en backend:", error);
    }
};

export const notifyBackend = async (
    id,
    text,
    dateTime,
    deviceId,
    type = "task",
    notifyMinutesBefore = 15,
    url,
    notifyDayBefore = false,
    repeat = "once",
    customDays = []
) => {
    console.log("notifyBackend params:", {
        id,
        text,
        dateTime,
        deviceId,
        type,
        notifyMinutesBefore,
        url,
        notifyDayBefore,
        repeat,
        customDays,
    });
    const baseURL = import.meta.env.VITE_API_URL;

    try {
        await axios.post(`${baseURL}/schedule-task`, {
            id,
            text,
            dateTime,
            deviceId,
            type,
            notifyMinutesBefore,
            data: { url },
            notifyDayBefore,
            repeat,
            customDays,
        });        
    } catch (error) {
        console.error("❌ Error notificando al backend:", error);
    }
};
