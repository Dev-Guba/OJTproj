import { useAuth } from "../context/AuthContext";
import StatCard from "../components/dashboard/StatCard";
import RecordsByOffice from "../components/dashboard/RecordsByOffice";
import RecentRecords from "../components/dashboard/RecentRecords";
import QuickInsights from "../components/dashboard/QuickInsights";
import useDashboardData from "../components/dashboard/useDashboardData";

export default function Dashboard() {
  const { user } = useAuth();
  const { loading, stats, isSuperAdmin } = useDashboardData(user);

  const headerTitle = isSuperAdmin ? "System Overview" : "Office Overview";
  const headerSubtitle = isSuperAdmin
    ? "Capitol-wide summary across offices, admins, employees, and records"
    : "Quick summary of your office records and activity";

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
  <div className="px-6 py-6">
    <div className="flex items-center gap-4">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-3xl">
        🏛️
      </div>

      <div>
        <div className="text-xl font-bold text-slate-900">
          {headerTitle}
        </div>
        <div className="mt-1 text-sm text-slate-500">
          {headerSubtitle}
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isSuperAdmin ? (
          <>
            <StatCard label="Total Offices" value={loading ? "…" : stats.totalOffices} hint="Offices with records" />
            <StatCard label="Total Admins" value={loading ? "…" : stats.totalAdmins} hint="System admin accounts" />
            <StatCard label="Active Employees" value={loading ? "…" : stats.totalEmployees} hint="Currently active employees" />
            <StatCard label="Total Records" value={loading ? "…" : stats.totalRecords} hint="Across all offices" />
          </>
        ) : (
          <>
            <StatCard label="Office Records" value={loading ? "…" : stats.totalRecords} hint="Records visible to you" />
            <StatCard label="Total Quantity" value={loading ? "…" : stats.totalQty} hint="Sum of balance quantity" />
            <StatCard label="Total Value" value={loading ? "…" : stats.totalValue.toLocaleString()} hint="Balance value summary" />
            <StatCard label="Missing ARE/ME" value={loading ? "…" : stats.missingAre} hint="Records needing completion" />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <RecordsByOffice
          loading={loading}
          officeEntries={stats.officeEntries}
          isSuperAdmin={isSuperAdmin}
          topOffice={stats.topOffice}
          missingAre={stats.missingAre}
        />

        <div className="xl:col-span-2">
          <RecentRecords loading={loading} recent={stats.recent} />
        </div>
      </div>

      <QuickInsights
        loading={loading}
        isSuperAdmin={isSuperAdmin}
        topOffice={stats.topOffice}
        totalRecords={stats.totalRecords}
        totalValue={stats.totalValue}
        totalAdmins={stats.totalAdmins}
        totalEmployees={stats.totalEmployees}
      />
    </div>
  );
}