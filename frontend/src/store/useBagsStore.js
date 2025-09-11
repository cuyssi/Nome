import { create } from "zustand";
import { persist } from "zustand/middleware";
import { formatDateForBackend } from "../utils/formatDateForBackend";
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
                const updatedBags = get().bags.map((b) =>
                    b.id === updatedBag.id ? updatedBag : b
                );
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
                    await cancelTaskBackend(id, deviceId); // ✅ cancela notificación
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
