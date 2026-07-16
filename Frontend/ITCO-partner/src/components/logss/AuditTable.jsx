function ActivityBadge({ action }) {
  const styles = {
    CREATE: "bg-green-100 text-green-700",
    UPDATE: "bg-amber-100 text-amber-700",
    DELETE: "bg-red-100 text-red-700",
    LOGIN: "bg-blue-100 text-blue-700",
    LOGOUT: "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-semibold",
        styles[action] || "bg-slate-100 text-slate-700",
      ].join(" ")}
    >
      {action}
    </span>
  );
}

export default function AuditTable({ rows = [], loading = false, onView }) {
  const Th = ({ children }) => (
    <th className="border border-[#162e4d] bg-[#1e3a5f] px-4 py-3 text-left text-xs font-semibold text-white">
      {children}
    </th>
  );

  const Td = ({ children, className = "" }) => (
    <td
      className={[
        "border border-slate-200 px-4 py-3 text-sm text-slate-700",
        className,
      ].join(" ")}
    >
      {children}
    </td>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <Th>Time</Th>
            <Th>Editor</Th>
            <Th>Module</Th>
            <Th>Activity</Th>
            <Th>Office</Th>
            <Th>Action</Th>
            <Th></Th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i}>
                {[...Array(7)].map((__, j) => (
                  <td key={j} className="border border-slate-200 px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-slate-400">
                No audit logs found.
              </td>
            </tr>
          ) : (
            rows.map((log) => (
              <tr key={log.id} className="transition hover:bg-blue-50">
                <Td>{log.time}</Td>

                <Td>
                  <div className="font-medium">{log.user}</div>
                  <div className="text-xs text-slate-400">{log.role}</div>
                </Td>

                <Td>
                  <span className="font-medium text-[#1e3a5f]">
                    {log.module}
                  </span>
                </Td>

                <Td>{log.activity}</Td>

                <Td>{log.office}</Td>

                <Td>
                  <ActivityBadge action={log.action} />
                </Td>

                <Td>
                  {log.action === "UPDATE" ? (
                    <button
                      onClick={() => onView?.(log)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-100"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}