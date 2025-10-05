/**─────────────────────────────────────────────────────────────────────────────
 * useTranscription: hook para enviar un archivo de audio, transcribirlo y 
 * crear una tarea automáticamente.
 *
 * Funcionalidad:
 *   • Envía el audio al backend usando `sendAudioFile`.
 *   • Convierte la respuesta en tarea(s) formateadas con fecha, hora, tipo, 
 *     color y recordatorio.
 *   • Añade la tarea al store usando `useTasks` y notifica al backend si 
 *     corresponde.
 *   • Normaliza la fecha/hora para asegurar un ISO válido.
 *   • Gestiona estado de procesamiento para mostrar loaders o avisos.
 *
 * Parámetros de sendFile(file, options):
 *   - file: archivo de audio a enviar.
 *   - options: objeto con opciones adicionales:
 *       • deviceId: id del dispositivo (por defecto se toma de localStorage).
 *       • reminder: minutos antes del recordatorio (default: 15).
 *       • notifyDayBefore: boolean para aviso el día anterior (default: false).
 *       • onTaskSaved: callback que se ejecuta tras guardar la tarea.
 *
 * Devuelve:
 *   • sendFile: función para enviar y procesar un archivo de audio.
 *   • isProcessing: boolean indicando si se está procesando la transcripción.
 *
 * Autor: Ana Castro
 ─────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { sendAudioFile } from "../../services/Task_services";
import { getFormattedTasks, dateAndTime } from "../../utils/transcriptionUtils";
import { getTaskColor } from "../task/useTaskColor";
import { useTasks } from "../task/useTasks";

export const useTranscription = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { addTask } = useTasks();
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
        setIsProcessing(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await sendAudioFile(file, { signal: controller.signal });

            const {
                text_raw,
                text,
                dateTime: rawDateTime,
                type,
                isToday,
                repeat,
                customDays,
            } = getFormattedTasks(response);

            const dateTime = normalizeDateTime(rawDateTime);
            const { date, hour, dateWithYear } = dateAndTime(dateTime);
            const color = assignColor();
            const deviceId = options.deviceId || localStorage.getItem("deviceId");

            if (!deviceId) console.warn("⚠️ No se encontró deviceId en localStorage");

            const newTask = {
                id: crypto.randomUUID(),
                dateTime,
                text_raw,
                text,
                date,
                dateFull: dateWithYear,
                hour,
                type,
                color,
                isToday,
                repeat: repeat || "once",
                customDays: customDays || [],
                reminder: options.reminder || 15,
                deviceId,
                notifyDayBefore: options.notifyDayBefore || false,
            };

            await addTask(newTask);

            if (options.onTaskSaved) options.onTaskSaved(newTask);
        } catch (err) {
            if (err.name === "AbortError") {
                console.warn("⏱️ Timeout: la transcripción tardó demasiado");
            } else {
                console.error("❌ Error al enviar archivo de audio:", err);
            }
        } finally {
            clearTimeout(timeoutId);
            setIsProcessing(false);
        }
    };

    return { sendFile, isProcessing };
};
