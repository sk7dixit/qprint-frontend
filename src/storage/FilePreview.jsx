
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Download, Eye } from 'lucide-react';

export default function FilePreview({ filePath }) {
    const [loading, setLoading] = useState(false);
    const [signedUrl, setSignedUrl] = useState(null);

    const getSignedUrl = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.storage
                .from('uploads')
                .createSignedUrl(filePath, 300); // Valid for 5 minutes

            if (error) {
                throw error;
            }

            setSignedUrl(data.signedUrl);
            toast.success('Signed URL generated!');
        } catch (error) {
            toast.error('Error downloading file: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {signedUrl ? (
                <Button variant="outline" asChild>
                    <a href={signedUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="mr-2 h-4 w-4" /> Open File
                    </a>
                </Button>
            ) : (
                <Button onClick={getSignedUrl} disabled={loading} variant="secondary">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    <span className="ml-2">Get Link</span>
                </Button>
            )}
        </div>
    );
}
