import { Trash2 } from "lucide-react";

export const ButtonTrash = ({onClick}) => {
    return (
        <button className="text-red-400 hover:text-red-700" onClick={onClick}>
            <Trash2 className="w-5 h-5" />
        </button>
    );
};
