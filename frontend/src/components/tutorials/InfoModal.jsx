import { Modal } from "../commons/Modal";
import { X } from "lucide-react";

export const InfoModal = ({ isOpen, onClose, onNeverShowAgain, children }) => {
  return (
    <Modal isOpen={isOpen}>
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full text-sm text-gray-700 font-poppins shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X className="w-8 h-8 text-red-400" />
        </button>
        <h3 className="text-lg font-bold text-purple-600 mt-4 mb-3">¿Qué se muestra aquí?</h3>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onNeverShowAgain}
            className="px-3 py-1 text-red-400 rounded hover:bg-red-400 hover:text-white"
          >
            No mostrar más
          </button>
        </div>
      </div>
    </Modal>
  );
};
