import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Globe, ArrowRight, Activity, BrainCircuit, TrendingUp, Building2, HeartPulse, GraduationCap, UtensilsCrossed, ShoppingCart, Truck, Factory, Leaf, Waves, Download } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const LandingPage = () => {
    const { t } = useTranslation();
    const [activeSlide, setActiveSlide] = React.useState(0);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000",
            industry: t('marketing.industries.manufacturing'),
            tagline: t('marketing.heroSlides.p1')
        },
        {
            image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=2000",
            industry: t('marketing.industries.energy'),
            tagline: t('marketing.heroSlides.p2')
        },
        {
            image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=2000",
            industry: t('marketing.industries.mining'),
            tagline: t('marketing.heroSlides.p3')
        }
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans overflow-hidden flex flex-col">
            <PublicNavbar />
            <div className="flex-1">

            {/* Hero Section - Cinematic Multi-Sector */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 lg:px-24 overflow-hidden pt-20">
                {/* Carousel Engine */}
                <div className="absolute inset-0 z-0">
                    {slides.map((slide, idx) => (
                        <div 
                            key={idx}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                                idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                            }`}
                        >
                            <img 
                                src={slide.image} 
                                className="w-full h-full object-cover brightness-[0.7] contrast-[1.15] saturate-[1.1] transition-transform duration-[6000ms] ease-linear" 
                                alt={slide.industry} 
                            />
                            {/* Clearer, cleaner gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/70"></div>
                            {/* Subtle industrial grid pattern for 'neat' feel */}
                            <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                        </div>
                    ))}
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col items-center text-center animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-8">
                        {slides.map((_, idx) => (
                            <div 
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-500 ${
                                    idx === activeSlide ? 'w-12 bg-yellow-400' : 'w-4 bg-white/20'
                                }`}
                            />
                        ))}
                    </div>

                    <span className="bg-yellow-400 text-slate-900 font-black px-6 py-2 rounded-2xl text-[10px] uppercase tracking-[0.4em] mb-10 flex items-center gap-3 shadow-2xl backdrop-blur-sm">
                        <span className="w-2 h-2 bg-slate-900 rounded-full animate-ping"></span>
                        {slides[activeSlide].tagline}
                    </span>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] max-w-6xl uppercase italic mb-8 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                        {t('marketing.heroTitle')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">
                            {t('marketing.heroTitleHighlight')}
                        </span>
                    </h1>
                    
                    <p className="mt-4 text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed font-medium">
                        {t('marketing.heroSubtitle')}
                    </p>
                    
                    <div className="mt-12 flex flex-col md:flex-row md:flex-wrap md:justify-center gap-4 w-full max-w-5xl">
                        <Link to="/register" className="px-8 lg:px-10 py-5 bg-white hover:bg-yellow-400 text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-center leading-tight">
                            {t('marketing.startTrialBtn')}
                            <ArrowRight size={18} />
                        </Link>
                        <a href="/downloads/KGMAO-Desktop-Setup-1.0.0.exe" download className="px-8 lg:px-10 py-5 bg-yellow-400 hover:bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-center leading-tight">
                            {t('marketing.downloadDesktop')}
                            <Download size={18} />
                        </a>
                        <Link to="/login" className="px-8 lg:px-10 py-5 bg-transparent border-2 border-white/20 hover:border-yellow-400 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] backdrop-blur-md transition-all flex items-center justify-center gap-3 group text-center leading-tight">
                            {t('marketing.login')}
                            <Zap size={14} className="text-yellow-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>

                    {/* Sector Indicator */}
                    <div className="mt-16 flex flex-col items-center">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-4">{t('marketing.enterpriseDomain')}</p>
                        <p className="text-2xl font-black text-yellow-400 uppercase italic tracking-widest animate-pulse">
                            {slides[activeSlide].industry}
                        </p>
                    </div>
                </div>

                {/* Floating Metric HUD - Premium Glass */}
                <div className="absolute top-1/2 left-6 xl:left-12 hidden md:flex flex-col gap-6 -translate-y-1/2 z-20">
                    <div className="p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 animate-float">
                        <Activity className="text-rose-500 mb-4 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" size={32} />
                        <p className="font-black text-2xl text-white tracking-tighter">99.98%</p>
                        <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] mt-2">{t('marketing.slaUptime')}</p>
                    </div>
                    <div className="p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 animate-float md:delay-700">
                        <ShieldCheck className="text-emerald-400 mb-4 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" size={32} />
                        <p className="font-black text-2xl text-white tracking-tighter">ISO-27K</p>
                        <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] mt-2">{t('marketing.certifiedCore')}</p>
                    </div>
                </div>
            </section>

            {/* Global Trust Section */}
            <section className="py-24 bg-slate-900 text-center relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
                
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-12 italic">{t('marketing.trustSeal')}</p>
                <div className="flex flex-wrap justify-center gap-16 md:gap-24 items-center px-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-2 font-black text-2xl text-white tracking-tighter italic"><ShieldCheck className="text-yellow-400" /> {t('marketing.gdpr')}</div>
                    <div className="flex items-center gap-2 font-black text-2xl text-white tracking-tighter italic"><Globe className="text-yellow-400" /> {t('marketing.iso27001')}</div>
                    <div className="text-2xl font-black font-serif italic text-white tracking-tighter uppercase">{t('marketing.stripe')}</div>
                    <div className="text-3xl font-black text-white tracking-tighter italic uppercase underline decoration-yellow-400 decoration-4">{t('marketing.razorpay')}</div>
                </div>
            </section>

            {/* Strategic Value Section - Industrial Dark Theme */}
            <section className="py-32 px-6 lg:px-24 bg-slate-900 relative">
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                    <div className="p-12 rounded-[4rem] bg-white/5 backdrop-blur-xl border border-white/10 space-y-6 group hover:translate-y-[-10px] transition-all duration-500 hover:bg-white/10">
                        <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center shadow-2xl group-hover:bg-yellow-400 group-hover:rotate-12 transition-all">
                            <TrendingUp className="text-yellow-400 group-hover:text-slate-900" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic">{t('dashboard.overview')}</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">{t('marketing.strategicOverviewDesc')}</p>
                    </div>

                    <div className="p-12 rounded-[4rem] bg-white/5 backdrop-blur-xl border border-white/10 space-y-6 group hover:translate-y-[-10px] transition-all duration-500 hover:bg-white/10">
                        <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center shadow-2xl group-hover:bg-yellow-400 group-hover:rotate-12 transition-all">
                            <BrainCircuit className="text-yellow-400 group-hover:text-slate-900" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic">{t('nav.predictive')}</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">{t('marketing.predictiveLogicDesc')}</p>
                    </div>

                    <div className="p-12 rounded-[4rem] bg-white/5 backdrop-blur-xl border border-white/10 space-y-6 group hover:translate-y-[-10px] transition-all duration-500 hover:bg-white/10">
                        <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center shadow-2xl group-hover:bg-yellow-400 group-hover:rotate-12 transition-all">
                            <Activity className="text-yellow-400 group-hover:text-slate-900" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic">{t('nav.iot')}</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">{t('marketing.iotCommandDesc')}</p>
                    </div>
                </div>
            </section>

            {/* Industries Matrix Section - Comprehensive Sector Coverage */}
            <section className="py-32 px-6 lg:px-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{t('globalMatrix.masterUnison')}</h2>
                        <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-sm">{t('marketing.heroTitleHighlight')}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[
                            { key: 'manufacturing', icon: Factory },
                            { key: 'healthcare', icon: HeartPulse },
                            { key: 'energy', icon: Zap },
                            { key: 'environment', icon: Leaf },
                            { key: 'education', icon: GraduationCap },
                            { key: 'agrifood', icon: UtensilsCrossed },
                            { key: 'construction', icon: Building2 },
                            { key: 'logistics', icon: Truck },
                            { key: 'hospitality', icon: UtensilsCrossed },
                            { key: 'retail', icon: ShoppingCart },
                            { key: 'mining', icon: Waves },
                            { key: 'public_works', icon: ShieldCheck }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-slate-900 hover:border-slate-800 transition-all duration-500 cursor-default">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    <item.icon className="text-indigo-600 group-hover:text-yellow-400" size={24} />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 group-hover:text-white uppercase italic tracking-tight leading-tight">
                                    {t(`marketing.industries.${item.key}`)}
                                </h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            </div>
            <PublicFooter />
        </div>
    );
};

export default LandingPage;
