import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  X,
} from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();

    setToasts((current) => [
      ...current,
      { id, message, type },
    ]);

    setTimeout(() => {
      setToasts((current) =>
        current.filter((toast) => toast.id !== id)
      );
    }, 3500);
  }, []);

  const contextValue = useMemo(
    () => ({
      toast: showToast,
    }),
    [showToast]
  );

  const toastIcons = {
    success: CheckCircle2,
    error: CircleAlert,
    info: Info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed right-4 top-4 z-[100] space-y-3">
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type] || Info;

          return (
            <div
              key={toast.id}
              className="flex max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl"
            >
              <Icon
                size={18}
                className={
                  toast.type === "success"
                    ? "text-emerald-600"
                    : toast.type === "error"
                    ? "text-rose-600"
                    : "text-indigo-600"
                }
              />
              <span className="text-sm text-slate-700">
                {toast.message}
              </span>
              <button
                onClick={() =>
                  setToasts((items) =>
                    items.filter(
                      (item) => item.id !== toast.id
                    )
                  )
                }
                className="ml-auto text-slate-400 hover:text-slate-900"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
