import { useState } from 'react';
import { FileArchive, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Compression() {
    const navigate = useNavigate();
    const [compressionLevel, setCompressionLevel] = useState('medium');
    const [colorMode, setColorMode] = useState('color');
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressed, setCompressed] = useState(false);

    const originalSize = 8.4; // MB
    const compressionRates = {
        low: 0.85,
        medium: 0.60,
        high: 0.35,
    };

    const compressedSize = (originalSize * compressionRates[compressionLevel]).toFixed(2);
    const savings = ((1 - compressionRates[compressionLevel]) * 100).toFixed(0);

    const handleCompress = () => {
        setIsCompressing(true);
        setTimeout(() => {
            setIsCompressing(false);
            setCompressed(true);
        }, 2000);
    };

    const estimatedCost = {
        color: {
            original: 336, // 8.4MB = ~42 pages * 8 per page
            compressed: parseFloat(compressedSize) * 40,
        },
        bw: {
            original: 84,
            compressed: parseFloat(compressedSize) * 10,
        },
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">Optimization</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            Reduce file size and optimize for printing
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/student/editor')}
                            className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-100 shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>
                        {compressed && (
                            <button
                                onClick={() => navigate('/student/shops')}
                                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 animate-in slide-in-from-right-4 duration-500"
                            >
                                Continue to Shops
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-border rounded-2xl p-8 space-y-8 shadow-sm">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Compression Level</h3>
                            <div className="space-y-3">
                                {['low', 'medium', 'high'].map((level) => (
                                    <label
                                        key={level}
                                        className={`
                      flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all
                      ${level === compressionLevel
                                                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                                : 'border-gray-50 hover:bg-gray-50 hover:border-gray-100'}
                    `}
                                    >
                                        <input
                                            type="radio"
                                            name="compression"
                                            value={level}
                                            checked={compressionLevel === level}
                                            onChange={(e) => setCompressionLevel(e.target.value)}
                                            className="mt-1 w-4 h-4 text-indigo-600"
                                        />
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-900 capitalize flex items-center gap-2">
                                                {level === 'low' ? 'Low (Best Quality)' : level === 'medium' ? 'Medium' : 'High (Smallest)'}
                                                {level === 'medium' && (
                                                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                                                        Best
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">
                                                {level === 'low' ? 'Minimal footprint' : level === 'medium' ? 'Balanced optimization' : 'Deep compression'}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Color Mode</h3>
                            <div className="space-y-3">
                                {['color', 'bw'].map((mode) => (
                                    <label
                                        key={mode}
                                        className={`
                      flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all
                      ${mode === colorMode
                                                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                                : 'border-gray-50 hover:bg-gray-50 hover:border-gray-100'}
                    `}
                                    >
                                        <input
                                            type="radio"
                                            name="color"
                                            value={mode}
                                            checked={colorMode === mode}
                                            onChange={(e) => setColorMode(e.target.value)}
                                            className="w-4 h-4 text-indigo-600"
                                        />
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-900 capitalize">
                                                {mode === 'color' ? 'Full Color' : 'Black & White'}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">
                                                {mode === 'color' ? 'High definition' : 'Budget friendly'}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview & Results */}
                <div className="lg:col-span-2 space-y-6">
                    {/* File Info */}
                    <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shadow-lg shadow-indigo-50">
                                <FileText className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Data_Structures_Notes.pdf</h3>
                                <p className="text-sm text-gray-500 font-medium">Original Page Count: 42 pages</p>
                            </div>
                        </div>

                        {/* Size Comparison */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-200/20 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-125 duration-500" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Original Size</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-4xl font-black text-gray-900 leading-none">{originalSize}</p>
                                    <p className="text-sm font-bold text-gray-500 uppercase">MB</p>
                                </div>
                            </div>

                            <div className="p-6 bg-emerald-50 border-2 border-emerald-100 rounded-2xl relative overflow-hidden group shadow-lg shadow-emerald-50">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/20 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-125 duration-500" />
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">After Optimization</p>
                                <div className="flex items-baseline gap-1 py-1">
                                    <p className="text-4xl font-black text-emerald-700 leading-none">{compressedSize}</p>
                                    <p className="text-sm font-bold text-emerald-600 uppercase">MB</p>
                                </div>
                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-emerald-100">
                                    <span className="animate-pulse">↓</span> Saved {savings}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cost Estimate */}
                    <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Cost Impact Evaluation</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <div>
                                    <p className="font-bold text-gray-500">Traditional Print</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">
                                        Standard density processing
                                    </p>
                                </div>
                                <p className="text-2xl font-black text-gray-400">
                                    ₹{colorMode === 'color' ? estimatedCost.color.original : estimatedCost.bw.original}
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 rounded-2xl shadow-xl shadow-emerald-50">
                                <div>
                                    <p className="font-black text-emerald-800 text-lg uppercase tracking-tight">Optimized Value</p>
                                    <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-black mt-1">
                                        Smart-ink efficient processing
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-emerald-800">
                                        ₹{Math.round(colorMode === 'color' ? estimatedCost.color.compressed : estimatedCost.bw.compressed)}
                                    </p>
                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
                                        Est. Savings: ₹{Math.round((colorMode === 'color' ? estimatedCost.color.original : estimatedCost.bw.original) - (colorMode === 'color' ? estimatedCost.color.compressed : estimatedCost.bw.compressed))}
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                <p className="text-sm text-indigo-700 font-bold flex items-center gap-3">
                                    <span className="w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-xs shrink-0">💡</span>
                                    {colorMode === 'color' ? 'Tip: Switching to Black & White can save up to 75% on printing costs today.' : 'Smart choice! You\'re using the most cost-effective printing configuration.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                        {!compressed ? (
                            <button
                                onClick={handleCompress}
                                disabled={isCompressing}
                                className="w-full px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {isCompressing ? (
                                    <>
                                        <FileArchive className="w-6 h-6 animate-[spin_3s_linear_infinite]" />
                                        <span>Optimizing Density...</span>
                                    </>
                                ) : (
                                    <>
                                        <FileArchive className="w-6 h-6" />
                                        <span>Apply Smart Optimization</span>
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
                                <button className="px-6 py-4 bg-gray-50 text-gray-700 border border-gray-100 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-md shadow-gray-100">
                                    <Download className="w-5 h-5" />
                                    Download Optimized
                                </button>
                                <button
                                    onClick={() => navigate('/student/shops')}
                                    className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200 active:scale-[0.98]"
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
