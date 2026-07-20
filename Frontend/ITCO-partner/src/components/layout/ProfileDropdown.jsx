import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const roleNames = {
  1: "Super Administrator",
  2: "Administrator",
  3: "Employee",
};

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "User";

  const initials =
    (
      (user?.firstName?.[0] || "") +
      (user?.lastName?.[0] || "")
    ).toUpperCase() ||
    (user?.email?.[0] || "U").toUpperCase();

  const role =
    roleNames[user?.role_id] || "User";

  useEffect(() => {
    function handleClickOutside(e) {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const MenuItem = ({ children, danger = false, onClick }) => (
    <button
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {initials}
        </div>

        <div className="hidden text-left sm:block">
          <div className="text-sm font-semibold text-slate-800">
            {displayName}
          </div>

          <div className="text-xs text-slate-500">
            {role}
          </div>
        </div>

        <svg
          viewBox="0 0 24 24"
          className={[
            "h-4 w-4 text-slate-500 transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className={[
          "absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-xl transition-all duration-200",
          open
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0",
        ].join(" ")}
      >
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-base font-semibold text-white">
              {initials}
            </div>

            <div>
              <div className="font-semibold text-slate-900">
                {displayName}
              </div>

              <div className="text-sm text-slate-500">
                {role}
              </div>

              <div className="text-xs text-slate-400">
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        <div className="p-2">
<MenuItem
  onClick={() => {
    navigate("/dashboard/profile");
    setOpen(false);
  }}
>
  👤 My Profile
</MenuItem>

<MenuItem
  onClick={() => {
    navigate("/dashboard/change-password");
    setOpen(false);
  }}
>
  🔑 Change Password
</MenuItem>

          <div className="my-2 border-t" />

          <MenuItem>❓ Help & Support</MenuItem>
          <MenuItem>ℹ️ About System</MenuItem>

          <div className="my-2 border-t" />

          <MenuItem danger onClick={logout}>
            🚪 Logout
          </MenuItem>
        </div>
      </div>
    </div>
  );
}