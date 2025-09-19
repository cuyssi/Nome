/**──────────────────────────────────────────────────────────────────────────────┐
 * Funciones útiles para manejar fechas y horas en Nome:                         │
 *                                                                               │
 *   • buildDateTimeFromManual(date, hour) → string                              │
 *       Convierte una fecha y hora manual a un string ISO válido.               │
 *                                                                               │
 *   • isToday(dateString) → boolean                                             │
 *       Comprueba si la fecha dada corresponde al día de hoy.                   │
 *                                                                               │
 *   • formatDateForBackend(date) → string                                       │
 *       Formatea una fecha a ISO con offset para enviar al backend.             │
 *                                                                               │
 *   • toLocalDateTimeString(date) → string                                      │
 *       Convierte un objeto Date a string ISO local incluyendo offset.          │
 *                                                                               │
 *   • toLocalYMD(date) → string                                                 │
 *       Convierte un objeto Date a string en formato YYYY-MM-DD.                │
 *                                                                               │
 * Autor: Ana Castro                                                             │
└───────────────────────────────────────────────────────────────────────────────*/

export const buildDateTimeFromManual = (date, hour) => {
    if (!date) return null;
    const d = new Date(`${date}T${hour || "00:00"}`);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
};

export const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    console.log("🔍 dateUtil:", dateString, "→", date, "vs", today);
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};

export const formatDateForBackend = (date, anticipada = false) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    console.log("hola desde formatDateForBackend", dateObj);

    let finalDate = dateObj;

    if (anticipada) {
        finalDate = new Date(dateObj);
        finalDate.setDate(finalDate.getDate() - 1);
        finalDate.setHours(12, 0, 0, 0);
    }

    const day = String(finalDate.getDate()).padStart(2, "0");
    const month = String(finalDate.getMonth() + 1).padStart(2, "0");
    const year = finalDate.getFullYear();
    const hours = String(finalDate.getHours()).padStart(2, "0");
    const minutes = String(finalDate.getMinutes()).padStart(2, "0");

    const offset = -finalDate.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const absOffset = Math.abs(offset);
    const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    const offsetMinutes = String(absOffset % 60).padStart(2, "0");

    const formatted = `${year}-${month}-${day}T${hours}:${minutes}:00${sign}${offsetHours}:${offsetMinutes}`;
    console.log("lo que manda el format:", formatted);

    return formatted;
};

export const toLocalDateTimeString = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const absOffset = Math.abs(offset);
    const hoursOffset = String(Math.floor(absOffset / 60)).padStart(2, "0");
    const minutesOffset = String(absOffset % 60).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
        date.getMinutes()
    )}:00${sign}${hoursOffset}:${minutesOffset}`;
};

export const toLocalYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
