import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import Input from "../ui/Input";
import Button from "../ui/Button";

export default function AddAssetModal({
  open,
  asset,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    article: "",
    description: "",
    propNumber: "",
    dateAcquired: "",
    unit: "",
    unitValue: 0,
    balQty: 1,
    balValue: 0,
  });

  useEffect(() => {
    if (!asset) return;

    setForm({
      article: asset.article,
      description: asset.description,
      propNumber: asset.propNumber,
      dateAcquired: asset.dateAcquired,
      unit: asset.unit,
      unitValue: asset.unitValue,
      balQty: 1,
      balValue: asset.unitValue,
    });
  }, [asset]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      balValue: prev.unitValue * prev.balQty,
    }));
  }, [form.balQty]);

  if (!open || !asset) return null;

  const handleSave = () => {
    onSave(form);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-5">

        <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">

          {/* Header */}

          <div className="flex items-center justify-between border-b p-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Add Asset
              </h2>

              <p className="text-slate-500">
                Asset information has been automatically filled.
              </p>

            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 hover:bg-slate-100"
            >
              <X size={20}/>
            </button>

          </div>

          {/* Body */}

          <div className="grid gap-5 p-6 md:grid-cols-2">

            <Input
              label="Article"
              value={form.article}
              readOnly
            />

            <Input
              label="Description"
              value={form.description}
              readOnly
            />

            <Input
              label="Property Number"
              value={form.propNumber}
              readOnly
            />

            <Input
              label="Date Acquired"
              value={form.dateAcquired}
              readOnly
            />

            <Input
              label="Unit"
              value={form.unit}
              readOnly
            />

            <Input
              label="Unit Value"
              value={`₱${Number(form.unitValue).toLocaleString()}`}
              readOnly
            />

            <Input
              label="Quantity"
              type="number"
              min={1}
              value={form.balQty}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  balQty: Number(e.target.value),
                }))
              }
            />

            <Input
              label="Balance Value"
              value={`₱${Number(form.balValue).toLocaleString()}`}
              readOnly
            />

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t p-6">

            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
            >
              Save Asset
            </Button>

          </div>

        </div>

      </div>
    </>
  );
}