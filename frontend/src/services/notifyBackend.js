import axios from "axios";

export const cancelTaskBackend = async (id, deviceId) => {
    const baseURL = import.meta.env.VITE_API_URL;
    try {
        await axios.post(`${baseURL}/cancel-task`, { id, deviceId });
    } catch (error) {
        console.error("❌ Error cancelando tarea en backend:", error);
    }
};

export const notifyBackend = async (id, text, dateTime, deviceId, type = "task", notifyMinutesBefore = 15, url) => {
    const baseURL = import.meta.env.VITE_API_URL;

    try {   
        console.log(
        `📦 Enviando al backend → id: ${id}, text: "${text}", dateTime: "${dateTime}", deviceId: "${deviceId}", type: "${type}", notifyMinutesBefore: ${notifyMinutesBefore}, url: "${url}"`
        );
     
        await axios.post(`${baseURL}/schedule-task`, {
            id,
            text,
            dateTime,
            deviceId,
            type,
            notifyMinutesBefore,
            data: { url }
        });
        console.log(`url: ${url}`)
        console.log("📅 Tarea programada correctamente");
    } catch (error) {
        console.error("❌ Error notificando al backend:", error);
    }
};