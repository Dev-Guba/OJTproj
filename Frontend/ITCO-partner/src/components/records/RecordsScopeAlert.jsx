export default function RecordsScopeAlert({ isSuperAdmin, isAdmin, isEmployee, user }) {
  if (isSuperAdmin) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[#c5d4e8] bg-[#e8eef6] px-4 py-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-[#1e3a5f]" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="text-sm text-[#1e3a5f]">
          Showing records across <span className="font-semibold">all offices</span>.
        </span>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true">
          <rect x="4" y="3" width="11" height="18" rx="1" />
          <path d="M15 8h5v13h-5" />
        </svg>
        <span className="text-sm text-blue-700">
          Showing records for office:{" "}
          <span className="font-semibold">{user?.SameDeptCode || "N/A"}</span>
        </span>
      </div>
    );
  }

  if (isEmployee) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="text-sm text-amber-700">
          Showing <span className="font-semibold">your assigned articles</span> only.
        </span>
      </div>
    );
  }

  return null;
}