import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl ${maxWidth}`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 text-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
}
