/**─────────────────────────────────────────────────────────────────────────────
 * Componente TaskSavedModal: modal de confirmación tras guardar una tarea.
 *
 * Funcionalidad:
 *   • Muestra un modal con un check verde indicando que la tarea se guardó correctamente.
 *   • Presenta los detalles de la tarea: texto, ubicación (sección y subcategoría),
 *     fecha y hora, recordatorio, repetición y aviso del día anterior.
 *   • Botón de cierre para cerrar el modal.
 *
 * Props:
 *   - task: objeto con la información de la tarea recién guardada. Debe contener al menos:
 *       • text: texto de la tarea
 *       • type: tipo de tarea
 *       • dateFull y hour (opcional)
 *       • notifyDayBefore: booleano indicando si hay aviso el día antes
 *   - onClose: función que cierra el modal.
 *
 * Hooks internos:
 *   - useTaskModalInfo: proporciona funciones para formatear ubicación, recordatorio y repetición.
 *   - useMemo: memoriza la ubicación de la tarea para evitar cálculos innecesarios.
 *
 * Autor: Ana Castro
└─────────────────────────────────────────────────────────────────────────────*/

import { useMemo } from "react";
import { useTaskModalInfo } from "../../../hooks/modals/useTaskModalInfo";
import { Modal } from "./Modal";
import { Check, Loader2 } from "lucide-react";
import { ButtonClose } from "../buttons/ButtonClose";

const TaskDetails = ({ task, location, formatReminder, formatRepeat }) => (
    <div className="mt-4 text-gray-600 w-full">
        <p className="text-gray-600 font-semibold mt-2">Tu tarea:</p>
        <p className="italic font-medium text-gray-400">“{task.text}”</p>

        <p className="text-gray-600 font-semibold mt-2">Se ha guardado en:</p>
        <p className="font-semibold text-gray-400">
            {location.seccion} → {location.subcategoria}
        </p>

        {location.dateText && (
            <>
                <p className="text-gray-600 font-semibold mt-2">Para el:</p>
                <p className="text-gray-400">{location.dateText}</p>
            </>
        )}

        <p className="text-gray-600 font-semibold mt-2">Cuando se notifica:</p>
        <p className="text-gray-400">{formatReminder(task)}</p>

        <p className="text-gray-600 font-semibold mt-2">Cuantas veces se repite:</p>
        <p className="text-gray-400">{formatRepeat(task)}</p>

        <p className="text-gray-600 font-semibold mt-2">Aviso el día antes?:</p>
        <p className="text-gray-400">{task.notifyDayBefore ? "Sí" : "No"}</p>
    </div>
);

export const TaskSavedModal = ({ task, loading, onClose }) => {
    const { getLocationMessage, formatRepeat, formatReminder } = useTaskModalInfo();
    const location = useMemo(() => (task ? getLocationMessage(task) : {}), [task]);

    return (
        <Modal isOpen={!!task || loading}>
            <div className="relative bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
                <div className="flex items-center justify-center text-lg text-gray-800 mt-6">
                    {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 text-gray-400 animate-spin mr-2" />
                            <span className="text-purple-600 text-xl">Procesando tarea…</span>
                        </>
                    ) : (
                        <>
                            <Check className="w-8 h-8 text-green-500 mr-1" />
                            <span className="text-purple-600 text-2xl">Tarea guardada</span>
                        </>
                    )}
                </div>

                {!loading && task && (
                    <TaskDetails
                        task={task}
                        location={location}
                        formatReminder={formatReminder}
                        formatRepeat={formatRepeat}
                    />
                )}

                <ButtonClose onClick={onClose} className="absolute" />
            </div>
        </Modal>
    );
};
