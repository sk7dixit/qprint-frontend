import { motion } from "motion/react";
import { ArrowRight, Sparkles, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export function CTA() {

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Animated gradient background */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 50%)",
                    ],
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-1 shadow-2xl"
                >
                    <div className="bg-[#FFFBF0] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                        {/* Floating elements */}
                        <motion.div
                            className="absolute top-10 left-10 text-4xl"
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 10, 0],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            📄
                        </motion.div>
                        <motion.div
                            className="absolute top-20 right-10 text-4xl"
                            animate={{
                                y: [0, -15, 0],
                                rotate: [0, -10, 0],
                            }}
                            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                        >
                            ⚡
                        </motion.div>
                        <motion.div
                            className="absolute bottom-10 left-20 text-4xl"
                            animate={{
                                y: [0, -25, 0],
                                rotate: [0, 15, 0],
                            }}
                            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                        >
                            🎯
                        </motion.div>
                        <motion.div
                            className="absolute bottom-20 right-20 text-4xl"
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, -15, 0],
                            }}
                            transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
                        >
                            ✨
                        </motion.div>

                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/10 rounded-full border border-indigo-300 mb-6"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span className="text-indigo-900">Join the Revolution</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Ready to Skip the Queue?
                            </span>
                        </h2>

                        <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
                            Join hundreds of students who are already printing smarter. No more chaos, no more waiting.
                        </p>

                        <motion.div
                            className="max-w-md mx-auto mb-8 flex justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-[#FFFBF0] rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Feature highlights */}
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-700">
                            <motion.div
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.1 }}
                            >
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 flex items-center justify-center">
                                    <span className="text-[#FFFBF0] text-xs">✓</span>
                                </div>
                                <span>Free to use</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.1 }}
                            >
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                                    <span className="text-[#FFFBF0] text-xs">✓</span>
                                </div>
                                <span>Instant setup</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.1 }}
                            >
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 flex items-center justify-center">
                                    <span className="text-[#FFFBF0] text-xs">✓</span>
                                </div>
                                <span>24/7 support</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src={logo} alt="Qprint Logo" className="h-10 w-auto object-contain" />
                    </div>
                    <p className="text-slate-700">
                        Making campus printing smart, simple, and stress-free.
                    </p>
                    <div className="mt-6 flex justify-center gap-6 text-sm text-slate-600">
                        <motion.a href="#" whileHover={{ scale: 1.1, color: "#4F46E5" }}>
                            Privacy Policy
                        </motion.a>
                        <motion.a href="#" whileHover={{ scale: 1.1, color: "#4F46E5" }}>
                            Terms of Service
                        </motion.a>
                        <motion.a href="#" whileHover={{ scale: 1.1, color: "#4F46E5" }}>
                            Contact Us
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
