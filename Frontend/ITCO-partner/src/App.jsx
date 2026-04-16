import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AddArticle from "./pages/AddArticle";
import ViewAll from "./pages/ViewAll";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import { useAuth } from "./context/AuthContext";
import AdminManagement from "./pages/superadmin/AdminManagement";
import OfficeManagement from "./pages/superadmin/OfficeManagement";
import OfficeDetailsPage from "./pages/superadmin/OfficeDetailsPage";

function Protected({ children }) {
  const { user, authReady } = useAuth();
  if (!authReady) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardLayout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="add" element={<AddArticle />} />
        <Route path="view" element={<ViewAll />} />
        <Route path="search" element={<Search />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admins" element={<AdminManagement />} />
        <Route path="offices" element={<OfficeManagement />} />
        <Route path="offices/:id" element={<OfficeDetailsPage />} />
        <Route path="offices/me" element={<OfficeDetailsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

      
  );
}