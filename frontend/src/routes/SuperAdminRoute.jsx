import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SuperAdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('kgmao_token');

  if (loading) return null;
  
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }
  
  // If we have a token but user hasn't synced yet, wait.
  if (!user && token) {
      return null; 
  }
  
  if (user.role !== 'super_admin' || user.is_impersonating) {
    return <Navigate to="/" replace />;
  }

  const isMfaProtectedRoute = location.pathname.includes('/mfa-security');
  if (!user?.mfa_enabled && !isMfaProtectedRoute) {
      return <Navigate to="/admin/mfa-security" replace />;
  }

  return <Outlet />;
};

export default SuperAdminRoute;
