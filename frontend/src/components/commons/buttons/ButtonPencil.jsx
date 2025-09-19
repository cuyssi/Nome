import { Pencil } from "lucide-react";

export const ButtonPencil = ({ onClick }) => {
    return (
        <button onClick={onClick} className="text-blue-400 hover:text-blue-700">
            <Pencil className="w-4 h-4" />
        </button>
    );
};
