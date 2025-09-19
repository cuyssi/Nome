import { X } from "lucide-react";

export const ButtonClose = ({ onClick }) => {
    return (
        <button onClick={onClick} className="absolute top-4 right-4 text-gray-500 hover:text-black">
            <X className="w-8 h-8 text-red-400" />
        </button>
    );
};
