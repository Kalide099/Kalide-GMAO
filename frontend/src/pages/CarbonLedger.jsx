import { useState, useEffect } from 'react';
import api from '../services/api/axiosConfig';
import { useTranslation } from 'react-i18next';
import { Leaf, TrendingDown, Award, ShieldCheck, Zap } from 'lucide-react';

const CarbonLedger = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalCarbon: 0,
        avgConsumption: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/energy');
            if (res.data.success) {
                setStats(res.data.data.stats);
            }
        } catch (error) {
            console.error("Carbon Ledger Sync Failure", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInitExchange = async () => {
        await fetchData();

        const exportPayload = {
            generated_at: new Date().toISOString(),
            total_carbon: stats.totalCarbon,
            average_consumption: stats.avgConsumption
        };

        const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'carbon-ledger-export.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    if (loading && stats.totalCarbon === 0) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header */}
            <div className="bg-emerald-950 p-12 lg:p-16 rounded-[4rem] text-white overflow-hidden relative border border-emerald-900 shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent"></div>
                
                <div className="max-w-3xl relative z-10">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                            <Leaf className="text-emerald-950" size={36} fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">{t('carbon.title')}</h1>
                            <p className="text-emerald-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">{t('carbon.subtitle')}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-12 relative z-10">
                    <div className="px-6 py-4 bg-emerald-900/50 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                        <ShieldCheck className="text-emerald-400" size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('carbon.ledgerVerified')}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm flex flex-col justify-between">
                        <div className="space-y-2">
                            <TrendingDown className="text-emerald-500" size={32} />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('carbon.offsetValue')}</h4>
                        </div>
                        <div className="mt-8">
                            <span className="text-7xl font-black text-slate-900 tracking-tighter italic">{stats.totalCarbon.toLocaleString()}</span>
                            <span className="text-xl font-black text-slate-400 ml-3 uppercase italic">{t('carbon.metricTons')}</span>
                        </div>
                    </div>

                    <div className="p-10 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm flex flex-col justify-between">
                        <div className="space-y-2">
                            <Zap className="text-yellow-500" size={32} />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('carbon.emissionFlux')}</h4>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-7xl font-black text-slate-900 tracking-tighter italic">{(stats.avgConsumption * 0.45).toFixed(1)}</span>
                                <span className="text-sm font-black text-rose-500 uppercase tracking-widest">{t('carbon.kgPerHour')}</span>
                            </div>
                            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                                 <div className="h-full bg-emerald-500 w-[40%] animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trading Hub Sidebar */}
                <div className="bg-slate-950 p-10 rounded-[4rem] text-white space-y-8 shadow-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <Award className="text-yellow-400" size={28} />
                        <h3 className="text-xl font-black uppercase tracking-widest italic">{t('carbon.tradingHub')}</h3>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl group hover:bg-white/10 transition-all cursor-pointer">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black text-emerald-400 uppercase">{t('carbon.tokenIdPrefix')} 49{i}</span>
                                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{t('carbon.hubPrefix')} 0{i}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-2xl font-black italic">{"$"}{"42."}{i}{"0"}</span>
                                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic">{t('carbon.perCredit')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleInitExchange} className="w-full py-5 bg-emerald-500 text-emerald-950 rounded-[2rem] font-black uppercase tracking-widest transition-all hover:bg-emerald-400 active:scale-95 shadow-xl shadow-emerald-500/10 mt-4">
                        {t('carbon.initExchange')}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default CarbonLedger;
