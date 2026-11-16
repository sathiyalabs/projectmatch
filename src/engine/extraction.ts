// Helper for robust deterministic extraction from prompt when Gemini is not configured or in fallback
export function extractBlueprintDeterministically(prompt: string) {
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
    const num = w === "one" ? 1 : w === "two" ? 2 : w === "three" ? 3 : w === "four" ? 4 : Number(w);
    timeline = `${num} week${num !== 1 ? "s" : ""}`;
  } else if (monthMatch) {
    const m = monthMatch[1].toLowerCase();
    const num = m === "one" ? 1 : m === "two" ? 2 : m === "three" ? 3 : Number(m);
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

  if (/\b(?:ml|machine learning|ai|model|computer vision|vision|nlp|deep learning|prediction|anomaly)\b/i.test(text)) {
    addCap("ML", "Critical");
  }
  if (/\b(?:frontend|front-end|ui|ux\/ui|dashboard|mobile|canvas|interface|client|react|web app|website|websites)\b/i.test(text)) {
    addCap("Frontend", "Critical");
  }
  if (/\b(?:backend|back-end|server|api|apis|microservice|database|fastapi|node|incident processing|transaction processing)\b/i.test(text)) {
    addCap("Backend", "Critical");
  }
  if (/\b(?:security|cybersecurity|auth|threat|owasp|encryption|detection|fraud detection)\b/i.test(text)) {
    addCap("Security", "Important");
  }
  if (/\b(?:cloud|infra|infrastructure|devops|aws|gcp|deployment|docker|kubernetes|high-availability|alerts)\b/i.test(text)) {
    addCap("Cloud", "Important");
  }
  if (/\b(?:data|analytics|pipeline|etl|warehouse|telemetry|metrics|stream)\b/i.test(text)) {
    addCap("Data", "Important");
  }
  if (/\b(?:ux|user experience|accessibility|design system|figma|neurodivergent)\b/i.test(text)) {
    addCap("UX", "Critical");
  }
  if (/\b(?:product|pm|agile|roadmap|strategy)\b/i.test(text)) {
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

