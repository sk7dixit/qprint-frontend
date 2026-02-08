import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user.profile_complete && location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && user.role !== 'admin') {
        // Redirect to their respective dashboard if they try to access a route they aren't allowed to
        const target = user.role === 'seller' ? '/seller/dashboard' : '/student/dashboard';
        return <Navigate to={target} replace />;
    }

    return children;
};

export default ProtectedRoute;
