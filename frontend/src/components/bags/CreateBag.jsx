import { Plus, X } from "lucide-react";
import { useCreateBag } from "../../hooks/bag/useCreateBag";

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
        color: "orange-400",
        type: "personalizada",
        items: ["Gorro", "Bañador", "Toalla", "Sandalias"],
    },
];

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
    } = useCreateBag({
        onClose: () => {
            onClose();
        },
        onSubmit,
    });

    return (
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-6 text-center">Crear nueva mochila</h2>

            <div className="mb-6">
                <h3 className="text-lg text-gray-600 font-semibold mb-2">Mochilas sugeridas:</h3>
                <div className="flex flex-col gap-3">
                    {predefinedBags.map((bag, i) => (
                        <button
                            key={i}
                            onClick={() => handleAddPredefined(bag)}
                            className={`bg-${bag.color} text-gray-600 px-4 py-2 rounded-lg hover:opacity-80 transition`}
                        >
                            {bag.name}
                        </button>
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
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Añadir ítem"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className="flex-1 px-3 py-2 rounded bg-gray-200 text-gray-900"
                    />
                    <button
                        onClick={handleAddCustomItem}
                        className="bg-purple-500 px-3 py-2 rounded hover:bg-purple-500"
                    >
                        <Plus className="inline mr-1" />
                    </button>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-500 mb-4">
                    {customItems.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
                <button
                    onClick={handleCreateCustomBag}
                    className="mt-6 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full"
                >
                    Crear mochila personalizada
                </button>
            </div>

            <button onClick={onClose} className="absolute top-4 right-4 text-red-400 hover:text-red-700">
                <X className="w-8 h-8" />
            </button>
        </div>
    );
};
