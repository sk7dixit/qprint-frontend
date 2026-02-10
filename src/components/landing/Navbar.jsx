import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../shared/AuthContext";

export function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            setOpen(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#FFFBF0]/90 border-b border-indigo-200/50"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
                <Link to="/">
                    <motion.div
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <img src={logo} alt="Qprint Logo" className="h-12 w-auto object-contain" />
                    </motion.div>
                </Link>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-6">
                    {!user ? (
                        <>
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2 bg-transparent border-2 border-indigo-600 text-indigo-700 rounded-full hover:bg-indigo-50 transition-colors"
                                >
                                    Login
                                </motion.button>
                            </Link>
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-[#FFFBF0] rounded-full shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    Get Started
                                </motion.button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to={user.role === 'seller' ? '/seller/dashboard' : '/student/dashboard'}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-[#FFFBF0] rounded-full shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </motion.button>
                            </Link>
                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-2 bg-transparent border-2 border-red-500 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} />
                                Logout
                            </motion.button>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden p-2 text-indigo-800 flex items-center justify-center"
                    onClick={() => setOpen(!open)}
                    aria-label="Menu"
                >
                    {open ? (
                        <X size={26} strokeWidth={2.2} />
                    ) : (
                        <Menu size={26} strokeWidth={2.2} />
                    )}
                </button>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-20 right-6 w-48 bg-white rounded-xl shadow-2xl p-4 border border-indigo-100 flex flex-col gap-3 md:hidden"
                        >
                            {!user ? (
                                <>
                                    <Link to="/login" onClick={() => setOpen(false)}>
                                        <button className="w-full px-4 py-2 bg-transparent border-2 border-indigo-600 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors">
                                            Login
                                        </button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setOpen(false)}>
                                        <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-[#FFFBF0] rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                            Get Started
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to={user.role === 'seller' ? '/seller/dashboard' : '/student/dashboard'} onClick={() => setOpen(false)}>
                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-[#FFFBF0] rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                            <LayoutDashboard size={18} />
                                            Dashboard
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-transparent border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
