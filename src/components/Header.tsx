import React from 'react';
import {
  HardDrive,
  FolderGit2,
  Sparkles,
  User,
  LogIn,
  RefreshCw,
  CheckCircle2,
  Globe,
  ShieldCheck,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { UserAuth, LanguageCode } from '../types';
import { useEnterprise } from '../context/EnterpriseContext';

interface HeaderProps {
  auth: UserAuth;
  onLoginClick: () => void;
  onRefresh: () => void;
  onAnalyzeClick?: () => void;
  isLoading: boolean;
  folderName?: string;
  filesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  auth,
  onLoginClick,
  onRefresh,
  onAnalyzeClick,
  isLoading,
  folderName,
  filesCount
}) => {
  const { language, setLanguage, userRole, setUserRole, t } = useEnterprise();

  return (
    <header className="bg-[#0E0E0E] border-b border-[#262626] text-gray-200 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Enterprise Platform Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#0E0E0E] rounded-[6px] flex items-center justify-center">
              <FolderGit2 className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                <span>{t('appTitle')}</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-400" /> Phase 2 Enterprise
              </span>
            </div>
            {folderName && (
              <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5 truncate max-w-xs sm:max-w-md">
                <HardDrive className="w-3 h-3 text-emerald-400" />
                <span className="font-medium text-gray-300">{folderName}</span>
                {filesCount !== undefined && (
                  <span className="text-gray-500 font-mono">• {filesCount} آیتم</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Right: Language Switcher, Role Badge & OAuth Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Module 1: Language Switcher Selector */}
          <div className="flex items-center bg-[#141414] border border-[#2a2a2a] p-1 rounded-lg text-xs">
            <Globe className="w-3.5 h-3.5 text-blue-400 ml-1.5 mr-1" />
            <button
              onClick={() => setLanguage('fa')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                language === 'fa' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              فارسی
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                language === 'en' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                language === 'ar' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>

          {/* User Role Switcher Badge */}
          <div className="hidden md:flex items-center gap-1 bg-[#141414] border border-[#2a2a2a] p-1 rounded-lg text-xs">
            <span className="text-[10px] text-gray-400 px-1 font-semibold">نقش:</span>
            <button
              onClick={() => setUserRole('Admin')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                userRole === 'Admin' ? 'bg-rose-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setUserRole('Teacher')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                userRole === 'Teacher' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => setUserRole('User')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                userRole === 'User' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              User
            </button>
          </div>

          {folderName && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-md text-gray-300 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] transition-colors disabled:opacity-50"
              title="Refresh Google Drive files"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          )}

          {auth.isAuthenticated ? (
            <div className="flex items-center gap-2 bg-[#141414] border border-[#262626] rounded-full px-3 py-1">
              {auth.userPicture ? (
                <img
                  src={auth.userPicture}
                  alt={auth.userName || 'User'}
                  className="w-5 h-5 rounded-full border border-blue-500/40 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  <User className="w-3 h-3" />
                </div>
              )}
              <div className="text-xs hidden sm:block">
                <span className="text-gray-200 font-medium block leading-none">{auth.userName || 'اکانت کاربر'}</span>
              </div>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 ml-1.5" />
              <span>اتصال گوگل درایو</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
