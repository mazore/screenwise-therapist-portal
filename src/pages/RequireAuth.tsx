import { useIsAuthenticated } from "@azure/msal-react";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default RequireAuth;
