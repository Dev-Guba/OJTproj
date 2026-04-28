import Modal from "../ui/Modal";
import Input from "../ui/Input";

export default function CreateEmployeeAccountModal({
  open,
  selectedEmployee,
  form,
  creating = false,
  onClose,
  onConfirm,
  onChange,
}) {
  const fullName = [selectedEmployee?.FirstName, selectedEmployee?.LastName]
    .filter(Boolean)
    .join(" ") || selectedEmployee?.EmployeeNo;

  const initials = fullName
    ?.trim()
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Modal
      open={open}
      title="Create Employee Account"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={creating ? "Creating..." : "Create Account"}
      disabled={creating}
    >
      <div className="space-y-4">
        {selectedEmployee && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {initials}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{fullName}</div>
              <div className="text-xs text-slate-400">
                {selectedEmployee?.EmployeeId ? `ID: ${selectedEmployee.EmployeeId}` : ""}
                {selectedEmployee?.Email ? ` · ${selectedEmployee.Email}` : ""}
              </div>
            </div>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={onChange("email")}
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={onChange("password")}
        />
      </div>
    </Modal>
  );
}