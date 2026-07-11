import { useEffect, useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Api from "../../api/auth.api.js";
import { ROLES } from "../../utils/roles";

export default function AdminFormModal({
  open,
  mode = "create",
  form,
  officeOptions = [],
  loadingOffices = false,
  creating = false,
  updating = false,
  onClose,
  onConfirm,
  onChange,
}) {
  const isCreate = mode === "create";
  const busy = isCreate ? creating : updating;

  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Load the pool of promotable employees once, each time the modal opens.
  useEffect(() => {
    if (!open || !isCreate) return;
    let cancelled = false;
    setEmployeesLoading(true);
    Api.getAvailableEmployees()
      .then((res) => {
        if (cancelled) return;
        const list = res.data?.employees || [];
        // Defensive filter — keeps this safe even if availableOnly doesn't already exclude admins.
        setEmployees(
          list.filter((emp) => emp.role_id !== ROLES.ADMIN && emp.role_id !== ROLES.SUPER_ADMIN)
        );
      })
      .catch(() => {
        if (!cancelled) setEmployees([]);
      })
      .finally(() => {
        if (!cancelled) setEmployeesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, isCreate]);

  useEffect(() => {
    if (!open) setSelectedEmployee(null);
  }, [open]);

  const suggestions = useMemo(() => {
    const query = (form.EmployeeNo || "").trim().toLowerCase();
    if (!query || selectedEmployee) return [];
    return employees
      .filter((emp) => String(emp.EmployeeNo || "").toLowerCase().includes(query))
      .slice(0, 8);
  }, [employees, form.EmployeeNo, selectedEmployee]);

  const showDropdown = isCreate && !selectedEmployee && !!form.EmployeeNo?.trim();

  const handleSelectEmployee = (emp) => {
  setSelectedEmployee(emp);

  onChange("EmployeeNo")({ target: { value: emp.EmployeeNo || "" } });
  onChange("firstName")({ target: { value: emp.FirstName || "" } });
  onChange("lastName")({ target: { value: emp.LastName || "" } });
  onChange("email")({ target: { value: emp.Email || "" } });
  onChange("SameDeptCode")({ target: { value: emp.SameDeptCode || "" } });
  onChange("employeeId")({ target: { value: emp.EmployeeId } });
};

  const handleClearEmployee = () => {
  setSelectedEmployee(null);

  onChange("EmployeeNo")({ target: { value: "" } });
  onChange("firstName")({ target: { value: "" } });
  onChange("lastName")({ target: { value: "" } });
  onChange("email")({ target: { value: "" } });
  onChange("SameDeptCode")({ target: { value: "" } });
  onChange("employeeId")({ target: { value: null } });
};

  const confirmDisabled = busy || (isCreate && !selectedEmployee);

  return (
    <Modal
      open={open}
      title={isCreate ? "Create Admin" : "Edit Admin"}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={isCreate ? "Create Admin" : "Save Changes"}
      confirmVariant="primary"
      disabled={confirmDisabled}
    >
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Employee Number"
            value={form.EmployeeNo}
            onChange={onChange("EmployeeNo")}
            placeholder={isCreate ? "Start typing to search, e.g. EMP0001" : "EMP-001"}
            disabled={isCreate && !!selectedEmployee}
            required
          />
          {isCreate && selectedEmployee && (
            <button
              type="button"
              onClick={handleClearEmployee}
              className="mt-1 text-xs font-semibold text-[#1e3a5f] hover:underline"
            >
              Change selected employee
            </button>
          )}
          {showDropdown && (
            <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
              {employeesLoading ? (
                <div className="px-4 py-3 text-sm text-slate-400">Loading employees…</div>
              ) : suggestions.length ? (
                suggestions.map((emp) => (
                  <button
                    key={emp.EmployeeId}
                    type="button"
                    onClick={() => handleSelectEmployee(emp)}
                    className="flex w-full flex-col items-start gap-0.5 px-4 py-2 text-left transition hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {emp.EmployeeNo} — {emp.FirstName} {emp.LastName}
                    </span>
                    {emp.SameDeptCode && (
                      <span className="text-xs text-slate-400">{emp.SameDeptCode}</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-400">No matching employees found.</div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={onChange("firstName")}
            placeholder="Juan"
            disabled={isCreate && !!selectedEmployee}
            required
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={onChange("lastName")}
            placeholder="Cruz"
            disabled={isCreate && !!selectedEmployee}
            required
          />
        </div>

        {isCreate && selectedEmployee && (
          <div className="flex items-center gap-2 rounded-xl border border-[#c5d4e8] bg-[#e8eef6] px-4 py-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-[#1e3a5f]" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span className="text-sm text-[#1e3a5f]">
              Matched <span className="font-semibold">{selectedEmployee.FirstName} {selectedEmployee.LastName}</span> from the employee records.
            </span>
          </div>
        )}

        <Input
          label="Login Email"
          type="email"
          value={form.email}
          onChange={onChange("email")}
          placeholder="admin@example.com"
          required
        />

        <Input
          label={isCreate ? "Password" : "New Password"}
          type="password"
          value={form.password}
          onChange={onChange("password")}
          placeholder={isCreate ? "Enter password" : "Leave blank to keep current"}
          hint={!isCreate ? "Leave blank to keep the current password." : undefined}
          required={isCreate}
        />

        <Select
          label="Assign Office"
          value={form.SameDeptCode}
          onChange={onChange("SameDeptCode")}
          disabled={loadingOffices}
          hint="Determines which office records this admin can manage."
          required
        >
          <option value="">
            {loadingOffices ? "Loading offices..." : "Select office"}
          </option>
          {officeOptions
            .filter((o) => o !== "All")
            .map((office) => (
              <option key={office} value={office}>{office}</option>
            ))}
        </Select>

        {form.SameDeptCode && (
          <div className="flex items-center gap-2 rounded-xl border border-[#c5d4e8] bg-[#e8eef6] px-4 py-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-[#1e3a5f]" aria-hidden="true">
              <rect x="4" y="3" width="11" height="18" rx="1" />
              <path d="M15 8h5v13h-5" />
            </svg>
            <span className="text-sm text-[#1e3a5f]">
              Assigned to <span className="font-semibold">{form.SameDeptCode}</span>
            </span>
          </div>
        )}
      </div>
    </Modal>  
  );
}