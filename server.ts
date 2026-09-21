import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;

// Set default key to user's active key
let configuredApiKey = "AQ.Ab8RN6LSIJiZfwvioDye5xaxi2u4rGM3hcwEaOlL-ulbgmG1aQ";

function getGenAI(overrideKey?: string): GoogleGenAI {
  const apiKey = (overrideKey && overrideKey.trim()) ? overrideKey.trim() : configuredApiKey;
  if (!apiKey) {
    throw new Error("No hay llave API de Gemini configurada. Por favor introduce tu API Key en la barra superior.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  // Remove markdown code block fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  return cleaned;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "5mb" }));

  // API Route: Health Check & Key Status
  app.get("/api/health", (_req, res) => {
    const key = configuredApiKey;
    const maskedKey = key ? `${key.slice(0, 6)}...${key.slice(-4)}` : null;
    res.json({
      status: "ok",
      hasKey: Boolean(key),
      maskedKey,
      timestamp: Date.now(),
    });
  });

  // API Route: Get current key status (masked for security)
  app.get("/api/key", (_req, res) => {
    const key = configuredApiKey;
    const maskedKey = key ? `${key.slice(0, 6)}...${key.slice(-4)}` : null;
    res.json({
      hasKey: Boolean(key),
      maskedKey,
      isCustom: Boolean(configuredApiKey && configuredApiKey !== process.env.GEMINI_API_KEY),
    });
  });

  // API Route: Update API key dynamically
  app.post("/api/key", (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      res.status(400).json({ error: "Por favor proporciona una clave API válida." });
      return;
    }
    configuredApiKey = apiKey.trim();
    const maskedKey = `${configuredApiKey.slice(0, 6)}...${configuredApiKey.slice(-4)}`;
    res.json({
      success: true,
      message: "Clave API actualizada correctamente en el servidor.",
      maskedKey,
    });
  });

  // API Route: Test API key validity
  app.post("/api/test-key", async (req, res) => {
    try {
      const testKey = req.body.apiKey?.trim() || configuredApiKey;
      const ai = getGenAI(testKey);
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: "Respond with the single word: OK",
      });
      res.json({
        success: true,
        message: "¡La clave API funciona correctamente con Gemini!",
        reply: response.text?.trim(),
      });
    } catch (err: any) {
      console.error("Test key failed:", err);
      res.status(400).json({
        success: false,
        error: `Error al probar la clave: ${err.message || "Clave no reconocida"}`,
      });
    }
  });

  // API Route: Verify News
  app.post("/api/verify", async (req, res) => {
    try {
      const { title, content, sourceUrl, mode = "deep", apiKey: clientKey } = req.body;
      const headerKey = req.headers["x-gemini-api-key"] as string | undefined;
      const activeKey = clientKey || headerKey;

      if (!title && !content) {
        res.status(400).json({ error: "Please provide either a news title or article content." });
        return;
      }

      const ai = getGenAI(activeKey);

      // System instruction for high-accuracy journalistic fact-checking & disinformation forensics
      const systemInstruction = `You are the world's most capable, rigorous investigative journalist and disinformation analyst AI.
Your objective is to evaluate submitted news items (Title and Content) for factual authenticity, deliberate fabrication, sensationalism, clickbait, and credibility.

CRITICAL INSTRUCTIONS:
1. Thoroughly verify if the claims are real, fabricated, exaggerated, satirical, or debunked hoaxes.
2. Evaluate BOTH the Title and the Information Body separately and in relation to one another.
3. Specifically analyze if the Title misleads or exaggerates what is actually stated in the Information box (a classic clickbait/disinformation technique).
4. Provide a realistic Credibility Score (0-100, where 100 = completely factual & verified by consensus, 0 = complete fabrication/fraudulent hoax).
5. Provide a Confidence Score (0-100) indicating your confidence level in your assessment.
6. Extract key verifiable factual claims made in the text and analyze each individually.
7. Identify red flags (e.g. anonymous unverified sources, emotionally manipulative diction, logical fallacies, scientific impossibilities) and reputable signals.

You MUST respond strictly with valid JSON conforming to this exact structure:
{
  "overallVerdict": "LIKELY_REAL" | "LIKELY_FAKE" | "MISLEADING_CLICKBAIT" | "UNVERIFIED_DISPUTED",
  "credibilityScore": number (0 to 100),
  "confidenceScore": number (0 to 100),
  "summary": "Clear, concise 2-3 sentence executive summary explaining the verdict and key findings",
  "titleAnalysis": {
    "verdict": "REAL" | "FAKE" | "MISLEADING" | "UNVERIFIED",
    "score": number (0 to 100),
    "isClickbait": boolean,
    "clickbaitLevel": "NONE" | "LOW" | "MODERATE" | "EXTREME",
    "analysis": "Specific analysis of the headline's truthfulness, tone, and framing",
    "matchesContent": boolean,
    "discrepancyNotes": "Explanation of whether the headline accurately reflects the body or misleads readers"
  },
  "contentAnalysis": {
    "verdict": "REAL" | "FAKE" | "MISLEADING" | "UNVERIFIED",
    "score": number (0 to 100),
    "factualAccuracy": "HIGH" | "MIXED" | "LOW" | "FABRICATED",
    "emotionalTone": "OBJECTIVE" | "SENSATIONAL" | "ALARMIST" | "BIASED",
    "analysis": "Specific analysis of the claims made in the information body"
  },
  "claims": [
    {
      "claim": "Specific factual claim extracted from title or body",
      "verdict": "VERIFIED_TRUE" | "FALSE_DEBUNKED" | "MISLEADING" | "UNVERIFIED",
      "explanation": "Brief factual evidence addressing this claim"
    }
  ],
  "redFlags": [
    "Specific warning sign or red flag identified"
  ],
  "reputableSignals": [
    "Specific positive credibility indicators identified"
  ]
}`;

      const promptText = `Please analyze the following news story for factual credibility, fake news detection, and title-content alignment:

[TITLE / HEADLINE]:
${title ? title.trim() : "(No title provided)"}

[NEWS INFORMATION / BODY CONTENT]:
${content ? content.trim() : "(No body text provided)"}

${sourceUrl ? `[REPORTED SOURCE / URL]:\n${sourceUrl.trim()}` : ""}`;

      const modelName = "gemini-3.1-flash-lite";
      const config: any = {
        systemInstruction,
        temperature: 0.1, // low temperature for analytical precision
        responseMimeType: "application/json",
      };

      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptText,
        config,
      });

      const responseText = response.text || "";
      const cleaned = cleanJsonString(responseText);
      
      let parsedData: any = {};
      try {
        parsedData = JSON.parse(cleaned);
      } catch (jsonErr) {
        console.error("Failed to parse direct JSON response, attempting fallback regex extract...", jsonErr);
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (match) {
          parsedData = JSON.parse(match[0]);
        } else {
          throw new Error("Could not parse AI response into structured fact-checking report.");
        }
      }

      // Extract Google Search grounding sources & queries if available
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const groundingChunks = groundingMetadata?.groundingChunks || [];
      const searchQueriesUsed = groundingMetadata?.webSearchQueries || [];

      const searchGroundingSources: Array<{ title: string; url: string }> = [];
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          searchGroundingSources.push({
            title: chunk.web.title || new URL(chunk.web.uri).hostname,
            url: chunk.web.uri,
          });
        }
      }

      const result = {
        id: `check-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        inputTitle: title || "",
        inputContent: content || "",
        sourceUrl: sourceUrl || "",
        overallVerdict: parsedData.overallVerdict || "UNVERIFIED_DISPUTED",
        credibilityScore: typeof parsedData.credibilityScore === "number" ? Math.max(0, Math.min(100, Math.round(parsedData.credibilityScore))) : 50,
        confidenceScore: typeof parsedData.confidenceScore === "number" ? Math.max(0, Math.min(100, Math.round(parsedData.confidenceScore))) : 80,
        summary: parsedData.summary || "Analysis completed.",
        titleAnalysis: parsedData.titleAnalysis || {
          verdict: "UNVERIFIED",
          score: 50,
          isClickbait: false,
          clickbaitLevel: "LOW",
          analysis: "Title was evaluated.",
          matchesContent: true,
        },
        contentAnalysis: parsedData.contentAnalysis || {
          verdict: "UNVERIFIED",
          score: 50,
          factualAccuracy: "MIXED",
          emotionalTone: "OBJECTIVE",
          analysis: "Content was evaluated.",
        },
        claims: Array.isArray(parsedData.claims) ? parsedData.claims : [],
        redFlags: Array.isArray(parsedData.redFlags) ? parsedData.redFlags : [],
        reputableSignals: Array.isArray(parsedData.reputableSignals) ? parsedData.reputableSignals : [],
        searchGroundingSources,
        searchQueriesUsed,
        modelUsed: modelName,
      };

      res.json({ success: true, result });
    } catch (err: any) {
      console.error("Verification error in /api/verify:", err);
      let userFriendlyMessage = err.message || "Failed to verify news credibility.";

      if (
        userFriendlyMessage.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") ||
        userFriendlyMessage.includes("API_KEY_INVALID") ||
        userFriendlyMessage.includes("UNAUTHENTICATED") ||
        userFriendlyMessage.includes("API key not valid") ||
        userFriendlyMessage.includes("PERMISSION_DENIED")
      ) {
        userFriendlyMessage = `Error de autenticación con la API de Google: La clave utilizada (que empieza por "AQ...") es un token de sesión/OAuth, no una API Key de Gemini. Google rechaza este formato con el error ACCESS_TOKEN_TYPE_UNSUPPORTED. Para solucionarlo, obtén una clave oficial gratuita en aistudio.google.com/apikey (que empieza por "AIzaSy...") e ingrésala pulsando en 'API Key'.`;
      }

      res.status(500).json({
        error: userFriendlyMessage,
        isKeyError: Boolean(
          userFriendlyMessage.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") ||
          userFriendlyMessage.includes("API_KEY_INVALID") ||
          userFriendlyMessage.includes("UNAUTHENTICATED") ||
          userFriendlyMessage.includes("API key not valid") ||
          userFriendlyMessage.includes("PERMISSION_DENIED") ||
          userFriendlyMessage.includes("llave API")
        ),
        details: err.stack,
      });
    }
  });

  // Vite middleware for development or static serving for production
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
    console.log(`Fake News Detector server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
