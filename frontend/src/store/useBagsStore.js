import { create } from "zustand";
import { persist } from "zustand/middleware";

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

      addBag: (bag) => set({ bags: [...get().bags, bag] }),
      deleteBag: (id) =>
        set({ bags: get().bags.filter((b) => b.id !== id) }),
      editBag: (updatedBag) => {
        const updatedBags = get().bags.map((b) =>
          b.id === updatedBag.id ? updatedBag : b
        );
        set({ bags: updatedBags });
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
