/**───────────────────────────────────────────────────────────────────────────────────┐
 * Componente SelectField: campo desplegable reutilizable.                            │
 *                                                                                    │
 * Props:                                                                             │
 *   - label → texto que acompaña al <select>                                         │
 *   - name → nombre del campo (atributo HTML)                                        │
 *   - value → valor actualmente seleccionado                                         │
 *   - options → array de opciones (string o { label, value })                        │
 *   - onChange → función que se ejecuta al cambiar la selección                      │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

export const SelectField = ({ label, name, value, options, onChange }) => {
    return (
        <label className="text-gray-500 font-semibold">
            {label}:
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="border w-full bg-gray-100 border-purple-400  focus:border-purple-700 focus:outline-none focus:ring-0 rounded-lg p-1 font-normal mt-1.5"
            >
                {options.map((opt) =>
                    typeof opt === "string" ? (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ) : (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    )
                )}
            </select>
        </label>
    );
};
