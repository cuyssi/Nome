/**───────────────────────────────────────────────────────────────────────────────────┐
 * Componente CheckboxField: campo de checkbox reutilizable.                          │
 *                                                                                    │
 * Props:                                                                             │
 *   - name → nombre del campo (atributo HTML)                                        │
 *   - label → texto que acompaña al checkbox                                         │
 *   - checked → estado actual del checkbox (true/false)                              │
 *   - onChange → función que se ejecuta al cambiar el estado                         │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

export const CheckboxField = ({ name, label, checked, onChange }) => {
    return (
        <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" name={name} checked={checked} onChange={onChange} className="accent-purple-500" />
            {label}
        </label>
    );
};
