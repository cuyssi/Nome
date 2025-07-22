/**─────────────────────────────────────────────────────────────────────────────┐
 * Store global de modal usando Zustand para gestionar estado centralizado.     │
 * Controla apertura/cierre del modal y almacena la tarea seleccionada.         │
 * Expuesto como hook `useModalStore` para interactuar con formularios y listas.│
 * Ideal para edición de tareas sin duplicar lógica entre componentes.          │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { create } from "zustand";

export const useModalStore = create((set) => ({
    isOpen: false,
    selectedTask: null,
    openModalWithTask: (task) => {
        console.log("Guardando en Zustand:", task);
        set({ isOpen: true, selectedTask: task });
    },

    closeModal: () => set({ isOpen: false, selectedTask: null }),
}));
