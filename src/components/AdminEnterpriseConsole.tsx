import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Globe,
  Wallet,
  PieChart,
  ShoppingBag,
  GitFork,
  FileText,
  Clock,
  Settings,
  Edit,
  Trash2,
  CheckCircle2,
  PlusCircle,
  Play
} from 'lucide-react';
import { useEnterprise } from '../context/EnterpriseContext';
import { WalletPackage } from '../types';

export const AdminEnterpriseConsole: React.FC = () => {
  const {
    packages,
    updateWalletPackage,
    sharePool,
    triggerSharePoolDividend,
    auditLogs,
    teacherConfig,
    t
  } = useEnterprise();

  const [activeTab, setActiveTab] = useState<
    'users' | 'packages' | 'sharepool' | 'teachers' | 'logs' | 'jobs'
  >('users');

  const [editingPkg, setEditingPkg] = useState<WalletPackage | null>(null);

  // Background Jobs Status Data
  const [backgroundJobs] = useState([
    {
      id: 'job-1',
      jobName: 'MonthlySharePoolDividendJob',
      cronSchedule: '0 0 1 * *',
      lastRunAt: '2026-08-01 00:00:00',
      nextRunAt: '2026-09-01 00:00:00',
      status: 'SUCCESS',
      executionCount: 24
    },
    {
      id: 'job-2',
      jobName: 'ReferralCommissionReconciliationJob',
      cronSchedule: '0 */6 * * *',
      lastRunAt: '2026-08-03 06:00:00',
      nextRunAt: '2026-08-03 12:00:00',
      status: 'SUCCESS',
      executionCount: 1420
    },
    {
      id: 'job-3',
      jobName: 'TeacherSubscriptionGuardJob',
      cronSchedule: '0 0 * * *',
      lastRunAt: '2026-08-03 00:00:00',
      nextRunAt: '2026-08-04 00:00:00',
      status: 'SUCCESS',
      executionCount: 365
    }
  ]);

  const handleEditPkgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPkg) {
      updateWalletPackage(editingPkg);
      setEditingPkg(null);
      alert('پکیج با موفقیت بروزرسانی شد.');
    }
  };

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-600/10 border border-rose-500/30 rounded-lg text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>پنل مدیریت ارشد Enterprise Admin Panel</span>
            </h2>
            <p className="text-xs text-gray-400">
              مدیریت تمام ۱۰ ماژول سیستم: کاربران، نقش‌ها، کیف پول، استخر سود، پکیج‌ها، زیرمجموعه‌ها، لاگ‌ها و تسک‌ها
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#262626] pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>مدیریت کاربران و دسترسی‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 ${
            activeTab === 'packages' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>مدیریت پکیج‌های کیف پول</span>
        </button>

        <button
          onClick={() => setActiveTab('sharepool')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 ${
            activeTab === 'sharepool' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>استخر سود (Share Pool)</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 ${
            activeTab === 'teachers' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>تایید وایتبل اساتید</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 ${
            activeTab === 'logs' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>لاگ‌های سیستم (Audit Logs)</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 ${
            activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>تسک‌های پس‌زمینه (Hangfire)</span>
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4 text-xs">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-[#202020] text-gray-400 border-b border-[#333]">
                <tr>
                  <th className="p-3">کاربر</th>
                  <th className="p-3">ایمیل</th>
                  <th className="p-3">نقش</th>
                  <th className="p-3">وضعیت</th>
                  <th className="p-3">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                <tr className="hover:bg-[#222]">
                  <td className="p-3 font-bold text-white">علی رضایی</td>
                  <td className="p-3 font-mono text-gray-300">ali@saas.com</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">Admin</span></td>
                  <td className="p-3 text-emerald-400">فعال</td>
                  <td className="p-3 text-blue-400 hover:underline cursor-pointer">ویرایش دسترسی‌ها</td>
                </tr>
                <tr className="hover:bg-[#222]">
                  <td className="p-3 font-bold text-white">دکتر خسروی</td>
                  <td className="p-3 font-mono text-gray-300">khosravi@saas.com</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Teacher</span></td>
                  <td className="p-3 text-emerald-400">فعال (وایتبل)</td>
                  <td className="p-3 text-blue-400 hover:underline cursor-pointer">ویرایش دسترسی‌ها</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PACKAGES */}
      {activeTab === 'packages' && (
        <div className="space-y-4 text-xs">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-[#202020] text-gray-400 border-b border-[#333]">
                <tr>
                  <th className="p-3">عنوان پکیج</th>
                  <th className="p-3">مبلغ (تومان)</th>
                  <th className="p-3">تعداد سهم</th>
                  <th className="p-3">وضعیت</th>
                  <th className="p-3">عملیات ویرایش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-[#222]">
                    <td className="p-3 font-bold text-white">{pkg.titleFa}</td>
                    <td className="p-3 font-mono text-amber-300 font-bold">{pkg.priceToman.toLocaleString()} تومان</td>
                    <td className="p-3 font-mono text-purple-300">{pkg.shareCount} سهم</td>
                    <td className="p-3 text-emerald-400">{pkg.isActive ? 'فعال' : 'غیرفعال'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setEditingPkg(pkg)}
                        className="px-2.5 py-1 bg-[#333] hover:bg-[#444] text-gray-200 rounded flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3 text-blue-400" />
                        <span>ویرایش</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingPkg && (
            <div className="p-4 bg-[#181818] border border-[#333] rounded-xl space-y-3 max-w-md">
              <h4 className="font-bold text-white">ویرایش پکیج {editingPkg.titleFa}</h4>
              <form onSubmit={handleEditPkgSubmit} className="space-y-3">
                <div>
                  <label className="block text-gray-400 mb-1">مبلغ به تومان:</label>
                  <input
                    type="number"
                    value={editingPkg.priceToman}
                    onChange={(e) => setEditingPkg({ ...editingPkg, priceToman: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#101010] border border-[#333] p-2 text-white font-mono rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">تعداد سهم:</label>
                  <input
                    type="number"
                    value={editingPkg.shareCount}
                    onChange={(e) => setEditingPkg({ ...editingPkg, shareCount: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#101010] border border-[#333] p-2 text-white font-mono rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded">ذخیره</button>
                  <button type="button" onClick={() => setEditingPkg(null)} className="px-4 py-2 bg-[#333] text-gray-300 rounded">انصراف</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SHARE POOL */}
      {activeTab === 'sharepool' && (
        <div className="space-y-4 text-xs">
          <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] space-y-2">
            <h4 className="font-bold text-white">موجودی فعلی استخر سود</h4>
            <p className="text-xl font-black text-amber-300 font-mono">
              {sharePool.totalPoolBalanceToman.toLocaleString()} تومان
            </p>
            <p className="text-gray-400">تعداد سهام در گردش: {sharePool.totalSharesInCirculation} سهم</p>
          </div>
        </div>
      )}

      {/* TAB 4: TEACHERS */}
      {activeTab === 'teachers' && (
        <div className="space-y-4 text-xs">
          <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">{teacherConfig.teacherName}</span>
              <span className="text-gray-400 font-mono">{teacherConfig.subdomain}.saas-academy.com</span>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded border border-emerald-500/30">
              اشتراک فعال تا {teacherConfig.subscriptionExpiresAt}
            </span>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4 text-xs">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-[#202020] text-gray-400 border-b border-[#333]">
                <tr>
                  <th className="p-3">تاریخ و زمان</th>
                  <th className="p-3">کاربر</th>
                  <th className="p-3">عملیات (Action)</th>
                  <th className="p-3">آدرس IP</th>
                  <th className="p-3">جزئیات</th>
                  <th className="p-3">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#222]">
                    <td className="p-3 font-mono text-gray-400 text-[11px]">{new Date(log.timestamp).toLocaleString('fa-IR')}</td>
                    <td className="p-3 font-mono text-blue-300">{log.userEmail}</td>
                    <td className="p-3 font-bold text-white">{log.action}</td>
                    <td className="p-3 font-mono text-gray-400">{log.ipAddress}</td>
                    <td className="p-3 text-gray-300">{log.details}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: BACKGROUND JOBS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4 text-xs">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-[#202020] text-gray-400 border-b border-[#333]">
                <tr>
                  <th className="p-3">نام تسک پس‌زمینه</th>
                  <th className="p-3">زمان‌بندی Cron</th>
                  <th className="p-3">آخرین اجرا</th>
                  <th className="p-3">اجرای بعدی</th>
                  <th className="p-3">تعداد اجرا</th>
                  <th className="p-3">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {backgroundJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#222]">
                    <td className="p-3 font-bold text-white font-mono">{job.jobName}</td>
                    <td className="p-3 font-mono text-amber-300">{job.cronSchedule}</td>
                    <td className="p-3 font-mono text-gray-300">{job.lastRunAt}</td>
                    <td className="p-3 font-mono text-blue-300">{job.nextRunAt}</td>
                    <td className="p-3 font-mono text-gray-400">{job.executionCount} بار</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
