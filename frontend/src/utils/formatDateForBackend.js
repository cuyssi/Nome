export const formatDateForBackend = (date) => {
    // Si ya es Date, no hace nada; si es string, lo convierte
    const dateObj = typeof date === "string" ? new Date(date) : date;
    console.log("hola desde formatDateForBackend", dateObj);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    const offset = -dateObj.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const absOffset = Math.abs(offset);
    const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    const offsetMinutes = String(absOffset % 60).padStart(2, "0");

    console.log(`lo que manda el format: ${year}-${month}-${day}T${hours}:${minutes}:00${sign}${offsetHours}:${offsetMinutes}`);

    return `${year}-${month}-${day}T${hours}:${minutes}:00${sign}${offsetHours}:${offsetMinutes}`;
};