/**─────────────────────────────────────────────────────────────────────────────
 * useTaskInfo: hook para centralizar la información legible de una tarea.
 *
 * Funcionalidad:
 *   • getLocationMessage(task): devuelve JSX con sección, subcategoría y opcionalmente fecha y hora.
 *   • formatRepeat(task): devuelve un string legible de la repetición de la tarea.
 *   • formatReminder(task): devuelve un string legible del recordatorio.
 *
 * Autor: Ana Castro
 ─────────────────────────────────────────────────────────────────────────────*/

import { FULL_DAYS, DAYS } from "../../utils/constants";

export const useTaskModalInfo = () => {
    const getLocationMessage = (task) => {
        if (!task || !task.type) return { seccion: "Tareas", subcategoria: "", dateText: "" };

        let seccion, subcategoria;
        
        switch (task.type) {
            case "cita":
                seccion = "Agenda";
                subcategoria = "Citas";
                break;
            case "médicos":
            case "medicos":
                seccion = "Agenda";
                subcategoria = "Médicos";
                break;
            case "otros":
                seccion = "Agenda";
                subcategoria = "Otros";
                break;
            case "deberes":
                seccion = "Escuela";
                subcategoria = "Deberes";
                break;
            case "trabajo":
                seccion = "Escuela";
                subcategoria = "Trabajos";
                break;
            case "examen":
                seccion = "Escuela";
                subcategoria = "Exámenes";
                break;
            default:
                seccion = "Tareas";
                subcategoria = "";
                break;
        }

        const dateText = task.dateFull && task.hour ? `${task.dateFull}, a las: ${task.hour}` : "";

        return { seccion, subcategoria, dateText };
    };

    const formatCustomDays = (customDays) => {
        return customDays
            .map((i) => {
                const dayKey = DAYS[i]?.key;
                return FULL_DAYS[dayKey];
            })
            .filter(Boolean)
            .join(", ");
    };

    const formatRepeat = (task) => {
        if (!task) return "-";
        if (task.repeat === "once") return "Solo una vez";
        if (task.repeat === "daily") return "Todos los días";
        if (task.repeat === "weekdays") return "De lunes a viernes";
        if (task.repeat === "weekend") return "Solo fines de semana";
        if (task.repeat === "custom" && task.customDays?.length) {
            return formatCustomDays(task.customDays);
        }
        return "-";
    };

    const formatReminder = (task) => {
        if (!task || !task.reminder) return "5 minutos antes";
        if (task.reminder < 60) return `${task.reminder} minutos antes`;
        if (task.reminder === 60) return "1 hora antes";
        if (task.reminder === 90) return "1 hora y media antes";
        if (task.reminder === 120) return "2 horas antes";
        return `${task.reminder} minutos antes`;
    };

    return { getLocationMessage, formatRepeat, formatReminder };
};
