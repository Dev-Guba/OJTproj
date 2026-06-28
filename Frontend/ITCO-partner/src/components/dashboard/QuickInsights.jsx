import StatCard from "./StatCard";

export default function QuickInsights({
  loading,
  isSuperAdmin,
  topOffice,
  totalRecords,
  totalValue,
  totalAdmins,
  totalEmployees,
  totalQty,
  totalOffices,
}) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        ))}
      </div>
    );
  }

  if (isSuperAdmin) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Records"
          value={totalRecords.toLocaleString()}
          hint={`${totalOffices} office(s)`}
          icon="records"
          color="navy"
        />
        <StatCard
          label="Total Quantity"
          value={totalQty.toLocaleString()}
          hint="items on stockcard"
          icon="qty"
          color="blue"
        />
        <StatCard
          label="Total Admins"
          value={totalAdmins.toLocaleString()}
          hint="active accounts"
          icon="admins"
          color="gold"
        />
        <StatCard
          label="Total Employees"
          value={totalEmployees.toLocaleString()}
          hint="active employees"
          icon="employees"
          color="green"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        label="Total Records"
        value={totalRecords.toLocaleString()}
        hint="in your office scope"
        icon="records"
        color="navy"
      />
      <StatCard
        label="Total Quantity"
        value={totalQty.toLocaleString()}
        hint="items on stockcard"
        icon="qty"
        color="blue"
      />
      <StatCard
        label="Est. Total Value"
        value={`₱${totalValue.toLocaleString()}`}
        hint="based on unit value × qty"
        icon="value"
        color="gold"
      />
    </div>
  );
}