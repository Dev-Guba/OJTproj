import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Api from "../../api/auth.api";
import officeApi from "../../api/office.api";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/roles";
import Button from "../../components/ui/Button";
import AdminTable from "../../components/admins/AdminTable";
import AdminFilters from "../../components/admins/AdminFilters";
import AdminFormModal from "../../components/admins/AdminFormModal";

export default function AdminManagement() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role_id === ROLES.SUPER_ADMIN;

  const [admins, setAdmins] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOffices, setLoadingOffices] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [officeFilter, setOfficeFilter] = useState("All");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [form, setForm] = useState({ email: "", password: "", SameDeptCode: "" });

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const res = await Api.getAdmins({ search, office: officeFilter });
      setAdmins(res.data?.data || []);
    } catch {
      toast.error("Failed to load admins.");
    } finally {
      setLoading(false);
    }
  };

  const loadOffices = async () => {
    try {
      setLoadingOffices(true);
      const res = await officeApi.getAll({ status: "active" });
      setOffices(res.data?.data || []);
    } catch {
      toast.error("Failed to load offices.");
    } finally {
      setLoadingOffices(false);
    }
  };

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const resetForm = () => setForm({ email: "", password: "", SameDeptCode: "" });

  const officeList = useMemo(() => {
    const fromApi = offices.map((o) => String(o.code ?? "").trim()).filter(Boolean);
    const fromAdmins = admins.map((a) => String(a.SameDeptCode ?? "").trim()).filter(Boolean);
    return Array.from(new Set([...fromApi, ...fromAdmins])).sort((a, b) => a.localeCompare(b));
  }, [offices, admins]);

  const officeOptions = useMemo(() => ["All", ...officeList], [officeList]);

  const handleCreateAdmin = async () => {
  try {
    if (!form.email || !form.password || !form.SameDeptCode) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setCreating(true);
    await Api.createAdmin({
      email: form.email.trim(),
      password: form.password,
      SameDeptCode: form.SameDeptCode.trim(),
    });
    toast.success("Admin created successfully.");
    setOpenCreate(false);
    resetForm();
    await loadAdmins();
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to create admin.");
  } finally {
    setCreating(false);
  }
};

  const handleOpenEdit = (admin) => {
  setSelectedAdmin(admin);
  setForm({
    email: admin.Email ?? "",
    password: "",
    SameDeptCode: admin.SameDeptCode ?? "",
  });
  setOpenEdit(true);
};

  const handleUpdateAdmin = async () => {
    try {
      if (!selectedAdmin || !form.email || !form.SameDeptCode) {
        toast.error("Please fill in email and office.");
        return;
      }
      setUpdating(true);
      const payload = { email: form.email.trim(), SameDeptCode: form.SameDeptCode.trim() };
      if (form.password?.trim()) payload.password = form.password.trim();
      await Api.updateAdmin(selectedAdmin.EmployeeId, payload);
      toast.success("Admin updated successfully.");
      setOpenEdit(false);
      setSelectedAdmin(null);
      resetForm();
      await loadAdmins();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update admin.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAdmin = async (admin) => {
  if (!window.confirm(`Delete admin "${admin.Email}"?`)) return;
  try {
    setDeletingId(admin.EmployeeId);
    await Api.deleteAdmin(admin.EmployeeId);
    toast.success("Admin deleted successfully.");
    await loadAdmins();
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to delete admin.");
  } finally {
    setDeletingId(null);
  }
};

  useEffect(() => {
    if (isSuperAdmin) { loadAdmins(); loadOffices(); }
  }, [isSuperAdmin, search, officeFilter]);

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
          <h1 className="text-2xl font-bold text-slate-900">Admin Management</h1>
          
        </div>
        <button
          type="button"
          onClick={() => setOpenCreate(true)}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#1e3a5f] px-4 text-sm font-medium text-white transition hover:bg-[#162e4d] active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Admin
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Admins", value: admins.length, color: "text-[#1e3a5f]" },
          { label: "Super Admins", value: admins.filter(a => a.role_id === ROLES.SUPER_ADMIN).length, color: "text-violet-600" },
          { label: "Office Admins", value: admins.filter(a => a.role_id === ROLES.ADMIN).length, color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
            <div className={`mt-2 text-3xl font-bold tabular-nums ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <AdminFilters
          search={search}
          officeFilter={officeFilter}
          officeOptions={officeOptions}
          onSearchChange={(e) => setSearch(e.target.value)}
          onOfficeChange={(e) => setOfficeFilter(e.target.value)}
        />
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div>
            <div className="text-sm font-semibold text-slate-800">Admin Accounts</div>
            <div className="text-xs text-slate-400">{admins.length} account(s)</div>
          </div>
        </div>
        <AdminTable
          admins={admins}
          loading={loading}
          deletingId={deletingId}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteAdmin}
        />
      </div>

      <AdminFormModal
        open={openCreate}
        mode="create"
        form={form}
        officeOptions={officeList}
        loadingOffices={loadingOffices}
        creating={creating}
        onClose={() => { setOpenCreate(false); resetForm(); }}
        onConfirm={handleCreateAdmin}
        onChange={setField}
      />
      <AdminFormModal
        open={openEdit}
        mode="edit"
        form={form}
        officeOptions={officeList}
        loadingOffices={loadingOffices}
        updating={updating}
        onClose={() => { setOpenEdit(false); setSelectedAdmin(null); resetForm(); }}
        onConfirm={handleUpdateAdmin}
        onChange={setField}
      />
    </div>
  );
}