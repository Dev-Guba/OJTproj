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
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={set("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={set("password")}
          />

          <Button type="submit" loading={loading} className="mt-2 w-full">
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Provincial Administrator's Office
        </div>
      </div>
    </div>
  );
}