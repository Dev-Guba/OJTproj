import Button from "../ui/Button";

function StatusBadge({ status }) {
  const isActive = status === "active";

  return (
    <span
      className={[
        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize",
        isActive
          ? "bg-green-50 text-green-700 ring-1 ring-green-200"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
      ].join(" ")}
    >
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
    <div className="overflow-hidden border-t border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Office Name</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  Loading offices...
                </td>
              </tr>
            ) : offices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  No offices found.
                </td>
              </tr>
            ) : (
              offices.map((office) => (
                <tr
                  key={office.office_id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4 text-slate-500">
                    #{office.office_id}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-900">
                      {office.code}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {office.name}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={office.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => onViewDetails?.(office.office_id)}
                      >
                        Details
                      </Button>

                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => onEdit?.(office)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        type="button"
                        loading={deletingId === office.office_id}
                        onClick={() => onDelete?.(office)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}