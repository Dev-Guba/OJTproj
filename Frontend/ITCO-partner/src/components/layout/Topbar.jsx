import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const titles = [
  { path: "/dashboard/settings", title: "Settings", subtitle: "Account and preferences" },
  { path: "/dashboard/add", title: "Manage Records", subtitle: "Create or edit a record" },
  { path: "/dashboard/view", title: "Manage Records", subtitle: "View all records" },
  { path: "/dashboard/search", title: "Search", subtitle: "Find records quickly" },
  { path: "/dashboard", title: "Dashboard", subtitle: "Statistics & overview" },
];

function getHeader(pathname) {
  const match = titles.find((x) => pathname.startsWith(x.path));
  return match || { title: "Dashboard", subtitle: "Manage records" };
}

export default function Topbar({ onMenu, right = null }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const header = getHeader(pathname);

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden rounded-xl px-3 py-2 hover:bg-gray-100"
            onClick={onMenu}
            aria-label="Open menu"
            type="button"
          >
            ☰
          </button>

          <div>
            <div className="text-sm font-semibold text-gray-900">{header.title}</div>
            <div className="text-xs text-gray-500">{header.subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Page-specific actions slot */}
          {right}

          {/* User chip */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-gray-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-medium text-gray-900">{user?.email ?? "Admin"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}