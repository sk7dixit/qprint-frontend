import { useState, useEffect, useCallback } from 'react';
import {
    FileText,
    CheckCircle2,
    XCircle,
    Printer,
    Clock,
    User,
    Palette,
    Copy,
    CheckCheck,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../shared/AuthContext';
import { useSocket } from '../../shared/SocketContext';

export default function Queue() {
    const { user } = useAuth();
    const socket = useSocket();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchJobs = useCallback(async () => {
        if (!user?.token) {
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/print-jobs/shop', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                // Backend returns result.rows directly (array)
                setJobs(Array.isArray(data) ? data.map(order => ({
                    ...order,
                    timestamp: new Date(order.created_at)
                })) : []);
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.token]);

    useEffect(() => {
        fetchJobs();

        if (socket) {
            socket.on('orderCreated', (newOrder) => {
                setJobs(prev => [{ ...newOrder, timestamp: new Date(newOrder.created_at) }, ...prev]);
            });

            socket.on('statusUpdated', (updatedOrder) => {
                setJobs(prev => prev.map(job => job.id === updatedOrder.id ? { ...job, ...updatedOrder, timestamp: new Date(updatedOrder.created_at) } : job));
            });

            return () => {
                socket.off('orderCreated');
                socket.off('statusUpdated');
            };
        }
    }, [socket, fetchJobs]);

    const updateJobStatus = async (jobId, newStatus, reason) => {
        if (!user?.token) {
            alert("Authentication token missing. Please log in again.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/print-jobs/${jobId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: newStatus, reason })
            });

            if (response.ok) {
                const data = await response.json();
                // orderController returns { success: true, order: updatedOrder }
                const updatedOrder = data.order;
                setJobs(prev => prev.map(job => job.id === jobId ? { ...job, ...updatedOrder, timestamp: new Date(updatedOrder.created_at) } : job));
                setSelectedJob(null);
                setShowRejectModal(false);
                setRejectionReason('');
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating job status:", error);
            alert("Connection error: Failed to update status");
        }
    };

    const filteredJobs = filterStatus === 'all'
        ? jobs
        : jobs.filter(job => job.status === filterStatus);

    const getStatusColor = (status) => {
        switch (status) {
            case 'queued': return 'bg-blue-100 text-blue-700';
            case 'accepted': return 'bg-yellow-100 text-yellow-700';
            case 'printing': return 'bg-purple-100 text-purple-700';
            case 'ready': return 'bg-emerald-100 text-emerald-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'queued': return Clock;
            case 'accepted': return CheckCircle2;
            case 'printing': return Printer;
            case 'ready': return CheckCircle2;
            case 'completed': return CheckCheck;
            case 'rejected': return XCircle;
            default: return Clock;
        }
    };

    const formatTime = (date) => {
        if (!(date instanceof Date) || isNaN(date)) return '---';
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        return `${Math.floor(diff / 60)}h ago`;
    };

    // REMOVED: Blocking loading screen

    return (
        <div className="size-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">Print Queue</h1>
                <p className="text-gray-500 font-medium">Manage incoming print jobs in real-time</p>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'queued', 'accepted', 'printing', 'ready', 'completed', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${filterStatus === status
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {status !== 'all' && (
                            <span className="ml-2 text-xs">
                                ({jobs.filter(j => j.status === status).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredJobs.map((job) => {
                    const StatusIcon = getStatusIcon(job.status);

                    return (
                        <div
                            key={job.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-indigo-50 p-2 rounded-lg">
                                            <FileText className="size-6 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{job.filename}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span className="font-mono text-xs">#{job.id}</span>
                                                <span>•</span>
                                                <span>{formatTime(job.timestamp)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="size-4 text-gray-400" />
                                            <span className="text-gray-600 font-medium tracking-tight">Queue #{job.queue_number}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="size-4 text-gray-400" />
                                            <span className="text-gray-600 truncate">{job.display_name || 'Student'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                            <StatusIcon className="size-3" />
                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {job.status === 'queued' && (
                                        <>
                                            <button
                                                onClick={() => updateJobStatus(job.id, 'accepted')}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                            >
                                                <CheckCircle2 className="size-4" />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedJob(job);
                                                    setShowRejectModal(true);
                                                }}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                            >
                                                <XCircle className="size-4" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {job.status === 'accepted' && (
                                        <button
                                            onClick={() => updateJobStatus(job.id, 'printing')}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                                        >
                                            <Printer className="size-4" />
                                            Start Print
                                        </button>
                                    )}
                                    {job.status === 'printing' && (
                                        <button
                                            onClick={() => updateJobStatus(job.id, 'ready')}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                        >
                                            <CheckCircle2 className="size-4" />
                                            Mark Ready
                                        </button>
                                    )}
                                    {job.status === 'ready' && (
                                        <button
                                            onClick={() => updateJobStatus(job.id, 'completed')}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                        >
                                            <CheckCheck className="size-4" />
                                            Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredJobs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <FileText className="size-12 text-gray-100 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No jobs in this category</p>
                </div>
            )}

            {showRejectModal && selectedJob && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Job</h2>
                        <p className="text-gray-600 mb-4">
                            Why are you rejecting <span className="font-semibold text-indigo-900">{selectedJob.filename}</span>?
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter reason (e.g., Poor file quality, Wrong format)"
                            className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 transition-all"
                            rows={3}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                                className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium border border-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => updateJobStatus(selectedJob.id, 'rejected', rejectionReason)}
                                disabled={!rejectionReason.trim()}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-red-200"
                            >
                                Reject Job
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
