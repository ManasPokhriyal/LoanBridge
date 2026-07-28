export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-slate-500">
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-400" />
      <span className="text-sm">
        {label}
      </span>
    </div>
  );
}
