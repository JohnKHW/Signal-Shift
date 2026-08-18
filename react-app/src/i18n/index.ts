import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import tc from './locales/tc.json';
import zh from './locales/zh.json';

export type Lang = 'en' | 'tc' | 'zh';

const STORAGE_KEY = 'signal-shift-lang';

const savedLang = (localStorage.getItem(STORAGE_KEY) as Lang | null) ?? 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tc: { translation: tc },
    zh: { translation: zh },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;
