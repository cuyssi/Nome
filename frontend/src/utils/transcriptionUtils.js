/**─────────────────────────────────────────────────────────────────────────────┐
 * Conjunto de utilidades para gestionar transcripciones de voz como tareas.    │
 * - addToTranscriptionStorage: guarda una nueva tarea en localStorage.         │
 * - getTranscriptionOfStorage: obtiene todas las tareas transcritas guardadas. │
 * - sortedTasks: ordena por fecha y hora en orden ascendente.                  │
 * - getFormattedTasks: extrae campos clave desde transcripción recibida.       │
 * - dateAndTime: formatea objeto `Date` a estructura { date, hour }.           │
 * - deleteTranscriptionById: elimina una tarea específica por ID.              │
 * - updateTranscriptionById: actualiza datos de una tarea por ID.              │
 * Ideal para conectar el flujo de voz a interfaz visual con persistencia local.│
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

export const getFormattedTasks = (transcription) => {
    const text_raw = transcription.text_raw;
    const text = transcription.text;
    const dateTime = transcription.datetime;
    const isToday = transcription.isToday;
    return { text_raw, text, dateTime, isToday };
};

export const dateAndTime = (data) => {
    try {
        const formattedDate = new Date(data);
        const day = formattedDate.getDate();
        const month = formattedDate.getMonth() + 1;
        const date = `${day}/${month}`;

        const hours = formattedDate.getHours();
        const mins = formattedDate.getMinutes();
        const hour = `${hours}:${mins < 10 ? "0" + mins : mins}`;

        return { date, hour };
    } catch (err) {
        console.error("❌ dateAndTime failed:", err);
        return { date: undefined, hour: undefined };
    }
};
