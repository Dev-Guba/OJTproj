import { useEffect, useState, useLocation } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto grid min-h-screen max-w-6xl place-items-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <div className="inline-flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gray-900 text-white">
                A
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Asset Manager</h1>
                <p className="text-sm text-gray-500">Sign in to continue</p>
              </div>
            </div>
          </div>

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
      </div>
    </div>
  );
}