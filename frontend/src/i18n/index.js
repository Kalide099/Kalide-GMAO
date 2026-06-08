import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en/translation.json';
import frTranslation from '../locales/fr/translation.json';

const resources = {
  en: { translation: enTranslation },
  fr: { translation: frTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['en', 'fr'],
    nonExplicitSupportedLngs: false,
    load: 'languageOnly',
    fallbackLng: {
      en: ['en'],
      fr: ['fr'],
      default: ['en']
    },
    debug: import.meta.env.DEV,
    saveMissing: false,
    returnNull: false,
    returnEmptyString: false,
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'kgmao_language',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
