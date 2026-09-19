import { useState, type ReactNode, useCallback, useMemo } from "react";
import { Toast, type ToastType } from "../components/Toast";
import { ToastContext } from "./ToastContextType";

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={closeToast} />
      )}
    </ToastContext.Provider>
  );
};
