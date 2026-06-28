import SectionCard from "./SectionCard";

const DOT_COLORS = [
  "bg-[#1e3a5f]",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-400",
];

export default function RecentRecords({ loading, recent }) {
  return (
    <SectionCard
      title="Recent Records"
      subtitle="Most recently created records in your visible scope"
    >
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="h-2 w-2 shrink-0 rounded-full bg-slate-200" />
              <div className="h-3 flex-1 rounded bg-slate-100" />
              <div className="h-3 w-16 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-slate-300">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <div className="text-sm text-slate-400">No records yet.</div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recent.map((r, i) => (
            <div
              key={r.id ?? `${r.propNumber}-${r.createdAt}`}
              className="flex items-center gap-3 py-3"
            >
              <div
                className={[
                  "h-2 w-2 shrink-0 rounded-full",
                  DOT_COLORS[i % DOT_COLORS.length],
                ].join(" ")}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {r.article || "Untitled Record"}
                </div>
                <div className="truncate text-xs text-slate-400">
                  {[r.propNumber && `Prop No: ${r.propNumber}`, r.office && `Office: ${r.office}`]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
              <div className="whitespace-nowrap text-xs text-slate-400">
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" }) : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}