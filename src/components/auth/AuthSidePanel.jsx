import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Printer, Layers, Box, CreditCard, LayoutGrid } from "lucide-react";
import logo from "../../assets/images/logo.png";

// --- Animation Components (Keep existing ones, just ensure they exported or defined) ---
const EntryFlow = () => (
    <div className="relative w-full h-full flex flex-col justify-center px-12 z-20">
        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-10"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
        />

        {/* Animated Radial Gradient Source (Living Light) */}
        <motion.div
            className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 70%)",
                filter: "blur(60px)"
            }}
            animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
                x: [0, 20, 0],
                y: [0, -20, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Central Abstract Focal Element - Floating Lines */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20">
            <svg viewBox="0 0 400 400" className="w-full h-full">
                <motion.path
                    d="M 50 200 Q 200 100 350 200"
                    fill="none"
                    stroke="url(#gradient-line)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                />
                <motion.path
                    d="M 50 220 Q 200 120 350 220"
                    fill="none"
                    stroke="url(#gradient-line)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{ duration: 2.2, delay: 0.2, ease: "easeOut" }}
                />
                <motion.path
                    d="M 50 240 Q 200 140 350 240"
                    fill="none"
                    stroke="url(#gradient-line)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 2.4, delay: 0.4, ease: "easeOut" }}
                />
                <defs>
                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#38bdf8" /> {/* Sky blue */}
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
            </svg>
        </div>

        {/* Text Hierarchy - Center-Left Aligned */}
        <div className="relative z-30 space-y-4 max-w-lg">
            <motion.h1
                className="text-5xl font-bold tracking-tight text-[#F9FAFB] leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                Queue-less printing,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    reimagined.
                </span>
            </motion.h1>

            <motion.p
                className="text-xl text-[#D1D5DB] font-medium"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
                One system. Zero waiting.
            </motion.p>

            {/* Micro-indicator */}
            <motion.div
                className="flex gap-1.5 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                ))}
            </motion.div>
        </div>
    </div>
);

const StudentFlow = () => (
    <div className="relative w-full h-full overflow-hidden">
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute left-1/2"
                initial={{ y: "120%", x: (Math.random() - 0.5) * 200, opacity: 0, rotate: 0 }}
                animate={{
                    y: "-20%",
                    opacity: [0, 1, 1, 0],
                    rotate: (Math.random() - 0.5) * 20
                }}
                transition={{
                    duration: 6 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "linear"
                }}
            >
                <div className="w-24 h-32 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-400/20 rounded-lg p-3 backdrop-blur-md flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div className="w-full h-1 bg-indigo-400/20 rounded" />
                    <div className="w-2/3 h-1 bg-indigo-400/20 rounded" />
                </div>
            </motion.div>
        ))}
    </div>
);

const ShopkeeperFlow = () => (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
        <div className="grid grid-cols-2 gap-4 skew-x-[-5deg] scale-90">
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-32 h-24 bg-slate-800/50 border border-slate-600/30 rounded-xl flex items-center justify-center relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                >
                    <motion.div
                        className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    />
                    <div className="text-slate-500">
                        {i === 0 && <Layers className="w-8 h-8" />}
                        {i === 1 && <Printer className="w-8 h-8" />}
                        {i === 2 && <Box className="w-8 h-8" />}
                        {i === 3 && <LayoutGrid className="w-8 h-8" />}
                    </div>
                    <motion.div
                        className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/50"
                        animate={{ top: ["0%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: "linear" }}
                    />
                </motion.div>
            ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
    </div>
);

// --- Configuration ---
const config = {
    entry: {
        bg: "#0B0E14", // Deep Charcoal
        animation: EntryFlow,
        texts: [], // Text handled directly in EntryFlow
    },
    student: {
        bg: "linear-gradient(to bottom right, #0f172a, #172554)",
        animation: StudentFlow,
        texts: [
            "Print without standing in line",
            "Upload once. Pick up later.",
            "Designed for students",
        ],
    },
    shopkeeper: {
        bg: "linear-gradient(to bottom right, #0f172a, #1e1b4b)",
        animation: ShopkeeperFlow,
        texts: [
            "Manage print jobs effortlessly",
            "Orders organized automatically",
            "Built for high-volume flow",
        ],
    },
};

const TextRotator = ({ texts }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(0); // Reset on text change
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [texts]);

    if (!texts || texts.length === 0) return null;

    return (
        <div className="h-24 flex flex-col justify-end">
            <AnimatePresence mode="wait">
                <motion.p
                    key={texts[index]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-light tracking-wide text-white/90 leading-tight"
                >
                    {texts[index]}
                </motion.p>
            </AnimatePresence>

            {/* Indicators */}
            <div className="flex gap-2 mt-6">
                {texts.map((_, i) => (
                    <motion.div
                        key={i}
                        className="h-1 rounded-full bg-white/20"
                        animate={{
                            width: i === index ? 32 : 8,
                            backgroundColor: i === index ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.2)"
                        }}
                        transition={{ duration: 0.5 }}
                    />
                ))}
            </div>
        </div>
    );
}

export default function AuthSidePanel({ role = "entry" }) {
    const activeConfig = config[role] || config.entry;
    const AnimationComponent = activeConfig.animation;

    return (
        <div className="hidden lg:flex flex-col bg-zinc-950 text-white p-10 relative overflow-hidden justify-between h-full transition-all duration-700">
            {/* Background Transition */}
            <motion.div
                className="absolute inset-0"
                animate={{ background: activeConfig.bg }}
                transition={{ duration: 1 }}
            />

            {/* Logo - Static */}
            <div className="relative z-10 flex items-center gap-2 font-medium text-lg">
                <img src={logo} alt="QPrint Logo" className="h-10 w-auto" />
            </div>

            {/* Content & Animation Layer */}
            <div className={`absolute inset-0 z-0 ${role === 'entry' ? 'flex items-center' : ''}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={role}
                        className="w-full h-full"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        <AnimationComponent />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Text Layer - Mobile handling: Hidden on small screens via CSS, simplified here */}
            {/* For Entry, text is integrated. For others, use Rotator */}
            {role !== 'entry' && (
                <div className="relative z-10 mb-12 hidden md:block">
                    <TextRotator texts={activeConfig.texts} />
                </div>
            )}
        </div>
    );
}
