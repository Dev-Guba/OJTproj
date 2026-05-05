import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const titles = [
  {
    path: "/dashboard/offices/",
    title: "Office Details",
    subtitle: "View admins, employees, and account coverage",
  },
  {
    path: "/dashboard/offices",
    title: "Office Management",
    subtitle: "Manage system offices",
  },
  {
    path: "/dashboard/admins",
    title: "Admin Management",
    subtitle: "Manage office admin accounts",
  },
  {
    path: "/dashboard/settings",
    title: "Settings",
    subtitle: "Account and preferences",
  },
  {
    path: "/dashboard/add",
    title: "Manage Records",
    subtitle: "Create or edit a record",
  },
  {
    path: "/dashboard/view",
    title: "Manage Records",
    subtitle: "View all records",
  },
  {
    path: "/dashboard/search",
    title: "Search",
    subtitle: "Find records quickly",
  },
  {
    path: "/dashboard",
    title: "Dashboard",
    subtitle: "Statistics & overview",
  },
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
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50"
            onClick={onMenu}
            aria-label="Open menu"
            type="button"
          >
            ☰
          </button>

          <div>
            <div className="text-base font-semibold text-slate-900">
              {header.title}
            </div>
            <div className="text-sm text-slate-500">{header.subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
  {right}

  <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-700">
  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
    {user?.email?.[0]?.toUpperCase() ?? "U"}
  </span>
  <span className="font-medium">{user?.email ?? "User"}</span>
</div>
</div>
      </div>
    </header>
  );
}