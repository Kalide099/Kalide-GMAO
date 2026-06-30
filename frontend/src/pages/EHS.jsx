import { useState, useEffect } from 'react';
import api from '../services/api/axiosConfig';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Map, Terminal, Siren } from 'lucide-react';
import toast from 'react-hot-toast';

const EHS = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        activeIncidents: 0,
        nearMisses: 0,
        safetyScore: 100,
        permitsIssued: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/safety/stats');
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (error) {
            console.error("Safety Data Sync Failure", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleReportIncident = () => {
        toast.success(t('ehs.incidentRouted') || 'Incident routing opened in work orders.');
        window.location.assign('/app/work-orders?priority=high&module=safety');
    };

    const handleAuditSafety = async () => {
        try {
            const res = await api.get('/safety/pending');
            const count = Array.isArray(res?.data?.data) ? res.data.data.length : 0;
            toast.success(`${t('ehs.pendingPermits') || 'Pending safety permits'}: ${count}`);
        } catch (error) {
            toast.error(t('ehs.permitLoadFailed') || 'Unable to load pending safety permits.');
        }
    };

    const incidentStats = [
        { label: t('ehs.incidents'), value: String(stats.activeIncidents).padStart(2, '0'), color: "text-rose-500", bg: "bg-rose-50" },
        { label: t('ehs.nearMiss'), value: String(stats.nearMisses).padStart(2, '0'), color: "text-amber-500", bg: "bg-amber-50" },
        { label: t('ehs.safetyScore'), value: `${stats.safetyScore}%`, color: "text-emerald-500", bg: "bg-emerald-50" }
    ];

    if (loading && stats.activeIncidents === 0) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header */}
            <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-10 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                <div className="flex items-center gap-8 relative z-10">
                    <div className="w-24 h-24 bg-rose-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-rose-500/20 animate-pulse">
                        <Siren className="text-white w-12 h-12" />
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic">{t('ehs.title')}</h1>
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.4em] mt-2">{t('ehs.subtitle')}</p>
                    </div>
                </div>
                <div className="flex gap-4 relative z-10">
                    <button onClick={handleReportIncident} className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-rose-900/40">
                        {t('ehs.reportIncident')}
                    </button>
                    <button onClick={handleAuditSafety} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all border border-white/10">
                        {t('ehs.auditSafety')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {incidentStats.map((stat, i) => (
                    <div key={i} className={`p-10 ${stat.bg} rounded-[3rem] border border-white shadow-sm flex flex-col items-center text-center group hover:scale-105 transition-transform duration-500`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{stat.label}</span>
                        <span className={`text-6xl font-black tracking-tighter italic ${stat.color} drop-shadow-sm`}>{stat.value}</span>
                    </div>
                ))}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hazard Map Mockup */}
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-4">
                            <Map className="text-indigo-600" />
                            {t('ehs.hazardMap')}
                        </h3>
                        <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">{t('ehs.activeFloorPlan')}</span>
                    </div>
                    <div className="h-80 bg-slate-950 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center group cursor-crosshair">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
                         <div className="w-3/4 h-2/3 border-2 border-white/5 rounded-2xl relative">
                             <div className="absolute top-10 left-10 w-4 h-4 bg-rose-500 rounded-full animate-ping"></div>
                             <div className="absolute bottom-20 right-20 w-4 h-4 bg-amber-500 rounded-full animate-pulse"></div>
                         </div>
                         <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-transparent transition-colors"></div>
                    </div>
                </div>

                {/* Live Safety Terminal */}
                <div className="bg-slate-950 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-8">
                    <div className="flex items-center gap-4">
                        <Terminal className="text-rose-500" />
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">{t('ehs.forensicStream')}</h3>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-6 items-start p-4 hover:bg-white/5 rounded-2xl transition-colors">
                                <ShieldAlert className={i === 1 ? "text-rose-500" : "text-amber-500"} size={20} />
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{new Date().toISOString().slice(11, 19)} UTC</span>
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${i === 1 ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                            {i === 1 ? t('ehs.critical') : t('ehs.caution')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 font-bold uppercase tracking-tight">
                                        {i === 1 ? t('ehs.unauthorizedAccess') : t('ehs.sensorAnomaly')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EHS;
