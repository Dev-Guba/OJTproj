function StatPill({ label, value }) {
  return (
    <div className="flex flex-col rounded-xl border border-blue-100 bg-white px-4 py-3">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="mt-1 text-2xl font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export default function OfficeSummary({ office, adminsCount, employeesCount }) {
  if (!office) return null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white px-5 py-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-slate-900">{office.name}</h2>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                office.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {office.status}
            </span>
          </div>

          <div className="mt-1 text-xs text-slate-500 font-mono tracking-wide">
            {office.code}
          </div>

          {office.description && (
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              {office.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:min-w-[180px]">
          <StatPill label="Admins" value={adminsCount} />
          <StatPill label="Employees" value={employeesCount} />
        </div>
      </div>
    </div>
  );
}