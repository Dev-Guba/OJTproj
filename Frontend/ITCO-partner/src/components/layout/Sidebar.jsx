import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { useEffect, useMemo, useState } from "react";
import { ROLES } from "../../utils/roles";
import logo from "../../assets/Official_seal.png";

const NavItem = ({ to, label, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
        isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "text-white/80 hover:bg-blue-500/20 hover:text-white",
      ].join(" ")
    }
  >
    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-sm text-white/90 transition group-hover:bg-white/15 group-hover:text-white">
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


    <aside className="h-screen w-72 shrink-0 bg-[#08204a] px-4 py-5 text-white shadow-xl">

        <div className="flex h-full flex-col">
          {/* LOGO / BRAND */}
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard");
              closeMobile();
            }}
            className="mb-5 w-full text-left"
          >
            <div className="flex items-center gap-3 px-3 py-2">
  <img
    src={logo}
    alt="Official Seal"
    className="h-11 w-11 object-contain"
  />

  <span className="text-base font-semibold text-white">
    Capitol Site
  </span>
</div>
          </button>

          {/* NAVIGATION */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setManageOpen((v) => !v)}
              className={[
                "w-full group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition text-left",
                manageActive
  ? "bg-blue-600 text-white shadow-sm"
  : "text-white/80 hover:bg-blue-500/20 hover:text-white",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-9 w-9 place-items-center rounded-lg text-sm transition",
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
              <div className="ml-6 mt-1 space-y-1.5 border-l border-white/15 pl-3">
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
  <Button
    variant="outline"
    className="w-full justify-start rounded-xl"
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