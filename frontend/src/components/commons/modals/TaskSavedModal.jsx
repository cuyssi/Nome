/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente TaskSavedModal: muestra un modal de confirmación tras guardar
 * una tarea.
 * 
 * Funcionalidad:
 *   • Muestra un modal usando Modal.
 *   • Indica que la tarea se ha guardado correctamente con un icono de check.
 *   • Muestra el texto de la tarea y la ubicación (sección y subcategoría)
 *     donde se ha guardado, usando GetTaskLocationMessage.
 *   • Botón de cierre para cerrar el modal.
 * 
 * Props:
 *   - task: objeto de la tarea recién guardada. Debe contener al menos:
 *       • text: texto de la tarea
 *       • type: tipo de tarea ("cita", "médicos", "deberes", etc.)
 *       • dateFull y hour (opcional): fecha y hora de la tarea
 *   - onClose: función que cierra el modal.
 * 
 * Autor: Ana Castro
└──────────────────────────────────────────────────────────────────────────────*/
import { useTaskModalInfo } from "../../../hooks/modals/useTaskModalInfo";
import { Modal } from "./Modal";
import { Check } from "lucide-react";
import { ButtonClose } from "../buttons/ButtonClose";

export const TaskSavedModal = ({ task, isProcessing, onClose }) => {
    const { getLocationMessage, formatRepeat, formatReminder } = useTaskModalInfo();

    if (!task && !isProcessing) return null;

    const { seccion, subcategoria, dateText } = task ? getLocationMessage(task) : {};

    return (
        <Modal isOpen={!!task || isProcessing}>
            <div className="relative bg-white rounded-2xl shadow-lg p-10 max-w-md w-full">
                <div className="flex items-center justify-center text-lg text-gray-800 mt-6">
                    {!isProcessing && <Check className="w-8 h-8 text-green-500 mr-1" />}
                    <span className="text-purple-600 text-2xl">
                        {isProcessing ? "Procesando audio..." : "Tarea guardada"}
                    </span>
                </div>

                <div className="flex items-center justify-center">
                    <div className="mt-4 text-gray-600 w-full text-center">
                        {isProcessing ? (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                                <p className="text-gray-600 mt-4">Espere por favor, cargando tarea...</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-600 font-semibold mt-2">Tu tarea:</p>
                                <p className="italic font-medium text-gray-400">“{task.text}”</p>

                                <p className="text-gray-600 font-semibold mt-2">Se ha guardado en:</p>
                                <p className="font-semibold text-gray-400">
                                    {seccion} → {subcategoria}
                                </p>

                                <p className="text-gray-600 font-semibold mt-2">Para el:</p>
                                {dateText && <p className="text-gray-400">{dateText}</p>}

                                <p className="text-gray-600 font-semibold mt-2">Cuando se notifica:</p>
                                <p className="text-gray-400">{formatReminder(task)}</p>

                                <p className="text-gray-600 font-semibold mt-2">Cuantas veces se repite:</p>
                                <p className="text-gray-400">{formatRepeat(task)}</p>
                                <p className="text-gray-600 font-semibold mt-2">Aviso el día antes?:</p>
                                <p className="text-gray-400">{task.notifyDayBefore ? "Sí" : "No"}</p>
                            </>
                        )}
                    </div>
                </div>

                <ButtonClose onClick={onClose} className="absolute" />
            </div>
        </Modal>
    );
};
