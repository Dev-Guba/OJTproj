function AdminRoleBadge({ roleId }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        roleId === 1
          ? "bg-purple-50 text-purple-700"
          : "bg-blue-50 text-blue-700"
      }`}
    >
      {roleId === 1 ? "Super Admin" : "Admin"}
    </span>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
        ) : null}
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

export default function OfficeAdminsSection({ admins = [] }) {
  return (
    <SectionCard
      title="Assigned Admins"
      subtitle="Accounts currently assigned to this office"
    >
      {admins.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          No admins assigned to this office.
        </div>
      ) : (
        <div className="space-y-3">
          {admins.map((admin) => (
            <div
              key={admin.user_id}
              className="rounded-xl border border-slate-200 px-4 py-3"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {admin.email}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {admin.EmployeeNo
                      ? `Linked Employee: ${admin.EmployeeNo}${
                          admin.Employee?.FirstName || admin.Employee?.LastName
                            ? ` — ${[
                                admin.Employee?.FirstName,
                                admin.Employee?.LastName,
                              ]
                                .filter(Boolean)
                                .join(" ")}`
                            : ""
                        }`
                      : "No linked employee"}
                  </div>
                </div>

                <div className="shrink-0">
                  <AdminRoleBadge roleId={admin.role_id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
