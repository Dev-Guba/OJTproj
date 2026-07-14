import { useEffect, useMemo, useState } from "react";
import backlogApi from "../api/backlog.api";

import AuditStats from "../components/logss/AuditStats";
import AuditToolbar from "../components/logss/AuditToolbar";
import AuditTable from "../components/logss/AuditTable";

export default function AuditLogs() {

const [logs, setLogs] = useState([]);
const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const loadLogs = async () => {
  try {
    setLoading(true);

    useEffect(() => {
  loadLogs();
}, []);

    const response = await backlogApi.getAll();

    setLogs(response.data || []);

  } catch (err) {
    console.error("Failed to load logs:", err);
  } finally {
    setLoading(false);
  }
};

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
  loading={loading}
/>

    </div>

  );

}