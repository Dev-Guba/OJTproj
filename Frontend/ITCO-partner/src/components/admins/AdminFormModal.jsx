import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";

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

  return (
    <Modal
      open={open}
      title={isCreate ? "Create Admin" : "Edit Admin"}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={isCreate ? "Create Admin" : "Save Changes"}
      confirmVariant="primary"
      disabled={busy}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Employee Number"
            value={form.EmployeeNo}
            onChange={onChange("EmployeeNo")}
            placeholder="EMP-001"
            required
          />
          <Input
            label="First Name"
            value={form.firstName}
            onChange={onChange("firstName")}
            placeholder="Juan"
            required
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={onChange("lastName")}
            placeholder="Cruz"
            required
          />
        </div>

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