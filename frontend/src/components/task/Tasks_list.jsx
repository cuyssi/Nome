/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente que renderiza una lista de tareas con scroll vertical.            │
 * Recorre las tareas disponibles y las muestra como tarjetas individuales.     │
 * Permite editar o eliminar cada tarea a través de callbacks pasados por props.│
 * Usa un hook de tareas para obtener y manipular los datos desde el store.     │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { Task_card } from "./Task_card";
import { useTasks } from "../../hooks/useTasks";

export const Tasks_list = ({ tasks = [], openModalWithTask, className = "" }) => {
  return (
    <div className={`flex flex-col gap-8 items-center w-full h-[74%] overflow-y-auto px-2 py-4 ${className}`}>
      {tasks.map((task) => (
        <Task_card
          key={task.id}
          task={task}
          onDelete={() => {}} // Si no necesitas eliminar aquí, puedes dejarlo vacío
          onEdit={() => openModalWithTask(task)}
        />
      ))}
    </div>
  );
};
