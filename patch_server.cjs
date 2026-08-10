const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'import { GoogleGenAI } from "@google/genai";',
  'import { GoogleGenAI } from "@google/genai";\nimport { Server as SocketIOServer } from "socket.io";'
);

code = code.replace(
  '  app.listen(PORT, "0.0.0.0", () => {\n    console.log(`Server running on http://localhost:${PORT}`);\n  });',
  `  const httpServer = app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
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
             translatedText: \`[Mock: \${targetLanguage}]: \${text}\`
          });
          return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = \`Translate the following text to \${targetLanguage}. Provide ONLY the translated text without any quotes, formatting, or conversational filler.\\n\\nText: \${text}\`;
        
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
             translatedText: \`[Error/Mock]: \${text}\`
          });
        }
      } catch (err) {
        console.error("Socket translation error", err);
      }
    });
  });`
);

fs.writeFileSync('server.ts', code);
