import { X, CalendarDays, Hash, Boxes, PhilippinePeso } from "lucide-react";
import Button from "../ui/Button";

export default function ViewAssetModal({ open, asset, onClose }) {
  if (!open || !asset) return null;

  const Item = ({ icon: Icon, label, value }) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="rounded-3xl bg-white shadow-2xl">

          {/* Header */}

          <div className="flex items-start justify-between border-b border-slate-200 p-6">

            <div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                ICTO Asset
              </span>

              <h2 className="mt-4 text-3xl font-bold text-slate-800">
                {asset.article}
              </h2>

              <p className="mt-2 text-slate-500">
                {asset.description}
              </p>

            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

          {/* Body */}

          <div className="grid gap-4 p-6 md:grid-cols-2">

            <Item
              icon={Hash}
              label="Property Number"
              value={asset.propNumber}
            />

            <Item
              icon={CalendarDays}
              label="Date Acquired"
              value={asset.dateAcquired}
            />

            <Item
              icon={Boxes}
              label="Unit"
              value={asset.unit}
            />

            <Item
              icon={Boxes}
              label="Quantity"
              value={asset.balQty}
            />

            <Item
              icon={PhilippinePeso}
              label="Unit Value"
              value={`₱${asset.unitValue.toLocaleString()}`}
            />

            <Item
              icon={PhilippinePeso}
              label="Balance Value"
              value={`₱${asset.balValue.toLocaleString()}`}
            />

          </div>

          {/* Footer */}

          <div className="flex justify-end border-t border-slate-200 p-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}