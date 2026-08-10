import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fa from './locales/fa.json';
import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fa,
      en,
      ar
    },
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
