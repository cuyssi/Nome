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
 * Funcionalidad:                                                               │
 *   • Permite editar asignaturas existentes o crear nuevas.                    │
 *   • Control de estado interno para name y selectedColor.                     │
 *   • Botones de acción: Guardar y Cancelar.                                   │
 *   • Validación mínima: nombre obligatorio.                                   │
 *                                                                              │
 * Layout y estilo:                                                             │
 *   • Fondo blanco con bordes redondeados y animación fadeIn.                  │
 *   • Selector de color mediante botones circulares con borde activo.          │
 *   • Inputs estilizados con focus ring morado.                                │
 *   • Botones separados en la parte inferior, alineados a los extremos.        │
 *                                                                              │
 * Autor: Ana Castro                                                            │
 └─────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { AVAILABLE_COLORS } from "../../utils/constants";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { ColorPicker } from "../commons/ColorPicker";

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
            <h2 className="text-xl font-bold text-center mb-4 text-purple-700">
                {subject ? "Editar Asignatura" : "Nueva Asignatura"}
            </h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="e.j., Mates"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1">Color</label>

                <div className="flex gap-1 flex-wrap mt-2">
                    <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                </div>
            </div>

            <div className=" w-full h-10 flex justify-between mt-6">
                <ButtonClose onClick={onClose} />
                <ButtonDefault type="submit" text="Guardar" className="absolute right-6" />
            </div>
        </form>
    );
};
