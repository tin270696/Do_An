import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

export default function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if(isLoading) {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  if(isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}