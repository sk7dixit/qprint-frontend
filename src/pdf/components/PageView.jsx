import { useEffect, useRef, useState } from "react";
import { usePdfStore } from "../store/pdfStore";
import { v4 as uuidv4 } from 'uuid';

export default function PageView({ page, pageNum, scale = 1.5 }) {
    const canvasRef = useRef(null);
    const {
        pages, setPages, updateText, activeTool, addText,
        selectedText, setSelectedText, setActiveTool,
        updateTextPosition, pushToHistory
    } = usePdfStore();
    const [localViewport, setLocalViewport] = useState(null);

    // Get this page's structured data from the store
    const pageData = pages.find(p => p.pageNumber === pageNum);

    useEffect(() => {
        if (!page) return;

        let renderTask = null;

        const renderPage = async () => {
            try {
                const viewport = page.getViewport({ scale });
                setLocalViewport(viewport);

                const canvas = canvasRef.current;
                if (!canvas) return;

                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                renderTask = page.render({
                    canvasContext: context,
                    viewport: viewport
                });
                await renderTask.promise;

                // If store doesn't have this page yet, extract and initialize it
                if (!pageData) {
                    const textContent = await page.getTextContent();

                    const extractedTexts = textContent.items
                        .filter(item => item.str.trim() !== '')
                        .map((item, index) => {
                            const [, , , , x, y] = item.transform;
                            const pt = viewport.convertToViewportPoint(x, y);
                            const scaledHeight = item.height * scale;

                            return {
                                id: `${pageNum}_${index}`,
                                originalContent: item.str,
                                content: item.str,
                                originalX: item.transform[4], // PDF Coordinates
                                originalY: item.transform[5],
                                originalSize: item.height,

                                // Render Coordinates
                                uiX: pt[0],
                                uiY: pt[1] - scaledHeight,
                                uiFontSize: scaledHeight,

                                // Styling Defaults
                                fontFamily: "sans-serif",
                                fontWeight: "normal",
                                fontStyle: "normal",
                                textDecoration: "none",
                                color: "#334155", // slate-700

                                modified: false,
                                isHidden: false,
                                isNew: false
                            };
                        });

                    const newPageStoreObj = {
                        pageNumber: pageNum,
                        originalWidth: viewport.width / scale,
                        originalHeight: viewport.height / scale,
                        texts: extractedTexts
                    };

                    // Append securely via store state access
                    const currentPages = usePdfStore.getState().pages;
                    if (!currentPages.find(p => p.pageNumber === pageNum)) {
                        setPages([...currentPages, newPageStoreObj]);
                    }
                }
            } catch (err) {
                if (err.name !== 'RenderingCancelledException') {
                    console.error("PDF Render error:", err);
                }
            }
        };

        renderPage();

        return () => {
            if (renderTask) {
                renderTask.cancel();
            }
        };
    }, [page, scale, pageNum, pageData, setPages]);

    const handlePageClick = (e) => {
        if (activeTool !== 'add_text' || !localViewport) return;

        pushToHistory(); // Snapshot before adding

        // Calculate click coordinates relative to the canvas
        const rect = canvasRef.current.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;

        // Convert UI coordinates back to PDF coordinates
        const pt = localViewport.convertToPdfPoint(rawX, rawY);
        const originalFontSize = 14;
        const scaledFontSize = originalFontSize * scale;

        const newText = {
            id: uuidv4(),
            originalContent: "",
            content: "New Text",
            originalX: pt[0],
            originalY: pt[1],
            originalSize: originalFontSize,

            uiX: rawX,
            uiY: rawY - scaledFontSize,
            uiFontSize: scaledFontSize,

            fontFamily: "sans-serif",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
            color: "#000000",

            modified: true,
            isHidden: false,
            isNew: true
        };

        addText(pageNum - 1, newText);
    };

    const handleDragStart = (e, text) => {
        if (activeTool !== 'select') return;

        e.preventDefault();
        e.stopPropagation();

        pushToHistory(); // Snapshot before drag begins

        const startX = e.clientX;
        const startY = e.clientY;
        const initialUiX = text.uiX;
        const initialUiY = text.uiY;

        const onPointerMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            const newUiX = initialUiX + dx;
            const newUiY = initialUiY + dy;

            // Convert new UI coords back to PDF coords
            const pdfPt = localViewport.convertToPdfPoint(newUiX, newUiY + text.uiFontSize);

            updateTextPosition(pageNum - 1, text.id, {
                uiX: newUiX,
                uiY: newUiY,
                originalX: pdfPt[0],
                originalY: pdfPt[1]
            });
        };

        const onPointerUp = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    return (
        <div
            className={`pdf-page-container relative mx-auto bg-white shadow-xl overflow-hidden rounded-sm ring-1 ring-slate-900/5 mb-8 ${activeTool === 'add_text' ? 'cursor-crosshair' : ''}`}
            data-page-num={pageNum}
            style={{
                width: localViewport ? `${localViewport.width}px` : 'auto',
                height: localViewport ? `${localViewport.height}px` : 'auto'
            }}
            onClick={handlePageClick}
        >
            <canvas ref={canvasRef} className="block pointer-events-none" />

            {/* React Controlled Overlay Layer */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ transformOrigin: "top left" }}>
                {pageData && pageData.texts.map((text, textIndex) => {
                    if (text.isHidden) return null;

                    const selected = selectedText?.textId === text.id;
                    return (
                        <span
                            key={text.id}
                            className={`pdf-text-span absolute outline-none border transition-all cursor-move pointer-events-auto bg-white
                                       ${selected ? 'border-indigo-400 ring-2 ring-indigo-500/20 z-20 shadow-sm' : 'border-transparent hover:border-indigo-200'}
                                       ${(!selected && text.modified) ? 'bg-slate-50' : ''}`}
                            contentEditable
                            suppressContentEditableWarning
                            onPointerDown={(e) => handleDragStart(e, text)}
                            style={{
                                left: `${text.uiX}px`,
                                top: `${text.uiY}px`,
                                fontSize: `${text.uiFontSize}px`,
                                fontFamily: text.fontFamily || "sans-serif",
                                fontWeight: text.fontWeight || "normal",
                                fontStyle: text.fontStyle || "normal",
                                textDecoration: text.textDecoration || "none",
                                color: text.color || "#334155",
                                lineHeight: "1",
                                whiteSpace: "nowrap",
                            }}
                            onFocus={() => {
                                setSelectedText({ pageIndex: pageNum - 1, textId: text.id });
                                if (activeTool !== 'select') setActiveTool('select');
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); // prevent triggering page click
                            }}
                            onBlur={(e) => {
                                const newText = e.currentTarget.innerText;
                                if (newText !== text.content) {
                                    pushToHistory(); // Snapshot before content update
                                    updateText(pageNum - 1, text.id, newText);
                                }
                            }}
                        >
                            {text.content}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
