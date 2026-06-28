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
          label="Email"
          type="email"
          value={form.email}
          onChange={onChange("email")}
          placeholder="employee@example.com"
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={onChange("password")}
          placeholder="Set a password"
        />
      </div>
    </Modal>
  );
}