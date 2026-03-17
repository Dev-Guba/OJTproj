import { useEffect, useState } from "react";
import { recordsApi } from "../api/records.api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import RecordsTable from "./records/RecordsTable";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../utils/roles";

const PAGE_SIZE = 8;

export default function ViewAll() {
const { user } = useAuth();
const isSuperAdmin = user?.role_id === ROLES.SUPER_ADMIN;
const isAdmin = user?.role_id === ROLES.ADMIN;
const isEmployee = user?.role_id === ROLES.EMPLOYEE;

const canManageRecords = isSuperAdmin || isAdmin;

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // ✅ Report modal state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportPaper, setReportPaper] = useState("auto"); // auto | a4 | letter
  const [reportPerPage, setReportPerPage] = useState(20);
  const [reportIncludeHeader, setReportIncludeHeader] = useState(true);
  const [reportIncludePageNumbers, setReportIncludePageNumbers] = useState(true);

  const navigate = useNavigate();

  // Load data
  const loadData = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await recordsApi.getAll({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch,
      sortKey: sort.key,
      sortDir: sort.dir
    });

    setItems(res.rows || []);
    setTotal(res.total || 0);

  } catch {
    setError("Failed to load records.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 400);

  return () => clearTimeout(timer);
}, [search]);

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, sort]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  
  const changeSort = (key) => {
  setPage(1);
  setSort((prev) =>
    prev.key === key
      ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
      : { key, dir: "asc" }
  );
};

  const handleDelete = async () => {
  try {
    await recordsApi.remove(confirm.id);
    toast.success("Record removed.");
    setConfirm({ open: false, id: null });

    const isLastItemOnPage = items.length === 1 && page > 1;

    if (isLastItemOnPage) {
      setPage((p) => p - 1);
    } else {
      loadData();
    }
  } catch {
    toast.error("Delete failed.");
  }
};


  // ✅ Existing download logic (Step 2 will pass report options into backend)
  const onGenerateReport = async () => {
    const t = toast.loading("Generating PDF report...");
    try {
      const res = await recordsApi.generateReport({
  search: debouncedSearch,
  paperSize: reportPaper,
  perPage: reportPerPage,
  includeHeader: reportIncludeHeader,
  includePageNumbers: reportIncludePageNumbers,
});

      const blob = new Blob([res.data], { type: "application/pdf" });

      const cd = res.headers?.["content-disposition"] || "";
      const match = cd.match(/filename="(.+?)"/);
      const filename = match?.[1] || "ICTO-Records-Report.pdf";

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded.", { id: t });
    } catch (e) {
      toast.error("Failed to generate report.", { id: t });
    }
  };

  const confirmGenerateReport = async () => {
    setReportOpen(false);
    await onGenerateReport();
  };

  return (
    <div className="space-y-6">
      {/* Controls Row: left = search+filter, right = report button */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-end">
          <div className="w-full md:w-96">
            <Input
              label="Search"
              placeholder="Search by Article, Prop No., Officer, Office..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          
        </div>

        <div className="md:ml-auto">
          <Button type="button" onClick={() => setReportOpen(true)}>
            Generate Report
          </Button>
        </div>
      </div>

      {error && (
  <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {error}
  </div>
)}


{/* Office Admin label */}
{!isSuperAdmin && user?.SameDeptCode && (
  <div className="rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
    Viewing records for: <span className="font-semibold">{user.SameDeptCode}</span>
  </div>
)}

{/* Super Admin label */}
{isSuperAdmin && (
  <div className="rounded border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700">
    Viewing records for: <span className="font-semibold">All Offices (Super Admin)</span>
  </div>
)}

{/* Table Card */}
<div className="border bg-white shadow-sm overflow-hidden"></div>
      {/* Table Card */}
      <div className="border bg-white shadow-sm overflow-hidden">
        <RecordsTable
          rows={items}
          sort={sort}
          loading={loading}
          canManageRecords={canManageRecords}
          onSort={changeSort}
          onEdit={(id) => navigate(`/dashboard/add?edit=${id}`)}
          onDelete={(id) => setConfirm({ open: true, id })}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="text-xs text-gray-500">
            Page {page} of {totalPages} • {total} record(s)
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" disabled={page === 1} onClick={() => setPage(1)}>
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      {/* ✅ Report Options Modal */}
      <Modal
        open={reportOpen}
        title="Generate Report"
        onClose={() => setReportOpen(false)}
        onConfirm={confirmGenerateReport}
        confirmText="Generate"
      >
        <div className="space-y-5">
          <div>
            <div className="text-sm font-semibold text-gray-900">Paper Size:</div>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paper"
                  checked={reportPaper === "auto"}
                  onChange={() => setReportPaper("auto")}
                />
                <span>Auto</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paper"
                  checked={reportPaper === "a4"}
                  onChange={() => setReportPaper("a4")}
                />
                <span>A4</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paper"
                  checked={reportPaper === "letter"}
                  onChange={() => setReportPaper("letter")}
                />
                <span>Letter</span>
              </label>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Records Per Page:</div>
            <div className="mt-2">
              <select
                className="w-32 rounded-xl border px-3 py-2 text-sm"
                value={reportPerPage}
                onChange={(e) => setReportPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Include:</div>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reportIncludeHeader}
                  onChange={(e) => setReportIncludeHeader(e.target.checked)}
                />
                <span>Header</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reportIncludePageNumbers}
                  onChange={(e) => setReportIncludePageNumbers(e.target.checked)}
                />
                <span>Page Numbers</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
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