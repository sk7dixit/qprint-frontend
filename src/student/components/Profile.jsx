import { useState } from 'react';
import { User, Mail, Smartphone, BookOpen, Shield, Bell, Eye, EyeOff, Layout, LogOut, ChevronRight, Store } from 'lucide-react';
import { useAuth } from '../../shared/AuthContext';

export function Profile() {
    const { user, logout } = useAuth();

    const [notifications, setNotifications] = useState({
        orderStatus: true,
        chatMessages: true,
        promotions: false,
        security: true,
    });

    const [showSensitive, setShowSensitive] = useState(false);

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Profile Header */}
            <div className="bg-white border border-border rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110" />

                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-200 border-4 border-white">
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'UN'}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black text-gray-900 leading-tight">{user.name}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                            <span className="px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                A-Level Identity
                            </span>
                            <span className="px-4 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                                {user?.role || 'User'} Verified
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Core Identity */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Identity Matrix</h3>
                            <button
                                onClick={() => setShowSensitive(!showSensitive)}
                                className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400"
                            >
                                {showSensitive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <BookOpen className="w-3 h-3" />
                                    ID Reference
                                </label>
                                <p className="text-lg font-black text-gray-900 font-mono tracking-tighter bg-gray-50 p-4 rounded-2xl border border-gray-50">
                                    {showSensitive ? user.enrollmentId : '•••• •••• ••••'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Mail className="w-3 h-3" />
                                    Primary Uplink
                                </label>
                                <p className="text-lg font-black text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-50 truncate">
                                    {showSensitive ? user.email : '••••••••••••@university.edu'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Smartphone className="w-3 h-3" />
                                    Neural Comms
                                </label>
                                <p className="text-lg font-black text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-50">
                                    {showSensitive ? user.mobile : '+91 ••••• •••••'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Layout className="w-3 h-3" />
                                    Dept. Authority
                                </label>
                                <p className="text-lg font-black text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-50">
                                    Engineering Dept.
                                </p>
                            </div>
                        </div>

                        <button className="w-full mt-10 py-5 bg-indigo-50 text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100/50">
                            Request Identity Update
                        </button>
                    </div>

                    <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Notification Telemetry</h3>

                        <div className="space-y-6">
                            {[
                                { id: 'orderStatus', label: 'Order Status Alerts', desc: 'Real-time progression updates for print jobs', icon: Bell },
                                { id: 'chatMessages', label: 'Channel Comms', desc: 'Direct messages from shop operators', icon: Smartphone },
                                { id: 'promotions', label: 'Econ Alerts', desc: 'Flash sales and shop discount pulses', icon: Shield },
                                { id: 'security', label: 'System Guard', desc: 'Account access and security protocols', icon: Shield },
                            ].map((notif) => (
                                <div key={notif.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                            <notif.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{notif.label}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{notif.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotifications({ ...notifications, [notif.id]: !notifications[notif.id] })}
                                        className={`w-14 h-8 rounded-full transition-all relative ${notifications[notif.id] ? 'bg-indigo-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${notifications[notif.id] ? 'left-7' : 'left-1'
                                            }`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Saved Terminals</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Campus Copy Center', rating: 4.8 },
                                { name: 'QuickPrint Express', rating: 4.6 },
                            ].map((shop, i) => (
                                <button
                                    key={i}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 rounded-2xl transition-all group border border-transparent hover:border-indigo-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                            <Store className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-gray-900 uppercase truncate max-w-[100px]">{shop.name}</p>
                                            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">★ {shop.rating}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-all" />
                                </button>
                            ))}
                            {([1]).length === 0 && (
                                <p className="text-xs font-bold text-gray-400 text-center py-4 italic uppercase tracking-widest">No terminals saved</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border-2 border-red-50 rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-xs font-black text-red-400 uppercase tracking-[0.2em] mb-8">Danger Protocol</h3>
                        <button
                            onClick={() => logout()}
                            className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-red-100 hover:bg-red-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>

                    <div className="p-8 bg-indigo-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700" />
                        <div className="relative z-10">
                            <h4 className="text-xl font-black leading-tight mb-2">Technical Support</h4>
                            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.2em] mb-6">Available 24/7</p>
                            <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                                Initialize Connect
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
