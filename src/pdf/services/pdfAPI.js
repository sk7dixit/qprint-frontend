export const fetchDraft = async (draftId, token) => {
    const response = await fetch(`/api/print-drafts/${draftId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to load draft");
    return await response.json();
};

export const uploadDraftFile = async (file, token) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/print-drafts/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");
    return await response.json();
};

export const saveEditedPdf = async (draftId, updatedTextItems, token) => {
    const response = await fetch(`/api/print-drafts/${draftId}/process`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ updatedTextItems }),
    });

    if (!response.ok) throw new Error("Failed to save PDF");
    return await response.json();
};

export const spellFixPDF = async (draftId, pages, token) => {
    const response = await fetch(`/api/print-drafts/${draftId}/spell-fix`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pages })
    });

    if (!response.ok) throw new Error("Failed Spell Fix request");
    return await response.json();
};

export const formatPDFText = async (draftId, pages, token) => {
    const response = await fetch(`/api/print-drafts/${draftId}/format-clean`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pages })
    });

    if (!response.ok) throw new Error("Failed Format Clean request");
    return await response.json();
};
