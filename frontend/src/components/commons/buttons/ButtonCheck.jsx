import { Check } from "lucide-react";

export const ButtonCheck = ({ onClick }) => {
    return (
        <button  className="text-green-400 hover:text-green-700" onClick= {onClick} >
            < Check />
        </button>
    )
}