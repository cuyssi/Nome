import axios from "axios"

export const notifyBackend = async (text, dateTime) => {
    const baseURL = import.meta.env.VITE_API_URL;
    try {
        await axios.post(`${baseURL}/schedule-task`, {
            text: text,
            dateTime: dateTime,
        });
    } catch (error) {
        console.error("Error notificando al backend:", error);
    }
};
