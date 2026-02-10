import { useState } from 'react';
import { MapPin, Clock, Star, TrendingUp, ChevronRight, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockShops = [
    {
        id: '1',
        name: 'Campus Copy Center',
        distance: '0.2 km',
        rating: 4.8,
        reviews: 342,
        status: 'open',
        queue: 3,
        estimatedTime: '10-15 min',
        pricing: { bwA4: 2, colorA4: 8 },
        location: 'Main Campus, Near Library',
    },
    {
        id: '2',
        name: 'QuickPrint Express',
        distance: '0.5 km',
        rating: 4.6,
        reviews: 218,
        status: 'open',
        queue: 1,
        estimatedTime: '5-10 min',
        pricing: { bwA4: 1.5, colorA4: 7 },
        location: 'Student Center, Ground Floor',
    },
    {
        id: '3',
        name: 'PrintHub Pro',
        distance: '0.8 km',
        rating: 4.9,
        reviews: 456,
        status: 'busy',
        queue: 8,
        estimatedTime: '25-30 min',
        pricing: { bwA4: 2.5, colorA4: 9 },
        location: 'Academic Block B',
    },
    {
        id: '4',
        name: 'EconoPrint',
        distance: '1.2 km',
        rating: 4.3,
        reviews: 124,
        status: 'open',
        queue: 2,
        estimatedTime: '10-15 min',
        pricing: { bwA4: 1, colorA4: 6 },
        location: 'Off-Campus, Market Road',
    },
    {
        id: '5',
        name: 'Elite Printing Services',
        distance: '1.5 km',
        rating: 4.7,
        reviews: 289,
        status: 'closed',
        queue: 0,
        estimatedTime: 'Opens at 9 AM',
        pricing: { bwA4: 3, colorA4: 10 },
        location: 'Commercial Complex',
    },
];

export function ShopsPricing() {
    const navigate = useNavigate();
    const [selectedShop, setSelectedShop] = useState(null);

    // Decision Assistance: Find best options
    const bestQueueId = [...mockShops].sort((a, b) => a.queue - b.queue)[0].id;
    const bestPriceId = [...mockShops].sort((a, b) => a.pricing.bwA4 - b.pricing.bwA4)[0].id;

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'busy':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'closed':
                return 'bg-red-100 text-red-700 border-red-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'open': return 'Perfect Timing';
            case 'busy': return 'Brief Wait';
            case 'closed': return 'Currently Closed';
            default: return status;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Simple Page Header */}
            <div className="px-6 pt-4 pb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Nearby Print Shops
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1">
                    Choose a shop based on price, distance, and current queue time
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pb-12">
                {mockShops.map((shop) => (
                    <div
                        key={shop.id}
                        className={`
              bg-white border-2 rounded-3xl p-8 transition-all duration-500 cursor-pointer relative overflow-hidden group
              ${selectedShop === shop.id
                                ? 'border-indigo-600 bg-indigo-50/10 shadow-[0_20px_50px_rgba(79,70,229,0.15)] ring-4 ring-indigo-600/5'
                                : 'border-gray-50 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1'
                            }
            `}
                        onClick={() => setSelectedShop(shop.id)}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl transition-opacity duration-700 ${selectedShop === shop.id ? 'bg-indigo-600/10 opacity-100' : 'bg-indigo-600/0 opacity-0'}`} />

                        <div className="flex items-start justify-between mb-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-4 py-1.5 border rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(shop.status)}`}>
                                        {getStatusText(shop.status)}
                                    </span>
                                    {shop.id === bestQueueId && shop.status !== 'closed' && (
                                        <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 animate-pulse">
                                            Fastest
                                        </span>
                                    )}
                                    {shop.id === bestPriceId && (
                                        <span className="px-3 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">
                                            Best Value
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{shop.name}</h3>
                                <div className="flex items-center gap-2 mt-2 font-bold text-gray-500 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                                        <MapPin className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <span className="truncate">{shop.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm">
                                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900">{shop.rating}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{shop.reviews} verified</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900">{shop.distance}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Travel time</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-all group-hover:bg-white group-hover:border-indigo-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">B&W A4 Standard</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-2xl font-black text-gray-900">₹{shop.pricing.bwA4}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">/ pg</p>
                                </div>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-all group-hover:bg-white group-hover:border-indigo-100">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Color A4 High-Res</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-2xl font-black text-gray-900 text-indigo-600">₹{shop.pricing.colorA4}</p>
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase">/ pg</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Clock className="w-5 h-5 text-indigo-600 animate-pulse" />
                                </div>
                                <span className="text-sm font-bold text-indigo-900">
                                    {shop.queue} {shop.queue === 1 ? 'Job' : 'Jobs'} Processing
                                </span>
                            </div>
                            <div className="px-3 py-1 bg-white rounded-lg border border-indigo-100 shadow-sm">
                                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">~{shop.estimatedTime}</span>
                            </div>
                        </div>

                        {selectedShop === shop.id && shop.status !== 'closed' && (
                            <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/student/cart');
                                    }}
                                    className="w-full px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.15em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    <span>Select this shop</span>
                                    <ChevronRight className="w-5 h-5 animate-pulse" />
                                </button>
                            </div>
                        )}

                        {selectedShop === shop.id && shop.status === 'closed' && (
                            <div className="mt-8 p-6 bg-red-50 border-2 border-red-100 rounded-2xl text-center">
                                <p className="text-sm font-black text-red-700 uppercase tracking-widest">
                                    Orders Paused • Check back soon
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
