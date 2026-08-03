import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LanguageCode,
  UserAuth,
  UserWallet,
  TransactionLedger,
  SharePoolState,
  WalletPackage,
  ReferralNode,
  ReferralCommissionLevel,
  TeacherWhiteLabelConfig,
  GoftinoSettings,
  LiveClassSession,
  SystemAuditLog
} from '../types';
import { getTranslation } from '../i18n';

interface EnterpriseContextType {
  // Language & Direction
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;

  // User & Auth
  auth: UserAuth;
  setAuth: (auth: UserAuth) => void;
  userRole: 'Admin' | 'Teacher' | 'User';
  setUserRole: (role: 'Admin' | 'Teacher' | 'User') => void;

  // Wallet State
  wallet: UserWallet;
  transactions: TransactionLedger[];
  chargeCashWallet: (amountToman: number, description: string) => void;
  purchasePackage: (pkg: WalletPackage) => boolean;

  // Share Pool State
  sharePool: SharePoolState;
  triggerSharePoolDividend: () => Promise<number>;
  updateSharePoolPercentages: (percentages: {
    coursePercentage: number;
    walletChargePercentage: number;
    subscriptionPercentage: number;
    membershipPercentage: number;
  }) => void;

  // Wallet Packages
  packages: WalletPackage[];
  updateWalletPackage: (pkg: WalletPackage) => void;

  // Referral Network
  referralTree: ReferralNode;
  referralLevels: ReferralCommissionLevel[];
  updateReferralLevels: (levels: ReferralCommissionLevel[]) => void;

  // White Label Teacher Settings
  teacherConfig: TeacherWhiteLabelConfig;
  updateTeacherConfig: (config: Partial<TeacherWhiteLabelConfig>) => void;
  triggerApkBuild: () => Promise<string>;

  // Goftino Live Chat Settings
  goftino: GoftinoSettings;
  updateGoftinoSettings: (settings: Partial<GoftinoSettings>) => void;

  // System Logs
  auditLogs: SystemAuditLog[];
  addAuditLog: (action: string, status: 'SUCCESS' | 'WARNING' | 'FAILED', details: string) => void;
}

const EnterpriseContext = createContext<EnterpriseContextType | undefined>(undefined);

