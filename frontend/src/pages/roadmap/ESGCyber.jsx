import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, ShieldAlert, Zap, Globe, AlertTriangle, ShieldCheck, Activity, Download } from 'lucide-react';
import api from '../../services/api/axiosConfig';

const ESGCyber = () => {
    const { t } = useTranslation();
    const [view, setView] = useState('esg'); // 'esg' or 'cyber'
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/energy/overview');
                if (res.data.success) setData(res.data.data);
            } catch (e) {
                console.error("ESG Fetch Failed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="p-20 text-center font-black text-slate-300 italic animate-pulse uppercase tracking-widest text-xs">{t('roadmap.esg.syncing')}</p>
        </div>
    );

    const stats = data?.stats || { total_energy: 0, total_carbon: 0, total_water: 0, avg_consumption: 0 };

    return (
        <div className="space-y-12 animate-fade-in-up uppercase">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">{t('roadmap.esg.title')}</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-1 w-12 bg-emerald-500 rounded-full"></span>
                        <p className="text-slate-400 font-black tracking-[0.4em] text-[10px]">{t('roadmap.esg.subtitle')}</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-2 rounded-[2rem] border border-slate-200">
                    <button 
                        onClick={() => setView('esg')}
                        className={`px-10 py-4 rounded-full font-black text-[10px] tracking-widest transition-all ${view === 'esg' ? 'bg-emerald-800 text-white shadow-xl' : 'text-slate-500'}`}
                    >
                        {t('roadmap.esg.energyTab')}
                    </button>
                    <button 
                        onClick={() => setView('cyber')}
                        className={`px-10 py-4 rounded-full font-black text-[10px] tracking-widest transition-all ${view === 'cyber' ? 'bg-rose-900 text-white shadow-xl' : 'text-slate-500'}`}
                    >
                        {t('roadmap.esg.cyberTab')}
                    </button>
                </div>
            </div>

            {view === 'esg' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="bg-white p-16 rounded-[4.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-[500px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap size={200} />
                        </div>
                        <Leaf className="text-emerald-600" size={48} />
                        <div>
                            <p className="text-7xl font-black text-slate-900 tracking-tighter italic">{stats.total_carbon}t</p>
                            <p className="text-[12px] font-black text-slate-400 tracking-widest uppercase mt-4">{t('roadmap.esg.footprint')}</p>
                            <div className="flex items-center gap-4 text-emerald-600 font-black text-xs mt-6">
                                <ShieldCheck size={18} /> {t('roadmap.esg.compliance')}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-slate-900 p-16 rounded-[4.5rem] text-white shadow-2xl space-y-12 h-full">
                            <div className="flex justify-between items-start">
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black italic tracking-tighter">{t('roadmap.esg.analytics')}</h3>
                                    <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">{t('roadmap.esg.intensity')}</p>
                                </div>
                                <button className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white hover:text-slate-900 transition-all">
                                    <Download size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                        <span>{t('roadmap.esg.consumption')}</span>
                                        <span className="text-emerald-400">{t('roadmap.esg.optimal')}</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-emerald-500 rounded-full"></div>
                                    </div>
                                    <p className="text-2xl font-black italic">{Number(stats.total_energy).toLocaleString()} kWh</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                        <span>{t('roadmap.esg.water')}</span>
                                        <span className="text-blue-400">{t('roadmap.esg.monitored')}</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-1/2 bg-blue-500 rounded-full"></div>
                                    </div>
                                    <p className="text-2xl font-black italic">{stats.total_water} m³</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-3 space-y-10">
                         <div className="bg-rose-950 p-16 rounded-[4.5rem] text-white shadow-2xl border-l-[16px] border-rose-600 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-16 opacity-5">
                                <ShieldAlert size={180} />
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Activity className="text-rose-500 animate-pulse" size={32} />
                                    <h3 className="text-4xl font-black italic tracking-tighter">{t('roadmap.esg.threatCore')}</h3>
                                </div>
                                <p className="text-slate-400 font-black text-[10px] tracking-widest leading-loose max-w-2xl italic">
                                    &quot;{t('roadmap.esg.threatMsg')}&quot;
                                </p>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 flex items-center justify-between group hover:bg-slate-900 transition-all">
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 group-hover:text-white italic leading-none">{t('roadmap.esg.riskScore', { score: '04' })}</h4>
                                    <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-4">{t('roadmap.esg.posture')}</p>
                                </div>
                                <ShieldCheck className="text-emerald-500 group-hover:text-yellow-400" size={48} />
                             </div>
                             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 flex items-center justify-between group hover:bg-slate-900 transition-all">
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 group-hover:text-white italic leading-none">{t('roadmap.esg.encrypted')}</h4>
                                    <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-4">{t('roadmap.esg.tunneling')}</p>
                                </div>
                                <Globe className="text-indigo-600 group-hover:text-yellow-400" size={48} />
                             </div>
                         </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-200 h-full flex flex-col justify-between">
                            <div className="space-y-6">
                                <AlertTriangle className="text-rose-500" size={32} />
                                <h4 className="text-xl font-black text-slate-900 italic">{t('roadmap.esg.securityAudit')}</h4>
                                <div className="space-y-4">
                                    <div className="text-[9px] font-black text-slate-400 tracking-widest border-b border-slate-200 pb-2 uppercase">{t('common.lastUpdate')}: {t('roadmap.esg.systemBoot')}</div>
                                    <p className="text-[10px] font-black text-slate-600 tracking-widest leading-loose italic">
                                        &quot;{t('roadmap.esg.auditPass')}&quot;
                                    </p>
                                </div>
                            </div>
                            <button className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-[10px] tracking-widest hover:scale-105 transition-all">
                                {t('roadmap.esg.deepScan')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ESGCyber;
