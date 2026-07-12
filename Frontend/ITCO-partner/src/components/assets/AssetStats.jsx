import {
  Package,
  Boxes,
  PhilippinePeso,
  Layers3,
} from "lucide-react";

export default function AssetStats({
  totalAssets,
  totalQuantity,
  totalValue,
  totalCategories,
}) {
  const cards = [
    {
      title: "Total Assets",
      value: totalAssets,
      icon: Package,
      gradient: "from-blue-600 to-blue-500",
    },
    {
      title: "Inventory Value",
      value: `₱${totalValue.toLocaleString()}`,
      icon: PhilippinePeso,
      gradient: "from-emerald-600 to-emerald-500",
    },
    {
      title: "Total Quantity",
      value: totalQuantity,
      icon: Boxes,
      gradient: "from-orange-500 to-orange-400",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: Layers3,
      gradient: "from-violet-600 to-violet-500",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-2xl bg-gradient-to-r ${card.gradient} p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/80">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  {card.value}
                </h2>
              </div>

              <div className="rounded-xl bg-white/15 p-3">
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}