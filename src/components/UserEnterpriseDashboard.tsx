import React from 'react';
import {
  Wallet,
  Coins,
  TrendingUp,
  Users,
  ShoppingBag,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  BarChart3,
  Activity,
  Layers
} from 'lucide-react';
import { useEnterprise } from '../context/EnterpriseContext';

export const UserEnterpriseDashboard: React.FC = () => {
  const { wallet, transactions, referralTree, t } = useEnterprise();

  return (
    <div className="space-y-6">
      
      {/* Executive Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Cash Balance */}
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>موجودی کیف پول نقدی</span>
            <div className="p-2 bg-blue-600/10 rounded-lg text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">
              {wallet.cashBalanceToman.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 mr-1">{t('toman')}</span>
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>آماده برداشت آنلاین</span>
          </p>
        </div>

        {/* Stat 2: Shares Count */}
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>تعداد سهام استخر سود</span>
            <div className="p-2 bg-purple-600/10 rounded-lg text-purple-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">
              {wallet.shareBalanceCount}
            </span>
            <span className="text-xs text-gray-400 mr-1">سهم</span>
          </div>
          <p className="text-[11px] text-purple-300 font-mono">
            مشارکت در ۸۰٪ سود ماهانه
          </p>
        </div>

        {/* Stat 3: Monthly Dividend */}
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>سود ماهانه کل دریافت شده</span>
            <div className="p-2 bg-emerald-600/10 rounded-lg text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">
              {wallet.totalDividendsReceivedToman.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 mr-1">{t('toman')}</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-mono">
            اول هر ماه میلادی
          </p>
        </div>

        {/* Stat 4: Downlines */}
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>زیرمجموعه‌های شبکه</span>
            <div className="p-2 bg-amber-600/10 rounded-lg text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">
              {referralTree.totalNetworkCount}
            </span>
            <span className="text-xs text-gray-400 mr-1">نفر فعال</span>
          </div>
          <p className="text-[11px] text-amber-300 font-mono">
            {referralTree.directCount} نفر مستقیم
          </p>
        </div>

      </div>

      {/* Main Visual Analytics Chart & Notification Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Revenue Chart (SVG Curve) */}
        <div className="lg:col-span-8 bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>نمودار روند سودآوری و پورسانت ماهانه (Financial Growth)</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">+۲۴٪ رشد نسبت به ماه گذشته</span>
          </div>

          {/* SVG Visual Chart */}
          <div className="relative bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] h-64 flex items-end justify-between gap-3">
            {[
              { month: 'فروردین', val: 1200000, color: '#3b82f6' },
              { month: 'اردیبهشت', val: 1800000, color: '#3b82f6' },
              { month: 'خرداد', val: 2400000, color: '#3b82f6' },
              { month: 'تیر', val: 3100000, color: '#10b981' },
              { month: 'مرداد', val: 4800000, color: '#f59e0b' }
            ].map((bar, i) => {
              const maxVal = 5000000;
              const heightPercent = Math.min(100, Math.round((bar.val / maxVal) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(bar.val / 1000000).toFixed(1)}M
                  </span>
                  <div
                    style={{ height: `${heightPercent}%`, backgroundColor: bar.color }}
                    className="w-full rounded-t-lg transition-all duration-500 hover:brightness-125 shadow-md"
                  />
                  <span className="text-[11px] font-semibold text-gray-300">{bar.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Notifications Feed */}
        <div className="lg:col-span-4 bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>اعلا‌ن‌ها و پیام‌های سیستم</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-[#181818] p-3 rounded-lg border border-[#2a2a2a] space-y-1">
              <span className="font-bold text-blue-300 block">واریز سود ماهانه استخر</span>
              <p className="text-gray-400 text-[11px]">سود مربوط به اول ماه میلادی به مبلغ ۳,۲۰۰,۰۰۰ تومان به کیف پول نقدی شما اضافه گردید.</p>
              <span className="text-[10px] text-gray-500 font-mono block pt-1">امروز - ۰۸:۰۰</span>
            </div>

            <div className="bg-[#181818] p-3 rounded-lg border border-[#2a2a2a] space-y-1">
              <span className="font-bold text-emerald-300 block">پورسانت ارجاع جدید</span>
              <p className="text-gray-400 text-[11px]">کاربر «مریم کاظمی» دوره جدیدی ثبت کرد. پورسانت سطح ۱ شما واریز شد.</p>
              <span className="text-[10px] text-gray-500 font-mono block pt-1">دیروز - ۱۴:۲۲</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Ledger Summary */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-sm">آخرین تراکنش‌های ثبت‌شده دفترکل (Ledger Audit)</h3>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg overflow-hidden text-xs">
          <table className="w-full text-right">
            <thead className="bg-[#202020] text-gray-400 border-b border-[#333]">
              <tr>
                <th className="p-3">کد ارجاع</th>
                <th className="p-3">تاریخ</th>
                <th className="p-3">نوع</th>
                <th className="p-3">مبلغ (تومان)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {transactions.slice(0, 3).map((tx) => (
                <tr key={tx.id} className="hover:bg-[#222]">
                  <td className="p-3 font-mono text-gray-400">{tx.referenceId}</td>
                  <td className="p-3 font-mono text-gray-300">{tx.createdDate}</td>
                  <td className="p-3 font-bold text-blue-300">{tx.type}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{tx.amountToman.toLocaleString()} تومان</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
