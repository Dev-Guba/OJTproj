function AdminRoleBadge({ roleId }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        roleId === 1
          ? "bg-purple-50 text-purple-700"
          : "bg-blue-50 text-blue-700"
      }`}
    >
      {roleId === 1 ? "Super Admin" : "Admin"}
    </span>
  );
}

function Initials({ name }) {
  const parts = name?.trim().split(" ") ?? [];
  const letters = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : (parts[0]?.[0] ?? "?");
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 uppercase">
      {letters}
    </div>
  );
}

function SectionCard({ title, subtitle, count, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {subtitle && <div className="mt-0.5 text-xs text-slate-400">{subtitle}</div>}
        </div>
        {count != null && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {count}
          </span>
        )}
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

export default function OfficeAdminsSection({ admins = [] }) {
  return (
    <SectionCard
      title="Assigned Admins"
      subtitle="Accounts currently managing this office"
      count={admins.length}
    >
      {admins.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
          No admins assigned to this office.
        </div>
      ) : (
        <div className="space-y-2">
          {admins.map((admin) => {
            const fullName = [admin.Employee?.FirstName, admin.Employee?.LastName]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={admin.user_id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <Initials name={fullName || admin.email} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-900">
                    {admin.email}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    {fullName
                      ? `${fullName} · ${admin.EmployeeNo}`
                      : admin.EmployeeNo
                      ? `Employee No: ${admin.EmployeeNo}`
                      : "No linked employee"}
                  </div>
                </div>
                <AdminRoleBadge roleId={admin.role_id} />
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}