import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClientDashboardPage from "./ClientDashboardPage";
import OwnerDashboardPage from "./OwnerDashboardPage";
import RealtorDashboardPage from "./RealtorDashboardPage";

function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "client") {
    return <ClientDashboardPage />;
  }

  if (user?.role === "owner") {
    return <OwnerDashboardPage />;
  }

  if (user?.role === "realtor") {
    return <RealtorDashboardPage />;
  }

  return <Navigate to="/" replace />;
}

export default DashboardPage;