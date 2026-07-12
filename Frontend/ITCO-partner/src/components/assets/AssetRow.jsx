import { Eye, Monitor, Printer, Camera, Armchair, AirVent, Presentation } from "lucide-react";
import Button from "../ui/Button";

const iconMap = {
  Laptop: Monitor,
  Printer: Printer,
  Camera: Camera,
  "Office Chair": Armchair,
  "Air Conditioner": AirVent,
  Projector: Presentation,
  "Desktop Computer": Monitor,
};

export default function AssetRow({ asset, onView }) {
  const Icon = iconMap[asset.article] || Monitor;

  return (
    <tr className="border-b border-slate-100 transition hover:bg-blue-50/40">
      {/* Article */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-800">
              {asset.article}
            </h3>

            <p className="text-sm text-slate-500">
              {asset.description}
            </p>
          </div>
        </div>
      </td>

      {/* Property */}
      <td className="px-6 py-4">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {asset.propNumber}
        </span>
      </td>

      {/* Unit */}
      <td className="px-6 py-4 capitalize">
        {asset.unit}
      </td>

      {/* Quantity */}
      <td className="px-6 py-4">
        <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          {asset.balQty}
        </span>
      </td>

      {/* Value */}
      <td className="px-6 py-4 font-semibold text-slate-800">
        ₱{asset.balValue.toLocaleString()}
      </td>

      {/* Action */}
      <td className="px-6 py-4">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onView(asset)}
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      </td>
    </tr>
  );
}