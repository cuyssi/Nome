import { useMemo } from "react";

export const useFilteredDates = (tasks) => {
  const tiposExcluir = ["medico", "deberes", "trabajo", "examen", "otros"];

  const citasTasks = useMemo(() => {
    return tasks.filter((t) => {
      const tipos = Array.isArray(t.type) ? t.type : [t.type];
      return !tipos.some((tipo) => tiposExcluir.includes(tipo));
    });
  }, [tasks]);

  const medicoTasks = useMemo(() => {
    return tasks.filter((t) => {
      const tipos = Array.isArray(t.type) ? t.type : [t.type];
      return tipos.includes("medico");
    });
  }, [tasks]);

  const otrosTasks = useMemo(() => {
    return tasks.filter((t) => {
      const tipos = Array.isArray(t.type) ? t.type : [t.type];
      return tipos.includes("otros");
    });
  }, [tasks]);

  return { citasTasks, medicoTasks, otrosTasks };
};
