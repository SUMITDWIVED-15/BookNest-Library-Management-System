import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../../utils/auth";

function PublicRoute() {
    if (isAuthenticated()) {
        if (isAdmin()) {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default PublicRoute;