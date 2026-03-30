export default function EmployeeSelectField({
  value,
  options = [],
  loading = false,
  disabled = false,
  onChange,
  editMode = false,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Employee
      </label>
      <select
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
        value={value}
        onChange={onChange}
        disabled={loading || disabled}
      >
        <option value="">
          {loading ? "Loading employees..." : "Select employee"}
        </option>

        {options.map((emp) => (
          <option key={emp.value} value={emp.value}>
            {emp.label}
          </option>
        ))}
      </select>

      {editMode && (
        <p className="mt-1 text-xs text-slate-500">
          Employee selection is locked while editing.
        </p>
      )}
    </div>
  );
}