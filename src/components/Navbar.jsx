import { Link } from 'react-router-dom';
import { Printer, ArrowRight } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed w-full z-50 glass-effect border-b border-indigo-100/50 h-[72px] flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="bg-ink-blue p-2 rounded-xl shadow-lg shadow-blue-900/10">
                            <Printer className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-primary text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-ink-blue to-system-indigo">
                            QPrint
                        </span>
                    </Link>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/login" className="btn-ghost">
                            <span>Login</span>
                        </Link>
                        <Link
                            to="/signup"
                            className="btn-signature"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="h-4 w-4 cta-icon" />
                        </Link>
                    </div>

                    {/* Mobile Mini Actions */}
                    <div className="md:hidden flex items-center">
                        <Link to="/login" className="btn-ghost scale-90">
                            <span>Login</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
