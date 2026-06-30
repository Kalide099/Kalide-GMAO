import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Book, Cpu, ShieldCheck, Mail, MessageSquare, Zap, Globe, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const HelpCenter = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    };
        const [simModalOpen, setSimModalOpen] = useState({ isOpen: false, type: null });

    const categories = [
        { icon: <Zap className="text-yellow-400" />, title: t('help.categories.gettingStarted.title'), desc: t('help.categories.gettingStarted.desc') },
        { icon: <Cpu className="text-indigo-400" />, title: t('help.categories.iot.title'), desc: t('help.categories.iot.desc') },
        { icon: <Radio className="text-emerald-400" />, title: t('help.categories.command.title'), desc: t('help.categories.command.desc') },
        { icon: <ShieldCheck className="text-rose-400" />, title: t('help.categories.compliance.title'), desc: t('help.categories.compliance.desc') },
        { icon: <Globe className="text-blue-400" />, title: t('help.categories.global.title'), desc: t('help.categories.global.desc') },
        { icon: <Book className="text-slate-400" />, title: t('help.categories.api.title'), desc: t('help.categories.api.desc') },
    ];

    const popularArticles = [
        t('help.articles.a1'),
        t('help.articles.a2'),
        t('help.articles.a3'),
        t('help.articles.a4')
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <PublicNavbar />
            <div className="flex-1">
            
            {/* Hero Search Section */}
            <section className="bg-slate-950 py-24 px-6 lg:px-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full max-w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px]"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic">
                        {t('help.title').split(' ')[0]} <span className="text-yellow-400">{t('help.title').split(' ')[1]}</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto uppercase tracking-widest leading-loose">
                        {t('help.subtitle')}
                    </p>
                    
                    <div className="relative max-w-2xl mx-auto group">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6 group-focus-within:text-yellow-400 transition-colors" />
                        <input 
                            type="text" 
                            className="w-full h-20 bg-white/5 border-2 border-white/10 rounded-[2.5rem] pl-20 pr-8 text-white text-lg font-medium focus:border-yellow-400 outline-none transition-all shadow-2xl"
                            placeholder={t('help.searchPlaceholder')}
                        />
                    </div>
                </div>
            </section>

            {/* Support Categories */}
            <section className="py-24 px-6 lg:px-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all group cursor-pointer">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-slate-900 transition-colors">
                                {React.cloneElement(cat.icon, { size: 32 })}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-3 italic">{cat.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                {cat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular Articles & Quick Help */}
            <section className="pb-24 px-6 lg:px-24">
                <div className="max-w-7xl mx-auto bg-white rounded-[4rem] p-12 lg:p-20 shadow-xl border border-slate-50 flex flex-col lg:flex-row gap-20">
                    <div className="flex-1 space-y-10">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] italic">{t('help.topArticles')}</h4>
                        <div className="space-y-6">
                            {popularArticles.map((art, idx) => (
                                <div key={idx} className="flex items-center gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform"></div>
                                    <span className="text-slate-800 font-bold text-lg">{art}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/3 bg-slate-50 rounded-[3rem] p-12 space-y-8 flex flex-col justify-center border border-slate-100">
                        <div className="space-y-2">
                             <h4 className="text-slate-900 font-black text-2xl tracking-tighter uppercase italic">{t('help.needSupport')}</h4>
                             <p className="text-slate-500 font-medium text-sm">{t('help.supportDesc')}</p>
                        </div>
                        <div className="space-y-4 pt-4">
                            <button onClick={() => navigate('/contact')} className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all">
                                <MessageSquare size={18} className="text-yellow-400" />
                                {t('help.startChat')}
                            </button>
                            <button onClick={() => navigate('/contact')} className="w-full h-16 bg-white border-2 border-slate-200 text-slate-900 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:border-indigo-400 transition-all">
                                <Mail size={18} className="text-indigo-600" />
                                {t('help.openTicket')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Placeholder for consistence */}
            <div className="py-10 text-center border-t border-slate-100 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic mb-10">
                {t('help.footerCredits')}
            </div>
            </div>
            <PublicFooter />

            
        </div>
    );
};

export default HelpCenter;
