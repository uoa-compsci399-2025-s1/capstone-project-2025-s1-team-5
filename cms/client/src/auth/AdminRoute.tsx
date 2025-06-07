import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredScope?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredScope }) => {
  const { isAuthenticated, scopes } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredScope && !scopes.includes(requiredScope)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
