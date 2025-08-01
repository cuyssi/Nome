import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/useTasks";
import { useState } from "react";
import { useStorageStore } from "../store/storageStore";
import { Modal } from "../components/commons/Modal";
import { Form } from "../components/commons/Form";
import { useModalStore } from "../store/modalStore";


const Today_tasks = ({ type, exclude = false }) => {
  const { todayTasks } = useTasks();
  const [activeTab, setActiveTab] = useState("citas");
    const { reload } = useTasks(type, exclude);
    const [renderKey, setRenderKey] = useState(0);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const { isOpen, selectedTask, openModalWithTask, closeModal } = useModalStore();
    const { updateTask } = useStorageStore();
    const { tasks } = useTasks(type, exclude);

    const handleCloseModal = () => {
    setRenderKey((prev) => prev + 1);
    closeModal();
};

    const handleEditTask = (updatedTask) => {
        updateTask(updatedTask);
        reload();
        setRenderKey((prev) => prev + 1);
        setShowModalConfirmation(true);

        setTimeout(() => {
            setShowModalConfirmation(false);
            closeModal();
        }, 1500);
    };

    const tiposExcluir = ["medico", "deberes", "trabajo"];


  return (
    <div className="flex flex-col h-[100%] items-center overflow-hidden">
            <h2 className="flex justify-center text-purple-400 font font-bold font-poppins text-3xl underline-offset-8 decoration-[3px] mt-14 mb-14">
                Tareas para Hoy
            </h2>
            <div className="w-[90%] h-[90%]">
                <Tasks_list tasks={todayTasks} openModalWithTask={openModalWithTask} />
            </div>
            {isOpen ? (
                <Modal onClose={handleCloseModal}>
                    {showModalConfirmation ? (
                        <p className="text-green-500 text-center font-semibold animate-fadeIn">
                            ✅ Cambios guardados con éxito
                        </p>
                    ) : selectedTask && selectedTask.id ? (
                        <Form task={selectedTask} onSubmit={handleEditTask} onClose={handleCloseModal} />
                    ) : (
                        <p className="text-yellow-300 text-center">Cargando tarea seleccionada…</p>
                    )}
                </Modal>
            ) : null}
        </div>
    );
};

export default Today_tasks;
