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
  return (
    <Modal
      open={open}
      title="Create Employee Account"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={creating ? "Creating..." : "Create"}
    >
      <div className="space-y-4">
        {selectedEmployee && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700">
            Creating account for{" "}
            <span className="font-semibold">
              {[selectedEmployee.FirstName, selectedEmployee.LastName]
                .filter(Boolean)
                .join(" ") || selectedEmployee.EmployeeNo}
            </span>
          </div>
        )}

        <Input
          label="Email"
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