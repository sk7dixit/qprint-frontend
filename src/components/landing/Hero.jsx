import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const words = ["Smart", "Fast", "Efficient"];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"
                animate={{
                    x: mousePosition.x * 2,
                    y: mousePosition.y * 2,
                    scale: [1, 1.2, 1],
                }}
                transition={{ scale: { duration: 4, repeat: Infinity } }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
                animate={{
                    x: -mousePosition.x * 2,
                    y: -mousePosition.y * 2,
                    scale: [1.2, 1, 1.2],
                }}
                transition={{ scale: { duration: 4, repeat: Infinity } }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                    x: mousePosition.x * 1.5,
                    y: mousePosition.y * 1.5,
                    scale: [1, 1.3, 1],
                }}
                transition={{ scale: { duration: 5, repeat: Infinity } }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/10 backdrop-blur-sm rounded-full border border-indigo-300 mb-8"
                >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-indigo-900">Revolutionizing Campus Printing</span>
                </motion.div>

                <motion.h1
                    className="text-6xl md:text-8xl font-bold mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Queue-Free
                    </span>
                    <br />
                    <motion.span
                        key={currentWord}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent"
                    >
                        {words[currentWord]}
                    </motion.span>{" "}
                    <span className="text-slate-800">Printing</span>
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    Say goodbye to exam rush chaos. Upload your PDFs, track your queue position in real-time, and collect your prints hassle-free.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    <Link to="/signup">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(79, 70, 229, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-[#FFFBF0] rounded-full text-lg flex items-center gap-2 shadow-xl relative overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative">Upload & Print Now</span>
                            <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>

                    <Link to="/experience-flow">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-transparent border-2 border-indigo-600 text-indigo-700 rounded-full text-lg hover:bg-indigo-50 transition-colors"
                        >
                            See the Flow
                        </motion.button>
                    </Link>
                </motion.div>

                {/* 3D Floating Cards */}
                <div className="relative mt-20 h-64">
                    <motion.div
                        className="absolute left-1/4 top-0"
                        animate={{
                            y: [0, -20, 0],
                            rotateY: [0, 10, 0],
                            rotateX: [0, 5, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        style={{
                            transformStyle: "preserve-3d",
                            perspective: "1000px",
                        }}
                    >
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-indigo-400/30">
                            <div className="text-4xl mb-2">📄</div>
                            <div className="text-[#FFFBF0]">PDF Ready</div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute right-1/4 top-10"
                        animate={{
                            y: [0, -25, 0],
                            rotateY: [0, -10, 0],
                            rotateX: [0, -5, 0],
                        }}
                        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                        style={{
                            transformStyle: "preserve-3d",
                            perspective: "1000px",
                        }}
                    >
                        <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-cyan-400/30">
                            <div className="text-4xl mb-2">⚡</div>
                            <div className="text-[#FFFBF0]">Instant Queue</div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 top-20"
                        animate={{
                            y: [0, -30, 0],
                            rotateZ: [0, 5, 0],
                        }}
                        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                        style={{
                            transformStyle: "preserve-3d",
                            perspective: "1000px",
                        }}
                    >
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-blue-400/30">
                            <div className="text-4xl mb-2">🎯</div>
                            <div className="text-[#FFFBF0]">Track Live</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
