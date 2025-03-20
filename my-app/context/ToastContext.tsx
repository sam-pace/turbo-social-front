import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Toast from "../components/Toast"; 

interface ToastData {
  title: string;
  description: string;
  type: string;
  isVisible: boolean;
}

interface ToastContextType {
  showToast: (data: Omit<ToastData, 'isVisible'>) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback(({ title, description, type }: Omit<ToastData, 'isVisible'>) => {
    setToast({ title, description, type, isVisible: true });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast {...toast} onHide={() => setToast(null)} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
