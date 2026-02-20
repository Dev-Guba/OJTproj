import { useEffect, useState } from "react";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/TextArea";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import { articlesApi } from "../api/articleApi";
import { useNavigate, useSearchParams } from "react-router-dom";

const empty = {
  article: "",
  propNumber: "",
  dateAcquired: "",
  accountableOfficer: "",
  value: "",
  quantity: "",
  description: "",
  office: "Admin Office",
};

export default function AddArticle() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!editId) return;
      const all = await articlesApi.getAll();
      const item = all.find((x) => x.id === editId);
      if (!item) {
        toast.error("Record not found.");
        navigate("/dashboard/view");
        return;
      }
      setForm({
        article: item.article || "",
        propNumber: item.propNumber || "",
        dateAcquired: item.dateAcquired || "",
        accountableOfficer: item.accountableOfficer || "",
        value: String(item.value ?? ""),
        quantity: String(item.quantity ?? ""),
        description: item.description || "",
        office: item.office || "Admin Office",
      });
    };
    load();
  }, [editId, navigate]);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    if (!form.article.trim()) return "Article is required.";
    if (!form.propNumber.trim()) return "Prop number is required.";
    if (!form.dateAcquired) return "Date acquired is required.";
    if (!form.accountableOfficer.trim()) return "Accountable officer is required.";
    if (form.value === "" || Number.isNaN(Number(form.value))) return "Value must be a number.";
    if (form.quantity === "" || Number.isNaN(Number(form.quantity))) return "Quantity must be a number.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    const payload = {
      article: form.article.trim(),
      propNumber: form.propNumber.trim(),
      dateAcquired: form.dateAcquired,
      accountableOfficer: form.accountableOfficer.trim(),
      value: Number(form.value),
      quantity: Number(form.quantity),
      description: form.description.trim(),
      office: form.office,
    };

    try {
      if (editId) {
        await articlesApi.update(editId, payload);
        toast.success("Updated successfully!");
      } else {
        await articlesApi.create(payload);
        toast.success("Submitted successfully!");
        setForm(empty);
      }
      navigate("/dashboard/view");
    } catch (ex) {
      toast.error(ex?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-4">
        <h2 className="text-lg font-bold">{editId ? "Edit Record" : "Add Article"}</h2>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Article" value={form.article} onChange={set("article")} />
          <Input label="Prop Number" value={form.propNumber} onChange={set("propNumber")} />

          <Input label="Date Acquired" type="date" value={form.dateAcquired} onChange={set("dateAcquired")} />
          <Input label="Accountable Officer" value={form.accountableOfficer} onChange={set("accountableOfficer")} />

          <Input label="Value" type="number" value={form.value} onChange={set("value")} />
          <Input label="Quantity" type="number" value={form.quantity} onChange={set("quantity")} />

          <div className="md:col-span-2">
            <Textarea label="Description" rows={3} value={form.description} onChange={set("description")} />
          </div>

          <Select label="Office" value={form.office} onChange={set("office")}>
            <option>Admin Office</option>
            <option>ICTO</option>
            <option>HR Office</option>
            <option>Finance Office</option>
            <option>Operations Office</option>
            <option>Other</option>
          </Select>
        </div>

        <div className="mt-5 flex gap-2">
          <Button type="submit" disabled={loading}>{editId ? "Update" : "Submit"}</Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/dashboard/view")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}