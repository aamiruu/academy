import React, { useState } from 'react';
import {
  Globe,
  Palette,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  FileText,
  Video,
  Layers,
  Settings,
  Download,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useEnterprise } from '../context/EnterpriseContext';

export const TeacherWhiteLabelPortal: React.FC = () => {
  const { teacherConfig, updateTeacherConfig, triggerApkBuild, t } = useEnterprise();
  const [activeTab, setActiveTab] = useState<'branding' | 'menu' | 'apk' | 'preview'>('branding');
  const [isBuildingApk, setIsBuildingApk] = useState<boolean>(false);
  const [downloadApkUrl, setDownloadApkUrl] = useState<string | null>(null);

  const [formConfig, setFormConfig] = useState(teacherConfig);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherConfig(formConfig);
    alert('تنظیمات وایتبل اختصاصی با موفقیت ذخیره و در دامنه منتشر شد.');
  };

  const handleBuildApk = async () => {
    setIsBuildingApk(true);
    setDownloadApkUrl(null);
    try {
      const url = await triggerApkBuild();
      setDownloadApkUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBuildingApk(false);
    }
  };

  const isSubActive = teacherConfig.subscriptionStatus === 'Active';

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-6">
      
      {/* Top Banner & Subscription Guard */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/10 border border-indigo-500/30 rounded-lg text-indigo-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>سیستم وایتبل (White Label) اختصاصی استاد</span>
              {isSubActive ? (
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  اشتراک فعال
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  اشتراک منقضی
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-400">
              مدیریت ساب‌دامنه، برندینگ اختصاصی، رنگ، لوگو، منوی داینامیک و تولید اپلیکیشن APK اندروید
            </p>
          </div>
        </div>

        {/* Live Subdomain Preview Badge */}
        <div className="bg-[#1A1A1A] border border-[#333] px-3.5 py-2 rounded-lg flex items-center gap-3 text-xs">
          <div>
            <span className="text-gray-400 block text-[10px]">آدرس اختصاصی شما:</span>
            <a
              href={`https://${teacherConfig.subdomain}.saas-academy.com`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline font-mono font-bold flex items-center gap-1"
            >
              <span>{teacherConfig.subdomain}.saas-academy.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {!isSubActive && (
        <div className="bg-amber-900/20 border border-amber-600/40 p-4 rounded-lg text-amber-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">توجه: اشتراک وایتبل استاد فعال نیست</span>
            <p>
              برای فعال‌سازی زیردامنه اختصاصی و ساخت اپلیکیشن APK، لطفاً اشتراک ویژه اساتید را تمدید فرمایید. تاریخ انقضای قبلی: {teacherConfig.subscriptionExpiresAt}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#262626] pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'branding'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>هویت بصری و برندینگ</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'menu'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>منوی داینامیک و محتوا</span>
        </button>

        <button
          onClick={() => setActiveTab('apk')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'apk'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>تولید APK اختصاصی</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'preview'
              ? 'bg-indigo-600 text-white shadow-sm font-bold'
              : 'text-indigo-400 hover:text-indigo-300 hover:bg-[#1A1A1A]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>پیش‌نمایش زنده وب‌سایت</span>
        </button>
      </div>

      {/* TAB 1: BRANDING & SEO */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* General Domain & Info */}
            <div className="space-y-4 bg-[#181818] p-4 rounded-xl border border-[#2a2a2a]">
              <h3 className="font-bold text-gray-200 text-sm border-b border-[#2a2a2a] pb-2">تنظیمات ساب‌دامنه و دامنه</h3>
              
              <div>
                <label className="block text-gray-400 mb-1">ساب‌دامنه اختصاصی (Subdomain):</label>
                <div className="flex items-center dir-ltr">
                  <span className="bg-[#222] border border-r-0 border-[#333] px-3 py-2 text-gray-400 rounded-l-lg font-mono">
                    .saas-academy.com
                  </span>
                  <input
                    type="text"
                    value={formConfig.subdomain}
                    onChange={(e) => setFormConfig({ ...formConfig, subdomain: e.target.value })}
                    className="flex-1 bg-[#101010] border border-[#333] p-2 text-white font-mono rounded-r-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">دامنه اختصاصی (Custom Domain):</label>
                <input
                  type="text"
                  placeholder="مثال: myacademy.com"
                  value={formConfig.customDomain || ''}
                  onChange={(e) => setFormConfig({ ...formConfig, customDomain: e.target.value })}
                  className="w-full bg-[#101010] border border-[#333] p-2 text-white font-mono rounded-lg focus:outline-none focus:border-blue-500 dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">عنوان سئو (SEO Title):</label>
                <input
                  type="text"
                  value={formConfig.seoTitle}
                  onChange={(e) => setFormConfig({ ...formConfig, seoTitle: e.target.value })}
                  className="w-full bg-[#101010] border border-[#333] p-2 text-white rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">توضیحات سئو (Meta Description):</label>
                <textarea
                  rows={3}
                  value={formConfig.seoDescription}
                  onChange={(e) => setFormConfig({ ...formConfig, seoDescription: e.target.value })}
                  className="w-full bg-[#101010] border border-[#333] p-2 text-white rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Visual Branding */}
            <div className="space-y-4 bg-[#181818] p-4 rounded-xl border border-[#2a2a2a]">
              <h3 className="font-bold text-gray-200 text-sm border-b border-[#2a2a2a] pb-2">رنگ‌بندی، لوگو و فونت</h3>

              <div>
                <label className="block text-gray-400 mb-1">لینک لوگوی استاد (Logo URL):</label>
                <input
                  type="text"
                  value={formConfig.logoUrl}
                  onChange={(e) => setFormConfig({ ...formConfig, logoUrl: e.target.value })}
                  className="w-full bg-[#101010] border border-[#333] p-2 text-white rounded-lg focus:outline-none focus:border-blue-500 dir-ltr text-left font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">رنگ سازمانی اصلی:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formConfig.brandColor}
                      onChange={(e) => setFormConfig({ ...formConfig, brandColor: e.target.value })}
                      className="w-10 h-10 rounded bg-transparent border border-[#333] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formConfig.brandColor}
                      onChange={(e) => setFormConfig({ ...formConfig, brandColor: e.target.value })}
                      className="flex-1 bg-[#101010] border border-[#333] p-2 text-white font-mono rounded-lg dir-ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">رنگ ثانویه:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formConfig.secondaryColor}
                      onChange={(e) => setFormConfig({ ...formConfig, secondaryColor: e.target.value })}
                      className="w-10 h-10 rounded bg-transparent border border-[#333] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formConfig.secondaryColor}
                      onChange={(e) => setFormConfig({ ...formConfig, secondaryColor: e.target.value })}
                      className="flex-1 bg-[#101010] border border-[#333] p-2 text-white font-mono rounded-lg dir-ltr"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">فونت اختصاصی سایت:</label>
                <select
                  value={formConfig.fontFamily}
                  onChange={(e) => setFormConfig({ ...formConfig, fontFamily: e.target.value })}
                  className="w-full bg-[#101010] border border-[#333] p-2 text-white rounded-lg focus:outline-none"
                >
                  <option value="IRANSans, sans-serif">ایران‌سنس (IRANSans)</option>
                  <option value="Vazirmatn, sans-serif">وزیرمتن (Vazirmatn)</option>
                  <option value="Yekan, sans-serif">یکان (Yekan)</option>
                  <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ذخیره و به‌روزرسانی دامنه اختصاصی</span>
                </button>
              </div>
            </div>

          </div>
        </form>
      )}

      {/* TAB 2: DYNAMIC MENU */}
      {activeTab === 'menu' && (
        <div className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <div>
                <span className="text-gray-400 block text-[11px]">دوره‌های ثبت‌شده</span>
                <span className="text-lg font-black text-white">{teacherConfig.coursesCount} دوره فعال</span>
              </div>
            </div>

            <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-400" />
              <div>
                <span className="text-gray-400 block text-[11px]">مقالات آموزشی</span>
                <span className="text-lg font-black text-white">{teacherConfig.articlesCount} مقاله منتشرشده</span>
              </div>
            </div>

            <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-3">
              <Video className="w-8 h-8 text-rose-400" />
              <div>
                <span className="text-gray-400 block text-[11px]">ویدیوهای کلاس</span>
                <span className="text-lg font-black text-white">{teacherConfig.videosCount} ویدیو</span>
              </div>
            </div>
          </div>

          <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] space-y-4">
            <h3 className="font-bold text-gray-200 text-sm border-b border-[#2a2a2a] pb-2">منوهای داینامیک هدر وب‌سایت</h3>
            <div className="space-y-2">
              {teacherConfig.customMenuItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#121212] p-3 rounded-lg border border-[#333]">
                  <span className="font-semibold text-white">{item.title}</span>
                  <span className="font-mono text-gray-400 text-[11px]">{item.url}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APK BUILDER */}
      {activeTab === 'apk' && (
        <div className="space-y-6 text-xs">
          <div className="bg-[#181818] p-6 rounded-xl border border-[#2a2a2a] space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 border-b border-[#2a2a2a] pb-3">
              <Smartphone className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-bold text-white text-sm">مولد اپلیکیشن اختصاصی اندروید (Android APK Generator)</h3>
                <p className="text-gray-400 text-[11px]">تولید خودکار فایل نصب APK موبایل با اسم و اسپلاش‌اسکرین اختصاصی استاد</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-400 mb-1">نام اپلیکیشن اندروید:</label>
                <input
                  type="text"
                  value={teacherConfig.apkConfig.appName}
                  onChange={(e) =>
                    updateTeacherConfig({
                      ...teacherConfig,
                      apkConfig: { ...teacherConfig.apkConfig, appName: e.target.value }
                    })
                  }
                  className="w-full bg-[#101010] border border-[#333] p-2 text-white rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">نام پکیج اندروید (Package Name):</label>
                <input
                  type="text"
                  value={teacherConfig.apkConfig.packageName}
                  onChange={(e) =>
                    updateTeacherConfig({
                      ...teacherConfig,
                      apkConfig: { ...teacherConfig.apkConfig, packageName: e.target.value }
                    })
                  }
                  className="w-full bg-[#101010] border border-[#333] p-2 text-white font-mono rounded-lg dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">نسخه اپلیکیشن:</label>
                <input
                  type="text"
                  value={teacherConfig.apkConfig.version}
                  onChange={(e) =>
                    updateTeacherConfig({
                      ...teacherConfig,
                      apkConfig: { ...teacherConfig.apkConfig, version: e.target.value }
                    })
                  }
                  className="w-full bg-[#101010] border border-[#333] p-2 text-white font-mono rounded-lg dir-ltr text-left"
                />
              </div>

              <div className="pt-3">
                <button
                  onClick={handleBuildApk}
                  disabled={isBuildingApk || !isSubActive}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  {isBuildingApk ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>در حال کامپایل پروژه اندروید Gradle و تولید APK...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>شروع فرآیند Build و دانلود APK اختصاصی</span>
                    </>
                  )}
                </button>
              </div>

              {downloadApkUrl && (
                <div className="mt-4 p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                  <p className="font-bold">فایل APK اختصاصی با موفقیت بیلد شد!</p>
                  <a
                    href={downloadApkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود مستقیم فایل APK ({teacherConfig.apkConfig.version})</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="text-xs text-gray-400 flex items-center justify-between">
            <span>پیش‌نمایش آنلاین وب‌سایت استاد بر روی ساب‌دامنه <b>{teacherConfig.subdomain}.saas-academy.com</b></span>
            <span className="text-emerald-400 font-mono">Status: HTTP 200 OK</span>
          </div>

          <div
            className="rounded-xl border border-[#333] overflow-hidden p-8 shadow-2xl space-y-8"
            style={{
              backgroundColor: teacherConfig.secondaryColor,
              fontFamily: teacherConfig.fontFamily
            }}
          >
            {/* Header Mockup */}
            <header className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={teacherConfig.logoUrl}
                  alt="Logo"
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <span className="font-bold text-white text-base">{teacherConfig.teacherName}</span>
              </div>

              <nav className="hidden sm:flex items-center gap-6 text-xs text-gray-300">
                {teacherConfig.customMenuItems.map((m, i) => (
                  <span key={i} className="hover:text-white cursor-pointer">{m.title}</span>
                ))}
              </nav>

              <button
                className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-md"
                style={{ backgroundColor: teacherConfig.brandColor }}
              >
                ورود به آکادمی
              </button>
            </header>

            {/* Hero Mockup */}
            <div className="text-center space-y-4 py-8">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{teacherConfig.seoTitle}</h1>
              <p className="text-xs text-gray-300 max-w-xl mx-auto">{teacherConfig.seoDescription}</p>
              <div className="pt-2">
                <button
                  className="px-6 py-3 rounded-xl font-bold text-white text-xs shadow-lg"
                  style={{ backgroundColor: teacherConfig.brandColor }}
                >
                  مشاهده دوره‌ها ({teacherConfig.coursesCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
