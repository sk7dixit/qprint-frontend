
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../shared/AuthContext';
import { Loader2, AlertCircle, CheckCircle, FileText, ArrowRight, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "../lib/supabaseClient";

export default function Preview() {
    const { draftId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [status, setStatus] = useState('loading'); // loading, converting, ready, error
    const [draft, setDraft] = useState(null);
    const [signedPdfUrl, setSignedPdfUrl] = useState(null);
    const [pollCount, setPollCount] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    // Polling Logic
    useEffect(() => {
        let intervalId;

        const checkStatus = async () => {
            if (!user?.token) return;
            try {
                const response = await axios.get(`/api/print-drafts/${draftId}/status`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });

                const data = response.data;
                setDraft(data);

                if (data.status === 'ready_for_preview') {
                    setStatus('ready');
                    clearInterval(intervalId);

                    if (data.converted_pdf_url) {
                        if (data.converted_pdf_url.startsWith('http')) {
                            setSignedPdfUrl(data.converted_pdf_url);
                        } else {
                            const { data: signedData, error } = await supabase.storage
                                .from('uploads')
                                .createSignedUrl(data.converted_pdf_url, 3600); // 1 hour

                            if (error) console.error("Error signing URL:", error);
                            else setSignedPdfUrl(signedData.signedUrl);
                        }
                    }

                } else if (data.status === 'conversion_failed') {
                    setStatus('error');
                    clearInterval(intervalId);
                } else {
                    setStatus('converting');
                }

            } catch (error) {
                console.error("Polling error:", error);
                if (error.response && error.response.status >= 400) {
                    setStatus('error');
                    clearInterval(intervalId);
                }
            }
        };

        if (user) {
            checkStatus();

            intervalId = setInterval(() => {
                setPollCount(prev => prev + 1);
                checkStatus();
            }, 2000);
        }

        if (pollCount > 60) {
            clearInterval(intervalId);
            setStatus('error');
        }

        return () => clearInterval(intervalId);
    }, [draftId, pollCount, user]);


    // Action Handlers
    const handleEdit = () => {
        navigate(`/student/editor/${draftId}`);
    };

    const handleReplace = async () => {
        if (!window.confirm("Are you sure? This will delete the current file.")) return;

        setActionLoading(true);
        try {
            await axios.delete(`/api/print-drafts/${draftId}`, {
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            toast.success("File deleted. Please upload a new one.");
            navigate('/student/dashboard');
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete file. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleContinue = async () => {
        setActionLoading(true);
        try {
            await axios.patch(`/api/print-drafts/${draftId}/status`, {
                status: 'ready_for_print'
            }, {
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            navigate(`/student/shops?draftId=${draftId}`);
        } catch (error) {
            console.error("Update status error:", error);
            toast.error("Failed to proceed. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-5xl min-h-screen flex items-center justify-center">

            {status === 'loading' || status === 'converting' ? (
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Preparing your document</CardTitle>
                        <CardDescription>We are converting your file to a print-safe PDF.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8 space-y-6">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <div className="w-full space-y-2">
                            <Progress value={status === 'converting' ? 66 : 33} />
                            <p className="text-center text-sm text-muted-foreground">
                                {status === 'loading' ? 'Initializing...' : 'Converting...'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : status === 'ready' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full h-full">
                    {/* Preview Column */}
                    <Card className="lg:col-span-2 flex flex-col h-[80vh]">
                        <CardHeader className="py-4">
                            <CardTitle>File Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 bg-muted/20 p-4 rounded-md overflow-hidden relative">
                            {signedPdfUrl ? (
                                <iframe
                                    src={`${signedPdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                    className="w-full h-full border rounded shadow-sm bg-white"
                                    title="PDF Preview"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary & Decision Column */}
                    <Card className="flex flex-col h-[80vh]">
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                            <CardDescription>Review before proceeding</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 flex-1">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-secondary/10">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-primary/20 p-2 rounded-full">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{draft?.original_file_name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Print-ready PDF</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 border rounded-lg text-center">
                                        <p className="text-xs text-muted-foreground">Pages</p>
                                        <p className="text-xl font-bold">{draft?.page_count}</p>
                                    </div>
                                    <div className="p-3 border rounded-lg text-center">
                                        <p className="text-xs text-muted-foreground">Size</p>
                                        <p className="text-xl font-bold">A4</p>
                                    </div>
                                </div>
                            </div>

                            <Alert>
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Ready for Print</AlertTitle>
                                <AlertDescription>
                                    Your file has been successfully converted and is ready for the shop.
                                </AlertDescription>
                            </Alert>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-3 pt-6">
                            <Button
                                onClick={handleContinue}
                                className="w-full h-12 text-lg"
                                disabled={actionLoading}
                            >
                                {actionLoading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2 h-5 w-5" />}
                                Continue to Shop
                            </Button>

                            <div className="grid grid-cols-2 gap-3 w-full">
                                <Button
                                    variant="outline"
                                    onClick={handleEdit}
                                    disabled={actionLoading}
                                >
                                    <Edit className="mr-2 h-4 w-4" /> Edit PDF
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                    onClick={handleReplace}
                                    disabled={actionLoading}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Replace
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            ) : (
                <Card className="w-full max-w-md border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center">
                            <AlertCircle className="mr-2" /> Conversion Failed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>We couldn't process your file. This usually happens with corrupted files or unsupported formats.</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => navigate('/student/dashboard')} variant="secondary" className="w-full">
                            Try Again
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
