import SectionCard from "./SectionCard";

export default function RecordsByOffice({
  loading,
  officeEntries,
  isSuperAdmin,
  topOffice,
  missingAre,
}) {
  const max = officeEntries[0]?.[1] ?? 1;

  return (
    <SectionCard
      title={isSuperAdmin ? "Records by Office" : "Data Alerts"}
      subtitle={
        isSuperAdmin
          ? "Where most records are currently stored"
          : "Quick cleanup items for your office data"
      }
    >
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-32 rounded bg-slate-100" />
              <div className="h-2 w-full rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : isSuperAdmin ? (
        officeEntries.length === 0 ? (
          <div className="py-6 text-sm text-slate-400">No office data yet.</div>
        ) : (
          <div className="space-y-4">
            {officeEntries.slice(0, 6).map(([office, count]) => (
              <div key={office}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-medium text-slate-700">
                    {office}
                  </div>
                  <div className="shrink-0 text-xs font-semibold text-slate-400">
                    {count}
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-[#1e3a5f] transition-all duration-500"
                    style={{ width: `${Math.round((count / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
            <span className="text-sm font-medium text-amber-800">Missing ARE/ME No.</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              {missingAre}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-sm font-medium text-slate-700">Top Office</span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
              {topOffice}
            </span>
          </div>
        </div>
      )}
    </SectionCard>
  );
}