import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
      title={t('nav.switchLang')}
    >
      <Globe className="w-4 h-4" />
      <span>{i18n.language.startsWith('en') ? 'FR' : 'EN'}</span>
    </button>
  );
};

export default LanguageSwitcher;
