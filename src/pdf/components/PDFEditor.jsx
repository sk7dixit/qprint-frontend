import { useEffect, useState, useRef } from 'react';
import {
    Type,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Save,
    Search,
    History,
    Upload,
    Undo2,
    Redo2,
    Bold,
    Italic,
    Underline,
    Minus,
    Plus,
    Type as TypeIcon,
    MousePointer2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../shared/AuthContext';
import * as pdfjsLib from 'pdfjs-dist';

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import PageView from './PageView';
import { usePdfStore } from '../store/pdfStore';
import { fetchDraft, uploadDraftFile, saveEditedPdf, spellFixPDF, formatPDFText } from '../services/pdfAPI';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export function PDFEditor() {
    const navigate = useNavigate();
    const { firebaseUser } = useAuth();
    const { draftId } = useParams();

    // Consume Store
    const {
        fileName, setFileName,
        pdfUrl, setPdfUrl,
        pages, setPages,
        isProcessing, setIsProcessing,
        isAILoading, setAILoading, activeAITask,
        showFindReplace, setShowFindReplace,
        showAISuggestions, setAISuggestions,
        replaceAllText, applyUpdatedPages,
        activeTool, setActiveTool,
        selectedText, setSelectedText,
        updateTextStyle,
        scale,
        undo, redo, history, future,
        pushToHistory
    } = usePdfStore();

    // Tools UI local state (these can remain local if they don't block other components)
    // but we'll keep them local for inputs
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [pdfPages, setPdfPages] = useState([]); // Holds PDF.js proxy objects locally

    // Find currently selected text properties
    const selectedTextItem = selectedText
        ? pages[selectedText.pageIndex]?.texts.find(t => t.id === selectedText.textId)
        : null;

    const handleStyleChange = (styleKey, value) => {
        if (!selectedText) return;
        pushToHistory();
        updateTextStyle(selectedText.pageIndex, selectedText.textId, { [styleKey]: value });
    };

    const toggleStyle = (styleKey, activeValue, inactiveValue) => {
        if (!selectedTextItem) return;
        const isCurrentlyActive = selectedTextItem[styleKey] === activeValue;
        handleStyleChange(styleKey, isCurrentlyActive ? inactiveValue : activeValue);
    };

    // Initial Load - Get Signed URL from Draft
    useEffect(() => {
        if (!draftId || !firebaseUser) return;

        const loadDraft = async () => {
            try {
                const token = await firebaseUser.getIdToken();
                const data = await fetchDraft(draftId, token);
                setFileName(data.fileName);
                setPdfUrl(data.signedUrl);
            } catch (error) {
                console.error("Failed to load draft:", error);
            }
        };
        loadDraft();
    }, [draftId, firebaseUser, setFileName, setPdfUrl]);

    // Render PDF Pages
    useEffect(() => {
        if (!pdfUrl) return;

        const loadPdf = async () => {
            try {
                const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
                const pageArray = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    pageArray.push(page);
                }

                setPdfPages(pageArray);
            } catch (err) {
                console.error("PDF Load error:", err);
            }
        };

        loadPdf();
    }, [pdfUrl]);

    const handleReplaceAll = () => {
        if (!findText.trim()) return;

        replaceAllText(findText, replaceText);

        setFindText('');
        setReplaceText('');
        setShowFindReplace(false);
    };

    const handleSpellFix = async () => {
        setAILoading(true, 'spell_fix');
        try {
            const token = await firebaseUser.getIdToken();
            const data = await spellFixPDF(draftId, pages, token);

            if (data.pages) {
                applyUpdatedPages(data.pages);
            }
        } catch (error) {
            console.error("Spell Fix Error:", error);
        } finally {
            setAILoading(false);
        }
    };

    const handleFormatClean = async () => {
        setAILoading(true, 'format_clean');
        try {
            const token = await firebaseUser.getIdToken();
            const data = await formatPDFText(draftId, pages, token);

            if (data.pages) {
                applyUpdatedPages(data.pages);
            }
        } catch (error) {
            console.error("Format Clean Error:", error);
        } finally {
            setAILoading(false);
        }
    };

    // Keyboard Shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const applyEdits = async () => {
        setIsProcessing(true);
        try {
            const token = await firebaseUser.getIdToken();
            const updatedTextItems = [];

            pages.forEach(page => {
                page.texts.forEach(text => {
                    if (text.modified && !text.isHidden && text.content.trim() !== "") {
                        updatedTextItems.push({
                            text: text.content,
                            x: text.originalX, // backend needs specific original coordinates
                            y: text.originalY,
                            size: text.originalSize,
                            pageNum: page.pageNumber,
                            isNew: text.isNew,
                            fontWeight: text.fontWeight,
                            fontStyle: text.fontStyle,
                            textDecoration: text.textDecoration,
                            color: text.color
                        });
                    }
                });
            });

            const data = await saveEditedPdf(draftId, updatedTextItems, token);

            if (data.success) {
                navigate(`/student/preview/${draftId}`);
            }
        } catch (error) {
            console.error("Save edits failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInitialUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !firebaseUser) return;
        setIsProcessing(true);
        try {
            const token = await firebaseUser.getIdToken();
            const data = await uploadDraftFile(file, token);
            navigate(`/student/editor/${data.draftId}`);
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!draftId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-100/50">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Structured PDF Editor</h1>
                        <p className="text-slate-500 font-medium">Click exactly over the document text to edit it in place!</p>
                    </div>

                    <div className="relative group">
                        <input type="file" onChange={handleInitialUpload} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={isProcessing} />
                        <div className="p-12 border-2 border-dashed border-indigo-200 rounded-[2.5rem] bg-white group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-all">
                            <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <p className="font-bold text-slate-600 group-hover:text-indigo-600">
                                {isProcessing ? 'Generating Layout...' : 'Drop file here or click to upload'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/student/dashboard')} className="text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors">Go back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-1px)] -m-6">
            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Tools Sidebar */}
                <aside className="w-64 border-r bg-slate-50/50 p-4 flex flex-col gap-6 shrink-0 overflow-y-auto w-1/4">
                    <section>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Core Tools</h3>
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => {
                                    setActiveTool(activeTool === 'select' ? 'add_text' : 'select');
                                    setSelectedText(null);
                                }}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all shadow-sm group border
                                    ${activeTool === 'add_text' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-200'}`}
                            >
                                {activeTool === 'add_text' ? <MousePointer2 className="size-4 text-indigo-500" /> : <TypeIcon className="size-4 text-slate-400 group-hover:text-indigo-500" />}
                                <span className="text-xs font-bold">{activeTool === 'add_text' ? 'Click on PDF to Add Text' : 'Add Text Box'}</span>
                            </button>

                            <button onClick={() => setShowFindReplace(true)} className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm group">
                                <Search className="size-4 text-slate-400 group-hover:text-indigo-500" />
                                <span className="text-xs font-bold">Find & Replace</span>
                            </button>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">AI Enhancements</h3>
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 mb-2">
                            <p className="text-[10px] text-amber-600 font-bold leading-tight">AI reflow is experimental on structured PDFs.</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <button onClick={handleFormatClean} disabled={isAILoading} className="flex items-center gap-3 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 hover:bg-indigo-100 transition-all shadow-sm group disabled:opacity-50">
                                {isAILoading && activeAITask === 'format_clean' ? <div className="size-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /> : <Sparkles className="size-4 text-indigo-500" />}
                                <span className="text-xs font-bold font-display">Format Text Cleanly</span>
                            </button>
                            <button onClick={handleSpellFix} disabled={isAILoading} className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-200 transition-all shadow-sm group disabled:opacity-50">
                                {isAILoading && activeAITask === 'spell_fix' ? <div className="size-4 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" /> : <Type className="size-4 text-slate-400 group-hover:text-indigo-500" />}
                                <span className="text-xs font-bold">Spell Fix</span>
                            </button>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">History</h3>
                        <div className="flex gap-2 px-1">
                            <button
                                onClick={undo}
                                disabled={history.length === 0}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-200 transition-all disabled:opacity-30 disabled:hover:border-slate-200"
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo2 className="size-4" />
                                <span className="text-[10px] font-bold">Undo</span>
                            </button>
                            <button
                                onClick={redo}
                                disabled={future.length === 0}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-200 transition-all disabled:opacity-30 disabled:hover:border-slate-200"
                                title="Redo (Ctrl+Y)"
                            >
                                <Redo2 className="size-4" />
                                <span className="text-[10px] font-bold">Redo</span>
                            </button>
                        </div>
                    </section>
                </aside>

                {/* Main Render Area */}
                <main className="flex-1 overflow-y-auto bg-slate-300 p-8 flex flex-col items-center">
                    <div className="max-w-5xl w-full flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{fileName || "Structured Document"}</h1>
                                <p className="text-sm font-medium text-slate-600">Click anywhere on the text to edit inline.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => navigate('/student/dashboard')} className="h-10 px-4 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                                    <ChevronLeft className="size-4" /> Back
                                </button>
                                <button onClick={applyEdits} disabled={isProcessing} className="h-10 px-6 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md">
                                    {isProcessing ? <div className="size-4 border-2 border-indigo-300 border-t-white rounded-full animate-spin" /> : <Save className="size-4" />}
                                    {isProcessing ? 'Saving...' : 'Save PDF'}
                                </button>
                            </div>
                        </div>

                        {/* Formatting Toolbar - Contextual Sticky */}
                        {selectedTextItem && (
                            <div className="sticky top-6 z-50 mx-auto w-max mb-6 bg-slate-900 text-white px-3 py-2 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-200">
                                <div className="flex items-center bg-slate-800 rounded-xl p-0.5">
                                    <button
                                        onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
                                        className={`p-2 rounded-lg transition-colors ${selectedTextItem.fontWeight === 'bold' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}
                                    >
                                        <Bold className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
                                        className={`p-2 rounded-lg transition-colors ${selectedTextItem.fontStyle === 'italic' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}
                                    >
                                        <Italic className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => toggleStyle('textDecoration', 'underline', 'none')}
                                        className={`p-2 rounded-lg transition-colors ${selectedTextItem.textDecoration === 'underline' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}
                                    >
                                        <Underline className="size-4" />
                                    </button>
                                </div>
                                <div className="w-px h-6 bg-slate-700 mx-1 border-none" />
                                <div className="flex items-center bg-slate-800 rounded-xl p-0.5">
                                    <button
                                        onClick={() => handleStyleChange('uiFontSize', Math.max(8, selectedTextItem.uiFontSize - 2))}
                                        className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <Minus className="size-4" />
                                    </button>
                                    <span className="w-10 text-center text-xs font-bold font-mono">{Math.round(selectedTextItem.uiFontSize)}</span>
                                    <button
                                        onClick={() => handleStyleChange('uiFontSize', Math.min(120, selectedTextItem.uiFontSize + 2))}
                                        className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                </div>

                                <div className="w-px h-6 bg-slate-700 mx-1 border-none" />

                                <div className="flex items-center bg-slate-800 rounded-xl px-2 py-1">
                                    <select
                                        value={selectedTextItem.fontFamily || 'Helvetica'}
                                        onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                                        className="bg-transparent text-[11px] font-bold text-slate-300 outline-none cursor-pointer hover:text-white transition-colors"
                                    >
                                        <option value="Helvetica" className="bg-slate-900 text-white">Helvetica</option>
                                        <option value="Times-Roman" className="bg-slate-900 text-white">Times</option>
                                        <option value="Courier" className="bg-slate-900 text-white">Courier</option>
                                    </select>
                                </div>

                                <div className="w-px h-6 bg-slate-700 mx-1 border-none" />

                                <div className="flex items-center bg-slate-800 rounded-xl p-2 h-9">
                                    <input
                                        type="color"
                                        value={selectedTextItem.color || '#334155'}
                                        onChange={(e) => handleStyleChange('color', e.target.value)}
                                        className="size-5 rounded-md border border-slate-600 bg-transparent cursor-pointer"
                                        title="Text Color"
                                    />
                                </div>
                            </div>
                        )}

                        {/* PDF.js Viewer Canvas + Overlay pages */}
                        <div className="w-full flex flex-col items-center">
                            {!pdfUrl && <div className="p-20 text-center text-slate-400 font-medium">Fetching Document...</div>}
                            {pdfPages.map((page, index) => (
                                <PageWrapper key={index} page={page} pageNum={index + 1} scale={scale} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Find & Replace Modal */}
            {showFindReplace && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
                        <h3 className="text-lg font-bold mb-4">Find & Replace</h3>
                        <input type="text" value={findText} onChange={(e) => setFindText(e.target.value)} placeholder="Find word..." className="w-full h-11 px-4 mb-3 bg-slate-50 border rounded-xl" />
                        <input type="text" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} placeholder="Replace with..." className="w-full h-11 px-4 mb-6 bg-slate-50 border rounded-xl" />
                        <div className="flex gap-3">
                            <button onClick={() => setShowFindReplace(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Cancel</button>
                            <button onClick={handleReplaceAll} className="flex-[1.5] py-3 bg-indigo-600 text-white font-bold rounded-xl">Replace All</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Optimization: Virtualized Page Container
function PageWrapper({ page, pageNum, scale }) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 800 }); // Placeholder

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { rootMargin: '400px', threshold: 0.01 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
            // Get initial size from viewport once to avoid layout jump
            const viewport = page.getViewport({ scale });
            setDimensions({ width: viewport.width, height: viewport.height });
        }

        return () => observer.disconnect();
    }, [page, scale]);

    return (
        <div
            ref={containerRef}
            className="virtualized-page"
            style={{
                minHeight: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                marginBottom: '2rem'
            }}
        >
            {isVisible ? (
                <PageView page={page} pageNum={pageNum} scale={scale} />
            ) : (
                <div className="w-full h-full bg-slate-200/50 rounded animate-pulse flex items-center justify-center border-2 border-dashed border-slate-300">
                    <span className="text-slate-400 font-bold text-sm">Page {pageNum} Loading...</span>
                </div>
            )}
        </div>
    );
}
