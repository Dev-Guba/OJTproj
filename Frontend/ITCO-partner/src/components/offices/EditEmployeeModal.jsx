import Modal from "../ui/Modal";
import Input from "../ui/Input";

export default function EditEmployeeModal({
  open,
  selectedEmployee,
  form,
  saving = false,
  onClose,
  onConfirm,
  onChange,
}) {
  const fullName = [selectedEmployee?.FirstName, selectedEmployee?.LastName]
    .filter(Boolean)
    .join(" ") || selectedEmployee?.EmployeeNo;

  return (
    <Modal
      open={open}
      title="View Employee Account"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={saving ? "Saving..." : "Save Changes"}
      disabled={saving}
    >
      <div className="space-y-4">
        {selectedEmployee && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">{fullName}</div>
            <div className="text-xs text-slate-400">{selectedEmployee.EmployeeNo}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={onChange("firstName")}
            required
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={onChange("lastName")}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={onChange("email")}
        />

        <Input
          label="New Password"
          type="password"
          value={form.password}
          onChange={onChange("password")}
          placeholder="Leave blank to keep current"
        />
      </div>
    </Modal>
  );
}