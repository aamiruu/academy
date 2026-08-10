const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { io } from "socket.io-client";')) {
  code = code.replace(
    'import React, { useState, useRef, useEffect } from "react";',
    'import React, { useState, useRef, useEffect } from "react";\nimport { io } from "socket.io-client";'
  );
}

if (!code.includes('const socket = io();')) {
  code = code.replace(
    'export default function App() {',
    'const socket = io();\n\nexport default function App() {'
  );
}

const socketLogic = `
  useEffect(() => {
    socket.on("live-translation", (data) => {
      setTranscripts(prev => {
         const existing = prev.find(t => t.id === data.id);
         if (existing) {
             return prev.map(t => t.id === data.id ? { ...t, translatedText: data.translatedText, isTranslating: false } : t);
         }
         return [...prev, { ...data, isTranslating: false, timestamp: new Date() }];
      });
    });
    return () => { socket.off("live-translation"); };
  }, []);

  useEffect(() => {
    let recognition: any = null;
    if (isListening) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'fa-IR'; // assuming Persian speech
        recognition.continuous = true;
        recognition.interimResults = false;
        
        recognition.onresult = (event: any) => {
          const text = event.results[event.results.length - 1][0].transcript;
          const id = Date.now().toString();
          
          setTranscripts(prev => [...prev, {
            id,
            speaker: 'شما',
            originalText: text,
            translatedText: '',
            isTranslating: true,
            timestamp: new Date()
          }]);
          
          socket.emit("live-speech", { id, text, targetLanguage, speaker: 'شما' });
        };
        
        try {
          recognition.start();
        } catch(e) {}
      } else {
        alert("مرورگر شما از قابلیت تشخیص صدا پشتیبانی نمی‌کند.");
        setIsListening(false);
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, targetLanguage]);
`;

code = code.replace(
  '  // Auto-scroll to bottom of transcript',
  socketLogic + '\n  // Auto-scroll to bottom of transcript'
);

// We should also modify the handleSimulateSpeech to use the socket instead of the old API if we want it to be unified.
code = code.replace(
  /  const handleSimulateSpeech = async \(e: React.FormEvent\) => \{[\s\S]*?  \};/,
  `  const handleSimulateSpeech = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newId = Date.now().toString();
    const textToTranslate = inputText;
    
    setTranscripts(prev => [...prev, {
      id: newId,
      speaker: "شما",
      originalText: textToTranslate,
      translatedText: "",
      isTranslating: true,
      timestamp: new Date()
    }]);
    
    setInputText("");
    
    // Use Socket for real-time processing
    socket.emit("live-speech", { id: newId, text: textToTranslate, targetLanguage, speaker: "شما" });
  };`
);


fs.writeFileSync('src/App.tsx', code);
