import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileNavOpen(true)} right={null} />

<main className="flex-1 overflow-x-hidden overflow-y-auto">
  <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8">
    <div className="mx-auto w-full max-w-screen-2xl">
      <Outlet />
    </div>  
  </div>
</main>
      </div>
    </div>
  );
}