import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { Zap, Activity, Battery, Leaf, TrendingUp, AlertTriangle } from 'lucide-react';

const Energy = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalConsumption: 0,
        efficiencyScore: 0,
        savingsUSD: 0,
        emissionReductionTons: 0,
        gridLoad: 0,
        solarShare: 0,
        capacitorHealth: 0,
        peakSurge: 0
    });
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/energy');
            if (res.data.success) {
                setStats(res.data.data.stats);
                setNodes(res.data.data.nodes);
            }
        } catch (error) {
            console.error("Energy Intelligence Sync Failure", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading && nodes.length === 0) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const lang = localStorage.getItem('kgmao_language') || 'en';

    return (
        <div className="space-y-10 animate-fade-in-up pb-20">
            {/* Energy Intelligence Header */}
            <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10 text-center lg:text-left">
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                            <Zap className="text-white w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">{t('energy.title')}</h1>
                            <p className="text-emerald-300 font-bold uppercase tracking-widest text-sm">{t('energy.subtitle')}</p>
                        </div>
                    </div>
                    <div className="h-20 w-px bg-white/10 hidden lg:block"></div>
                    <div className="flex gap-12">
                        <div className="text-center">
                            <span className="block text-4xl font-black tracking-tight">{stats.efficiencyScore}%</span>
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t('energy.efficiency')}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-4xl font-black tracking-tight">{stats.emissionReductionTons}t</span>
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t('energy.co2')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-indigo-200 transition-all">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                        <Activity size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t('energy.gridLoad')}</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">{stats.gridLoad} {t('energy.mwPerHour')}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-emerald-100 transition-all">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                        <Battery size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t('energy.capacitor')}</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">{stats.capacitorHealth}% {t('energy.health')}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-amber-100 transition-all">
                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t('energy.peak')}</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">{stats.peakSurge > 0 ? `+${stats.peakSurge}%` : '0%'} {t('energy.surge')}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-teal-100 transition-all">
                    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                        <Leaf size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t('energy.renewables')}</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">{stats.solarShare}% {t('energy.solarShare')}</p>
                    </div>
                </div>
            </div>

            {/* Consumer Nodes */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t('energy.diagnosticNodes')}</h3>
                    <div className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        {t('energy.liveTelemetry')}
                    </div>
                </div>
                <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {nodes.map(node => (
                            <div key={node.id} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-indigo-100 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        <Activity className="text-slate-400" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{lang === 'fr' ? node.name_fr : node.name_en}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                node.trend === 'up' ? 'text-rose-500' : 
                                                node.trend === 'down' ? 'text-emerald-500' : 'text-slate-400'
                                            }`}>
                                                {node.trend === 'up' ? t('energy.consumptionSurge') : node.trend === 'down' ? t('energy.optimized') : t('energy.nominal')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter">{node.consumption}</span>
                                    <span className="ml-2 text-xs font-black text-slate-400 uppercase">{t('energy.kwUnit')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Energy;
