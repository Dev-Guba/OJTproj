const colors = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
  LOGIN: "bg-blue-100 text-blue-700",
  LOGOUT: "bg-gray-200 text-gray-700",
  EXPORT: "bg-purple-100 text-purple-700",
  PRINT: "bg-orange-100 text-orange-700",
};

export default function AuditBadge({ action }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[action] || "bg-gray-100 text-gray-600"
      }`}
    >
      {action}
    </span>
  );
}