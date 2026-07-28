const buttonStyles = {
  primary:
    "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md",

  secondary:
    "border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700",

  danger:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-700",

  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  loading = false,
  ...props
}) {
  const buttonStyle =
    buttonStyles[variant] || buttonStyles.primary;

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        px-4
        py-2.5
        text-sm
        font-semibold
        transition
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500/30
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${buttonStyle}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
