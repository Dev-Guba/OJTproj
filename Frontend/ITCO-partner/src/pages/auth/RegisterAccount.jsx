import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/Official_seal.png";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import bgImage from "../../assets/Login_background.JPG";
import officeApi from "../../api/office.api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    EmployeeNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee", // "employee" | "admin"
    adminCode: "",
    officeCode: "",
  });
  const [loading, setLoading] = useState(false);

  const [offices, setOffices] = useState([]);
  const [officesLoading, setOfficesLoading] = useState(true);

  useEffect(() => {
    const fetchOffices = async () => {
        try {
            const res = await officeApi.getPublic();
            if (res.data.success) {
            setOffices(res.data.data);
            } 
            // if backend returns just array: [...]
            else if (Array.isArray(res.data)) {
            setOffices(res.data);
            } 
            else {
            toast.error("Could not load offices.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Could not reach the server to load offices.");
        }
        finally {
            setOfficesLoading(false);
        }
    };

    fetchOffices();
  }, []);

  const set = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.EmployeeNo.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!form.officeCode) {
      toast.error("Please select your office.");
      return;
    }

    if (form.role === "admin" && !form.adminCode.trim()) {
      toast.error("Please enter the admin access code.");
      return;
    }

    setLoading(true);

    try {
      // NOTE: adjust the base URL/path below to match your API client setup
      // (e.g. swap this for your axios instance if you have one elsewhere).
      const res = await fetch("/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          EmployeeNo: form.EmployeeNo.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          adminCode: form.role === "admin" ? form.adminCode.trim() : undefined,
          officeCode: form.officeCode,
        }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        toast.error(result.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error("Could not reach the server. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-950/70" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/30 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <img
            src={logo}
            alt="Official Seal"
            className="mx-auto mb-4 h-16 w-16 object-contain"
          />

          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Provincial Administrator's Office
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Records Management System
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Employee Number"
            type="text"
            placeholder="Enter your employee number"
            value={form.EmployeeNo}
            onChange={set("EmployeeNo")}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Office
            </label>
            <select
              value={form.officeCode}
              onChange={set("officeCode")}
              disabled={officesLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none disabled:opacity-60"
            >
              <option value="">
                {officesLoading ? "Loading offices..." : "Select your office"}
              </option>
              {offices.map((office) => (
                <option key={office.code} value={office.code}>
                  {office.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Register as
            </label>
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, role: "employee" }))}
                className={`rounded-lg py-2 transition ${
                  form.role === "employee"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, role: "admin" }))}
                className={`rounded-lg py-2 transition ${
                  form.role === "admin"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {form.role === "admin" && (
            <Input
              label="Admin Access Code"
              type="password"
              placeholder="Enter the admin access code"
              value={form.adminCode}
              onChange={set("adminCode")}
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={set("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={set("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
          />

          <Button type="submit" loading={loading} className="mt-2 w-full">
            Register
          </Button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-slate-900 underline-offset-2 hover:underline"
            >
              Login here
            </button>
          </p>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Provincial Administrator's Office
        </div>
      </div>
    </div>
  );
}