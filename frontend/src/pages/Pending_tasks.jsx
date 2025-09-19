/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * Pending_tasks: componente que muestra las tareas pendientes para el día actual.                 │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Obtiene todas las tareas de hoy usando `useTasks()`.                                        │
 *   • Filtra las tareas pendientes mediante `isTaskCompletedForDate`.                             │
 *   • Permite abrir, editar y cerrar tareas con `useTaskEditor()` y `TaskModalManager`.           │
 *   • Renderiza las tareas pendientes dentro de `TaskPageLayout` y `Tasks_list`.                  │
 *                                                                                                 │
 * Hooks y componentes utilizados:                                                                 │
 *   - useTasks: hook que maneja la lista de tareas filtradas.                                     │
 *   - useStorageStore: hook que permite consultar y actualizar el estado de las tareas.           │
 *   - useTaskEditor: hook para gestionar la edición y modales de tareas.                          │
 *   - Tasks_list: componente que renderiza la lista de tareas.                                    │
 *   - TaskModalManager: modal de edición de tareas.                                               │
 *   - TaskPageLayout: layout general para páginas de tareas.                                      │
 *   - toLocalYMD: utilidad para obtener la fecha local en formato YYYY-MM-DD.                     │
 *                                                                                                 │
 * Devuelve:                                                                                       │
 *   Renderiza directamente la lista de tareas pendientes y gestiona la apertura de modales.       │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/task/useTasks";
import { useStorageStore } from "../store/storageStore";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { TaskPageLayout } from "../components/task/TaskPageLayout";
import { toLocalYMD } from "../utils/dateUtils";

export const Pending_tasks = () => {
    const { todayTasks, reload } = useTasks();
    const { updateTask, isTaskCompletedForDate } = useStorageStore();
    const todayYMD = toLocalYMD(new Date());
    const pendingTasks = todayTasks.filter((task) => !isTaskCompletedForDate(task.id, todayYMD));

    const { renderKey, isOpen, selectedTask, openModalWithTask, handleEdit, handleClose, showConfirmation } =
        useTaskEditor(reload, updateTask);

    return (
        <TaskPageLayout title="Tareas Pendientes">
            <Tasks_list key={renderKey} tasks={pendingTasks} openModalWithTask={openModalWithTask} />
            <TaskModalManager
                isOpen={isOpen}
                selectedTask={selectedTask}
                showConfirmation={showConfirmation}
                onEdit={handleEdit}
                onClose={handleClose}
            />
        </TaskPageLayout>
    );
};
