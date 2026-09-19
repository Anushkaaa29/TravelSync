import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  image?: string;
}

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  image,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 rotate-3 rounded-3xl bg-gray-900 shadow-xl" />

        <div className="relative rounded-3xl bg-white p-8 shadow-2xl transition-all">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          {image && (
            <div className="mb-6 flex justify-center">
              <img
                src={image}
                alt="Illustration"
                className="h-40 object-contain"
              />
            </div>
          )}

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="mt-4 text-gray-500 leading-relaxed">{description}</p>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-full border-2 border-gray-200 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-full bg-gray-900 py-3 font-bold text-white transition hover:bg-gray-800"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
