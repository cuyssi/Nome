/**────────────────────────────────────────────────────────────────────────────┐
 * Componente Form_Task: formulario para crear o editar tareas.                │
 *                                                                             │
 * Funcionalidad:                                                              │
 *   • Muestra campos de texto, fecha, hora, color, tipo, repetición y aviso.  │
 *   • Permite seleccionar días personalizados si la repetición es "custom".   │
 *   • Gestiona el estado del formulario usando el hook useTaskForm.           │
 *   • Al presionar Enter en el campo de texto, se pierde el foco en vez de    │
 *     enviar el formulario, evitando guardar accidentalmente.                 │
 *   • Botón de cierre para cancelar la edición/creación.                      │
 *   • Botón de guardar cambios que dispara onSubmit con la tarea final.       │
 *                                                                             │
 * Props:                                                                      │
 *   - task: objeto de la tarea a editar (opcional; si no existe, es nueva).   │
 *   - onClose: función que cierra el formulario/modal.                        │
 *   - onSubmit: función que recibe el objeto final de la tarea al guardar.    │
 *                                                                             │
 * Hooks internos:                                                             │
 *   - useTaskForm: gestiona el estado del formulario y la construcción de la  │
 *     tarea final a partir de los campos.                                     │
 *                                                                             │
 * Autor: Ana Castro                                                           │
└─────────────────────────────────────────────────────────────────────────────*/

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
    const { formData, handleChange, handleSubmit } = useTaskForm(task, onSubmit);

    return (
        <form
            className="relative bg-white rounded-xl p-6 max-w-md w-full max-h-[70vh] flex flex-col"
            onSubmit={handleSubmit}
        >
            <ButtonClose onClick={onClose} />

            <h2 className="text-2xl font-extrabold text-purple-500 text-center font-poppins mt-6">
                {task ? "Editar tarea" : "Nueva tarea"}
            </h2>

            <div className="overflow-y-auto flex-1 pr-1 hide-scrollbar mt-3">
                <div className="flex flex-col justify-between gap-4 h-full text-gray-600 font-semibold">
                    <InputField
                        label="Texto:"
                        name="text"
                        value={formData.text}
                        placeholder="Ej: Quede con Marcos en la plaza"
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                e.currentTarget.blur();
                            }
                        }}
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
                            { value: "weekend", label: "Solo fines de semana" },
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

            <ButtonDefault type="submit" text="Guardar cambios" />
        </form>
    );
};
