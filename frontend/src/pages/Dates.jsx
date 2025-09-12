import { useState, useEffect } from "react";
import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/task/useTasks";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { useTaskEditor } from "../hooks/task/useTaskEditor";
import { Button } from "../components/commons/Button";
import { TutoDates } from "../components/tutorials/TutoDates";
import { useFilteredDates } from "../hooks/dates/useFilteredDates";
import { useTutoDates } from "../hooks/dates/useTutoDates";

export const Dates = ({ type, exclude = false }) => {
    const [activeTab, setActiveTab] = useState("citas");
    const { tasks, reload } = useTasks(type, exclude);
    const { shouldShowTutorial, setShowModal, hideTutorial } = useTutoDates(activeTab);
    const { citasTasks, medicoTasks, otrosTasks } = useFilteredDates(tasks);

    const {
        renderKey,
        isOpen, 
        selectedTask, 
        openModalWithTask, 
        handleEdit, 
        handleClose, 
        showConfirmation 
    } = useTaskEditor(reload);

    useEffect(() => {
        reload();
    }, [activeTab]);

    return (
        <div className="relative flex flex-col h-full items-center overflow-hidden">
            <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-14 mb-10">Citas</h2>

            <div className="w-full">
                <Button
                    onClick={() => setActiveTab("citas")}
                    className={`relative px-6 py-2 border border-purple-400 border-l-black rounded-tr-xl font-semibold transition ${
                        activeTab === "citas" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                    }`}
                >
                    Citas
                </Button>

                <Button
                    onClick={() => setActiveTab("medico")}
                    className={`relative px-6 py-2 border border-purple-400 rounded-t-xl font-semibold transition ${
                        activeTab === "medico" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                    }`}
                >
                    Médicos
                </Button>

                <Button
                    onClick={() => setActiveTab("otros")}
                    className={`relative px-6 py-2 border border-purple-400 rounded-t-xl font-semibold transition ${
                        activeTab === "otros" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                    }`}
                >
                    Otros
                </Button>
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
                <TutoDates activeTab={activeTab} setShowModal={setShowModal} hideTutorial={hideTutorial} />
            )}

        </div>
    );
};
