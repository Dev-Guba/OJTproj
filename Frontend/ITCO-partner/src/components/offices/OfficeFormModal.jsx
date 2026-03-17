import Modal from "../ui/Modal";
import Input from "../ui/Input";

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

  return (
    <Modal
      open={open}
      title={isCreate ? "Create Office" : "Edit Office"}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={
        isCreate
          ? creating
            ? "Creating..."
            : "Create"
          : updating
          ? "Saving..."
          : "Save Changes"
      }
    >
      <div className="space-y-4">
        <Input
          label="Office Code"
          value={form.code}
          onChange={onChange("code")}
          placeholder="e.g. ICTO"
        />

        <Input
          label="Office Name"
          value={form.name}
          onChange={onChange("name")}
          placeholder="e.g. Information and Communications Technology Office"
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
            value={form.status}
            onChange={onChange("status")}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
