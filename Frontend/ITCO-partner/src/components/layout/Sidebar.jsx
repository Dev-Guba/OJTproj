import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { ROLES } from "../../utils/roles";
import logo from "../../assets/Official_seal.png";

const IconMenu = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const IconUsers = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M15.5 14.2c2.3.5 4 2.5 4 5.8" />
  </svg>
);

const IconBuilding = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="3" width="11" height="18" rx="1" />
    <path d="M15 8h5v13h-5" />
    <line x1="7.5" y1="7" x2="7.5" y2="7" />
    <line x1="11.5" y1="7" x2="11.5" y2="7" />
    <line x1="7.5" y1="11" x2="7.5" y2="11" />
    <line x1="11.5" y1="11" x2="11.5" y2="11" />
    <line x1="7.5" y1="15" x2="7.5" y2="15" />
    <line x1="11.5" y1="15" x2="11.5" y2="15" />
  </svg>
);

const IconAssets = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="M3.3 7 12 12l8.7-5"/>
    <path d="M12 22V12"/>
  </svg>
);

const IconLogs = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const IconSettings = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2.5M12 18.5V21M4.2 7.5l2.2 1.3M17.6 15.2l2.2 1.3M4.2 16.5l2.2-1.3M17.6 8.8l2.2-1.3M3 12h2.5M18.5 12H21" />
  </svg>
);

const IconLogout = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconChevronDown = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconX = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const NavItem = ({ to, label, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
        isActive ? "bg-blue-600 text-white shadow-sm" : "text-white/80 hover:bg-blue-500/20 hover:text-white",
      ].join(" ")
    }
  >
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 transition group-hover:bg-white/15">
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </NavLink>
);

const SubNavItem = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
        isActive ? "bg-blue-600 text-white" : "text-white/70 hover:bg-blue-500/15 hover:text-white",
      ].join(" ")
    }
  >
    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" aria-hidden="true" />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function Sidebar({ open = false, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const isSuperAdmin = user?.role_id === ROLES.SUPER_ADMIN;
  const isAdmin = user?.role_id === ROLES.ADMIN;
  const isPGSO = user?.SameDeptCode === "PGSO";
  const canAccessAssets = isSuperAdmin || (isAdmin && isPGSO);
  const canManageRecords = isSuperAdmin || isAdmin;

  const manageActive = useMemo(
    () => pathname.startsWith("/dashboard/view") || pathname.startsWith("/dashboard/add"),
    [pathname]
  );

  const [manageOpen, setManageOpen] = useState(false);

  useEffect(() => {
    if (manageActive) setManageOpen(true);
  }, [manageActive]);

  const closeMobile = () => onClose?.();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 h-full w-[85vw] max-w-[320px] shrink-0 bg-[#08204a] px-4 py-5 text-white shadow-xl transition-transform duration-300 ease-in-out lg:w-80",
          "md:static md:z-auto md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                navigate("/dashboard");
                closeMobile();
              }}
              className="flex flex-1 items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5"
            >
              <img src={logo} alt="Official Seal" className="h-11 w-11 shrink-0 object-contain" />
              <span className="text-base font-semibold text-white">Capitol Site</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white md:hidden"
            >
              <IconX className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => setManageOpen((v) => !v)}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                manageActive ? "bg-blue-600 text-white shadow-sm" : "text-white/80 hover:bg-blue-500/20 hover:text-white",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition",
                  manageActive ? "bg-white/15 text-white" : "bg-white/10 text-white/90",
                ].join(" ")}
              >
                <IconMenu className="h-4.5 w-4.5" />
              </span>

              <span className="flex-1 font-medium">Manage Records</span>

              <IconChevronDown
                className={["h-3.5 w-3.5 transition-transform", manageOpen ? "rotate-180" : ""].join(" ")}
              />
            </button>

            {manageOpen && (
              <div className="ml-6 mt-1 space-y-1 border-l border-white/15 pl-3">
                <SubNavItem to="/dashboard/view" label="View Records" onClick={closeMobile} />
                {canManageRecords && (
                  <SubNavItem to="/dashboard/add" label="Add Record" onClick={closeMobile} />
                )}
              </div>
            )}
 
            <NavItem
  to="/dashboard/assets"
  label="Assets"
  icon={<IconAssets className="h-4.5 w-4.5" />}
  onClick={closeMobile}
/>

{isSuperAdmin && (
  <NavItem
    to="/dashboard/audit-logs"
    label="Audit Logs"
    icon={<IconLogs className="h-4.5 w-4.5" />}
    onClick={closeMobile}
  />
)}

            {isSuperAdmin && (
              <NavItem
                to="/dashboard/admins"
                label="Admin Management"
                icon={<IconUsers className="h-4.5 w-4.5" />}
                onClick={closeMobile}
              />
            )}

            {isSuperAdmin && (
              <NavItem
                to="/dashboard/offices"
                label="Office Management"
                icon={<IconBuilding className="h-4.5 w-4.5" />}
                onClick={closeMobile}
              />
            )}

            {isAdmin && (
              <NavItem
                to="/dashboard/offices/me"
                label="My Office"
                icon={<IconBuilding className="h-4.5 w-4.5" />}
                onClick={closeMobile}
              />
            )}

            {/* <NavItem
              to="/dashboard/settings"
              label="Settings"
              icon={<IconSettings className="h-4.5 w-4.5" />}
              onClick={closeMobile}
            /> */}
          </div>
          

          <div className="mt-auto pt-4">
            {/* <Button variant="outline-dark" className="w-full justify-start rounded-xl" onClick={logout}>
              <IconLogout className="h-4 w-4" />
              Logout
            </Button> */}
          </div>
        </div>
      </aside>
    </>
  );
}