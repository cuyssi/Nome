/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente principal para mostrar, editar y organizar tareas en pestañas.    │
 * Separa la vista en "deberes" y "trabajos", permitiendo alternancia dinámica. │
 * Utiliza Zustand para persistir tareas y gestionar actualizaciones globales. │
 * Muestra las tareas en listas filtradas y permite edición con modal fluido.  │
 *                                                                             │
 * - Sincroniza tareas con el store a través del hook useTasks.                │
 * - Refresca automáticamente al montar mediante reload().                     │
 * - El componente es reactivo ante cambios en el store (Zustand persistente). │
 * - Estilos adaptados con transiciones visuales y jerarquía de colores.       │
 *                                                                             │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { Tasks_list } from "../components/task/Tasks_list";
import { useTasks } from "../hooks/useTasks";
import { Modal } from "../components/commons/Modal";
import { Form } from "../components/commons/Form";
import { useModalFlow } from "../hooks/openModalWithTask"

const Dates = ({ type, exclude = false }) => {
    const [activeTab, setActiveTab] = useState("citas");   
    const { tasks, reload } = useTasks(type, exclude);
    const {
        isOpen,
        selectedTask,
        openModalWithTask,
        handleEditTask,
        handleCloseModal,
        renderKey,
        showConfirmation
    } = useModalFlow(reload);    

    const tiposExcluir = ["medico", "deberes", "trabajo"];

    return (
        <div className="flex flex-col h-[100%] items-center overflow-hidden">
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
                    className={`relative px-6 py-2 border border-purple-400  rounded-t-xl font-semibold transition ${
                        activeTab === "medico" ? "bg-black border-b-black z-20 text-white " : "bg-gray-600 "
                    }`}
                >
                    Médicos
                </button>
            </div>
            <div
                className={`relative pt-10 border border-black border-t-purple-400 -mt-0.5 w-full h-[100dvh]  px-4 py-6 transition-colors duration-300 ${
                    activeTab === "citas" ? "bg-black" : activeTab === "medico" ? "bg-black" : "bg-gray-200"
                }`}
            >
                {activeTab === "medico" ? (
                    <Tasks_list
                        key={renderKey}
                        tasks={tasks.filter((t) =>
                            Array.isArray(t.type) ? t.type.includes("medico") : t.type === "medico"
                        )}
                        openModalWithTask={openModalWithTask}
                    />
                ) : (
                    <Tasks_list
                        key={renderKey}
                        tasks={tasks.filter((t) => {
                            const tipos = Array.isArray(t.type) ? t.type : [t.type];
                            return !tipos.some((tipo) => tiposExcluir.includes(tipo));
                        })}
                        openModalWithTask={openModalWithTask}
                    />
                )}
            </div>
            {isOpen ? (
                <Modal onClose={handleCloseModal}>
                    {showConfirmation ? (
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

export default Dates;
