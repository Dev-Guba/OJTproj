import { NavLink } from "react-router-dom";

const NavItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        isActive
          ? "bg-gray-900 text-white"
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
          "fixed z-40 h-full w-72 border-r bg-white px-4 py-5",
          "transition-transform md:translate-x-0 md:static",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gray-900 text-white">
              A
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Asset Manager</div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <NavItem to="/dashboard/add" label="Add Article" icon="＋" />
          <NavItem to="/dashboard/view" label="View All" icon="≡" />
          <NavItem to="/dashboard/search" label="Search" icon="⌕" />
        </div>

       

      </aside>
    </>
  );
}