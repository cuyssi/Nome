/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente EditBag: permite editar una mochila existente.                   │
 *                                                                             │
 * Funcionalidad:                                                              │
 *   • Modifica el nombre de la mochila.                                       │
 *   • Selecciona color de entre opciones predefinidas.                        │
 *   • Gestiona la lista de ítems: añadir, editar y eliminar.                  │
 *   • Configura hora de recordatorio y opción de aviso un día antes.          │
 *   • Selecciona días de recordatorio mediante DaySelector.                   │
 *                                                                             │
 * Props:                                                                      │
 *   - bag: objeto de la mochila a editar.                                     │
 *   - isOpen: booleano que indica si el modal está abierto.                   │
 *   - onClose: función para cerrar el modal.                                  │
 *   - onUpdateBag: función que se ejecuta al guardar los cambios.             │
 *                                                                             │
 * Hooks internos:                                                             │
 *   - useBagEditor: gestiona estado de nombre, color, items, recordatorios y  │
 *     acciones de edición.                                                    │
 *                                                                             │
 * Autor: Ana Castro                                                           │
└─────────────────────────────────────────────────────────────────────────────*/

import { useBagEditor } from "../../hooks/bag/useBagEditor";
import { Timer } from "../commons/Timer";
import { DaySelector } from "../commons/DaySelector";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonTrash } from "../commons/buttons/ButtonTrash";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { ColorPicker } from "../commons/ColorPicker";
import { InputField } from "../commons/InputField";
import { CheckboxField } from "../commons/CheckboxField";

export const EditBag = ({ bag, isOpen, onClose, onUpdateBag }) => {
  const {
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    name,
    setName,
    items,
    selectedColor,
    setSelectedColor,
    reminderTime,
    setReminderTime,
    notifyDayBefore,
    setNotifyDayBefore,
    notifyDays,
    setNotifyDays,
  } = useBagEditor({ bag, isOpen, onClose, onUpdateBag });

  return (
    <div className="bg-white rounded-xl p-5 max-w-md w-full max-h-[70vh] flex flex-col relative">
      <ButtonClose onClick={onClose} />

      <h2 className="text-2xl text-center text-purple-600 font-bold mt-4 mb-4">
        Editar Mochila
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="overflow-y-auto flex-1 hide-scrollbar space-y-6">
          <InputField
            label="Nombre"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block font-semibold mb-1 text-gray-600">Color</label>
            <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
          </div>

          <div>
            <label className="block font-semibold text-gray-600 mb-2">Ítems</label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <InputField
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                  />
                  <ButtonTrash onClick={() => handleRemoveItem(index)} />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="text-sm text-purple-600 hover:underline"
              >
                + Añadir ítem
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-gray-600">Recordatorio</label>
            <Timer
              hour={reminderTime.hour}
              minute={reminderTime.minute}
              onChange={(name, value) =>
                setReminderTime({ ...reminderTime, [name]: value })
              }
            />
            <CheckboxField
              name="notifyDayBefore"
              label="Avisar día antes"
              checked={notifyDayBefore}
              onChange={(e) => setNotifyDayBefore(e.target.checked)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-600">
              Días de recordatorio
            </label>
            <DaySelector selectedDays={notifyDays} setSelectedDays={setNotifyDays} />
          </div>
        </div>

        <div className="pt-6">
          <ButtonDefault type="submit" text="Guardar" className="w-full" />
        </div>
      </form>
    </div>
  );
};
