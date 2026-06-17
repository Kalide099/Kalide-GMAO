import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Check, Zap, Cpu, Server, Terminal, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const GlobalPricing = () => {
    const { t } = useTranslation();
    const [isYearly, setIsYearly] = useState(true);

    const plans = [
        {
            name: t('pricing.tiers.basic.name'),
            price: t('pricing.tbd'),
            desc: t('pricing.tiers.basic.desc'),
            features: [],
            icon: Cpu,
            color: "indigo"
        },
        {
            name: t('pricing.tiers.pro.name'),
            price: t('pricing.tbd'),
            desc: t('pricing.tiers.pro.desc'),
            features: [],
            isPopular: true,
            icon: Activity,
            color: "emerald"
        },
        {
            name: t('pricing.tiers.enterprise.name'),
            price: t('pricing.tbd'),
            desc: t('pricing.tiers.enterprise.desc'),
            features: [],
            icon: Shield,
            color: "yellow"
        }
    ];

    // Combine features from translation if possible, or use static for premium feel
    plans[0].features = t('pricing.tiers.basic.features', { returnObjects: true }) || plans[0].features;
    plans[1].features = t('pricing.tiers.pro.features', { returnObjects: true }) || plans[1].features;
    plans[2].features = t('pricing.tiers.enterprise.features', { returnObjects: true }) || plans[2].features;

    return (
        <div className="min-h-screen border-t border-slate-100 flex flex-col bg-white relative overflow-hidden selection:bg-yellow-100 selection:text-yellow-900 font-sans">
            <PublicNavbar />
            
            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-[150px] pointer-events-none"></div>

            <section className="relative pt-32 pb-40 px-6 lg:px-20 max-w-7xl mx-auto text-center flex-1">
                <div className="max-w-3xl mx-auto space-y-8 mb-24 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                        <Terminal className="text-yellow-400" size={14} />
                        <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">{t('globalPricingPage.matrixVersion')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">
                        {t('globalPricingPage.title').split(' ').slice(0, -1).join(' ')} <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">{t('globalPricingPage.title').split(' ').slice(-1)}</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium uppercase tracking-[0.2em] leading-relaxed">
                        {t('globalPricingPage.subtitle')}
                    </p>

                    <div className="flex items-center justify-center gap-6 pt-10">
                        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${!isYearly ? 'text-slate-950' : 'text-slate-400'}`}>{t('globalPricingPage.monthly')}</span>
                        <button 
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-16 h-8 bg-slate-900 rounded-full relative p-1.5 group"
                        >
                            <div className={`h-full aspect-square bg-yellow-400 rounded-full transition-all duration-300 ${isYearly ? 'ml-auto' : 'ml-0'}`}></div>
                        </button>
                        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${isYearly ? 'text-slate-950' : 'text-slate-400'}`}>{t('globalPricingPage.yearly')}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-end">
                    {plans.map((plan, i) => (
                        <div 
                            key={i} 
                            className={`relative group bg-white rounded-[3rem] lg:rounded-[4rem] p-8 lg:p-12 border transition-all duration-500 hover:-translate-y-4 animate-fade-in-up ${
                                plan.isPopular ? 'border-emerald-400 shadow-[0_40px_100px_-20px_rgba(16,185,129,0.2)]' : (plan.color === 'yellow' ? 'border-amber-400 shadow-[0_40px_100px_-20px_rgba(245,158,11,0.1)]' : 'border-slate-100 shadow-sm hover:shadow-2xl')
                            }`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-6 py-2 uppercase tracking-widest rounded-full shadow-lg">
                                    {t('globalPricingPage.recommended')}
                                </div>
                            )}

                            <div className="space-y-10">
                                <div className="flex justify-between items-start">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                                        plan.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : (plan.color === 'yellow' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600')
                                    }`}>
                                        <plan.icon size={32} />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{plan.name}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('globalPricingPage.operationalTier')}</p>
                                    </div>
                                </div>

                                <div className="text-left border-y border-slate-50 py-10">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 italic tracking-tighter">
                                            {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                                        </span>
                                        {typeof plan.price === 'number' && <span className="text-xs font-black text-slate-400 uppercase tracking-widest">/ {t('globalPricingPage.monthly')}</span>}
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium mt-4">{plan.desc}</p>
                                </div>

                                <ul className="space-y-6 text-left">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-slate-700">
                                            <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wide">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link 
                                    to="/register" 
                                    className={`block w-full py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
                                        plan.isPopular ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {t('globalPricingPage.activate')}
                                </Link>
                                
                                {plan.isPopular && (
                                    <div className="flex items-center justify-center gap-2 pt-2">
                                        <Zap size={14} className="text-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{t('pricing.healthBoost') || 'Health Logic Matrix Included'}</span>
                                    </div>
                                )}
                                {plan.color === 'yellow' && (
                                    <div className="flex items-center justify-center gap-2 pt-2">
                                        <Shield className="text-amber-500" size={14} />
                                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">{t('pricing.ssoAudit') || 'SSO & Multi-Tenant Audit Active'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Scale Comparison Matrix */}
            <section className="py-40 bg-slate-50 px-6 lg:px-20 border-t border-slate-100 mb-20">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
                    <div className="lg:w-1/2 space-y-12 animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">
                            {t('globalPricingPage.scaleTitle').split(' ').slice(0, -1).join(' ')} <br className="hidden lg:block"/>
                            <span className="text-indigo-600">{t('globalPricingPage.scaleTitle').split(' ').slice(-1)}</span>
                        </h2>
                        <div className="space-y-8">
                            {[
                                { title: t('globalPricingPage.elasticClusters'), desc: t('globalPricingPage.elasticClustersDesc') },
                                { title: t('globalPricingPage.costEfficiency'), desc: t('globalPricingPage.costEfficiencyDesc') }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><Zap size={20} className="text-yellow-500" /></div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{item.title}</h4>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="bg-slate-950 rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-12 text-white shadow-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 lg:p-12 opacity-5"><Server size={140} /></div>
                            <Terminal className="text-yellow-400 mb-8" size={32} />
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8">{t('globalPricingPage.infraPayload')}</h3>
                            <div className="space-y-8">
                                {[
                                    { label: t('globalPricingPage.computePower'), value: '42.1 TFLOPs' },
                                    { label: t('globalPricingPage.networkLatency'), value: '< 15ms' },
                                    { label: t('globalPricingPage.neuralThroughput'), value: '1.2 PB/s' }
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            <span>{stat.label}</span>
                                            <span className="text-white italic">{stat.value}</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-400" style={{ width: `${80 - (i * 15)}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <PublicFooter />
        </div>
    );
};

export default GlobalPricing;
