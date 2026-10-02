import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUserRole, isAuthenticated } from "../../utils/auth";

function ProtectedRoute({ requiredRole }) {
    const location = useLocation();

    if (!isAuthenticated()) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (requiredRole && getUserRole() !== requiredRole) {
        return (
            <Navigate
                to={getUserRole() === "ROLE_ADMIN" ? "/admin/dashboard" : "/dashboard"}
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;
