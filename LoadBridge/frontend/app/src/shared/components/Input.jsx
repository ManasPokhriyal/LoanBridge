export default function Input({
  label,
  error,
  hint,
  className = "",
  ...props
}) {
  return (
    <label className="block space-y-2 text-sm">
      {label && (
        <span className="font-medium text-slate-700">
          {label}
        </span>
      )}

      <input
        className={`
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          px-3.5
          py-3
          text-slate-900
          outline-none
          transition
          placeholder:text-slate-400
          hover:border-slate-400
          focus:border-indigo-500
          focus:ring-2
          focus:ring-indigo-500/15
          ${className}
        `}
        {...props}
      />

      {hint && !error && (
        <span className="block text-xs text-slate-500">
          {hint}
        </span>
      )}

      {error && (
        <span className="block text-xs text-rose-600">
          {error}
        </span>
      )}
    </label>
  );
}
