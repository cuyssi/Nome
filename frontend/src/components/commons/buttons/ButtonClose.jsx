import { X } from "lucide-react";

export const ButtonClose = ({ onClick }) => {
    return (
        <button type="button" onClick={onClick} className="absolute top-2 right-2 text-gray-500 hover:text-black">
            <X className="w-8 h-8 text-red-400" />
        </button>
    );
};
