/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * Dates: componente que muestra las tareas clasificadas por tipo de cita.                         │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Obtiene todas las tareas usando `useTasks()` con posibilidad de filtrar/excluir tipos.      │
 *   • Filtra las tareas en tres categorías: citas, médico y otros mediante `useFilteredDates()`.  │
 *   • Permite alternar entre pestañas de categorías mediante `activeTab`.                         │
 *   • Muestra las tareas filtradas con `Tasks_list`.                                              │
 *   • Permite abrir, editar y cerrar tareas con `useTaskEditor()` y `TaskModalManager`.           │
 *   • Incluye tutorial contextual usando `useTutoDates()` y `TutoDates`.                          │
 *                                                                                                 │
 * Hooks y componentes utilizados:                                                                 │
 *   - useTasks: hook que maneja la lista de tareas filtradas.                                     │
 *   - useFilteredDates: hook que separa tareas por categoría.                                     │
 *   - useTaskEditor: hook para gestionar la edición y modales de tareas.                          │
 *   - useTutoDates: hook para mostrar tutorial de la sección.                                     │
 *   - Tasks_list: componente que renderiza la lista de tareas.                                    │
 *   - TaskModalManager: modal de edición de tareas.                                               │
 *   - button: componente estilizado para alternar pestañas.                                       │
 *   - TutoDates: componente de tutorial visual.                                                   │
 *                                                                                                 │
 * Props:                                                                                          │
 *   - type: string opcional para filtrar tipos de tarea.                                          │
 *   - exclude: boolean opcional para excluir ciertos tipos de tarea.                              │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";
import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/task/useTasks";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { useFilteredDates } from "../hooks/dates/useFilteredDates";
import { useTutorialStore } from "../store/useTutorialStore";
import { stepsDates } from "../components/tutorials/tutorials";
import { TutorialModal } from "../components/tutorials/TutorialModal";

export const Dates = ({ type, exclude = false }) => {
    const [activeTab, setActiveTab] = useState("citas");
    const { tasks, reload } = useTasks(type, exclude);
    const hideTutorial = useTutorialStore((state) => state.hideTutorial);
    const isHidden = useTutorialStore((state) => state.isHidden);
    const tutorialKey = `dates-${activeTab}`;
    const shouldShowTutorial = !isHidden(tutorialKey);
    const { citasTasks, medicoTasks, otrosTasks } = useFilteredDates(tasks);
    const { renderKey, isOpen, selectedTask, openModalWithTask, handleEdit, handleClose, showConfirmation } =
        useTaskEditor(reload);

    useEffect(() => {
        reload();
    }, [activeTab]);

    return (
        <div className="relative flex flex-col h-full items-center overflow-hidden">
            <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-14 mb-10">Citas</h2>

            <div className="w-full">
                <button
                    onClick={() => setActiveTab("citas")}
                    className={`relative px-6 py-2 border border-purple-400 border-l-black rounded-tr-xl font-semibold transition ${
                        activeTab === "citas" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                    }`}
                >
                    Citas
                </button>

                <button
                    onClick={() => setActiveTab("medico")}
                    className={`relative px-6 py-2 border border-purple-400 rounded-t-xl font-semibold transition ${
                        activeTab === "medico" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                    }`}
                >
                    Médicos
                </button>

                <button
                    onClick={() => setActiveTab("otros")}
                    className={`relative px-6 py-2 border border-purple-400 rounded-t-xl font-semibold transition ${
                        activeTab === "otros" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                    }`}
                >
                    Otros
                </button>
            </div>

            <div
                className={`relative pt-10 border border-black border-t-purple-400 -mt-0.5 w-full h-[100dvh] px-4 py-6 transition-colors duration-300 ${
                    activeTab === "citas" || activeTab === "medico" || activeTab === "otros"
                        ? "bg-black"
                        : "bg-gray-200"
                }`}
            >
                <Tasks_list
                    key={renderKey}
                    tasks={activeTab === "medico" ? medicoTasks : activeTab === "otros" ? otrosTasks : citasTasks}
                    openModalWithTask={openModalWithTask}
                    className="h-[80%]"
                />
            </div>

            <TaskModalManager
                isOpen={isOpen}
                selectedTask={selectedTask}
                showConfirmation={showConfirmation}
                onEdit={handleEdit}
                onClose={handleClose}
            />

            {shouldShowTutorial && (
                <TutorialModal
                    key={tutorialKey}
                    activeTab={tutorialKey}
                    steps={stepsDates[activeTab]}
                    isOpen={shouldShowTutorial}
                    onNeverShowAgain={() => hideTutorial(tutorialKey)}
                />
            )}
        </div>
    );
};
