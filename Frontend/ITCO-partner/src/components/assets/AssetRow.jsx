import {
  Eye,
  Monitor,
  Printer,
  Camera,
  Armchair,
  AirVent,
  Presentation,
} from "lucide-react";

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


  const owner =
    asset.accountableOfficer ||
    asset.owner;


  return (
    <tr className="border-b border-slate-100 transition hover:bg-blue-50/40">


      {/* Asset */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
            <Icon className="h-4 w-4" />
          </div>


          <div>
            <h3 className="font-semibold text-slate-800">
              {asset.article}
            </h3>

            <p className="text-xs text-slate-500">
              {asset.description}
            </p>
          </div>

        </div>
      </td>



      {/* Property Number */}
      <td className="px-4 py-3">

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">

          {asset.propNumber}

        </span>

      </td>



      {/* Unit */}
      <td className="px-4 py-3 capitalize">

        {asset.unit}

      </td>



      {/* Quantity */}
      <td className="px-4 py-3">

        <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">

          {asset.balQty ?? 0}

        </span>

      </td>



      {/* Value */}
      <td className="px-4 py-3 font-semibold text-slate-800">

        ₱{Number(asset.balValue || 0).toLocaleString()}

      </td>



      {/* Owner */}
      <td className="px-4 py-3">

        {owner ? (

          <div>

            <p className="font-semibold text-slate-700">
              {owner}
            </p>


            {asset.office && (

              <p className="text-xs text-slate-500">
                {asset.office}
              </p>

            )}

          </div>

        ) : (

          <span className="text-sm text-slate-400">
            To be assigned
          </span>

        )}

      </td>



      {/* Action */}
      <td className="px-4 py-3 text-center">

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