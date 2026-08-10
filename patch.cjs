const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const [activeTab, setActiveTab] = useState<"translation" | "summary">("translation");',
  'const [activeTab, setActiveTab] = useState<"translation" | "summary" | "chat" | "participants">("translation");\n  const [isScreenSharing, setIsScreenSharing] = useState(false);\n  const [chatMessages, setChatMessages] = useState<{sender: string, text: string, time: string}[]>([]);\n  const [chatInput, setChatInput] = useState("");'
);

code = code.replace(
  'import { Mic, MicOff, Settings, Users, MonitorUp, MessageSquare, Globe, Volume2, Video, VideoOff, FileText, Download, Sparkles, Loader2 } from "lucide-react";',
  'import { Mic, MicOff, Settings, Users, MonitorUp, MessageSquare, Globe, Volume2, Video, VideoOff, FileText, Download, Sparkles, Loader2, Presentation, Send } from "lucide-react";'
);

code = code.replace(
  '          <button \n            onClick={() => setActiveTab("summary")}',
  `          <button \n            onClick={() => setActiveTab("summary")}`
);

code = code.replace(
  '          <button \n            onClick={() => setActiveTab("summary")}\n            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === \'summary\' ? \'bg-slate-800 text-amber-400 shadow-md\' : \'text-slate-400 hover:text-slate-200 hover:bg-slate-900\'}`}\n          >\n            <Sparkles className="w-4 h-4" />\n            هوش مصنوعی\n          </button>\n        </div>',
  `          <button \n            onClick={() => setActiveTab("summary")}\n            className={\`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all \${activeTab === 'summary' ? 'bg-slate-800 text-amber-400 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}\`}\n          >\n            <Sparkles className="w-4 h-4" />\n            هوش مصنوعی\n          </button>\n          <button \n            onClick={() => setActiveTab("chat")}\n            className={\`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all \${activeTab === 'chat' ? 'bg-slate-800 text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}\`}\n          >\n            <Users className="w-4 h-4" />\n            تعامل\n          </button>\n        </div>`
);

code = code.replace(
  '          <button className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 flex items-center justify-center transition-all">\n            <MonitorUp className="w-6 h-6" />\n          </button>',
  `          <button \n            onClick={() => setIsScreenSharing(!isScreenSharing)}\n            className={\`w-14 h-14 rounded-2xl flex items-center justify-center transition-all \${isScreenSharing ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}\`}\n          >\n            <MonitorUp className="w-6 h-6" />\n          </button>`
);


code = code.replace(
  '          <div className="w-full max-w-5xl aspect-video bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl flex items-center justify-center group">',
  `          <div className="w-full max-w-5xl aspect-video bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl flex items-center justify-center group">\n            {isScreenSharing ? (\n              <div className="absolute inset-0 bg-slate-100 flex flex-col">\n                <div className="bg-slate-800 text-white p-2 flex items-center justify-between text-sm">\n                  <div className="flex items-center gap-2"><Presentation className="w-4 h-4" /> ارائه استاد</div>\n                  <div className="text-xs text-slate-400">در حال نمایش اسلایدها</div>\n                </div>\n                <div className="flex-1 flex items-center justify-center text-slate-400 p-8 text-center">\n                  <div>\n                    <Presentation className="w-20 h-20 mx-auto text-indigo-300 opacity-50 mb-4" />\n                    <h3 className="text-2xl font-bold text-slate-700 mb-2">مقدمه‌ای بر هوش مصنوعی</h3>\n                    <p className="text-slate-500 max-w-md mx-auto">در این بخش به بررسی تاریخچه و کاربردهای شبکه‌های عصبی عمیق در پردازش زبان طبیعی می‌پردازیم.</p>\n                  </div>\n                </div>\n                {isVideoOn && (\n                  <div className="absolute bottom-4 right-4 w-48 aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 flex items-center justify-center">\n                     <Volume2 className="w-8 h-8 text-slate-500" />\n                     <span className="absolute bottom-1 right-2 text-[10px] text-white bg-black/50 px-1 rounded">استاد احمدی</span>\n                  </div>\n                )}\n              </div>\n            ) : (\n              <>\n`
);

code = code.replace(
  '            {isListening && (\n              <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">\n                <div className="flex gap-1 items-center h-4">\n                  <span className="w-1 bg-emerald-400 rounded-full h-full animate-bounce" style={{ animationDelay: \'0ms\' }}></span>\n                  <span className="w-1 bg-emerald-400 rounded-full h-2/3 animate-bounce" style={{ animationDelay: \'150ms\' }}></span>\n                  <span className="w-1 bg-emerald-400 rounded-full h-1/2 animate-bounce" style={{ animationDelay: \'300ms\' }}></span>\n                </div>\n                <span className="text-sm font-medium text-emerald-400">در حال ضبط صدا...</span>\n              </div>\n            )}\n          </div>',
  '            {isListening && (\n              <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">\n                <div className="flex gap-1 items-center h-4">\n                  <span className="w-1 bg-emerald-400 rounded-full h-full animate-bounce" style={{ animationDelay: \'0ms\' }}></span>\n                  <span className="w-1 bg-emerald-400 rounded-full h-2/3 animate-bounce" style={{ animationDelay: \'150ms\' }}></span>\n                  <span className="w-1 bg-emerald-400 rounded-full h-1/2 animate-bounce" style={{ animationDelay: \'300ms\' }}></span>\n                </div>\n                <span className="text-sm font-medium text-emerald-400">در حال ضبط صدا...</span>\n              </div>\n            )}\n            </>\n            )}\n          </div>'
);


code = code.replace(
  '                <button className="mt-6 w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700">\n                  <Download className="w-4 h-4" />\n                  دانلود فایل متنی\n                </button>',
  `                <button \n                  onClick={() => {\n                    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });\n                    const url = URL.createObjectURL(blob);\n                    const a = document.createElement('a');\n                    a.href = url;\n                    a.download = 'summary.txt';\n                    a.click();\n                  }}\n                  className="mt-6 w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"\n                >\n                  <Download className="w-4 h-4" />\n                  دانلود فایل متنی\n                </button>`
);


const chatSection = `
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col h-full relative">
            <div className="flex bg-slate-900 border-b border-slate-800 text-sm">
               <button className="flex-1 py-2 text-emerald-400 border-b-2 border-emerald-400">چت کلاس</button>
               <button className="flex-1 py-2 text-slate-400 hover:text-slate-200">شرکت کنندگان (۲۴)</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
               {chatMessages.length === 0 ? (
                 <div className="h-full flex items-center justify-center text-slate-500 text-sm">پیامی وجود ندارد.</div>
               ) : (
                 chatMessages.map((msg, i) => (
                   <div key={i} className={\`flex flex-col \${msg.sender === 'شما' ? 'items-end' : 'items-start'}\`}>
                      <span className="text-xs text-slate-400 mb-1">{msg.sender} <span className="text-[10px] opacity-50">{msg.time}</span></span>
                      <div className={\`px-3 py-2 rounded-xl text-sm \${msg.sender === 'شما' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}\`}>
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
                  setChatMessages(prev => [...prev, {sender: 'شما', text: chatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]);
                  setChatInput("");
                }
              }} className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="ارسال پیام به کلاس..."
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
          </div>
        )}
`;

code = code.replace(
  '      </div>\n    </div>\n  );\n}',
  chatSection + '\n      </div>\n    </div>\n  );\n}'
);

fs.writeFileSync('src/App.tsx', code);
