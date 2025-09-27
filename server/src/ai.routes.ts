import { Router } from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import OpenAI from "openai";
import { ResumeSummary } from "./types";
import pdfParse from "pdf-parse";
import { toFile } from "openai/uploads";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_FILE_MB = Number(process.env.MAX_FILE_MB || 10);

const limiter = rateLimit({ windowMs: 60_000, max: 20 });

function safeJSON<T = any>(text: string): T {
  const t = (text || "").trim();
  try { return JSON.parse(t) as T; } catch {}
  const s = t.indexOf("{"), e = t.lastIndexOf("}");
  if (s !== -1 && e !== -1 && e > s) return JSON.parse(t.slice(s, e + 1)) as T;
  throw new Error("Model did not return valid JSON");
}

const SYSTEM = "You extract concise hiring signals from resumes. Output strict JSON only, no markdown.";
const STRUCTURE = `
Return EXACT JSON with keys:
{
  "name": "Full name or '' if unknown",
  "email": "lowercased email or '' if none",
  "short_description": "Two punchy lines, plain text.",
  "skills": ["skill1","skill2","skill3"],     // 5–12 items, short nouns like "React","AWS"
  "yearsExperience": 0,                        // integer best estimate
  "university": "University name or '' if unknown",
  "yearOfStudy": 0                             // integer year if currently studying (1..8),
                                               // return -1 if graduated,
                                               // return 0 if unclear/unknown
}

Rules:
- JSON only. No extra keys, no markdown.
- If unknown: skills=[], yearsExperience=0, university="", name="", email="", yearOfStudy=0.
- Prefer technical skills; avoid soft/buzz words.
- Email must be a valid address if present; otherwise return "".
- For yearOfStudy: if the resume clearly indicates the candidate already graduated,
  return -1. If clearly a current student, return an integer 1..8. If unclear, return 0.
`;

// --- Helper: summarize plaintext resumes (used for PDF local parse) ---
async function summarizePlaintextResume(text: string): Promise<ResumeSummary> {
  const prompt = `The following is raw resume text:\n---\n${text}\n---\n${STRUCTURE}`;
  const r = await client.responses.create({
    model: MODEL,        // text-capable model
    temperature: 0.2,
    input: [
      { role: "system", content: SYSTEM },
      { role: "user", content: prompt },
    ],
  });
  const out = safeJSON<ResumeSummary>(r.output_text || "{}");
  out.short_description = (out.short_description || "").trim();
  out.skills = Array.isArray(out.skills) ? out.skills.slice(0, 12) : [];
  out.yearsExperience = Number.isFinite(out.yearsExperience as any)
    ? Number(out.yearsExperience)
    : 0;
  out.university = typeof out.university === "string" ? out.university.trim() : "";
  return out;
}

router.post("/summarize-resume", limiter, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) throw new Error("No file provided.");
    const { mimetype, originalname, buffer } = req.file!;
    console.log("[resume] name=%s mime=%s size=%d", originalname, mimetype, buffer.length);

    if (buffer.length > MAX_FILE_MB * 1024 * 1024) {
      throw new Error(`File too large (max ${MAX_FILE_MB}MB).`);
    }

    // --- PDF path: try local text first (most robust) ---
    if (/^application\/pdf$/i.test(mimetype) || /pdf$/i.test(originalname)) {
      try {
        const parsed = await pdfParse(buffer);
        const text = (parsed.text || "").replace(/\s+\n/g, "\n").trim();
        if (text.length >= 80) {
          const out = await summarizePlaintextResume(text.slice(0, 18000));
          return res.json(out);
        }
        console.warn("[resume] pdf-parse yielded too little text, falling back to OpenAI file upload");
      } catch (e) {
        console.warn("[resume] pdf-parse failed, falling back to OpenAI file upload:", e);
      }

      // Fallback: upload PDF to OpenAI and pass as input_file
      const uploaded = await client.files.create({
        file: await toFile(buffer, originalname || "resume.pdf", { type: "application/pdf" }),
        purpose: "assistants",
      });

      const r = await client.responses.create({
        model: MODEL,
        temperature: 0.2,
        input: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "input_text", text: STRUCTURE },
              { type: "input_file", file_id: uploaded.id }
            ]
          }
        ]
      });

        const out = safeJSON<ResumeSummary>(r.output_text || "{}");
        out.short_description = (out.short_description || "").trim();
        out.skills = Array.isArray(out.skills) ? out.skills.slice(0, 12) : [];
        out.yearsExperience = Number.isFinite(out.yearsExperience as any)
        ? Number(out.yearsExperience)
        : 0;
        out.university = typeof out.university === "string" ? out.university.trim() : "";
        out.name = typeof out.name === "string" ? out.name.trim() : "";
        const email = (typeof out.email === "string" ? out.email.trim().toLowerCase() : "");
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        out.email = emailOk ? email : "";

        let yos = Number(out.yearOfStudy);
        if (!Number.isFinite(yos)) yos = 0;          // unknown
        if (yos !== -1 && yos !== 0) {
            // clamp to a sane range for study years
            if (yos < 1 || yos > 8) yos = 0;
        }
        out.yearOfStudy = yos;

        return res.json(out);
    }

    // --- Image path (PNG/JPG) ---
    if (/^image\/(png|jpe?g)$/i.test(mimetype)) {
      const b64 = buffer.toString("base64");
      const dataUrl = `data:${mimetype};base64,${b64}`;

      const r = await client.responses.create({
        model: MODEL,
        temperature: 0.2,
        input: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "input_text", text: STRUCTURE },
              { type: "input_image", image_url: dataUrl, detail: "auto" }
            ]
          }
        ]
      });

      const out = safeJSON<ResumeSummary>(r.output_text || "{}");
      out.short_description = (out.short_description || "").trim();
      out.skills = Array.isArray(out.skills) ? out.skills.slice(0, 12) : [];
      out.yearsExperience = Number.isFinite(out.yearsExperience as any)
        ? Number(out.yearsExperience)
        : 0;
      out.university = typeof out.university === "string" ? out.university.trim() : "";
      return res.json(out);
    }

    // --- Unknown mimetype (some browsers send octet-stream) ---
    throw new Error("Unsupported file type. Please upload a PDF, PNG, or JPG resume.");
  } catch (err: any) {
    console.error("Resume summarization error:", err);
    return res.status(400).json({ error: err.message || "Summarization failed" });
  }
});

export default router;
