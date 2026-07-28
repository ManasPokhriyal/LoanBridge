import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  description = "Your records will appear here.",
}) {
  return (
    <div className="glass flex flex-col items-center rounded-2xl p-10 text-center">
      <div className="mb-4 rounded-2xl bg-indigo-50 p-4 text-indigo-600">
        <Inbox size={32} />
      </div>
      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}
