import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./ai.routes";

console.log("API Key prefix:", process.env.OPENAI_API_KEY?.slice(0, 8));

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/ai", aiRoutes);
app.get("/", (_req, res) => {
  res.type("html").send(`
    <h1>LockedIn AI server</h1>
    <p>Try <a href="/health">/health</a> or POST <code>/api/ai/summarize-resume</code></p>

    <form action="/api/ai/summarize-resume" method="post" enctype="multipart/form-data" style="margin-top:16px">
      <input type="file" name="file" accept="application/pdf,image/png,image/jpeg" />
      <button type="submit">Upload resume (PDF / PNG / JPG)</button>
    </form>
  `);
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
    console.log(`LockedIn AI server running on http://localhost:${port}`);
});
