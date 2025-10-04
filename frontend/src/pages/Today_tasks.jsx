/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * Today_tasks: página que muestra las tareas programadas para el día actual.                      │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Obtiene las tareas del día usando el hook `useTasks()`.                                     │
 *   • Filtra las tareas completadas/pendientes automáticamente para hoy.                          │
 *   • Permite abrir y editar tareas mediante `useTaskEditor()`.                                   │
 *   • Renderiza la lista de tareas con `Tasks_list` y gestiona el modal de edición con            │
 *     `TaskModalManager`.                                                                         │
 *                                                                                                 │
 * Hooks y componentes utilizados:                                                                 │
 *   - useTasks: hook para obtener, filtrar y actualizar tareas.                                   │
 *   - useTaskEditor: hook para manejar la lógica del modal de edición de tareas.                  │
 *   - useStorageStore: para actualizar tareas directamente si es necesario.                       │
 *   - Tasks_list: componente que renderiza la lista de tareas.                                    │
 *   - TaskModalManager: modal de edición de tareas con confirmación visual.                       │
 *   - TaskPageLayout: layout común para páginas de tareas con título.                             │
 *                                                                                                 │
 * Devuelve:                                                                                       │
 *   Renderiza la página de tareas de hoy con listado interactivo y modal de edición.              │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/task/useTasks";
import { useStorageStore } from "../store/storageStore";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { TaskPageLayout } from "../components/task/TaskPageLayout";

export const Today_tasks = () => {
    const { todayTasks, reload } = useTasks();
    const { updateTask } = useStorageStore();
    const { renderKey, isOpen, selectedTask, openModalWithTask, handleEdit, handleClose, showConfirmation } =
        useTaskEditor(reload, updateTask);

    return (
        <div className="w-full h-full">
            <TaskPageLayout title="Tareas para Hoy">
                <Tasks_list key={renderKey} tasks={todayTasks} openModalWithTask={openModalWithTask} />
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
