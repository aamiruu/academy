import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Settings,
  CheckCircle2,
  Power,
  ExternalLink,
  Bot,
  Send,
  X
} from 'lucide-react';
import { useEnterprise } from '../context/EnterpriseContext';

export const GoftinoChatWidget: React.FC = () => {
  const { goftino, updateGoftinoSettings, userRole } = useEnterprise();
  
  const [formSettings, setFormSettings] = useState(goftino);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: 'پشتیبانی آنلاین گفتینو',
      text: 'سلام! به پشتیبانی آنلاین سامانه خوش آمدید. چگونه می‌توانم کمک‌تان کنم؟',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userMsgInput, setUserMsgInput] = useState<string>('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoftinoSettings(formSettings);
    alert('تنظیمات ویجت چت گفتینو با موفقیت بروزرسانی شد.');
  };

  const handleSendChatMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsgInput.trim()) return;

    const newMsg = {
      sender: 'شما',
      text: userMsgInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setUserMsgInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'پشتیبانی گفتینو',
          text: 'پیام شما دریافت شد. کارشناسان ما به زودی پاسخ خواهند داد.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>اتصال کامل به سیستم پشتیبانی گفتینو (Goftino Integration)</span>
              {goftino.isEnabled ? (
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  فعال (Active)
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                  غیرفعال (Disabled)
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-400">
              مدیریت اسکریپت داینامیک، کلید ویجت گفتینو و فعال/غیرفعال‌سازی گفتگو آنلاین با مشتریان
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isPreviewOpen ? 'بستن پیش‌نمایش چت' : 'تست و پیش‌نمایش ویجت چت'}</span>
        </button>
      </div>

      {/* Admin Settings Form */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-[#262626] pb-3">
          <Settings className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white text-sm">تنظیمات ادمین گفتینو</h3>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
          <div className="flex items-center justify-between bg-[#181818] p-3.5 rounded-lg border border-[#2a2a2a]">
            <div>
              <span className="font-bold text-white block">فعال‌سازی ویجت گفتینو در کل سایت:</span>
              <span className="text-[11px] text-gray-400">نمایش آیکون پشتیبانی شناور در گوشه پایین سمت راست</span>
            </div>
            <button
              type="button"
              onClick={() => setFormSettings({ ...formSettings, isEnabled: !formSettings.isEnabled })}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${
                formSettings.isEnabled ? 'bg-emerald-600 text-white' : 'bg-[#333] text-gray-400'
              }`}
            >
              {formSettings.isEnabled ? 'فعال' : 'غیرفعال'}
            </button>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">شناسه اختصاصی گفتینو (Goftino Widget ID):</label>
            <input
              type="text"
              value={formSettings.widgetId}
              onChange={(e) => setFormSettings({ ...formSettings, widgetId: e.target.value })}
              className="w-full bg-[#101010] border border-[#333] p-2.5 text-white font-mono rounded-lg focus:outline-none focus:border-emerald-500 dir-ltr text-left"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">آدرس آدرس اسکریپت گفتینو (Script URL):</label>
            <input
              type="text"
              value={formSettings.scriptUrl}
              onChange={(e) => setFormSettings({ ...formSettings, scriptUrl: e.target.value })}
              className="w-full bg-[#101010] border border-[#333] p-2.5 text-white font-mono rounded-lg focus:outline-none focus:border-emerald-500 dir-ltr text-left"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ذخیره تغییرات گفتینو</span>
            </button>
          </div>
        </form>
      </div>

      {/* Floating Simulated Goftino Widget Box */}
      {goftino.isEnabled && isPreviewOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-[#181818] border border-emerald-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs animate-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="bg-emerald-600 p-3.5 text-white flex items-center justify-between font-bold">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>پشتیبانی آنلاین گفتینو</span>
            </div>
            <button onClick={() => setIsPreviewOpen(false)} className="hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Stream */}
          <div className="p-3 space-y-3 h-64 overflow-y-auto bg-[#101010]">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg max-w-[85%] space-y-0.5 ${
                  msg.sender === 'شما'
                    ? 'mr-auto bg-emerald-600 text-white text-left dir-ltr'
                    : 'ml-auto bg-[#222] text-gray-200 border border-[#333] dir-rtl text-right'
                }`}
              >
                <span className="text-[10px] opacity-75 font-semibold block">{msg.sender}</span>
                <p>{msg.text}</p>
                <span className="text-[9px] opacity-60 block font-mono">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendChatMsg} className="p-2 bg-[#181818] border-t border-[#333] flex items-center gap-2">
            <input
              type="text"
              placeholder="پیام خود را بنویسید..."
              value={userMsgInput}
              onChange={(e) => setUserMsgInput(e.target.value)}
              className="flex-1 bg-[#101010] border border-[#333] p-2 text-white rounded-lg focus:outline-none"
            />
            <button type="submit" className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
