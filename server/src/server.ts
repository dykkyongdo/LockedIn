import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./ai.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import jobsRoutes from "./routes/jobs.routes";
import referenceRoutes from "./routes/reference.routes";
import { initDatabase } from "./config/db";

console.log("API Key prefix:", process.env.OPENAI_API_KEY?.slice(0, 8));

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Initialize database
initDatabase().catch(console.error);

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// API routes
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/reference", referenceRoutes);

// Root endpoint
app.get("/", (_req, res) => {
  res.type("html").send(`
    <h1>LockedIn API Server</h1>
    <p>Server is running! Available endpoints:</p>
    <ul>
      <li><a href="/health">/health</a> - Health check</li>
      <li><a href="/api/ai/summarize-resume">/api/ai/summarize-resume</a> - Resume parsing</li>
      <li>/api/auth/register - User registration</li>
      <li>/api/auth/login - User login</li>
      <li>/api/profile - User profile management</li>
      <li>/api/jobs/discover - Job discovery</li>
      <li>/api/reference/interest-categories/:major - Get interest categories</li>
      <li>/api/reference/profile-tags/:major - Get profile tags</li>
    </ul>
  `);
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
    console.log(`LockedIn API server running on http://localhost:${port}`);
});
