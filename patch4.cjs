const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'import { Mic, MicOff, Settings, Users, MonitorUp, MessageSquare, Globe, Volume2, Video, VideoOff, FileText, Download, Sparkles, Loader2, Presentation, Send } from "lucide-react";',
  'import { Mic, MicOff, Settings, Users, MonitorUp, MessageSquare, Globe, Volume2, Video, VideoOff, FileText, Download, Sparkles, Loader2, Presentation, Send, Hand, CircleDot, PenTool, Eraser } from "lucide-react";'
);

code = code.replace(
  '  const [chatInput, setChatInput] = useState("");\n  const [chatSubTab, setChatSubTab] = useState<"messages" | "users">("messages");',
  '  const [chatInput, setChatInput] = useState("");\n  const [chatSubTab, setChatSubTab] = useState<"messages" | "users">("messages");\n  const [isHandRaised, setIsHandRaised] = useState(false);\n  const [isRecording, setIsRecording] = useState(false);\n  const [isWhiteboardOn, setIsWhiteboardOn] = useState(false);\n  const [drawingMode, setDrawingMode] = useState<"draw"|"erase">("draw");\n  const canvasRef = useRef<HTMLCanvasElement>(null);\n  const [isDrawing, setIsDrawing] = useState(false);'
);

// Add Whiteboard drawing logic
const effectLogic = `
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
`;

code = code.replace(
  '  // Auto-scroll to bottom of transcript',
  effectLogic + '\n  // Auto-scroll to bottom of transcript'
);

// Replace the main video grid
const mainScreenReplace = `          <div className="w-full max-w-5xl aspect-video bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl flex items-center justify-center group">
            {isWhiteboardOn ? (
              <div className="absolute inset-0 bg-slate-100 flex flex-col relative">
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 z-10">
                   <button onClick={() => setDrawingMode("draw")} className={\`p-2 rounded-lg transition-colors \${drawingMode === 'draw' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}\`}><PenTool className="w-5 h-5"/></button>
                   <button onClick={() => setDrawingMode("erase")} className={\`p-2 rounded-lg transition-colors \${drawingMode === 'erase' ? 'bg-rose-100 text-rose-600' : 'text-slate-500 hover:bg-slate-100'}\`}><Eraser className="w-5 h-5"/></button>
                   <div className="w-px h-6 bg-slate-200 mx-1"></div>
                   <button onClick={() => setIsWhiteboardOn(false)} className="text-sm font-bold text-slate-500 hover:text-rose-500 px-2">بستن تخته</button>
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
            ) : isScreenSharing ? (`;

code = code.replace(
  '          <div className="w-full max-w-5xl aspect-video bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl flex items-center justify-center group">\n            {isScreenSharing ? (',
  mainScreenReplace
);

// Replace Bottom Controls
const bottomControlsReplace = `        {/* Bottom Controls */}
        <div className="h-24 bg-slate-900/80 backdrop-blur border-t border-slate-800 flex items-center justify-center gap-3 px-6 relative z-10">
          <button 
            onClick={() => setIsListening(!isListening)}
            className={\`w-12 h-12 rounded-2xl flex items-center justify-center transition-all \${!isListening ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700 shadow-[0_0_15px_rgba(52,211,153,0.1)]'}\`}
            title="میکروفون"
          >
            {!isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={\`w-12 h-12 rounded-2xl flex items-center justify-center transition-all \${!isVideoOn ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}\`}
            title="دوربین"
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => { setIsWhiteboardOn(false); setIsScreenSharing(!isScreenSharing); }}
            className={\`w-12 h-12 rounded-2xl flex items-center justify-center transition-all \${isScreenSharing ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}\`}
            title="اشتراک صفحه"
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          <button 
            onClick={() => { setIsScreenSharing(false); setIsWhiteboardOn(!isWhiteboardOn); }}
            className={\`w-12 h-12 rounded-2xl flex items-center justify-center transition-all \${isWhiteboardOn ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}\`}
            title="تخته سفید"
          >
            <PenTool className="w-5 h-5" />
          </button>

          <div className="w-px h-8 bg-slate-800 mx-2"></div>

          <button 
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={\`w-12 h-12 rounded-2xl flex items-center justify-center transition-all \${isHandRaised ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-bounce' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}\`}
            title="اجازه گرفتن"
          >
            <Hand className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={\`flex items-center gap-2 px-4 h-12 rounded-2xl transition-all \${isRecording ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] animate-pulse' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}\`}
          >
            <CircleDot className="w-4 h-4" />
            <span className="text-sm font-bold">{isRecording ? 'در حال ضبط' : 'ضبط کلاس'}</span>
          </button>

          <button className="h-12 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors ml-auto shadow-lg shadow-rose-600/20">
            پایان کلاس
          </button>
        </div>`;

code = code.replace(
  /        \{\/\* Bottom Controls \*\/\}[\s\S]*?        <\/div>/,
  bottomControlsReplace
);

fs.writeFileSync('src/App.tsx', code);
