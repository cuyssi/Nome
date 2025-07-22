/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook personalizado para enviar archivos de audio y obtener transcripciones.  │
 * Procesa la respuesta, formatea texto y extrae fecha, hora y tipo de tarea.   │
 * Añade automáticamente la tarea transcrita al almacenamiento local.           │
 * Muestra un estado de carga y confirma visualmente cuando se completa.        │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { sendAudioFile } from "../services/Task_services";
import { getFormattedTasks, dateAndTime, addToTranscriptionStorage } from "../utils/transcriptionStorage";
import { getTaskColor } from "../utils/getTaskColor";
import { normalizeType } from "../utils/normalizeType";
import { useState } from "react";

export const useTranscription = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState(false);
    const sendFile = async (file) => {
        console.log("📤 Enviando archivo:", file);
        try {
            setIsProcessing(true);
            const response = await sendAudioFile(file);
            console.log("📝 Transcripción recibida:", response);
            const { text_raw, text, dateTime } = getFormattedTasks(response);
            const { date, hour } = dateAndTime(dateTime);
            const text_clean = normalizeType(text);
            const { type, base: color } = getTaskColor(text_clean);
            addToTranscriptionStorage({ id: crypto.randomUUID(), text_raw, text, date, hour, type, color });
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
