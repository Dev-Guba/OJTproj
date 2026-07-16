import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { recordsApi } from "../api/records.api";
import employeeApi from "../api/employee.api";
import articleAPI from "../api/article.api.js"; // adjust path if needed
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
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);

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

  const loadArticles = async () => {
  try {
    setLoadingArticles(true);
    const res = await articleAPI.fetchArticle();
    const list = res.data?.data || [];
    setArticles(list);
  } catch {
    toast.error("Failed to load articles.");
  } finally {
    setLoadingArticles(false);
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
        unitValue: item.unitValue == null ? "" : Number(item.unitValue).toFixed(2),
        balQty: item.balQty == null ? "" : Number(item.balQty).toFixed(2),
        balValue: item.balValue == null ? "" : Number(item.balValue).toFixed(2),
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

      const matchedArticle = articles.find(
        (a) =>
          (a.article ?? "").trim().toLowerCase() ===
          (item.article ?? "").trim().toLowerCase()
      );

      if (matchedArticle) {
        setSelectedArticle(String(matchedArticle.ArticleId));
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
    loadArticles();
  }, []);

  useEffect(() => {
  console.log("selectedArticle:", selectedArticle);
}, [selectedArticle]);

  useEffect(() => {
    if (!editId && isAdmin && user?.SameDeptCode) {
      setForm((prev) => ({
        ...prev,
        office: user.SameDeptCode,
      }));
    }
  }, [editId, isAdmin, user?.SameDeptCode]);

  useEffect(() => {
    if (employees.length > 0 && articles.length > 0) {
      loadRecordForEdit();
    }
  }, [editId, employees, articles]);

  const employeeOptions = useMemo(() => {
    return employees.map((emp) => ({
      value: String(emp.EmployeeId),
      label: `${[emp.FirstName, emp.LastName].filter(Boolean).join(" ")} — ${emp.EmployeeNo} — ${emp.SameDeptCode}`,
      raw: emp,
    }));
  }, [employees]);

  const articleOptions = useMemo(() => {
    return articles.map((item) => ({
      value: String(item.ArticleId),
      label: item.unit ? `${item.article} — ${item.unit}` : item.article,
      raw: item,
    }));
  }, [articles]);

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

  const handleArticleChange = (e) => {
    const articleId = e.target.value;

  setSelectedArticle(articleId);   // <-- ADD THIS
  console.log("Selected Article ID:", articleId);   // <-- ADD THIS

  const match = articles.find(
    (item) => String(item.ArticleId) === String(articleId)
  );

  if (!match) return;
  console.log(selectedArticle);
  console.log(selectedEmployeeId);

  setForm((prev) => ({
    ...prev,
    article: match.article ?? "",
    description: match.description ?? "",
    propNumber: match.propNumber ?? "",
    dateAcquired: match.dateAcquired ?? "",
    unit: match.unit ?? "",
    unitValue: match.unitValue == null ? "" : String(match.unitValue),
    balQty: match.balQty == null ? "" : String(match.balQty),
    balValue: match.balValue == null ? "" : String(match.balValue),
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
    console.log("Submitting form:", e);
  e.preventDefault();

  const err = validate();
  if (err) {
    toast.error(err);
    return;
  }

  setLoading(true);

  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const payload = {
  employee_id: selectedEmployeeId ? Number(selectedEmployeeId) : null,
  article_id: selectedArticle ? Number(selectedArticle) : null,
  areMeNo: (form.areMeNo || "").trim(),
  status: "ISSUED",
  issuedDate: today,
};

  console.log("payload being sent:", payload);

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
      setSelectedArticle("");
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
        articleOptions={articleOptions}
        selectedArticleId={selectedArticle}
        loading={loading}
        loadingEmployees={loadingEmployees}
        loadingArticles={loadingArticles}
        editMode={!!editId}
        onFieldChange={set}
        onEmployeeChange={handleEmployeeChange}
        onArticleChange={handleArticleChange}
        onSubmit={onSubmit}
        onCancel={() => navigate("/dashboard/view")}
      />
    </div>
  );
}