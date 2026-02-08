import AuthSidePanel from "./AuthSidePanel";

export default function AuthLayout({ role, children }) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Animated Experience */}
            <AuthSidePanel role={role} />

            {/* Right Side - Auth Form */}
            <div className="flex items-center justify-center p-4 lg:p-8 bg-gray-50/50">
                {children}
            </div>
        </div>
    );
}
