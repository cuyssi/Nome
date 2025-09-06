import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useScheduleStore = create(
  persist(
    (set, get) => ({
      days: ["L", "M", "X", "J", "V"],
      hours: ["08:15", "09:10", "10:05", "11:00", "11:30", "12:25", "13:20"],
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
