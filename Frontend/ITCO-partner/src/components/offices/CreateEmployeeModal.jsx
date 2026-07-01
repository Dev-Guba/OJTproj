import Modal from "../ui/Modal";
import Input from "../ui/Input";

export default function CreateEmployeeModal({
  open,
  form,
  creating = false,
  onClose,
  onConfirm,
  onChange,
}) {
  return (
    <Modal
      open={open}
      title="Create New Employee"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={creating ? "Creating..." : "Create Employee"}
      disabled={creating}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          A new employee record and login account will be created for your office.
        </p>
          <Input
            label="Employee Number"
            value={form.EmployeeNo}
            onChange={onChange("EmployeeNo")}
            placeholder="EMP-001"
            required
          />
        <div className="grid grid-cols-2 gap-3">
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
          label="Email"
          type="email"
          value={form.email}
          onChange={onChange("email")}
          placeholder="employee@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={onChange("password")}
          placeholder="Set a password"
          required
        />
      </div>
    </Modal>
  );
}