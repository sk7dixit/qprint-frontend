
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../shared/AuthContext';
import { Loader2, ArrowRight, CreditCard, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function PrintSetup() {
    const [searchParams] = useSearchParams();
    const [shop, setShop] = useState(null);
    const { user } = useAuth();

    // Print Options State
    const [colorMode, setColorMode] = useState('bw'); // 'bw' or 'color'
    const [copies, setCopies] = useState(1);
    const [doubleSided, setDoubleSided] = useState(false); // 'single' or 'double'

    useEffect(() => {
        if (!draftId || !shopId) {
            toast.error("Invalid checkout session");
            navigate('/student/dashboard');
            return;
        }

        const fetchData = async () => {
            if (!user?.token) return;
            try {
                // Fetch Draft
                const draftRes = await axios.get(`/api/print-drafts/${draftId}/status`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setDraft(draftRes.data);

                // Fetch Shop
                const shopsRes = await axios.get(`/api/print-jobs/shops`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const foundShop = shopsRes.data.find(s => s.id === shopId);

                if (!foundShop) throw new Error("Shop not found");
                setShop(foundShop);

                setLoading(false);
            } catch (error) {
                console.error("Checkout init error:", error);
                toast.error("Failed to load checkout details");
                navigate('/student/dashboard');
            }
        };

        fetchData();
    }, [draftId, shopId, navigate]);

    // Pricing Calculation (Frontend estimation, verified on backend)
    const calculateTotal = () => {
        if (!draft || !shop) return 0;
        const pricePerPage = colorMode === 'color'
            ? (Number(shop.price_color_a4) || 8)
            : (Number(shop.price_bw_a4) || 2);

        return draft.page_count * pricePerPage * copies;
    };

    const handlePayment = async () => {
        if (!user?.token) return;
        // Re-check shop status mid-flow
        try {
            const shopsRes = await axios.get(`/api/print-jobs/shops`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const currentShop = shopsRes.data.find(s => s.id === shopId);
            if (!currentShop?.is_open) {
                toast.error("This shop is currently closed. Please select another shop.");
                navigate('/student/shops');
                return;
            }
        } catch (e) {
            console.error("Status re-check failed", e);
        }

        setProcessingPayment(true);
        try {
            // 1. Create Print Job
            const createRes = await axios.post('/api/print-jobs/create', {
                draft_id: draftId,
                shop_id: shopId,
                print_options: {
                    color: colorMode,
                    copies: copies,
                    sides: doubleSided ? 'double' : 'single'
                }
            }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            const { printJob } = createRes.data;
            const printJobId = printJob.id;

            // 2. Simulate Payment Gateway (Wait 2s)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 3. Verify Payment
            const verifyRes = await axios.post('/api/print-jobs/verify-payment', {
                printJobId: printJobId,
                paymentId: `pay_${Date.now()}` // Mock ID
            }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (verifyRes.data.success) {
                toast.success("Payment Successful! Job sent to shop.");
                navigate('/student/print-history');
            } else {
                throw new Error("Payment verification failed");
            }

        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.response?.data?.error || "Payment failed. Please try again.");
        } finally {
            setProcessingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-slate-50 items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Options */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
                        <p className="text-slate-500">Configure your print and complete payment</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Print Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Color Mode */}
                            <div className="space-y-3">
                                <Label>Color Mode</Label>
                                <RadioGroup defaultValue="bw" value={colorMode} onValueChange={setColorMode} className="grid grid-cols-2 gap-4">
                                    <div>
                                        <RadioGroupItem value="bw" id="bw" className="peer sr-only" />
                                        <Label
                                            htmlFor="bw"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                            <Printer className="mb-3 h-6 w-6" />
                                            <span className="font-semibold">B&W</span>
                                            <span className="text-xs text-muted-foreground">₹{shop?.price_bw_a4 || 2} / page</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="color" id="color" className="peer sr-only" />
                                        <Label
                                            htmlFor="color"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                            <Printer className="mb-3 h-6 w-6 text-indigo-500" />
                                            <span className="font-semibold">Color</span>
                                            <span className="text-xs text-muted-foreground">₹{shop?.price_color_a4 || 8} / page</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Copies */}
                            <div className="space-y-3">
                                <Label>Copies</Label>
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" size="icon" onClick={() => setCopies(Math.max(1, copies - 1))}>-</Button>
                                    <span className="w-12 text-center font-bold text-lg">{copies}</span>
                                    <Button variant="outline" size="icon" onClick={() => setCopies(copies + 1)}>+</Button>
                                </div>
                            </div>

                            {/* Double Sided */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Double Sided</Label>
                                    <p className="text-sm text-muted-foreground">Print on both sides of the paper</p>
                                </div>
                                <Switch
                                    checked={doubleSided}
                                    onCheckedChange={setDoubleSided}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Summary & Payment */}
                <div className="space-y-6">
                    <Card className="bg-white shadow-lg border-primary/20">
                        <CardHeader className="bg-slate-50/50 border-b">
                            <CardTitle>Print Job Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {/* File Info */}
                            <div className="flex items-start gap-4 pb-4 border-b">
                                <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm line-clamp-1">{draft?.original_file_name}</h4>
                                    <p className="text-xs text-muted-foreground">{draft?.page_count} Pages • PDF</p>
                                </div>
                            </div>

                            {/* Shop Info */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shop:</span>
                                <span className="font-medium">{shop?.name}</span>
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-sm">
                                    <span>Rate ({colorMode === 'bw' ? 'B&W' : 'Color'})</span>
                                    <span>₹{(colorMode === 'bw' ? shop?.price_bw_a4 : shop?.price_color_a4) || (colorMode === 'bw' ? '2.00' : '8.00')} x {draft?.page_count}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Copies</span>
                                    <span>x {copies}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-black text-2xl text-primary">₹{calculateTotal().toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20"
                                onClick={handlePayment}
                                disabled={processingPayment}
                            >
                                {processingPayment ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                                Pay ₹{calculateTotal().toFixed(2)}
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span>Secure simulated payment</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
