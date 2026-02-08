import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/AuthContext";
import { User, Hash, Phone, CheckCircle2, AlertCircle } from "lucide-react";

export default function CompleteProfile() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Form states
    const [name, setName] = useState(user?.name || "");
    const [enrollmentId, setEnrollmentId] = useState("");
    const [mobile, setMobile] = useState("");

    // Sync name from user object if it loads later
    useEffect(() => {
        if (user?.name && !name) setName(user.name);
    }, [user, name]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation
        if (!name.trim() || !enrollmentId.trim() || !mobile.trim()) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        if (!/^\d{10}$/.test(mobile.replace(/[\s-]/g, ""))) {
            setError("Please enter a valid 10-digit mobile number.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/complete-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    enrollmentId: enrollmentId.trim(),
                    mobile: mobile.trim(),
                    name: name.trim(), // Assuming we want to sync the updated name
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                // Update user context with full profile
                setUser({ ...user, ...data.user, profile_complete: true });

                setTimeout(() => {
                    navigate("/student/dashboard", { replace: true });
                }, 1500);
            } else {
                setError(data.error || "Failed to update profile. Please try again.");
            }
        } catch (err) {
            console.error("Profile completion error:", err);
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    // Adaptive label logic
    const getIdLabel = () => {
        if (/^[0-9]+$/.test(enrollmentId)) return "Enrollment Number";
        if (enrollmentId.length > 0) return "Staff ID";
        return "Enrollment / Staff ID";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-blue-50 rounded-2xl mb-4 text-blue-600">
                        <User className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Complete Your Profile</h1>
                    <p className="text-gray-500 text-sm mt-2 font-medium">Just a few more details to get you started</p>
                </div>

                {success ? (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-center p-8 bg-green-50 rounded-[2rem] border border-green-100 flex flex-col items-center gap-4"
                    >
                        <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-green-800">All Set!</h3>
                            <p className="text-green-700/70 font-medium">Taking you to your dashboard...</p>
                        </div>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-blue-600 transition-all outline-none shadow-sm"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Enrollment / Staff ID */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                                {getIdLabel()}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Hash className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={enrollmentId}
                                    onChange={(e) => setEnrollmentId(e.target.value)}
                                    placeholder="e.g. 210303124123"
                                    className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-blue-600 transition-all outline-none shadow-sm"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                                Mobile Number
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="9876543210"
                                    className="w-full h-14 bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-blue-600 transition-all outline-none shadow-sm"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl shadow-blue-500/10"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Save & Continue"
                            )}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
