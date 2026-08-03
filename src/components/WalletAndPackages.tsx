import React, { useState } from 'react';
import {
  Wallet,
  Coins,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  ShoppingBag,
  History,
  CheckCircle2,
  ShieldAlert,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { useEnterprise } from '../context/EnterpriseContext';
import { WalletPackage } from '../types';

export const WalletAndPackages: React.FC = () => {
  const { wallet, transactions, packages, chargeCashWallet, purchasePackage, t, userRole } = useEnterprise();
  
  const [chargeAmountInput, setChargeAmountInput] = useState<string>('5000000');
  const [isChargeModalOpen, setIsChargeModalOpen] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const handleChargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(chargeAmountInput, 10);
    if (isNaN(val) || val <= 0) {
      alert('لطفاً مبلغ معتبری وارد کنید.');
      return;
    }
    chargeCashWallet(val, 'شارژ مستقیم کیف پول نقدی (درگاه شتاب)');
    setIsChargeModalOpen(false);
  };

  const handleBuyPkg = (pkg: WalletPackage) => {
    const success = purchasePackage(pkg);
    if (success) {
      alert(`پکیج ${pkg.titleFa} با موفقیت خریداری شد و تعداد ${pkg.shareCount} سهم به کیف پول شما اضافه گردید.`);
    } else {
      alert('موجودی کیف پول نقدی شما برای خرید این پکیج کافی نیست. ابتدا کیف پول خود را شارژ فرمایید.');
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedCategoryFilter === 'ALL') return true;
    return tx.type === selectedCategoryFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Cash Wallet Balance */}
        <div className="bg-gradient-to-br from-[#121824] to-[#1a2333] border border-blue-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-blue-300 font-semibold">{t('cashWallet')}</span>
            <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-white font-mono">
              {wallet.cashBalanceToman.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 mr-1.5">{t('toman')}</span>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-500/20 flex items-center justify-between text-xs">
            <button
              onClick={() => setIsChargeModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('chargeWallet')}</span>
            </button>
            <span className="text-[11px] text-gray-400">تراکنش‌های اتمیک پایا</span>
          </div>
        </div>

        {/* Card 2: Share Wallet Balance */}
        <div className="bg-gradient-to-br from-[#1d162a] to-[#281b3d] border border-purple-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-purple-300 font-semibold">{t('shareWallet')}</span>
            <div className="p-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-white font-mono">
              {wallet.shareBalanceCount}
            </span>
            <span className="text-xs text-gray-400 mr-1.5">{t('shares')}</span>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-500/20 text-[11px] text-purple-300 flex items-center justify-between">
            <span>سود سهام ماهانه فعلی:</span>
            <span className="font-bold text-amber-300">فعال در استخر سود</span>
          </div>
        </div>

        {/* Card 3: Total Dividends Earned */}
        <div className="bg-gradient-to-br from-[#12221b] to-[#1a3328] border border-emerald-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-emerald-300 font-semibold">کل سود دریافتی از استخر</span>
            <div className="p-2 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-white font-mono">
              {wallet.totalDividendsReceivedToman.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 mr-1.5">{t('toman')}</span>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-300">
            واریز خودکار در اول هر ماه میلادی
          </div>
        </div>

        {/* Card 4: Referral Commissions Earned */}
        <div className="bg-gradient-to-br from-[#241a12] to-[#382618] border border-amber-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-amber-300 font-semibold">مجموع پورسانت زیرمجموعه‌ها</span>
            <div className="p-2 bg-amber-600/20 border border-amber-500/30 rounded-lg text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-white font-mono">
              {wallet.totalReferralCommissionsToman.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 mr-1.5">{t('toman')}</span>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] text-amber-300">
            ارتقای خودکار به کیف پول نقدی
          </div>
        </div>

      </div>

      {/* Wallet Packages Section (Module 6) */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>پکیج‌های سرمایه‌گذاری سهام (Wallet Investment Packages)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              خرید سهم از استخر سود ماهانه شرکت - افزایش سود پرداختی در اول هر ماه میلادی
            </p>
          </div>
          <span className="text-xs px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full font-mono">
            نرخ پایه: ۴۰۰,۰۰۰ تومان = ۱ سهم
          </span>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-[#181818] border border-[#2c2c2c] hover:border-amber-500/50 rounded-xl p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {pkg.badgeTag || 'ویژه'}
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono">ID: {pkg.id}</span>
                </div>

                <h3 className="font-extrabold text-white text-sm mb-1">{pkg.titleFa}</h3>
                <p className="text-xs text-gray-400">{pkg.shareCount} سهم اختصاصی استخر سود</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#262626]">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-400">مبلغ پکیج:</span>
                  <div>
                    <span className="text-lg font-black text-amber-300 font-mono">
                      {pkg.priceToman.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 mr-1">تومان</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBuyPkg(pkg)}
                  className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('buyPackage')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Ledger Table (Module 4) */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">{t('recentTransactions')}</h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg border border-[#333] text-xs">
            <button
              onClick={() => setSelectedCategoryFilter('ALL')}
              className={`px-3 py-1 rounded-md font-bold ${
                selectedCategoryFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('DEPOSIT')}
              className={`px-3 py-1 rounded-md font-bold ${
                selectedCategoryFilter === 'DEPOSIT' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              شارژ
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('SHARE_POOL_DIVIDEND')}
              className={`px-3 py-1 rounded-md font-bold ${
                selectedCategoryFilter === 'SHARE_POOL_DIVIDEND' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              سود سهام
            </button>
            <button
              onClick={() => setSelectedCategoryFilter('PACKAGE_PURCHASE')}
              className={`px-3 py-1 rounded-md font-bold ${
                selectedCategoryFilter === 'PACKAGE_PURCHASE' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              خرید پکیج
            </button>
          </div>
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#202020] text-gray-400 font-semibold border-b border-[#333]">
              <tr>
                <th className="p-3">کد تراکنش</th>
                <th className="p-3">تاریخ و زمان</th>
                <th className="p-3">نوع تراکنش</th>
                <th className="p-3">توضیحات</th>
                <th className="p-3">تغییر سهام</th>
                <th className="p-3">مبلغ (تومان)</th>
                <th className="p-3">موجودی پس از تراکنش</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredTransactions.map((tx) => {
                const isPositive = tx.amountToman > 0;
                return (
                  <tr key={tx.id} className="hover:bg-[#222] transition-colors">
                    <td className="p-3 font-mono text-gray-400 text-[11px]">{tx.referenceId}</td>
                    <td className="p-3 text-gray-300 font-mono text-[11px]">{tx.createdDate}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#262626] text-blue-300 border border-[#333]">
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 text-gray-200 font-medium">{tx.description}</td>
                    <td className="p-3 font-mono text-purple-300">
                      {tx.sharesChanged > 0 ? `+${tx.sharesChanged} سهم` : '-'}
                    </td>
                    <td className={`p-3 font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? `+${tx.amountToman.toLocaleString()}` : tx.amountToman.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-gray-300">
                      {tx.balanceAfterToman.toLocaleString()} تومان
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charge Wallet Modal */}
      {isChargeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#333] rounded-xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-400" />
                <span>شارژ کیف پول نقدی (درگاه بانکی)</span>
              </h3>
              <button onClick={() => setIsChargeModalOpen(false)} className="text-gray-400 hover:text-white text-base">
                ✕
              </button>
            </div>

            <form onSubmit={handleChargeSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">مبلغ شارژ به تومان:</label>
                <input
                  type="number"
                  value={chargeAmountInput}
                  onChange={(e) => setChargeAmountInput(e.target.value)}
                  className="w-full bg-[#101010] border border-[#333] p-2.5 text-white font-mono rounded-lg focus:outline-none focus:border-blue-500 text-left dir-ltr text-sm font-bold"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChargeAmountInput('1000000')}
                  className="p-2 bg-[#222] hover:bg-[#333] text-gray-200 rounded border border-[#333]"
                >
                  ۱,۰۰۰,۰۰۰ تومان
                </button>
                <button
                  type="button"
                  onClick={() => setChargeAmountInput('5000000')}
                  className="p-2 bg-[#222] hover:bg-[#333] text-gray-200 rounded border border-[#333]"
                >
                  ۵,۰۰۰,۰۰۰ تومان
                </button>
                <button
                  type="button"
                  onClick={() => setChargeAmountInput('20000000')}
                  className="p-2 bg-[#222] hover:bg-[#333] text-gray-200 rounded border border-[#333]"
                >
                  ۲۰,۰۰۰,۰۰۰ تومان
                </button>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition-colors"
                >
                  تایید و پرداخت آنی
                </button>
                <button
                  type="button"
                  onClick={() => setIsChargeModalOpen(false)}
                  className="px-4 py-2.5 bg-[#252525] text-gray-300 rounded-lg"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
