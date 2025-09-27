export type ResumeSummary = {
    name: string;
    email: string;
    short_description: string;
    skills: string[];
    university: string;
    yearOfStudy: number;
    yearsExperience: number;
};

const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

export async function summarizeResume(file: File): Promise<ResumeSummary> {
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch(`${BASE}/api/ai/summarize-resume`, { method: 'POST', body: fd });
    if (!r.ok) {
        let msg = r.statusText; 
        try { const j = await r.json(); msg = j.error ?? msg; } catch {}
        throw new Error(msg);
    }
    return r.json();
}