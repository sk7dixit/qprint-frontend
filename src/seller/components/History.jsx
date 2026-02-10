import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from "sonner";

import { useAuth } from '../../shared/AuthContext';

export default function History() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.token) return;
            try {
                const res = await axios.get('/api/print-jobs/shop', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setJobs(res.data);
            } catch (error) {
                console.error("Fetch shop history error:", error);
                toast.error("Failed to load shop history");
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const filteredJobs = jobs.filter((job) => {
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        const matchesSearch =
            job.id.toString().includes(searchTerm.toLowerCase()) ||
            job.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.display_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return date.toLocaleDateString();
    };

    const completedCount = jobs.filter((j) => j.status === 'completed').length;
    const rejectedCount = jobs.filter((j) => j.status === 'rejected').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="size-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">Job History</h1>
                <p className="text-gray-500 font-medium">Reference and review past jobs</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gray-100 p-2 rounded-lg">
                            <FileText className="size-5 text-gray-700" />
                        </div>
                        <span className="text-sm text-gray-600">Total Jobs</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900">{jobs.length}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle2 className="size-5 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900">{completedCount}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <XCircle className="size-5 text-red-600" />
                        </div>
                        <span className="text-sm text-gray-600">Rejected</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900">{rejectedCount}</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Job ID, filename, or student name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {['all', 'completed', 'rejected', 'cancelled'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${filterStatus === s
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Job Info</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Student</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Specs</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <FileText className="size-4 text-gray-700" />
                                            </div>
                                            <div>
                                                <p className="font-mono text-sm font-medium text-gray-900">#{job.id}</p>
                                                <p className="text-sm text-gray-600 truncate max-w-xs">{job.filename}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">{job.display_name || 'Student'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600 capitalize">
                                            {job.print_options?.color || 'bw'} • {job.print_options?.copies || 1}x
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="size-3" />
                                            {formatTime(job.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${job.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            job.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {job.status === 'completed' && <CheckCircle2 className="size-3" />}
                                            {job.status === 'rejected' && <XCircle className="size-3" />}
                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">₹{parseFloat(job.amount || 0).toFixed(2)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="size-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No historical data found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
