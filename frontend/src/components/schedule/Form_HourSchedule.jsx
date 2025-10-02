import { Timer } from "../commons/formComponents/Timer";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { ButtonTrash } from "../commons/buttons/ButtonTrash";
import { useScheduleHourForm } from "../../hooks/schedule/useScheduleHourForm";

export const Form_HourSchedule = ({ initialHour, onSubmit, onClose, onDelete }) => {
    const { hour, minute, handleChange, getFormattedHour } = useScheduleHourForm(initialHour);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newHour = getFormattedHour();
        onSubmit(initialHour, newHour);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 w-80 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mt-6 mb-4 text-purple-500">
                {initialHour ? "Editar hora" : "Añadir hora"}
            </h2>
            <ButtonClose onClick={onClose} />
            <div className="w-full flex justify-center items-center">
                <Timer hour={hour} minute={minute} onChange={handleChange} />
                {initialHour && (
                    <ButtonTrash
                        type="button"
                        onClick={() => {
                            onDelete();
                            onClose();
                        }}
                        text="Eliminar hora"
                        className="mt-6 inline w-4 h-4 text-red-400"
                    />
                )}
            </div>

            <div className="w-full flex justify-center items-center mt-6">
                <ButtonDefault type="submit" text="Guardar" className="mt-4 w-[60%] bg-green-400 mb-2" />
            </div>
        </form>
    );
};
