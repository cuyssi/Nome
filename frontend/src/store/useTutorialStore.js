/**────────────────────────────────────────────────────────────────────────────────┐
 * useTutorialStore: store de Zustand para manejar la visibilidad de tutoriales    │
 *                                                                                 │
 * Estado inicial:                                                                 │
 *   • hiddenTutorials: {} → objeto que guarda qué tutoriales están ocultos.       │
 *                                                                                 │
 * Métodos principales:                                                            │
 *   • isHidden(key)                                                               │
 *       - key: string → clave del tutorial.                                       │
 *       - Devuelve true si el tutorial está oculto (ya sea en localStorage o      │
 *         en hiddenTutorials).                                                    │
 *                                                                                 │
 *   • hideTutorial(key)                                                           │
 *       - key: string → clave del tutorial.                                       │
 *       - Oculta un tutorial, guardando true en localStorage y en hiddenTutorials.│
 *                                                                                 │
 *   • resetTutorial(key)                                                          │
 *       - key: string → clave del tutorial.                                       │
 *       - Muestra un tutorial borrando la clave de localStorage y marcando        │
 *         false en hiddenTutorials.                                               │
 *                                                                                 │
 * Observaciones de mejora:                                                        │
 *   1. Se podría parametrizar el tiempo de “auto-hide” si quisieras que los       │
 *      tutoriales se oculten automáticamente tras cierto tiempo.                  │
 *   2. Para muchos tutoriales, podrías extraer helpers para leer/escribir         │
 *      localStorage de forma genérica y centralizada.                             │
 *   3. Compatible con hooks de tutoriales específicos: useTutoTask, useTutoBags,  │
 *      useTutoCalendar, etc.                                                      │
 *                                                                                 │
 * Autor: Ana Castro                                                               │
└─────────────────────────────────────────────────────────────────────────────────*/

import { create } from "zustand";

export const useTutorialStore = create((set, get) => ({
    hiddenTutorials: {},

    isHidden: (key) => {
        const local = localStorage.getItem(`hideTutorial_${key}`);
        return local === "true" || get().hiddenTutorials[key];
    },

    hideTutorial: (key) => {
        localStorage.setItem(`hideTutorial_${key}`, "true");
        set((state) => ({
            hiddenTutorials: { ...state.hiddenTutorials, [key]: true },
        }));
    },

    resetTutorial: (key) => {
        localStorage.removeItem(`hideTutorial_${key}`);
        set((state) => ({
            hiddenTutorials: { ...state.hiddenTutorials, [key]: false },
        }));
    },
}));
