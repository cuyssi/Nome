/**───────────────────────────────────────────────────────────────────────────────────┐
 * Componente InputField: campo de texto reutilizable con estilo integrado.           │
 *                                                                                    │
 * Props:                                                                             │
 *   - label → texto que acompaña al input                                            │
 *   - ...props → cualquier prop válida para <input> (ej. name, value, onChange)      │
 *                                                                                    │
 * Estilo:                                                                            │
 *   - Borde morado, esquinas redondeadas, texto gris                                 │
 *   - Ocupa todo el ancho disponible                                                 │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

export const InputField = ({ label, ...props }) => {
    return (
        <label className="text-gray-500">
            {label}:
            <input {...props} className="border border-purple-400 rounded-lg w-full p-1 font-normal text-gray-600" />
        </label>
    );
};
