/**─────────────────────────────────────────────────────────────────────────────
 * Componente Home: pantalla principal de la aplicación.
 *
 * Funcionalidad:
 *   • Muestra el componente de bienvenida (`Welcome`) y contador de tareas (`Task_count`).
 *   • Incluye el grabador de voz (`Voice_rec`) con transcripción automática de tareas.
 *   • Gestiona el modal de tareas (`TaskModalManager`) para crear o editar tareas.
 *   • Muestra un tutorial inicial (`TutorialModal`) si el usuario no lo ha ocultado.
 *
 * Hooks internos:
 *   • useTaskEditor: maneja estado del modal, tarea seleccionada y confirmación de guardado.
 *   • useTutorialStore: controla visibilidad del tutorial y opción "no mostrar más".
 *
 * Autor: Ana Castro
 ─────────────────────────────────────────────────────────────────────────────*/

import Welcome from "../components/commons/Wellcome";
import Voice_rec from "../components/audio/Voice_rec";
import Task_count from "../components/task/Task_count";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { useTutorialStore } from "../store/useTutorialStore";
import { stepsHome } from "../components/tutorials/tutorials";
import { TutorialModal } from "../components/tutorials/TutorialModal";

export const Home = () => {
    const { isOpen, selectedTask, handleClose, handleEdit, openModalWithTask, showConfirmation, showTaskConfirmation } = useTaskEditor();
    const hideTutorial = useTutorialStore((state) => state.hideTutorial);
    const shouldShowTutorial = !useTutorialStore((state) => state.isHidden("home"));

    return (
        <div className="flex flex-col w-full h-full items-center bg-black overflow-hidden">
            <div className="flex flex-col w-full h-full items-center bg-black">
                <Welcome />
                <Task_count />
                <Voice_rec openModalWithTask={openModalWithTask} showConfirmationForTask={showTaskConfirmation} />

                <TaskModalManager
                    isOpen={isOpen}
                    selectedTask={selectedTask}
                    showConfirmation={showConfirmation}
                    onEdit={handleEdit}
                    onClose={handleClose}
                />

                {shouldShowTutorial && (
                    <TutorialModal
                        activeTab="home"
                        steps={stepsHome}
                        isOpen={shouldShowTutorial}
                        onNeverShowAgain={() => hideTutorial("home")}
                    />
                )}
            </div>
        </div>
    );
};
