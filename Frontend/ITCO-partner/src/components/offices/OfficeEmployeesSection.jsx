import { useMemo, useState } from "react";
import Button from "../ui/Button";

function EmployeeAccountBadge({ hasAccount }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        hasAccount ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {hasAccount ? "Has Account" : "No Account"}
    </span>
  );
}

function Initials({ name }) {
  const parts = name?.trim().split(" ") ?? [];
  const letters = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : (parts[0]?.[0] ?? "?");
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 uppercase">
      {letters}
    </div>
  );
}

const PAGE_SIZE = 5;

export default function OfficeEmployeesSection({ employees = [], onCreateAccount }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter(
      (emp) =>
        [emp.FirstName, emp.LastName].join(" ").toLowerCase().includes(q) ||
        emp.EmployeeNo?.toLowerCase().includes(q) ||
        emp.Email?.toLowerCase().includes(q)
    );
  }, [employees, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const goTo = (n) => setPage(Math.min(Math.max(1, n), totalPages));

  // Reset to page 1 when search changes
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            Employees Under This Office
          </div>
          <div className="mt-0.5 text-xs text-slate-400">
            {employees.length} employee(s) assigned
          </div>
        </div>
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={handleSearch}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-52"
        />
      </div>

      <div className="px-4 py-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            {search ? "No employees match your search." : "No active employees found."}
          </div>
        ) : (
          <div className="space-y-2">
            {paginated.map((emp) => {
              const fullName = [emp.FirstName, emp.LastName].filter(Boolean).join(" ");
              return (
                <div
                  key={emp.EmployeeNo}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <Initials name={fullName} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {fullName || "-"}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {emp.EmployeeNo}
                      {emp.Email ? ` · ${emp.Email}` : ""}
                    </div>
                    {emp.account?.email && (
                      <div className="mt-0.5 text-xs text-blue-500">
                        {emp.account.email}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <EmployeeAccountBadge hasAccount={emp.hasAccount} />
                    {!emp.hasAccount && (
                      <Button size="sm" type="button" onClick={() => onCreateAccount?.(emp)}>
                        Create Account
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-400">
              Page {safePage} of {totalPages}
            </span>
            <div className="flex gap-1">
              {[["First", 1], ["Prev", safePage - 1], ["Next", safePage + 1], ["Last", totalPages]].map(
                ([label, target]) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    disabled={
                      (label === "First" || label === "Prev") && safePage === 1 ||
                      (label === "Last" || label === "Next") && safePage === totalPages
                    }
                    onClick={() => goTo(target)}
                  >
                    {label}
                  </Button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}