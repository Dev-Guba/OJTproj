import { useAuth } from "../context/AuthContext";
import RecentRecords from "../components/dashboard/RecentRecords";
import RecordsByOffice from "../components/dashboard/RecordsByOffice";
import QuickInsights from "../components/dashboard/QuickInsights";
import useDashboardData from "../components/dashboard/useDashboardData";

export default function Dashboard() {
  const { user } = useAuth();
  const { loading, stats, isSuperAdmin } = useDashboardData(user);

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "there";

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 rounded-2xl bg-[#1e3a5f] p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-semibold text-white sm:text-xl">
            Welcome back, {displayName}!
          </div>
          <div className="mt-1 text-xs text-white/70 sm:text-sm">
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="self-start rounded-full border border-amber-400/30 bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-300 md:self-auto">
          {isSuperAdmin ? "Super Admin" : "Admin"} · {user?.officeCode ?? ""}
        </div>
      </div>

      {/* Stat Cards */}
      <QuickInsights
        loading={loading}
        isSuperAdmin={isSuperAdmin}
        topOffice={stats.topOffice}
        totalRecords={stats.totalRecords}
        totalValue={stats.totalValue}
        totalAdmins={stats.totalAdmins}
        totalEmployees={stats.totalEmployees}
        totalQty={stats.totalQty}
        totalOffices={stats.totalOffices}
      />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
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

    </div>
  );
}