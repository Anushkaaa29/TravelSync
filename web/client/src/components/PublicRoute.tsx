import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

interface PublicRouteProps {
    children: React.ReactElement;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) return <Loader text="Checking authentication..." />;

    if (user) {
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
