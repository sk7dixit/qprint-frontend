import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, UploadCloud, Printer, CheckCircle, X, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SeeTheFlow() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [hasCompletedLoop, setHasCompletedLoop] = useState(false);

    // Auto-advance logic
    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => {
                const next = (prev + 1) % 4;
                if (next === 0 && prev === 3) {
                    setHasCompletedLoop(true);
                }
                return next;
            });
        }, 3000); // 3 seconds per step
        return () => clearInterval(interval);
    }, []);

    // Text mapping
    const stepText = [
        "Your file enters the system",
        "Processing in real time",
        "Smart routing begins",
        "Ready before you expect it"
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    };

    const iconVariants = {
        initial: { scale: 0.8, opacity: 0, y: 20 },
        animate: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.8, type: "spring" } },
        exit: { scale: 0.8, opacity: 0, y: -20, transition: { duration: 0.5 } }
    };

    const textVariants = {
        initial: { opacity: 0, y: 10, filter: "blur(5px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, filter: "blur(5px)", transition: { duration: 0.5, ease: "easeIn" } }
    };

    const progressLineVariants = {
        initial: { width: "0%" },
        animate: (custom) => ({
            width: `${(custom + 1) * 25}%`,
            transition: { duration: 1, ease: "easeInOut" }
        })
    };

    return (
        <motion.div
            className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden z-50 text-white"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >
            {/* Close Button */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
            >
                <X className="w-6 h-6 text-white/80 hover:text-white" />
            </button>

            {/* Main Animation Stage */}
            <div className="relative w-full max-w-4xl h-96 flex flex-col items-center justify-center">
                <div className="relative w-full h-64 flex items-center justify-center mb-12">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="upload"
                                className="absolute flex flex-col items-center gap-4"
                                variants={iconVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                                    <UploadCloud className="w-16 h-16 text-white" />
                                </div>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="processing"
                                className="absolute flex flex-col items-center gap-4"
                                variants={iconVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <div className="relative w-32 h-32">
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl border-2 border-indigo-500/50"
                                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <div className="w-32 h-32 rounded-2xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center backdrop-blur-xl">
                                        <Copy className="w-16 h-16 text-indigo-400" />
                                    </div>
                                    {/* Scanning bar */}
                                    <motion.div
                                        className="absolute left-0 right-0 h-1 bg-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                                        animate={{ top: ["10%", "90%", "10%"] }}
                                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="assignment"
                                className="absolute flex flex-col items-center gap-4"
                                variants={iconVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)]">
                                    <Printer className="w-16 h-16 text-white" />
                                </div>
                                {/* Particles */}
                                <motion.div
                                    className="absolute -right-12 top-1/2 w-4 h-4 bg-purple-400 rounded-full blur-sm"
                                    animate={{ x: [0, 20], opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute -left-12 top-1/2 w-4 h-4 bg-indigo-400 rounded-full blur-sm"
                                    animate={{ x: [0, -20], opacity: [1, 0] }}
                                    transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }}
                                />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="completion"
                                className="absolute flex flex-col items-center gap-4"
                                variants={iconVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                                    <CheckCircle className="w-16 h-16 text-white" />
                                </div>
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                                    animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Motion Text */}
                <div className="h-12 relative flex items-center justify-center w-full">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={step}
                            variants={textVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="text-2xl md:text-3xl font-light text-center text-slate-200 tracking-wide"
                        >
                            {stepText[step]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-64 h-1 bg-white/10 rounded-full mt-12 overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"
                    variants={progressLineVariants}
                    custom={step}
                    initial="initial"
                    animate="animate"
                    layout
                />
            </div>

            {/* CTA - Appears after one full loop */}
            <AnimatePresence>
                {hasCompletedLoop && (
                    <motion.div
                        className="absolute bottom-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-slate-900 rounded-full font-medium shadow-lg hover:shadow-xl hover:bg-slate-100 transition-all flex items-center gap-2 group"
                            >
                                <span>Upload & Print Now</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Atmosphere */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            </div>
        </motion.div>
    );
}
