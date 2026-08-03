export type Language = 'fa' | 'en' | 'ar';

export interface TranslationDictionary {
  [key: string]: {
    fa: string;
    en: string;
    ar: string;
  };
}

export const translations: TranslationDictionary = {
  // Common Navigation
  appTitle: {
    fa: 'پلتفرم جامع Enterprise SaaS',
    en: 'Enterprise SaaS Platform',
    ar: 'منصة المؤسسات Enterprise SaaS'
  },
  driveWorkspace: {
    fa: 'مدیریت پروژه و کد',
    en: 'Code & Drive Workspace',
    ar: 'مساحة عمل الملفات والکود'
  },
  liveClass: {
    fa: 'کلاس آنلاین و ترجمه همزمان AI',
    en: 'Live Class & AI Subtitles',
    ar: 'الفصل المباشر والترجمة الفورية'
  },
  teacherWhiteLabel: {
    fa: 'وایتبل اساتید (White Label)',
    en: 'Teacher White Label',
    ar: 'العلامة البيضاء للمعلمين'
  },
  walletAndPackages: {
    fa: 'کیف پول و پکیج‌های سهام',
    en: 'Wallet & Share Packages',
    ar: 'المحفظة وباقات الأسهم'
  },
  sharePool: {
    fa: 'استخر سود سهامداران (Share Pool)',
    en: 'Share Pool Dividends',
    ar: 'مجمع أسهم الأرباح'
  },
  referralTree: {
    fa: 'شبکه زیرمجموعه‌گیری (Referral)',
    en: 'Referral Network Tree',
    ar: 'شجرة الإحالة والعمولات'
  },
  userDashboard: {
    fa: 'داشبورد کاربری',
    en: 'User Dashboard',
    ar: 'لوحة تحكم المستخدم'
  },
  adminPanel: {
    fa: 'پنل مدیریت ارشد',
    en: 'Enterprise Admin Panel',
    ar: 'لوحة التحكم الإدارية'
  },
  goftinoChat: {
    fa: 'پشتیبانی آنلاین (گفتینو)',
    en: 'Live Chat (Goftino)',
    ar: 'الدعم المباشر'
  },

  // Wallet Labels
  cashWallet: {
    fa: 'کیف پول نقدی (Cash Wallet)',
    en: 'Cash Wallet',
    ar: 'المحفظة النقدية'
  },
  shareWallet: {
    fa: 'کیف پول سهام (Share Wallet)',
    en: 'Share Wallet',
    ar: 'محفظة الأسهم'
  },
  toman: {
    fa: 'تومان',
    en: 'Toman',
    ar: 'تومان'
  },
  shares: {
    fa: 'سهم',
    en: 'Shares',
    ar: 'أسهم'
  },
  chargeWallet: {
    fa: 'شارژ کیف پول',
    en: 'Charge Wallet',
    ar: 'شحن المحفظة'
  },
  buyPackage: {
    fa: 'خرید پکیج سهام',
    en: 'Buy Share Package',
    ar: 'شراء باقة الأسهم'
  },
  recentTransactions: {
    fa: 'تراکنش‌های اخیر دفترکل',
    en: 'Recent Ledger Transactions',
    ar: 'المعاملات الأخيرة'
  },

  // Share Pool
  poolBalance: {
    fa: 'موجودی کل استخر سود',
    en: 'Total Share Pool Balance',
    ar: 'إجمالي رصيد مجمع الأرباح'
  },
  monthlyDividend: {
    fa: 'سود پرداختی این ماه',
    en: 'Monthly Dividend Distributed',
    ar: 'الأرباح الشهرية الموزعة'
  },
  calculateDividends: {
    fa: 'محاسبه و تقسیم دستی سود استخر',
    en: 'Trigger Manual Dividend Split',
    ar: 'حساب وتوزيع الأرباح يدوياً'
  },

  // Referral
  directDownlines: {
    fa: 'زیرمجموعه‌های مستقیم',
    en: 'Direct Referrals',
    ar: 'الإحالات المباشرة'
  },
  networkVolume: {
    fa: 'حجم فروش شبکه',
    en: 'Network Sales Volume',
    ar: 'حجم مبيعات الشبكة'
  },

  // Live Class AI
  speechToText: {
    fa: 'تبدیل گفتار به متن و ترجمه همزمان',
    en: 'Speech-to-Text & Realtime AI Subtitles',
    ar: 'تحويل الصوت إلى نص والترجمة الفورية'
  },
  startClassStream: {
    fa: 'شروع استریم کلاس',
    en: 'Start Class Stream',
    ar: 'بدء بث الفصل'
  },
  stopClassStream: {
    fa: 'پایان استریم',
    en: 'Stop Stream',
    ar: 'إيقاف البث'
  },
  downloadTranscript: {
    fa: 'دانلود متن کامل (Transcript)',
    en: 'Download Full Transcript',
    ar: 'تحميل التفريغ النصي الكامل'
  },

  // White label
  subdomainReady: {
    fa: 'دامنه اختصاصی فعال',
    en: 'Custom Subdomain Active',
    ar: 'النطاق الفرعي المخصص نشط'
  },
  generateApk: {
    fa: 'ساخت APK اختصاصی اندروید',
    en: 'Generate Custom Android APK',
    ar: 'إنشاء تطبيق APK مخصص'
  },
  subscriptionRequired: {
    fa: 'نیازمند اشتراک فعال استاد',
    en: 'Active Teacher Subscription Required',
    ar: 'يتطلب اشتراك معلم نشط'
  },

  // Admin
  systemLogs: {
    fa: 'لاگ‌های سیستم و Audit Trail',
    en: 'System Audit Trail Logs',
    ar: 'سجلات تدقيق النظام'
  },
  backgroundJobs: {
    fa: 'تسک‌های زمان‌بندی شده (Hangfire/Quartz)',
    en: 'Scheduled Background Jobs',
    ar: 'المهام المجدولة في الخلفية'
  }
};

export function getTranslation(key: string, lang: Language): string {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return key;
}
