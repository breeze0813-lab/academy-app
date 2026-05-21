interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    danger?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = '확인',
    cancelLabel = '취소',
    onConfirm,
    onCancel,
    danger = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
              <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>h3>
                      <p className="text-gray-600 text-sm mb-6">{message}</p>p>
                      <div className="flex gap-3 justify-end">
                                <button
                                              onClick={onCancel}
                                              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                            >
                                  {cancelLabel}
                                </button>button>
                                <button
                                              onClick={onConfirm}
                                              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                                                              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 hover:bg-primary-700'
                                              }`}
                                            >
                                  {confirmLabel}
                                </button>button>
                      </div>div>
              </div>div>
        </div>div>
      );
}</div>
