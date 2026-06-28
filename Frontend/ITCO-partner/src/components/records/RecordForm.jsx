import Input from "../ui/Input";
import Textarea from "../ui/TextArea";
import Button from "../ui/Button";
import EmployeeCombobox from "./EmployeeCombobox";

export default function RecordForm({
  form,
  employeeOptions,
  selectedEmployeeId,
  loading,
  loadingEmployees,
  editMode,
  onFieldChange,
  onEmployeeChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Article"
          value={form.article ?? ""}
          onChange={onFieldChange("article")}
        />
        <Input
          label="Prop No."
          value={form.propNumber ?? ""}
          onChange={onFieldChange("propNumber")}
        />
        <Input
          label="Date Acquired"
          type="date"
          value={form.dateAcquired ?? ""}
          onChange={onFieldChange("dateAcquired")}
        />

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Employee
          </label>
          <EmployeeCombobox
            options={employeeOptions}
            value={selectedEmployeeId}
            onChange={onEmployeeChange}
            disabled={loadingEmployees}
            placeholder={loadingEmployees ? "Loading employees..." : "Search by name or employee no..."}
          />
        </div>

        <Input
          label="Accountable Officer"
          value={form.accountableOfficer ?? ""}
          readOnly
          hint="Auto-filled from selected employee"
        />
        <Input
          label="Office"
          value={form.office ?? ""}
          readOnly
          hint="Auto-filled from selected employee"
        />
        <Input
          label="Unit"
          value={form.unit ?? ""}
          onChange={onFieldChange("unit")}
        />
        <Input
          label="Unit Value"
          type="number"
          value={form.unitValue ?? ""}
          onChange={onFieldChange("unitValue")}
        />
        <Input
          label="Bal. Qty (per Stockcard)"
          type="number"
          value={form.balQty ?? ""}
          onChange={onFieldChange("balQty")}
        />
        <Input
          label="Bal. Value (per Stockcard)"
          type="number"
          value={form.balValue ?? ""}
          onChange={onFieldChange("balValue")}
        />
        <Input
          label="ARE No. / ME No."
          value={form.areMeNo ?? ""}
          onChange={onFieldChange("areMeNo")}
        />

        <div className="md:col-span-2">
          <Textarea
            label="Description"
            rows={3}
            value={form.description ?? ""}
            onChange={onFieldChange("description")}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5">
        <Button type="submit" loading={loading}>
          {editMode ? "Update Record" : "Submit Record"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}