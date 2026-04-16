import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { useEffect, useMemo, useState } from "react";
import { ROLES } from "../../utils/roles";

const NavItem = ({ to, label, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
        isActive
          ? "bg-blue-600 text-white shadow-sm active"
          : "text-slate-700 hover:bg-blue-50 hover:text-blue-700",
      ].join(" ")
    }
  >
    <span
      className={[
        "grid h-9 w-9 place-items-center rounded-xl text-base transition",
        "bg-slate-100 text-slate-600",
        "group-[.active]:bg-white/15 group-[.active]:text-white",
      ].join(" ")}
    >
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const isSuperAdmin = user?.role_id === ROLES.SUPER_ADMIN;
  const isAdmin = user?.role_id === ROLES.ADMIN;
  const canManageRecords = isSuperAdmin || isAdmin;

  const manageActive = useMemo(() => {
    return (
      pathname.startsWith("/dashboard/view") ||
      pathname.startsWith("/dashboard/add")
    );
  }, [pathname]);

  const [manageOpen, setManageOpen] = useState(false);

  useEffect(() => {
    if (manageActive) setManageOpen(true);
  }, [manageActive]);

  const closeMobile = () => onClose?.();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed md:static z-40 h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5",
          "transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard");
              closeMobile();
            }}
            className="mb-6 w-full text-left"
          >
            <div className="flex items-center gap-3 rounded-2xl p-2 hover:bg-slate-50">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm">
                A
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Asset Manager
                </div>
                <div className="text-xs text-slate-500">Admin Panel</div>
              </div>
            </div>
          </button>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setManageOpen((v) => !v)}
              className={[
                "w-full group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition text-left",
                manageActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-blue-50 hover:text-blue-700",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-9 w-9 place-items-center rounded-xl text-base transition",
                  manageActive
                    ? "bg-white/15 text-white"
                    : "bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                ≡
              </span>

              <span className="font-medium flex-1">Manage Records</span>

              <span
                className={[
                  "text-xs transition-transform",
                  manageOpen ? "rotate-180" : "",
                ].join(" ")}
              >
                ▼
              </span>
            </button>

            {manageOpen && (
              <div className="mt-1 ml-6 space-y-1.5">
                <NavItem
                  to="/dashboard/view"
                  label="View Records"
                  icon="•"
                  onClick={closeMobile}
                />

                {canManageRecords && (
                  <NavItem
                    to="/dashboard/add"
                    label="Add Record"
                    icon="•"
                    onClick={closeMobile}
                  />
                )}
              </div>
            )}

            {isSuperAdmin && (
              <NavItem
                to="/dashboard/admins"
                label="Admin Management"
                icon="👥"
                onClick={closeMobile}
              />
            )}

           {isSuperAdmin && (
  <NavItem
    to="/dashboard/offices"
    label="Office Management"
    icon="🏢"
    onClick={closeMobile}
  />
)}

{isAdmin && (
  <NavItem
  to="/dashboard/offices/me"
  label="My Office"
  icon="🏢"
  onClick={closeMobile}
/>
)}


            <NavItem
              to="/dashboard/settings"
              label="Settings"
              icon="⚙"
              onClick={closeMobile}
            />
          </div>

          

          <div className="mt-auto pt-4">
            <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="text-xs text-slate-500">Signed in as</div>
              <div className="mt-1 text-sm font-medium text-slate-800 break-all">
                {user?.email ?? "User"}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={logout}
            >
              ⎋ Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}