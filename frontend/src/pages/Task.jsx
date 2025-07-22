import { useState } from "react";
import { Tasks_list } from "../components/task/Tasks_list";

import { updateTranscriptionById } from "../utils/transcriptionStorage";
import { useTasks } from "../hooks/useTasks";
import { Modal } from "../components/commons/Modal";
import { Form } from "../components/commons/Form";
import { useModalStore } from "../store/modalStore";

const Task = ({ type, exclude }) => {
    const [activeTab, setActiveTab] = useState("deberes");
    const { reload } = useTasks(type, exclude);
    const [renderKey, setRenderKey] = useState(0);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const { isOpen, selectedTask, openModalWithTask, closeModal } = useModalStore();
   
    const handleEditTask = (updatedTask) => {
        updateTranscriptionById(updatedTask.id, updatedTask);
        reload();
        setRenderKey((prev) => prev + 1);
        setShowModalConfirmation(true);

        setTimeout(() => {
            setShowModalConfirmation(false);
            closeModal();
        }, 1500);
    };

    return (
        <div className="flex flex-col bg-black h-[100%] justify-center items-center border border-black">
            <h2 className="text-purple-400 font font-bold font-poppins text-4xl underline-offset-8 decoration-[3px] mt-6 mb-10">
                Tareas
            </h2>

            <div className="w-full mt-2">
                <button
                    onClick={() => setActiveTab("deberes")}
                    className={`relative px-6 py-2 border border-purple-400 border-l-black rounded-tr-xl font-semibold transition ${
                        activeTab === "deberes" ? "bg-black border-b-black z-20 text-white" : "bg-gray-600"
                    }`}
                >
                    Deberes
                </button>
                <button
                    onClick={() => setActiveTab("trabajo")}
                    className={`relative px-6 py-2 border border-purple-400  rounded-t-xl font-semibold transition ${
                        activeTab === "trabajo" ? "bg-black border-b-black z-20 text-white " : "bg-gray-600 "
                    }`}
                >
                    Trabajos
                </button>
            </div>
            <div
                className={`flex flex-col pt-14 items-center relative border border-black border-t-purple-400 -mt-0.5 w-full h-[100vh] px-4 py-6 transition-colors duration-300 ${
                    activeTab === "deberes" ? "bg-black" : activeTab === "trabajo" ? "bg-black" : "bg-gray-200"
                }`}
            >
                {activeTab === "trabajo" ? (
                    <Tasks_list key={`tasks-${renderKey}`} type="trabajo" openModalWithTask={openModalWithTask} />
                ) : (
                    <Tasks_list
                        key={`tasks-${renderKey}`}
                        type={["deberes", "ejercicios", "estudiar"]}
                        openModalWithTask={openModalWithTask}
                    />
                )}
            </div>
            {isOpen ? (
                <Modal onClose={closeModal}>
                    {showModalConfirmation ? (
                        <p className="text-green-500 text-center font-semibold animate-fadeIn">
                            ✅ Cambios guardados con éxito
                        </p>
                    ) : selectedTask && selectedTask.id ? (
                        <Form task={selectedTask} onSubmit={handleEditTask} onClose={closeModal} />
                    ) : (
                        <p className="text-yellow-300 text-center">Cargando tarea seleccionada…</p>
                    )}
                </Modal>
            ) : null}
        </div>
    );
};

export default Task;
