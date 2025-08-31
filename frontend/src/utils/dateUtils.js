export const buildDateTimeFromManual = (date, hour) => {
    if (!date) return null;
    const d = new Date(`${date}T${hour || "00:00"}`);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
};



export const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};
