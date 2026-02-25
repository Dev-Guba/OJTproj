import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AddArticle from "./pages/AddArticle";
import ViewAll from "./pages/ViewAll";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import { useAuth } from "./context/AuthContext";

function Protected({ children }) {
  const { user } = useAuth();
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
        {/* ✅ Default dashboard page shows statistics */}
        <Route index element={<Dashboard />} />

        <Route path="add" element={<AddArticle />} />
        <Route path="view" element={<ViewAll />} />
        <Route path="search" element={<Search />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}