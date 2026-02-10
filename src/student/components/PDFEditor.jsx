import { useState, useCallback } from 'react';
import {
    Trash2,
    RotateCw,
    GripVertical,
    Type,
    Highlighter,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Save,
    Download,
    Search,
    CheckSquare,
    Layers,
    FileText,
    MousePointer2,
    Undo2,
    History
} from 'lucide-react';

import { useNavigate, Link } from 'react-router-dom';

export function PDFEditor() {
    const navigate = useNavigate();
    const [pages, setPages] = useState(
        Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            rotation: 0,
            selected: false,
        }))
    );
    const [currentTool, setCurrentTool] = useState('select');
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
    const [actionStack, setActionStack] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null); // URL of the processed PDF
    const [showFindReplace, setShowFindReplace] = useState(false);
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');

    // AI States
    const [showAISuggestions, setShowAISuggestions] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState(null);
    const [isAILoading, setIsAILoading] = useState(false);
    const [activeAITask, setActiveAITask] = useState(null);



    const togglePageSelection = useCallback((id, isShiftKey) => {
        setPages((prev) => {
            const currentIndex = prev.findIndex(p => p.id === id);

            if (isShiftKey && lastSelectedIndex !== null) {
                const start = Math.min(lastSelectedIndex, currentIndex);
                const end = Math.max(lastSelectedIndex, currentIndex);
                const newPages = [...prev];
                for (let i = start; i <= end; i++) {
                    newPages[i] = { ...newPages[i], selected: true };
                }
                return newPages;
            }

            setLastSelectedIndex(currentIndex);
            const newPages = [...prev];
            newPages[currentIndex] = { ...newPages[currentIndex], selected: !newPages[currentIndex].selected };
            return newPages;
        });
    }, [lastSelectedIndex]);

    const applyEdits = async () => {
        if (actionStack.length === 0) return;

        setIsProcessing(true);
        try {
            // In a real app, fileId would be passed via props or state
            // For now we mock the fileId and instructions sync
            const response = await fetch('/api/pdf/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Fallback auth
                },
                body: JSON.stringify({
                    fileId: 1, // Mock fileId
                    instructions: actionStack
                })
            });

            const data = await response.json();
            if (data.success) {
                setPdfUrl(data.pdfUrl);
                setActionStack([]); // Clear stack after successful sync
                console.log("Changes synced to backend!");
            }
        } catch (error) {
            console.error("Failed to sync edits:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const rotatePage = (id) => {
        const pageIndex = pages.findIndex(p => p.id === id);
        setPages((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
            )
        );

        setActionStack(prev => [
            ...prev,
            { type: 'rotate_page', pageIndex, degrees: 90 }
        ]);
    };

    const deleteSelected = () => {
        const selectedIndices = pages
            .map((p, idx) => p.selected ? idx : -1)
            .filter(idx => idx !== -1)
            .reverse(); // Reverse to avoid indexing issues when deleting multiple

        setPages((prev) => prev.filter((p) => !p.selected));

        const newActions = selectedIndices.map(idx => ({
            type: 'delete_page',
            pageIndex: idx
        }));

        setActionStack(prev => [...prev, ...newActions]);
    };

    const handleReplaceAll = () => {
        if (!findText.trim()) return;

        setActionStack(prev => [
            ...prev,
            {
                type: 'replace_text',
                from: findText,
                to: replaceText
            }
        ]);

        // Reset and close
        setFindText('');
        setReplaceText('');
        setShowFindReplace(false);
        console.log(`Queued replacement: ${findText} -> ${replaceText}`);
    };

    const handleAIAction = async (task) => {
        // For demonstration, we'll use some mock extracted text based on the task
        // In a real app, this would extract text from selected pages or a region
        const textToProcess = task === 'spell_fix'
            ? "The quick brown fox jumps ovr the lazi dog. It was an exelent day at Parul University."
            : "Data Structures Exam. Date: 12/05/23. Coordinator: Mr. John S.";

        setIsAILoading(true);
        setActiveAITask(task);
        try {
            const response = await fetch('/api/pdf/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ task, text: textToProcess })
            });

            const data = await response.json();
            if (data.success) {
                setAiSuggestions(data.result);
                setShowAISuggestions(true);
            }
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsAILoading(false);
        }
    };

    const applyAISuggestions = (suggestions) => {
        // AI suggests, user decides, system applies (to Instruction Stack)
        // Here we convert AI suggestions into standard 'replace_text' actions
        if (activeAITask === 'spell_fix') {
            // Suggestion might be a full block or specific words
            // For now we mock the application
            setActionStack(prev => [
                ...prev,
                { type: 'replace_text', from: 'ovr', to: 'over' },
                { type: 'replace_text', from: 'lazi', to: 'lazy' },
                { type: 'replace_text', from: 'exelent', to: 'excellent' }
            ]);
        } else if (activeAITask === 'smart_replace') {
            setActionStack(prev => [
                ...prev,
                { type: 'replace_text', from: '12/05/23', to: '2023-05-12' }
            ]);
        }

        setShowAISuggestions(false);
        setAiSuggestions(null);
    };

    const handleUndo = () => {
        if (actionStack.length === 0) return;
        setActionStack(prev => prev.slice(0, -1));
        console.log("Undone last action");
    };

    const selectAll = () => {
        const allSelected = pages.every(p => p.selected);
        setPages(pages.map(p => ({ ...p, selected: !allSelected })));
    };

    const selectedCount = pages.filter((p) => p.selected).length;

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-1px)] -m-6">
            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Tools Sidebar */}
                <aside className="w-64 border-r bg-slate-50/50 p-4 flex flex-col gap-6 shrink-0 overflow-y-auto">
                    {/* Tool Group: Core */}
                    <section>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Core Tools</h3>
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => setShowFindReplace(true)}
                                className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm group"
                            >
                                <Search className="size-4 text-slate-400 group-hover:text-indigo-500" />
                                <span className="text-xs font-bold">Find & Replace</span>
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm group">
                                <Type className="size-4 text-slate-400 group-hover:text-indigo-500" />
                                <span className="text-xs font-bold">Add Text</span>
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm group">
                                <Highlighter className="size-4 text-slate-400 group-hover:text-indigo-500" />
                                <span className="text-xs font-bold">Highlight</span>
                            </button>
                        </div>
                    </section>

                    {/* Tool Group: Page Actions */}
                    <section>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Page Actions</h3>
                        <div className="flex flex-col gap-1">
                            <button onClick={selectAll} className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm group">
                                <CheckSquare className="size-4 text-slate-400 group-hover:text-indigo-500" />
                                <span className="text-xs font-bold">Select All</span>
                            </button>
                            <button onClick={deleteSelected} disabled={selectedCount === 0} className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-red-200 hover:text-red-600 transition-all shadow-sm group disabled:opacity-40 disabled:grayscale">
                                <Trash2 className="size-4 text-slate-400 group-hover:text-red-500" />
                                <span className="text-xs font-bold">Delete Selected</span>
                            </button>
                            <button className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm group">
                                <Layers className="size-4 text-slate-400 group-hover:text-indigo-500" />
                                <span className="text-xs font-bold">Reorder Pages</span>
                            </button>
                        </div>
                    </section>

                    {/* Tool Group: AI Enhancements */}
                    <section>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">AI Enhancements</h3>
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => handleAIAction('smart_replace')}
                                disabled={isAILoading}
                                className="flex items-center gap-3 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 hover:bg-indigo-100 transition-all shadow-sm group disabled:opacity-50"
                            >
                                {isAILoading && activeAITask === 'smart_replace' ? (
                                    <div className="size-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                ) : (
                                    <Sparkles className="size-4 text-indigo-500" />
                                )}
                                <span className="text-xs font-bold font-display">Smart Replace</span>
                            </button>
                            <button
                                onClick={() => handleAIAction('spell_fix')}
                                disabled={isAILoading}
                                className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-200 transition-all shadow-sm group disabled:opacity-50"
                            >
                                {isAILoading && activeAITask === 'spell_fix' ? (
                                    <div className="size-4 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                                ) : (
                                    <Type className="size-4 text-slate-400 group-hover:text-indigo-500" />
                                )}
                                <span className="text-xs font-bold">Spell Fix</span>
                            </button>
                        </div>
                    </section>

                    {/* Tool Group: Export */}
                    <section>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Export</h3>
                        <div className="flex flex-col gap-1">
                            <button className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-emerald-200 hover:text-emerald-600 transition-all shadow-sm group">
                                <Download className="size-4 text-slate-400 group-hover:text-emerald-500" />
                                <span className="text-xs font-bold">Export PDF</span>
                            </button>
                        </div>
                    </section>

                    <div className="mt-auto">
                        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="size-3 text-indigo-600" />
                                <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">Pro Tip</span>
                            </div>
                            <p className="text-[10px] text-indigo-600/80 font-medium leading-relaxed">
                                Use <kbd className="bg-white px-1 rounded border border-indigo-200 shadow-sm">Shift</kbd> to select multiple pages at once.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-slate-200/30 p-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Compact Page Toolbar */}
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data_Structures.pdf</h1>
                                <p className="text-sm font-medium text-slate-500">{pages.length} Pages</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate('/student/upload')}
                                    className="h-10 px-4 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <ChevronLeft className="size-4" />
                                    Back
                                </button>

                                <div className="w-px h-6 bg-slate-200 mx-1" />

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
                                    <History className="size-4 text-slate-500" />
                                    <span className="text-xs font-bold text-slate-600">{actionStack.length}</span>
                                    <button
                                        onClick={handleUndo}
                                        disabled={actionStack.length === 0}
                                        className="p-1 hover:bg-slate-100 rounded-lg transition-all text-slate-600 disabled:opacity-30 ml-1"
                                        title="Undo"
                                    >
                                        <Undo2 className="size-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={applyEdits}
                                    disabled={isProcessing || actionStack.length === 0}
                                    className="h-10 px-6 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm font-bold hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <div className="size-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
                                    ) : (
                                        <Save className="size-4" />
                                    )}
                                    {isProcessing ? 'Saving...' : 'Save Changes'}
                                </button>

                                <button
                                    onClick={() => navigate('/student/compress')}
                                    className="h-10 px-6 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                                >
                                    Continue
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Document Pages</h3>
                            </div>
                            {selectedCount > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-indigo-100 uppercase tracking-widest animate-in zoom-in-95 duration-200">
                                    <FileText className="size-3" />
                                    {selectedCount} Selected
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
                            {pages.map((page) => (
                                <div
                                    key={page.id}
                                    className={`
                                        relative group cursor-pointer transition-all duration-300
                                        ${page.selected
                                            ? 'scale-[1.02] ring-2 ring-indigo-600 ring-offset-4 ring-offset-slate-100 shadow-2xl shadow-indigo-200/50'
                                            : 'hover:-translate-y-1 hover:shadow-xl'
                                        }
                                    `}
                                    onClick={(e) => togglePageSelection(page.id, e.shiftKey)}
                                >
                                    {/* Page Preview Card */}
                                    <div className={`
                                        aspect-[1/1.414] bg-white rounded-lg overflow-hidden border transition-colors relative
                                        ${page.selected ? 'border-indigo-600' : 'border-slate-200 group-hover:border-indigo-200'}
                                    `}>
                                        <div
                                            className="w-full h-full bg-slate-50 flex items-center justify-center p-4 transition-transform duration-300"
                                            style={{ transform: `rotate(${page.rotation}deg)` }}
                                        >
                                            <div className="w-full h-full border border-slate-200 border-dashed rounded flex items-center justify-center">
                                                <span className="text-3xl font-black text-slate-200 group-hover:text-indigo-100 transition-colors">{page.id}</span>
                                            </div>
                                        </div>

                                        {/* Selection Overlay */}
                                        {page.selected && (
                                            <div className="absolute inset-0 bg-indigo-600/5 flex items-center justify-center">
                                                <div className="size-12 rounded-full bg-white shadow-xl flex items-center justify-center text-indigo-600 animate-in zoom-in-75">
                                                    <CheckSquare className="size-6" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Page Controls Overlay */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                rotatePage(page.id);
                                            }}
                                            className="p-1.5 bg-white shadow-lg rounded-md text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            <RotateCw className="size-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="p-1.5 bg-white shadow-lg rounded-md text-slate-400 hover:text-indigo-600 cursor-grab active:cursor-grabbing"
                                        >
                                            <GripVertical className="size-3.5" />
                                        </button>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="mt-3 flex items-center justify-between px-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${page.selected ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            Page {page.id}
                                        </span>
                                        {page.selected && <MousePointer2 className="size-3 text-indigo-600" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Find & Replace Modal */}
            {showFindReplace && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                                    <Search className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Find & Replace</h3>
                                    <p className="text-[10px] text-slate-500 font-medium">Global document replacement</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFindReplace(false)}
                                className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400"
                            >
                                <ChevronRight className="size-5 rotate-90" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Find Text</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={findText}
                                        onChange={(e) => setFindText(e.target.value)}
                                        placeholder="e.g. 2023"
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Replace With</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={replaceText}
                                        onChange={(e) => setReplaceText(e.target.value)}
                                        placeholder="e.g. 2024"
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/50 flex gap-3">
                            <button
                                onClick={() => setShowFindReplace(false)}
                                className="flex-1 h-11 px-6 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReplaceAll}
                                disabled={!findText.trim()}
                                className="flex-[1.5] h-11 px-6 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                            >
                                Replace All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Suggestions Modal */}
            {showAISuggestions && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white text-indigo-600 rounded-xl shadow-sm">
                                    <Sparkles className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">AI Suggestions</h3>
                                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                                        {activeAITask === 'spell_fix' ? 'Spell Check & Grammar' : 'Smart Data Replace'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAISuggestions(false)}
                                className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-400"
                            >
                                <ChevronRight className="size-5 rotate-90" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Proposed Changes</h4>
                                <div className="space-y-3">
                                    {activeAITask === 'spell_fix' ? (
                                        <div className="text-sm text-slate-600 leading-relaxed italic">
                                            "{aiSuggestions || "I'll fix 'ovr' to 'over' and 'lazi' to 'lazy'..."}"
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                                                <span className="text-xs text-slate-400">12/05/23</span>
                                                <ChevronRight className="size-3 text-slate-300" />
                                                <span className="text-xs font-bold text-indigo-600">2023-05-12</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 px-1">Detected a date pattern. Suggesting standardized format.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                                    <span className="font-bold">Note:</span> These changes will be added to your Action Stack. You can review and save them to the final PDF later.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/50 flex gap-3">
                            <button
                                onClick={() => setShowAISuggestions(false)}
                                className="flex-1 h-11 px-6 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                            >
                                Discard
                            </button>
                            <button
                                onClick={() => applyAISuggestions(aiSuggestions)}
                                className="flex-[1.5] h-11 px-6 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
