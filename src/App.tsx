import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import React, { useState, useEffect, useRef } from "react";
import { Dashboard } from "./components/Dashboard";
import { Mic, MicOff, Settings, Users, MonitorUp, MessageSquare, Globe, Volume2, Video, VideoOff, FileText, Download, Sparkles, Loader2, Presentation, Send, Hand, CircleDot, PenTool, Eraser, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TranscriptItem {
  id: string;
  speaker: string;
  originalText: string;
  translatedText?: string;
  timestamp: Date;
  isTranslating: boolean;
}

const socket = io();

export default function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('affiliate_ref', ref);
    }
  }, []);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("fa-IR");
  const [activeTab, setActiveTab] = useState<"translation" | "summary" | "chat" | "dashboard" | "participants">("translation");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<{sender: string, text: string, time: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSubTab, setChatSubTab] = useState<"messages" | "users">("messages");
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isWhiteboardOn, setIsWhiteboardOn] = useState(false);
  const [drawingMode, setDrawingMode] = useState<"draw"|"erase">("draw");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);


  useEffect(() => {
    if (isWhiteboardOn && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = drawingMode === "erase" ? "#f1f5f9" : "#3b82f6"; // slate-100 or blue-500
        ctx.lineWidth = drawingMode === "erase" ? 20 : 3;
      }
    }
  }, [isWhiteboardOn, drawingMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };


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
            speaker: t('you'),
            originalText: text,
            translatedText: '',
            isTranslating: true,
            timestamp: new Date()
          }]);
          
          socket.emit("live-speech", { id, text, targetLanguage, speaker: t('you') });
        };
        
        try {
          recognition.start();
        } catch(e) {}
      } else {
        alert(t('browser_no_mic'));
        setIsListening(false);
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, targetLanguage]);

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts, activeTab]);

  // Setup Web Speech API
  useEffect(() => {
    if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'fa-IR'; // Default to Persian input

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript.trim()) {
          const newItemId = Math.random().toString(36).substring(7);
          const newItem: TranscriptItem = {
            id: newItemId,
            speaker: t('teacher_you'),
            originalText: finalTranscript.trim(),
            timestamp: new Date(),
            isTranslating: true,
          };
          
          setTranscripts((prev) => [...prev, newItem]);
          handleTranslate(finalTranscript.trim(), newItemId);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (recognitionRef.current?.shouldListen) {
          recognition.start();
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.shouldListen = true;
        try {
          recognitionRef.current.start();
        } catch (e) {}
      } else {
        recognitionRef.current.shouldListen = false;
        recognitionRef.current.stop();
      }
    }
  }, [isListening]);

  const handleTranslate = async (text: string, id: string) => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          targetLanguage: targetLanguage === "fa-IR" ? "Persian" : targetLanguage === "ar-SA" ? "Arabic" : "English",
        }),
      });
      const data = await response.json();
      
      setTranscripts((prev) => 
        prev.map((item) => 
          item.id === id 
            ? { ...item, translatedText: data.translatedText, isTranslating: false } 
            : item
        )
      );
    } catch (error) {
      console.error("Translation failed:", error);
      setTranscripts((prev) => 
        prev.map((item) => 
          item.id === id 
            ? { ...item, translatedText: t('translation_error'), isTranslating: false } 
            : item
        )
      );
    }
  };

  const handleSummarize = async () => {
    if (transcripts.length === 0) return;
    setIsSummarizing(true);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcripts, targetLanguage: i18n.language }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Summary failed:", error);
      setSummary(t('summary_error'));
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSimulateSpeech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newItemId = Math.random().toString(36).substring(7);
    const newItem: TranscriptItem = {
      id: newItemId,
      speaker: t('teacher_you'),
      originalText: inputText,
      timestamp: new Date(),
      isTranslating: true,
    };

    setTranscripts((prev) => [...prev, newItem]);
    setInputText("");
    
    // Call translation API
    handleTranslate(newItem.originalText, newItemId);
  };

  const toggleMicrophone = () => {
    if (isMuted) {
      // Unmute: stop listening
      setIsListening(false);
      setIsMuted(false);
    } else {
      // Mute: stop listening (if we map muted to not listening, wait...)
      // Actually, if it's NOT muted, we should be listening.
      // Let's change the logic:
      setIsMuted(!isMuted);
    }
  };

  // Sync listening state with mute state
  useEffect(() => {
    if (!isMuted && activeTab === "translation") {
      // We could automatically start listening if not muted, but it asks for permissions immediately.
      // Let's bind the central Mic button to start/stop listening.
    }
  }, [isMuted]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur border-b border-slate-800/50 absolute top-0 left-0 right-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 leading-tight">{t('app_title')}</h1>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {t('live')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">{t('students_count')}</span>
            </div>
          </div>
        </header>

        {/* Video Grid */}
        <main className="flex-1 p-6 pt-22 flex flex-col items-center justify-center gap-4">
          <div className="w-full max-w-5xl aspect-video bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl flex items-center justify-center group">
            {isWhiteboardOn ? (
              <div className="absolute inset-0 bg-slate-100 flex flex-col relative">
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 z-10">
                   <button onClick={() => setDrawingMode("draw")} className={`p-2 rounded-lg transition-colors ${drawingMode === 'draw' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}><PenTool className="w-5 h-5"/></button>
                   <button onClick={() => setDrawingMode("erase")} className={`p-2 rounded-lg transition-colors ${drawingMode === 'erase' ? 'bg-rose-100 text-rose-600' : 'text-slate-500 hover:bg-slate-100'}`}><Eraser className="w-5 h-5"/></button>
                   <div className="w-px h-6 bg-slate-200 mx-1"></div>
                   <button onClick={() => setIsWhiteboardOn(false)} className="text-sm font-bold text-slate-500 hover:text-rose-500 px-2">{t('close_whiteboard')}</button>
                 </div>
                 <canvas
                    ref={canvasRef}
                    width={1024}
                    height={576}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    className="w-full h-full cursor-crosshair touch-none"
                 />
              </div>
            ) : isScreenSharing ? (
              <div className="absolute inset-0 bg-slate-100 flex flex-col">
                <div className="bg-slate-800 text-white p-2 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><Presentation className="w-4 h-4" /> {t('teacher_presentation')}</div>
                  <div className="text-xs text-slate-400">{t('showing_slides')}</div>
                </div>
                <div className="flex-1 flex items-center justify-center text-slate-400 p-8 text-center">
                  <div>
                    <Presentation className="w-20 h-20 mx-auto text-indigo-300 opacity-50 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">{t('intro_ai')}</h3>
                    <p className="text-slate-500 max-w-md mx-auto">{t('intro_ai_desc')}</p>
                  </div>
                </div>
                {isVideoOn && (
                  <div className="absolute bottom-4 right-4 w-48 aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 flex items-center justify-center">
                     <Volume2 className="w-8 h-8 text-slate-500" />
                     <span className="absolute bottom-1 right-2 text-[10px] text-white bg-black/50 px-1 rounded">{t('prof_ahmadi')}</span>
                  </div>
                )}
              </div>
            ) : (
              <>

            {isVideoOn ? (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-slate-900 flex items-center justify-center">
                 <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 mb-4 shadow-xl">
                      <Volume2 className={`w-12 h-12 ${isListening ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-300">{t('prof_ahmadi')}</h2>
                    <p className="text-sm text-slate-500 mt-1">{isListening ? t('speaking') : t('mic_disabled')}</p>
                 </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <VideoOff className="w-8 h-8 text-slate-500" />
                </div>
                <h2 className="text-lg font-medium text-slate-400">{t('camera_disabled')}</h2>
              </div>
            )}

            {isListening && (
              <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-1 bg-emerald-400 rounded-full h-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 bg-emerald-400 rounded-full h-2/3 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 bg-emerald-400 rounded-full h-1/2 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-sm font-medium text-emerald-400">{t('recording_audio')}</span>
              </div>
            )}
            </>
            )}
          </div>
        </main>

        {/* Bottom Controls */}
        <div className="h-24 bg-slate-900/80 backdrop-blur border-t border-slate-800 flex items-center justify-center gap-3 px-6 relative z-10">
          <button 
            onClick={() => setIsListening(!isListening)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${!isListening ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700 shadow-[0_0_15px_rgba(52,211,153,0.1)]'}`}
            title={t('mic')}
          >
            {!isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${!isVideoOn ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}`}
            title={t('camera')}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => { setIsWhiteboardOn(false); setIsScreenSharing(!isScreenSharing); }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isScreenSharing ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}`}
            title={t('screen_share')}
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          <button 
            onClick={() => { setIsScreenSharing(false); setIsWhiteboardOn(!isWhiteboardOn); }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isWhiteboardOn ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}`}
            title={t('whiteboard')}
          >
            <PenTool className="w-5 h-5" />
          </button>

          <div className="w-px h-8 bg-slate-800 mx-2"></div>

          <button 
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isHandRaised ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-bounce' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}`}
            title={t('raise_hand')}
          >
            <Hand className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center gap-2 px-4 h-12 rounded-2xl transition-all ${isRecording ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] animate-pulse' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}`}
          >
            <CircleDot className="w-4 h-4" />
            <span className="text-sm font-bold">{isRecording ? t('recording') : t('record_class')}</span>
          </button>

          <button className="h-12 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors ml-auto shadow-lg shadow-rose-600/20">
            {t('end_class')}
          </button>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-96 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl relative z-20">
        
        {/* Panel Tabs */}
        <div className="flex bg-slate-950 p-2 gap-1 border-b border-slate-800">
          <button 
            onClick={() => setActiveTab("translation")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'translation' ? 'bg-slate-800 text-indigo-400 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
          >
            <MessageSquare className="w-4 h-4" />
            {t('live_translation')}
          </button>
          <button 
            onClick={() => setActiveTab("summary")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'summary' ? 'bg-slate-800 text-amber-400 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
          >
            <Sparkles className="w-4 h-4" />
            {t('ai')}
          </button>
          <button 
            onClick={() => setActiveTab("chat")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'chat' ? 'bg-slate-800 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
          >
            <Users className="w-4 h-4" />
            {t('interaction')}
          </button>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-blue-400 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
          >
            <Wallet className="w-4 h-4" />
            داشبورد
          </button>
        </div>

        {activeTab === "dashboard" && <Dashboard />}

        {activeTab === "translation" && (
          <>
            <div className="p-4 border-b border-slate-800">
              <div className="bg-slate-950 rounded-xl p-1 border border-slate-800 flex text-sm">
                <button 
                  onClick={() => setTargetLanguage('fa-IR')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${targetLanguage === 'fa-IR' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {t('persian')}
                </button>
                <button 
                  onClick={() => setTargetLanguage('en-US')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${targetLanguage === 'en-US' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setTargetLanguage('ar-SA')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${targetLanguage === 'ar-SA' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {t('arabic')}
                </button>
              </div>
            </div>

            {/* Transcripts List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {transcripts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <Globe className="w-12 h-12 opacity-20" />
                  <p className="text-sm text-center">{t('transcription_hint_1')}<br/><br/>{t('transcription_hint_2')}</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {transcripts.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-400">{item.speaker}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      
                      {/* Original Text */}
                      <div className="text-slate-300 text-sm leading-relaxed mb-2 bg-slate-800/50 p-3 rounded-2xl rounded-tr-sm border border-slate-700/50">
                        {item.originalText}
                      </div>
                      
                      {/* Translated Text */}
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-full bg-indigo-500/50 rounded-full"></div>
                        <div className="flex-1 bg-indigo-500/10 p-3 rounded-2xl rounded-tr-sm border border-indigo-500/20 text-indigo-100 text-sm leading-relaxed min-h-[44px]">
                          {item.isTranslating ? (
                            <div className="flex items-center gap-1.5 h-full text-indigo-400/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              <span className="text-xs ml-2 font-medium">{t('translating')}</span>
                            </div>
                          ) : (
                            <p>{item.translatedText}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Input area (Simulation for demo) */}
            <div className="p-4 border-t border-slate-800 bg-slate-900">
              <form onSubmit={handleSimulateSpeech} className="relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('typing_sim')}
                  className="w-full bg-slate-950 border border-slate-700 text-sm rounded-xl py-2.5 px-4 pr-11 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-200 placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white disabled:text-slate-500 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </>
        )}

        {activeTab === "summary" && (
          <div className="flex-1 flex flex-col p-5 overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                {t('smart_summary')}
              </h3>
              <button 
                onClick={handleSummarize}
                disabled={isSummarizing || transcripts.length === 0}
                className="text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isSummarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {t('generate_summary')}
              </button>
            </div>

            {summary ? (
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-sm text-slate-300 leading-relaxed prose prose-invert prose-p:my-2 prose-li:my-1">
                {summary.split('\n').map((line, i) => {
                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    return <li key={i} className="ml-4">{line.substring(2)}</li>;
                  }
                  return <p key={i}>{line}</p>;
                })}
                
                <button 
                  onClick={() => {
                    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'summary.txt';
                    a.click();
                  }}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
                >
                  <Download className="w-4 h-4" />
                  {t('download_txt')}
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
                <Sparkles className="w-12 h-12 opacity-20 text-amber-400" />
                <p className="text-sm text-center">
                  {t('ai_assistant_hint')}
                  <br/><br/>
                  {transcripts.length === 0 ? t('speak_first') : t('click_summary')}
                </p>
              </div>
            )}
          </div>
        )}


{activeTab === "chat" && (
          <div className="flex-1 flex flex-col h-full relative">
            <div className="flex bg-slate-900 border-b border-slate-800 text-sm">
               <button onClick={() => setChatSubTab("messages")} className={`flex-1 py-2 ${chatSubTab === 'messages' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}>{t('class_chat')}</button>
               <button onClick={() => setChatSubTab("users")} className={`flex-1 py-2 ${chatSubTab === 'users' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}>{t('participants_count')}</button>
            </div>
            
            {chatSubTab === 'messages' ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                   {chatMessages.length === 0 ? (
                     <div className="h-full flex items-center justify-center text-slate-500 text-sm">{t('no_messages')}</div>
                   ) : (
                     chatMessages.map((msg, i) => (
                       <div key={i} className={`flex flex-col ${msg.sender === t('you') ? 'items-end' : 'items-start'}`}>
                          <span className="text-xs text-slate-400 mb-1">{msg.sender} <span className="text-[10px] opacity-50">{msg.time}</span></span>
                          <div className={`px-3 py-2 rounded-xl text-sm ${msg.sender === t('you') ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                             {msg.text}
                          </div>
                       </div>
                     ))
                   )}
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-900">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if(chatInput.trim()) {
                      setChatMessages(prev => [...prev, {sender: t('you'), text: chatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]);
                      setChatInput("");
                    }
                  }} className="relative">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={t('send_msg_to_class')}
                      className="w-full bg-slate-950 border border-slate-700 text-sm rounded-xl py-2.5 px-4 pl-11 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-200"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white disabled:text-slate-500 rounded-lg transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">{t('you')}</div>
                  <div className="flex-1 text-sm font-medium text-slate-200">{t('prof_ahmadi')}</div>
                  <Mic className="w-4 h-4 text-emerald-400" />
                </div>
                {Array.from({length: 23}).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
                      {String.fromCharCode(1575 + i % 15)}
                    </div>
                    <div className="flex-1 text-sm text-slate-300">{t('student_n', {n: i + 1})}</div>
                    {i % 3 === 0 ? <Mic className="w-4 h-4 text-emerald-400/50" /> : <MicOff className="w-4 h-4 text-rose-500/50" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
