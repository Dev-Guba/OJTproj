export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-2xl">
          📊
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </div>
          <div className="mt-1 text-3xl font-bold text-slate-900">
            {value}
          </div>
          {hint ? (
            <div className="mt-1 text-xs text-slate-500">{hint}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}