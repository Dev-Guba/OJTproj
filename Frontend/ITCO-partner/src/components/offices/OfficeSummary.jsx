function StatPill({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}

export default function OfficeSummary({ office, adminsCount, employeesCount }) {
  if (!office) return null;

  const isActive = office.status === "active";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              {office.name}
            </h2>

            <span
              className={[
                "rounded-lg px-2.5 py-1 text-xs font-semibold capitalize",
                isActive
                  ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
              ].join(" ")}
            >
              {office.status}
            </span>
          </div>

          <div className="mt-2 text-sm font-medium text-slate-500">
            Office Code:{" "}
            <span className="font-mono text-slate-700">{office.code}</span>
          </div>

          {office.description && (
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
              {office.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:w-64">
          <StatPill label="Admins" value={adminsCount} />
          <StatPill label="Employees" value={employeesCount} />
        </div>
      </div>
    </div>
  );
}