import { motion, useInView } from "motion/react";
import { Clock, Wand2, Zap, FileCheck, Bell, Shield } from "lucide-react";
import { useRef, useState } from "react";

function FeatureCard({ icon, title, description, color, index }) {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative group"
            style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
        >
            <motion.div
                animate={{
                    rotateY: isHovered ? 5 : 0,
                    rotateX: isHovered ? 5 : 0,
                    z: isHovered ? 50 : 0,
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative bg-[#FFFBF0] rounded-2xl p-8 border border-indigo-200 hover:border-indigo-400 transition-all shadow-lg hover:shadow-2xl"
                style={{
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Gradient border effect */}
                <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                    style={{
                        background: `linear-gradient(135deg, ${color}, transparent)`,
                        filter: "blur(20px)",
                    }}
                />

                <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 relative`}
                    animate={{
                        rotate: isHovered ? 360 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    <motion.div
                        animate={{
                            z: isHovered ? 30 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {icon}
                    </motion.div>
                </motion.div>

                <h3 className="text-2xl mb-3 text-slate-800">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{description}</p>

                {/* 3D floating particles */}
                <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full"
                    animate={{
                        y: isHovered ? -10 : 0,
                        opacity: isHovered ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                />
                <motion.div
                    className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-500 rounded-full"
                    animate={{
                        y: isHovered ? 10 : 0,
                        opacity: isHovered ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                />
            </motion.div>
        </motion.div>
    );
}

export function Features() {
    const features = [
        {
            icon: <Clock className="w-8 h-8 text-[#FFFBF0]" />,
            title: "Queue Management",
            description: "Real-time queue tracking with position updates. Know exactly when your prints will be ready.",
            color: "from-indigo-600 to-indigo-400",
        },
        {
            icon: <Wand2 className="w-8 h-8 text-[#FFFBF0]" />,
            title: "AI PDF Editor",
            description: "Smart PDF editing powered by AI. Crop, rotate, merge, and enhance your documents automatically.",
            color: "from-blue-600 to-blue-400",
        },
        {
            icon: <Zap className="w-8 h-8 text-[#FFFBF0]" />,
            title: "PDF Compressor",
            description: "Reduce file sizes without quality loss. Upload large files and get them optimized instantly.",
            color: "from-cyan-600 to-cyan-400",
        },
        {
            icon: <FileCheck className="w-8 h-8 text-[#FFFBF0]" />,
            title: "Easy Upload",
            description: "Drag and drop your PDFs or share directly from WhatsApp. Multiple file support included.",
            color: "from-teal-600 to-teal-400",
        },
        {
            icon: <Bell className="w-8 h-8 text-[#FFFBF0]" />,
            title: "Live Notifications",
            description: "Get instant alerts when your print is ready. No more waiting at the shop unnecessarily.",
            color: "from-indigo-500 to-blue-500",
        },
        {
            icon: <Shield className="w-8 h-8 text-[#FFFBF0]" />,
            title: "Secure & Private",
            description: "Your documents are encrypted and automatically deleted after printing. Complete privacy guaranteed.",
            color: "from-cyan-500 to-indigo-500",
        },
    ];

    return (
        <section id="features" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6">
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
                            rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-6xl">✨</span>
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Powerful Features
                        </span>
                    </h2>
                    <p className="text-xl text-slate-700 max-w-2xl mx-auto">
                        Everything you need for a seamless printing experience, right at your fingertips
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
