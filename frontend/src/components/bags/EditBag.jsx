import { X, Trash2 } from "lucide-react";
import { AVAILABLE_COLORS } from "../../utils/constants";
import { useBagEditor } from "../../hooks/bag/useBagEditor"

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
    setSelectedColor
  } = useBagEditor({ bag, isOpen, onClose, onUpdateBag });

  return (
    <div className="space-y-4">
        
      <div className="relative bg-white rounded-xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto hide-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-8 h-8 text-red-400" />
        </button>

        <h2 className="text-xl text-center text-purple-600 font-bold mt-4 mb-4">Editar Mochila</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Color</label>
            <div className="flex gap-1 flex-wrap mt-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color.value ? "border-gray-500 border-4" : "border-transparent"
                  } bg-${color.value}`}
                  title={color.label}
                />
              ))}
            </div>            
          </div>

          <div>
            <label className="block font-semibold mb-1">Ítems</label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    className="flex-1 border rounded-md px-2 py-1"
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
                className="text-sm text-blue-600 hover:underline"
              >
                + Añadir ítem
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="submit"
              className="px-4 py-2 w-full rounded-md bg-purple-600 text-white hover:bg-purple-900"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
