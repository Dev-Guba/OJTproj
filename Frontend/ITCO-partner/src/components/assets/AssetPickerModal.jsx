import { useMemo, useState } from "react";
import { Search, X, Laptop, Printer, Monitor, Camera, AirVent, Armchair, Presentation } from "lucide-react";
import Button from "../ui/Button";

const iconMap = {
  Laptop,
  Printer,
  Camera,
  "Office Chair": Armchair,
  "Air Conditioner": AirVent,
  Projector: Presentation,
  "Desktop Computer": Monitor,
};

export default function AssetPickerModal({
  open,
  onClose,
  assets = [],
  onSelect,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return assets.filter(
      (item) =>
        item.article.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.propNumber.toLowerCase().includes(keyword)
    );
  }, [assets, search]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-5">

        <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl">

          {/* Header */}

          <div className="flex items-center justify-between border-b p-6">

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Select Asset
              </h2>

              <p className="text-slate-500">
                Choose an existing asset from the inventory.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 hover:bg-slate-100"
            >
              <X size={20} />
            </button>

          </div>

          {/* Search */}

          <div className="p-6">

            <div className="relative">

              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />

              <input
                className="w-full rounded-xl border py-3 pl-12 pr-4 focus:border-blue-500 focus:outline-none"
                placeholder="Search article, description or property number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </div>

          {/* List */}

          <div className="max-h-[450px] overflow-y-auto px-6 pb-6">

            <div className="grid gap-4">

              {filtered.map((asset) => {
                const Icon = iconMap[asset.article] || Monitor;

                return (
                  <button
                    key={asset.ArticleId}
                    onClick={() => {
                      onSelect(asset);
                      onClose();
                    }}
                    className="flex items-center gap-5 rounded-2xl border p-5 text-left transition hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div className="rounded-2xl bg-blue-100 p-4 text-blue-600">
                      <Icon size={28} />
                    </div>

                    <div className="flex-1">

                      <h3 className="font-semibold text-slate-800">
                        {asset.description}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {asset.article}
                      </p>

                      <div className="mt-2 flex gap-3 text-xs">

                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          {asset.propNumber}
                        </span>

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                          ₱{asset.unitValue.toLocaleString()}
                        </span>

                      </div>

                    </div>

                    <Button>
                      Select
                    </Button>

                  </button>
                );
              })}

            </div>

          </div>

        </div>

      </div>
    </>
  );
}