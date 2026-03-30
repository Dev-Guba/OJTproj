import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { recordsApi } from "../api/records.api";
import employeeApi from "../api/employee.api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../utils/roles";
import RecordForm from "../components/records/RecordForm";

const empty = {
  article: "",
  description: "",
  propNumber: "",
  dateAcquired: "",
  unit: "",
  unitValue: "",
  balQty: "",
  balValue: "",
  accountableOfficer: "",
  areMeNo: "",
  office: "",
};

export default function AddArticle() {
  const { user } = useAuth();
  const isAdmin = user?.role_id === ROLES.ADMIN;

  const [form, setForm] = useState(empty);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const res = await employeeApi.getAll({ limit: 200 });
      const list = res.data?.employees || res.employees || [];
      setEmployees(list);
    } catch {
      toast.error("Failed to load employees.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const loadRecordForEdit = async () => {
    if (!editId) return;

    try {
      const res = await recordsApi.getAll({ page: 1, limit: 500 });
      const rows = res.rows || [];
      const item = rows.find((x) => String(x.id) === String(editId));

      if (!item) {
        toast.error("Record not found.");
        navigate("/dashboard/view");
        return;
      }

      setForm({
        article: item.article ?? "",
        description: item.description ?? "",
        propNumber: item.propNumber ?? "",
        dateAcquired: item.dateAcquired ?? "",
        unit: item.unit ?? "",
        unitValue: item.unitValue == null ? "" : String(item.unitValue),
        balQty: item.balQty == null ? "" : String(item.balQty),
        balValue: item.balValue == null ? "" : String(item.balValue),
        accountableOfficer: item.accountableOfficer ?? "",
        areMeNo: item.areMeNo ?? "",
        office: item.office ?? "",
      });

      const matchedEmployee = employees.find(
        (emp) =>
          `${emp.FirstName ?? ""} ${emp.LastName ?? ""}`.trim() ===
          (item.accountableOfficer ?? "").trim()
      );

      if (matchedEmployee) {
        setSelectedEmployeeId(String(matchedEmployee.EmployeeId));
      }
    } catch {
      toast.error("Failed to load record.");
      navigate("/dashboard/view");
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (!editId && isAdmin && user?.SameDeptCode) {
      setForm((prev) => ({
        ...prev,
        office: user.SameDeptCode,
      }));
    }
  }, [editId, isAdmin, user?.SameDeptCode]);

  useEffect(() => {
    if (employees.length > 0) {
      loadRecordForEdit();
    }
  }, [editId, employees]);

  const employeeOptions = useMemo(() => {
    return employees.map((emp) => ({
      value: String(emp.EmployeeId),
      label: `${[emp.FirstName, emp.LastName].filter(Boolean).join(" ")} — ${emp.EmployeeNo} — ${emp.SameDeptCode}`,
      raw: emp,
    }));
  }, [employees]);

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);

    const emp = employees.find(
      (item) => String(item.EmployeeId) === String(employeeId)
    );

    if (!emp) return;

    setForm((prev) => ({
      ...prev,
      accountableOfficer: `${emp.FirstName ?? ""} ${emp.LastName ?? ""}`.trim(),
      office: emp.SameDeptCode ?? prev.office,
    }));
  };

  const validate = () => {
    if (!(form.article || "").trim()) return "Article is required.";
    if (!(form.propNumber || "").trim()) return "Prop number is required.";
    if (!form.dateAcquired) return "Date acquired is required.";
    if (!(form.accountableOfficer || "").trim()) {
      return "Please select an employee.";
    }

    if (form.unitValue !== "" && Number.isNaN(Number(form.unitValue))) {
      return "Unit value must be a number.";
    }

    if (form.balQty !== "" && Number.isNaN(Number(form.balQty))) {
      return "Balance qty must be a number.";
    }

    if (form.balValue !== "" && Number.isNaN(Number(form.balValue))) {
      return "Balance value must be a number.";
    }

    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setLoading(true);

    const payload = {
      article: (form.article || "").trim(),
      description: (form.description || "").trim(),
      propNumber: (form.propNumber || "").trim(),
      dateAcquired: form.dateAcquired,
      unit: (form.unit || "").trim(),
      unitValue: form.unitValue === "" ? null : Number(form.unitValue),
      balQty: form.balQty === "" ? null : Number(form.balQty),
      balValue: form.balValue === "" ? null : Number(form.balValue),
      accountableOfficer: (form.accountableOfficer || "").trim(),
      areMeNo: (form.areMeNo || "").trim(),
      office: (form.office || "").trim(),
    };

    try {
      if (editId) {
        await recordsApi.update(editId, payload);
        toast.success("Updated successfully.");
      } else {
        await recordsApi.create(payload);
        toast.success("Submitted successfully.");
        setForm({
          ...empty,
          office: isAdmin ? user?.SameDeptCode || "" : "",
        });
        setSelectedEmployeeId("");
      }

      navigate("/dashboard/view");
    } catch (ex) {
      toast.error(ex?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <RecordForm
        form={form}
        employeeOptions={employeeOptions}
        selectedEmployeeId={selectedEmployeeId}
        loading={loading}
        loadingEmployees={loadingEmployees}
        editMode={!!editId}
        onFieldChange={set}
        onEmployeeChange={handleEmployeeChange}
        onSubmit={onSubmit}
        onCancel={() => navigate("/dashboard/view")}
      />
    </div>
  );
}