import Modal from "../ui/Modal";
import Input from "../ui/Input";

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
            : "Create Admin"
          : updating
          ? "Saving..."
          : "Save Changes"
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-sm font-semibold text-slate-900">
            {isCreate ? "New Admin Account" : "Update Admin Account"}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {isCreate
              ? "Create a login account and assign it to a specific office."
              : "Update the admin email, office assignment, or password."}
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Login Email"
            value={form.email}
            onChange={onChange("email")}
            placeholder="Enter admin login email"
          />

          {isCreate ? (
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={onChange("password")}
              placeholder="Enter password"
            />
          ) : (
            <div className="space-y-1">
              <Input
                label="New Password"
                type="password"
                value={form.password}
                onChange={onChange("password")}
                placeholder="Leave blank to keep current password"
              />
              <p className="text-xs text-slate-500">
                Leave this blank if you do not want to change the current password.
              </p>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Assign Office
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
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
            <p className="text-xs text-slate-500">
              This determines which office records the admin can manage.
            </p>
          </div>

          {form.SameDeptCode && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700">
              Assigned office:{" "}
              <span className="font-semibold">{form.SameDeptCode}</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}