import { Package, UserRound, Boxes } from "lucide-react";

import Input from "../ui/Input";
import Textarea from "../ui/TextArea";
import Button from "../ui/Button";
import SearchCombobox from "./SearchCombobox";

function FormSection({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
          <Icon className="h-6 w-6 text-blue-700" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Add Inventory Record
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create or update an inventory record assigned to an employee.
        </p>
      </div>

      <FormSection
        icon={Package}
        title="Item Information"
        subtitle="Select the inventory item and provide its details."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Article"
              value={form.article ?? ""}
              onChange={onFieldChange("article")}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Description"
              rows={3}
              value={form.description ?? ""}
              onChange={onFieldChange("description")}
            />
          </div>

          <Input
            label="Prop Number"
            value={form.propNumber ?? ""}
            onChange={onFieldChange("propNumber")}
          />
          <Input
            label="ARE No. / ME No."
            value={form.areMeNo ?? ""}
            onChange={onFieldChange("areMeNo")}
          />
        </div>
      </FormSection>

      <FormSection
        icon={UserRound}
        title="Assignment Information"
        subtitle="Assign this inventory item to an employee."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Employee
            </label>
            <SearchCombobox
              options={employeeOptions}
              value={selectedEmployeeId}
              onChange={onEmployeeChange}
              disabled={loadingEmployees}
              loading={loadingEmployees}
              placeholder={
                loadingEmployees
                  ? "Loading employees..."
                  : "Search by name or employee no..."
              }
              emptyMessage="No employees found."
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
        </div>
      </FormSection>

      <FormSection
        icon={Boxes}
        title="Inventory Information"
        subtitle="Inventory quantity and valuation."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Date Acquired"
              type="date"
              value={form.dateAcquired ?? ""}
              onChange={onFieldChange("dateAcquired")}
            />
          </div>

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
            label="Balance Qty"
            type="number"
            value={form.balQty ?? ""}
            onChange={onFieldChange("balQty")}
          />
          <Input
            label="Balance Value"
            type="number"
            value={form.balValue ?? ""}
            onChange={onFieldChange("balValue")}
          />
        </div>
      </FormSection>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {editMode ? "Update Record" : "Submit Record"}
        </Button>
      </div>
    </form>
  );
}