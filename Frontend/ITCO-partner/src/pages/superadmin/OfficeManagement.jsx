import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import officeApi from "../../api/office.api";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/roles";
import OfficeFilters from "../../components/offices/OfficeFilters";
import OfficeTable from "../../components/offices/OfficeTable";
import OfficeFormModal from "../../components/offices/OfficeFormModal";

export default function OfficeManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = user?.role_id === ROLES.SUPER_ADMIN;

  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [form, setForm] = useState({ code: "", name: "", status: "active" });

  const loadOffices = async () => {
    try {
      setLoading(true);
      const res = await officeApi.getAll({ search, status: statusFilter });
      setOffices(res.data?.data || []);
    } catch {
      toast.error("Failed to load offices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) loadOffices();
  }, [isSuperAdmin, search, statusFilter]);

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const resetForm = () => setForm({ code: "", name: "", status: "active" });

  const summary = useMemo(() => ({
    total: offices.length,
    active: offices.filter((o) => o.status === "active").length,
    inactive: offices.filter((o) => o.status !== "active").length,
  }), [offices]);

  const handleCreateOffice = async () => {
    try {
      if (!form.code || !form.name) { toast.error("Please fill in office code and name."); return; }
      setCreating(true);
      await officeApi.create({ code: form.code.trim().toUpperCase(), name: form.name.trim(), status: form.status });
      toast.success("Office created successfully.");
      setOpenCreate(false);
      resetForm();
      await loadOffices();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create office.");
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (office) => {
    setSelectedOffice(office);
    setForm({ code: office.code ?? "", name: office.name ?? "", status: office.status ?? "active" });
    setOpenEdit(true);
  };

  const handleUpdateOffice = async () => {
    try {
      if (!selectedOffice || !form.code || !form.name) { toast.error("Please fill in office code and name."); return; }
      setUpdating(true);
      await officeApi.update(selectedOffice.office_id, { code: form.code.trim().toUpperCase(), name: form.name.trim(), status: form.status });
      toast.success("Office updated successfully.");
      setOpenEdit(false);
      setSelectedOffice(null);
      resetForm();
      await loadOffices();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update office.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOffice = async (office) => {
    if (!window.confirm(`Delete office "${office.code}"?`)) return;
    try {
      setDeletingId(office.office_id);
      await officeApi.remove(office.office_id);
      toast.success("Office deleted successfully.");
      await loadOffices();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete office.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4 shrink-0">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        You do not have access to this page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Office Management</h1>
        
        </div>
        <button
          type="button"
          onClick={() => setOpenCreate(true)}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#1e3a5f] px-4 text-sm font-medium text-white transition hover:bg-[#162e4d] active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Office
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Offices", value: summary.total,    color: "text-[#1e3a5f]" },
          { label: "Active",        value: summary.active,   color: "text-emerald-600" },
          { label: "Inactive",      value: summary.inactive, color: "text-slate-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
            <div className={`mt-2 text-3xl font-bold tabular-nums ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <OfficeFilters
          search={search}
          statusFilter={statusFilter}
          onSearchChange={(e) => setSearch(e.target.value)}
          onStatusChange={(e) => setStatusFilter(e.target.value)}
        />
        <div className="border-b border-slate-100 px-5 py-3">
          <div className="text-sm font-semibold text-slate-800">Office List</div>
          <div className="text-xs text-slate-400">{offices.length} office(s)</div>
        </div>
        <OfficeTable
          offices={offices}
          loading={loading}
          deletingId={deletingId}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteOffice}
          onViewDetails={(id) => navigate(`/dashboard/offices/${id}/details`)}
        />
      </div>

      <OfficeFormModal
        open={openCreate}
        mode="create"
        form={form}
        creating={creating}
        onClose={() => { setOpenCreate(false); resetForm(); }}
        onConfirm={handleCreateOffice}
        onChange={setField}
      />
      <OfficeFormModal
        open={openEdit}
        mode="edit"
        form={form}
        updating={updating}
        onClose={() => { setOpenEdit(false); setSelectedOffice(null); resetForm(); }}
        onConfirm={handleUpdateOffice}
        onChange={setField}
      />
    </div>
  );
}