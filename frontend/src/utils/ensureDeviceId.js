/**──────────────────────────────────────────────────────────────────────────────┐
 * Funciones de utilidades para el dispositivo:                                  │
 *   • ensureDeviceId: Verifica si hay un deviceId en localStorage;              │
 *                   si no existe, genera uno nuevo y lo guarda.                 │
 *                                                                               │
 * Autor: Ana Castro                                                             │
└───────────────────────────────────────────────────────────────────────────────*/

import { v4 as uuidv4 } from "uuid";

export const ensureDeviceId = () => {
    const existingId = localStorage.getItem("deviceId");
    if (!existingId) {
        const newId = uuidv4();
        localStorage.setItem("deviceId", newId);
        return newId;
    }

    return existingId;
};

