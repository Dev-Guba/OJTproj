import SectionCard from "./SectionCard";

export default function RecentRecords({ loading, recent }) {
  return (
    <SectionCard
      title="Recent Records"
      subtitle="Most recently created records in your visible scope"
    >
      {loading ? (
        <div className="py-6 text-sm text-slate-500">Loading…</div>
      ) : recent.length === 0 ? (
        <div className="py-6 text-sm text-slate-500">No records yet.</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recent.map((r) => (
            <div
              key={r.id ?? `${r.propNumber}-${r.createdAt}`}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {r.article || "Untitled Record"}
                </div>
                <div className="truncate text-xs text-slate-500">
                  Prop No: {r.propNumber || "—"} • Office: {r.office || "—"}
                </div>
              </div>
              <div className="whitespace-nowrap text-xs text-slate-500">
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}