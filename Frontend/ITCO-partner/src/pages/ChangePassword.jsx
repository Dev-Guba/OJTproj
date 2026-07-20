import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ChangePassword() {
  return (
    <div className="mx-auto max-w-3xl">

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl font-semibold text-slate-900">
            Change Password
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update your account password to keep your account secure.
          </p>
        </div>

        <div className="space-y-6 p-6">

          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
          />

          <div className="flex justify-end">
            <Button>
              Update Password
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}