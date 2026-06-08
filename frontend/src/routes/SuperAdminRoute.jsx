import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SuperAdminRoute = () => {
  const { user, loading } = useAuth();
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

  return <Outlet />;
};

export default SuperAdminRoute;
