import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Code2, Terminal, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface ProjectChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isSending: boolean;
  selectedFileName?: string;
}

export const ProjectChat: React.FC<ProjectChatProps> = ({
  messages,
  onSendMessage,
  isSending,
  selectedFileName
}) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSending) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const QUICK_QUESTIONS = [
    'توضیح کامل ساختار و معماری این پروژه',
    'چه فیچرهایی می‌توان به این پروژه اضافه کرد؟',
    'کدام فایل‌ها هسته اصلی برنامه هستند؟',
    'بررسی خطاها و پیشنهاد بهبودهای کد'
  ];

  return (
    <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl flex flex-col h-[650px] shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#141414] border-b border-[#262626] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-blue-600 rounded-md text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-100 flex items-center gap-2">
              Gemini AI Code Assistant
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A1A] text-blue-400 border border-[#262626]">
                Project Grounded
              </span>
            </h3>
            <p className="text-[10px] text-gray-400">
              Ask any questions about this Google Drive project code or specs
            </p>
          </div>
        </div>

        {selectedFileName && (
          <div className="text-xs bg-[#1A1A1A] text-gray-300 px-2.5 py-1 rounded-md border border-[#333333] flex items-center gap-1.5 font-mono">
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Active: {selectedFileName}</span>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0A0A0A]">
        {messages.length === 0 ? (
          <div className="text-center py-12 max-w-lg mx-auto space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#262626] text-blue-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-200 mb-1">دستیار هوشمند پروژه</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                می‌توانید سوالات خود درباره ساختار، فایل‌ها، نحوه کارکرد کد یا ویژگی‌های پیشنهادی را به فارسی یا انگلیسی بپرسید.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right pt-2">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q)}
                  className="p-2.5 bg-[#0E0E0E] hover:bg-[#141414] text-gray-300 hover:text-white rounded-md border border-[#262626] text-xs text-right transition-colors leading-snug"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1A1A1A] border border-[#333333] text-blue-400'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] rounded-lg px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#0E0E0E] border border-[#262626] text-gray-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1 font-mono ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#1A1A1A] border border-[#333333] text-blue-400 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#0E0E0E] border border-[#262626] rounded-lg px-3.5 py-2.5 text-xs text-gray-400 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span>Gemini is analyzing project files...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-[#141414] border-t border-[#262626] p-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about the project code, architecture, or features..."
            className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-md px-3.5 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-md transition-colors shadow-sm flex items-center justify-center min-w-[36px]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
