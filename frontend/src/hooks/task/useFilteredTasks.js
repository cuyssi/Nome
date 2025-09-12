import { useMemo } from "react";

export const useFilteredTasks = (tasks) => {
  const deberesTypes = ["deberes", "ejercicios", "estudiar"];
  const trabajoTypes = ["trabajo"];
  const examenesTypes = ["examen", "prueba", "evaluación"];

  const deberesTasks = useMemo(() => {
    return tasks.filter((t) => {
      const tipos = Array.isArray(t.type) ? t.type : [t.type];
      return tipos.some((tipo) => deberesTypes.includes(tipo));
    });
  }, [tasks]);

  const trabajoTasks = useMemo(() => {
    return tasks.filter((t) => {
      const tipos = Array.isArray(t.type) ? t.type : [t.type];
      return tipos.includes("trabajo");
    });
  }, [tasks]);

  const examenesTasks = useMemo(() => {
    return tasks.filter((t) => {
      const tipos = Array.isArray(t.type) ? t.type : [t.type];
      return tipos.some((tipo) => examenesTypes.includes(tipo));
    });
  }, [tasks]);

  return { deberesTasks, trabajoTasks, examenesTasks };
};
