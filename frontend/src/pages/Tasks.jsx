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
import { Button } from "../components/commons/Button";
import { useTutoTask } from "../hooks/task/useTutoTask";
import { TutoTasks } from "../components/tutorials/TutoTasks";
import { useFilteredTasks } from "../hooks/task/useFilteredTasks";

export const Tasks = ({ type, exclude }) => {
    const [activeTab, setActiveTab] = useState("deberes");
    const { tasks, reload } = useTasks(type, exclude);
    const { deberesTasks, trabajoTasks, examenesTasks } = useFilteredTasks(tasks);
    const { shouldShowTutorial, setShowModal, hideTutorial } = useTutoTask(activeTab);

    const {
        isOpen,
        selectedTask,
        openModalWithTask,
        handleEdit: handleEditTask,
        handleClose: handleCloseModal,
        renderKey,
        showConfirmation,
    } = useTaskEditor(reload);

    useEffect(() => {
        reload();
    }, [activeTab]);

    return (
        <div className="flex flex-col h-full items-center overflow-hidden">
            <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-14 mb-10">Tareas</h2>
            <div className="w-full">
                <Button
                    onClick={() => setActiveTab("deberes")}
                    className={`relative px-6 py-2 border border-purple-400 border-l-black rounded-tr-xl font-semibold transition ${
                        activeTab === "deberes" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                    }`}
                >
                    Deberes
                </Button>

                <Button
                    onClick={() => setActiveTab("trabajo")}
                    className={`relative px-6 py-2 border border-purple-400 rounded-t-xl font-semibold transition ${
                        activeTab === "trabajo" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                    }`}
                >
                    Trabajos
                </Button>

                <Button
                    onClick={() => setActiveTab("examenes")}
                    className={`flex-1 relative px-6 py-2 border border-purple-400 rounded-t-xl font-semibold transition ${
                        activeTab === "examenes" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                    }`}
                >
                    Exámenes
                </Button>
            </div>

            <div
                className={`flex flex-col pt-14 items-center relative border border-black border-t-purple-400 -mt-0.5 w-full h-[100vh] px-4 py-6 transition-colors duration-300 ${
                    ["deberes", "trabajo", "examenes"].includes(activeTab) ? "bg-black" : "bg-gray-200"
                }`}
            >
                <Tasks_list
                    key={renderKey}
                    tasks={
                        activeTab === "trabajo" ? trabajoTasks : activeTab === "examenes" ? examenesTasks : deberesTasks
                    }
                    openModalWithTask={openModalWithTask}
                />
            </div>

            {shouldShowTutorial && (
                <TutoTasks activeTab={activeTab} setShowModal={setShowModal} hideTutorial={hideTutorial} />
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
