import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '../../shared/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../../shared/AuthContext';

export function Payments() {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const targetShopId = user?.shopId || user?.shop_id;

        if (!targetShopId) {
            setLoading(false);
            return;
        }

        const shopId = targetShopId.toString();
        const paymentsRef = collection(db, 'shops', shopId, 'payments');
        const q = query(paymentsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const paymentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().createdAt?.toDate() || new Date()
            }));
            setPayments(paymentsData);
            setLoading(false);
        }, (error) => {
            console.error("Firebase Payments Subscription Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.shopId, user?.shop_id]);

    const totalEarnings = payments
        .filter((p) => p.status === 'settled')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingAmount = payments
        .filter((p) => p.status === 'pending')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    const todayEarnings = payments
        .filter((p) => {
            const today = new Date();
            return (
                p.status === 'settled' &&
                p.date.toDateString() === today.toDateString()
            );
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);

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
                <p className="text-sm font-medium uppercase tracking-widest animate-pulse">Syncing Financial Records...</p>
            </div>
        );
    }

    return (
        <div className="size-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">Payments</h1>
                <p className="text-gray-500 font-medium">Financial clarity and real-time earnings overview</p>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Total Earnings */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Wallet className="size-5 opacity-90" />
                        <span className="text-sm opacity-90">Total Earnings</span>
                    </div>
                    <p className="text-4xl font-bold mb-1">₹{totalEarnings}</p>
                    <div className="flex items-center gap-1 text-sm opacity-90">
                        <TrendingUp className="size-4" />
                        <span>All time</span>
                    </div>
                </div>

                {/* Today's Earnings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="size-5 text-blue-600" />
                        <span className="text-sm text-gray-600">Today's Earnings</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">₹{todayEarnings}</p>
                    <p className="text-sm text-gray-500">Real-time status</p>
                </div>

                {/* Pending Settlements */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="size-5 text-orange-600" />
                        <span className="text-sm text-gray-600">Pending Settlements</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">₹{pendingAmount}</p>
                    <p className="text-sm text-orange-600">
                        {payments.filter((p) => p.status === 'pending').length} payments
                    </p>
                </div>
            </div>

            {/* Last Payout Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <Wallet className="size-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Last Payout</h3>
                        <p className="text-sm text-gray-600">
                            ₹2,450 was transferred to your bank account on Feb 5, 2026
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Date
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Job ID
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Student
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Amount
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Method
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{formatTime(payment.date)}</div>
                                        <div className="text-xs text-gray-500">
                                            {payment.date.toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-gray-700">
                                            {payment.jobId}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">{payment.studentName}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">₹{payment.amount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {payment.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {payment.status === 'settled' ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <CheckCircle2 className="size-3" />
                                                Settled
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                                <AlertCircle className="size-3" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
