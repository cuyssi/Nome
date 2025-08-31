import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button} from "./Button";
import { Modal } from "./Modal";
import { X, Trash2, Pencil } from "lucide-react";
import { useCalendarTasks } from "../../hooks/useCalendarTasks";

export const Calendar = ({ openModalWithTask }) => {
    const {
        tasksByDate,
        selectedDateTasks,
        isModalOpen,
        setIsModalOpen,
        handleDateClick,
        toLocalYMD,
        handleDeleteTask,
    } = useCalendarTasks();

    return (
        <div className="w-full max-w-md mx-auto bg-black text-red-400">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{ right: "prev,next" }}
                titleFormat={{ year: "numeric", month: "long" }}
                dayCellClassNames={(arg) =>
                    arg.isToday
                        ? "text-white font-poppins bg-gray-600"
                        : "text-purple-400 font-bold font-poppins"
                }
                dayCellContent={(arg) => {
                    const dateStr = toLocalYMD(arg.date);
                    const tasks = tasksByDate[dateStr] || [];                   
                    const allCompleted = tasks.length > 0 && tasks.every((t) => t.completed);
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
                height="auto"
                dateClick={handleDateClick}
            />
            
            <Modal isOpen={isModalOpen}>
                <div className="relative bg-white p-4 rounded-md w-80 flex flex-col gap-2">                    
                    <Button
                        className="absolute top-2 right-2 text-red-400 hover:text-red-700"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </Button>

                    <h2 className="text-lg font-bold mb-2 text-purple-600">Tareas del día</h2>

                    {selectedDateTasks.length === 0 ? (
                        <p>No hay tareas</p>
                    ) : (
                        <ul className="flex flex-col gap-1">
                            {selectedDateTasks.map((task) => (
                                <li key={task.id} className="border-b py-1 text-gray-400">
                                    <div className="flex justify-between items-center">
                                        <span className={`${task.completed ? "line-through text-gray-400" : ""}`}>
                                            [{task.hour}] {task.text}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => openModalWithTask(task)}
                                                className="text-blue-400 hover:text-blue-700"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                className="text-red-400 hover:text-red-700"
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    
                    <button
                        onClick={() => openModalWithTask({})}
                        className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-md"
                    >
                        Nueva tarea
                    </button>
                </div>
            </Modal>
        </div>
    );
};
