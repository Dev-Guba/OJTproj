import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/Official_seal.png";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import bgImage from "../../assets/Login_background.JPG";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const result = await login({
      email: form.email.trim(),
      password: form.password,
    });

    if (result.ok) {
      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } else {
      toast.error(result.error || "Invalid credentials.");
    }

    setLoading(false);
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1e3a5f]/75" />

      <div className="relative z-10 w-full max-w-sm">

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">

          {/* Navy top accent bar */}
          <div className="h-1.5 w-full bg-[#1e3a5f]" />

          {/* Header */}
          <div className="px-8 pb-0 pt-8 text-center">
            <img
              src={logo}
              alt="Official Seal"
              className="mx-auto mb-4 h-16 w-16 object-contain drop-shadow-sm"
            />
            <h1 className="text-lg font-semibold text-slate-900">
              Cebu Provincial Government
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Asset Management System
            </p>

            <div className="mx-auto mt-4 h-px w-12 bg-amber-400" />
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={set("email")}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={set("password")}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className={[
                  "mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-xl",
                  "bg-[#1e3a5f] text-sm font-medium text-white",
                  "transition hover:bg-[#162e4d] active:scale-[0.98]",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-8 py-4 text-center text-xs text-slate-400">
            Information Technology and Communications Office
          </div>
        </div>
      </div>
    </div>
  );
}