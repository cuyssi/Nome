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

export const Tasks_list = ({ type, exclude = false, openModalWithTask }) => {
    const { tasks, deleteTask } = useTasks(type, exclude);
    console.log("openModalWithTask es:", openModalWithTask);
    console.log("tasks en Tasks_list:", tasks);

    return (
        <div className="flex flex-col gap-8 items-center w-full h-[74%] overflow-y-auto px-2 py-4 ">
            {tasks.map((task) => {
                return (
                    <Task_card key={task.id} task={task} onDelete={deleteTask} onEdit={() => openModalWithTask(task)} />
                );
            })}
        </div>
    );
};
