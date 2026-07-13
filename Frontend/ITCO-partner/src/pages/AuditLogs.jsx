import { useMemo, useState } from "react";

import AuditStats from "../components/logss/AuditStats";
import AuditToolbar from "../components/logss/AuditToolbar";
import AuditTable from "../components/logss/AuditTable";

export default function AuditLogs() {

  // Temporary data
  const [logs] = useState([
    {
      id: 1,
      time: "09:15 AM",
      user: "Juan Dela Cruz",
      role: "Administrator",
      module: "Records",
      activity: "Created Laptop (ICTO-001)",
      office: "ICTO",
      action: "CREATE",
      createdAt: "2026-07-13"
    },
    {
      id: 2,
      time: "09:42 AM",
      user: "Maria Santos",
      role: "Administrator",
      module: "Assets",
      activity: "Updated Printer (ICTO-022)",
      office: "HR",
      action: "UPDATE",
      createdAt: "2026-07-13"
    },
    {
      id: 3,
      time: "10:30 AM",
      user: "Pedro Reyes",
      role: "Super Admin",
      module: "Employees",
      activity: "Deleted Employee Account",
      office: "Accounting",
      action: "DELETE",
      createdAt: "2026-07-13"
    }
  ]);

  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {

    if (!search.trim()) return logs;

    const keyword = search.toLowerCase();

    return logs.filter(log =>
      log.user.toLowerCase().includes(keyword) ||
      log.module.toLowerCase().includes(keyword) ||
      log.activity.toLowerCase().includes(keyword) ||
      log.office.toLowerCase().includes(keyword)
    );

  }, [logs, search]);

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Audit Logs
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor all user activities performed throughout the system.
        </p>

      </div>

      <AuditStats logs={logs} />

      <AuditToolbar
        search={search}
        setSearch={setSearch}
      />

      <AuditTable
        rows={filteredLogs}
      />

    </div>

  );

}