export const EnterpriseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language & Direction
  const [language, setLanguageState] = useState<LanguageCode>('fa');
  const [dir, setDir] = useState<'rtl' | 'ltr'>('rtl');

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    const newDir = lang === 'en' ? 'ltr' : 'rtl';
    setDir(newDir);
    document.documentElement.dir = newDir;
    document.documentElement.lang = lang;
  };

  const t = (key: string) => getTranslation(key, language);

  // Auto-detect browser language on first load
  useEffect(() => {
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === 'en') {
      setLanguage('en');
    } else if (browserLang === 'ar') {
      setLanguage('ar');
    } else {
      setLanguage('fa');
    }
  }, []);

  // 2. Auth State
  const [auth, setAuth] = useState<UserAuth>({
    isAuthenticated: true,
    userId: 'usr-1001',
    userEmail: 'enterprise.user@saas.com',
    userName: 'علی رضایی (کاربر ارشد)',
    userPicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Admin'
  });

  const [userRole, setUserRole] = useState<'Admin' | 'Teacher' | 'User'>('Admin');

  // 3. Dual Wallet & Ledger Initial State
  const [wallet, setWallet] = useState<UserWallet>({
    userId: 'usr-1001',
    cashBalanceToman: 14500000,
    shareBalanceCount: 38,
    totalDividendsReceivedToman: 3200000,
    totalReferralCommissionsToman: 4800000,
    personalPurchasesToman: 21000000,
    networkPurchasesToman: 185000000
  });

  const [transactions, setTransactions] = useState<TransactionLedger[]>([
    {
      id: 'tx-901',
      userId: 'usr-1001',
      userName: 'علی رضایی',
      amountToman: 3200000,
      sharesChanged: 0,
      type: 'SHARE_POOL_DIVIDEND',
      description: 'واریز سود ماهیانه سهامدار (استخر سود اول ماه)',
      referenceId: 'DIV-2026-08',
      createdDate: '2026-08-01 08:00:00',
      balanceAfterToman: 14500000,
      sharesAfter: 38
    },
    {
      id: 'tx-902',
      userId: 'usr-1001',
      userName: 'علی رضایی',
      amountToman: 7000000,
      sharesChanged: 30,
      type: 'PACKAGE_PURCHASE',
      description: 'خرید پکیج سرمایه‌گذاری سهام ۳۰ سهمی',
      referenceId: 'PKG-30-7M',
      createdDate: '2026-07-28 14:22:10',
      balanceAfterToman: 11300000,
      sharesAfter: 38
    },
    {
      id: 'tx-903',
      userId: 'usr-1001',
      userName: 'مریم کاظمی (سطح ۱)',
      amountToman: 850000,
      sharesChanged: 0,
      type: 'REFERRAL_COMMISSION',
      description: 'پورسانت ارجاع خرید دوره آموزشی زیرمجموعه سطح ۱',
      referenceId: 'REF-LVL1-441',
      createdDate: '2026-07-25 11:05:40',
      balanceAfterToman: 18300000,
      sharesAfter: 8
    }
  ]);

  // 4. Share Pool State
  const [sharePool, setSharePool] = useState<SharePoolState>({
    totalPoolBalanceToman: 128500000,
    totalSharesInCirculation: 1420,
    lastDistributionDate: '2026-08-01',
    rulePercentages: {
      coursePercentage: 10,
      walletChargePercentage: 5,
      subscriptionPercentage: 15,
      membershipPercentage: 20
    }
  });

  // 5. Wallet Packages (Module 6)
  const [packages, setPackages] = useState<WalletPackage[]>([
    {
      id: 'pkg-1',
      priceToman: 400000,
      shareCount: 1,
      titleFa: 'پکیج برنزی (۱ سهم)',
      titleEn: 'Bronze Package (1 Share)',
      titleAr: 'الباقة البرونزية (سهم واحد)',
      isActive: true,
      displayOrder: 1,
      badgeTag: 'مبتدی'
    },
    {
      id: 'pkg-2',
      priceToman: 2000000,
      shareCount: 7,
      titleFa: 'پکیج نقره‌ای (۷ سهم)',
      titleEn: 'Silver Package (7 Shares)',
      titleAr: 'الباقة الفضية (۷ أسهم)',
      isActive: true,
      displayOrder: 2,
      badgeTag: 'محبوب'
    },
    {
      id: 'pkg-3',
      priceToman: 7000000,
      shareCount: 30,
      titleFa: 'پکیج طلایی (۳۰ سهم)',
      titleEn: 'Gold Package (30 Shares)',
      titleAr: 'الباقة الذهبية (۳۰ سهم)',
      isActive: true,
      displayOrder: 3,
      badgeTag: 'پیشنهادی'
    },
    {
      id: 'pkg-4',
      priceToman: 21000000,
      shareCount: 100,
      titleFa: 'پکیج الماس (۱۰۰ سهم)',
      titleEn: 'Diamond Package (100 Shares)',
      titleAr: 'الباقة الماسات (۱۰۰ سهم)',
      isActive: true,
      displayOrder: 4,
      badgeTag: 'سرمایه‌گذار ارشد'
    }
  ]);

  // 6. Referral Levels (Module 7)
  const [referralLevels, setReferralLevels] = useState<ReferralCommissionLevel[]>([
    { levelNumber: 1, commissionPercentage: 10 },
    { levelNumber: 2, commissionPercentage: 5 },
    { levelNumber: 3, commissionPercentage: 3 },
    { levelNumber: 4, commissionPercentage: 2 },
    { levelNumber: 5, commissionPercentage: 1 }
  ]);

  const [referralTree, setReferralTree] = useState<ReferralNode>({
    id: 'node-root',
    userId: 'usr-1001',
    userName: 'علی رضایی (شما)',
    userEmail: 'ali@saas.com',
    level: 0,
    directCount: 3,
    totalNetworkCount: 14,
    personalVolumeToman: 21000000,
    networkVolumeToman: 185000000,
    children: [
      {
        id: 'node-1',
        userId: 'usr-1002',
        userName: 'مریم کاظمی',
        userEmail: 'maryam@saas.com',
        parentId: 'usr-1001',
        level: 1,
        directCount: 2,
        totalNetworkCount: 6,
        personalVolumeToman: 8500000,
        networkVolumeToman: 42000000,
        children: [
          {
            id: 'node-1-1',
            userId: 'usr-1005',
            userName: 'رضا صبوری',
            userEmail: 'reza@saas.com',
            parentId: 'usr-1002',
            level: 2,
            directCount: 1,
            totalNetworkCount: 2,
            personalVolumeToman: 12000000,
            networkVolumeToman: 18000000
          },
          {
            id: 'node-1-2',
            userId: 'usr-1006',
            userName: 'سارا احمدی',
            userEmail: 'sara@saas.com',
            parentId: 'usr-1002',
            level: 2,
            directCount: 0,
            totalNetworkCount: 0,
            personalVolumeToman: 4000000,
            networkVolumeToman: 4000000
          }
        ]
      },
      {
        id: 'node-2',
        userId: 'usr-1003',
        userName: 'حسین مرادی',
        userEmail: 'hossein@saas.com',
        parentId: 'usr-1001',
        level: 1,
        directCount: 2,
        totalNetworkCount: 5,
        personalVolumeToman: 15000000,
        networkVolumeToman: 65000000
      },
      {
        id: 'node-3',
        userId: 'usr-1004',
        userName: 'زهرا نوری',
        userEmail: 'zahra@saas.com',
        parentId: 'usr-1001',
        level: 1,
        directCount: 0,
        totalNetworkCount: 0,
        personalVolumeToman: 2000000,
        networkVolumeToman: 2000000
      }
    ]
  });

  // 7. Teacher White Label Config (Module 3)
  const [teacherConfig, setTeacherConfig] = useState<TeacherWhiteLabelConfig>({
    teacherId: 'tch-88',
    teacherName: 'دکتر محمدامین خسروی',
    subdomain: 'dr-khosravi',
    customDomain: 'khosravi-academy.ir',
    logoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    brandColor: '#2563eb',
    secondaryColor: '#0f172a',
    fontFamily: 'IRANSans, Plus Jakarta Sans, sans-serif',
    seoTitle: 'آکادمی هوش مصنوعی و برنامه‌نویسی پیشرفته دکتر خسروی',
    seoDescription: 'دوره تخصصی برنامه‌نویسی Clean Architecture و طراحی سیستم‌های Enterprise',
    socialLinks: {
      telegram: 'https://t.me/khosravi_academy',
      instagram: 'https://instagram.com/khosravi_academy',
      linkedin: 'https://linkedin.com/in/khosravi'
    },
    customMenuItems: [
      { title: 'دوره‌های جامع', url: '#courses' },
      { title: 'مقالات تخصصی', url: '#articles' },
      { title: 'ویدیوهای کلاس', url: '#videos' },
      { title: 'تماس با استاد', url: '#contact' }
    ],
    apkConfig: {
      appName: 'آکادمی دکتر خسروی',
      packageName: 'com.khosravi.academy',
      splashScreenUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80',
      version: '2.1.0'
    },
    subscriptionStatus: 'Active',
    subscriptionExpiresAt: '2027-01-01',
    coursesCount: 12,
    articlesCount: 45,
    videosCount: 88
  });

  // 8. Goftino Chat Settings (Module 9)
  const [goftino, setGoftino] = useState<GoftinoSettings>({
    isEnabled: true,
    widgetId: 'gft-e7829a1002b',
    scriptUrl: 'https://www.goftino.com/widget/gft-e7829a1002b',
    autoOpen: false
  });

  // 9. System Audit Logs
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([
    {
      id: 'log-1',
      userId: 'usr-1001',
      userEmail: 'ali@saas.com',
      action: 'LOGIN_SUCCESS',
      ipAddress: '185.190.22.10',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      details: 'ورود موفقیت‌آمیز به سامانه Enterprise'
    },
    {
      id: 'log-2',
      userId: 'usr-1001',
      userEmail: 'ali@saas.com',
      action: 'SHARE_POOL_MANUAL_TRIGGER',
      ipAddress: '185.190.22.10',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'SUCCESS',
      details: 'محاسبه و تقسیم دستی سود استخر بین ۱۴۲۰ سهم فعال'
    }
  ]);

  const addAuditLog = (action: string, status: 'SUCCESS' | 'WARNING' | 'FAILED', details: string) => {
    const newLog: SystemAuditLog = {
      id: 'log-' + Date.now(),
      userId: auth.userId || 'usr-anon',
      userEmail: auth.userEmail || 'system',
      action,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
      status,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Charge Cash Wallet
  const chargeCashWallet = (amountToman: number, description: string) => {
    const newCash = wallet.cashBalanceToman + amountToman;
    const sharePoolCut = Math.round(amountToman * (sharePool.rulePercentages.walletChargePercentage / 100));

    setWallet((prev) => ({
      ...prev,
      cashBalanceToman: newCash
    }));

    setSharePool((prev) => ({
      ...prev,
      totalPoolBalanceToman: prev.totalPoolBalanceToman + sharePoolCut
    }));

    const newTx: TransactionLedger = {
      id: 'tx-' + Date.now(),
      userId: wallet.userId,
      userName: auth.userName || 'کاربر',
      amountToman,
      sharesChanged: 0,
      type: 'DEPOSIT',
      description,
      referenceId: 'CHG-' + Math.floor(Math.random() * 1000000),
      createdDate: new Date().toLocaleString('fa-IR'),
      balanceAfterToman: newCash,
      sharesAfter: wallet.shareBalanceCount
    };

    setTransactions((prev) => [newTx, ...prev]);
    addAuditLog('WALLET_CHARGE', 'SUCCESS', `شارژ کیف پول به مبلغ ${amountToman.toLocaleString()} تومان`);
  };

  // Purchase Package
  const purchasePackage = (pkg: WalletPackage): boolean => {
    if (wallet.cashBalanceToman < pkg.priceToman) {
      addAuditLog('PACKAGE_PURCHASE', 'FAILED', `موجودی کافی نیست برای پکیج ${pkg.titleFa}`);
      return false;
    }

    const newCash = wallet.cashBalanceToman - pkg.priceToman;
    const newShares = wallet.shareBalanceCount + pkg.shareCount;

    setWallet((prev) => ({
      ...prev,
      cashBalanceToman: newCash,
      shareBalanceCount: newShares,
      personalPurchasesToman: prev.personalPurchasesToman + pkg.priceToman
    }));

    const newTx: TransactionLedger = {
      id: 'tx-' + Date.now(),
      userId: wallet.userId,
      userName: auth.userName || 'کاربر',
      amountToman: -pkg.priceToman,
      sharesChanged: pkg.shareCount,
      type: 'PACKAGE_PURCHASE',
      description: `خرید ${pkg.titleFa}`,
      referenceId: 'PKG-' + pkg.id.toUpperCase(),
      createdDate: new Date().toLocaleString('fa-IR'),
      balanceAfterToman: newCash,
      sharesAfter: newShares
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Referral Commission Auto Credit to Parent
    const commissionToman = Math.round(pkg.priceToman * (referralLevels[0].commissionPercentage / 100));
    setWallet((prev) => ({
      ...prev,
      totalReferralCommissionsToman: prev.totalReferralCommissionsToman + commissionToman
    }));

    addAuditLog('PACKAGE_PURCHASE', 'SUCCESS', `خرید موفقیت‌آمیز ${pkg.titleFa}`);
    return true;
  };

  // Trigger Share Pool Dividend (Monthly distribution)
  const triggerSharePoolDividend = async (): Promise<number> => {
    if (sharePool.totalSharesInCirculation === 0) return 0;

    const totalToDistribute = Math.round(sharePool.totalPoolBalanceToman * 0.8); // Distribute 80% of pool
    const perShare = Math.floor(totalToDistribute / sharePool.totalSharesInCirculation);

    const userShareProfit = perShare * wallet.shareBalanceCount;

    setSharePool((prev) => ({
      ...prev,
      totalPoolBalanceToman: prev.totalPoolBalanceToman - totalToDistribute,
      lastDistributionDate: new Date().toISOString().split('T')[0]
    }));

    setWallet((prev) => ({
      ...prev,
      cashBalanceToman: prev.cashBalanceToman + userShareProfit,
      totalDividendsReceivedToman: prev.totalDividendsReceivedToman + userShareProfit
    }));

    const newTx: TransactionLedger = {
      id: 'tx-' + Date.now(),
      userId: wallet.userId,
      userName: auth.userName || 'کاربر',
      amountToman: userShareProfit,
      sharesChanged: 0,
      type: 'SHARE_POOL_DIVIDEND',
      description: `واریز سود ماهانه سهامداری (${wallet.shareBalanceCount} سهم × ${perShare.toLocaleString()} تومان)`,
      referenceId: 'DIV-' + Date.now(),
      createdDate: new Date().toLocaleString('fa-IR'),
      balanceAfterToman: wallet.cashBalanceToman + userShareProfit,
      sharesAfter: wallet.shareBalanceCount
    };

    setTransactions((prev) => [newTx, ...prev]);
    addAuditLog('SHARE_POOL_DIVIDEND', 'SUCCESS', `تقسیم سود استخر به مبلغ کل ${totalToDistribute.toLocaleString()} تومان انجام شد.`);

    return totalToDistribute;
  };

  const updateSharePoolPercentages = (percentages: any) => {
    setSharePool((prev) => ({
      ...prev,
      rulePercentages: percentages
    }));
    addAuditLog('SHARE_POOL_CONFIG_UPDATE', 'SUCCESS', 'بروزرسانی درصدهای ورودی استخر سود');
  };

  const updateWalletPackage = (updatedPkg: WalletPackage) => {
    setPackages((prev) => prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)));
    addAuditLog('PACKAGE_UPDATE', 'SUCCESS', `بروزرسانی پکیج کیف پول ${updatedPkg.titleFa}`);
  };

  const updateReferralLevels = (levels: ReferralCommissionLevel[]) => {
    setReferralLevels(levels);
    addAuditLog('REFERRAL_LEVELS_UPDATE', 'SUCCESS', 'بروزرسانی سطوح پورسانت شبکه بازاریابی');
  };

  const updateTeacherConfig = (config: Partial<TeacherWhiteLabelConfig>) => {
    setTeacherConfig((prev) => ({ ...prev, ...config }));
    addAuditLog('TEACHER_WHITELABEL_UPDATE', 'SUCCESS', 'بروزرسانی تنظیمات برندینگ اختصاصی استاد');
  };

  const triggerApkBuild = async (): Promise<string> => {
    const timestamp = new Date().toISOString();
    setTeacherConfig((prev) => ({
      ...prev,
      apkConfig: {
        ...prev.apkConfig,
        lastGeneratedAt: timestamp
      }
    }));
    addAuditLog('APK_BUILD_TRIGGER', 'SUCCESS', `تولید موفق APK اختصاصی ${teacherConfig.apkConfig.appName}`);
    return `https://storage.saas-platform.com/apk/teacher-${teacherConfig.teacherId}-v${teacherConfig.apkConfig.version}.apk`;
  };

  const updateGoftinoSettings = (settings: Partial<GoftinoSettings>) => {
    setGoftino((prev) => ({ ...prev, ...settings }));
    addAuditLog('GOFTINO_UPDATE', 'SUCCESS', 'تغییر وضعیت ویجت گفتینو');
  };

  return (
    <EnterpriseContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        t,
        auth,
        setAuth,
        userRole,
        setUserRole,
        wallet,
        transactions,
        chargeCashWallet,
        purchasePackage,
        sharePool,
        triggerSharePoolDividend,
        updateSharePoolPercentages,
        packages,
        updateWalletPackage,
        referralTree,
        referralLevels,
        updateReferralLevels,
        teacherConfig,
        updateTeacherConfig,
        triggerApkBuild,
        goftino,
        updateGoftinoSettings,
        auditLogs,
        addAuditLog
      }}
    >
      {children}
    </EnterpriseContext.Provider>
  );
};

export const useEnterprise = () => {
  const context = useContext(EnterpriseContext);
  if (!context) {
    throw new Error('useEnterprise must be used within an EnterpriseProvider');
  }
  return context;
};
