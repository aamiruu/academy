import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      
      if (!text || !targetLanguage) {
        return res.status(400).json({ error: "Text and targetLanguage are required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({ translatedText: `[Mock: ${targetLanguage}]: ${text}` });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Translate the following text to ${targetLanguage}. Provide ONLY the translated text without any quotes, formatting, or conversational filler.\n\nText: ${text}`;
      
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        res.json({ translatedText: response.text });
      } catch (geminiError: any) {
        if (geminiError?.status === 429 || geminiError?.message?.includes("429") || geminiError?.message?.includes("Quota")) { console.log("Gemini API rate limit reached, using mock fallback."); } else { console.warn("Gemini API Error (fallback used)", geminiError?.message); }
        res.json({ translatedText: `[شبیه‌سازی ترجمه به ${targetLanguage}]: ${text}` });
      }

    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Failed to translate text" });
    }
  });

  app.post("/api/summarize", async (req, res) => {
    try {
      const { transcripts, targetLanguage = "fa" } = req.body;
      
      if (!transcripts || transcripts.length === 0) {
        return res.status(400).json({ error: "No transcripts provided" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({ summary: `[Mock Summary in ${targetLanguage}]: This is a mocked class summary.` });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const transcriptText = transcripts.map((t: any) => `${t.speaker}: ${t.originalText}`).join("\n");
      const langName = targetLanguage === "en" ? "English" : targetLanguage === "ar" ? "Arabic" : "Persian";
      const prompt = `You are an AI assistant for online classes. Please summarize the following class transcript in ${langName} using bullet points:\n\n${transcriptText}`;
      
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        res.json({ summary: response.text });
      } catch (geminiError: any) {
        if (geminiError?.status === 429 || geminiError?.message?.includes("429") || geminiError?.message?.includes("Quota")) { console.log("Gemini API rate limit reached, using mock fallback."); } else { console.warn("Gemini API Error (fallback used)", geminiError?.message); }
        res.json({ summary: `[Mock Summary in ${targetLanguage}]: This is a mocked class summary.` });
      }

    } catch (error) {
      console.error("Summary error:", error);
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const httpServer = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    socket.on("live-speech", async (data) => {
      try {
        const { id, text, targetLanguage, speaker } = data;
        
        if (!process.env.GEMINI_API_KEY) {
          socket.emit("live-translation", {
             id,
             speaker,
             originalText: text,
             translatedText: `[Mock: ${targetLanguage}]: ${text}`
          });
          return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Translate the following text to ${targetLanguage}. Provide ONLY the translated text without any quotes, formatting, or conversational filler.\n\nText: ${text}`;
        
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
          });
          
          io.emit("live-translation", {
             id,
             speaker,
             originalText: text,
             translatedText: response.text
          });
        } catch (geminiError) {
          io.emit("live-translation", {
             id,
             speaker,
             originalText: text,
             translatedText: `[Error/Mock]: ${text}`
          });
        }
      } catch (err) {
        console.error("Socket translation error", err);
      }
    });
  });
}

startServer();
