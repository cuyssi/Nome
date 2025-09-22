/**
 * ──────────────────────────────────────────────────────────────────────────────
 * useBagsStore: Zustand store para manejar mochilas en Nome.
 *
 * Funcionalidad:
 *   • Mantiene el estado local de mochilas.
 *   • Incluye siempre una mochila "Escolar" que no se puede borrar.
 *   • Acciones CRUD: addBag, updateBag, deleteBag (con protección).
 *   • Flag isTomorrowBagComplete para control de estado adicional.
 *
 * Nota:
 *   - La lógica de notificaciones (notifyBackend, cancelTaskBackend) NO está aquí,
 *     vive en useBag.js para mantener DRY.
 *
 * Autor: Ana Castro
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_BAG = {
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
};

export const useBagsStore = create(
  persist(
    (set, get) => ({
      bags: get()?.bags?.length ? get().bags : [DEFAULT_BAG],

      addBag: (bag) =>
        set((state) => ({
          bags: [...state.bags, bag],
        })),

      updateBag: (updatedBag) =>
        set((state) => ({
          bags: state.bags.map((b) =>
            b.id === updatedBag.id ? { ...b, ...updatedBag } : b
          ),
        })),

      deleteBag: (id) =>
        set((state) => {
          if (id === DEFAULT_BAG.id) return state;
          return {
            bags: state.bags.filter((b) => b.id !== id),
          };
        }),

      isTomorrowBagComplete: false,
      setTomorrowBagComplete: (value) =>
        set({ isTomorrowBagComplete: value }),
    }),
    {
      name: "bags-storage",
      getStorage: () => localStorage,
    }
  )
);
