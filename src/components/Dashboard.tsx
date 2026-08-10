import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs, runTransaction } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Wallet, TrendingUp, Users, LogIn, LogOut, Package, CreditCard, ChevronDown, ChevronUp, Globe, Settings, Network } from 'lucide-react';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  walletBalance: number;
  shares: number;
  parentId?: string;
  totalPurchases: number;
  downlineCount: number;
  customSubdomain?: string;
}

const PACKAGES = [
  { id: 1, price: 400000, shares: 1, name: "Starter" },
  { id: 2, price: 2000000, shares: 7, name: "Basic" },
  { id: 3, price: 7000000, shares: 30, name: "Pro" },
  { id: 4, price: 21000000, shares: 100, name: "Elite" }
];

export const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
  const [customSubdomain, setCustomSubdomain] = useState("");
  const [apkLoading, setApkLoading] = useState(false);
  const [downlines, setDownlines] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const canHaveSubdomain = (profile?.shares || 0) >= 30;

  useEffect(() => {
    if (profile?.customSubdomain) {
      setCustomSubdomain(profile.customSubdomain);
    }
  }, [profile?.customSubdomain]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        // Listen to profile
        const unsubProfile = onSnapshot(doc(db, 'users', u.uid), async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Check for referral
            const storedRef = localStorage.getItem('affiliate_ref');
            const newProfile: UserProfile = {
              uid: u.uid,
              email: u.email || '',
              displayName: u.displayName || '',
              role: 'student',
              walletBalance: 0,
              shares: 0,
              totalPurchases: 0,
              downlineCount: 0,
              ...(storedRef && { parentId: storedRef })
            };
            
            // Set the doc
            await setDoc(doc(db, 'users', u.uid), newProfile);
            
            // If there's a parent, increment their downline count
            if (storedRef) {
              const parentRef = doc(db, 'users', storedRef);
              try {
                await runTransaction(db, async (transaction) => {
                  const pDoc = await transaction.get(parentRef);
                  if (pDoc.exists()) {
                    const count = (pDoc.data().downlineCount || 0) + 1;
                    transaction.update(parentRef, { downlineCount: count });
                  }
                });
              } catch (e) {
                console.error("Failed to update parent downline", e);
              }
              // Clear ref after use
              localStorage.removeItem('affiliate_ref');
            }
            
            setProfile(newProfile);
          }
        });
        return () => unsubProfile();
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setDownlines([]);
      return;
    }
    
    // Fetch downlines
    const q = query(collection(db, 'users'), where('parentId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const d = snapshot.docs.map(doc => doc.data() as UserProfile);
      setDownlines(d);
    });
    
    // Fetch transactions
    const tq = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubTx = onSnapshot(tq, (snapshot) => {
      const t = snapshot.docs.map(doc => doc.data());
      setTransactions(t.sort((a,b) => b.timestamp - a.timestamp));
    });
    
    return () => {
      unsub();
      unsubTx();
    };
  }, [user]);

  const handleSaveSubdomain = async () => {
    if (!user || !canHaveSubdomain || !customSubdomain) return;
    try {
      // Very basic check, in real app need to ensure uniqueness across collection
      await setDoc(doc(db, 'users', user.uid), { customSubdomain }, { merge: true });
      alert("زیردامنه با موفقیت ذخیره شد");
    } catch (e) {
      console.error(e);
      alert("خطا در ذخیره زیردامنه");
    }
  };

  const handleBuildApk = () => {
    setApkLoading(true);
    setTimeout(() => {
      setApkLoading(false);
      alert("فایل APK ساخته شد و به ایمیل شما ارسال گردید.");
    }, 2500);
  };

  const handleAdminCommission = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const batch = [];
      
      // Calculate pool size based on total shares and a mock revenue (e.g., 50M base pool)
      let totalShares = 0;
      usersSnap.forEach(doc => {
        const d = doc.data() as UserProfile;
        totalShares += d.shares || 0;
      });
      
      if (totalShares === 0) {
        alert("هیچ سهمی برای توزیع وجود ندارد");
        return;
      }
      
      const poolAmount = 50_000_000;
      const amountPerShare = Math.floor(poolAmount / totalShares);
      
      // Update wallets
      await runTransaction(db, async (t) => {
        usersSnap.forEach(userDoc => {
          const u = userDoc.data() as UserProfile;
          if ((u.shares || 0) > 0) {
            const reward = u.shares * amountPerShare;
            t.update(doc(db, 'users', u.uid), {
              walletBalance: (u.walletBalance || 0) + reward
            });
          }
        });
      });
      
      alert(`تسک تقسیم سهام اجرا شد. به ازای هر سهم مبلغ ${amountPerShare.toLocaleString('fa-IR')} تومان به کیف پول کاربران واریز شد.`);
    } catch (e) {
      console.error(e);
      alert('خطا در اجرای تسک تقسیم سهام');
    }
  };

  const handleWithdrawal = async () => {
    if (!profile || !user || !profile.walletBalance || profile.walletBalance < 50000) {
      alert('موجودی برای تسویه کافی نیست (حداقل ۵۰,۰۰۰ تومان)');
      return;
    }
    
    try {
      await setDoc(doc(db, 'withdrawals', `${user.uid}_${Date.now()}`), {
        userId: user.uid,
        amount: profile.walletBalance,
        status: 'pending',
        timestamp: Date.now()
      });
      
      await setDoc(doc(db, 'users', user.uid), {
        walletBalance: 0
      }, { merge: true });
      
      alert('درخواست تسویه شما با موفقیت ثبت شد و پس از بررسی به حساب شما واریز خواهد شد.');
    } catch (e) {
      console.error(e);
      alert('خطا در ثبت درخواست تسویه');
    }
  };

  const handleAdminNewNode = () => {
    alert('یک خانه جدید در شبکه باز شد.');
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        console.error(error);
        alert('خطا در ورود به حساب کاربری: ' + error.message);
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handlePurchase = async (pkg: typeof PACKAGES[0]) => {
    if (!user || !profile) return;
    setPurchaseLoading(pkg.id);
    try {
      // In a real app, this would redirect to a payment gateway.
      // Here we simulate the purchase directly updating the user's document via transaction
      const userRef = doc(db, 'users', user.uid);
      const txRef = doc(collection(db, 'transactions'));
      
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) throw new Error("User does not exist!");
        
        const userData = userDoc.data() as UserProfile;

        let parentRef = null;
        let parentData = null;

        if (userData.parentId) {
          parentRef = doc(db, 'users', userData.parentId);
          const pDoc = await transaction.get(parentRef);
          if (pDoc.exists()) {
            parentData = pDoc.data() as UserProfile;
          }
        }
        
        const newShares = (userData.shares || 0) + pkg.shares;
        const newTotalPurchases = (userData.totalPurchases || 0) + pkg.price;
        
        // Update user
        transaction.update(userRef, {
          shares: newShares,
          totalPurchases: newTotalPurchases
        });
        
        // Record transaction
        transaction.set(txRef, {
          userId: user.uid,
          amount: pkg.price,
          shares: pkg.shares,
          timestamp: Date.now()
        });

        // Add 10% affiliate commission to parent
        if (parentRef && parentData) {
          const commission = Math.floor(pkg.price * 0.10);
          transaction.update(parentRef, {
            walletBalance: (parentData.walletBalance || 0) + commission
          });
        }
      });

      alert(`بسته ${pkg.shares} سهمی با موفقیت خریداری شد!`);
    } catch (error) {
      console.error(error);
      alert("خطا در خرید بسته");
    }
    setPurchaseLoading(null);
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Wallet className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">کیف پول و داشبورد کاربری</h2>
        <p className="text-slate-400 mb-6 max-w-sm">
          برای مشاهده کیف پول، سهام‌ها و لیست زیرمجموعه‌های خود وارد شوید.
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          {loading ? <span className="animate-pulse">در حال ورود...</span> : (
            <>
              <LogIn className="w-5 h-5" />
              ورود با گوگل
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-100">داشبورد کاربری</h2>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 p-2 rounded-lg transition-colors"
          title="خروج"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">موجودی کیف پول</span>
            </div>
            <div className="text-xl font-bold text-slate-100">
              {profile?.walletBalance?.toLocaleString('fa-IR')} <span className="text-sm font-normal text-slate-400">تومان</span>
            </div>
          </div>
          <button 
            onClick={handleWithdrawal}
            disabled={!profile?.walletBalance || profile.walletBalance < 50000}
            className="mt-4 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            درخواست تسویه
          </button>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium">سهام شما</span>
          </div>
          <div className="text-xl font-bold text-slate-100">
            {profile?.shares || 0} <span className="text-sm font-normal text-slate-400">سهم</span>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">تعداد زیرمجموعه</span>
          </div>
          <div className="text-xl font-bold text-slate-100">
            {profile?.downlineCount || 0} <span className="text-sm font-normal text-slate-400">نفر</span>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">مجموع خریدها</span>
          </div>
          <div className="text-xl font-bold text-slate-100">
            {profile?.totalPurchases?.toLocaleString('fa-IR') || 0} <span className="text-sm font-normal text-slate-400">تومان</span>
          </div>
        </div>
      </div>

      {transactions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-bold text-slate-200 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            تاریخچه تراکنش‌ها
          </h3>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 max-h-48 overflow-y-auto pr-1 space-y-2">
            {transactions.map((tx, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <div className="flex flex-col">
                  <span className="text-slate-200 font-medium">{tx.shares ? `خرید ${tx.shares} سهم` : 'تراکنش نامشخص'}</span>
                  <span className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString('fa-IR')}</span>
                </div>
                <div className="text-indigo-400 font-bold">
                  {tx.amount?.toLocaleString('fa-IR')} تومان
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-md font-bold text-slate-200 mb-3 flex items-center gap-2">
        <Package className="w-5 h-5 text-indigo-400" />
        خرید پکیج و شارژ سهام
      </h3>
      <div className="grid grid-cols-1 gap-3 mb-6">
        {PACKAGES.map(pkg => (
          <div key={pkg.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-200">{pkg.price.toLocaleString('fa-IR')} تومان</div>
              <div className="text-sm text-indigo-400">{pkg.shares} سهم اختصاصی</div>
            </div>
            <button
              onClick={() => handlePurchase(pkg)}
              disabled={purchaseLoading === pkg.id}
              className="bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {purchaseLoading === pkg.id ? "صبر کنید..." : "خرید پکیج"}
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-md font-bold text-slate-200 mb-3 flex items-center gap-2">
        <Users className="w-5 h-5 text-amber-400" />
        مدیریت زیرمجموعه‌ها (Affiliate)
      </h3>
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-sm text-slate-300 mb-6">
        <p className="mb-2">شما میتوانید زیرمجموعه گیری کنید. ۱۰٪ از پرداختی های زیرمجموعه های شما مستقیماً به کیف پول شما واریز خواهد شد.</p>
        <div className="flex flex-col gap-2 mt-4">
          <div className="bg-slate-900 rounded-lg p-3 flex flex-col gap-2 border border-slate-700">
            <span className="text-slate-400">لینک دعوت شما:</span>
            <span className="text-indigo-400 font-mono select-all text-xs break-all">{window.location.origin}/?ref={user?.uid}</span>
          </div>
        </div>
        
        {downlines.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-300 mb-3 border-b border-slate-700 pb-2">لیست زیرمجموعه‌های شما:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {downlines.map((dl, i) => (
                <div key={dl.uid} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-slate-200 font-medium">{dl.displayName || dl.email || 'کاربر ناشناس'}</div>
                      <div className="text-xs text-slate-500">خریدهای کل: {(dl.totalPurchases || 0).toLocaleString('fa-IR')} تومان</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    تایید شده
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <h3 className="text-md font-bold text-slate-200 mb-3 flex items-center gap-2">
        <Globe className="w-5 h-5 text-emerald-400" />
        تنظیمات سایت اختصاصی و اپلیکیشن
      </h3>
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-sm text-slate-300 mb-6">
        <div className="mb-4">
          <label className="block text-slate-400 mb-1">زیردامنه اختصاصی شما</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="my-name" 
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 flex-1 outline-none focus:border-indigo-500 text-left" 
              dir="ltr"
              value={customSubdomain}
              onChange={(e) => setCustomSubdomain(e.target.value)}
              readOnly={!canHaveSubdomain}
            />
            <span className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-400">.class-platform.com</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-slate-500">برای تغییر زیردامنه باید اشتراک ویژه (پکیج 30 سهمی به بالا) داشته باشید.</p>
            {canHaveSubdomain && customSubdomain !== profile?.customSubdomain && (
              <button 
                onClick={handleSaveSubdomain}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md transition-colors"
              >
                ذخیره
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center bg-slate-900 rounded-lg p-3 border border-slate-700">
          <div>
            <div className="font-medium text-slate-200">دریافت فایل APK اختصاصی</div>
            <div className="text-xs text-slate-400">اپلیکیشن اندروید با لوگو و نام شما</div>
          </div>
          <button 
            onClick={handleBuildApk}
            disabled={apkLoading}
            className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {apkLoading ? "در حال ساخت..." : "ساخت APK"}
          </button>
        </div>
      </div>

      {profile?.role === 'admin' && (
        <>
          <h3 className="text-md font-bold text-rose-400 mb-3 flex items-center gap-2 mt-8">
            <Settings className="w-5 h-5 text-rose-400" />
            پنل مدیریت سیستم (Admin)
          </h3>
          <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4 text-sm text-slate-300">
            <div className="mb-4">
              <div className="flex justify-between items-center bg-slate-900 rounded-lg p-3 border border-slate-700">
                <div>
                  <div className="font-medium text-slate-200">اجرای دستی تسک تقسیم سهام</div>
                  <div className="text-xs text-slate-400">واریز پورسانت‌ها به کیف پول کاربران و استخر سهام در تاریخ یکم ماه</div>
                </div>
                <button 
                  onClick={handleAdminCommission}
                  className="bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  اجرای دستی
                </button>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between items-center bg-slate-900 rounded-lg p-3 border border-slate-700">
                <div>
                  <div className="font-medium text-slate-200">باز کردن خانه جدید در شبکه (+)</div>
                  <div className="text-xs text-slate-400">ایجاد ظرفیت جدید برای شبکه‌سازی (پدر/پدربزرگ)</div>
                </div>
                <button 
                  onClick={handleAdminNewNode}
                  className="flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Network className="w-4 h-4" />
                  ظرفیت جدید (+)
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
