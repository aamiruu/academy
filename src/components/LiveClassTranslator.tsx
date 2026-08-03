import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Globe,
  Download,
  Sparkles,
  Volume2,
  FileText,
  Play,
  Square,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useEnterprise } from '../context/EnterpriseContext';
import { SubtitleChunk } from '../types';

export const LiveClassTranslator: React.FC = () => {
  const { t, language } = useEnterprise();
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [selectedAiProvider, setSelectedAiProvider] = useState<string>('gemini-3.6-flash');
  const [targetLang, setTargetLang] = useState<'fa' | 'en' | 'ar'>('fa');
  const [subtitles, setSubtitles] = useState<SubtitleChunk[]>([
    {
      id: 'sub-1',
      speaker: 'استاد خسروی (مدرس)',
      originalText: 'Welcome to today’s advanced Clean Architecture session. We will cover CQRS and MediatR event handlers.',
      translatedTextFa: 'به جلسه پیشرفته معماری Clean خوش آمدید. امروز الگوی CQRS و جابجایی رویدادهای MediatR را بررسی می‌کنیم.',
      translatedTextEn: 'Welcome to today’s advanced Clean Architecture session. We will cover CQRS and MediatR event handlers.',
      translatedTextAr: 'مرحباً بكم في جلسة الهندسة النظيفة المتقدمة اليوم. سنغطي نمط CQRS ومطالبات MediatR.',
      timestamp: '10:14:02',
      confidence: 0.98
    },
    {
      id: 'sub-2',
      speaker: 'استاد خسروی (مدرس)',
      originalText: 'Every query must be optimized with AsNoTracking and projection in Entity Framework Core.',
      translatedTextFa: 'تمام کوئری‌های خواندن باید با AsNoTracking و پروجکشن در Entity Framework Core بهینه‌سازی شوند.',
      translatedTextEn: 'Every query must be optimized with AsNoTracking and projection in Entity Framework Core.',
      translatedTextAr: 'يجب تحسين كل استعلام قراءة باستخدام AsNoTracking والإسقاط في Entity Framework Core.',
      timestamp: '10:14:15',
      confidence: 0.96
    }
  ]);

  const [activeSubtitle, setActiveSubtitle] = useState<SubtitleChunk | null>(subtitles[subtitles.length - 1]);

  // Simulate real-time streaming incoming audio transcripts
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      const sampleSentences = [
        {
          original: 'Domain Driven Design ensures bounded contexts remain decoupled and clean.',
          fa: 'طراحی دامنه‌محور (DDD) تضمین می‌کند که Bounded Contextها کاملاً مجزا و تمیز باقی بمانند.',
          en: 'Domain Driven Design ensures bounded contexts remain decoupled and clean.',
          ar: 'يضمن التصميم الموجه بالمجال (DDD) بقاء السياقات المحدودة منفصلة ونظيفة.'
        },
        {
          original: 'SignalR streams live audio transcription chunks directly to all connected students.',
          fa: 'سیگنال‌آر (SignalR) تکه‌های ترنسکریپت زنده را مستقیماً به تمام دانشجویان آنلاین استریم می‌کند.',
          en: 'SignalR streams live audio transcription chunks directly to all connected students.',
          ar: 'يقوم SignalR ببث أجزاء التفريغ الصوتي المباشر مباشرة إلى جميع الطلاب المتصلين.'
        },
        {
          original: 'The Share Pool distributes 80 percent of monthly profits to active token shareholders.',
          fa: 'استخر سود (Share Pool) ۸۰ درصد از سود ماهانه را بین دارندگان سهام فعال تقسیم می‌کند.',
          en: 'The Share Pool distributes 80 percent of monthly profits to active token shareholders.',
          ar: 'يوزع مجمع الأسهم 80 بالمائة من الأرباح الشهرية على المساهمين النشطين.'
        }
      ];

      let count = 0;
      interval = setInterval(() => {
        const item = sampleSentences[count % sampleSentences.length];
        const newChunk: SubtitleChunk = {
          id: 'sub-' + Date.now(),
          speaker: 'استاد خسروی (زنده)',
          originalText: item.original,
          translatedTextFa: item.fa,
          translatedTextEn: item.en,
          translatedTextAr: item.ar,
          timestamp: new Date().toLocaleTimeString(),
          confidence: 0.99
        };

        setSubtitles((prev) => [...prev, newChunk]);
        setActiveSubtitle(newChunk);
        count++;
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Download Transcript as file
  const handleDownloadTranscript = () => {
    const textContent = subtitles
      .map(
        (s) =>
          `[${s.timestamp}] ${s.speaker}:\nاصلی: ${s.originalText}\nترجمه: ${s.translatedTextFa}\n---`
      )
      .join('\n\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Class_Transcript_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{t('speechToText')}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                SignalR Realtime
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              ترجمه همزمان و زیرنویس زنده کلاس‌های آنلاین با استفاده از هوش مصنوعی Gemini و پردازش صوت
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
              isStreaming
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isStreaming ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>{t('stopClassStream')}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{t('startClassStream')}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadTranscript}
            className="px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333] text-gray-200 text-xs rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">{t('downloadTranscript')}</span>
          </button>
        </div>
      </div>

      {/* Configuration Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#181818] p-3.5 rounded-lg border border-[#2a2a2a] text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>موتور هوش مصنوعی:</span>
          </span>
          <select
            value={selectedAiProvider}
            onChange={(e) => setSelectedAiProvider(e.target.value)}
            className="bg-[#101010] border border-[#333] text-gray-200 text-xs rounded px-2.5 py-1 focus:outline-none focus:border-blue-500"
          >
            <option value="gemini-3.6-flash">Google Gemini 3.6 Flash (Fast)</option>
            <option value="gemini-2.5-pro">Google Gemini 2.5 Pro (Deep)</option>
            <option value="deepmind-audio">DeepMind Audio Live API</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>زبان مقصد زیرنویس:</span>
          </span>
          <div className="flex items-center gap-1 bg-[#101010] p-1 rounded border border-[#333]">
            <button
              onClick={() => setTargetLang('fa')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                targetLang === 'fa' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              فارسی (FA)
            </button>
            <button
              onClick={() => setTargetLang('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                targetLang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              English (EN)
            </button>
            <button
              onClick={() => setTargetLang('ar')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                targetLang === 'ar' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              العربية (AR)
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>وضعیت اتصال:</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>SignalR Connected</span>
          </span>
        </div>
      </div>

      {/* Main Live Subtitle Display Box */}
      <div className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-blue-900/50 rounded-xl p-6 min-h-[160px] flex flex-col justify-center items-center text-center shadow-inner overflow-hidden">
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-blue-400" />
            <span>Live Class Stream</span>
          </span>
        </div>

        {activeSubtitle ? (
          <div className="space-y-3 max-w-3xl">
            <p className="text-sm text-gray-400 font-mono italic">
              "{activeSubtitle.originalText}"
            </p>
            <p className="text-xl sm:text-2xl font-black text-amber-300 leading-snug tracking-wide dir-rtl">
              {targetLang === 'fa' && activeSubtitle.translatedTextFa}
              {targetLang === 'en' && activeSubtitle.translatedTextEn}
              {targetLang === 'ar' && activeSubtitle.translatedTextAr}
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 font-mono pt-2">
              <span>گوینده: {activeSubtitle.speaker}</span>
              <span>•</span>
              <span>زمان: {activeSubtitle.timestamp}</span>
              <span>•</span>
              <span className="text-emerald-400">دقت هوش مصنوعی: {(activeSubtitle.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">برای مشاهده زیرنویس زنده، دکمه «شروع استریم کلاس» را فشار دهید.</p>
        )}
      </div>

      {/* Historical Transcript Log Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>تاریخچه کامل گفتار و ترجمه کلاس (Transcript History)</span>
        </h3>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg overflow-hidden max-h-[260px] overflow-y-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#202020] text-gray-400 font-semibold sticky top-0 border-b border-[#333]">
              <tr>
                <th className="p-3">زمان</th>
                <th className="p-3">گوینده</th>
                <th className="p-3">متن انگلیسی (صوت ورودی)</th>
                <th className="p-3">ترجمه هوشمند AI (مقصد)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {subtitles.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#222] transition-colors">
                  <td className="p-3 font-mono text-gray-400 text-[11px]">{sub.timestamp}</td>
                  <td className="p-3 font-semibold text-blue-300 whitespace-nowrap">{sub.speaker}</td>
                  <td className="p-3 text-gray-300 dir-ltr text-left font-mono text-[11px]">{sub.originalText}</td>
                  <td className="p-3 font-medium text-amber-200">
                    {targetLang === 'fa' && sub.translatedTextFa}
                    {targetLang === 'en' && sub.translatedTextEn}
                    {targetLang === 'ar' && sub.translatedTextAr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
