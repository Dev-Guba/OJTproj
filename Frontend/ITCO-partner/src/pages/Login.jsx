// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

// ✅ background image (make sure the filename matches exactly)
import bgImage from "../assets/Login_background.JPG";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);
    const ok = await login({ email: form.email.trim(), password: form.password });

    if (ok) {
      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } else {
      toast.error("Invalid credentials.");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-black/70" />


      {/* Login Card */}
<div className="relative z-10 w-full max-w-md rounded-2xl 
                bg-white/60 backdrop-blur-xl 
                shadow-[0_25px_60px_rgba(0,0,0,0.45)] 
                border border-white/30 
                p-8 transition-all duration-300">

  {/* Header */}
  <div className="mb-6 text-center">
    <h1 className="text-xl font-semibold tracking-wide text-gray-900">
      Provincial Administrator's Office
    </h1>
    <p className="text-sm text-gray-600 mt-1">
      Records Management System
    </p>
  </div>

  {/* Form */}
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

    <Button
      type="submit"
      disabled={loading}
      className="w-full bg-gray-900 hover:bg-black text-white transition-all duration-200"
    >
      {loading ? "Logging in..." : "Login"}
    </Button>
  </form>

  {/* Footer */}
  <div className="mt-6 text-center text-xs text-gray-500">
    © {new Date().getFullYear()} Provincial Administrator's Office
  </div>
</div>
    </div>
  );
}