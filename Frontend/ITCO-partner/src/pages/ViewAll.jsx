import { useEffect, useState } from "react";
import { recordsApi } from "../api/records.api";
import RecordsTable from "./records/RecordsTable";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../utils/roles";
import RecordsToolbar from "../components/records/RecordsToolbar";
import RecordsScopeAlert from "../components/records/RecordsScopeAlert";
import RecordsPagination from "../components/records/RecordsPagination";
import ReportOptionsModal from "../components/records/ReportOptionsModal";
import DeleteRecordModal from "../components/records/DeleteRecordModal";

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
  const [sort, setSort] = useState({ key: "office", dir: "asc" });
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [reportOpen, setReportOpen] = useState(false);
  const [reportPaper, setReportPaper] = useState("auto");
  const [reportPerPage, setReportPerPage] = useState(20);
  const [reportIncludeHeader, setReportIncludeHeader] = useState(true);
  const [reportIncludePageNumbers, setReportIncludePageNumbers] = useState(true);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await recordsApi.getAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        sortKey: sort.key,
        sortDir: sort.dir,
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
    } catch {
      toast.error("Failed to generate report.", { id: t });
    }
  };

  const confirmGenerateReport = async () => {
    setReportOpen(false);
    await onGenerateReport();
  };

  return (
    <div className="space-y-6">
      <RecordsToolbar
        search={search}
        onSearchChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        onOpenReport={() => setReportOpen(true)}
      />

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <RecordsScopeAlert
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        isEmployee={isEmployee}
        user={user}
      />

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

        <RecordsPagination
          page={page}
          totalPages={totalPages}
          total={total}
          onFirst={() => setPage(1)}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          onLast={() => setPage(totalPages)}
        />
      </div>

      <ReportOptionsModal
        open={reportOpen}
        reportPaper={reportPaper}
        reportPerPage={reportPerPage}
        reportIncludeHeader={reportIncludeHeader}
        reportIncludePageNumbers={reportIncludePageNumbers}
        onClose={() => setReportOpen(false)}
        onConfirm={confirmGenerateReport}
        setReportPaper={setReportPaper}
        setReportPerPage={setReportPerPage}
        setReportIncludeHeader={setReportIncludeHeader}
        setReportIncludePageNumbers={setReportIncludePageNumbers}
      />

      <DeleteRecordModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
      />
    </div>
  );
}