import { useEffect, useMemo, useState } from "react";
import { recordsApi } from "../api/records.api";

const StatCard = ({ label, value, hint }) => (
  <div className="rounded-2xl border bg-white p-5 shadow-sm">
    <div className="text-xs font-medium text-gray-500">{label}</div>
    <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
    {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
  </div>
);

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await recordsApi.getAll();
        setRows(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const totalRecords = rows.length;

    const totalQty = rows.reduce((sum, r) => sum + Number(r.balQty ?? 0), 0);

    const totalValue = rows.reduce((sum, r) => {
      const bv = r.balValue;
      if (bv != null && bv !== "") return sum + Number(bv);
      const uv = Number(r.unitValue ?? 0);
      const q = Number(r.balQty ?? 0);
      return sum + uv * q;
    }, 0);

    const byOffice = rows.reduce((acc, r) => {
      const office = (r.office ?? "Unassigned").trim() || "Unassigned";
      acc[office] = (acc[office] || 0) + 1;
      return acc;
    }, {});

    const topOffice =
      Object.entries(byOffice).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    const missingAre = rows.filter((r) => !String(r.areMeNo ?? "").trim()).length;

    const recent = rows
      .slice()
      .sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")))
      .slice(0, 5);

    return { totalRecords, totalQty, totalValue, topOffice, missingAre, recent };
  }, [rows]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Records" value={loading ? "…" : stats.totalRecords} />
        <StatCard label="Total Qty" value={loading ? "…" : stats.totalQty} hint="Sum of Bal. Qty" />
        <StatCard
          label="Total Value"
          value={loading ? "…" : stats.totalValue.toLocaleString()}
          hint="Bal. Value (fallback = Unit Value × Qty)"
        />
        <StatCard label="Top Office" value={loading ? "…" : stats.topOffice} hint="Most records" />
      </div>

      {/* Alerts + Recent */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-1">
          <div className="text-sm font-semibold text-gray-900">Data Alerts</div>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Missing ARE/ME No.</span>
              <span className="font-semibold">{loading ? "…" : stats.missingAre}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">Recent Records</div>
            <div className="text-xs text-gray-500">Latest 5</div>
          </div>

          <div className="mt-3 divide-y">
            {loading ? (
              <div className="py-6 text-sm text-gray-500">Loading…</div>
            ) : stats.recent.length === 0 ? (
              <div className="py-6 text-sm text-gray-500">No records yet.</div>
            ) : (
              stats.recent.map((r) => (
                <div key={r.id} className="py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {r.article ?? "Untitled"}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        Prop No: {r.propNumber ?? "—"} • Office: {r.office ?? "—"}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}