import { useEffect, useMemo, useState } from "react";
import { articlesApi } from "../api/articleApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PAGE_SIZE = 8;

export default function ViewAll() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const navigate = useNavigate();

  // Load data
  const loadData = async () => {
    const data = await articlesApi.getAll();
    setItems(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter + Sort
  const filtered = useMemo(() => {
    let data = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (x) =>
          String(x.propNumber).toLowerCase().includes(q) ||
          String(x.accountableOfficer).toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";

      if (typeof av === "number" && typeof bv === "number") {
        return sort.dir === "asc" ? av - bv : bv - av;
      }

      return sort.dir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return data;
  }, [items, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const handleDelete = async () => {
    try {
      await articlesApi.remove(confirm.id);
      toast.success("Record removed.");
      setConfirm({ open: false, id: null });
      loadData();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">All Records</h2>
        </div>

        <div className="w-full md:w-80">
          <Input
            label="Search"
            placeholder="Search by Prop # or Officer"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-250 w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {[
                  ["article", "Article"],
                  ["propNumber", "Prop #"],
                  ["dateAcquired", "Date"],
                  ["accountableOfficer", "Officer"],
                  ["value", "Value"],
                  ["quantity", "Qty"],
                  ["office", "Office"],
                ].map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => changeSort(key)}
                    className="px-4 py-3 text-left font-semibold cursor-pointer select-none hover:text-gray-900"
                  >
                    {label}{" "}
                    {sort.key === key && (
                      <span>{sort.dir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{item.article}</td>
                    <td className="px-4 py-3 font-medium">{item.propNumber}</td>
                    <td className="px-4 py-3">{item.dateAcquired}</td>
                    <td className="px-4 py-3">{item.accountableOfficer}</td>
                    <td className="px-4 py-3">{item.value}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">{item.office}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            navigate(`/dashboard/add?edit=${item.id}`)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() =>
                            setConfirm({ open: true, id: item.id })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="text-xs text-gray-500">
            Page {page} of {totalPages} • {filtered.length} record(s)
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              First
            </Button>
            <Button
              variant="ghost"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              disabled={page === totalPages}
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
            >
              Next
            </Button>
            <Button
              variant="ghost"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              Last
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <Modal
        open={confirm.open}
        title="Remove this item?"
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        confirmText="Remove"
      >
        This action will permanently remove the record from storage.
      </Modal>
    </div>
  );
}