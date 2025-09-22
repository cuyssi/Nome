/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente Form_Task: formulario para crear o editar tareas.                 │
 *                                                                              │
 * Props:                                                                       │
 *   • task (object): tarea a editar; si no se pasa, se crea una nueva.         │
 *   • onClose (function): función para cerrar el formulario/modal.             │
 *   • onSubmit (function): función para guardar los cambios o nueva tarea.     │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { Check } from "lucide-react";
import { useTaskForm } from "../../hooks/task/useTaskForm";
import { AVAILABLE_TYPES } from "../../utils/constants";
import { Timer } from "../commons/formComponents/Timer";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { ColorPicker } from "../commons/formComponents/ColorPicker";
import { InputField } from "../commons/formComponents/InputField";
import { SelectField } from "../commons/formComponents/SelectField";
import { CheckboxField } from "../commons/formComponents/CheckboxField";
import { DaySelector } from "../commons/formComponents/DaySelector";

export const Form_Task = ({ task, onClose, onSubmit }) => {
    const { formData, showConfirmation, handleChange, handleSubmit } = useTaskForm(task, onSubmit, onClose);

    return (
        <form className="relative bg-white rounded-xl p-6 max-w-md w-full max-h-[70vh] flex flex-col">
            <ButtonClose onClick={onClose} />

            {showConfirmation && (
                <p className="flex text-green-600 mb-3 font-semibold">
                    <Check /> Cambios guardados
                </p>
            )}

            <h2 className="text-2xl font-extrabold text-purple-500 text-center font-poppins mt-6">Editar tarea</h2>

            <div className="overflow-y-auto flex-1 pr-1 hide-scrollbar">
                <div className="flex flex-col justify-between gap-4 h-full text-gray-600 mt-3 font-semibold">
                    <InputField
                        label="Texto:"
                        name="text"
                        value={formData.text}
                        placeholder="Ej: Quede con Marcos a las 6 en la plaza"
                        onChange={handleChange}
                    />

                    <InputField label="Fecha:" type="date" name="date" value={formData.date} onChange={handleChange} />

                    <label className="text-gray-500">
                        Hora:
                        <Timer
                            hour={formData.hour}
                            minute={formData.minute}
                            onChange={(field, value) => handleChange({ target: { name: field, value } })}
                        />
                    </label>

                    <ColorPicker
                        selectedColor={formData.color}
                        setSelectedColor={(color) => handleChange({ target: { name: "color", value: color } })}
                    />

                    <SelectField
                        label="Tipo"
                        name="type"
                        value={formData.type}
                        options={AVAILABLE_TYPES}
                        onChange={handleChange}
                    />

                    <SelectField
                        label="Repetición"
                        name="repeat"
                        value={formData.repeat || "once"}
                        options={[
                            { value: "once", label: "Una sola vez" },
                            { value: "daily", label: "Todos los días" },
                            { value: "weekdays", label: "De lunes a viernes" },
                            { value: "custom", label: "Personalizado" },
                        ]}
                        onChange={handleChange}
                    />

                    {formData.repeat === "custom" && (
                        <DaySelector
                            selectedDays={formData.customDays || []}
                            setSelectedDays={(updated) =>
                                handleChange({ target: { name: "customDays", value: updated } })
                            }
                        />
                    )}

                    <SelectField
                        label="Recordatorio"
                        name="reminder"
                        value={formData.reminder || "5"}
                        options={[
                            { value: "5", label: "5 minutos antes" },
                            { value: "15", label: "15 minutos antes" },
                            { value: "30", label: "30 minutos antes" },
                            { value: "60", label: "1 hora antes" },
                            { value: "90", label: "1 hora y media antes" },
                            { value: "120", label: "2 horas antes" },
                        ]}
                        onChange={handleChange}
                    />

                    <CheckboxField
                        name="notifyDayBefore"
                        label="Avisarme también el día antes"
                        checked={formData.notifyDayBefore || false}
                        onChange={(e) => handleChange({ target: { name: "notifyDayBefore", value: e.target.checked } })}
                    />
                </div>
            </div>

            <ButtonDefault type="button" onClick={handleSubmit} text="Guardar cambios" />
        </form>
    );
};
