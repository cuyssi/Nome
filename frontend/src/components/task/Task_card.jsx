import { Container_Card } from "../commons/Container_Card";
import { Trash2, Pencil } from "lucide-react";
import { useTaskCard } from "../../hooks/task/useTaskCard";
import { useStorageStore } from "../../store/storageStore";
import { toLocalYMD } from "../../utils/toLocalYMD";
import { getRepeatLabel } from "../../utils/getRepeatLabel"

export const Task_card = ({ task, onDelete, onEdit }) => {
    const isCompleted = useStorageStore.getState().isTaskCompletedForDate(task.id, toLocalYMD(new Date()));
    const { markAsCompleted } = useStorageStore();
    const {
        gestureHandlers,
        state: { dragOffset, isRemoving },
        color,
        
    } = useTaskCard(task, onDelete, onEdit, markAsCompleted);



    
    return (
        <div className="relative w-full min-h-[6rem] overflow-hidden rounded-xl">
            <div
                className={`absolute inset-0 w-full z-0 flex items-center justify-between rounded-xl transition-colors duration-150 ease-in ${
                    dragOffset > 120
                        ? "bg-red-900"
                        : dragOffset > 80
                        ? "bg-red-500"
                        : dragOffset > 0
                        ? "bg-red-400"
                        : dragOffset < -120
                        ? "bg-yellow-900"
                        : dragOffset < -80
                        ? "bg-yellow-500"
                        : dragOffset < 0
                        ? "bg-yellow-200"
                        : "bg-gray-400"
                }`}
            >
                <div className="flex flex-col ml-4 justify-center items-center">
                    <Trash2 className="text-white w-8 h-8" />
                    <p className="text-white"> ¿Eliminar?</p>
                </div>
                <div className="flex flex-col mr-4 justify-center items-center">
                    <Pencil className="text-white w-8 h-8" />
                    <p className="text-white"> ¿Editar?</p>
                </div>
            </div>
            <div
                onTouchStart={gestureHandlers.handleTouchStart}
                onTouchMove={gestureHandlers.handleTouchMove}
                onTouchEnd={gestureHandlers.handleTouchEnd}
                onPointerDown={(e) => {
                    gestureHandlers.handlePointerStart(e);
                    gestureHandlers.handleLongPressStart();
                }}
                onPointerMove={gestureHandlers.handlePointerMove}
                onPointerUp={(e) => {
                    gestureHandlers.handlePointerEnd(e);
                    gestureHandlers.handleLongPressEnd();
                }}
                className={`relative rounded-xl z-10 ${color.bg} transition-transform duration-150 ease-out ${
                    isRemoving ? "opacity-0 scale-90 blur-sm" : ""
                }`}
                style={{ transform: `translateX(${dragOffset}px)` }}
            >
                <Container_Card outerClass={`${color.bg}`} innerClass={`${color.border}`}>
                    {(task.date || task.hour) && (
                        <div className="flex flex-1 flex-col border border-black border-r-gray-900 rounded-l-xl h-full w-full px-3 gap-1 justify-center text-center">
                            <p className="text-gray-400 font-semibold text-3xl flex justify-center">{getRepeatLabel(task)}</p>
                            <p className="text-gray-400 font-bold text-xl">{task.hour}</p>
                        </div>
                    )}
                    <div
                        className={`flex flex-2 text-center justify-center items-center px-2 h-full w-full text-base text-white transition-all duration-300 ${
                            isCompleted
                                ? "line-through text-white decoration-4 decoration-red-400 scale-[0.97]"
                                : "text-white"
                        }`}
                    >
                        {task.text}
                    </div>
                </Container_Card>
            </div>
        </div>
    );
};
