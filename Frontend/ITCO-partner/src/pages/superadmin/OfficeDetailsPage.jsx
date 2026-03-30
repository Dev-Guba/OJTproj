import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import officeApi from "../../api/office.api";
import employeeApi from "../../api/employee.api";
import Button from "../../components/ui/Button";
import OfficeSummary from "../../components/offices/OfficeSummary";
import OfficeAdminsSection from "../../components/offices/OfficeAdminsSection";
import OfficeEmployeesSection from "../../components/offices/OfficeEmployeesSection";
import CreateEmployeeAccountModal from "../../components/offices/CreateEmployeeAccountModal";

export default function OfficeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await officeApi.getDetails(id);
      setDetails(res.data?.data || null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load office details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  const setField = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleOpenCreate = (emp) => {
    setSelectedEmployee(emp);
    setForm({
      email: emp.Email || "",
      password: "",
    });
    setOpenCreate(true);
  };

  const handleCreateAccount = async () => {
    try {
      if (!form.email || !form.password) {
        toast.error("Email and password required.");
        return;
      }

      setCreating(true);

      await employeeApi.createAccount({
        EmployeeNo: selectedEmployee.EmployeeNo,
        email: form.email,
        password: form.password,
      });

      toast.success("Employee account created.");
      setOpenCreate(false);
      setSelectedEmployee(null);
      setForm({ email: "", password: "" });
      await loadDetails();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create account.");
    } finally {
      setCreating(false);
    }
  };

  const office = details?.office;
  const admins = details?.admins || [];
  const employees = details?.employees || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/offices")}
            className="mb-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Office Management
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            {office ? `${office.name}` : "Office Details"}
          </h1>
          <p className="text-sm text-slate-500">
            View assigned admins, employees, and account coverage for this office.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={loadDetails}>
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
          Loading office details...
        </div>
      ) : !office ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
          No office details found.
        </div>
      ) : (
        <>
          <OfficeSummary
            office={office}
            adminsCount={admins.length}
            employeesCount={employees.length}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <OfficeAdminsSection admins={admins} />
            <OfficeEmployeesSection
              employees={employees}
              onCreateAccount={handleOpenCreate}
            />
          </div>
        </>
      )}

      <CreateEmployeeAccountModal
        open={openCreate}
        selectedEmployee={selectedEmployee}
        form={form}
        creating={creating}
        onClose={() => {
          setOpenCreate(false);
          setSelectedEmployee(null);
          setForm({ email: "", password: "" });
        }}
        onConfirm={handleCreateAccount}
        onChange={setField}
      />
    </div>
  );
}