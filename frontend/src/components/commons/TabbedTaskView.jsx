/**─────────────────────────────────────────────────────────────────────────────────┐
 * Componente TabbedTaskView: vista genérica de tareas con pestañas.                │
 * Permite mostrar y editar tareas filtradas por categoría en pestañas dinámicas    │
 * con soporte para tutoriales contextuales y modales de edición.                   │
 *                                                                                  │
 * Props:                                                                           │
 *   • title: string → título principal mostrado en la cabecera.                    │
 *   • tabLabels: string[] → nombres de las pestañas (ej. ["deberes", "examenes"]). │
 *   • tabTasks: objeto → tareas filtradas por pestaña, con clave igual a cada tab. │
 *   • tutorialSteps: objeto → pasos del tutorial por pestaña.                      │
 *   • tutorialKeyPrefix: string → prefijo para identificar el tutorial por pestaña.│
 *   • reload: función → refresca las tareas desde el store.                        │
 *   • useEditor: hook → gestiona la edición de tareas y el estado del modal.       │
 *                                                                                  │
 * Autor: Ana Castro                                                                │
└──────────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";
import { Tasks_list } from "../task/Tasks_list";
import { TaskModalManager } from "../task/TaskModalManager";
import { TutorialModal } from "../tutorials/TutorialModal";
import { useTutorialStore } from "../../store/useTutorialStore";

export const TabbedTaskView = ({ title, tabLabels, tabTasks, tutorialSteps, tutorialKeyPrefix, reload, useEditor }) => {
    const [activeTab, setActiveTab] = useState(tabLabels[0]);
    const hideTutorial = useTutorialStore((state) => state.hideTutorial);
    const isHidden = useTutorialStore((state) => state.isHidden);
    const tutorialKey = `${tutorialKeyPrefix}-${activeTab}`;
    const shouldShowTutorial = !isHidden(tutorialKey);

    const { isOpen, selectedTask, openModalWithTask, handleEdit, handleClose, renderKey, showConfirmation } =
        useEditor(reload);

    useEffect(() => {
        reload();
    }, [activeTab]);

    return (
        <div className="flex flex-col h-full justify-start overflow-hidden">
            <h2 className="text-purple-400 font-bold font-poppins text-4xl text-center mt-14 mb-10">{title}</h2>

            <div className="flex w-[80%]">
                {tabLabels.map((tab, index) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative w-full p-2 border-2 border-gray-500 rounded-t-xl transition
              ${activeTab === tab ? "tabActive" : "tabs"}
              ${index === 0 ? (activeTab === tab ? "border-l-bg rounded-tl-none" : "rounded-tl-none") : ""}
            `}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="flex flex-col pt-14 items-center relative border-bg border-2 border-t-gray-500 w-full h-[100vh] px-2 py-6 transition-colors duration-300 bg-bg mt-[-2px]">
                <Tasks_list key={renderKey} tasks={tabTasks[activeTab]} openModalWithTask={openModalWithTask} />
            </div>

            {shouldShowTutorial && (
                <TutorialModal
                    key={tutorialKey}
                    activeTab={tutorialKey}
                    steps={tutorialSteps[activeTab]}
                    isOpen={shouldShowTutorial}
                    onNeverShowAgain={() => hideTutorial(tutorialKey)}
                />
            )}

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
