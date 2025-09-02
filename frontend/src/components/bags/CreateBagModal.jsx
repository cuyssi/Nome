import { useState } from "react";
import { useBagsStore } from "../../store/useBagsStore";
import { Modal } from "../commons/Modal";

const predefinedBags = [
  {
    name: "Gimnasio",
    color: "green-400",
    type: "personalizada",
    items: ["Toalla", "Proteína", "Zapatillas", "Botella"],
  },
  {
    name: "Playa",
    color: "blue-400",
    type: "personalizada",
    items: ["Crema solar", "Gafas", "Toalla", "Chanclas"],
  },
  {
    name: "Piscina",
    color: "cyan-400",
    type: "personalizada",
    items: ["Gorro", "Bañador", "Toalla", "Sandalias"],
  },
];

export const CreateBagModal = ({ isOpen, onClose }) => {
  const { addBag } = useBagsStore();
  const [customName, setCustomName] = useState("");
  const [customItems, setCustomItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const handleAddPredefined = (bag) => {
    addBag({ id: crypto.randomUUID(), ...bag });
    onClose();
  };

  const handleAddCustomItem = () => {
    if (newItem.trim()) {
      setCustomItems([...customItems, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleCreateCustomBag = () => {
    if (!customName.trim()) return;
    addBag({
      id: crypto.randomUUID(),
      name: customName.trim(),
      color: "gray-400",
      type: "personalizada",
      items: customItems,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="bg-black border border-purple-400 rounded-xl p-6 w-[90%] max-w-md text-white shadow-lg">
        <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">Crear nueva mochila</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Mochilas sugeridas</h3>
          <div className="flex flex-col gap-3">
            {predefinedBags.map((bag, i) => (
              <button
                key={i}
                onClick={() => handleAddPredefined(bag)}
                className={`bg-${bag.color} text-white px-4 py-2 rounded-lg hover:opacity-80 transition`}
              >
                {bag.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Personalizada</h3>
          <input
            type="text"
            placeholder="Nombre de la mochila"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-white"
          />
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Añadir ítem"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="flex-1 px-3 py-2 rounded bg-gray-800 text-white"
            />
            <button
              onClick={handleAddCustomItem}
              className="bg-purple-600 px-3 py-2 rounded hover:bg-purple-700"
            >
              ➕
            </button>
          </div>
          <ul className="list-disc list-inside text-sm text-purple-300 mb-4">
            {customItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <button
            onClick={handleCreateCustomBag}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full"
          >
            Crear mochila personalizada
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-400 hover:text-red-700"
        >
          ✖
        </button>
      </div>
    </Modal>
  );
};
