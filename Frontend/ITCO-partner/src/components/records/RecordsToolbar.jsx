import Input from "../ui/Input";
import Select from "../ui/Select";

export default function RecordsToolbar({
  search,
  onSearchChange,
  onOpenReport,
  isSuperAdmin,
  officeFilter,
  officeOptions = [],
  onOfficeChange,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:max-w-sm">
          <Input
            label="Search"
            placeholder="Article, Prop No., Officer, Office..."
            value={search}
            onChange={onSearchChange}
          />
        </div>

        {isSuperAdmin && (
          <div className="w-full sm:w-48">
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
        )}
      </div>

      <button
        type="button"
        onClick={onOpenReport}
        className={[
          "flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium",
          "bg-[#1e3a5f] text-white transition hover:bg-[#162e4d] active:scale-[0.98]",
        ].join(" ")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        Generate Report
      </button>
    </div>
  );
}