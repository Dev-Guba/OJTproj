import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import officeApi from "../../api/office.api";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/roles";
import Button from "../../components/ui/Button";
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

  const [form, setForm] = useState({
    code: "",
    name: "",
    status: "active",
  });

  const loadOffices = async () => {
    try {
      setLoading(true);
      const res = await officeApi.getAll({
        search,
        status: statusFilter,
      });
      setOffices(res.data?.data || []);
    } catch {
      toast.error("Failed to load offices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadOffices();
    }
  }, [isSuperAdmin, search, statusFilter]);

  const setField = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      code: "",
      name: "",
      status: "active",
    });
  };

  const summary = useMemo(() => {
    const total = offices.length;
    const active = offices.filter((o) => o.status === "active").length;
    const inactive = offices.filter((o) => o.status !== "active").length;
    return { total, active, inactive };
  }, [offices]);

  const handleCreateOffice = async () => {
    try {
      if (!form.code || !form.name) {
        toast.error("Please fill in office code and name.");
        return;
      }

      setCreating(true);

      await officeApi.create({
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        status: form.status,
      });

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
    setForm({
      code: office.code ?? "",
      name: office.name ?? "",
      status: office.status ?? "active",
    });
    setOpenEdit(true);
  };

  const handleUpdateOffice = async () => {
    try {
      if (!selectedOffice) return;

      if (!form.code || !form.name) {
        toast.error("Please fill in office code and name.");
        return;
      }

      setUpdating(true);

      await officeApi.update(selectedOffice.office_id, {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        status: form.status,
      });

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
    const ok = window.confirm(`Delete office "${office.code}"?`);
    if (!ok) return;

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

  const handleViewDetails = (office) => {
    navigate(`/dashboard/offices/${office.office_id}`);
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Office Management</h1>
          <p className="text-sm text-slate-500">
            Create, update, and organize office records used across the system.
          </p>
        </div>

        <Button type="button" onClick={() => setOpenCreate(true)}>
          Create Office
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total Offices
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {summary.total}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Active
          </div>
          <div className="mt-2 text-3xl font-semibold text-blue-600">
            {summary.active}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Inactive
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-500">
            {summary.inactive}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <OfficeFilters
          search={search}
          statusFilter={statusFilter}
          onSearchChange={(e) => setSearch(e.target.value)}
          onStatusChange={(e) => setStatusFilter(e.target.value)}
        />

        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="font-semibold text-slate-800">Office List</h2>
            <p className="text-xs text-slate-500">
              Total: {offices.length} office(s)
            </p>
          </div>
        </div>

        <OfficeTable
          offices={offices}
          loading={loading}
          deletingId={deletingId}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteOffice}
          onViewDetails={handleViewDetails}
        />
      </div>

      <OfficeFormModal
        open={openCreate}
        mode="create"
        form={form}
        creating={creating}
        onClose={() => {
          setOpenCreate(false);
          resetForm();
        }}
        onConfirm={handleCreateOffice}
        onChange={setField}
      />

      <OfficeFormModal
        open={openEdit}
        mode="edit"
        form={form}
        updating={updating}
        onClose={() => {
          setOpenEdit(false);
          setSelectedOffice(null);
          resetForm();
        }}
        onConfirm={handleUpdateOffice}
        onChange={setField}
      />
    </div>
  );
}