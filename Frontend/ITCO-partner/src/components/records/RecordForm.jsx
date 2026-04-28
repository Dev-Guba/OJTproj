import Input from "../ui/Input";
import Textarea from "../ui/TextArea";
import Button from "../ui/Button";
import EmployeeCombobox from "./EmployeeCombobox";  // removed unused EmployeeSelectField

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
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border bg-white p-5 shadow-sm"
    >
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

        {/* Wrapped to match the label pattern of other fields */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Employee</label>
          <EmployeeCombobox
            options={employeeOptions}
            value={selectedEmployeeId}
            onChange={onEmployeeChange}
            disabled={loadingEmployees}
            placeholder={
              loadingEmployees
                ? "Loading employees..."
                : "Search by name, employee no, or dept..."
            }
          />
        </div>

        <Input
          label="Accountable Officer"
          value={form.accountableOfficer ?? ""}
          readOnly
        />

        <Input
          label="Office"
          value={form.office ?? ""}
          readOnly
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

      <div className="mt-5 flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading
            ? editMode
              ? "Updating..."
              : "Submitting..."
            : editMode
            ? "Update"
            : "Submit"}
        </Button>

        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}