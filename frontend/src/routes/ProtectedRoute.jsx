import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    // If loading context or a token exists but isn't yet synced to state, wait.
    if (loading) return null;

    if (!isAuthenticated) {
        const redirectTarget = `${location.pathname}${location.search}${location.hash}`;
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirectTarget)}`} replace state={{ from: location }} />;
    }

    const isPrivileged = user?.role === 'admin' || user?.role === 'super_admin';
    const isMfaProtectedRoute = location.pathname.includes('/mfa-security');

    if (isPrivileged && !user?.mfa_enabled && !isMfaProtectedRoute) {
        return <Navigate to="/app/mfa-security" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
