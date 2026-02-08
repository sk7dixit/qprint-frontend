import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

function AnimatedStat({ end, label, suffix = "", prefix = "" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        const duration = 2000;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = (currentTime - startTime) / duration;

            if (progress < 1) {
                setCount(Math.floor(end * progress));
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, end]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <motion.div
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2"
                animate={isInView ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {prefix}{count}{suffix}
            </motion.div>
            <div className="text-lg text-slate-700">{label}</div>
        </motion.div>
    );
}

export function Stats() {
    return (
        <section className="py-20 relative">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-1 shadow-2xl"
                >
                    <div className="bg-[#FFFBF0] rounded-3xl p-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <AnimatedStat end={500} suffix="+" label="Students Served Daily" />
                            <AnimatedStat end={95} suffix="%" label="Time Saved" />
                            <AnimatedStat end={10} suffix="K+" label="PDFs Processed" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
