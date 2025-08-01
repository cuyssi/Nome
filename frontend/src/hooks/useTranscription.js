/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook personalizado para enviar archivos de audio y obtener transcripciones.  │
 * Procesa la respuesta, formatea texto y extrae fecha, hora y tipo de tarea.   │
 * Añade automáticamente la tarea transcrita al almacenamiento local.           │
 * Muestra un estado de carga y confirma visualmente cuando se completa.        │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { sendAudioFile } from "../services/Task_services";
import { getFormattedTasks, dateAndTime } from "../utils/transcriptionUtils";
import { getTaskColor } from "./useTaskColor";
import { normalizeType } from "../utils/normalizeType";
import { inferType } from "../utils/inferType";
import { useStorageStore } from "../store/storageStore";
import { useState } from "react";

export const useTranscription = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState(false);
    const { addTask } = useStorageStore();

    const sendFile = async (file) => {
        console.log("📤 Enviando archivo:", file);
        try {
            setIsProcessing(true);
            const response = await sendAudioFile(file);
            const { text_raw, text, dateTime, isToday } = getFormattedTasks(response);
            const { date, hour } = dateAndTime(dateTime);
            console.log(date);
            const type = response.type;
            const { assignColor } = getTaskColor();
            const color = assignColor();
            console.log(dateTime);

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
                isToday,
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
