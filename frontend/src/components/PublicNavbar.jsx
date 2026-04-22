import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Menu, X, LogOut } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';

const PublicNavbar = () => {
    const { t } = useTranslation();
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <nav className="w-full h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 lg:px-24 sticky top-0 z-50 transition-all">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-xl shadow-slate-900/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                    <Zap className="text-yellow-400 w-6 h-6" fill="currentColor" />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-2xl tracking-tighter text-slate-900 leading-none">KGMAO</span>
                    <span className="text-[9px] font-black uppercase text-yellow-500 tracking-[0.3em] mt-1 italic">{t('common.intelligence')}</span>
                </div>
            </Link>
            
            <div className="hidden lg:flex items-center gap-10">
                <div className="flex items-center gap-8">
                    <NavLink to="/" className={({isActive}) => `text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isActive ? 'text-slate-900 border-b-2 border-yellow-400 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>{t('nav.home')}</NavLink>
                    <NavLink to="/about" className={({isActive}) => `text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isActive ? 'text-slate-900 border-b-2 border-yellow-400 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>{t('footer.aboutUs')}</NavLink>
                    <NavLink to="/global-pricing" className={({isActive}) => `text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isActive ? 'text-slate-900 border-b-2 border-yellow-400 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>{t('footer.pricing')}</NavLink>
                    <NavLink to="/global-matrix" className={({isActive}) => `text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isActive ? 'text-slate-900 border-b-2 border-yellow-400 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>{t('footer.matrix')}</NavLink>
                    <NavLink to="/help" className={({isActive}) => `text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isActive ? 'text-slate-900 border-b-2 border-yellow-400 pb-1' : 'text-slate-500 hover:text-slate-900'}`}>{t('footer.help')}</NavLink>
                </div>
                
                <div className="h-8 w-px bg-slate-100"></div>
                
                <LanguageSwitcher />
                
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to={user?.role === 'super_admin' ? '/admin' : '/app'} className="px-5 py-2 text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                {t('nav.dashboard')}
                            </Link>
                            <button 
                                onClick={logout}
                                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                title={t('nav.logout')}
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="px-4 py-2 text-[10px] font-black text-slate-900 hover:text-yellow-600 uppercase tracking-widest transition-colors">{t('marketing.login')}</Link>
                            <Link to="/register" className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-yellow-400/10 transition-all active:scale-95">
                                {t('auth.createAccount')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-4">
                <LanguageSwitcher />
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-3 bg-slate-100 rounded-xl text-slate-900"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="absolute top-24 left-0 w-full bg-white border-b border-slate-100 shadow-2xl lg:hidden animate-fade-in-down z-40">
                    <div className="flex flex-col p-8 gap-6">
                        <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{t('nav.home')}</NavLink>
                        <NavLink to="/about" onClick={() => setIsMenuOpen(false)} className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{t('footer.aboutUs')}</NavLink>
                        <NavLink to="/global-pricing" onClick={() => setIsMenuOpen(false)} className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{t('footer.pricing')}</NavLink>
                        <NavLink to="/global-matrix" onClick={() => setIsMenuOpen(false)} className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{t('footer.matrix')}</NavLink>
                        <NavLink to="/help" onClick={() => setIsMenuOpen(false)} className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{t('footer.help')}</NavLink>
                        <NavLink to="/contact" onClick={() => setIsMenuOpen(false)} className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{t('footer.contact')}</NavLink>
                        
                        <div className="h-px w-full bg-slate-100 my-2"></div>
                        
                        {isAuthenticated ? (
                            <>
                                <Link to={user?.role === 'super_admin' ? '/admin' : '/app'} onClick={() => setIsMenuOpen(false)} className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                                    {t('nav.dashboard')}
                                </Link>
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-xs font-black text-rose-500 uppercase tracking-widest">
                                    {t('nav.logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                    {t('marketing.login')}
                                </Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 bg-yellow-400 text-slate-900 rounded-xl font-black text-xs text-center uppercase tracking-widest">
                                    {t('auth.createAccount')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default PublicNavbar;
