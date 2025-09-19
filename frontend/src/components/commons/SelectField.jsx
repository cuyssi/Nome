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
 * Estilo:                                                                            │
 *   - Borde morado, esquinas redondeadas, fuente normal                              │
 *   - Ocupa todo el ancho disponible                                                 │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

export const SelectField = ({ label, name, value, options, onChange }) => {
    return (
        <label>
            {label}:
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="border w-full border-purple-400 rounded-lg p-1 font-normal"
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
