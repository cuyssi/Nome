import axios from "axios";

export const notifyBackend = async (text, dateTime) => {
    const baseURL = import.meta.env.VITE_API_URL;
    const deviceId = localStorage.getItem("deviceId");

    try {
        await axios.post(`${baseURL}/schedule-task`, {
            text,
            dateTime,
            deviceId,
        });
        console.log("📅 Tarea programada correctamente");
    } catch (error) {
        console.error("❌ Error notificando al backend:", error);
    }
};
