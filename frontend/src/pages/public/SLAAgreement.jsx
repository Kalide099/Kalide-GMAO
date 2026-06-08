import { useTranslation } from 'react-i18next';
import { Activity, Clock, Zap, CheckCircle2, AlertTriangle, ShieldCheck, HeartPulse, HardDrive } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const SLAAgreement = () => {
    const { t } = useTranslation();

    const metrics = [
        {
            icon: <Activity className="text-yellow-400" />,
            label: t('legal.metrics.uptime'),
            value: "99.98%",
            sub: t('legal.metrics.uptimeSub')
        },
        {
            icon: <Clock className="text-indigo-400" />,
            label: t('legal.metrics.response'),
            value: "< 15ms",
            sub: t('legal.metrics.responseSub')
        },
        {
            icon: <ShieldCheck className="text-emerald-400" />,
            label: t('legal.metrics.durability'),
            value: t('legal.metrics.durabilityValue'),
            sub: t('legal.metrics.durabilitySub')
        },
        {
            icon: <Zap className="text-rose-400" />,
            label: t('legal.metrics.mttr'),
            value: t('legal.commitments.c3.h2'),
            sub: t('legal.metrics.mttrSub')
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-yellow-400 selection:text-slate-900 flex flex-col">
            <PublicNavbar />
            <div className="flex-1">
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:px-24 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-8">
                            <HeartPulse className="text-yellow-400" size={14} />
                            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">{t('legal.reliability')}</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight mb-6">
                            {t('legal.slaTitle').split(' ')[0]} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-100 italic">{t('legal.slaTitle').split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed uppercase tracking-wide">
                            {t('legal.slaSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
                        {metrics.map((m, i) => (
                            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
                                <div className="mb-4">{m.icon}</div>
                                <div className="text-3xl font-black text-white italic">{m.value}</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{m.label}</div>
                                <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2">{m.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Commitments */}
            <section className="py-24 px-6 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-4">
                                    <CheckCircle2 className="text-emerald-500" size={32} />
                                    {t('legal.commitments.c1.title')}
                                </h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    {t('legal.commitments.c1.desc')}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-4">
                                    <HardDrive className="text-indigo-500" size={32} />
                                    {t('legal.commitments.c2.title')}
                                </h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    {t('legal.commitments.c2.desc')}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-4">
                                    <AlertTriangle className="text-rose-500" size={32} />
                                    {t('legal.commitments.c3.title')}
                                </h3>
                                <div className="overflow-hidden border border-slate-100 rounded-3xl shadow-sm bg-white">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('legal.commitments.c3.severity')}</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('legal.commitments.c3.responseTime')}</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('legal.commitments.c3.resolution')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="px-6 py-4 font-black text-rose-600 text-[10px] uppercase">{t('legal.commitments.c3.l1')}</td>
                                                <td className="px-6 py-4 font-bold text-slate-700">{t('legal.commitments.c3.m15')}</td>
                                                <td className="px-6 py-4 font-bold text-slate-700">{t('legal.commitments.c3.h2')}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 font-black text-amber-600 text-[10px] uppercase">{t('legal.commitments.c3.l2')}</td>
                                                <td className="px-6 py-4 font-bold text-slate-700">{t('legal.commitments.c3.h1')}</td>
                                                <td className="px-6 py-4 font-bold text-slate-700">{t('legal.commitments.c3.h6')}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase">{t('legal.commitments.c3.l3')}</td>
                                                <td className="px-6 py-4 font-bold text-slate-700">{t('legal.commitments.c3.h4')}</td>
                                                <td className="px-6 py-4 font-bold text-slate-700">{t('legal.commitments.c3.h24')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl h-fit">
                            <Zap className="text-yellow-400 mb-6" size={42} />
                            <h4 className="text-2xl font-black uppercase tracking-tight italic mb-4">{t('legal.credits.title')}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                                {t('legal.credits.desc')}
                            </p>
                            <div className="space-y-4 pt-8 border-t border-white/10">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-slate-500">99.0% - 99.9%</span>
                                    <span className="text-yellow-400">{t('legal.credits.tier1')}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-slate-500">95.0% - 99.0%</span>
                                    <span className="text-yellow-400">{t('legal.credits.tier2')}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-slate-500">&lt; 95.0%</span>
                                    <span className="text-yellow-400">{t('legal.credits.tier3')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            </div>
            <PublicFooter />
        </div>
    );
};

export default SLAAgreement;
