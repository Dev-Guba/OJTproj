import { useEffect, useMemo, useState } from "react";
import backlogApi from "../api/backlog.api.js";

import AuditStats from "../components/logss/AuditStats";
import AuditToolbar from "../components/logss/AuditToolbar";
import AuditTable from "../components/logss/AuditTable";
import TransferDetailModal from "../components/logss/TransferDetailModal";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const loadLogs = async () => {
    try {
      setLoading(true);

      const response = await backlogApi.getAll();

      console.log("Response:", response);

      const rawLogs = response.data.data || [];

      const formattedLogs = rawLogs.map((log) => {
        const performedBy = log.PerformedBy;
        const article = log.ICTORecord?.Article;
        const office = log.ICTORecord?.office;

        const formatName = (person) =>
          person
            ? `${person.FirstName || ""} ${person.LastName || ""}`.trim()
            : null;

        return {
          id: log.tracking_id,

          createdAt: log.createdAt, // <-- ADD THIS

          time: new Date(log.createdAt).toLocaleString(),

          user: performedBy
            ? `${performedBy.FirstName || ""} ${performedBy.LastName || ""}`.trim()
            : "Unknown User",

          role: performedBy ? "Employee" : "-",

          module: "Records",

          activity:
            log.remarks ||
            (article ? `${log.action} - ${article.article}` : log.action),

          office: office || "-",

          action:
            log.action === "CREATED"
              ? "CREATE"
              : log.action === "TRANSFERRED"
              ? "UPDATE"
              : (log.action || "-").toUpperCase(),

          // Extra detail only meaningful for transfers, used by the modal
          previousOwner: formatName(log.PreviousOwner),
          newOwner: formatName(log.NewOwner),
          articleName: article?.article || "-",
          propNumber: article?.propNumber || "-",
        };
      });

      setLogs(formattedLogs);
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    if (!search.trim()) return logs;

    const keyword = search.toLowerCase();

    return logs.filter(
      (log) =>
        (log.user ?? "").toLowerCase().includes(keyword) ||
        (log.module ?? "").toLowerCase().includes(keyword) ||
        (log.activity ?? "").toLowerCase().includes(keyword) ||
        (log.office ?? "").toLowerCase().includes(keyword) ||
        (log.action ?? "").toLowerCase().includes(keyword)
    );
  }, [logs, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Audit Logs</h1>

        <p className="mt-2 text-slate-500">
          Monitor all user activities performed throughout the system.
        </p>
      </div>

      <AuditStats logs={logs} />

      <AuditToolbar search={search} setSearch={setSearch} />

      <AuditTable
        rows={filteredLogs}
        loading={loading}
        onView={(log) => setSelectedLog(log)}
      />

      <TransferDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}