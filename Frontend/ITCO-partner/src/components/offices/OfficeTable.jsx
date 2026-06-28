import Button from "../ui/Button";

function StatusBadge({ status }) {
  const isActive = status === "active";
  return (
    <span className={[
      "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize",
      isActive
        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
        : "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    ].join(" ")}>
      {status}
    </span>
  );
}

export default function OfficeTable({
  offices = [],
  loading = false,
  deletingId = null,
  onEdit,
  onDelete,
  onViewDetails,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">ID</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Code</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Office Name</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Status</th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(5)].map((__, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-3 animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ) : offices.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-slate-300">
                    <rect x="4" y="3" width="11" height="18" rx="1" />
                    <path d="M15 8h5v13h-5" />
                  </svg>
                  <span className="text-sm text-slate-400">No offices found.</span>
                </div>
              </td>
            </tr>
          ) : (
            offices.map((office) => (
              <tr key={office.office_id} className="transition hover:bg-slate-50">
                <td className="px-5 py-4 text-slate-400 tabular-nums">
                  #{office.office_id}
                </td>
                <td className="px-5 py-4">
                  <span className="font-semibold text-[#1e3a5f]">{office.code}</span>
                </td>
                <td className="px-5 py-4 text-slate-700">{office.name}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={office.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      type="button"
                      onClick={() => onViewDetails?.(office.office_id)}
                    >
                      Details
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      aria-label={`Edit ${office.code}`}
                      onClick={() => onEdit?.(office)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      aria-label={`Delete ${office.code}`}
                      loading={deletingId === office.office_id}
                      onClick={() => onDelete?.(office)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}