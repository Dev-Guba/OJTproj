import { useEffect, useMemo, useState } from "react";

import articleAPI from "../api/article.api.js";

import AssetStats from "../components/assets/AssetStats";
import AssetToolbar from "../components/assets/AssetToolbar";
import AssetTable from "../components/assets/AssetTable";
import ViewAssetModal from "../components/assets/ViewAssetModal";

export default function Assets() {
  const [assets, setAssets] = useState([]);

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

  const [loading, setLoading] = useState(false);

  const loadAssets = async () => {
    try {
      setLoading(true);

      const response = await articleAPI.fetchArticle();

      setAssets(response.data.data);

    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    let data = [...assets];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.article?.toLowerCase().includes(keyword) ||
          item.description?.toLowerCase().includes(keyword) ||
          item.propNumber?.toLowerCase().includes(keyword)
      );
    }

    if (unitFilter) {
      data = data.filter(
        (item) => item.unit === unitFilter
      );
    }

    switch (sortBy) {
      case "highest":
        data.sort(
          (a, b) => b.balValue - a.balValue
        );
        break;

      case "lowest":
        data.sort(
          (a, b) => a.balValue - b.balValue
        );
        break;

      case "az":
        data.sort(
          (a, b) =>
            a.article.localeCompare(b.article)
        );
        break;

      case "oldest":
        data.sort(
          (a, b) =>
            new Date(a.dateAcquired) -
            new Date(b.dateAcquired)
        );
        break;

      default:
        data.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
        break;
    }

    return data;

  }, [assets, search, unitFilter, sortBy]);

  const totalAssets = assets.length;

  const totalQuantity = assets.reduce(
    (sum, item) =>
      sum + Number(item.balQty || 0),
    0
  );

  const totalValue = assets.reduce(
    (sum, item) =>
      sum + Number(item.balValue || 0),
    0
  );

  const totalCategories = new Set(
    assets.map(item => item.article)
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

      {loading ? (
        <div className="text-center py-10">
          Loading assets...
        </div>
      ) : (
        <AssetTable
          assets={filteredAssets}
          onView={handleView}
        />
      )}

      <ViewAssetModal
        open={modalOpen}
        asset={selectedAsset}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}