import { useState, useRef, useEffect } from 'react';
import {
    LayoutDashboard,
    ListOrdered,
    MessageSquare,
    History as HistoryIcon,
    Wallet,
    Settings as SettingsIcon,
    Store,
    LogOut,
    Menu,
    X,
    ChevronDown,
    User
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Queue } from './components/Queue';
import { Chat } from './components/Chat';
import { History } from './components/History';
import { Payments } from './components/Payments';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { useAuth } from '../shared/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

function ProfileMenu() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                onClick={() => setOpen(!open)}
            >
                <div className="size-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
                    <User className="size-4" />
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden sm:block truncate max-w-[150px]">
                    {user?.name || 'Seller'}
                </span>
                <ChevronDown className={`size-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_10px_24px_rgba(0,0,0,0.12)] border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                        <LogOut className="size-4" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}

export default function SellerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeModule, setActiveModule] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(false);

    // Hard Security Guard: Redirect if password reset is required
    useEffect(() => {
        const checkSecurityStatus = async () => {
            if (user) {
                // Check local user state first
                if (user.force_password_reset === true) {
                    navigate("/seller/reset-password", { replace: true });
                }
            }
        };
        checkSecurityStatus();
    }, [user, navigate]);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'queue', label: 'Queue', icon: ListOrdered },
        { id: 'chat', label: 'Messages', icon: MessageSquare },
        { id: 'history', label: 'History', icon: HistoryIcon },
        { id: 'payments', label: 'Payments', icon: Wallet },
        { id: 'profile', label: 'Shop Profile', icon: Store },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ];

    const renderContent = () => {
        switch (activeModule) {
            case 'dashboard': return <Dashboard onNavigate={setActiveModule} />;
            case 'queue': return <Queue />;
            case 'chat': return <Chat />;
            case 'history': return <History />;
            case 'payments': return <Payments />;
            case 'profile': return <Profile />;
            case 'settings': return <Settings isOnline={isOnline} setIsOnline={setIsOnline} />;
            default: return <Dashboard onNavigate={setActiveModule} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            {/* 2️⃣ HEADER (FINAL) */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-50">
                <div className="flex items-center">
                    <img src={logo} alt="QPrint Logo" className="h-8 w-auto drop-shadow-sm" />
                </div>

                <div className="flex items-center">
                    <ProfileMenu />
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* 3️⃣ FLOATING SIDEBAR (ALIGNED) */}
            <aside className={`
                fixed top-[96px] left-[24px] w-[72px]
                bg-gradient-to-b from-[#0b0f14] to-[#0f1623]
                rounded-[40px]
                shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_40px_rgba(0,0,0,0.6),0_0_40px_rgba(34,211,238,0.15)]
                z-30 py-3
                flex flex-col items-center
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[150%] lg:translate-x-0'}
            `}>
                <nav className="flex flex-col items-center gap-[14px] w-full">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeModule === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveModule(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`
                                    relative w-[44px] h-[44px] rounded-[14px]
                                    flex items-center justify-center
                                    transition-all duration-250 ease-out
                                    group
                                    ${isActive
                                        ? 'bg-[#22d3ee]/12 text-[#22d3ee] shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25),0_0_20px_rgba(34,211,238,0.4)]'
                                        : 'text-[#9ca3af] hover:text-[#e5e7eb]'
                                    }
                                `}
                                title={item.label}
                            >
                                {/* Left Accent Bar for Active State */}
                                {isActive && (
                                    <div className="absolute -left-[10px] w-[4px] h-[28px] bg-[#22d3ee] rounded-[2px] shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                                )}

                                <Icon className="w-[20px] h-[20px]" />
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* 4️⃣ CONTENT AREA (CENTERED) */}
            <main className="mt-[64px] min-h-[calc(100vh-64px)] transition-all duration-300">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:pl-[120px] py-8">
                    {/* Mobile Menu Trigger */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                        >
                            <Menu className="size-6" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="animate-in fade-in duration-500">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
