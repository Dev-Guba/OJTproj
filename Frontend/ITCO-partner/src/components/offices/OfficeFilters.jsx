import Input from "../ui/Input";
import Select from "../ui/Select";

export default function OfficeFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) {
  return (
    <div className="grid gap-4 border-b border-slate-100 px-5 py-4 md:grid-cols-[1fr_180px]">
      <Input
        label="Search"
        placeholder="Search by office code or name..."
        value={search}
        onChange={onSearchChange}
      />
      <Select
        label="Status"
        value={statusFilter}
        onChange={onStatusChange}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
    </div>
  );
}