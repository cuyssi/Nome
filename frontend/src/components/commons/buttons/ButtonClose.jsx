import { X } from "lucide-react";

export const ButtonClose = ({ onClick }) => {
    return (
        <button onClick={onClick} className="absolute top-1 right-1 text-gray-500 hover:text-black">
            <X className="w-8 h-8 text-red-400" />
        </button>
    );
};
