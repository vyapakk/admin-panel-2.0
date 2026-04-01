import { Navigate } from "react-router-dom";

// BACKEND INTEGRATION POINT: Replace localStorage check with proper session/token validation
// via GET /api/admin/me or JWT token verification
const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("stratview_admin_auth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
