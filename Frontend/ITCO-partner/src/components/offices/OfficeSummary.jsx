function StatPill({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function OfficeSummary({ office, adminsCount, employeesCount }) {
  if (!office) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900">{office.name}</div>
          <div className="mt-1 text-sm text-slate-600">
            Office Code: <span className="font-medium">{office.code}</span>
          </div>
          <div className="mt-3">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                office.status === "active"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {office.status}
            </span>
          </div>
        </div>

        <div className="grid min-w-65 grid-cols-2 gap-3">
          <StatPill label="Admins" value={adminsCount} />
          <StatPill label="Employees" value={employeesCount} />
        </div>
      </div>
    </div>
  );
}