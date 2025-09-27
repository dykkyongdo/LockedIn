import React, { useRef, useState} from "react";
import { summarizeResume, type ResumeSummary } from "../../lib/api";

export default function ProfileCreate() {
    const [ai, setAI] = useState<ResumeSummary | null>(null);
    const [loading, setLoading] = useState(false); 
    const [err, setErr] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    
    async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setErr(null);
            setLoading(true);
            const data = await summarizeResume(file);
            setAI(data);
        } catch (ex: any) {
            setErr(ex.message || 'Upload failed');
        } finally {
            setLoading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    }
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Create your profile</h1>

        <div className="space-y-2">
            <label          className="font-medium">Resume (PDF / PNG / JPG)</label>
            <input
                ref={fileRef}
                type="file"
                accept="application/pdf,image/png,image/jpeg"
            onChange={onFileChange}
            disabled={loading}
            className="block"
        />
        {loading && <p>Reading your resume…</p>}
        {err && <p className="text-red-600">{err}</p>}
        </div>

        {ai && (
            <div className="rounded-lg border p-4 space-y-2 bg-white/5">
                <h2 className="font-semibold">Autofill preview</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Name" value={ai.name} />
                    <Field label="Email" value={ai.email} />
                    <Field label="Short description" value={ai.short_description} wide />
                    <Field label="University" value={ai.university} />
                    <Field label="Year of study" value={ai.yearOfStudy === -1 ? 'Graduated' : ai.yearOfStudy || ''} />
                    <Field label="Years of experience" value={String(ai.yearsExperience ?? 0)} />
            </div>
            <div>
                <p className="font-medium mb-1">Skills</p>
                <div className="flex flex-wrap gap-2">
                    {(ai.skills ?? []).slice(0, 12).map(s => (
                        <span key={s} className="px-2 py-1 rounded-full border text-sm">{s}</span>
                    ))}   
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

function Field({ label, value, wide=false }: { label: string; value?: string; wide?: boolean }) {
    return (
        <div className={wide ? 'sm:col-span-2' : ''}>
            <div className="text-sm opacity-75">{label}</div>
            <div className="border rounded p-2 bg-white/5">{value || <span className="opacity-50">—</span>}</div>
        </div>
    );
}