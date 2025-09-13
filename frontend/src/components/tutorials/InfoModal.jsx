import { Modal } from "../commons/Modal"
import { X } from "lucide-react"

export const InfoModal = ({
  isOpen,
  onClose,
  onNeverShowAgain,
  children,
  backdropBlur = true,
  blockInteraction = true,
  position = { top: "50%", left: "50%" },
  hideInternalFooter = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      backdropBlur={backdropBlur}
      blockInteraction={blockInteraction}
    >
      <div
        className="absolute bg-white rounded-lg px-2 py-2 w-[90%] text-sm text-gray-700 font-poppins shadow-xl"
        style={{
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -50%)",
        }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">
          <X className="w-8 h-8 text-red-400" />
        </button>
        
        <div className="mb-10 mt-6 text-base font-poppins p-2">{children}</div>
        {!hideInternalFooter && (
          <div>
            <button
              onClick={onNeverShowAgain}
              className="fixed bottom-3 right-2 px-3 py-1 text-red-400 rounded hover:bg-red-400 hover:text-white"
            >
              No mostrar más
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

