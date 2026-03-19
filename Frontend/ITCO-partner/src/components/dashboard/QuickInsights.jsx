export default function QuickInsights({
  loading,
  isSuperAdmin,
  topOffice,
  totalRecords,
  totalValue,
  totalAdmins,
  totalEmployees,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Quick Insight</div>
        <div className="mt-3 text-sm text-slate-600">
          {loading
            ? "Loading summary..."
            : isSuperAdmin
            ? `Top office right now is ${topOffice}.`
            : `You currently have ${totalRecords} record(s) visible in your office scope.`}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Record Value</div>
        <div className="mt-3 text-sm text-slate-600">
          {loading ? "Loading summary..." : `Estimated visible value: ${totalValue.toLocaleString()}`}
        </div>
      </div>

      {isSuperAdmin && (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Admin Coverage</div>
            <div className="mt-3 text-sm text-slate-600">
              {loading ? "Loading summary..." : `${totalAdmins} admin account(s) are currently in the system.`}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Employee Coverage</div>
            <div className="mt-3 text-sm text-slate-600">
              {loading ? "Loading summary..." : `${totalEmployees} active employee(s) are currently available.`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}