/**───────────────────────────────────────────────────────────────────────────────────┐
 * Componente InputField: campo de texto reutilizable con estilo integrado.           │
 *                                                                                    │
 * Props:                                                                             │
 *   - label → texto que acompaña al input                                            │
 *   - ...props → cualquier prop válida para <input> (ej. name, value, onChange)      │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

export const InputField = ({ label, ...props }) => {
    return (
        <label className="text-gray-500 font-semibold">
            {label}
            <input
                {...props}
                className="bg-gray-100 border border-purple-400  focus:border-purple-800 focus:outline-none focus:ring-0 rounded-lg w-full p-1 font-normal text-gray-500 mt-1.5"
            />
        </label>
    );
};
