import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const titles = [
  { path: "/dashboard/offices/"},
  { path: "/dashboard/offices"},
  { path: "/dashboard/admins",},
  { path: "/dashboard/settings", title: "Settings"},
  { path: "/dashboard/add", title: "Manage Records" },
  { path: "/dashboard/view", title: "Manage Records", subtitle: "View all records" },
  { path: "/dashboard/search", title: "Search" },
  { path: "/dashboard", title: "Dashboard" },
];

function getHeader(pathname) {
  const match = titles.find((x) => pathname.startsWith(x.path));
  return match || { title: "Dashboard", subtitle: "Manage records" };
}

export default function Topbar({ onMenu, right = null }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const header = getHeader(pathname);

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "User";
  const initials = (user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-3 py-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenu}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4.5 w-4.5">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-slate-900">
              {header.title}
            </div>

            <div className="truncate text-sm text-slate-500">
              {header.subtitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {right}

          <div className="hidden items-center gap-2.5 rounded-full bg-slate-100 px-3 py-1.5 sm:flex">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
              {initials}
            </span>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-slate-800">{displayName}</div>
              {user?.firstName && (
                <div className="text-[11px] text-slate-500">{user?.email}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}