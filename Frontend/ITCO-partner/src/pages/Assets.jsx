import { useMemo, useState } from "react";
import AssetPickerModal from "../components/assets/AssetPickerModal";
import AddAssetModal from "../components/assets/AddAssetModal";
import AssetStats from "../components/assets/AssetStats";
import AssetToolbar from "../components/assets/AssetToolbar";
import AssetTable from "../components/assets/AssetTable";
import ViewAssetModal from "../components/assets/ViewAssetModal";

export default function Assets() {
const [search, setSearch] = useState("");
const [unitFilter, setUnitFilter] = useState("");
const [sortBy, setSortBy] = useState("newest");

// View Asset Modal
const [modalOpen, setModalOpen] = useState(false);
const [selectedAsset, setSelectedAsset] = useState(null);

// New Asset Flow
const [pickerOpen, setPickerOpen] = useState(false);
const [addModalOpen, setAddModalOpen] = useState(false);
const [selectedMasterAsset, setSelectedMasterAsset] = useState(null);

  const assets = [
    {
      ArticleId: 1,
      article: "Laptop",
      description: "Dell Latitude 5420",
      propNumber: "ICTO-001",
      dateAcquired: "2024-01-10",
      unit: "pcs",
      unitValue: 55000,
      balQty: 1,
      balValue: 55000,
    },
    {
      ArticleId: 2,
      article: "Printer",
      description: "Epson L3210",
      propNumber: "ICTO-002",
      dateAcquired: "2023-12-05",
      unit: "pcs",
      unitValue: 12000,
      balQty: 1,
      balValue: 12000,
    },
    {
      ArticleId: 3,
      article: "Desktop Computer",
      description: "Core i5 Workstation",
      propNumber: "ICTO-003",
      dateAcquired: "2024-02-20",
      unit: "set",
      unitValue: 35000,
      balQty: 1,
      balValue: 35000,
    },
    {
      ArticleId: 4,
      article: "Projector",
      description: "Epson Projector",
      propNumber: "ICTO-004",
      dateAcquired: "2023-11-15",
      unit: "pcs",
      unitValue: 18000,
      balQty: 1,
      balValue: 18000,
    },
    {
      ArticleId: 5,
      article: "Office Chair",
      description: "Ergonomic Chair",
      propNumber: "ICTO-005",
      dateAcquired: "2024-03-01",
      unit: "pcs",
      unitValue: 5000,
      balQty: 2,
      balValue: 10000,
    },
    {
      ArticleId: 6,
      article: "Air Conditioner",
      description: "Split Type 1.5HP",
      propNumber: "ICTO-006",
      dateAcquired: "2022-08-10",
      unit: "unit",
      unitValue: 25000,
      balQty: 1,
      balValue: 25000,
    },
    {
      ArticleId: 7,
      article: "Camera",
      description: "Canon DSLR",
      propNumber: "ICTO-007",
      dateAcquired: "2023-06-18",
      unit: "pcs",
      unitValue: 30000,
      balQty: 1,
      balValue: 30000,
    },
  ];

  const filteredAssets = useMemo(() => {
    let data = [...assets];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.article.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword) ||
          item.propNumber.toLowerCase().includes(keyword)
      );
    }

    if (unitFilter) {
      data = data.filter((item) => item.unit === unitFilter);
    }

    switch (sortBy) {
      case "highest":
        data.sort((a, b) => b.balValue - a.balValue);
        break;

      case "lowest":
        data.sort((a, b) => a.balValue - b.balValue);
        break;

      case "az":
        data.sort((a, b) => a.article.localeCompare(b.article));
        break;

      case "oldest":
        data.sort(
          (a, b) =>
            new Date(a.dateAcquired) - new Date(b.dateAcquired)
        );
        break;

      default:
        data.sort(
          (a, b) =>
            new Date(b.dateAcquired) - new Date(a.dateAcquired)
        );
    }

    return data;
  }, [search, unitFilter, sortBy]);

  const totalAssets = assets.length;

  const totalQuantity = assets.reduce(
    (sum, item) => sum + item.balQty,
    0
  );

  const totalValue = assets.reduce(
    (sum, item) => sum + item.balValue,
    0
  );

  const totalCategories = new Set(
    assets.map((item) => item.article)
  ).size;

  const handleView = (asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Assets
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage all ICTO property assets.
        </p>
      </div>

      <AssetStats
        totalAssets={totalAssets}
        totalQuantity={totalQuantity}
        totalValue={totalValue}
        totalCategories={totalCategories}
      />

<AssetToolbar
    search={search}
    setSearch={setSearch}
    unitFilter={unitFilter}
    setUnitFilter={setUnitFilter}
    sortBy={sortBy}
    setSortBy={setSortBy}
    onNewAsset={() => setPickerOpen(true)}
/>

      <AssetTable
        assets={filteredAssets}
        onView={handleView}
      />

      <ViewAssetModal
        open={modalOpen}
        asset={selectedAsset}
        onClose={() => setModalOpen(false)}
      />

     <AssetPickerModal
    open={pickerOpen}
    onClose={() => setPickerOpen(false)}
    assets={assets}
onSelect={(asset) => {
    setSelectedMasterAsset(asset);
    setPickerOpen(false);
    setAddModalOpen(true);
}}
/>

<AddAssetModal
    open={addModalOpen}
    asset={selectedMasterAsset}
    onClose={() => setAddModalOpen(false)}
    onSave={(data) => {
        console.log("READY FOR BACKEND");

        console.log(data);

        setAddModalOpen(false);
    }}
/>

    </div>
  );
}