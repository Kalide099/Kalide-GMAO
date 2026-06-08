import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Wrench, Briefcase, Activity, Zap, TrendingUp, Globe, ArrowRight, Layers } from 'lucide-react';
import useIndustryIndustry from '../hooks/useIndustryIndustry';
import api from '../services/api/axiosConfig';

const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const industryTerms = useIndustryIndustry();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/company/my-company/dashboard-stats');
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const metrics = [
        { title: industryTerms.assetName, value: stats ? stats.metrics.totalAssets.toLocaleString() : '0', icon: <Wrench size={24} />, color: 'bg-slate-900', shadow: 'shadow-slate-100', accent: 'bg-yellow-400' },
        { title: industryTerms.throughput, value: stats ? stats.metrics.throughput : '0%', icon: <Activity size={24} />, color: 'bg-slate-900', shadow: 'shadow-slate-100', accent: 'bg-emerald-400' },
        { title: industryTerms.mainMetric, value: stats ? stats.metrics.activeWorkOrders.toLocaleString() : '0', icon: <Briefcase size={24} />, color: 'bg-slate-900', shadow: 'shadow-slate-100', accent: 'bg-rose-400' },
    ];

    const strategyCards = [
        { title: t('nav.global'), desc: t('dashboard.desc.global'), icon: <Globe size={32} />, path: '/app/global', color: 'from-slate-800 to-slate-900', accent: 'text-teal-400' },
        { title: t('nexus.title'), desc: t('nexus.subtitle'), icon: <Layers size={32} />, path: '/app/nexus', color: 'from-indigo-600 to-indigo-900', accent: 'text-yellow-400' },
        { title: t('nav.energy'), desc: t('dashboard.desc.energy'), icon: <Zap size={32} />, path: '/app/energy', color: 'from-slate-800 to-slate-900', accent: 'text-yellow-400' },
        { title: t('nav.performance'), desc: t('dashboard.desc.performance'), icon: <TrendingUp size={32} />, path: '/app/performance', color: 'from-slate-800 to-slate-900', accent: 'text-indigo-400' },
    ];

    return (
        <div className="space-y-16 pb-20">
            {/* Ultra High-Fidelity Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                   <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{t('dashboard.overview')}</h1>
                   <div className="flex items-center gap-3">
                       <span className="h-1 w-12 bg-yellow-400 rounded-full"></span>
                       <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">{t('dashboard.subtitle')}</p>
                   </div>
                </div>
                <div className="px-10 py-5 bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-900/10 flex items-center gap-4 border border-slate-800 group cursor-pointer hover:border-yellow-400/50 transition-all">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{t('dashboard.systemSynchronized')}</span>
                    <ArrowRight size={16} className="text-white/20 group-hover:text-yellow-400 transition-colors" />
                </div>
            </div>
            
            {/* Modular KPI Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-72 transition-all hover:shadow-2xl hover:border-slate-200 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] flex items-center justify-center -mr-4 -mt-4 group-hover:bg-yellow-50 transition-colors">
                            <div className={`${metric.accent} w-3 h-3 rounded-full shadow-lg`}></div>
                        </div>
                        
                        <div className={`w-16 h-16 ${metric.color} text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-900/20 group-hover:rotate-6 transition-transform`}>
                            {metric.icon}
                        </div>
                        
                        <div>
                            <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{metric.value}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                                <span className={`w-1 h-3 ${metric.accent} rounded-full`}></span>
                                {metric.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Strategic Gateway Matrix */}
            <div className="space-y-10">
                <div className="flex items-center gap-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">{t('dashboard.strategicGateways')}</h3>
                    <div className="flex-1 h-px bg-slate-100"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
                    {strategyCards.map((card, i) => (
                        <button 
                            key={i} 
                            onClick={() => navigate(card.path)}
                            className={`p-12 rounded-[4rem] bg-gradient-to-br ${card.color} text-white text-left transition-all hover:shadow-3xl hover:-translate-y-3 group relative overflow-hidden border border-white/5 active:scale-95`}
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-yellow-400/10 transition-colors"></div>
                            
                            <div className="relative z-10 space-y-8">
                                <div className="p-5 bg-white/10 backdrop-blur-md rounded-[2rem] w-fit border border-white/10 group-hover:border-yellow-400/30 transition-colors">
                                    <div className={card.accent}>{card.icon}</div>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black tracking-tighter uppercase leading-none italic">{card.title}</h4>
                                    <p className="text-slate-400 text-[10px] font-bold mt-4 leading-relaxed uppercase tracking-widest">{card.desc}</p>
                                </div>
                                <div className="pt-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-yellow-400 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                    {t('dashboard.accessPortal')} <ArrowRight size={16} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* High-Impact Activity Stream Placeholder */}
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col relative group">
                <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">{t('dashboard.recentActivity')}</h3>
                    </div>
                    <button 
                        onClick={() => navigate('/app/audit')}
                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                    >
                        {t('dashboard.viewAuditLog')}
                    </button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 lg:p-20 space-y-6">
                    {loading ? (
                        <>
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-inner animate-pulse">
                                <Activity className="text-slate-200" size={48} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-slate-800 font-black uppercase tracking-widest text-xs italic">{t('dashboard.loadingForensic')}</p>
                                <div className="flex justify-center gap-1">
                                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
                                </div>
                            </div>
                        </>
                    ) : stats?.recentActivity?.length > 0 ? (
                        <div className="w-full text-left space-y-4">
                            {stats.recentActivity.map((activity, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-all hover:bg-slate-100">
                                    <div>
                                        <p className="font-black text-slate-900 uppercase text-sm tracking-widest italic">{activity.action.replace(/_/g, ' ')}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">{activity.entity_type}</p>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {new Date(activity.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-inner group-hover:rotate-12 transition-transform">
                                <Activity className="text-slate-200" size={48} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">{t('dashboard.noRecentActivity')}</p>
                            </div>
                        </>
                    )}
                </div>
                
                {/* Decorative Bottom Mesh */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
            </div>
        </div>
    );
};

export default Dashboard;
