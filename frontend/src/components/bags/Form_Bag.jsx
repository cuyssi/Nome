import React, { useState } from "react";

export const Form_Bag = ({ initialData, onSubmit, onCancel }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [color, setColor] = useState(initialData?.color || "");
    const [capacity, setCapacity] = useState(initialData?.capacity || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedBag = {
            ...initialData,
            name,
            color,
            capacity,
        };
        onSubmit(updatedBag);
    };

    return (
        <form onSubmit={handleSubmit} className="form-bag">
            <label>
                Nombre:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label>
                Color:
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
            </label>

            <div className="form-actions">
                <button type="submit">Guardar</button>
                <button type="button" onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </form>
    );
};
