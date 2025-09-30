/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente CreateBag: modal para crear nuevas mochilas.                      │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Mochilas sugeridas: botones predefinidos con nombre, color, items y      │
 *     días de notificación.                                                    │
 *   • Mochilas personalizadas: permite introducir nombre, agregar items        │
 *     manualmente y seleccionar días de recordatorio.                          │
 *                                                                              │
 * Props:                                                                       │
 *   • onClose: función para cerrar el modal.                                   │
 *   • onSubmit: función llamada al crear la mochila, pasando los datos de      │
 *     la mochila creada.                                                       │
 *                                                                              │
 * Hooks internos:                                                              │
 *   • useCreateBag: gestiona estado del nombre, items, días de notificación    │
 *     y acciones de creación.                                                  │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { Plus } from "lucide-react";
import { useCreateBag } from "../../hooks/bag/useCreateBag";
import { DaySelector } from "../commons/formComponents/DaySelector";
import { PREDEFINED_BAGS } from "../../utils/constants";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";

export const CreateBag = ({ onClose, onSubmit }) => {
    const {
        customName,
        setCustomName,
        customItems,
        newItem,
        setNewItem,
        handleAddPredefined,
        handleAddCustomItem,
        handleCreateCustomBag,
        notifyDays,
        setNotifyDays,
    } = useCreateBag({
        onClose: () => {
            onClose();
        },
        onSubmit,
    });

    return (
    <div className="flex flex-col bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-auto box-border">
      <h2 className="text-2xl font-bold text-purple-600 mt-2 mb-6 text-center">
        Crear nueva mochila
      </h2>

      <div className="mb-6">
        <h3 className="text-lg text-gray-600 font-semibold mb-2">Mochilas sugeridas:</h3>
        <div className="flex flex-col gap-3">
          {PREDEFINED_BAGS.map((bag, i) => (
            <ButtonDefault
              key={i}
              text={bag.name}
              onClick={() => handleAddPredefined(bag)}
              className={`bg-${bag.color} text-gray-600`}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg text-gray-600 font-semibold mb-2">Personalizada:</h3>

        <input
          type="text"
          placeholder="Nombre de la mochila"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="w-full mb-2 px-3 py-2 rounded bg-gray-200 text-gray-900"
        />

        {/* Wrapper FLEX corregido */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder="Añadir"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 rounded bg-gray-200 text-gray-900"
          />

          <ButtonDefault
            type="button"
            onClick={handleAddCustomItem}
            text={<Plus className="mr-1" />}
            className="flex-none w-10 h-10 p-0 rounded-lg bg-purple-500 flex items-center justify-center"
          />
        </div>

        <ul className="list-disc list-inside text-sm text-gray-500 mb-4 max-h-36 overflow-auto">
          {customItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <ButtonDefault
          type="button"
          onClick={handleCreateCustomBag}
          text="Crear mochila personalizada"
          className="mx-auto block rounded-lg mb-6 bg-purple-500"
        />
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2">Días de recordatorio</h4>
        <DaySelector selectedDays={notifyDays} setSelectedDays={setNotifyDays} />
      </div>

      <ButtonClose onClick={onClose} />
    </div>
  );
};