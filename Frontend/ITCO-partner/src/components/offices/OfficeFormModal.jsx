import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";

export default function OfficeFormModal({
  open,
  mode = "create",
  form,
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
      title={isCreate ? "Create Office" : "Edit Office"}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={isCreate ? "Create Office" : "Save Changes"}
      confirmVariant="primary"
      disabled={busy}
    >
      <div className="space-y-4">
        <Input
          label="Office Code"
          value={form.code}
          onChange={onChange("code")}
          placeholder="e.g. ICTO"
          hint="Short identifier used across the system. Will be uppercased automatically."
          required
        />
        <Input
          label="Office Name"
          value={form.name}
          onChange={onChange("name")}
          placeholder="e.g. Information and Communications Technology Office"
          required
        />
        <Select
          label="Status"
          value={form.status}
          onChange={onChange("status")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>
    </Modal>
  );
}