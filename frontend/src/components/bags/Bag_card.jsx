import { Container_Card } from "../commons/Container_Card";
import { Trash2, Pencil } from "lucide-react";
import { useTaskCard } from "../../hooks/task/useTaskCard";

export const Bag_card = ({ bag, onDelete, onOpenModal }) => {
    const isSchoolBag = bag.name === "Escolar";

    const { gestureHandlers, state: { dragOffset, isRemoving }, color } = useTaskCard(
        bag,
        isSchoolBag ? () => {} : onDelete,
        () => onOpenModal(bag, "edit")
    );

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
                    {!isSchoolBag && (
                        <>
                            <Trash2 className="text-white w-8 h-8" />
                            <p className="text-white">¿Eliminar?</p>
                        </>
                    )}
                </div>
                <div className="flex flex-col mr-4 justify-center items-center">
                    <Pencil className="text-white w-8 h-8" />
                    <p className="text-white">¿Editar?</p>
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
                onClick={() => onOpenModal(bag, isSchoolBag ? "school" : "items")}
            >
                <Container_Card outerClass={`${color.bg}`} innerClass={`${color.border}`}>
                    <div className="flex flex-col justify-center items-center px-4 w-full">
                        <h3 className="text-xl font-bold text-white">{bag.name}</h3>
                    </div>
                </Container_Card>
            </div>
        </div>
    );
};
