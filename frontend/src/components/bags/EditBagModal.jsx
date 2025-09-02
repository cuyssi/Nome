import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AVAILABLE_COLORS } from "../../utils/constants";

export const EditBagModal = ({ bag, isOpen, onClose, onUpdateBag }) => {
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);

  useEffect(() => {
    if (bag) {
      setName(bag.name || "");
      setItems(Array.isArray(bag.items) ? bag.items : []);
      setSelectedColor(bag.color || AVAILABLE_COLORS[0].value);
    }
  }, [bag]);

  const handleItemChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleAddItem = () => setItems([...items, ""]);
  const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedBag = {
      ...bag,
      name,
      items,
      color: selectedColor,
    };
    onUpdateBag(updatedBag);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Editar Mochila</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
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

          {/* Color */}
          <div>
            <label className="block font-semibold mb-1">Color</label>
            <div className="flex gap-2 flex-wrap">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full border-4 ${
                    selectedColor === color.value ? "border-black" : "border-transparent"
                  } bg-${color.value}`}
                  title={color.label}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Color seleccionado: {AVAILABLE_COLORS.find(c => c.value === selectedColor)?.label}
            </p>
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
                    <X size={20} />
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
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
