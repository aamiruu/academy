import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Users, Video, Award, ChevronLeft } from 'lucide-react';

export const InstructorPage: React.FC = () => {
  const { subdomain } = useParams();
  const [instructor, setInstructor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructor = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'users'),
          where('customSubdomain', '==', subdomain)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setInstructor(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    if (subdomain) {
      fetchInstructor();
    }
  }, [subdomain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200">
        در حال بارگذاری صفحه اختصاصی...
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <h1 className="text-2xl font-bold mb-4">صفحه یافت نشد</h1>
        <p className="text-slate-400 mb-6">استادی با این آدرس اختصاصی وجود ندارد.</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-y-auto font-[Vazirmatn]">
      <div className="w-full h-48 bg-gradient-to-r from-indigo-900 to-purple-900 relative">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-slate-800 border-4 border-slate-950 rounded-full flex items-center justify-center text-4xl font-bold shadow-xl">
          {instructor.displayName?.charAt(0) || 'U'}
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto pt-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">{instructor.displayName}</h1>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
          صفحه اختصاصی و رسمی کلاس‌های آنلاین استاد {instructor.displayName}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold mb-1">+{instructor.downlineCount || 0}</div>
            <div className="text-sm text-slate-400">دانشجویان شبکه</div>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <Video className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold mb-1">کلاس آنلاین</div>
            <div className="text-sm text-slate-400">امکان ورود به کلاس زنده</div>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold mb-1">مورد تایید</div>
            <div className="text-sm text-slate-400">مدرس رسمی سیستم</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Video className="w-5 h-5" />
            ورود به کلاس زنده
          </Link>
          <a href="#" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-3 rounded-xl font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2">
            ارتباط با مدرس
          </a>
        </div>
      </div>
    </div>
  );
};
