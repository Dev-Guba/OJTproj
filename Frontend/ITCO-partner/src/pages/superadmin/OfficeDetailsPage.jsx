import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import officeApi from "../../api/office.api";
import employeeApi from "../../api/employee.api";
import Button from "../../components/ui/Button";
import OfficeSummary from "../../components/offices/OfficeSummary";
import OfficeAdminsSection from "../../components/offices/OfficeAdminsSection";
import OfficeEmployeesSection from "../../components/offices/OfficeEmployeesSection";
import CreateEmployeeModal from "../../components/offices/CreateEmployeeModal";
import EditEmployeeModal from "../../components/offices/EditEmployeeModal";

export default function OfficeDetailsPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const id = params?.id;
  const isMe = location.pathname.endsWith("/me");

  // existing state
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // create employee state
  const [openCreateEmployee, setOpenCreateEmployee] = useState(false);
  const [createEmployeeForm, setCreateEmployeeForm] = useState({ EmployeeNo: "", firstName: "", lastName: "", email: "", password: "" });
  const [creatingEmployee, setCreatingEmployee] = useState(false);

  // edit employee state
  const [openEditEmployee, setOpenEditEmployee] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ EmployeeNo: "", firstName: "", lastName: "", email: "", password: "" });
  const [savingEmployee, setSavingEmployee] = useState(false);

  const [deletingEmployee, setDeletingEmployee] = useState(null);


  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = isMe
        ? await officeApi.getMyDetails()
        : await officeApi.getDetails(id);
      setDetails({
        office: res.data?.data?.office,
        admins: res.data?.data?.admins || [],
        employees: res.data?.data?.employees || [],
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load office details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id, isMe]);


  // create employee handlers
  const setCreateField = (key) => (e) =>
    setCreateEmployeeForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleCreateEmployee = async () => {
    try {
      if (!createEmployeeForm.firstName || !createEmployeeForm.lastName) {
        toast.error("First name and last name are required.");
        return;
      }
      if (!createEmployeeForm.email || !createEmployeeForm.password) {
        toast.error("Email and password are required.");
        return;
      }
      setCreatingEmployee(true);
      await employeeApi.createEmployee({
        ...createEmployeeForm,
        SameDeptCode: office?.code,
      });
      toast.success("Employee created successfully.");
      setOpenCreateEmployee(false);
      setCreateEmployeeForm({ firstName: "", lastName: "", email: "", password: "" });
      await loadDetails();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create employee.");
    } finally {
      setCreatingEmployee(false);
    }
  };

  // edit employee handlers
  const setEditField = (key) => (e) =>
    setEditForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleOpenEditEmployee = (emp) => {
    setEditTarget(emp);
    setEditForm({ EmployeeNo: emp.EmployeeNo || "", firstName: emp.FirstName || "", lastName: emp.LastName || "", email: emp.account?.email || "", password: "" });
    setOpenEditEmployee(true);
  };

  const handleEditEmployee = async () => {
    try {
      if (!editForm.email) {
        toast.error("Email is required.");
        return;
      }
      setSavingEmployee(true);
      await employeeApi.updateAccount(editTarget.EmployeeNo, editForm);
      toast.success("Account updated successfully.");
      setOpenEditEmployee(false);
      setEditTarget(null);
      setEditForm({ email: "", password: "" });
      await loadDetails();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update account.");
    } finally {
      setSavingEmployee(false);
    }
  };

  const handleDeleteEmployee = async (emp) => {
  if (!window.confirm(`Delete ${emp.FirstName} ${emp.LastName}? This cannot be undone.`)) return;

  try {
    setDeletingEmployee(emp.EmployeeNo);
    await employeeApi.deleteEmployee(emp.EmployeeNo);
    toast.success("Employee deleted successfully.");
    await loadDetails();
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to delete employee.");
  } finally {
    setDeletingEmployee(null);
  }
};

  const office = details?.office;
  const admins = details?.admins || [];
  const employees = details?.employees || [];

  if (!id && !isMe) {
    return <div className="text-red-600">Invalid office ID</div>;
  }

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
              onCreateEmployee={() => setOpenCreateEmployee(true)}
              onEditEmployee={handleOpenEditEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              deletingEmployee={deletingEmployee}  
            />
          </div>
        </>
      )}

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        open={openCreateEmployee}
        form={createEmployeeForm}
        creating={creatingEmployee}
        onClose={() => {
          setOpenCreateEmployee(false);
          setCreateEmployeeForm({ email: "", password: "" });
        }}
        onConfirm={handleCreateEmployee}
        onChange={setCreateField}
      />

      <EditEmployeeModal
        open={openEditEmployee}
        selectedEmployee={editTarget}
        form={editForm}
        saving={savingEmployee}
        onClose={() => {
          setOpenEditEmployee(false);
          setEditTarget(null);
          setEditForm({ firstName: "", lastName: "", email: "", password: "" });
        }}
        onConfirm={handleEditEmployee}
        onChange={setEditField}
      />
    </div>
  );
}