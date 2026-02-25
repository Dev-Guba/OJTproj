import { useEffect, useState } from "react";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/TextArea";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import { recordsApi } from "../api/records.api";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  office: "Admin Office",

  // legacy (optional)
  value: "",
  quantity: "",
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

      try {
        const all = await recordsApi.getAll();
        const item = all.find((x) => String(x.id) === String(editId));

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
          office: item.office ?? "Admin Office",

          value: item.value == null ? "" : String(item.value),
          quantity: item.quantity == null ? "" : String(item.quantity),
        });
      } catch {
        toast.error("Failed to load record.");
        navigate("/dashboard/view");
      }
    };

    load();
  }, [editId, navigate]);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    if (!(form.article || "").trim()) return "Article is required.";
    if (!(form.propNumber || "").trim()) return "Prop number is required.";
    if (!form.dateAcquired) return "Date acquired is required.";
    if (!(form.accountableOfficer || "").trim())
      return "Accountable officer is required.";

    if (form.unitValue !== "" && Number.isNaN(Number(form.unitValue)))
      return "Unit value must be a number.";
    if (form.balQty !== "" && Number.isNaN(Number(form.balQty)))
      return "Balance qty must be a number.";
    if (form.balValue !== "" && Number.isNaN(Number(form.balValue)))
      return "Balance value must be a number.";

    if (form.value !== "" && Number.isNaN(Number(form.value)))
      return "Value must be a number.";
    if (form.quantity !== "" && Number.isNaN(Number(form.quantity)))
      return "Quantity must be a number.";

    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return toast.error(err);

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
      office: form.office || "Admin Office",

      value: form.value === "" ? null : Number(form.value),
      quantity: form.quantity === "" ? null : Number(form.quantity),
    };

    try {
      if (editId) {
        await recordsApi.update(editId, payload);
        toast.success("Updated successfully!");
      } else {
        await recordsApi.create(payload);
        toast.success("Submitted successfully!");
        setForm(empty);
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
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Article" value={form.article ?? ""} onChange={set("article")} />
          <Input label="Prop No." value={form.propNumber ?? ""} onChange={set("propNumber")} />

          <Input
            label="Date Acquired"
            type="date"
            value={form.dateAcquired ?? ""}
            onChange={set("dateAcquired")}
          />
          <Input
            label="Accountable Officer"
            value={form.accountableOfficer ?? ""}
            onChange={set("accountableOfficer")}
          />

          <Input label="Unit" value={form.unit ?? ""} onChange={set("unit")} />
          <Input
            label="Unit Value"
            type="number"
            value={form.unitValue ?? ""}
            onChange={set("unitValue")}
          />

          <Input
            label="Bal. Qty (per Stockcard)"
            type="number"
            value={form.balQty ?? ""}
            onChange={set("balQty")}
          />
          <Input
            label="Bal. Value (per Stockcard)"
            type="number"
            value={form.balValue ?? ""}
            onChange={set("balValue")}
          />

          <Input label="ARE No. / ME No." value={form.areMeNo ?? ""} onChange={set("areMeNo")} />

          <Select
            label="Office"
            value={form.office ?? "Admin Office"}
            onChange={set("office")}
          >
            <option>Admin Office</option>
            <option>ICTO</option>
            <option>HR Office</option>
            <option>Finance Office</option>
            <option>Operations Office</option>
            <option>Other</option>
          </Select>

          <div className="md:col-span-2">
            <Textarea
              label="Description"
              rows={3}
              value={form.description ?? ""}
              onChange={set("description")}
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button type="submit" disabled={loading}>
            {editId ? "Update" : "Submit"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/dashboard/view")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}