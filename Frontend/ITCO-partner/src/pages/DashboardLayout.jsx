import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen((v) => !v)} right={null} />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-5 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}