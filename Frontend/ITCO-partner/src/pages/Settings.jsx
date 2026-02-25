import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
        <div className="text-sm font-semibold text-gray-900">Account</div>
        <div className="text-sm text-gray-700">
          Logged in as:{" "}
          <span className="font-semibold">{user?.email ?? "—"}</span>
        </div>

        <div className="pt-2">
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
