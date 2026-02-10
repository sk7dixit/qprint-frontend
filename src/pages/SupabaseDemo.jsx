
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Auth from '../auth/Auth';
import FileUpload from '../storage/FileUpload';
import FilePreview from '../storage/FilePreview';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SupabaseDemo() {
    const [session, setSession] = useState(null);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchFiles(session.user.id);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchFiles(session.user.id);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchFiles = async (userId) => {
        const { data, error } = await supabase
            .from('files')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching files:', error);
        else setFiles(data || []);
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold text-center">Supabase Integration Demo</h1>

            <Auth />

            {session && (
                <>
                    <Separator />
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Upload File</h2>
                            <FileUpload session={session} onUploadSuccess={() => fetchFiles(session.user.id)} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Your Files</h2>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Files</CardTitle>
                                    <CardDescription>Recent uploads</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {files.length === 0 ? (
                                        <p className="text-muted-foreground">No files uploaded yet.</p>
                                    ) : (
                                        <ul className="space-y-4">
                                            {files.map((file) => (
                                                <li key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                                                    <span className="truncate max-w-[200px]" title={file.filename}>{file.filename}</span>
                                                    <FilePreview filePath={file.path} />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
