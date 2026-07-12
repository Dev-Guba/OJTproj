import AssetRow from "./AssetRow";

export default function AssetTable({ assets, onView }) {
  if (assets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
        <div className="text-6xl">📦</div>

        <h2 className="mt-5 text-xl font-semibold text-slate-700">
          No assets found
        </h2>

        <p className="mt-2 text-slate-500">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="sticky top-0 bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-600">

              <th className="px-6 py-4">Asset</th>

              <th className="px-6 py-4">
                Property Number
              </th>

              <th className="px-6 py-4">
                Unit
              </th>

              <th className="px-6 py-4">
                Quantity
              </th>

              <th className="px-6 py-4">
                Balance Value
              </th>

              <th className="px-6 py-4 text-center">
                Action
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {assets.map((asset) => (
              <AssetRow
                key={asset.ArticleId}
                asset={asset}
                onView={onView}
              />
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}