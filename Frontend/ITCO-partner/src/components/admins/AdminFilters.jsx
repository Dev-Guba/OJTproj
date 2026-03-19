import Input from "../ui/Input";

export default function AdminFilters({
  search,
  officeFilter,
  officeOptions = [],
  onSearchChange,
  onOfficeChange,
}) {
  return (
    <div className="grid gap-4 border-b border-slate-100 px-4 py-4 md:grid-cols-[1fr_220px]">
      <Input
        label="Search"
        placeholder="Search by email or office..."
        value={search}
        onChange={onSearchChange}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Office Filter
        </label>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
          value={officeFilter}
          onChange={onOfficeChange}
        >
          {officeOptions.map((office) => (
            <option key={office} value={office}>
              {office}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}