import { useMemo, useState } from "react";
import Button from "../ui/Button";

function EmployeeAccountBadge({ hasAccount }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        hasAccount
          ? "bg-blue-50 text-blue-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {hasAccount ? "Has Account" : "No Account"}
    </span>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
        ) : null}
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

const PAGE_SIZE = 5;

export default function OfficeEmployeesSection({
  employees = [],
  onCreateAccount,
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(employees.length / PAGE_SIZE));

  const paginatedEmployees = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return employees.slice(start, end);
  }, [employees, page]);

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  return (
    <SectionCard
      title="Employees Under This Office"
      subtitle="Active employees currently assigned to this office"
    >
      {employees.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          No active employees found for this office.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {paginatedEmployees.map((emp) => (
              <div
                key={emp.EmployeeNo}
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {[emp.FirstName, emp.LastName].filter(Boolean).join(" ") || "-"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Employee No: {emp.EmployeeNo}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Email: {emp.Email || "-"}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <EmployeeAccountBadge hasAccount={emp.hasAccount} />

                    {emp.account?.email ? (
                      <div className="text-xs text-slate-500">
                        Account: {emp.account.email}
                      </div>
                    ) : null}

                    {!emp.hasAccount && (
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => onCreateAccount?.(emp)}
                      >
                        Create Account
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              Page {page} of {totalPages} • {employees.length} employee(s)
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => goToPage(1)}
              >
                First
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
              >
                Prev
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={page === totalPages}
                onClick={() => goToPage(totalPages)}
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}