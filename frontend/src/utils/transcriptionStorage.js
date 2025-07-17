export const addToTranscriptionStorage = (response) => {
    try {
        const existing = JSON.parse(localStorage.getItem("transcriptionHistory")) || [];
        const updated = [...existing, response];
        localStorage.setItem("transcriptionHistory", JSON.stringify(updated));
    } catch (err) {
        console.error("❌ Error al enviar:", err);
    }
};

export const getTranscriptionOfStorage = () => {
    try {
        const response = JSON.parse(localStorage.getItem("transcriptionHistory"));
        return response;
    } catch (err) {
        console.error("❌ Error al recibir transcripciones:", err);
    }
}

export const sortedTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
        const [dayA, monthA] = a.date.split("/").map(Number);
        const [hourA, minuteA] = a.hour.split(":").map(Number);
        const [dayB, monthB] = b.date.split("/").map(Number);
        const [hourB, minuteB] = b.hour.split(":").map(Number);

        const dateA = new Date(2025, monthA - 1, dayA, hourA, minuteA);
        const dateB = new Date(2025, monthB - 1, dayB, hourB, minuteB);

        return dateA - dateB; // orden ascendente
    });
};

export const getFormattedTasks = (transcription) => {
    const text_raw = transcription.text_raw
    const text = transcription.text
    const dateTime = transcription.datetime
    return {text_raw, text, dateTime}
}

export const dateAndTime = (data) => {
    try {
        const formattedDate = new Date(data);
        const day = formattedDate.getDate();
        const month = formattedDate.getMonth() + 1;
        const date = `${day}/${month}`;        

        const hours = formattedDate.getHours();
        const mins = formattedDate.getMinutes();
        const hour = `${hours}:${mins < 10 ? '0' + mins : mins}`;       

        return { date, hour };
    } catch (err) {
        console.error("❌ dateAndTime failed:", err);
        return { date: undefined, hour: undefined };
    }
};



