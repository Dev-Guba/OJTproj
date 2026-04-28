import Button from "../ui/Button";

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
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="border border-slate-200 px-4 py-3 text-left">ID</th>
            <th className="border border-slate-200 px-4 py-3 text-left">Code</th>
            <th className="border border-slate-200 px-4 py-3 text-left">Name</th>
            <th className="border border-slate-200 px-4 py-3 text-left">Status</th>
            <th className="border border-slate-200 px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={5}
                className="border border-slate-200 px-4 py-8 text-center text-slate-500"
              >
                Loading offices...
              </td>
            </tr>
          ) : offices.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="border border-slate-200 px-4 py-8 text-center text-slate-500"
              >
                No offices found.
              </td>
            </tr>
          ) : (
            offices.map((office) => (
              <tr key={office.office_id} className="hover:bg-slate-50">
                <td className="border border-slate-200 px-4 py-3">
                  {office.office_id}
                </td>
                <td className="border border-slate-200 px-4 py-3 font-medium text-slate-900">
                  {office.code}
                </td>
                <td className="border border-slate-200 px-4 py-3">
                  {office.name}
                </td>
                <td className="border border-slate-200 px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      office.status === "active"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {office.status}
                  </span>
                </td>
                <td className="border border-slate-200 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => onViewDetails?.(office.office_id)}
                    >
                      View Details
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
  );
}