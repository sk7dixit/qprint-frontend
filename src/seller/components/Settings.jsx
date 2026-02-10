import { useState, useEffect } from 'react';
import { Circle, Bell, Zap, Palette, Printer, Save, Loader2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../shared/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

export default function Settings() {
    const { shop, fetchShopDetails, loadingShop } = useOutletContext();
    const { user } = useAuth();
    const [prices, setPrices] = useState({
        price_bw_a4: 2,
        price_color_a4: 8
    });
    const [savingStatus, setSavingStatus] = useState(false);
    const [savingPricing, setSavingPricing] = useState(false);

    useEffect(() => {
        if (shop) {
            setPrices({
                price_bw_a4: shop.price_bw_a4 || 2,
                price_color_a4: shop.price_color_a4 || 8
            });
        }
    }, [shop]);

    const handleToggleStatus = async () => {
        if (!shop) return;
        setSavingStatus(true);
        try {
            if (!user?.token) return;
            await axios.patch(`/api/shops/${shop.id}/status`, {
                is_open: !shop.is_open
            }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            toast.success(`Shop is now ${!shop.is_open ? 'OPEN' : 'CLOSED'}`);
            await fetchShopDetails(); // Refresh global shop state
        } catch (error) {
            toast.error("Failed to update shop status");
        } finally {
            setSavingStatus(false);
        }
    };

    const handleUpdatePricing = async () => {
        if (!shop) return;
        setSavingPricing(true);
        try {
            if (!user?.token) return;
            await axios.patch(`/api/shops/${shop.id}/pricing`, {
                price_bw_a4: prices.price_bw_a4,
                price_color_a4: prices.price_color_a4
            }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            toast.success("Pricing updated successfully");
            await fetchShopDetails();
        } catch (error) {
            toast.error("Failed to update pricing");
        } finally {
            setSavingPricing(false);
        }
    };

    if (loadingShop) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="size-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">Settings</h1>
                <p className="text-gray-500 font-medium">Configure your shop's availability and pricing</p>
            </div>

            {/* Shop Availability */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-6">
                        <div className={`p-4 rounded-2xl ${shop?.is_open ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            <Circle className={`size-8 fill-current ${shop?.is_open ? 'text-emerald-500' : 'text-red-500'}`} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Shop Status</h2>
                            <p className="text-gray-500 font-medium max-w-md">
                                {shop?.is_open
                                    ? 'Your shop is currently accepting new print jobs from students.'
                                    : 'Your shop is closed. Students will see you as closed and cannot start new jobs.'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleStatus}
                        disabled={savingStatus}
                        className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all focus:outline-none ring-offset-2 focus:ring-2 ${shop?.is_open ? 'bg-emerald-500 focus:ring-emerald-500' : 'bg-slate-300 focus:ring-slate-400'
                            }`}
                    >
                        {savingStatus && <Loader2 className="absolute inset-x-0 mx-auto size-4 animate-spin text-white z-10" />}
                        <span className={`inline-block size-8 transform rounded-full bg-white transition-transform shadow-sm ${shop?.is_open ? 'translate-x-[44px]' : 'translate-x-[4px]'
                            }`} />
                    </button>
                </div>
            </div>

            {/* Pricing Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                <div className="flex items-center gap-3 mb-8">
                    <Printer className="size-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Print Pricing (A4)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* BW Pricing */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">B&W Rate (₹)</label>
                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                            <input
                                type="number"
                                value={prices.price_bw_a4}
                                onChange={(e) => setPrices({ ...prices, price_bw_a4: e.target.value })}
                                className="bg-transparent text-2xl font-black text-slate-900 border-none outline-none w-full"
                            />
                            <span className="text-sm font-bold text-slate-400">/ pg</span>
                        </div>
                    </div>

                    {/* Color Pricing */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-blue-500 uppercase tracking-widest">Color Rate (₹)</label>
                        <div className="flex items-center gap-4 bg-blue-50/30 border border-blue-100/30 rounded-2xl p-4">
                            <input
                                type="number"
                                value={prices.price_color_a4}
                                onChange={(e) => setPrices({ ...prices, price_color_a4: e.target.value })}
                                className="bg-transparent text-2xl font-black text-blue-600 border-none outline-none w-full"
                            />
                            <span className="text-sm font-bold text-blue-400">/ pg</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleUpdatePricing}
                    disabled={savingPricing}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                >
                    {savingPricing ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
                    Save Pricing Changes
                </button>
            </div>

            {/* Note Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                <p className="text-sm font-medium text-blue-600 leading-relaxed">
                    <span className="font-bold">Pro Tip:</span> Your pricing and status updates are reflected instantly in the student-facing shop list. Setting a competitive price can help you attract more print jobs.
                </p>
            </div>
        </div>
    );
}
