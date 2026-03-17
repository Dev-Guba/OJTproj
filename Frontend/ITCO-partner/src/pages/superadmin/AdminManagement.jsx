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

  const [form, setForm] = useState({
    email: "",
    password: "",
    SameDeptCode: "",
  });

  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const res = await Api.getAdmins({
        search,
        office: officeFilter,
      });
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

  const setField = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      SameDeptCode: "",
    });
  };

  const officeOptions = useMemo(() => {
    const fromApi = offices
      .map((office) => String(office.code ?? "").trim())
      .filter(Boolean);

    const fromAdmins = admins
      .map((admin) => String(admin.SameDeptCode ?? "").trim())
      .filter(Boolean);

    const merged = Array.from(new Set([...fromApi, ...fromAdmins])).sort((a, b) =>
      a.localeCompare(b)
    );

    return ["All", ...merged];
  }, [offices, admins]);

  const handleCreateAdmin = async () => {
    try {
      if (!form.email || !form.password || !form.SameDeptCode) {
        toast.error("Please fill in all fields.");
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
      email: admin.email ?? "",
      password: "",
      SameDeptCode: admin.SameDeptCode ?? admin.Employee?.SameDeptCode ?? "",
    });
    setOpenEdit(true);
  };

  const handleUpdateAdmin = async () => {
    try {
      if (!selectedAdmin) return;

      if (!form.email || !form.SameDeptCode) {
        toast.error("Please fill in email and office.");
        return;
      }

      setUpdating(true);

      await Api.updateAdmin(selectedAdmin.user_id, {
        email: form.email.trim(),
        SameDeptCode: form.SameDeptCode.trim(),
      });

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
    const ok = window.confirm(`Delete admin "${admin.email}"?`);
    if (!ok) return;

    try {
      setDeletingId(admin.user_id);
      await Api.deleteAdmin(admin.user_id);
      toast.success("Admin deleted successfully.");
      await loadAdmins();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete admin.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdmins();
      loadOffices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin, search, officeFilter]);

  if (!isSuperAdmin) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        You do not have access to this page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Management</h1>
          <p className="text-sm text-slate-500">
            Create, update, and manage office admin accounts.
          </p>
        </div>

        <Button type="button" onClick={() => setOpenCreate(true)}>
          Create Admin
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <AdminFilters
          search={search}
          officeFilter={officeFilter}
          officeOptions={officeOptions}
          onSearchChange={(e) => setSearch(e.target.value)}
          onOfficeChange={(e) => setOfficeFilter(e.target.value)}
        />

        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="font-semibold text-slate-800">Admin Accounts</h2>
            <p className="text-xs text-slate-500">
              Total: {admins.length} account(s)
            </p>
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
        officeOptions={officeOptions}
        loadingOffices={loadingOffices}
        creating={creating}
        onClose={() => {
          setOpenCreate(false);
          resetForm();
        }}
        onConfirm={handleCreateAdmin}
        onChange={setField}
      />

      <AdminFormModal
        open={openEdit}
        mode="edit"
        form={form}
        officeOptions={officeOptions}
        loadingOffices={loadingOffices}
        updating={updating}
        onClose={() => {
          setOpenEdit(false);
          setSelectedAdmin(null);
          resetForm();
        }}
        onConfirm={handleUpdateAdmin}
        onChange={setField}
      />
    </div>
  );
}