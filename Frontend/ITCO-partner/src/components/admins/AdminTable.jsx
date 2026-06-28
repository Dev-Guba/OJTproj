import Button from "../ui/Button";
import { ROLES } from "../../utils/roles";

function roleLabel(roleId) {
  if (roleId === ROLES.SUPER_ADMIN) return "Super Admin";
  if (roleId === ROLES.ADMIN) return "Admin";
  if (roleId === ROLES.EMPLOYEE) return "Employee";
  return `Role ${roleId}`;
}

function RoleBadge({ roleId }) {
  const isSuperAdmin = roleId === ROLES.SUPER_ADMIN;
  return (
    <span className={[
      "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold",
      isSuperAdmin
        ? "bg-[#e8eef6] text-[#1e3a5f] ring-1 ring-[#c5d4e8]"
        : "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    ].join(" ")}>
      {roleLabel(roleId)}
    </span>
  );
}

function OfficeBadge({ code }) {
  if (!code) return <span className="text-slate-400">—</span>;
  return (
    <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
      {code}
    </span>
  );
}

export default function AdminTable({
  admins = [],
  loading = false,
  deletingId = null,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Email</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Office</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Linked Employee</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Role</th>
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
          ) : admins.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-slate-300">
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M15.5 14.2c2.3.5 4 2.5 4 5.8" />
                  </svg>
                  <span className="text-sm text-slate-400">No admin accounts found.</span>
                </div>
              </td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin.EmployeeId} className="transition hover:bg-slate-50">
                <td className="px-5 py-4 text-slate-700">{admin.Email}</td>
                <td className="px-5 py-4">
                  <OfficeBadge code={admin.SameDeptCode} />
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {admin.EmployeeNo
                    ? `${admin.EmployeeNo}${[admin.FirstName, admin.LastName].filter(Boolean).length
                        ? ` — ${[admin.FirstName, admin.LastName].filter(Boolean).join(" ")}`
                        : ""}`
                    : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-5 py-4">
                  <RoleBadge roleId={admin.role_id} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {admin.role_id === ROLES.ADMIN ? (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          type="button"
                          aria-label={`Edit ${admin.Email}`}
                          onClick={() => onEdit?.(admin)}
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
                          aria-label={`Delete ${admin.Email}`}
                          loading={deletingId === admin.EmployeeId}
                          onClick={() => onDelete?.(admin)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">Protected</span>
                    )}
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