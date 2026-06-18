import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const { user } = useAuth();

  // Tenant language is account-driven after login; keep toggle for unauthenticated pages and super admins.
  if (user && user.role !== 'super_admin') {
    return null;
  }

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
      <span>{i18n.language.startsWith('en') ? 'EN' : 'FR'}</span>
    </button>
  );
};

export default LanguageSwitcher;
