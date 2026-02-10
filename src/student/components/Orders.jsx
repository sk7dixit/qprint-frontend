import { useState } from 'react';
import { FileText, Download, RotateCcw, Clock, CheckCircle, XCircle, Loader2, Store, Calendar } from 'lucide-react';

const mockOrders = [
    {
        id: '1',
        fileName: 'Data_Structures_Notes.pdf',
        shopName: 'Campus Copy Center',
        pages: 42,
        copies: 2,
        colorMode: 'color',
        amount: 96,
        status: 'completed',
        date: '2026-02-09',
        time: '2 hours ago',
        orderNumber: 'ORD-2026-1847',
    },
    {
        id: '2',
        fileName: 'Algorithm_Assignment.pdf',
        shopName: 'QuickPrint Express',
        pages: 15,
        copies: 1,
        colorMode: 'bw',
        amount: 30,
        status: 'printing',
        date: '2026-02-09',
        time: '30 minutes ago',
        orderNumber: 'ORD-2026-1846',
    },
    {
        id: '3',
        fileName: 'Database_Slides.pdf',
        shopName: 'PrintHub Pro',
        pages: 28,
        copies: 1,
        colorMode: 'color',
        amount: 224,
        status: 'pending',
        date: '2026-02-09',
        time: '10 minutes ago',
        orderNumber: 'ORD-2026-1845',
    },
    {
        id: '4',
        fileName: 'Research_Paper.pdf',
        shopName: 'Campus Copy Center',
        pages: 8,
        copies: 3,
        colorMode: 'bw',
        amount: 48,
        status: 'completed',
        date: '2026-02-08',
        time: '1 day ago',
        orderNumber: 'ORD-2026-1832',
    },
    {
        id: '5',
        fileName: 'Project_Report.pdf',
        shopName: 'EconoPrint',
        pages: 35,
        copies: 1,
        colorMode: 'color',
        amount: 280,
        status: 'cancelled',
        date: '2026-02-07',
        time: '2 days ago',
        orderNumber: 'ORD-2026-1821',
    },
];

export function Orders() {
    const [filter, setFilter] = useState('all');

    const filteredOrders = filter === 'all'
        ? mockOrders
        : mockOrders.filter((order) => order.status === filter);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5 text-amber-600" />;
            case 'printing': return <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />;
            case 'completed': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
            case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
            default: return null;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200 uppercase tracking-widest font-black text-[10px]';
            case 'printing': return 'bg-indigo-100 text-indigo-700 border-indigo-200 uppercase tracking-widest font-black text-[10px]';
            case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200 uppercase tracking-widest font-black text-[10px]';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200 uppercase tracking-widest font-black text-[10px]';
            default: return '';
        }
    };

    const stats = {
        total: mockOrders.length,
        pending: mockOrders.filter((o) => o.status === 'pending').length,
        printing: mockOrders.filter((o) => o.status === 'printing').length,
        completed: mockOrders.filter((o) => o.status === 'completed').length,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-white border border-border rounded-3xl p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 leading-none">Print History</h2>
                    <p className="text-gray-500 font-medium mt-3">
                        Track active deployments and historical print records
                    </p>
                </div>

                <div className="flex shrink-0 items-center p-2 bg-gray-50 border border-gray-100 rounded-2xl shadow-inner shadow-gray-200/50">
                    <div className="px-6 py-2 border-r border-gray-200 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Jobs</p>
                        <p className="text-xl font-black text-gray-900">{stats.total}</p>
                    </div>
                    <div className="px-6 py-2 text-center">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Value Spent</p>
                        <p className="text-xl font-black text-emerald-600">₹845</p>
                    </div>
                </div>
            </div>

            {/* Filters Hub */}
            <div className="bg-white border border-border rounded-[2rem] p-4 shadow-sm flex flex-wrap gap-2 sticky top-[80px] z-20">
                {[
                    { id: 'all', label: 'Overview', icon: Loader2 },
                    { id: 'pending', label: 'Queued', icon: Clock },
                    { id: 'printing', label: 'Active Lab', icon: Loader2 },
                    { id: 'completed', label: 'Successful', icon: CheckCircle },
                    { id: 'cancelled', label: 'Dropped', icon: XCircle }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-[0.98] ${filter === item.id
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                                : 'bg-transparent text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <item.icon className={`w-4 h-4 ${filter === item.id && item.id === 'printing' ? 'animate-spin' : ''}`} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white border border-border rounded-[2rem] p-8 shadow-sm group hover:border-indigo-100 transition-all duration-300">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-6 flex-1">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-50 border border-indigo-50 transition-transform group-hover:scale-110">
                                    <FileText className="w-8 h-8 text-indigo-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-black text-gray-900 truncate">{order.fileName}</h3>
                                    <div className="flex items-center gap-2 mt-2 font-bold text-gray-500 text-sm">
                                        <Store className="w-4 h-4 text-indigo-400" />
                                        <span>{order.shopName}</span>
                                        <span className="text-gray-200 mx-1">•</span>
                                        <span className="text-indigo-600 font-black tracking-widest text-[10px] uppercase">#{order.orderNumber}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <div className={`px-5 py-2 border rounded-xl flex items-center gap-2 ${getStatusStyle(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{order.time}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Sheets</p>
                                <p className="text-lg font-black text-gray-900">{order.pages} Original</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Bulk Volume</p>
                                <p className="text-lg font-black text-gray-900">{order.copies} Unit{order.copies > 1 ? 's' : ''}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Visual Specs</p>
                                <p className="text-lg font-black text-indigo-600 uppercase tracking-tight">{order.colorMode === 'bw' ? 'B/W' : 'Color'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Net Billing</p>
                                <p className="text-lg font-black text-gray-900">₹{order.amount.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            {order.status === 'completed' && (
                                <>
                                    <button className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2 text-sm shadow-sm active:scale-95">
                                        <Download className="w-4 h-4" />
                                        Archive Invoice
                                    </button>
                                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest flex items-center gap-2 text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                                        <RotateCcw className="w-4 h-4" />
                                        Quick Reprint
                                    </button>
                                </>
                            )}
                            {order.status === 'pending' && (
                                <button className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 text-sm shadow-sm hover:bg-red-100 transition-all active:scale-95">
                                    <XCircle className="w-4 h-4" />
                                    Terminate Order
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] p-24 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-12 h-12 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No sector data available...</h3>
                        <p className="text-gray-400 font-bold max-w-sm mx-auto uppercase text-xs tracking-widest leading-loose">
                            {filter === 'all'
                                ? 'Your deployment history is empty. Start your first print job from the terminal.'
                                : `No telemetry found for ${filter} status.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
