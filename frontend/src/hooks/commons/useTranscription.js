/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook personalizado para enviar archivos de audio y obtener transcripciones.  │
 * Procesa la respuesta, formatea texto y extrae fecha, hora y tipo de tarea.   │
 * Añade automáticamente la tarea transcrita al almacenamiento local.           │
 * Muestra un estado de carga y confirma visualmente cuando se completa.        │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { sendAudioFile } from "../../services/Task_services";
import { getFormattedTasks, dateAndTime } from "../../utils/transcriptionUtils";
import { getTaskColor } from "../task/useTaskColor";
import { useStorageStore } from "../../store/storageStore";
import { useTaskType } from "../task/useTaskType";
import { formatDateForBackend } from "../../utils/formatDateForBackend";
import { buildReminderUrl } from "../../utils/buildReminderUrl"
import { notifyBackend } from "../../services/notifyBackend";

export const useTranscription = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { addTask } = useStorageStore();
    const { getTaskType } = useTaskType();

    const sendFile = async (file, options = {}) => {
        try {
            setIsProcessing(true);

            const response = await sendAudioFile(file);
            const { text_raw, text, dateTime } = getFormattedTasks(response);
            const { date, hour, dateWithYear } = dateAndTime(dateTime);
            const type = getTaskType(text);
            const { assignColor } = getTaskColor();
            const color = assignColor();

            const dateTimeFormatted = formatDateForBackend(dateTime);

            addTask({
                id: crypto.randomUUID(),
                dateTime: dateTimeFormatted,
                text_raw,
                text,
                date,
                dateFull: dateWithYear,
                hour,
                type,
                color,
                repeat: options.repeat || "once",
                customDays: options.customDays || [],
            });
            
        } catch (err) {
            console.error("❌ Error al enviar:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    return { sendFile, isProcessing };
};
