import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, ShieldCheck, MapPin, Zap, Linkedin, Twitter, Youtube, Facebook, Instagram } from 'lucide-react';

const PublicFooter = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 lg:px-24 relative overflow-hidden">
            {/* Design Elements */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-400/5 rounded-full blur-[100px]"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
                
                {/* Brand Identity */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
                            <Zap className="text-slate-950 font-black" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">KGMAO</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-widest text-justify">
                        {t('footer.brandSlogan')}
                    </p>
                    
                    {/* Social Matrix */}
                    <div className="flex items-center gap-3 pt-2">
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-yellow-400 hover:text-slate-900 transition-all duration-300">
                            <Linkedin size={18} />

                        </a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                            <Facebook size={18} />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 hover:text-white transition-all duration-300">
                            <Instagram size={18} />

                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-500 hover:text-white transition-all duration-300">
                            <Twitter size={18} />
                        </a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-rose-600 hover:text-white transition-all duration-300">
                            <Youtube size={18} />

                        </a>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{t('footer.systemsNominal')}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-8">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] italic mb-6">{t('footer.quickLinks')}</h4>
                    <ul className="space-y-4">
                        <li><Link to="/about" className="text-slate-400 hover:text-yellow-400 font-bold transition-all uppercase tracking-widest text-xs">{t('footer.aboutUs')}</Link></li>
                        <li><Link to="/global-pricing" className="text-slate-400 hover:text-yellow-400 font-bold transition-all uppercase tracking-widest text-xs">{t('footer.pricing')}</Link></li>
                        <li><Link to="/free-trial" className="text-slate-400 hover:text-yellow-400 font-bold transition-all uppercase tracking-widest text-xs">{t('footer.trial')}</Link></li>
                        <li><Link to="/global-matrix" className="text-slate-400 hover:text-yellow-400 font-bold transition-all uppercase tracking-widest text-xs">{t('footer.matrix')}</Link></li>
                    </ul>
                </div>

                {/* Support & Legal */}
                <div className="space-y-8">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] italic mb-6">{t('footer.support')}</h4>
                    <ul className="space-y-4">
                        <li><Link to="/help" className="text-slate-400 hover:text-yellow-400 font-bold transition-all uppercase tracking-widest text-xs">{t('footer.help')}</Link></li>
                        <li><Link to="/contact" className="text-slate-400 hover:text-yellow-400 font-bold transition-all uppercase tracking-widest text-xs">{t('footer.contact')}</Link></li>
                        <li><Link to="/terms" className="text-slate-400 hover:text-yellow-400 font-bold transition-all uppercase tracking-widest text-xs">{t('footer.terms')}</Link></li>
                        <li><Link to="/privacy" className="text-slate-400 hover:text-yellow-400 font-bold transition-all uppercase tracking-widest text-xs">{t('footer.privacy')}</Link></li>
                    </ul>
                </div>

                {/* Enterprise HQ */}
                <div className="space-y-8">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] italic mb-6">{t('footer.enterpriseHQ')}</h4>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <MapPin className="text-yellow-400 shrink-0" size={18} />
                            <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-widest">
                                {String(t('footer.address') || '').split(', ').map((line, i, arr) => (
                                    <React.Fragment key={i}>
                                        {line}{i < arr.length - 1 && <br/>}
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                        <div className="flex items-start gap-4">
                            <ShieldCheck className="text-indigo-400 shrink-0" size={18} />
                            <div className="space-y-2">
                                <Link to="/security" className="block text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">{t('legal.securityTitle')}</Link>
                                <Link to="/sla" className="block text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">{t('legal.slaTitle')}</Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col md:items-start items-center gap-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">
                        {t('footer.copyright')}
                    </p>
                    <p className="text-[10px] font-black text-yellow-500/70 uppercase tracking-[0.2em]">
                        A Product of KALIDE SARL
                    </p>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Globe size={14} className="text-slate-600" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t('footer.globalOps')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
