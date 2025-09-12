import { X, Trash2 } from "lucide-react";
import { AVAILABLE_COLORS } from "../../utils/constants";
import { useBagEditor } from "../../hooks/bag/useBagEditor";
import { Timer } from "../commons/Timer";
import { DaySelector } from "../commons/DaySelector";

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
      {/* Botón de cerrar fijo */}
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
        <X className="w-8 h-8 text-red-400" />
      </button>

      {/* Título */}
      <h2 className="text-2xl text-center text-purple-600 font-bold mt-4 mb-4">Editar Mochila</h2>

      {/* Formulario dividido */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        {/* ZONA SCROLLABLE */}
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          <div className="mt-4">
            <label className="block font-semibold mb-1 text-gray-600">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border  border-purple-400 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block font-semibold mb-1 text-gray-600">Color</label>
            <div className="flex gap-1 flex-wrap mt-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color.value
                      ? "border-gray-500 border-4"
                      : "border-transparent"
                  } bg-${color.value}`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block font-semibold text-gray-600">Ítems</label>
            <div >
              {items.map((item, index) => (
                <div key={index} className="flex">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    className="flex-1 border rounded-md px-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
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

          <div className="mt-6">
            <label className="block font-semibold text-gray-600">Recordatorio</label>
            <div className="flex flex-col">
              <Timer
                hour={reminderTime.hour}
                minute={reminderTime.minute}
                onChange={(name, value) => setReminderTime({ ...reminderTime, [name]: value })}
              />
              <label className="flex items-center gap-2 mt-4 ml-4">
                <input
                  type="checkbox"
                  checked={notifyDayBefore}
                  className="h-4 w-4 accent-blue-500 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => setNotifyDayBefore(e.target.checked)}
                />
                Avisar día antes
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-semibold mb-1 text-gray-600">Días de recordatorio</label>
            <DaySelector selectedDays={notifyDays} setSelectedDays={setNotifyDays} />
          </div>
        </div>

        {/* Botón de guardar fijo */}
        <div className="pt-6">
          <button
            type="submit"
            className="px-4 py-2 w-full rounded-md bg-purple-600 text-white hover:bg-purple-900"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};
