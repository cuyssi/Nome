import { getTaskColor } from "../../utils/getTaskColor";
import Container_task from "../commons/Container_task";
import { Trash2 } from "lucide-react";
import { useSwipeToDelete } from "../../hooks/useSwipeToDelete";

export const Task_card = ({ task, onDelete }) => {
    const color = task.color
        ? {
              base: task.color,
              bg: `bg-${task.color}`,
              border: `border-${task.color}`,
              text: `text-${task.color}`,
          }
        : getTaskColor(task.type);
    const { dragOffset, handleTouchStart, handleTouchMove, handleTouchEnd, isRemoving } = useSwipeToDelete(() =>
        onDelete(task.id)
    );

    return (
        <div className="relative w-full overflow-hidden rounded-xl">
            <div className="absolute inset-0 w-[80%] z-0 flex gap-4 items-center justify-start bg-red-400">
                <Trash2 className="text-white w-8 h-8 ml-6" />
                <p className="text-white"> ¿Eliminar?</p>
            </div>
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`relative z-10 transition-all duration-500 ease-in-out ${
                    isRemoving ? "opacity-0 scale-90 blur-sm" : ""
                }`}
                style={{ transform: `translateX(${dragOffset}px)` }}
            >
                <Container_task outerClass={`${color.bg}`} innerClass={`${color.border}`}>
                    {task.date || task.time ? (
                        <div className="flex flex-1 flex-col border border-black border-r-gray-900 rounded-l-xl h-full w-full px-3 gap-1 justify-center text-center">
                            <p className="text-gray-400 font-semibold text-3xl">{task.date}</p>
                            <p className="text-gray-400 font-bold text-xl">{task.hour}</p>
                        </div>
                    ) : null}
                    <div className="flex flex-2 text-center justify-center items-center px-2 h-full w-full text-sm text-white">
                        {["deberes", "ejercicios", "trabajo"].includes(task.type)
                            ? task.text_raw || task.text
                            : task.text}
                    </div>
                </Container_task>
            </div>
        </div>
    );
};
