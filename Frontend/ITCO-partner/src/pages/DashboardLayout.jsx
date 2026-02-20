import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex-1">
        <Topbar onMenu={() => setOpen((v) => !v)} />

        <main className="px-4 py-5 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}