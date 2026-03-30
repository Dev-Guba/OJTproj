import Input from "../ui/Input";
import Button from "../ui/Button";

export default function RecordsToolbar({
  search,
  onSearchChange,
  onOpenReport,
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-end">
        <div className="w-full md:w-96">
          <Input
            label="Search"
            placeholder="Search by Article, Prop No., Officer, Office..."
            value={search}
            onChange={onSearchChange}
          />
        </div>
      </div>

      <div className="md:ml-auto">
        <Button type="button" onClick={onOpenReport}>
          Generate Report
        </Button>
      </div>
    </div>
  );
}