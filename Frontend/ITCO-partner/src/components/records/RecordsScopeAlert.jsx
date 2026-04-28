export default function RecordsScopeAlert({
  isSuperAdmin,
  isAdmin,
  isEmployee,
  user,
}) {
  if (isSuperAdmin) {
    return (
      <div className="rounded border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700">
        Showing all offices, employees, and assigned articles.
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        Showing records for office:{" "}
        <span className="font-semibold">
          {user?.SameDeptCode || "N/A"}
        </span>
      </div>
    );
  }

  if (isEmployee) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Showing your assigned articles only.
      </div>
    );
  }

  return null;
}