/**──────────────────────────────────────────────────────────────────────────────┐
 * Componente DayTasksModal: modal emergente que muestra las tareas asociadas    │
 * a una fecha seleccionada en el calendario.                                    │
 *                                                                               │
 * Props:                                                                        │
 *   • isOpen (bool): controla si el modal está visible o no.                    │
 *   • onClose (func): función para cerrar el modal.                             │
 *   • tasks (array): lista de tareas del día seleccionado.                      │
 *   • selectedDate (string): fecha actualmente seleccionada en formato YMD.     │
 *   • openModalWithTask (func): abre el modal de edición/creación de tareas.    │
 *   • handleDeleteTask (func): elimina una tarea por su ID.                     │
 *   • toggleCompletedForDate (func): marca o desmarca como completada una tarea │
 *     en una fecha concreta.                                                    │
 *   • isTaskCompletedForDate (func): devuelve true si una tarea está completada │
 *     en la fecha seleccionada.                                                 │
 *                                                                               │ 
 * Autor: Ana Castro                                                             │
└───────────────────────────────────────────────────────────────────────────────*/

import { Modal } from "../commons/Modal";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonTrash } from "../commons/buttons/ButtonTrash";
import { ButtonPencil } from "../commons/buttons/ButtonPencil";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { ButtonCheck } from "../commons/buttons/ButtonCheck";
import { toLocalYMD } from "../../utils/dateUtils";

export const DayTasksModal = ({
    isOpen,
    onClose,
    tasks,
    selectedDate,
    openModalWithTask,
    handleDeleteTask,
    toggleCompletedForDate,
    isTaskCompletedForDate,
}) => (
    <Modal isOpen={isOpen}>
        <div className="relative bg-white p-4 rounded-md w-80 flex flex-col gap-2">
            <ButtonClose onClick={onClose} />

            <h2 className="text-xl font-bold mb-2 text-purple-600 mt-6 text-center">Tareas del día</h2>

            {tasks.length === 0 ? (
                <p className="text-center mt-2 mb-4">No hay tareas</p>
            ) : (
                <ul className="flex flex-col gap-1">
                    {tasks.map((task) => (
                        <li key={task.id} className="border-b py-1 text-gray-400 text-sm mt-2">
                            <div className="flex justify-between items-center">
                                <p
                                    className="text-gray-400"
                                    style={
                                        isTaskCompletedForDate(task.id, selectedDate)
                                            ? { textDecoration: "line-through", textDecorationColor: "#f87171" }
                                            : {}
                                    }
                                >
                                    <span className="text-purple-600"></span>[{task.hour}] {task.text}
                                </p>
                                <div className="flex gap-1 ml-1">
                                    <ButtonPencil onClick={() => openModalWithTask(task)} />
                                    <ButtonCheck onClick={() => toggleCompletedForDate(task.id, selectedDate)} />
                                    <ButtonTrash onClick={() => handleDeleteTask(task.id)} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <ButtonDefault onClick={() => openModalWithTask({})} text="Nueva tarea" />
        </div>
    </Modal>
);
