import Input from "../ui/Input";
import Select from "../ui/Select";

export default function AuditToolbar({
  search,
  setSearch,
  actionFilter = "All",
  setActionFilter = () => {},
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:max-w-sm">
          <Input
            label="Search"
            placeholder="User, module, activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-48">
<Select
  label="Activity"
  value={actionFilter}
  onChange={(e) => setActionFilter(e.target.value)}
>
  <option>All</option>
  <option>CREATE</option>
  <option>UPDATE</option>
  <option>RETURNED</option>
  <option>DELETED</option>
</Select>
        </div>

      </div>

      <button
        type="button"
        className="flex h-10 items-center gap-2 rounded-xl bg-[#1e3a5f] px-4 text-sm font-medium text-white transition hover:bg-[#162e4d]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>

        Export Logs
      </button>

    </div>
  );
}