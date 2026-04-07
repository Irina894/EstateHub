import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OwnerRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "owner") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default OwnerRoute;