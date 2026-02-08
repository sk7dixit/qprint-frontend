import { useState, useEffect } from 'react';
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
import { db } from '../../shared/firebase';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../shared/AuthContext';

export function Queue() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const targetShopId = user?.shopId || user?.shop_id;

        if (!targetShopId) {
            setLoading(false);
            return;
        }

        const shopId = targetShopId.toString();
        console.log(`🔥 Listening to job queue for shop: ${shopId}`);
        const jobsRef = collection(db, 'shops', shopId, 'jobs');
        const q = query(jobsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const jobsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().createdAt?.toDate() || new Date()
            }));
            setJobs(jobsData);
            setLoading(false);
        }, (error) => {
            console.error("Firestore subscription error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.shopId, user?.shop_id]);

    const updateJobStatus = async (jobId, newStatus, reason) => {
        try {
            const jobRef = doc(db, 'shops', user.shopId.toString(), 'jobs', jobId);
            const updatePayload = {
                status: newStatus,
                updatedAt: serverTimestamp()
            };

            // Only add reason if it's allowed by rules (currently only status & updatedAt are allowed)
            // But we can update the rules later or keep it simple for now.
            // If the user wants rejectionReason, it should be in the rules.

            await updateDoc(jobRef, updatePayload);

            setSelectedJob(null);
            setShowRejectModal(false);
            setRejectionReason('');
        } catch (error) {
            console.error("Error updating job status:", error);
            alert("Security Violation: You are not authorized to modify this record or field.");
        }
    };

    const filteredJobs = filterStatus === 'all'
        ? jobs
        : jobs.filter(job => job.status === filterStatus);

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'accepted': return 'bg-yellow-100 text-yellow-700';
            case 'printing': return 'bg-purple-100 text-purple-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'new': return Clock;
            case 'accepted': return CheckCircle2;
            case 'printing': return Printer;
            case 'completed': return CheckCheck;
            case 'rejected': return XCircle;
            default: return Clock;
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        return `${Math.floor(diff / 60)}h ago`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                <Loader2 className="size-10 animate-spin mb-4 text-accent-blue" />
                <p className="text-sm font-medium uppercase tracking-widest animate-pulse">Synchronizing Queue...</p>
            </div>
        );
    }

    return (
        <div className="size-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">Print Queue</h1>
                <p className="text-gray-500 font-medium">Manage incoming print jobs in real-time</p>
                {(!user?.shopId && !user?.shop_id) && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={14} /> Security Warning: Shop Identifier Missing from Identity Token
                    </div>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'new', 'accepted', 'printing', 'completed', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${filterStatus === status
                            ? 'bg-gray-900 text-white shadow-md'
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

            {/* Jobs List */}
            <div className="grid gap-4">
                {filteredJobs.map((job) => {
                    const StatusIcon = getStatusIcon(job.status);

                    return (
                        <div
                            key={job.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-4">
                                {/* Left: Job Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <FileText className="size-6 text-gray-700" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{job.fileName}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span className="font-mono">{job.id}</span>
                                                <span>•</span>
                                                <span>{formatTime(job.timestamp)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="size-4 text-gray-400" />
                                            <span className="text-gray-600">{job.pages} pages</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Palette className="size-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                {job.color === 'color' ? 'Color' : 'B&W'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Copy className="size-4 text-gray-400" />
                                            <span className="text-gray-600">{job.copies} copies</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="size-4 text-gray-400" />
                                            <span className="text-gray-600">{job.studentName}</span>
                                            <span className="text-xs text-gray-400">({job.studentId})</span>
                                        </div>
                                    </div>

                                    {/* Status & Payment */}
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                            <StatusIcon className="size-3" />
                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.paymentStatus === 'paid'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {job.paymentStatus === 'paid' ? '✓ Paid' : 'Pending Payment'}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    {job.status === 'new' && (
                                        <>
                                            <button
                                                onClick={() => updateJobStatus(job.id, 'accepted')}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                            >
                                                <CheckCircle2 className="size-4" />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedJob(job);
                                                    setShowRejectModal(true);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                <XCircle className="size-4" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {job.status === 'accepted' && (
                                        <button
                                            onClick={() => updateJobStatus(job.id, 'printing')}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                        >
                                            <Printer className="size-4" />
                                            Start Print
                                        </button>
                                    )}
                                    {job.status === 'printing' && (
                                        <button
                                            onClick={() => updateJobStatus(job.id, 'completed')}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
                <div className="text-center py-12 bg-white rounded-xl">
                    <FileText className="size-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No jobs in this category</p>
                </div>
            )}

            {/* Reject Modal */}
            {
                showRejectModal && selectedJob && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Job</h2>
                            <p className="text-gray-600 mb-4">
                                Why are you rejecting <span className="font-semibold">{selectedJob.fileName}</span>?
                            </p>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter reason (e.g., Poor file quality, Wrong format)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                                rows={3}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason('');
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateJobStatus(selectedJob.id, 'rejected', rejectionReason)}
                                    disabled={!rejectionReason.trim()}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
