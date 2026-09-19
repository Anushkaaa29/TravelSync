import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

interface ProtectedRouteProps {
  children: React.ReactElement;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader text="Checking authentication..." />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    // Redirect non-admins to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
