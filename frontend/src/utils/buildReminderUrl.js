/**─────────────────────────────────────────────────────────────────────────────┐
 * buildReminderUrl: genera la URL para abrir una sección específica del app │
 *                     y, si corresponde, pasa el parámetro de objeto a abrir│
 *                                                                             │
 * Parámetros:                                                                 │
 *   • type: string → tipo de elemento: "bag", "task", "evento".              │
 *   • nameOrTitle: string → nombre de la mochila, título de la tarea o       │
 *                           nombre del evento.                               │
 *                                                                             │
 * Comportamiento:                                                             │
 *   • Define un mapa baseMap con rutas por tipo:                               │
 *       - "bag"    → "/bags"                                                  │
 *       - "task"   → "/today"                                                 │
 *       - "evento" → "/events"                                                │
 *   • Para "bag" y "evento":                                                  │
 *       - Normaliza el nombre/título usando normalize().                       │
 *       - Escapa el valor con encodeURIComponent.                              │
 *       - Agrega como query param `?open=<normalized>` a la URL base.         │
 *   • Para "task": devuelve solo la ruta base "/today".                       │
 *   • Para tipos desconocidos: devuelve "/" por defecto.                      │
 *                                                                             │
 * Observaciones de mejora:                                                    │
 *   1. Se puede ampliar el baseMap si agregas nuevas secciones en la app.     │
 *   2. Podrías validar que nameOrTitle no sea vacío antes de normalizar.      │
 *   3. Si en el futuro se requiere más info en query params, podrías usar un  │
 *      objeto y serializarlo dinámicamente.                                   │
 *                                                                             │
 * Autor: Ana Castro                                                           │
└─────────────────────────────────────────────────────────────────────────────*/

import { normalize } from "./normalize";

export const buildReminderUrl = (type, nameOrTitle) => {
    const baseMap = {
        bag: "/bags",
        task: "/today",
        evento: "/events",
    };
    const base = baseMap[type] || "/";
    if (type === "bag" || type === "evento") {
        const normalized = encodeURIComponent(normalize(nameOrTitle));
        return `${base}?open=${normalized}`;
    }

    return base;
};
