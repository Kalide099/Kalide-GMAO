import { useTranslation } from 'react-i18next';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import { ShieldCheck, Eye, Lock } from 'lucide-react';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <PublicNavbar />
            <div className="flex-1">
            
            <div className="bg-white py-32 px-6 lg:px-24 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
                <div className="max-w-4xl mx-auto space-y-6">
                    <span className="px-5 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">{t('legal.complianceBadge')}</span>
                    <h1 className="text-5xl lg:text-7xl font-black text-slate-950 tracking-tighter uppercase italic">
                        {t('legal.privacyTitle').split(' ')[0]} <span className="text-indigo-600">{t('legal.privacyTitle').split(' ')[1]}</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed uppercase tracking-widest">
                        {t('legal.privacy.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-24 px-6 lg:px-0 space-y-24 pb-48">
                
                {/* Core Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-4">
                        <Lock className="text-indigo-600" size={32} />
                        <h3 className="text-xl font-black text-slate-900 uppercase italic">{t('legal.privacy.pillars.encryption.title')}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{t('legal.privacy.pillars.encryption.desc')}</p>
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-4">
                        <Eye className="text-emerald-500" size={32} />
                        <h3 className="text-xl font-black text-slate-900 uppercase italic">{t('legal.privacy.pillars.zeroVision.title')}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{t('legal.privacy.pillars.zeroVision.desc')}</p>
                    </div>
                </div>

                <div className="space-y-16">
                    <section className="space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black italic">01</div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{t('legal.privacy.identity.title')}</h2>
                        </div>
                        <div className="pl-18 text-slate-600 font-medium leading-[2.2] space-y-6 text-lg border-l-4 border-slate-100 ml-6">
                            <p>{t('legal.privacy.identity.p1')}</p>
                            <p>{t('legal.privacy.identity.p2')}</p>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic">02</div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{t('legal.privacy.telemetry.title')}</h2>
                        </div>
                        <div className="pl-18 text-slate-600 font-medium leading-[2.2] space-y-6 text-lg border-l-4 border-indigo-100 ml-6">
                            <p>{t('legal.privacy.telemetry.p1')}</p>
                        </div>
                    </section>
                </div>

                {/* Secure Trust Seal */}
                <div className="p-12 bg-slate-950 rounded-[4rem] flex flex-col items-center text-center space-y-8">
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-400/20">
                        <ShieldCheck className="text-slate-900" size={40} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-white font-black text-2xl tracking-tighter uppercase italic">{t('legal.privacy.verified')}</h4>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">{t('legal.complianceShield')}</p>
                    </div>
                </div>
            </div>

            <footer className="py-10 text-center border-t border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">
                {t('legal.privacy.footer')}
            </footer>
            </div>
            <PublicFooter />
        </div>
    );
};

export default PrivacyPolicy;
