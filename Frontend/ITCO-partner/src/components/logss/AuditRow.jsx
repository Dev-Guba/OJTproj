import AuditBadge from "./AuditBadge";

export default function AuditRow({ log, onClick }) {
  return (
    <tr
      onClick={() => onClick(log)}
      className="hover:bg-gray-50 cursor-pointer transition"
    >
      <td className="px-5 py-4">{log.time}</td>

      <td className="px-5 py-4">{log.user}</td>

      <td className="px-5 py-4">{log.module}</td>

      <td className="px-5 py-4">
        <AuditBadge action={log.action} />
      </td>

      <td className="px-5 py-4">{log.entity}</td>

      <td className="px-5 py-4">{log.entityId}</td>
    </tr>
  );
}