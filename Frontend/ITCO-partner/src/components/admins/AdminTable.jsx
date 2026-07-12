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
    <span
      className={[
        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold",
        isSuperAdmin
          ? "bg-[#e8eef6] text-[#1e3a5f] ring-1 ring-[#c5d4e8]"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
      ].join(" ")}
    >
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
  onDelete,
}) {

  // Only show active admins
  const activeAdmins = admins.filter(
    (admin) => admin.isActive
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">

        <thead>
          <tr className="border-y border-slate-100 bg-slate-50">

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Name
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Email
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Office
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Role
            </th>

            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
              Actions
            </th>

          </tr>
        </thead>


        <tbody className="divide-y divide-slate-100 bg-white">

          {loading ? (

            [...Array(4)].map((_, i) => (
              <tr key={i}>
                {[...Array(5)].map((__, j) => (
                  <td key={j} className="px-5 py-4">
                    <div className="h-3 animate-pulse rounded bg-slate-100" />
                  </td>
                ))}
              </tr>
            ))

          ) : activeAdmins.length === 0 ? (

            <tr>
              <td colSpan={5} className="px-5 py-12 text-center">
                No active admin accounts found.
              </td>
            </tr>

          ) : (

            activeAdmins.map((admin) => {

              const fullName =
                [admin.FirstName, admin.LastName]
                  .filter(Boolean)
                  .join(" ");

              return (

                <tr
                  key={admin.EmployeeId}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-5 py-4">

                    <div className="font-medium text-slate-900">
                      {fullName || "—"}
                    </div>

                    {admin.EmployeeNo && (
                      <div className="text-xs text-slate-400">
                        {admin.EmployeeNo}
                      </div>
                    )}

                  </td>


                  <td className="px-5 py-4 text-slate-700">
                    {admin.Email}
                  </td>


                  <td className="px-5 py-4">
                    <OfficeBadge code={admin.SameDeptCode}/>
                  </td>


                  <td className="px-5 py-4">
                    <RoleBadge roleId={admin.role_id}/>
                  </td>


                  <td className="px-5 py-4">

                    {admin.role_id === ROLES.ADMIN ? (

                      <div className="flex justify-end">

                        <Button
                          size="icon"
                          variant="ghost"
                          type="button"
                          aria-label={`Deactivate ${admin.Email}`}
                          loading={
                            deletingId === admin.EmployeeId
                          }
                          onClick={() =>
                            onDelete?.(admin)
                          }
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                          </svg>

                        </Button>

                      </div>

                    ) : (

                      <span className="text-xs text-slate-400">
                        Protected
                      </span>

                    )}

                  </td>

                </tr>

              );

            })

          )}

        </tbody>

      </table>
    </div>
  );
}