import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../shared/ProtectedRoute';
import { useAuth } from '../shared/AuthContext';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import CompleteProfile from '../pages/CompleteProfile';
import SeeTheFlow from '../pages/SeeTheFlow';
import ResetPassword from '../pages/ResetPassword';

import { SellerPanel } from '../components/SellerPanel';

// Placeholder components - these should be replaced with actual page imports as they are recovered
const StudentDashboard = () => <div className="p-8">Student Dashboard (Placeholder)</div>;
const ShopOnboarding = () => <div className="p-8">Shop Onboarding (Placeholder)</div>;

const AppRouter = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/complete-profile" element={
                user ? (
                    user.role === 'seller' ? <Navigate to="/seller/dashboard" replace /> :
                        (!user.profile_complete ? <CompleteProfile /> : <Navigate to="/" replace />)
                ) : <Navigate to="/login" replace />
            } />
            <Route path="/experience-flow" element={<SeeTheFlow />} />

            {/* Student Routes */}
            <Route
                path="/student/*"
                element={
                    <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                        <Routes>
                            <Route path="dashboard" element={<StudentDashboard />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* Seller Routes */}
            <Route
                path="/seller/*"
                element={
                    <ProtectedRoute allowedRoles={['seller']}>
                        <Routes>
                            <Route path="dashboard" element={<SellerPanel />} />
                            <Route path="onboarding" element={<ShopOnboarding />} />
                            <Route path="reset-password" element={<ResetPassword />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* Root Redirect based on Role */}
            <Route
                path="/"
                element={
                    user ? (
                        user.role === 'seller' ? (
                            <Navigate to="/seller/dashboard" replace />
                        ) : !user.profile_complete ? (
                            <Navigate to="/complete-profile" replace />
                        ) : user.role === 'admin' ? (
                            <Landing /> // Admin landing
                        ) : (
                            <Navigate to="/student/dashboard" replace />
                        )
                    ) : (
                        <Landing />
                    )
                }
            />

            {/* Legacy Redirects */}
            <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/shop/*" element={<Navigate to="/seller/dashboard" replace />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;
