import { useEffect, useMemo, useState } from "react";
import { articlesApi } from "../api/articleApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 8;

export default function ViewAll() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const navigate = useNavigate();

  const load = async () => setItems(await articlesApi.getAll());

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const base = query
      ? items.filter((x) =>
          String(x.propNumber).toLowerCase().includes(query) ||
          String(x.accountableOfficer).toLowerCase().includes(query)
        )
      : items;

    const sorted = [...base].sort((a, b) => {
      const av = a?.[sort.key];
      const bv = b?.[sort.key];

      if (typeof av === "number" && typeof bv === "number") return sort.dir === "asc" ? av - bv : bv - av;
      return sort.dir === "asc"
        ? String(av ?? "").localeCompare(String(bv ?? ""))
        : String(bv ?? "").localeCompare(String(av ?? ""));
    });

    return sorted;
  }, [items, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const toggleSort = (key) => {
    setSort((s) => {
      if (s.key === key) return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      return { key, dir: "asc" };
    });
  };

  const onDelete = async (id) => {
    try {
      await articlesApi.remove(id);
      toast.success("Removed.");
      setConfirm({ open: false, id: null });
      load();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold">All Records</h2>
          <p className="text-sm text-gray-600">Sortable, paginated, stored in your browser.</p>
        </div>
        <div className="w-full md:w-96">
          <Input
            label="Search (Prop # or Officer)"
            placeholder="e.g. PN-1001 or Juan Dela Cruz"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-225 w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr className="border-b">
                {[
                  ["article", "Article"],
                  ["propNumber", "Prop #"],
                  ["dateAcquired", "Date Acquired"],
                  ["accountableOfficer", "Officer"],
                  ["value", "Value"],
                  ["quantity", "Qty"],
                  ["office", "Office"],
                ].map(([key, label]) => (
                  <th
                    key={key}
                    className="px-4 py-3 font-semibold cursor-pointer select-none"
                    onClick={() => toggleSort(key)}
                    title="Click to sort"
                  >
                    {label} {sort.key === key ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-600" colSpan={8}>
                    No records found.
                  </td>
                </tr>
              ) : (
                paged.map((x) => (
                  <tr key={x.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{x.article}</td>
                    <td className="px-4 py-3 font-medium">{x.propNumber}</td>
                    <td className="px-4 py-3">{x.dateAcquired}</td>
                    <td className="px-4 py-3">{x.accountableOfficer}</td>
                    <td className="px-4 py-3">{x.value}</td>
                    <td className="px-4 py-3">{x.quantity}</td>
                    <td className="px-4 py-3">{x.office}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/dashboard/add?edit=${x.id}`)}
                          title="Edit"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => setConfirm({ open: true, id: x.id })}
                          title="Delete"
                        >
                          🗑️
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
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="text-xs text-gray-600">
            Page <b>{page}</b> of <b>{totalPages}</b> • {filtered.length} record(s)
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setPage(1)} disabled={page === 1}>First</Button>
            <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Prev
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
            <Button variant="ghost" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              Last
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={confirm.open}
        title="Remove this item?"
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={() => onDelete(confirm.id)}
        confirmText="Remove"
      >
        This will delete the record from the table and browser storage immediately.
      </Modal>
    </div>
  );
}