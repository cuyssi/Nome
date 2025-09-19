/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * useScheduleStore: store de Zustand para manejar el horario escolar o personal.                  │
 *                                                                                                 │
 * Estado inicial:                                                                                 │
 *   • days: ["L", "M", "X", "J", "V"] → días de la semana.                                        │
 *   • hours: ["08:15", "09:10", ...] → horas disponibles en el horario.                           │
 *   • subjects: {} → objeto con la estructura { "Día-Hora": { name, color } }.                    │
 *                                                                                                 │
 * Métodos principales:                                                                            │
 *   • addHour(hour)                                                                               │
 *       - Añade una nueva hora al horario.                                                        │
 *       - Mantiene las horas ordenadas cronológicamente.                                          │
 *                                                                                                 │
 *   • removeHour(hour)                                                                            │
 *       - Elimina la hora del horario.                                                            │
 *       - Borra todas las asignaturas que existan para esa hora en todos los días.                │
 *                                                                                                 │
 *   • setSubject(day, hour, name, color)                                                          │
 *       - Asigna una asignatura y color a una celda específica del horario.                       │
 *       - key: `${day}-${hour}`                                                                   │
 *                                                                                                 │
 *   • updateHour(oldHour, newHour)                                                                │
 *       - Cambia una hora existente a otra nueva.                                                 │
 *       - Actualiza todas las claves de subjects que dependan de esa hora.                        │
 *                                                                                                 │
 * Observaciones de mejora:                                                                        │
 *   1. La lógica de updateHour y removeHour podría extraerse a helpers para mayor claridad.       │
 *   2. Podrías agregar validaciones para que no se dupliquen horas al usar addHour.               │
 *   3. Si en el futuro quieres notificaciones o backend, se podría añadir lógica similar a        │
 *      useTasksStore o useBagsStore para sincronización externa.                                  │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DAYS, DEFAULT_HOURS } from "../utils/constants";

export const useScheduleStore = create(
    persist(
        (set) => ({
            days: DAYS.slice(0, 5).map((d) => d.key),
            hours: DEFAULT_HOURS,
            subjects: {},

            addHour: (hour) =>
                set((state) => ({
                    hours: [...state.hours, hour].sort((a, b) => {
                        const [h1, m1] = a.split(":").map(Number);
                        const [h2, m2] = b.split(":").map(Number);
                        return h1 - h2 || m1 - m2;
                    }),
                })),

            removeHour: (hour) =>
                set((state) => {
                    const subjects = { ...state.subjects };
                    state.days.forEach((day) => delete subjects[`${day}-${hour}`]);
                    return {
                        hours: state.hours.filter((h) => h !== hour),
                        subjects,
                    };
                }),

            setSubject: (day, hour, name, color) =>
                set((state) => ({
                    subjects: {
                        ...state.subjects,
                        [`${day}-${hour}`]: { name, color },
                    },
                })),

            updateHour: (oldHour, newHour) =>
                set((state) => {
                    const hours = state.hours.map((h) => (h === oldHour ? newHour : h));
                    const subjects = {};
                    Object.entries(state.subjects).forEach(([key, value]) => {
                        const [day, hour] = key.split("-");
                        const updatedHour = hour === oldHour ? newHour : hour;
                        subjects[`${day}-${updatedHour}`] = value;
                    });
                    return { hours, subjects };
                }),
        }),
        {
            name: "schedule-storage",
        }
    )
);
