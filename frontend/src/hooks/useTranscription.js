/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook personalizado para enviar archivos de audio y obtener transcripciones.  │
 * Procesa la respuesta, formatea texto y extrae fecha, hora y tipo de tarea.   │
 * Añade automáticamente la tarea transcrita al almacenamiento local.           │
 * Muestra un estado de carga y confirma visualmente cuando se completa.        │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { sendAudioFile } from "../services/Task_services";
import { getFormattedTasks, dateAndTime } from "../utils/transcriptionUtils";
import { getTaskColor } from "./useTaskColor";
import { useStorageStore } from "../store/storageStore";
import { useTaskType } from "./useTaskType";

export const useTranscription = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState(false);
    const { addTask } = useStorageStore();
    const { getTaskType } = useTaskType(); // 👈 aquí

    const sendFile = async (file) => {
        try {
            setIsProcessing(true);
            const response = await sendAudioFile(file);
            const { text_raw, text, dateTime } = getFormattedTasks(response);
            const { date, hour } = dateAndTime(dateTime);

            const type = getTaskType(text); // 👈 inferido limpio
            const { assignColor } = getTaskColor();
            const color = assignColor();

            addTask({
                id: crypto.randomUUID(),
                dateTime,
                text_raw,
                text,
                date,
                hour,
                type,
                color,
                completed: false,
            });
        } catch (err) {
            console.error("❌ Error al enviar:", err);
        } finally {
            setIsProcessing(false);
            setConfirmationMessage(true);
            setTimeout(() => setConfirmationMessage(false), 3000);
        }
    };

    return { sendFile, isProcessing, confirmationMessage };
};
