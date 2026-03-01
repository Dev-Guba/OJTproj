import { useEffect, useState, useLocation } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect based on role after login
  useEffect(() => {
    if (!user) return;

    if (user.role_id === 1 && location.pathname !== "DashboardLayout") {
      navigate("/DashboardLayout"); // Admin
    }
    else navigate("/dashboard/view"); // Normal user
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ok = await login({ email, password });

      if (ok) {
        toast.success("Welcome back!");
        console.log(ok);
      } else {
        toast.error("invalid cred!");
        // useEffect will handle navigation
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.error(err);
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

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <form className="space-y-4" onSubmit={onSubmit}>
              <Input
                label="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
              />
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
  );
}