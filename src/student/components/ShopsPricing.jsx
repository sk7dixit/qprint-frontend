import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../shared/AuthContext';

export function ShopsPricing() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const draftId = searchParams.get('draftId');
    const { user } = useAuth();

    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const fetchShops = async (showLoading = false) => {
        if (!user?.token) return;
        if (showLoading) setLoading(true);
        try {
            const response = await axios.get('/api/print-jobs/shops', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            setShops(response.data);
        } catch (error) {
            console.error("Fetch shops error:", error);
            // Only toast on initial load error to avoid polling noise
            if (showLoading) toast.error("Failed to load shops");
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        // Initial fetch
        fetchShops(true);

        // Real-time polling (every 5 seconds)
        const interval = setInterval(() => {
            fetchShops(false);
        }, 5000);

        return () => clearInterval(interval);
    }, [user]);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('source', 'shop');

        try {
            const response = await axios.post('/api/print-drafts/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.data.success) {
                navigate(`/student/preview/${response.data.draftId}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-slate-500 font-medium">Connecting to campus printers...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <input
                type="file"
                id="shop-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
            />

            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Select a Shop</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <p className="text-slate-500 font-medium text-sm italic">Real-time status active</p>
                    </div>
                </div>
                {!draftId && (
                    <button
                        onClick={() => document.getElementById('shop-upload').click()}
                        disabled={isUploading}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isUploading ? <TrendingUp className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                        New Print
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((shop) => (
                    <div
                        key={shop.id}
                        className={`
                            bg-white border border-slate-200 rounded-3xl p-6 transition-all duration-300
                            ${shop.is_open
                                ? 'hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1'
                                : 'opacity-75 grayscale-[0.5]'
                            }
                        `}
                    >
                        {/* Header: Name and Status */}
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-900 leading-tight pr-2">{shop.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0 transition-colors duration-500 ${shop.is_open
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                {shop.is_open ? 'OPEN' : 'CLOSED'}
                            </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-slate-500 mb-6 font-medium text-sm">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="truncate">{shop.location}</span>
                        </div>

                        {/* Pricing Table */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">BW A4</p>
                                <p className="text-xl font-black text-slate-900">₹{shop.price_bw_a4}<span className="text-[10px] font-bold text-slate-400 ml-1">/pg</span></p>
                            </div>
                            <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/30">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Color A4</p>
                                <p className="text-xl font-black text-indigo-600">₹{shop.price_color_a4}<span className="text-[10px] font-bold text-indigo-400 ml-1">/pg</span></p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => {
                                if (draftId) {
                                    navigate(`/student/print-setup?draftId=${draftId}&shopId=${shop.id}`);
                                } else {
                                    document.getElementById('shop-upload').click();
                                }
                            }}
                            disabled={!shop.is_open || isUploading}
                            className={`
                                w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2
                                ${shop.is_open
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-[0.98]'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }
                            `}
                        >
                            {shop.is_open ? (
                                <>
                                    <span>Select Shop</span>
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Shop Closed</span>
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {shops.length === 0 && (
                <div className="text-center py-24 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No active shops found on campus.</p>
                </div>
            )}
        </div>
    );
}
