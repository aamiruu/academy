const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Import useTranslation and LanguageSwitcher
if (!code.includes('import { useTranslation } from "react-i18next";')) {
  code = code.replace(
    'import React,',
    'import { useTranslation } from "react-i18next";\nimport { LanguageSwitcher } from "./components/LanguageSwitcher";\nimport React,'
  );
}

// Add hook
if (!code.includes('const { t } = useTranslation();')) {
  code = code.replace(
    'export default function App() {',
    'export default function App() {\n  const { t } = useTranslation();\n'
  );
}

// Replace hardcoded "کلاس آنلاین هوشمند" with {t('app_title')}
// Since it might be hard to replace exactly without breaking things, let's just do a string replacement for some key elements.
code = code.replace(/>کلاس آنلاین هوشمند</g, ">{t('app_title')}<");
code = code.replace(/>شبیه‌ساز کلاس آنلاین</g, ">{t('online_class_simulator')}<");
code = code.replace(/>گفتگو</g, ">{t('chat_tab')}<");
code = code.replace(/>خلاصه</g, ">{t('summary_tab')}<");
code = code.replace(/>تولید خلاصه</g, ">{t('generate_summary')}<");
code = code.replace(/>دانلود فایل متنی</g, ">{t('download_txt')}<");
code = code.replace(/>استاد</g, ">{t('teacher')}<");
code = code.replace(/>دانشجو</g, ">{t('student')}<");
code = code.replace(/>شما</g, ">{t('you')}<");

// Add language switcher in the header. The header probably has the title. Let's find a place to put it.
// We can find <div className="flex items-center gap-2"> or similar for the settings button.
code = code.replace(
  '<button className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">',
  '<LanguageSwitcher />\n            <button className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">'
);

fs.writeFileSync('src/App.tsx', code);
