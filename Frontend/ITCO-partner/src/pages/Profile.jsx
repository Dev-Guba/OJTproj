import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

const roleNames = {
  1: "Super Administrator",
  2: "Administrator",
  3: "Employee",
};

export default function Profile() {
  const { user } = useAuth();

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

  return (
    <div className="space-y-6">

      {/* Profile Header */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
              {initials}
            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                {displayName}
              </h1>

              <p className="mt-1 text-sm font-medium text-blue-600">
                {roleNames[user?.role_id]}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {user?.email}
              </p>

            </div>

          </div>

          <Button variant="outline">
            Edit Profile
          </Button>

        </div>

      </div>

      {/* Info Cards */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Personal */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Personal Information
            </h2>
          </div>

          <div className="p-6">

            <InfoRow
              label="First Name"
              value={user?.firstName}
            />

            <InfoRow
              label="Last Name"
              value={user?.lastName}
            />

            <InfoRow
              label="Email Address"
              value={user?.email}
            />

          </div>

        </div>

        {/* Account */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Account Information
            </h2>
          </div>

          <div className="p-6">

            <InfoRow
              label="Role"
              value={roleNames[user?.role_id]}
            />

            <InfoRow
              label="Employee Number"
              value={user?.employeeNo}
            />

            <InfoRow
              label="Office Code"
              value={user?.SameDeptCode || "-"}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-4 last:border-b-0">

      <span className="text-sm font-medium text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-900">
        {value || "-"}
      </span>

    </div>
  );
}