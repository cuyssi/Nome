/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * Completed_tasks: componente que muestra las tareas completadas del día actual.                  │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Obtiene las tareas del día usando `useTasks()`.                                             │
 *   • Filtra solo las tareas marcadas como completadas mediante `isTaskCompletedForDate`.         │
 *   • Permite abrir, editar y cerrar tareas usando `useTaskEditor()` y `TaskModalManager`.        │
 *   • Se integra dentro del layout genérico `TaskPageLayout` para consistencia visual.            │
 *                                                                                                 │
 * Hooks y componentes utilizados:                                                                 │
 *   - useTasks: hook que gestiona las tareas y sus filtros.                                       │
 *   - useTaskEditor: hook que centraliza la lógica de abrir, editar y confirmar tareas.           │
 *   - useStorageStore: store para verificar si una tarea está completada en la fecha actual.      │
 *   - TaskModalManager: modal para edición de tareas.                                             │
 *   - TaskPageLayout: layout genérico para páginas de tareas.                                     │
 *   - Tasks_list: lista visual de tareas.                                                         │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { useTasks } from "../hooks/task/useTasks";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { TaskPageLayout } from "../components/task/TaskPageLayout";
import { Tasks_list } from "../components/task/Tasks_list";
import { useStorageStore } from "../store/storageStore";
import { toLocalYMD } from "../utils/dateUtils";

export const Completed_tasks = () => {
    const { todayTasks } = useTasks();
    const { isTaskCompletedForDate } = useStorageStore();
    const todayYMD = toLocalYMD(new Date());
    const completedTasks = todayTasks.filter((task) => isTaskCompletedForDate(task.id, todayYMD));
    const { renderKey, isOpen, selectedTask, openModalWithTask, handleEdit, handleClose, showConfirmation } =
        useTaskEditor();

    return (
        <div className="w-full h-full">
            <TaskPageLayout title="Tareas Completadas">
                <Tasks_list key={renderKey} tasks={completedTasks} openModalWithTask={openModalWithTask} />
            </TaskPageLayout>{" "}
            <TaskModalManager
                isOpen={isOpen}
                selectedTask={selectedTask}
                showConfirmation={showConfirmation}
                onEdit={handleEdit}
                onClose={handleClose}
            />
        </div>
    );
};
