import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../shared/AuthContext';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import CompleteProfile from '../pages/CompleteProfile';
import Preview from '../pages/Preview';
import SeeTheFlow from '../pages/SeeTheFlow';
import ResetPassword from '../pages/ResetPassword';
import SupabaseDemo from '../pages/SupabaseDemo';

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
import EditorPage from '../pages/EditorPage';
import { Compression } from '../student/components/Compression';
import { ShopsPricing } from '../student/components/ShopsPricing';
import { PrintHistory } from '../student/components/PrintHistory';
import { Chat as StudentChat } from '../student/components/Chat';
import { Profile as StudentProfile } from '../student/components/Profile';
import PrintSetup from '../pages/PrintSetup';

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
    const { user, loading, authenticated, unauthenticated, isError, error, logout } = useAuth();
    const location = useLocation();

    // 1. Loading State
    if (loading) return <LoadingScreen />;

    // 2. Error State (Sync Failure)
    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0] p-4 text-center">
                <div className="max-w-md bg-white border border-red-200 rounded-2xl shadow-xl p-8">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
                    <p className="text-gray-600 mb-6">{error || "We couldn't verify your account session."}</p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => logout()}
                            className="text-gray-500 hover:text-gray-700 font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Unauthenticated State
    if (unauthenticated) {
        if (isPublicAuth) return children || <Outlet />;
        return <Navigate to="/login" replace />;
    }

    // 3. Authenticated State
    if (authenticated && user) {
        // Strict Check: If we are here, backend sync MUST be done.
        // isProfileComplete is either true or false.

        // Profile Incomplete -> FORCE /complete-profile
        if (user.isProfileComplete === false) {
            if (location.pathname === "/complete-profile") {
                return children || <Outlet />;
            }
            return <Navigate to="/complete-profile" replace />;
        }

        // Profile Complete -> PREVENT /complete-profile & Public Auth
        if (location.pathname === "/complete-profile" || isPublicAuth) {
            const dashboardPath =
                user.role === 'seller' ? '/seller/dashboard' :
                    user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
            return <Navigate to={dashboardPath} replace />;
        }

        // Role Check for Protected Routes
        if (allowedRoles) {
            const hasAccess = Array.isArray(allowedRoles)
                ? allowedRoles.includes(user.role)
                : user.role === allowedRoles;

            if (!hasAccess) {
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
            {/* 1. ROOT ROUTE - Redirect authenticated users directly to their dashboard */}
            <Route
                path="/"
                element={
                    <AuthGuard isPublicAuth>
                        <Landing />
                    </AuthGuard>
                }
            />

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
            <Route path="/supabase-demo" element={<SupabaseDemo />} />

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
                    <Route path="upload" element={<Navigate to="/student/shops" replace />} />
                    <Route path="preview/:draftId" element={<Preview />} />
                    <Route path="editor/:draftId" element={<EditorPage />} />
                    <Route path="editor" element={<EditorPage />} />
                    <Route path="checkout" element={<Navigate to="/student/print-setup" replace />} />
                    <Route path="print-setup" element={<PrintSetup />} />
                    <Route path="cart" element={<Navigate to="/student/print-setup" replace />} />
                    <Route path="compress" element={<Compression />} />
                    <Route path="shops" element={<ShopsPricing />} />
                    <Route path="print-history" element={<PrintHistory />} />
                    <Route path="orders" element={<Navigate to="/student/print-history" replace />} />
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
