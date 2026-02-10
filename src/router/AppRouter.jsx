import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../shared/AuthContext';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import CompleteProfile from '../pages/CompleteProfile';
import SeeTheFlow from '../pages/SeeTheFlow';
import ResetPassword from '../pages/ResetPassword';

import SellerLayout from '../seller/SellerLayout';
import Dashboard from '../seller/components/Dashboard';
import Queue from '../seller/components/Queue';
import Chat from '../seller/components/Chat';
import History from '../seller/components/History';
import Payments from '../seller/components/Payments';
import Profile from '../seller/components/Profile';
import Settings from '../seller/components/Settings';

import StudentLayout from '../student/StudentLayout';
import { Dashboard as StudentDashboard } from '../student/components/Dashboard';
import { UploadPrepare } from '../student/components/UploadPrepare';
import { PDFEditor } from '../student/components/PDFEditor';
import { Compression } from '../student/components/Compression';
import { ShopsPricing } from '../student/components/ShopsPricing';
import { Cart } from '../student/components/Cart';
import { Orders } from '../student/components/Orders';
import { Chat as StudentChat } from '../student/components/Chat';
import { Profile as StudentProfile } from '../student/components/Profile';

/**
 * Loading Screen Component
 */
const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
);

/**
 * Centralized Auth Guard
 * Logic:
 * 1. If still loading auth, show LoadingScreen.
 * 2. If PUBLIC path and authenticated (for login/signup), direct to dashboard.
 * 3. If PROTECTED path and unauthenticated, direct to /login.
 * 4. If PROTECTED path and role mismatch, direct to / (lander).
 */
const AuthGuard = ({ children, isPublicAuth = false, allowedRoles = null }) => {
    const { user, loading, authenticated, unauthenticated } = useAuth();
    const location = useLocation();

    // 1. Loading State
    if (loading) return <LoadingScreen />;

    // 2. Unauthenticated State
    if (unauthenticated) {
        // If trying to access public auth pages (login/signup), allow it
        if (isPublicAuth) return children || <Outlet />;
        // Otherwise redirect to login
        return <Navigate to="/login" replace />;
    }

    // 3. Authenticated State
    if (authenticated && user) {
        // A. Profile Incomplete -> FORCE /complete-profile
        if (!user.profile_complete) {
            // Allow access only to /complete-profile
            if (location.pathname === "/complete-profile") {
                return children || <Outlet />;
            }
            return <Navigate to="/complete-profile" replace />;
        }

        // B. Profile Complete -> PREVENT /complete-profile & Public Auth
        if (location.pathname === "/complete-profile" || isPublicAuth) {
            const dashboardPath =
                user.role === 'seller' ? '/seller/dashboard' :
                    user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
            return <Navigate to={dashboardPath} replace />;
        }

        // C. Role Check for Protected Routes
        if (allowedRoles) {
            const hasAccess = Array.isArray(allowedRoles)
                ? allowedRoles.includes(user.role)
                : user.role === allowedRoles;

            if (!hasAccess) {
                // If student tries to access seller/admin, send to their dashboard
                // If invalid role, send to home
                if (user.role === 'student' || user.role === 'staff') return <Navigate to="/student/dashboard" replace />;
                if (user.role === 'seller') return <Navigate to="/seller/dashboard" replace />;
                return <Navigate to="/" replace />;
            }
        }

        return children || <Outlet />;
    }

    return <Navigate to="/login" replace />;
};

export function AppRouter() {
    return (
        <Routes>
            {/* 1. ROOT ROUTE - Purely Public, No Redirects */}
            <Route path="/" element={<Landing />} />

            {/* 2. AUTH ROUTES - Redirect if authenticated */}
            <Route
                path="/login"
                element={
                    <AuthGuard isPublicAuth>
                        <Login />
                    </AuthGuard>
                }
            />
            <Route
                path="/signup"
                element={
                    <AuthGuard isPublicAuth>
                        <Signup />
                    </AuthGuard>
                }
            />

            {/* Public Utility Routes */}
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/experience-flow" element={<SeeTheFlow />} />

            {/* 3. PROTECTED ROUTES - Centralized Checks */}

            {/* Profile Completion */}
            <Route
                path="/complete-profile"
                element={
                    <AuthGuard allowedRoles={['student', 'staff']}>
                        <CompleteProfile />
                    </AuthGuard>
                }
            />

            {/* Student & Staff Routes */}
            <Route
                path="/student"
                element={<AuthGuard allowedRoles={['student', 'staff']} />}
            >
                <Route element={<StudentLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="upload" element={<UploadPrepare />} />
                    <Route path="editor" element={<PDFEditor />} />
                    <Route path="compress" element={<Compression />} />
                    <Route path="shops" element={<ShopsPricing />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="chat" element={<StudentChat />} />
                    <Route path="profile" element={<StudentProfile />} />
                </Route>
            </Route>

            {/* Shopkeeper Routes */}
            <Route
                path="/seller"
                element={<AuthGuard allowedRole="seller" />}
            >
                <Route element={<SellerLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="queue" element={<Queue />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="history" element={<History />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Route>

            {/* Legacy & Utilities */}
            <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/shop/*" element={<Navigate to="/seller/dashboard" replace />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRouter;
