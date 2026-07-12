import { Search, Plus, ArrowUpDown } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function AssetToolbar({
  search,
  setSearch,
  unitFilter,
  setUnitFilter,
  sortBy,
  setSortBy,
  onNewAsset,
}){
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

        {/* Search */}
        <div className="flex-1">
          <Input
            label="Search Assets"
            placeholder="Article, description or property number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Unit Filter */}
        <div className="w-full lg:w-48">
          <Select
            label="Unit"
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
          >
            <option value="">All Units</option>
            <option value="pcs">pcs</option>
            <option value="set">set</option>
            <option value="unit">unit</option>
          </Select>
        </div>

        {/* Sort */}
        <div className="w-full lg:w-52">
          <Select
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Value</option>
            <option value="lowest">Lowest Value</option>
            <option value="az">Article A-Z</option>
          </Select>
        </div>

        {/* Button */}
        <Button
    className="h-11 whitespace-nowrap px-6"
    onClick={onNewAsset}
>
          <Plus className="h-4 w-4" />
          New Asset
        </Button>

      </div>
    </div>
  );
}