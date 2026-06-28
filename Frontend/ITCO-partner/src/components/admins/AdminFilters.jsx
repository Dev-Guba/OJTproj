import Input from "../ui/Input";
import Select from "../ui/Select";

export default function AdminFilters({
  search,
  officeFilter,
  officeOptions = [],
  onSearchChange,
  onOfficeChange,
}) {
  return (
    <div className="grid gap-4 border-b border-slate-100 px-5 py-4 md:grid-cols-[1fr_200px]">
      <Input
        label="Search"
        placeholder="Search by email or office..."
        value={search}
        onChange={onSearchChange}
      />
      <Select
        label="Office"
        value={officeFilter}
        onChange={onOfficeChange}
      >
        {officeOptions.map((office) => (
          <option key={office} value={office}>{office}</option>
        ))}
      </Select>
    </div>
  );
}