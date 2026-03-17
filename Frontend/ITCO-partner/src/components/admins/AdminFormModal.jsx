import Modal from "../ui/Modal";
import Input from "../ui/Input";

export default function AdminFormModal({
  open,
  mode = "create", // create | edit
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

  return (
    <Modal
      open={open}
      title={isCreate ? "Create Admin" : "Edit Admin"}
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
          label="Login Email"
          value={form.email}
          onChange={onChange("email")}
          placeholder="Enter admin login email"
        />

        {isCreate && (
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={onChange("password")}
            placeholder="Enter password"
          />
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Assign Office
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
            value={form.SameDeptCode}
            onChange={onChange("SameDeptCode")}
            disabled={loadingOffices}
          >
            <option value="">
              {loadingOffices ? "Loading offices..." : "Select office"}
            </option>
            {officeOptions
              .filter((office) => office !== "All")
              .map((office) => (
                <option key={office} value={office}>
                  {office}
                </option>
              ))}
          </select>
        </div>

        {form.SameDeptCode && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700">
            This admin will be assigned to office:{" "}
            <span className="font-semibold">{form.SameDeptCode}</span>
          </div>
        )}
      </div>
    </Modal>
  );
}