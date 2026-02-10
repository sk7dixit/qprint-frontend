import { useState } from 'react';
import { Upload, FileText, File, Image as ImageIcon, FileArchive, X, CheckCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UploadPrepare() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (fileList) => {
        const newFiles = Array.from(fileList).map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            pageCount: Math.floor(Math.random() * 50) + 1, // Mock page count
            status: 'uploading',
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        // Simulate upload and conversion
        newFiles.forEach((file) => {
            setTimeout(() => {
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === file.id ? { ...f, status: 'converting' } : f
                    )
                );

                setTimeout(() => {
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === file.id ? { ...f, status: 'ready' } : f
                        )
                    );
                }, 1500);
            }, 1000);
        });
    };

    const removeFile = (id) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (type) => {
        if (type.includes('pdf')) return <File className="w-8 h-8 text-red-500" />;
        if (type.includes('word') || type.includes('document')) return <FileText className="w-8 h-8 text-blue-500" />;
        if (type.includes('image')) return <ImageIcon className="w-8 h-8 text-green-500" />;
        return <FileArchive className="w-8 h-8 text-gray-500" />;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload & Prepare Files</h2>

                <form
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div
                        className={`
              relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300
              ${dragActive ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]' : 'border-indigo-100 hover:border-indigo-300 hover:bg-gray-50'}
            `}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            multiple
                            onChange={handleChange}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Drop files here or click to upload</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Supports: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG
                        </p>
                        <button
                            type="button"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                            Choose Files
                        </button>
                    </div>
                </form>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">!</span>
                        Non-PDF files will be automatically converted to PDF format for printing.
                    </p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                        <span>Uploaded Files</span>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold">{files.length}</span>
                    </h3>

                    <div className="space-y-4">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl transition-all hover:bg-white hover:border-indigo-200"
                            >
                                <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                                    {getFileIcon(file.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{file.name}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        <span>{formatFileSize(file.size)}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>{file.pageCount} pages</span>
                                    </div>

                                    {/* Status */}
                                    {file.status === 'uploading' && (
                                        <div className="mt-3">
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 animate-[pulse_1.5s_infinite] w-1/2 rounded-full" />
                                            </div>
                                            <p className="text-[10px] text-indigo-600 font-bold mt-1.5 uppercase tracking-widest">Uploading...</p>
                                        </div>
                                    )}

                                    {file.status === 'converting' && (
                                        <div className="mt-3">
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 animate-[pulse_1.5s_infinite] w-3/4 rounded-full" />
                                            </div>
                                            <p className="text-[10px] text-blue-600 font-bold mt-1.5 uppercase tracking-widest">Converting to PDF...</p>
                                        </div>
                                    )}

                                    {file.status === 'ready' && (
                                        <div className="flex items-center gap-2 mt-3 text-emerald-600">
                                            <CheckCircle className="w-4 h-4" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Ready to print</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {file.status === 'ready' && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="p-2.5 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all"
                                                title="Preview"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => navigate('/student/editor')}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-xs"
                                            >
                                                Edit PDF
                                            </button>
                                            <button
                                                onClick={() => navigate('/student/shops')}
                                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all text-xs"
                                            >
                                                Print
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => removeFile(file.id)}
                                        className="p-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
