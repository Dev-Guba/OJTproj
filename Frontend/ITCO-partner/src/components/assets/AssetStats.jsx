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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-2xl bg-gradient-to-r ${card.gradient} p-4 sm:p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/80 sm:text-sm">
                  {card.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl">
                  {card.value}
                </h2>
              </div>

              <div className="rounded-xl bg-white/15 p-2.5 sm:p-3">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}