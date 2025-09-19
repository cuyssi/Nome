/**────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 * Componente principal para mostrar, editar y organizar tareas en pestañas.    │
 * Separa la vista en "deberes" y "trabajos", permitiendo alternancia dinámica. │
 * Utiliza Zustand para persistir tareas y gestionar actualizaciones globales.  │
 * Muestra las tareas en listas filtradas y permite edición con modal fluido.   │
 *                                                                              │
 * - Sincroniza tareas con el store a través del hook useTasks.                 │
 * - Refresca automáticamente al montar mediante reload().                      │
 * - El componente es reactivo ante cambios en el store (Zustand persistente).  │
 * - Estilos adaptados con transiciones visuales y jerarquía de colores.        │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └───────────────────────────────────────────────────────────────────────────────**/

import { useState, useEffect } from "react";
import { Tasks_list } from "../components/task/Tasks_list";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { useTasks } from "../hooks/task/useTasks";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { useTutorialStore } from "../store/useTutorialStore";
import { stepsTasks } from "../components/tutorials/tutorials";
import { TutorialModal } from "../components/tutorials/TutorialModal";
import { useFilteredTasks } from "../hooks/task/useFilteredTasks";

const TAB_LABELS = ["deberes", "trabajo", "examenes"];

export const Tasks = () => {
    const [activeTab, setActiveTab] = useState("deberes");
    const { tasks, reload } = useTasks();
    const { deberesTasks, trabajoTasks, examenesTasks } = useFilteredTasks(tasks);
    const hideTutorial = useTutorialStore((state) => state.hideTutorial);
    const isHidden = useTutorialStore((state) => state.isHidden);
    const tutorialKey = `dates-${activeTab}`;
    const shouldShowTutorial = !isHidden(tutorialKey);

    const {
        isOpen,
        selectedTask,
        openModalWithTask,
        handleEdit: handleEditTask,
        handleClose: handleCloseModal,
        renderKey,
        showConfirmation,
    } = useTaskEditor(reload);

    const tabTasks = {
        deberes: deberesTasks,
        trabajo: trabajoTasks,
        examenes: examenesTasks,
    };

    useEffect(() => reload(), [activeTab]);

    return (
        <div className="flex flex-col h-full items-center overflow-hidden">
            <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-14 mb-10">Tareas</h2>

            <div className="flex w-full">
                {TAB_LABELS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-6 py-2 border border-purple-400 rounded-t-xl font-semibold transition ${
                            activeTab === tab ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="flex flex-col pt-14 items-center relative border border-black border-t-purple-400 -mt-0.5 w-full h-[100vh] px-4 py-6 transition-colors duration-300 bg-black">
                <Tasks_list key={renderKey} tasks={tabTasks[activeTab]} openModalWithTask={openModalWithTask} />
            </div>

            {shouldShowTutorial && (
                <TutorialModal
                    key={tutorialKey}
                    activeTab={tutorialKey}
                    steps={stepsTasks[activeTab]}
                    isOpen={shouldShowTutorial}
                    onNeverShowAgain={() => hideTutorial(tutorialKey)}
                />
            )}

            <TaskModalManager
                isOpen={isOpen}
                selectedTask={selectedTask}
                showConfirmation={showConfirmation}
                onEdit={handleEditTask}
                onClose={handleCloseModal}
            />
        </div>
    );
};
