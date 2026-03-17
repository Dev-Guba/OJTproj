import SectionCard from "./SectionCard";

export default function RecordsByOffice({ loading, officeEntries, isSuperAdmin, topOffice, missingAre }) {
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
        <div className="py-6 text-sm text-slate-500">Loading…</div>
      ) : isSuperAdmin ? (
        officeEntries.length === 0 ? (
          <div className="py-6 text-sm text-slate-500">No office data yet.</div>
        ) : (
          <div className="space-y-3">
            {officeEntries.slice(0, 6).map(([office, count]) => (
              <div key={office} className="flex items-center justify-between gap-4">
                <div className="text-sm font-medium text-slate-700">{office}</div>
                <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {count} record(s)
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span>Missing ARE/ME No.</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {missingAre}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Top Office</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {topOffice}
            </span>
          </div>
        </div>
      )}
    </SectionCard>
  );
}