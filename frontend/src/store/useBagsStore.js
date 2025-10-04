/**────────────────────────────────────────────────────────────────────────────┐
 * useBagsStore: store de Zustand para gestionar mochilas en Nome.             │
 *                                                                             │
 * Funcionalidad:                                                              │
 *   • Mantiene un array de mochilas con su información y estado.              │
 *   • Persiste los datos en localStorage usando zustand/persist.              │
 *   • Permite añadir, actualizar y eliminar mochilas.                         │
 *   • Protege la mochila por defecto (“Clase”) para que no se borre.          │
 *                                                                             │
 * Estructura de una mochila:                                                  │
 *   • id: string único de la mochila.                                         │
 *   • name: nombre de la mochila.                                             │
 *   • color: color de la tarjeta (string).                                    │
 *   • capacity: capacidad máxima de items.                                    │
 *   • items: array o objeto con los items de la mochila.                      │
 *   • notifyDays: días para notificaciones automáticas.                       │
 *   • reminderTime: hora de recordatorio (string "HH:mm").                    │
 *   • tomorrow: objeto con estado de la mochila para el día siguiente.        │
 *       - date: fecha del día siguiente.                                      │
 *       - subjects: asignaturas marcadas.                                     │
 *       - extras: items extra marcados.                                       │
 *   • isTomorrowBagComplete: boolean, true si la mochila de mañana está lista.│
 *                                                                             │
 * Métodos del store:                                                          │
 *   • addBag(bag): añade una nueva mochila al array, aplicando valores por    │
 *     defecto y generando un id único.                                        │
 *   • updateBag(updatedBag): actualiza los campos de una mochila existente.   │
 *   • deleteBag(id): elimina una mochila por id, excepto la mochila por       │
 *     defecto (DEFAULT_BAG).                                                  │
 *                                                                             │
 * Valores devueltos:                                                          │
 *   • bags: array con todas las mochilas actuales.                            │
 *                                                                             │
 * Autor: Ana Castro                                                           │
 ─────────────────────────────────────────────────────────────────────────────*/

import { create } from "zustand";
import { persist } from "zustand/middleware";

const createBaseBag = (data = {}) => ({
    id: crypto.randomUUID(),
    name: "Nueva mochila",
    color: "purple-400",
    capacity: 20,
    items: [],
    notifyDays: [],
    reminderTime: "20:00",
    tomorrow: {
        date: null,
        subjects: [],
        extras: [],
    },
    isTomorrowBagComplete: false,
    ...data,
});

const DEFAULT_BAG = createBaseBag({
    id: "default-clase",
    name: "Clase",
    color: "red-400",
    items: { L: [], M: [], X: [], J: [], V: [] },
});

export const useBagsStore = create(
    persist(
        (set, get) => ({
            bags: get()?.bags?.length ? get().bags : [DEFAULT_BAG],

            addBag: (bag) =>
                set((state) => ({
                    bags: [...state.bags, createBaseBag(bag)],
                })),

            updateBag: (updatedBag) =>
                set((state) => ({
                    bags: state.bags.map((b) => (b.id === updatedBag.id ? { ...b, ...updatedBag } : b)),
                })),

            deleteBag: (id) =>
                set((state) => {
                    if (id === DEFAULT_BAG.id) return state;
                    return { bags: state.bags.filter((b) => b.id !== id) };
                }),
        }),
        {
            name: "bags-storage",
            getStorage: () => localStorage,
        }
    )
);
