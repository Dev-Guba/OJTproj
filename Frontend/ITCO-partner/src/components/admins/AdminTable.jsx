import Button from "../ui/Button";
import { ROLES } from "../../utils/roles";

function roleLabel(roleId) {
  if (roleId === ROLES.SUPER_ADMIN) return "Super Admin";
  if (roleId === ROLES.ADMIN) return "Admin";
  if (roleId === ROLES.EMPLOYEE) return "Employee";
  return `Role \`${roleId}\``;
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
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="border border-slate-200 px-4 py-3 text-left">Email</th>
            <th className="border border-slate-200 px-4 py-3 text-left">Office</th>
            <th className="border border-slate-200 px-4 py-3 text-left">Linked Employee</th>
            <th className="border border-slate-200 px-4 py-3 text-left">Role</th>
            <th className="border border-slate-200 px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={6}
                className="border border-slate-200 px-4 py-8 text-center text-slate-500"
              >
                Loading admins...
              </td>
            </tr>
          ) : admins.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="border border-slate-200 px-4 py-8 text-center text-slate-500"
              >
                No admin accounts found.
              </td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin.user_id} className="hover:bg-slate-50">
                <td className="border border-slate-200 px-4 py-3">{admin.Email}</td>
                <td className="border border-slate-200 px-4 py-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {admin.SameDeptCode || admin.Employee?.SameDeptCode || "-"}
                  </span>
                </td>
                <td className="border border-slate-200 px-4 py-3">
                  {admin.EmployeeNo
                    ? `${admin.EmployeeNo}${
                        admin.Employee?.FirstName || admin.Employee?.LastName
                          ? ` — ${[admin.Employee?.FirstName, admin.Employee?.LastName]
                              .filter(Boolean)
                              .join(" ")}`
                          : ""
                      }`
                    : "-"}
                </td>
                <td className="border border-slate-200 px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      admin.role_id === ROLES.SUPER_ADMIN
                        ? "bg-purple-50 text-purple-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {roleLabel(admin.role_id)}
                  </span>
                </td>
                <td className="border border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    {admin.role_id === ROLES.ADMIN ? (
                      <>
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => onEdit?.(admin)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          type="button"
                          loading={deletingId === admin.user_id}
                          onClick={() => onDelete?.(admin)}
                        >
                          Delete
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