import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Danh sách các role được phép vào (vd: ['ROLE_ADMIN'])
  children?: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  // 1. Chưa đăng nhập -> Đá về trang Auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Nếu route yêu cầu Role cụ thể mà user không có -> Đá về trang chủ (hoặc trang báo lỗi 403)
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; 
  }

  // 3. Nếu hợp lệ -> Cho phép render Component con
  return children ? <>{children}</> : <Outlet />;
}