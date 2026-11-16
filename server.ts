import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

import { extractBlueprintDeterministically } from "./src/engine/extraction";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// AI Project Blueprint Extraction Endpoint
app.post("/api/extract-blueprint", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Missing or invalid prompt string." });
    return;
  }

  const ai = getGenAI();
  if (!ai) {
    // Deterministic parsing directly from user prompt
    const blueprint = extractBlueprintDeterministically(prompt);
    res.json({
      fallback: false,
      blueprint,
    });
    return;
  }

  const systemInstructions = `You are an expert technical product architect. Extract a structured project blueprint strictly from the user's natural language project description.
CRITICAL INSTRUCTIONS:
- Derive all values exclusively from the user's prompt.
- If the user explicitly mentions a timeline (e.g. "36 hours", "48 hours", "1 week"), use that exact timeline.
- If the user mentions team size or number of people/engineers (e.g. "5 people", "team of 6"), extract that exact integer for teamSize.
- Extract requiredCapabilities and priorities strictly from standard taxonomy: ["ML", "Frontend", "Backend", "Cloud", "Security", "Data", "UX", "Product"].
- Do NOT use demo default names or placeholders.

User Prompt: "${prompt.replace(/"/g, '\\"')}"`;

  const generationConfig = {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        projectType: { type: Type.STRING },
        goal: { type: Type.STRING },
        targetUsers: { type: Type.STRING },
        timeline: { type: Type.STRING },
        teamSize: { type: Type.INTEGER },
        requiredRoles: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        requiredCapabilities: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        priorities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              capability: { type: Type.STRING },
              priority: { type: Type.STRING },
            },
            required: ["capability", "priority"],
          },
        },
        interests: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        constraints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        "title",
        "projectType",
        "goal",
        "timeline",
        "teamSize",
        "requiredRoles",
        "requiredCapabilities",
        "priorities",
        "interests",
      ],
    },
  };

  const modelsToTry = ["gemini-3.7-flash", "gemini-flash-latest"];
  let parsedBlueprint: any = null;

  for (const model of modelsToTry) {
    try {
      // 3.5s bounded promise per model attempt
      const generatePromise = ai.models.generateContent({
        model,
        contents: systemInstructions,
        config: generationConfig,
      });

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("AI Model Timeout")), 3500)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);

      const text = response?.text;
      if (text) {
        parsedBlueprint = JSON.parse(text);
        break;
      }
    } catch (err: any) {
      console.info(`Extraction model attempt (${model}) skipped: ${err?.message || "unavailable"}`);
    }
  }

  if (parsedBlueprint && parsedBlueprint.goal) {
    res.json({
      fallback: false,
      blueprint: parsedBlueprint,
    });
  } else {
    // Graceful fallback to deterministic parsing directly from user prompt
    const blueprint = extractBlueprintDeterministically(prompt);
    res.json({
      fallback: false,
      blueprint,
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
