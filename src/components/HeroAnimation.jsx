import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Layers, Printer, CheckCircle, Clock } from 'lucide-react';

const HeroAnimation = () => {
    const [step, setStep] = useState(0);

    // Continuous loop through the system life-cycle
    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const steps = [
        { id: 0, label: "UPLOAD", icon: <Upload className="w-6 h-6" />, color: "text-blue-500", bg: "bg-blue-50" },
        { id: 1, label: "QUEUE", icon: <Layers className="w-6 h-6" />, color: "text-indigo-500", bg: "bg-indigo-50" },
        { id: 2, label: "PRINT", icon: <Printer className="w-6 h-6" />, color: "text-blue-700", bg: "bg-blue-100" },
        { id: 3, label: "READY", icon: <CheckCircle className="w-6 h-6" />, color: "text-green-500", bg: "bg-green-50" }
    ];

    return (
        <div className="w-full h-[400px] lg:h-[500px] relative flex items-center justify-center p-8">
            {/* Stable Base Container */}
            <div className="relative w-full max-w-lg aspect-square lg:aspect-video flex items-center justify-center">

                {/* Background Glows - Stable */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-indigo-50/30 rounded-full blur-[80px]" />

                {/* Central Processing Hub - Never moves */}
                <div className="relative z-10 w-72 h-72 lg:w-[22rem] lg:h-[22rem] bg-white/40 backdrop-blur-xl border border-blue-100/30 rounded-[3.5rem] shadow-2xl flex items-center justify-center overflow-hidden p-12">

                    {/* Inner Pulse Ring */}
                    <motion.div
                        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-12 border-2 border-blue-200/50 rounded-full"
                    />

                    {/* Infinite Heartbeat Stroke */}
                    <svg className="absolute inset-0 w-full h-full">
                        <motion.circle
                            cx="50%"
                            cy="50%"
                            r="42%"
                            fill="none"
                            stroke="#1e40af"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="100 300"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                        <circle
                            cx="50%"
                            cy="50%"
                            r="42%"
                            fill="none"
                            stroke="rgba(30, 64, 175, 0.05)"
                            strokeWidth="2"
                        />
                    </svg>

                    {/* Dynamic Content - Internal Switch */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="flex flex-col items-center gap-6 z-20"
                        >
                            <div className={`p-6 rounded-[2rem] ${steps[step].bg} ${steps[step].color} shadow-inner`}>
                                {steps[step].icon}
                            </div>
                            <div className="text-center">
                                <span className="text-[10px] font-black tracking-[0.2em] text-blue-900/40 uppercase font-mono">Status</span>
                                <p className={`text-2xl font-bold ${steps[step].color} tracking-tight mt-1`}>{steps[step].label}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Telemetry Dots */}
                    <div className="absolute top-10 left-10 flex gap-1.5">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-blue-400"
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HeroAnimation;
