import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  Percent,
  Play,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Sliders,
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import { useEnterprise } from '../context/EnterpriseContext';

export const SharePoolDashboard: React.FC = () => {
  const { sharePool, triggerSharePoolDividend, updateSharePoolPercentages, userRole, t } = useEnterprise();
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastSplitResult, setLastSplitResult] = useState<number | null>(null);

  const [ruleInput, setRuleInput] = useState(sharePool.rulePercentages);

  const handleManualTrigger = async () => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید محاسبه و تقسیم سود استخر را به صورت دستی اجرا کنید؟')) {
      return;
    }
    setIsProcessing(true);
    try {
      const distributedAmount = await triggerSharePoolDividend();
      setLastSplitResult(distributedAmount);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSavePercentages = (e: React.FormEvent) => {
    e.preventDefault();
    updateSharePoolPercentages(ruleInput);
    alert('درصدهای تخصیص ورودی استخر سود با موفقیت به‌روزرسانی شدند.');
  };

  const perShareEst = sharePool.totalSharesInCirculation > 0
    ? Math.round((sharePool.totalPoolBalanceToman * 0.8) / sharePool.totalSharesInCirculation)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Overview Cards Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-gradient-to-br from-[#1c182d] to-[#2b1f48] border border-amber-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-amber-300 font-semibold">{t('poolBalance')}</span>
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
              <PieIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-white font-mono">
              {sharePool.totalPoolBalanceToman.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 mr-1.5">{t('toman')}</span>
          </div>
          <p className="text-[11px] text-amber-200/80 mt-3 border-t border-amber-500/20 pt-2">
            انباشت خودکار درصد تمام خریدها و شارژهای پلتفرم
          </p>
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-blue-300 font-semibold">تعداد کل سهام فعال سیستم</span>
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-white font-mono">
              {sharePool.totalSharesInCirculation.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 mr-1.5">سهم خریدارشده</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-3 border-t border-[#262626] pt-2">
            سود تخمینی هر سهم این ماه: <b className="text-amber-300 font-mono">{perShareEst.toLocaleString()} تومان</b>
          </p>
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-emerald-300 font-semibold">تاریخ آخرین تقسیم سود</span>
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xl font-bold text-white font-mono">
              {sharePool.lastDistributionDate || 'نامشخص'}
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/80 mt-3 border-t border-[#262626] pt-2">
            زمان‌بندی بعدی: اول ماه میلادی آینده (ساعت ۰۰:۰۱)
          </p>
        </div>

      </div>

      {/* Manual Admin Distribution Trigger Section */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">تسک محاسبه و واریز خودکار سود (Share Pool Job)</h2>
              <p className="text-xs text-gray-400">
                این تسک روز اول هر ماه میلادی اجرا شده و ۸۰٪ موجودی استخر را بر اساس تعداد سهام به کیف پول کاربران واریز می‌کند.
              </p>
            </div>
          </div>

          <button
            onClick={handleManualTrigger}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-lg shadow-lg flex items-center gap-2 transition-all shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isProcessing ? 'در حال محاسبه سهمیه سهامداران...' : t('calculateDividends')}</span>
          </button>
        </div>

        {lastSplitResult !== null && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-200 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block">تقسیم سود با موفقیت اجرا شد!</span>
              <span>
                مبلغ کل <b>{lastSplitResult.toLocaleString()} تومان</b> بین تمام سهامداران فعال به تناسب سهم واریز گردید.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Admin Rules & Input Percentages (Module 5) */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-[#262626] pb-3">
          <Sliders className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white">تنظیم درصد واریزی به استخر سود (قوانین ادمین)</h2>
        </div>

        <form onSubmit={handleSavePercentages} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] space-y-2">
            <label className="block text-gray-300 font-semibold">خرید دوره آموزشی (Course Purchase):</label>
            <div className="flex items-center dir-ltr">
              <input
                type="number"
                value={ruleInput.coursePercentage}
                onChange={(e) => setRuleInput({ ...ruleInput, coursePercentage: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#101010] border border-[#333] p-2 text-white font-mono rounded-l-lg text-center font-bold"
              />
              <span className="bg-[#222] border border-l-0 border-[#333] px-3 py-2 text-gray-400 rounded-r-lg font-bold">%</span>
            </div>
            <span className="text-[10px] text-gray-500 block">درصد از هر خرید دوره وارد استخر می‌شود</span>
          </div>

          <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] space-y-2">
            <label className="block text-gray-300 font-semibold">شارژ کیف پول (Wallet Charge):</label>
            <div className="flex items-center dir-ltr">
              <input
                type="number"
                value={ruleInput.walletChargePercentage}
                onChange={(e) => setRuleInput({ ...ruleInput, walletChargePercentage: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#101010] border border-[#333] p-2 text-white font-mono rounded-l-lg text-center font-bold"
              />
              <span className="bg-[#222] border border-l-0 border-[#333] px-3 py-2 text-gray-400 rounded-r-lg font-bold">%</span>
            </div>
            <span className="text-[10px] text-gray-500 block">درصد مستقیم از شارژ کیف پول</span>
          </div>

          <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] space-y-2">
            <label className="block text-gray-300 font-semibold">اشتراک اساتید (Subscription):</label>
            <div className="flex items-center dir-ltr">
              <input
                type="number"
                value={ruleInput.subscriptionPercentage}
                onChange={(e) => setRuleInput({ ...ruleInput, subscriptionPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#101010] border border-[#333] p-2 text-white font-mono rounded-l-lg text-center font-bold"
              />
              <span className="bg-[#222] border border-l-0 border-[#333] px-3 py-2 text-gray-400 rounded-r-lg font-bold">%</span>
            </div>
            <span className="text-[10px] text-gray-500 block">درصد از تمدید ماهانه وایتبل اساتید</span>
          </div>

          <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] space-y-2">
            <label className="block text-gray-300 font-semibold">عضویت ویژه (Membership):</label>
            <div className="flex items-center dir-ltr">
              <input
                type="number"
                value={ruleInput.membershipPercentage}
                onChange={(e) => setRuleInput({ ...ruleInput, membershipPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#101010] border border-[#333] p-2 text-white font-mono rounded-l-lg text-center font-bold"
              />
              <span className="bg-[#222] border border-l-0 border-[#333] px-3 py-2 text-gray-400 rounded-r-lg font-bold">%</span>
            </div>
            <span className="text-[10px] text-gray-500 block">درصد از پلن‌های وی‌آی‌پی کاربران</span>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ذخیره فرمول و درصد جدید استخر سود</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
