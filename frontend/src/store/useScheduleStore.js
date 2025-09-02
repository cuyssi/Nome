import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useScheduleStore = create(
  persist(
    (set, get) => ({
      dias: ["L", "M", "X", "J", "V"],
      horas: ["08:15", "09:10", "10:05","11:00", "11:30", "12:25"],
      asignaturas: {},

      addHora: (hora) =>
        set((state) => ({
          horas: [...state.horas, hora].sort((a, b) => {
            const [h1, m1] = a.split(":").map(Number);
            const [h2, m2] = b.split(":").map(Number);
            return h1 - h2 || m1 - m2;
          }),
        })),

      removeHora: (hora) =>
        set((state) => {
          const asignaturas = { ...state.asignaturas };
          state.dias.forEach((dia) => delete asignaturas[`${dia}-${hora}`]);
          return {
            horas: state.horas.filter((h) => h !== hora),
            asignaturas,
          };
        }),

      setAsignatura: (dia, hora, nombre, color) =>
        set((state) => ({
          asignaturas: {
            ...state.asignaturas,
            [`${dia}-${hora}`]: { nombre, color },
          },
        })),

      setHora: (oldHora, newHora) =>
        set((state) => {
          const horas = state.horas.map((h) => (h === oldHora ? newHora : h));
          const asignaturas = {};
          Object.entries(state.asignaturas).forEach(([key, value]) => {
            const [dia, hora] = key.split("-");
            const nuevaHora = hora === oldHora ? newHora : hora;
            asignaturas[`${dia}-${nuevaHora}`] = value;
          });
          return { horas, asignaturas };
        }),
    }),
    {
      name: "horario-storage",
    }
  )
);
