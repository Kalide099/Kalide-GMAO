import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, EyeOff, Server, Globe, Key, AlertCircle, FileLock2 } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import SimulatedProcessModal from '../../components/SimulatedProcessModal';
import toast from 'react-hot-toast';

const SecurityProtocol = () => {
    const { t } = useTranslation();
    const [simModalOpen, setSimModalOpen] = useState(false);

    const protocols = [
        {
            icon: <ShieldCheck className="text-emerald-400" size={32} />,
            title: t('legal.pillars.encryption.title'),
            desc: t('legal.pillars.encryption.desc')
        },
        {
            icon: <Lock className="text-indigo-400" size={32} />,
            title: t('legal.pillars.zeroKnowledge.title'),
            desc: t('legal.pillars.zeroKnowledge.desc')
        },
        {
            icon: <EyeOff className="text-rose-400" size={32} />,
            title: t('legal.pillars.identity.title'),
            desc: t('legal.pillars.identity.desc')
        },
        {
            icon: <Server className="text-yellow-400" size={32} />,
            title: t('legal.pillars.iso.title'),
            desc: t('legal.pillars.iso.desc')
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-900 font-sans selection:bg-yellow-400 selection:text-slate-900">
            <PublicNavbar />
            <div className="flex-1">
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:px-24 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{t('legal.protocolActive')}</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight mb-6">
                        {t('legal.securityTitle').split(' ')[0]} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-100">{t('legal.securityTitle').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto uppercase tracking-wide">
                        {t('legal.securityDesc')}
                    </p>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-24 px-6 lg:px-24 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {protocols.map((p, i) => (
                        <div key={i} className="group p-10 bg-white/5 border border-white/5 rounded-[3rem] hover:bg-white/[0.08] transition-all duration-500">
                            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl group-hover:scale-110 transition-transform">
                                {p.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 italic">{p.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Detailed Protocol Stream */}
            <section className="py-24 px-6 lg:px-24 bg-slate-950">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="flex gap-8 items-start">
                        <div className="p-4 bg-yellow-400 rounded-2xl text-slate-900 shrink-0 shadow-lg shadow-yellow-400/20">
                            <FileLock2 size={24} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xl font-black text-white uppercase tracking-widest">{t('legal.stream.s1.title')}</h4>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {t('legal.stream.s1.desc')}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-8 items-start">
                        <div className="p-4 bg-indigo-500 rounded-2xl text-white shrink-0 shadow-lg shadow-indigo-500/20">
                            <Globe size={24} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xl font-black text-white uppercase tracking-widest">{t('legal.stream.s2.title')}</h4>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {t('legal.stream.s2.desc')}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-8 items-start">
                        <div className="p-4 bg-rose-500 rounded-2xl text-white shrink-0 shadow-lg shadow-rose-500/20">
                            <AlertCircle size={24} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xl font-black text-white uppercase tracking-widest">{t('legal.stream.s3.title')}</h4>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {t('legal.stream.s3.desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance Footer Banner */}
            <section className="py-20 px-6 lg:px-24 text-center">
                <div className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-[4rem] shadow-2xl shadow-yellow-400/10">
                    <Key className="text-slate-900 mx-auto mb-6" size={48} />
                    <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic mb-4">{t('legal.requestBlueprint')}</h2>
                    <p className="text-slate-900/70 font-bold mb-8 uppercase tracking-widest text-xs">{t('legal.blueprintDesc')}</p>
                    <button onClick={() => setSimModalOpen(true)} className="px-10 py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                        {t('legal.contactSecurity')}
                    </button>
                </div>
            </section>

            </div>
            <PublicFooter />

            <SimulatedProcessModal 
                isOpen={simModalOpen} 
                onClose={() => setSimModalOpen(false)} 
                title={t('legal.security.title')} 
                processingText={t('legal.security.processing')} 
                successText={t('legal.security.success')}
                onSuccessCallback={() => toast.success(t('legal.security.toast'))}
            />
        </div>
    );
};

export default SecurityProtocol;
