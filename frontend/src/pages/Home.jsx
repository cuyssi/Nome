/**─────────────────────────────────────────────────────────────────────────────
 * Componente Home: pantalla principal de la aplicación.
 *
 * Funcionalidad:
 *   • Muestra el componente de bienvenida (`Welcome`) y contador de tareas (`Task_count`).
 *   • Incluye el grabador de voz (`Voice_rec`) con transcripción automática de tareas.
 *   • Gestiona el modal de tareas (`TaskModalManager`) para crear o editar tareas.
 *   • Muestra un tutorial inicial (`TutorialModal`) si el usuario no lo ha ocultado.
 *   • Muestra un modal de confirmación (`TaskSavedModal`) cuando una tarea se ha guardado.
 *
 * Hooks internos:
 *   - useTaskEditor: gestiona el estado del modal de tareas, tarea seleccionada y confirmación de guardado.
 *   - useTutorialStore: controla la visibilidad del tutorial y la opción "no mostrar más".
 *   - useState: mantiene el estado local de la tarea guardada para el modal de confirmación.
 *
 * Props:
 *   Este componente no recibe props externas.
 *
 * Autor: Ana Castro
└─────────────────────────────────────────────────────────────────────────────*/

import Welcome from "../components/commons/Wellcome";
import { Voice_rec } from "../components/audio/Voice_rec";
import Task_count from "../components/task/Task_count";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { useTutorialStore } from "../store/useTutorialStore";
import { stepsHome } from "../components/tutorials/tutorials";
import { TutorialModal } from "../components/tutorials/TutorialModal";
import { useState, useEffect } from "react";
import { TaskSavedModal } from "../components/commons/modals/TaskSavedModal";

export const Home = () => {
    const { isOpen, selectedTask, handleClose, handleEdit, openModalWithTask, showConfirmation } = useTaskEditor();
    const hideTutorial = useTutorialStore((state) => state.hideTutorial);
    const shouldShowTutorial = !useTutorialStore((state) => state.isHidden("home"));
    const [savedTask, setSavedTask] = useState(null);
    const [showSavedModal, setShowSavedModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    return (
        <div className="flex flex-col w-full h-full items-center bg-[var(--color-bg)] overflow-hidden">
            <div className="flex flex-col w-full h-full items-center bg-bg">
                <Welcome />

                <Task_count />

                <Voice_rec
                    openModalWithTask={openModalWithTask}
                    setSavedTask={setSavedTask}
                    setShowSavedModal={setShowSavedModal}
                    setModalLoading={setModalLoading}
                />

                <TaskModalManager
                    isOpen={isOpen}
                    selectedTask={selectedTask}
                    showConfirmation={showConfirmation}
                    onEdit={handleEdit}
                    onClose={handleClose}
                />

                {showSavedModal && (
                    <TaskSavedModal
                        task={savedTask}
                        loading={modalLoading}
                        onClose={() => {
                            setShowSavedModal(false);
                            setSavedTask(null);
                            setModalLoading(false);
                        }}
                    />
                )}

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
