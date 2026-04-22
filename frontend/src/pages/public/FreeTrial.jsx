import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Rocket, Clock, Zap, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const FreeTrial = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen border-t border-slate-100 flex flex-col bg-slate-950 text-white relative overflow-hidden selection:bg-indigo-500 selection:text-white">
            <PublicNavbar />
            
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-400/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px] pointer-events-none"></div>

            <div className="flex-1 flex items-center max-w-7xl mx-auto px-6 lg:px-20 relative z-10 w-full py-20 lg:py-32">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Left: Content */}
                    <div className="lg:w-1/2 space-y-12 animate-fade-in-up">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                            <Sparkles className="text-yellow-400" size={16} />
                            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.4em]">{t('freeTrialPage.syncing')}</span>
                        </div>
                        
                        <div className="space-y-6">
                            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
                                {t('freeTrialPage.title').split(' ').slice(0, -1).join(' ')} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-100">{t('freeTrialPage.title').split(' ').slice(-1)}</span>
                            </h1>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                                {t('freeTrialPage.subtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                            {[
                                { title: t('freeTrialPage.features.f1Title'), desc: t('freeTrialPage.features.f1Desc'), icon: Zap },
                                { title: t('freeTrialPage.features.f2Title'), desc: t('freeTrialPage.features.f2Desc'), icon: Rocket }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                                        <item.icon className="text-yellow-400" size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black uppercase italic tracking-wide">{item.title}</h4>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6 pt-10 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">{t('freeTrialPage.included')}</h4>
                            <div className="flex flex-wrap gap-x-10 gap-y-4">
                                {[t('dashboard.desc.energy'), t('dashboard.desc.performance'), 'ISO Compliance Layer', 'Cyber-Physical Shield'].map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 group cursor-default">
                                        <CheckCircle2 size={14} className="text-emerald-500 group-hover:scale-125 transition-transform" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Registration Card */}
                    <div className="lg:w-1/2 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="bg-white rounded-[4rem] p-12 lg:p-16 text-slate-900 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                <Clock size={200} />
                            </div>
                            
                            <div className="relative z-10 space-y-10">
                                <div className="text-center space-y-2">
                                    <h3 className="text-4xl font-black tracking-tighter uppercase italic">{t('footer.trial')}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('freeTrialPage.initPhase')}</p>
                                </div>

                                <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('freeTrialPage.enterpriseEmail')}</label>
                                        <input 
                                            type="email" 
                                            placeholder={t('freeTrialPage.emailPlaceholder')}
                                            className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] border border-slate-100 focus:bg-white focus:ring-4 focus:ring-yellow-400/20 transition-all outline-none font-bold placeholder:text-slate-300"
                                        />
                                    </div>

                                    <button className="w-full py-8 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3 group">
                                        {t('freeTrialPage.initButton')}
                                        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </form>

                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        <Shield className="text-indigo-600" size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-black uppercase italic tracking-tight">{t('freeTrialPage.shield')}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{t('freeTrialPage.shieldDesc')}</p>
                                    </div>
                                </div>

                                <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest mt-8">
                                    {t('freeTrialPage.alreadyHolding')} <Link to="/login" className="text-indigo-600 hover:underline">{t('freeTrialPage.syncHub')}</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <PublicFooter />
        </div>
    );
};

export default FreeTrial;
