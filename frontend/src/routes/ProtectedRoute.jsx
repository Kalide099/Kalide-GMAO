import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const token = localStorage.getItem('kgmao_token');

    // If loading context or a token exists but isn't yet synced to state, wait.
    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
