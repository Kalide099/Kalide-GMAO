import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Shield, Activity, Zap, Cpu, Server, Radio, Crosshair, Terminal, Database, Layers, Hexagon } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const GlobalMatrix = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen border-t border-slate-100 flex flex-col bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-yellow-400 selection:text-slate-950">
            <PublicNavbar />
            
            {/* Neural Background Grid */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,58,138,0.15)_0%,_transparent_70%)] pointer-events-none"></div>
            
            {/* Animated Hexagons background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 animate-pulse"><Hexagon size={120} className="text-white/10" strokeWidth={0.5} /></div>
                <div className="absolute top-3/4 right-1/4 animate-pulse delay-700"><Hexagon size={200} className="text-white/5" strokeWidth={0.5} /></div>
                <div className="absolute top-1/2 left-3/4 animate-pulse delay-1000"><Hexagon size={80} className="text-white/15" strokeWidth={0.5} /></div>
            </div>

            {/* Header Area */}
            <header className="relative pt-32 pb-40 px-6 lg:px-20 max-w-7xl mx-auto text-center space-y-12 animate-fade-in-up">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">{t('globalMatrix.visualizing')}</span>
                </div>
                
                <div className="space-y-6">
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]">
                        {t('globalMatrix.title').split(' ').slice(0, -1).join(' ')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-indigo-400 to-yellow-400 bg-[length:200%_auto] animate-text-shimmer">{t('globalMatrix.title').split(' ').slice(-1)}</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        {t('globalMatrix.subtitle')}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 pt-10">
                    <Link to="/register" className="px-12 py-6 bg-white text-slate-950 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-yellow-400 transition-all active:scale-95 shadow-2xl shadow-indigo-500/20">
                        {t('globalMatrix.join')}
                    </Link>
                    <Link to="/about" className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all active:scale-95">
                        {t('globalMatrix.briefing')}
                    </Link>
                </div>
            </header>

            {/* Matrix Visualization Section */}
            <section className="relative px-6 lg:px-20 pb-40">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                    
                    {/* Left Intelligence Cluster */}
                    <div className="lg:col-span-4 space-y-12 flex flex-col justify-center">
                        {[
                            { title: t('globalMatrix.stats.compute'), value: t('globalMatrix.stats.computeVal'), status: t('common.status.optimal'), icon: Cpu, color: 'indigo' },
                            { title: t('globalMatrix.stats.security'), value: t('globalMatrix.stats.securityVal'), status: t('iot.stable'), icon: Shield, color: 'emerald' },
                            { title: t('globalMatrix.stats.iot'), value: t('globalMatrix.stats.iotVal'), status: t('iot.synchronized'), icon: Radio, color: 'yellow' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl relative group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity`}><stat.icon size={80} /></div>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>{stat.title}</span>
                                        <span className={`text-${stat.color}-400`}>{stat.status}</span>
                                    </div>
                                    <h4 className="text-4xl font-black italic tracking-tighter text-white uppercase">{stat.value}</h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Central Core Globe */}
                    <div className="lg:col-span-8 relative min-h-[600px] bg-slate-900/40 rounded-[5rem] border border-white/5 overflow-hidden shadow-inner flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,58,138,0.2)_0%,_transparent_60%)]"></div>
                        <div className="relative group cursor-crosshair">
                            <div className="absolute -inset-40 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                            <Globe className="text-white w-96 h-96 opacity-10 animate-spin-slow group-hover:scale-110 group-hover:opacity-20 transition-all duration-1000" strokeWidth={0.5} />
                            
                            {/* Matrix Points */}
                            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                            <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-500"></div>
                            <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-emerald-400/50 rounded-full animate-ping delay-1000"></div>

                            {/* Center Status */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center space-y-2">
                                    <h2 className="text-4xl font-black italic tracking-tighter text-white opacity-40 group-hover:opacity-100 transition-opacity">{t('nav.sections.core')}</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">{t('iot.syncOk')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Telemetry Bar */}
                        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 border-t border-white/5 pt-8 backdrop-blur-md">
                            <div className="flex items-center gap-8">
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div> {t('globalMatrix.telemetry.latency')}</span>
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> {t('globalMatrix.telemetry.throughput')}</span>
                            </div>
                            <span className="text-white">{t('globalMatrix.telemetry.encryption')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategic Pillars Section */}
            <section className="py-40 bg-white text-slate-950 px-6 lg:px-20 relative rounded-t-[6rem]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
                        <div className="space-y-6 max-w-xl">
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-tight">
                                {t('globalMatrix.masterUnison').split(' ').slice(0, -1).join(' ')} <br/>
                                <span className="text-indigo-600">{t('globalMatrix.masterUnison').split(' ').slice(-1)}</span>
                            </h2>
                        </div>
                        <p className="text-xl text-slate-500 font-medium max-w-md uppercase tracking-widest leading-relaxed text-right">
                            {t('globalMatrix.unisonSub')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { title: t('globalMatrix.pillars.registry'), desc: t('globalMatrix.pillars.registryDesc'), icon: Database },
                            { title: t('globalMatrix.pillars.uplink'), desc: t('globalMatrix.pillars.uplinkDesc'), icon: Zap },
                            { title: t('globalMatrix.pillars.command'), desc: t('globalMatrix.pillars.commandDesc'), icon: Layers },
                            { title: t('globalMatrix.pillars.audit'), desc: t('globalMatrix.pillars.auditDesc'), icon: Terminal }
                        ].map((item, i) => (
                            <div key={i} className="space-y-6 group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                                    <item.icon size={32} />
                                </div>
                                <h4 className="text-2xl font-black uppercase italic tracking-tighter">{item.title}</h4>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed uppercase tracking-wide">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 px-6 lg:px-20 text-center bg-white flex-1 mb-20">
                <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up">
                    <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
                        {t('globalMatrix.sync.ready').split(' ').slice(0, -1).join(' ')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-yellow-500">{t('globalMatrix.sync.ready').split(' ').slice(-1)}</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-medium uppercase tracking-[0.2em] leading-relaxed max-w-xl mx-auto">
                        {t('globalMatrix.sync.manual')}
                    </p>
                    <div className="pt-8 flex flex-col items-center gap-6">
                        <Link to="/register" className="px-20 py-8 bg-slate-950 text-white rounded-[3rem] font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-3xl shadow-slate-200">
                            {t('globalMatrix.initNode')}
                        </Link>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('globalMatrix.availableClusters')}</p>
                    </div>
                </div>
            </section>
            
            <PublicFooter />
        </div>
    );
};

export default GlobalMatrix;
