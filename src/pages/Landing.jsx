import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Stats } from "../components/landing/Stats";
import { CTA } from "../components/landing/CTA";
import { Navbar } from "../components/landing/Navbar";

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF0] via-[#FFF8E7] to-[#E0F2FE] overflow-x-hidden">
            <Navbar />
            <Hero />
            <Stats />
            <Features />
            <HowItWorks />
            <CTA />
        </div>
    );
}
