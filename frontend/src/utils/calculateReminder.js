/**─────────────────────────────────────────────────────────────────────────────────┐
 * calculateReminderDateTime: calcula la fecha y hora exacta para la notificación   │
 *                             de una mochila (bag), usando constantes globales.   │
 *                                                                                  │
 * Parámetros:                                                                      │
 *   • bag: objeto que representa la mochila con posibles campos:                   │
 *       - reminderTime: string "HH:MM" → hora de recordatorio (por defecto "20:00")│
 *       - type: string → tipo de notificación, ej: "personalizada"                 │
 *       - notifyDays: array → días de la semana para notificación (ej: ["L","M"])  │
 *                                                                                  │
 * Comportamiento:                                                                  │
 *   1. Obtiene la fecha/hora actual.                                               │
 *   2. Inicializa la hora y minuto del recordatorio según bag.reminderTime.        │
 *   3. Si el tipo es "personalizada" y existen notifyDays:                         │
 *       - Convierte letras de días en índices usando FULL_DAYS y DAYS.             │
 *       - Calcula los offsets desde hoy para cada día en notifyDays.               │
 *       - Selecciona el próximo día válido que sea mayor que la fecha actual.      │
 *       - Ajusta la fecha del recordatorio al siguiente día seleccionado.          │
 *   4. Devuelve un objeto Date con la fecha y hora final para la notificación.     │
 *                                                                                  │
 * Autor: Ana Castro                                                                │
└──────────────────────────────────────────────────────────────────────────────────*/

import { DAYS } from "./constants";

export const calculateReminderDateTime = (bag) => {
    const now = new Date();
    const [hours, minutes] = (bag.reminderTime || "20:00").split(":");
    const reminder = new Date(now);
    reminder.setHours(Number(hours), Number(minutes), 0, 0);

    if (bag.type === "personalizada" && Array.isArray(bag.notifyDays) && bag.notifyDays.length) {
        const dayMap = DAYS.reduce((acc, d) => {
            const dayIndex = { D: 0, L: 1, M: 2, X: 3, J: 4, V: 5, S: 6 }[d.key];
            acc[d.key] = dayIndex;
            return acc;
        }, {});

        const todayDay = now.getDay();
        const daysAhead = bag.notifyDays.map((d) => (dayMap[d] - todayDay + 7) % 7).sort((a, b) => a - b);

        const nextOffset =
            daysAhead.find((d) => {
                const candidate = new Date(reminder);
                candidate.setDate(candidate.getDate() + d);
                return candidate > now;
            }) ??
            daysAhead[0] ??
            0;

        reminder.setDate(reminder.getDate() + nextOffset);
    }

    return reminder;
};
