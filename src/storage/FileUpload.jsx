
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload } from 'lucide-react';

export default function FileUpload({ session, onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            setUploading(true);

            if (!file) {
                toast.error('You must select an image to upload.');
                return;
            }

            if (!session) {
                toast.error('You must be logged in to upload files.');
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('uploads')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Insert metadata into DB
            const { error: dbError } = await supabase.from('files').insert({
                user_id: session.user.id,
                path: filePath,
                filename: file.name
            });

            if (dbError) {
                console.error('Error inserting into DB:', dbError);
                // Optional: decide if you want to fail the whole op or just warn
                toast.warning('File uploaded but metadata save failed.');
            } else {
                toast.success('File uploaded successfully!');
                if (onUploadSuccess) onUploadSuccess();
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
            setFile(null);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input type="file" onChange={handleFileChange} disabled={uploading} />
                <Button onClick={handleUpload} disabled={uploading || !file}>
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" /> Upload
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
