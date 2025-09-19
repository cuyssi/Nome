/**─────────────────────────────────────────────────────────────────────────────
 * useTranscription: hook para enviar audio, transcribir y crear tarea.
 *
 * - Usa `useTasks` para que las tareas se agreguen al store y se notifique al backend.
 * - Valida `dateTime` para asegurar que siempre sea ISO válido.
 *
 * Autor: Ana Castro
 ─────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { sendAudioFile } from "../../services/Task_services";
import { getFormattedTasks, dateAndTime } from "../../utils/transcriptionUtils";
import { getTaskColor } from "../task/useTaskColor";
import { useTaskType } from "../task/useTaskType";
import { useTasks } from "../task/useTasks";

export const useTranscription = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { addTask } = useTasks();
    const { getTaskType } = useTaskType();
    const { assignColor } = getTaskColor();
    const normalizeDateTime = (dt) => {
        try {
            if (!dt || isNaN(new Date(dt).getTime())) {
                return new Date().toISOString();
            }
            return new Date(dt).toISOString();
        } catch {
            return new Date().toISOString();
        }
    };

    const sendFile = async (file, options = {}) => {
        try {
            setIsProcessing(true);
            const response = await sendAudioFile(file);
            const { text_raw, text, dateTime: rawDateTime } = getFormattedTasks(response);
            const dateTime = normalizeDateTime(rawDateTime);
            const { date, hour, dateWithYear } = dateAndTime(dateTime);
            const type = getTaskType(text);
            const color = assignColor();
            const deviceId = options.deviceId || localStorage.getItem("deviceId");

            if (!deviceId) {
                console.warn("⚠️ No se encontró deviceId en localStorage");
            }

            await addTask({
                id: crypto.randomUUID(),
                dateTime,
                text_raw,
                text,
                date,
                dateFull: dateWithYear,
                hour,
                type,
                color,
                repeat: options.repeat || "once",
                customDays: options.customDays || [],
                reminder: options.reminder || 15,
                deviceId,
                notifyDayBefore: options.notifyDayBefore || false,
            });
        } catch (err) {
            console.error("❌ Error al enviar archivo de audio:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    return { sendFile, isProcessing };
};
