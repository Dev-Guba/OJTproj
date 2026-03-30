import { useState } from "react";
import Modal from "../ui/Modal";
import toast from "react-hot-toast";
import employeeApi from "../../api/employee.api";
import OfficeSummary from "./OfficeSummary";
import OfficeAdminsSection from "./OfficeAdminsSection";
import OfficeEmployeesSection from "./OfficeEmployeesSection";
import CreateEmployeeAccountModal from "./CreateEmployeeAccountModal";

export default function OfficeDetailsModal({
  open,
  details,
  loading = false,
  onClose,
}) {
  const office = details?.office;
  const admins = details?.admins || [];
  const employees = details?.employees || [];

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create account.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        title={office ? `Office Details — ${office.code}` : "Office Details"}
        onClose={onClose}
        onConfirm={onClose}
        confirmText="Close"
      >
        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Loading office details...
          </div>
        ) : !office ? (
          <div className="py-10 text-center text-sm text-slate-500">
            No office details found.
          </div>
        ) : (
          <div className="space-y-5">
            <OfficeSummary
              office={office}
              adminsCount={admins.length}
              employeesCount={employees.length}
            />

            <OfficeAdminsSection admins={admins} />

            <OfficeEmployeesSection
              employees={employees}
              onCreateAccount={handleOpenCreate}
            />
          </div>
        )}
      </Modal>

      <CreateEmployeeAccountModal
        open={openCreate}
        selectedEmployee={selectedEmployee}
        form={form}
        creating={creating}
        onClose={() => setOpenCreate(false)}
        onConfirm={handleCreateAccount}
        onChange={setField}
      />
    </>
  );
}