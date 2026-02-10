import { Printer, FileText, DollarSign, Clock, Upload, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <h2 className="text-3xl font-heading font-bold text-slate-900">Welcome back, Student!</h2>
                <p className="text-muted-foreground mt-2 font-medium">Quick overview of your printing activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Total Prints</p>
                            <p className="text-4xl font-body font-bold mt-2 text-indigo-600">147</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <Printer className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Total Pages</p>
                            <p className="text-4xl font-body font-bold mt-2 text-blue-600">3,421</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Money Spent</p>
                            <p className="text-4xl font-body font-bold mt-2 text-emerald-600">₹845</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Last Print</p>
                            <p className="text-4xl font-body font-bold mt-2 text-orange-600">2h</p>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">ago</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Print Job Status */}
            <div className="bg-white border border-border rounded-[20px] p-8 shadow-sm">
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-8">Last Print Job</h3>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <FileText className="w-7 h-7 text-indigo-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Data_Structures_Notes.pdf</p>
                            <p className="text-sm text-gray-500 font-medium">32 pages • Color • 2 copies</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                            Completed
                        </span>
                    </div>
                </div>
                <div className="pt-6">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium">Shop: Campus Copy Center</span>
                        <span className="font-bold text-gray-900 text-lg">₹96.00</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2 font-medium">
                        Completed 2 hours ago • Order #ORD-2024-1847
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => navigate('/student/upload')}
                    className="bg-indigo-600 text-white p-8 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-between group shadow-lg shadow-indigo-100 active:scale-[0.98]"
                >
                    <div className="text-left">
                        <h3 className="text-2xl font-heading font-bold mb-2">Upload File</h3>
                        <p className="text-indigo-100/80 text-sm font-medium">
                            Upload and prepare your document for printing
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                    </div>
                </button>

                <button
                    onClick={() => navigate('/student/shops')}
                    className="bg-white border-2 border-indigo-600 text-indigo-600 p-8 rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-between group active:scale-[0.98]"
                >
                    <div className="text-left">
                        <h3 className="text-2xl font-heading font-bold mb-2">Find Shop</h3>
                        <p className="text-indigo-600/60 text-sm font-medium">
                            Browse nearby print shops and pricing
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Store className="w-6 h-6" />
                    </div>
                </button>
            </div>
        </div>
    );
}
