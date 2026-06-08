import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // If loading context or a token exists but isn't yet synced to state, wait.
    if (loading) return null;

    if (!isAuthenticated) {
        const redirectTarget = `${location.pathname}${location.search}${location.hash}`;
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirectTarget)}`} replace state={{ from: location }} />;
    }
    // Temporarily disabled forced MFA redirect to allow dashboard access
    // if (isPrivileged && !user?.mfa_enabled && !isMfaProtectedRoute) {
    //     return <Navigate to="/app/mfa-security" replace />;
    // }

    return <Outlet />;
};

export default ProtectedRoute;
