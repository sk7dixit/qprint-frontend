import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ListOrdered,
    CheckCircle2,
    Wallet,
    Circle,
    TrendingUp,
    Clock,
    Loader2
} from 'lucide-react';
import { db } from '../../shared/firebase';
import { collection, query, onSnapshot, orderBy, limit, where } from 'firebase/firestore';
import { useAuth } from '../../shared/AuthContext';
import { useOutletContext } from 'react-router-dom';

export default function Dashboard({ onNavigate }) {
    const { user } = useAuth();
    const { shop } = useOutletContext();
    const [stats, setStats] = useState({
        activeQueue: 0,
        completedToday: 0,
        pendingPayments: 0,
        totalEarningsToday: 0,
        systemStatus: 'online',
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (!user?.token) return;
                const res = await axios.get('/api/print-jobs/shop', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const jobs = res.data;
                const today = new Date().toDateString();

                const active = jobs.filter(j => ['created', 'queued'].includes(j.status)).length;
                const completed = jobs.filter(j => j.status === 'completed' && new Date(j.created_at).toDateString() === today).length;
                const earnings = jobs
                    .filter(j => j.status === 'completed' && new Date(j.created_at).toDateString() === today)
                    .reduce((sum, j) => sum + parseFloat(j.amount || 0), 0);

                setStats(prev => ({
                    ...prev,
                    activeQueue: active,
                    completedToday: completed,
                    totalEarningsToday: earnings
                }));

                const recent = jobs
                    .slice(0, 4)
                    .map(j => ({
                        id: j.id,
                        time: formatDistance(new Date(j.created_at)),
                        action: j.status.charAt(0).toUpperCase() + j.status.slice(1),
                        student: j.display_name || 'Student'
                    }));
                setRecentActivity(recent);

            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.shopId, user?.shop_id]);

    function formatDistance(date) {
        const diff = Math.floor((new Date() - date) / 60000);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        return `${Math.floor(diff / 60)}h ago`;
    }

    // REMOVED: Blocking loading screen

    return (
        <div className="size-full">
            {/* 5.1 Page header (compact) */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900 leading-tight tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1.5 text-base font-medium">Quick operational overview</p>
                </div>
                {loading && (
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl animate-in fade-in">
                        <Loader2 className="size-4 animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Syncing</span>
                    </div>
                )}
            </div>
            {(!user?.shopId && !user?.shop_id) && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm animate-pulse">
                    <Circle className="size-3 fill-red-600 animate-ping" /> Security Alert: Shop Identity Payload Corrupted or Missing from JWT
                </div>
            )}

            {/* 5.2 System Status Banner (Expanded) */}
            <div className={`rounded-[20px] px-8 py-6 mb-8 text-white shadow-xl min-h-[100px] flex items-center justify-between border border-white/10 transition-colors duration-500 ${shop?.is_open ? 'bg-gradient-to-r from-[#10b981] to-[#059669]' : 'bg-gradient-to-r from-[#ef4444] to-[#dc2626]'
                }`}>
                <div className="flex items-center gap-6">
                    <div className="bg-white/20 p-3.5 rounded-2xl">
                        <Circle className={`size-6 fill-white ${shop?.is_open ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] opacity-80">Manual Shop Control</span>
                        </div>
                        <h2 className="text-2xl font-bold leading-none mt-1.5">
                            {shop?.is_open ? 'Online & Ready' : 'Currently Closed'}
                        </h2>
                        <p className="text-sm font-medium opacity-80 mt-1.5">
                            {shop?.is_open
                                ? 'The system is actively accepting print jobs.'
                                : 'Incoming print jobs are paused indefinitely.'}
                        </p>
                    </div>
                </div>
                <div className="text-right pr-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.15em] opacity-80 mb-2 leading-none">Today's Earnings</div>
                    <div className="text-4xl font-black tracking-tight">₹{stats.totalEarningsToday}</div>
                </div>
            </div>

            {/* 5.3 Stats Cards Grid (Expanded) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                {/* Active Queue Card */}
                <button
                    onClick={() => onNavigate('queue')}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 hover:shadow-xl transition-all active:scale-[0.97] text-left group relative overflow-hidden h-[180px] flex flex-col justify-between"
                >
                    <div className="flex items-start justify-between">
                        <div className="bg-orange-50 p-3 rounded-xl group-hover:bg-orange-600 transition-all duration-300">
                            <ListOrdered className="size-6 text-orange-600 group-hover:text-white transition-colors" />
                        </div>
                        {stats.activeQueue > 0 && (
                            <span className="bg-orange-500 text-[11px] text-white px-3 py-1 rounded-full font-black animate-pulse uppercase tracking-wider">
                                {stats.activeQueue} New Jobs
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Active Queue</h3>
                        <p className="text-4xl font-black text-gray-900 leading-none">{stats.activeQueue}</p>
                        <div className="mt-4 flex items-center text-[12px] font-bold text-orange-600 group-hover:translate-x-1.5 transition-transform">
                            OPEN OPERATIONAL QUEUE →
                        </div>
                    </div>
                </button>

                {/* Completed Today Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 relative overflow-hidden group h-[180px] flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div className="bg-green-50 p-3 rounded-xl">
                            <CheckCircle2 className="size-6 text-green-600" />
                        </div>
                        <div className="flex items-center gap-1.5 text-green-600 text-[12px] font-black bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            <TrendingUp className="size-4" />
                            <span>+12.4%</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Completed Today</h3>
                        <p className="text-4xl font-black text-gray-900 leading-none">{stats.completedToday}</p>
                        <p className="text-xs font-bold text-gray-400 mt-4 flex items-center gap-2 italic uppercase">
                            <span className="size-1.5 rounded-full bg-green-500" />
                            Peak Performance
                        </p>
                    </div>
                </div>

                {/* Pending Payments Card */}
                <button
                    onClick={() => onNavigate('payments')}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 hover:shadow-xl transition-all active:scale-[0.97] text-left group relative overflow-hidden h-[180px] flex flex-col justify-between"
                >
                    <div className="flex items-start justify-between">
                        <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-600 transition-all duration-300">
                            <Wallet className="size-6 text-purple-600 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Pending Payout</h3>
                        <p className="text-4xl font-black text-gray-900 leading-none">{stats.pendingPayments}</p>
                        <div className="mt-4 flex items-center text-[12px] font-bold text-purple-600 group-hover:translate-x-1.5 transition-transform">
                            SETTLE MERCHANT ACCOUNTS →
                        </div>
                    </div>
                </button>
            </div>

            {/* 5.4 Recent Activity (Expanded) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 leading-none tracking-tight">Recent System Activity</h2>
                    <button
                        onClick={() => onNavigate('history')}
                        className="text-[11px] text-blue-600 hover:text-blue-700 font-black uppercase tracking-widest transition-all p-2 bg-blue-50 rounded-lg hover:shadow-sm"
                    >
                        View Audit Trail →
                    </button>
                </div>

                <div className="space-y-4">
                    {recentActivity.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
                        >
                            <div className="flex items-center gap-5">
                                <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 group-hover:bg-white transition-colors shadow-sm">
                                    <span className="font-mono text-sm font-black text-gray-600">
                                        {activity.id}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-base font-bold text-gray-900 leading-tight">{activity.action}</p>
                                    <p className="text-sm font-semibold text-gray-400 mt-1">{activity.student}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-black text-gray-400 group-hover:text-gray-600 transition-colors">
                                <Clock className="size-4" />
                                {activity.time.toUpperCase()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}
