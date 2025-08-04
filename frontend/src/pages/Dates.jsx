import { useState } from "react";
import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/useTasks";
import { TaskModalManager } from "../components/task/TaskModalManager";
import { useTaskEditor } from "../hooks/useTaskEditor";
import { useStorageStore } from "../store/storageStore";

const Dates = ({ type, exclude = false }) => {
    const [activeTab, setActiveTab] = useState("citas");
    const { tasks, reload } = useTasks(type, exclude);
    const { updateTask } = useStorageStore();

    const { renderKey, isOpen, selectedTask, openModalWithTask, handleEdit, handleClose, showConfirmation } =
        useTaskEditor(reload, updateTask);

    const tiposExcluir = ["medico", "deberes", "trabajo"];

    const citasTasks = tasks.filter((t) => {
        const tipos = Array.isArray(t.type) ? t.type : [t.type];
        return !tipos.some((tipo) => tiposExcluir.includes(tipo));
    });

    const medicoTasks = tasks.filter((t) => (Array.isArray(t.type) ? t.type.includes("medico") : t.type === "medico"));

    return (
        <div className="flex flex-col h-full items-center overflow-hidden">
            <h2 className="text-purple-400 font font-bold font-poppins text-4xl underline-offset-8 decoration-[3px] mt-14 mb-10">
                Citas
            </h2>

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
            </div>

            <div
                className={`relative pt-10 border border-black border-t-purple-400 -mt-0.5 w-full h-[100dvh] px-4 py-6 transition-colors duration-300 ${
                    activeTab === "citas" ? "bg-black" : activeTab === "medico" ? "bg-black" : "bg-gray-200"
                }`}
            >
                {activeTab === "medico" ? (
                    <Tasks_list key={renderKey} tasks={medicoTasks} openModalWithTask={openModalWithTask} />
                ) : (
                    <Tasks_list key={renderKey} tasks={citasTasks} openModalWithTask={openModalWithTask} />
                )}
            </div>

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

export default Dates;
