import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex">
      {/* Sidebar (single instance) */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onMenu={() => setOpen((v) => !v)} right={null} />

        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}