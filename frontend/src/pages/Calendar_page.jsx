/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * Calendar_page: componente principal de la vista del Calendario.                                 │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Muestra un calendario interactivo usando el componente `Calendar`.                          │
 *   • Permite buscar tareas mediante `TaskSearch`.                                                │
 *   • Gestiona la creación y edición de tareas con `TaskModalManager` y el hook `useTaskEditor`.  │
 *   • Controla la visibilidad de tutoriales usando `useTutoCalendar` y muestra `TutoCalendar`.    │
 *                                                                                                 │
 * Componentes y hooks utilizados:                                                                 │
 *   - Calendar: calendario visual que muestra tareas y permite abrir modales de edición.          │
 *   - TaskSearch: buscador de tareas para el calendario.                                          │
 *   - TaskModalManager: modal para crear/editar tareas.                                           │
 *   - useTaskEditor: hook que centraliza la lógica de edición y creación de tareas.               │
 *   - useTutoCalendar / TutoCalendar: tutorial interactivo para la vista de calendario.           │
 *                                                                                                 │
 * Funciones principales:                                                                          │
 *   - openModalWithTask(task): abre el modal para editar o crear una tarea.                       │
 *   - handleEdit(updatedTask): guarda cambios en la tarea y cierra el modal con confirmación.     │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { Calendar } from "../components/calendar/Calendar";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { TaskSearch } from "../components/task/TaskSearch";
import { useTutorialStore } from "../store/useTutorialStore";
import { stepsCalendar } from "../components/tutorials/tutorials";
import { TutorialModal } from "../components/tutorials/TutorialModal";

export const Calendar_page = () => {
    const { isOpen, selectedTask, handleClose, handleEdit, openModalWithTask, showConfirmation } = useTaskEditor();
    const hideTutorial = useTutorialStore((state) => state.hideTutorial);
    const shouldShowTutorial = !useTutorialStore((state) => state.isHidden("calendar"));

    return (
        <div className="flex flex-col items-center h-screen bg-black p-4">
            <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-10 mb-10">Calendario</h2>
            <Calendar openModalWithTask={openModalWithTask} />
            <TaskSearch openModalWithTask={openModalWithTask} />
            <TaskModalManager
                isOpen={isOpen}
                selectedTask={selectedTask}
                showConfirmation={showConfirmation}
                onEdit={handleEdit}
                onClose={handleClose}
            />
            {shouldShowTutorial && (
                <TutorialModal
                    activeTab="calendar"
                    steps={stepsCalendar}
                    isOpen={shouldShowTutorial}
                    onNeverShowAgain={() => hideTutorial("calendar")}
                />
            )}
        </div>
    );
};
