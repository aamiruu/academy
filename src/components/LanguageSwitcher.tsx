import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  useEffect(() => {
    const dir = i18n.dir();
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="flex items-center gap-2">
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className="bg-slate-800 text-slate-200 text-sm border border-slate-700 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="fa">فارسی</option>
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
};
