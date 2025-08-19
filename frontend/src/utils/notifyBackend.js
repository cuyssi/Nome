import axios from "axios"

export const notifyBackend = async (text, dateTime) => {
    try {
        await axios.post("http://localhost:8000/schedule-task", {
                text: text,
                dateTime: dateTime,
            });
    } catch (error) {
        console.error("Error notificando al backend:", error);
    }
};
