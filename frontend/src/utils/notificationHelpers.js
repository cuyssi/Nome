/**──────────────────────────────────────────────────────────────────────────────┐
 * getNextNotificationDate: calcula la próxima fecha de notificación.            │
 *                                                                               │
 * Parámetros:                                                                   │
 *   • notifyDays: array de letras de días ["L","M","X",...] en que se quiere    │
 *                 notificar.                                                   │
 *   • notifyTime: string "HH:MM" → hora del recordatorio.                       │
 *   • notifyDayBefore: boolean → si la notificación debe enviarse un día antes. │
 *                                                                               │
 * Comportamiento:                                                               │
 *   1. Convierte notifyTime en horas y minutos.                                 │
 *   2. Convierte letras de notifyDays en índices numéricos (0=Lunes,...,6=Dom).│
 *      Aquí se podría usar DAYS/FULL_DAYS del constants en lugar de hardcode.  │
 *   3. Itera los próximos 7 días desde hoy y busca el primer día que coincida   │
 *      con notifyDays.                                                          │
 *   4. Ajusta la fecha un día antes si notifyDayBefore es true.                 │
 *   5. Devuelve un objeto Date con la fecha y hora del próximo recordatorio.    │
 *   6. Devuelve null si no se encuentra ningún día válido.                      │
 *
 * Ejemplo de uso:                                                              │
 *   getNextNotificationDate(["L","M"], "20:00", true) → Date objeto del lunes  │
 *   anterior a las 20:00.                                                      │
 *
 * Autor: Ana Castro                                                            │
└───────────────────────────────────────────────────────────────────────────────*/

import { DAYS } from "../constants";

export function getNextNotificationDate(notifyDays, notifyTime, notifyDayBefore) {
    if (!notifyDays?.length || !notifyTime) return null;

    const [hour, minute] = notifyTime.split(":").map(Number);
    const now = new Date();
    const dayMap = DAYS.reduce((acc, d) => {
        const dayIndex = d.key === "D" ? 0 : DAYS.indexOf(d) + 1;
        acc[d.key] = dayIndex;
        return acc;
    }, {});

    const daysIndexes = notifyDays.map((d) => dayMap[d]);

    for (let offset = 0; offset < 7; offset++) {
        const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hour, minute, 0);

        if (daysIndexes.includes(candidate.getDay())) {
            if (notifyDayBefore) candidate.setDate(candidate.getDate() - 1);
            return candidate;
        }
    }

    return null;
}
