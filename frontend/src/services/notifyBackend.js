import axios from "axios";

export const notifyBackend = async (text, dateTime, deviceId, type = "task", notifyMinutesBefore = 15) => {
    const baseURL = import.meta.env.VITE_API_URL;

    try {
        await axios.post(`${baseURL}/schedule-task`, {
            text,
            dateTime,
            deviceId,
            type,
            notifyMinutesBefore,
        });
        console.log("📅 Tarea programada correctamente");
    } catch (error) {
        console.error("❌ Error notificando al backend:", error);
    }
};