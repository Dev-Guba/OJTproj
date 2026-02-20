import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden rounded-xl px-3 py-2 hover:bg-gray-100"
            onClick={onMenu}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div>
            <div className="text-sm font-semibold text-gray-900">Dashboard</div>
            <div className="text-xs text-gray-500">Manage records</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-xs text-gray-500">
            Logged in as <span className="font-semibold text-gray-900">{user?.username}</span>
          </div>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
      </div>
    </header>
  );
}