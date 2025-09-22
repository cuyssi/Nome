/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente Form_Schedule: formulario para crear o editar asignaturas.        │
 * Permite definir el nombre y color de una asignatura en un día y hora dados.  │
 *                                                                              │
 * Props:                                                                       │
 *   • subject (opcional) → objeto de asignatura existente { name, color }      │
 *   • day → día asociado a la asignatura                                       │
 *   • hour → hora asociada a la asignatura                                     │
 *   • onSubmit → función que recibe el objeto { day, hour, name, color } al    │
 *                enviar el formulario                                          │
 *   • onClose → función para cerrar el formulario sin guardar cambios          │
 *                                                                              │
 * Autor: Ana Castro                                                            │
 └─────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { AVAILABLE_COLORS } from "../../utils/constants";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { ColorPicker } from "../commons/formComponents/ColorPicker";
import { InputField } from "../commons/formComponents/InputField";

export const Form_Schedule = ({ subject, day, hour, onSubmit, onClose }) => {
    const [name, setName] = useState(subject?.name || "");
    const [selectedColor, setSelectedColor] = useState(subject?.color || AVAILABLE_COLORS[0].value);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ day, hour, name, color: selectedColor });
            }}
            className="bg-white rounded-lg p-6 w-80 animate-fadeIn"
        >
            <h2 className="text-xl font-bold text-center mt-6 mb-4 text-purple-700">
                {subject ? "Editar Asignatura" : "Nueva Asignatura"}
            </h2>
            <div className="space-y-5">
                <InputField
                    label="Nombre:"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.j., Mates"
                />

                <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
            </div>
            <div className=" w-full h-10 flex justify-between mt-6">
                <ButtonClose onClick={onClose} />
                <ButtonDefault type="submit" text="Guardar" className=" w-full" />
            </div>
        </form>
    );
};
