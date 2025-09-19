/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * useBagsStore: store de Zustand para manejar mochilas y sus notificaciones.                      │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • bags: array de mochilas.                                                                    │
 *     Cada mochila contiene: id, name, color, capacity y items (por días de la semana).           │
 *                                                                                                 │
 *   • addBag(bag)                                                                                 │
 *       - Añade una mochila nueva al array.                                                       │
 *       - Envía recordatorio al backend si existe dateTime y deviceId.                            │
 *                                                                                                 │
 *   • editBag(updatedBag)                                                                         │
 *       - Reemplaza la mochila existente con los datos actualizados.                              │
 *       - Cancela recordatorio anterior y notifica al backend de la nueva fecha/hora.             │
 *                                                                                                 │
 *   • updateBag(updatedBag)                                                                       │
 *       - Alias de editBag.                                                                       │
 *                                                                                                 │
 *   • deleteBag(id)                                                                               │
 *       - Elimina la mochila del array.                                                           │
 *       - Cancela la notificación asociada en el backend si existe deviceId.                      │
 *                                                                                                 │
 *   • isTomorrowBagComplete: boolean                                                              │
 *       - Flag que indica si la mochila de mañana está completa.                                  │
 *   • setTomorrowBagComplete(value)                                                               │
 *       - Setter para isTomorrowBagComplete.                                                      │
 *                                                                                                 │
 * Integración con Backend:                                                                        │
 *   - notifyBackend y cancelTaskBackend se usan para programar o cancelar recordatorios.          │
 *   - buildReminderUrl genera la URL de referencia para notificaciones de mochila.                │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { formatDateForBackend } from "../utils/dateUtils";
import { buildReminderUrl } from "../utils/buildReminderUrl";
import { notifyBackend, cancelTaskBackend } from "../services/notifyBackend";

export const useBagsStore = create(
    persist(
        (set, get) => ({
            bags: get()?.bags || [
                {
                    id: "default-escolar",
                    name: "Escolar",
                    color: "red-400",
                    capacity: 20,
                    items: {
                        L: [],
                        M: [],
                        X: [],
                        J: [],
                        V: [],
                    },
                },
            ],

            addBag: async (bag) => {
                set({ bags: [...get().bags, bag] });

                const deviceId = localStorage.getItem("deviceId");
                if (!deviceId || !bag.dateTime || !bag.name) return;

                const isoDate = formatDateForBackend(bag.dateTime);
                const url = buildReminderUrl("bag", bag.name);

                await notifyBackend(
                    bag.id,
                    `📚 Recordatorio de mochila: ${bag.name}`,
                    isoDate,
                    deviceId,
                    "bag",
                    Number(bag.reminder) || 15,
                    url
                );
            },

            editBag: async (updatedBag) => {
                const updatedBags = get().bags.map((b) => (b.id === updatedBag.id ? updatedBag : b));
                set({ bags: updatedBags });

                const deviceId = localStorage.getItem("deviceId");
                if (!deviceId || !updatedBag.dateTime || !updatedBag.name) return;

                await cancelTaskBackend(updatedBag.id, deviceId); // ✅ cancela anterior

                const isoDate = formatDateForBackend(updatedBag.dateTime);
                const url = buildReminderUrl("bag", updatedBag.name);

                await notifyBackend(
                    updatedBag.id,
                    `📚 Recordatorio de mochila: ${updatedBag.name}`,
                    isoDate,
                    deviceId,
                    "bag",
                    Number(updatedBag.reminder) || 15,
                    url
                );
            },

            updateBag: async (updatedBag) => {
                await get().editBag(updatedBag);
            },

            deleteBag: async (id) => {
                set({ bags: get().bags.filter((b) => b.id !== id) });

                const deviceId = localStorage.getItem("deviceId");
                if (deviceId) {
                    await cancelTaskBackend(id, deviceId);
                }
            },

            isTomorrowBagComplete: false,
            setTomorrowBagComplete: (value) => set({ isTomorrowBagComplete: value }),
        }),
        {
            name: "bags-storage",
            getStorage: () => localStorage,
        }
    )
);
