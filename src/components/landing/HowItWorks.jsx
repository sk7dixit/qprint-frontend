import { motion, useInView } from "motion/react";
import { Upload, Settings, Clock3, Package } from "lucide-react";
import { useRef } from "react";

function Step({ number, icon, title, description, color }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: number % 2 === 0 ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: number * 0.2 }}
            className="relative flex flex-col md:flex-row items-center gap-6"
        >
            {/* Step number */}
            <motion.div
                className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center relative`}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                    transformStyle: "preserve-3d",
                }}
            >
                <motion.div
                    className="absolute inset-0 rounded-full opacity-50 blur-xl"
                    style={{
                        background: `linear-gradient(135deg, ${color})`,
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative text-2xl font-bold text-[#FFFBF0] z-10">{number}</span>
            </motion.div>

            {/* Content card */}
            <motion.div
                className="flex-1 bg-[#FFFBF0] rounded-2xl p-6 border border-indigo-200 shadow-lg hover:shadow-2xl transition-shadow"
                whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px rgba(79, 70, 229, 0.2)",
                }}
            >
                <div className="flex items-start gap-4">
                    <motion.div
                        className={`p-3 rounded-lg bg-gradient-to-br ${color}`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                    >
                        {icon}
                    </motion.div>
                    <div>
                        <h3 className="text-2xl mb-2 text-slate-800">{title}</h3>
                        <p className="text-slate-600">{description}</p>
                    </div>
                </div>
            </motion.div>

            {/* Connecting line */}
            {number < 4 && (
                <motion.div
                    className="hidden md:block absolute left-10 top-20 w-0.5 h-32 bg-gradient-to-b from-indigo-400 to-cyan-400"
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.6, delay: number * 0.2 + 0.3 }}
                    style={{ transformOrigin: "top" }}
                />
            )}
        </motion.div>
    );
}

export function HowItWorks() {
    const steps = [
        {
            number: 1,
            icon: <Upload className="w-6 h-6 text-[#FFFBF0]" />,
            title: "Upload Your PDF",
            description: "Drag and drop your document or upload from your device. Multiple files supported.",
            color: "from-indigo-600 to-indigo-400",
        },
        {
            number: 2,
            icon: <Settings className="w-6 h-6 text-[#FFFBF0]" />,
            title: "Configure Settings",
            description: "Choose print options: color/B&W, pages, copies. Use AI tools to edit or compress if needed.",
            color: "from-blue-600 to-blue-400",
        },
        {
            number: 3,
            icon: <Clock3 className="w-6 h-6 text-[#FFFBF0]" />,
            title: "Track Queue Live",
            description: "See your position in real-time. Get estimated time and notifications when your turn approaches.",
            color: "from-cyan-600 to-cyan-400",
        },
        {
            number: 4,
            icon: <Package className="w-6 h-6 text-[#FFFBF0]" />,
            title: "Collect Your Prints",
            description: "Receive alert when ready. Show your QR code and collect your perfectly printed documents.",
            color: "from-teal-600 to-teal-400",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                }}
                transition={{ duration: 20, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                }}
                transition={{ duration: 15, repeat: Infinity }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        className="inline-block mb-4"
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-6xl">🚀</span>
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            How It Works
                        </span>
                    </h2>
                    <p className="text-xl text-slate-700 max-w-2xl mx-auto">
                        From upload to collection in just 4 simple steps
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {steps.map((step) => (
                        <Step key={step.number} {...step} />
                    ))}
                </div>

                {/* Success animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="mt-16 text-center"
                >
                    <motion.div
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full"
                        animate={{
                            boxShadow: [
                                "0 0 20px rgba(79, 70, 229, 0.3)",
                                "0 0 40px rgba(79, 70, 229, 0.5)",
                                "0 0 20px rgba(79, 70, 229, 0.3)",
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-2xl">🎉</span>
                        <span className="text-[#FFFBF0] text-lg">Done! That's it!</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
