/**──────────────────────────────────────────────────────────────────────────────────────────┐
 * Componente Calendar: muestra un calendario mensual con tareas asociadas a fechas.         │
 *                                                                                           │
 * Props:                                                                                    │
 *   • openModalWithTask: función que abre un modal para crear o editar una tarea.           │
 *                                                                                           │
 * Funcionamiento:                                                                           │
 *   • Usa el hook useCalendarTasks para manejar la lógica de tareas:                        │
 *       - tasksByDate(date): devuelve las tareas de una fecha concreta.                     │
 *       - selectedDateTasks: tareas del día actualmente seleccionado.                       │
 *       - isModalOpen / setIsModalOpen: control del modal de tareas.                        │
 *       - handleDateClick(date): al hacer click en un día se selecciona la fecha.           │
 *       - handleDeleteTask(id): elimina una tarea.                                          │
 *       - toggleCompletedForDate(taskId, date): marca o desmarca una tarea como completada. │
 *       - isTaskCompletedForDate(taskId, date): devuelve true si la tarea está completada.  │
 *       - selectedDate: fecha actualmente seleccionada.                                     │
 *   • Renderiza FullCalendar con:                                                           │
 *       - Vista mensual (dayGridMonth) y navegación previa/siguiente.                       │
 *       - Estilo especial para el día actual.                                               │
 *       - Indicadores de color según si todas las tareas del día están completadas.         │
 *   • Modal de tareas del día seleccionado:                                                 │
 *       - Lista las tareas con opciones para editar, marcar completadas o borrar.           │
 *       - Botón para añadir nueva tarea usando openModalWithTask.                           │
 *                                                                                           │
 * Autor: Ana Castro                                                                         │
 *──────────────────────────────────────────────────────────────────────────────────────────*/

import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarTasks } from "../../hooks/calendar/useCalendarTasks";
import { toLocalYMD } from "../../utils/dateUtils";
import { DayTasksModal } from "./DayTasksModal";

export const Calendar = ({ openModalWithTask }) => {
    const {
        tasksByDate,
        selectedDateTasks,
        isModalOpen,
        setIsModalOpen,
        handleDateClick,
        handleDeleteTask,
        selectedDate,
        toggleCompletedForDate,
        isTaskCompletedForDate,
    } = useCalendarTasks();

    return (
        <div className="w-full max-w-md mx-auto bg-bg text-purple-400">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                firstDay={1}
                locale={esLocale}
                headerToolbar={{ right: "prev,next" }}
                titleFormat={{ year: "numeric", month: "long" }}
                contentHeight={372}
                fixedWeekCount={false}
                dayCellClassNames={(arg) =>
                    arg.isToday ? "text-white font-poppins bg-gray-600" : "text-purple-400 font-bold font-poppins"
                }
                dayCellContent={(arg) => {
                    const tasks = tasksByDate(arg.date) || [];
                    const dateStr = toLocalYMD(arg.date);
                    const allCompleted = tasks.length > 0 && tasks.every((t) => isTaskCompletedForDate(t.id, dateStr));
                    const pointColor = allCompleted ? "bg-green-500" : "bg-red-500";

                    return (
                        <>
                            <div>{arg.dayNumberText}</div>
                            {tasks.length > 0 && (
                                <div className={`w-2 h-2 rounded-full mt-1 mx-auto ${pointColor}`}></div>
                            )}
                        </>
                    );
                }}
                dateClick={handleDateClick}
            />

            <DayTasksModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tasks={selectedDateTasks}
                selectedDate={selectedDate}
                openModalWithTask={openModalWithTask}
                handleDeleteTask={handleDeleteTask}
                toggleCompletedForDate={toggleCompletedForDate}
                isTaskCompletedForDate={isTaskCompletedForDate}
            />
        </div>
    );
};
