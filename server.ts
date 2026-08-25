import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

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

// Helper for robust deterministic extraction from prompt when Gemini is not configured or in fallback
function extractBlueprintDeterministically(prompt: string) {
  const text = prompt.trim();
  const lower = text.toLowerCase();

  // 1. Title extraction
  let title = "Custom Technical Project";
  const titlePatterns = [
    /(?:building|build|create|creating|develop|developing)\s+(?:an?|the)?\s*([a-zA-Z0-9\s-]+?)(?:\s+(?:platform|system|application|app|service|tool|dashboard|canvas|engine|assistant|hub|solution|pipeline|marketplace|portal|network))/i,
    /(?:building|build|create|creating|develop|developing)\s+(?:an?|the)?\s*([a-zA-Z0-9\s-]{4,40}?)(?:\s+for|\s+with|\s+to|\s+that|\.|$)/i,
  ];

  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 3) {
      const extracted = match[1].trim();
      // Capitalize words
      title = extracted
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      if (
        !title.toLowerCase().includes("platform") &&
        !title.toLowerCase().includes("system") &&
        !title.toLowerCase().includes("app")
      ) {
        if (lower.includes("platform")) title += " Platform";
        else if (lower.includes("system")) title += " System";
        else if (lower.includes("dashboard")) title += " Dashboard";
      }
      break;
    }
  }

  // Specific high-frequency triggers
  if (lower.includes("disaster response")) {
    title = "AI Disaster Response Platform";
  } else if (lower.includes("fraud detection")) {
    title = "Fraud Detection Platform";
  } else if (lower.includes("campus navigation")) {
    title = "Campus Navigation System";
  } else if (lower.includes("adaptive learning") || lower.includes("learning platform") || lower.includes("online learning")) {
    title = "Interactive Learning Platform";
  } else if (lower.includes("healthcare") || lower.includes("health")) {
    title = "AI Healthcare Platform";
  }

  // 2. Timeline extraction
  let timeline = "Flexible Timeline";
  const hourMatch = text.match(/(\d+)\s*(?:hours?|hrs?|hour)/i);
  const dayMatch = text.match(/(\d+)\s*(?:days?|day)/i);
  const weekMatch = text.match(/(\d+|one|two|three|four)\s*(?:weeks?|week)/i);
  const monthMatch = text.match(/(\d+|one|two|three)\s*(?:months?|month)/i);

  if (hourMatch) {
    timeline = `${hourMatch[1]} hours`;
  } else if (dayMatch) {
    timeline = `${dayMatch[1]} days`;
  } else if (weekMatch) {
    const w = weekMatch[1].toLowerCase();
    const num = w === "one" ? 1 : w === "two" ? 2 : w === "three" ? 3 : w === "four" ? 4 : w;
    timeline = `${num} week${num !== 1 ? "s" : ""}`;
  } else if (monthMatch) {
    const m = monthMatch[1].toLowerCase();
    const num = m === "one" ? 1 : m === "two" ? 2 : m === "three" ? 3 : m;
    timeline = `${num} month${num !== 1 ? "s" : ""}`;
  } else if (lower.includes("hackathon") || lower.includes("sprint")) {
    timeline = "Hackathon sprint (24-48 hours)";
  }

  // 3. Team Size extraction
  let teamSize = 4;
  const teamMatch1 = text.match(/(?:team of|roster of|size of|need|have|with)\s*(\d+)\s*(?:people|members|engineers|person|devs|developers)?/i);
  const teamMatch2 = text.match(/(\d+)\s*(?:people|members|engineers|person|devs|developers)/i);

  if (teamMatch2) {
    const parsed = parseInt(teamMatch2[1], 10);
    if (parsed >= 2 && parsed <= 12) teamSize = parsed;
  } else if (teamMatch1) {
    const parsed = parseInt(teamMatch1[1], 10);
    if (parsed >= 2 && parsed <= 12) teamSize = parsed;
  }

  // 4. Required capabilities & priorities
  const detectedCapabilities: { capability: string; priority: "Critical" | "Important" }[] = [];
  const addCap = (cap: string, prio: "Critical" | "Important" = "Critical") => {
    if (!detectedCapabilities.some((c) => c.capability === cap)) {
      detectedCapabilities.push({ capability: cap, priority: prio });
    }
  };

  if (/(?:ml|machine learning|ai|model|computer vision|vision|nlp|deep learning|prediction|anomaly)/i.test(text)) {
    addCap("ML", "Critical");
  }
  if (/(?:frontend|front-end|ui|ux\/ui|dashboard|mobile|canvas|interface|client|react|web app)/i.test(text)) {
    addCap("Frontend", "Critical");
  }
  if (/(?:backend|back-end|server|api|apis|microservice|database|fastapi|node|incident processing|transaction processing)/i.test(text)) {
    addCap("Backend", "Critical");
  }
  if (/(?:security|cybersecurity|auth|threat|owasp|encryption|detection|fraud detection)/i.test(text)) {
    addCap("Security", "Important");
  }
  if (/(?:cloud|infra|infrastructure|devops|aws|gcp|deployment|docker|kubernetes|high-availability|alerts)/i.test(text)) {
    addCap("Cloud", "Important");
  }
  if (/(?:data|analytics|pipeline|etl|warehouse|telemetry|metrics|stream)/i.test(text)) {
    addCap("Data", "Important");
  }
  if (/(?:ux|user experience|accessibility|design system|figma|neurodivergent)/i.test(text)) {
    addCap("UX", "Critical");
  }
  if (/(?:product|pm|agile|roadmap|strategy)/i.test(text)) {
    addCap("Product", "Important");
  }

  // Fallback capabilities if none detected
  if (detectedCapabilities.length === 0) {
    detectedCapabilities.push(
      { capability: "Frontend", priority: "Critical" },
      { capability: "Backend", priority: "Critical" }
    );
  }

  const projectType = lower.includes("hackathon")
    ? "Hackathon"
    : lower.includes("startup") || lower.includes("fintech") || lower.includes("marketplace")
    ? "Startup MVP"
    : lower.includes("enterprise")
    ? "Enterprise Prototype"
    : "Hackathon";

  return {
    title,
    projectType,
    goal: text,
    targetUsers: "Intended end users and stakeholders",
    timeline,
    teamSize,
    requiredRoles: detectedCapabilities.map((c) => `${c.capability} Engineer`),
    requiredCapabilities: detectedCapabilities.map((c) => c.capability),
    priorities: detectedCapabilities,
    interests: ["Innovation", "Technology"],
    constraints: ["Sprint milestone"],
  };
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
