const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /        \{activeTab === "chat" && \([\s\S]*\}\)/;

code = code.replace(regex, `        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col h-full relative">
            <div className="flex bg-slate-900 border-b border-slate-800 text-sm">
               <button onClick={() => setChatSubTab("messages")} className={\`flex-1 py-2 \${chatSubTab === 'messages' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'}\`}>چت کلاس</button>
               <button onClick={() => setChatSubTab("users")} className={\`flex-1 py-2 \${chatSubTab === 'users' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'}\`}>شرکت کنندگان (۲۴)</button>
            </div>
            
            {chatSubTab === 'messages' ? (
              <>
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
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">شما</div>
                  <div className="flex-1 text-sm font-medium text-slate-200">استاد احمدی</div>
                  <Mic className="w-4 h-4 text-emerald-400" />
                </div>
                {Array.from({length: 23}).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
                      {String.fromCharCode(1575 + i % 15)}
                    </div>
                    <div className="flex-1 text-sm text-slate-300">دانشجو {i + 1}</div>
                    {i % 3 === 0 ? <Mic className="w-4 h-4 text-emerald-400/50" /> : <MicOff className="w-4 h-4 text-rose-500/50" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}`);

fs.writeFileSync('src/App.tsx', code);
