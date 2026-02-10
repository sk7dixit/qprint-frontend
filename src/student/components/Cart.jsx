import { useState } from 'react';
import { FileText, Store, MapPin, Minus, Plus, ChevronLeft, CreditCard, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Cart() {
    const navigate = useNavigate();
    const [config, setConfig] = useState({
        colorMode: 'bw',
        paperSize: 'A4',
        orientation: 'portrait',
        sided: 'single',
        copies: 1,
        binding: 'none',
    });

    const fileName = 'Data_Structures_Notes.pdf';
    const pageCount = 42;
    const shopName = 'Campus Copy Center';
    const shopLocation = 'Main Campus, Near Library';

    const pricing = {
        bw: 2,
        color: 8,
    };

    const bindingCost = {
        none: 0,
        staple: 5,
        spiral: 30,
    };

    const pricePerPage = config.colorMode === 'bw' ? pricing.bw : pricing.color;
    const totalPages = config.sided === 'double' ? Math.ceil(pageCount / 2) : pageCount;
    const subtotal = pricePerPage * totalPages * config.copies;
    const bindingCharge = bindingCost[config.binding];
    const total = subtotal + bindingCharge;

    const updateCopies = (delta) => {
        setConfig((prev) => ({
            ...prev,
            copies: Math.max(1, Math.min(100, prev.copies + delta)),
        }));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Cart / Print Summary</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            Review and configure your technical specifications
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/student/shops')}
                        className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all border border-gray-100 flex items-center gap-2 active:scale-95"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Change Shop
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-lg shadow-indigo-50">
                                    <FileText className="w-8 h-8 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{fileName}</h3>
                                    <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">{pageCount} total pages</p>
                                </div>
                            </div>
                            <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all border border-red-50 active:scale-95">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                <Store className="w-6 h-6 text-gray-700" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{shopName}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{shopLocation}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-border rounded-2xl p-8 space-y-10 shadow-sm">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Print Engine Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Color Mode */}
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest">Chroma Accuracy</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setConfig({ ...config, colorMode: 'bw' })}
                                        className={`p-5 border-2 rounded-2xl transition-all text-center ${config.colorMode === 'bw'
                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                            : 'border-gray-50 hover:bg-gray-50 hover:border-gray-100'
                                            }`}
                                    >
                                        <p className="font-bold text-gray-900">Grayscale</p>
                                        <p className="text-[10px] font-black text-gray-400 mt-1">₹{pricing.bw}/pg</p>
                                    </button>
                                    <button
                                        onClick={() => setConfig({ ...config, colorMode: 'color' })}
                                        className={`p-5 border-2 rounded-2xl transition-all text-center ${config.colorMode === 'color'
                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                            : 'border-gray-50 hover:bg-gray-50 hover:border-gray-100'
                                            }`}
                                    >
                                        <p className="font-bold text-gray-900">Digital Color</p>
                                        <p className="text-[10px] font-black text-indigo-500 mt-1">₹{pricing.color}/pg</p>
                                    </button>
                                </div>
                            </div>

                            {/* Sided */}
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest">Page Duplexing</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setConfig({ ...config, sided: 'single' })}
                                        className={`p-5 border-2 rounded-2xl transition-all text-center ${config.sided === 'single'
                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                            : 'border-gray-50 hover:bg-gray-50 hover:border-gray-100'
                                            }`}
                                    >
                                        <p className="font-bold text-gray-900">Standard</p>
                                        <p className="text-[10px] font-black text-gray-400 mt-1">Single Sided</p>
                                    </button>
                                    <button
                                        onClick={() => setConfig({ ...config, sided: 'double' })}
                                        className={`p-5 border-2 rounded-2xl transition-all text-center ${config.sided === 'double'
                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                            : 'border-gray-50 hover:bg-gray-50 hover:border-gray-100'
                                            }`}
                                    >
                                        <p className="font-bold text-gray-900">Eco-Duplex</p>
                                        <p className="text-[10px] font-black text-emerald-600 mt-1 tracking-tighter">Saves 50% Paper</p>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Paper Size */}
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest">Dimension Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['A4', 'A3', 'Letter']).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setConfig({ ...config, paperSize: size })}
                                            className={`p-4 border-2 rounded-2xl transition-all text-center font-bold text-sm ${config.paperSize === size
                                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-sm'
                                                : 'border-gray-50 hover:bg-gray-50 text-gray-500'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Binding */}
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest">Finishing / Binding</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['none', 'staple', 'spiral']).map((binding) => (
                                        <button
                                            key={binding}
                                            onClick={() => setConfig({ ...config, binding })}
                                            className={`p-4 border-2 rounded-2xl transition-all text-center ${config.binding === binding
                                                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                                : 'border-gray-50 hover:bg-gray-50'
                                                }`}
                                        >
                                            <p className="font-bold text-gray-900 text-xs capitalize">{binding}</p>
                                            {bindingCost[binding] > 0 && (
                                                <p className="text-[10px] font-black text-gray-400 mt-1">+₹{bindingCost[binding]}</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Copies */}
                        <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-1">Bulk Volume</label>
                                <p className="text-xs text-gray-400 font-medium tracking-tight">Set requested number of duplicates</p>
                            </div>
                            <div className="flex items-center gap-6 p-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                                <button
                                    onClick={() => updateCopies(-1)}
                                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm active:scale-90"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <div className="text-center w-8">
                                    <span className="text-2xl font-black text-gray-900">{config.copies}</span>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">QTY</p>
                                </div>
                                <button
                                    onClick={() => updateCopies(1)}
                                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm active:scale-90"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white border border-border rounded-3xl p-8 space-y-6 sticky top-[80px] shadow-xl shadow-gray-200/50">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">System Invoice Breakdown</h3>

                        <div className="space-y-4 py-6 border-y border-gray-50">
                            <div className="flex items-center justify-between font-bold">
                                <span className="text-gray-400 text-sm">Processed Sheets</span>
                                <span className="text-gray-900">{totalPages} <small className="text-[10px] text-gray-300">({pageCount} originals)</small></span>
                            </div>
                            <div className="flex items-center justify-between font-bold">
                                <span className="text-gray-400 text-sm">Visual Specs</span>
                                <span className="text-indigo-600 text-sm uppercase">{config.colorMode === 'bw' ? 'B/W' : 'Digital Color'}</span>
                            </div>
                            <div className="flex items-center justify-between font-bold">
                                <span className="text-gray-400 text-sm">Final Units</span>
                                <span className="text-gray-900">{config.copies} Unit{config.copies > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center justify-between font-bold pt-4">
                                <span className="text-gray-400 text-sm">Print Fabrication</span>
                                <span className="text-gray-900 font-black">₹{subtotal.toFixed(2)}</span>
                            </div>
                            {bindingCharge > 0 && (
                                <div className="flex items-center justify-between font-bold">
                                    <span className="text-gray-400 text-sm">Finishing ({config.binding})</span>
                                    <span className="text-gray-900 font-black">₹{bindingCharge.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <span className="font-black text-gray-900 uppercase tracking-widest">Net Payable</span>
                            <span className="text-4xl font-black text-indigo-600 leading-none tracking-tight">₹{total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={() => navigate('/student/orders')}
                            className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <CreditCard className="w-5 h-5" />
                            <span>Confirm Checkout</span>
                        </button>

                        <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                            <p className="text-[10px] font-bold text-indigo-700 leading-relaxed text-center uppercase tracking-widest">
                                Payment verified at pickup station after physical validation
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
