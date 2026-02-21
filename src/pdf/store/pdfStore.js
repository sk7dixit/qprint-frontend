import { create } from 'zustand';

export const usePdfStore = create((set) => ({
    // Core Document State
    fileName: '',
    pdfUrl: null,
    pages: [],

    // UI Loading & Processing Flags
    isProcessing: false,
    isAILoading: false,
    activeAITask: null,

    // Tools & Overlay UI States
    showFindReplace: false,
    showAISuggestions: false,
    aiSuggestions: null,

    // Formatting & Tools State
    selectedText: null, // { pageIndex, textId }
    activeTool: 'select', // 'select' or 'add_text'

    scale: 1.5,
    isDirty: false,

    // History & Future Stacks
    history: [], // Stack of page snapshots [pages1, pages2...]
    future: [],  // Stack of future states for redo

    // Actions
    setFileName: (name) => set({ fileName: name }),
    setPdfUrl: (url) => set({ pdfUrl: url }),
    setSelectedText: (selection) => set({ selectedText: selection }),
    setActiveTool: (tool) => set({ activeTool: tool }),

    // History Capture (Manual Hook as requested)
    pushToHistory: () => {
        const { pages, history } = get();
        if (pages.length === 0) return;
        set({
            history: [JSON.parse(JSON.stringify(pages)), ...history].slice(0, 20),
            future: [] // New mutation clears redo stack
        });
    },

    setPages: (pages) => set({
        pages,
        history: [],
        future: []
    }),

    updateText: (pageIndex, textId, newContent) => set((state) => ({
        pages: state.pages.map((page, pIndex) =>
            pIndex === pageIndex
                ? {
                    ...page,
                    texts: page.texts.map((text) =>
                        text.id === textId ? { ...text, content: newContent, modified: true } : text
                    )
                }
                : page
        ),
        isDirty: true
    })),

    updateTextStyle: (pageIndex, textId, styleChanges) => set((state) => ({
        pages: state.pages.map((page, pIndex) =>
            pIndex === pageIndex
                ? {
                    ...page,
                    texts: page.texts.map((text) =>
                        text.id === textId ? { ...text, ...styleChanges, modified: true } : text
                    )
                }
                : page
        ),
        isDirty: true
    })),

    // Handle Drag & Reposition
    updateTextPosition: (pageIndex, textId, coords) => set((state) => ({
        pages: state.pages.map((page, pIndex) =>
            pIndex === pageIndex
                ? {
                    ...page,
                    texts: page.texts.map((text) =>
                        text.id === textId ? { ...text, ...coords, modified: true } : text
                    )
                }
                : page
        ),
        isDirty: true
    })),

    addText: (pageIndex, newTextObject) => set((state) => ({
        pages: state.pages.map((page, pIndex) =>
            pIndex === pageIndex ? { ...page, texts: [...page.texts, newTextObject] } : page
        ),
        isDirty: true,
        selectedText: { pageIndex, textId: newTextObject.id },
        activeTool: 'select'
    })),

    replaceAllText: (findWord, replaceWord) => set((state) => ({
        pages: state.pages.map((page) => ({
            ...page,
            texts: page.texts.map((text) => ({
                ...text,
                content: text.content.replaceAll(findWord, replaceWord),
                modified: text.content.includes(findWord) || text.modified
            }))
        })),
        isDirty: true
    })),

    applyUpdatedPages: (updatedPages) => set({
        pages: updatedPages,
        isDirty: true,
        future: []
    }),

    // History Traversal (Swap Model)
    undo: () => {
        const { history, pages, future } = get();
        if (history.length === 0) return;

        const [previous, ...rest] = history;
        set({
            pages: previous,
            history: rest,
            future: [JSON.parse(JSON.stringify(pages)), ...future].slice(0, 20),
            selectedText: null
        });
    },

    redo: () => {
        const { future, history, pages } = get();
        if (future.length === 0) return;

        const [next, ...rest] = future;
        set({
            pages: next,
            future: rest,
            history: [JSON.parse(JSON.stringify(pages)), ...history].slice(0, 20),
            selectedText: null
        });
    },

    setIsProcessing: (status) => set({ isProcessing: status }),
    setAILoading: (status, task = null) => set({ isAILoading: status, activeAITask: task }),
    setShowFindReplace: (status) => set({ showFindReplace: status }),
    setAISuggestions: (suggestions) => set({
        aiSuggestions: suggestions,
        showAISuggestions: suggestions !== null
    }),
}));
