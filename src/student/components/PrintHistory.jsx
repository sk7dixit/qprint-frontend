import { useState, useEffect } from 'react';
import { FileText, Download, Clock, CheckCircle, XCircle, Loader2, Store, Calendar } from 'lucide-react';
import axios from 'axios';
import { toast } from "sonner";
import { useAuth } from '../../shared/AuthContext';

export function PrintHistory() {
    const { user } = useAuth();
    const [printJobs, setPrintJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.token) return;
            try {
                const res = await axios.get('/api/print-jobs/history', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setPrintJobs(res.data);
            } catch (error) {
                console.error("Fetch history error:", error);
                toast.error("Failed to load your history");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    const filteredJobs = filter === 'all'
        ? printJobs
        : printJobs.filter((job) => job.status === filter);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'created':
            case 'queued': return <Clock className="w-5 h-5 text-amber-600" />;
            case 'accepted':
            case 'printing': return <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />;
            case 'ready':
            case 'completed': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
            case 'cancelled':
            case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
            default: return null;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'created':
            case 'queued': return 'bg-amber-100 text-amber-700 border-amber-200 uppercase tracking-widest font-black text-[10px]';
            case 'accepted':
            case 'printing': return 'bg-indigo-100 text-indigo-700 border-indigo-200 uppercase tracking-widest font-black text-[10px]';
            case 'ready':
            case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200 uppercase tracking-widest font-black text-[10px]';
            case 'cancelled':
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200 uppercase tracking-widest font-black text-[10px]';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const stats = {
        total: printJobs.length,
        pending: printJobs.filter((j) => ['created', 'queued'].includes(j.status)).length,
        printing: printJobs.filter((j) => ['accepted', 'printing'].includes(j.status)).length,
        completed: printJobs.filter((j) => j.status === 'completed').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 leading-none tracking-tight">Print History</h2>
                    <p className="text-slate-500 font-medium mt-3">
                        Track active deployments and historical print records
                    </p>
                </div>

                <div className="flex shrink-0 items-center p-2 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="px-6 py-2 border-r border-slate-200 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Jobs</p>
                        <p className="text-xl font-black text-slate-900">{stats.total}</p>
                    </div>
                    <div className="px-6 py-2 text-center">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Value Spent</p>
                        <p className="text-xl font-black text-emerald-600">₹{printJobs.reduce((sum, j) => sum + parseFloat(j.amount || 0), 0).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Filters Hub */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm flex flex-wrap gap-2 sticky top-[80px] z-20">
                {[
                    { id: 'all', label: 'Overview', icon: Loader2 },
                    { id: 'queued', label: 'Queued', icon: Clock },
                    { id: 'printing', label: 'Active', icon: Loader2 },
                    { id: 'completed', label: 'Successful', icon: CheckCircle },
                    { id: 'cancelled', label: 'Dropped', icon: XCircle }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-[0.98] ${filter === item.id
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                            : 'bg-transparent text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        <item.icon className={`w-4 h-4 ${filter === item.id && item.id === 'printing' ? 'animate-spin' : ''}`} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Jobs List */}
            <div className="space-y-6">
                {filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm group hover:border-indigo-200 transition-all duration-300">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-6 flex-1">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-50 border border-indigo-50 transition-transform group-hover:scale-110">
                                    <FileText className="w-8 h-8 text-indigo-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-black text-slate-900 truncate">{job.filename}</h3>
                                    <div className="flex items-center gap-2 mt-2 font-bold text-slate-500 text-sm">
                                        <Store className="w-4 h-4 text-indigo-400" />
                                        <span>{job.shop_name}</span>
                                        <span className="text-slate-200 mx-1">•</span>
                                        <span className="text-indigo-600 font-black tracking-widest text-[10px] uppercase">#{job.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <div className={`px-5 py-2 border rounded-xl flex items-center gap-2 ${getStatusStyle(job.status)}`}>
                                    {getStatusIcon(job.status)}
                                    {job.status}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sheets</p>
                                <p className="text-lg font-black text-slate-900">PDF Document</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Net Billing</p>
                                <p className="text-lg font-black text-slate-900">₹{parseFloat(job.amount).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Source</p>
                                <p className="text-lg font-black text-indigo-600 uppercase tracking-tight">Verified Job</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Created At</p>
                                <p className="text-lg font-black text-slate-900">{new Date(job.created_at).toLocaleTimeString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => job.final_pdf_url && window.open(job.final_pdf_url, '_blank')}
                                className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 text-sm shadow-sm active:scale-95"
                            >
                                <Download className="w-4 h-4" />
                                View Final PDF
                            </button>
                        </div>
                    </div>
                ))}

                {filteredJobs.length === 0 && (
                    <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-12 h-12 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No history found</h3>
                        <p className="text-slate-400 font-bold max-w-sm mx-auto uppercase text-xs tracking-widest leading-loose">
                            Your deployment history is empty. Start your first print job from the dashboard.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
