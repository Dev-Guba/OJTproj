import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { useMemo, useState } from "react";

const NavItem = ({ to, label, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        isActive
          ? "bg-gray-900 text-white active"
          : "text-gray-700 hover:bg-gray-100",
      ].join(" ")
    }
  >
    <span
      className={[
        "grid h-8 w-8 place-items-center rounded-lg text-base",
        "bg-gray-100 text-gray-700 group-[.active]:bg-white/10 group-[.active]:text-white",
      ].join(" ")}
    >
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { pathname } = useLocation();

  const manageActive = useMemo(() => {
    return pathname.startsWith("/dashboard/view") || pathname.startsWith("/dashboard/add");
  }, [pathname]);

  // default open when you're inside manage records routes
 const [manageOpen, setManageOpen] = useState(false);

useMemo(() => {
  if (manageActive) setManageOpen(true);
}, [manageActive]);


  const closeMobile = () => onClose?.();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed md:static z-40 h-screen w-72 shrink-0 border-r bg-white px-4 py-5",
          "transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          {/* Logo (clickable to dashboard) */}
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard");
              closeMobile();
            }}
            className="mb-6 w-full text-left"
          >
            <div className="flex items-center gap-3 rounded-2xl p-2 hover:bg-gray-50">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gray-900 text-white">
                A
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Asset Manager
                </div>
                <div className="text-xs text-gray-500">Admin Panel</div>
              </div>
            </div>
          </button>

          {/* Navigation */}
          <div className="space-y-1">
            {/* Manage Records Dropdown */}
            <button
              type="button"
              onClick={() => setManageOpen((v) => !v)}
              className={[
                "w-full group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition text-left",
                manageActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-8 w-8 place-items-center rounded-lg text-base",
                  manageActive
                    ? "bg-white/10 text-white"
                    : "bg-gray-100 text-gray-700",
                ].join(" ")}
              >
                ≡
              </span>

              <span className="font-medium flex-1">Manage Records</span>

              <span className={["text-xs transition-transform", manageOpen ? "rotate-180" : ""].join(" ")}>
                ▼
              </span>
            </button>

            {manageOpen && (
                <div className="mt-2 ml-6 space-y-1">
                <NavItem
                to="/dashboard/view"
                label="View Records"
                icon="•"
                onClick={closeMobile}
              />

               <NavItem
                to="/dashboard/add"
                label="Add Record"
                icon="•"
                 onClick={closeMobile}
              />    
              </div>
            )}

            <NavItem
              to="/dashboard/settings"
              label="Settings"
              icon="⚙"
              onClick={closeMobile}
            />
          </div>

          {/* Logout at bottom */}
          <div className="mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start border-t pt-4"
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