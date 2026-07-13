import { Package, UserRound, Boxes } from "lucide-react";
import { useState, useEffect } from "react";

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
          <h2 className="text-lg font-bold text-slate-800">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export default function RecordForm({
  form,

  articleOptions,
  selectedArticleId,
  loadingArticles,
  onArticleChange,

  employeeOptions,
  selectedEmployeeId,
  loadingEmployees,
  onEmployeeChange,

  loading,
  editMode,

  onFieldChange,
  onSubmit,
  onCancel,
}) {
  return (
    
    <form onSubmit={onSubmit} className="space-y-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Add Inventory Record
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create or update an inventory record assigned to an employee.
        </p>
      </div>


      {/* ITEM INFORMATION */}
      <FormSection
        icon={Package}
        title="Item Information"
        subtitle="Select the inventory article."
      >

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


          {/* ARTICLE SELECT */}
          <div className="md:col-span-2">

            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Article
            </label>


            <SearchCombobox
              options={articleOptions}
              value={selectedArticleId}
              onChange={onArticleChange}
              disabled={loadingArticles}
              loading={loadingArticles}
              placeholder={
                loadingArticles
                  ? "Loading articles..."
                  : "Search article..."
              }
              emptyMessage="No articles found."
              
            />

          </div>



          <div className="md:col-span-2">

            <Textarea
              label="Description"
              rows={3}
              value={form.description ?? ""}
              readOnly
            />

          </div>



          <Input
            label="Prop Number"
            value={form.propNumber ?? ""}
            readOnly
          />


          <Input
            label="ARE No. / ME No."
            value={form.areMeNo ?? ""}
            onChange={onFieldChange("areMeNo")}
          />


        </div>

      </FormSection>



      {/* ASSIGNMENT */}
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




      {/* INVENTORY */}
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
              readOnly
            />

          </div>



          <Input
            label="Unit"
            value={form.unit ?? ""}
            readOnly
          />



          <Input
            label="Unit Value"
            type="number"
            value={form.unitValue ?? ""}
            readOnly
          />



          <Input
            label="Balance Qty"
            type="number"
            value={form.balQty ?? ""}
            readOnly
          />



          <Input
            label="Balance Value"
            type="number"
            value={form.balValue ?? ""}
            readOnly
          />



        </div>


      </FormSection>



      {/* BUTTONS */}
      <div className="flex flex-wrap items-center justify-end gap-3">

        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>


        <Button
          type="submit"
          loading={loading}
        >
          {editMode ? "Update Record" : "Submit Record"}
        </Button>


      </div>


    </form>
  );
}