import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { Users, Activity, TrendingUp, Clock, Medal, Award, User, MoreHorizontal } from 'lucide-react';

const TeamPerformance = () => {
    const { t } = useTranslation();
    const [workers, setWorkers] = useState([]);
    const [stats, setStats] = useState({
        completionRate: 0,
        qualityScore: 0,
        activeTechnicians: 0,
        avgRepairTime: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/performance/workforce');
            if (res.data.success) {
                setWorkers(res.data.data.performers);
                setStats(res.data.data.stats);
            }
        } catch (error) {
            console.error("Performance Analytics Failure", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading && workers.length === 0) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up pb-20">
            {/* Analytics Header */}
            <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-rose-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-rose-200">
                        <TrendingUp className="text-white w-12 h-12" />
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter uppercase mb-2">{t('performance.title')}</h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">{t('performance.subtitle')}</p>
                    </div>
                </div>
                <div className="flex -space-x-4">
                    {workers.slice(0, 4).map((w, i) => (
                        <div key={i} className="w-14 h-14 rounded-full bg-slate-900 border-4 border-white flex items-center justify-center text-white text-[10px] uppercase font-black shadow-sm">
                            {w.first_name[0]}{w.last_name[0]}
                        </div>
                    ))}
                    {workers.length > 4 && (
                        <div className="w-14 h-14 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-slate-400 text-xs font-black">+{workers.length - 4}</div>
                    )}
                </div>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-between h-64 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Medal size={120} />
                     </div>
                     <div className="flex justify-between items-start">
                        <span className="text-xs font-black uppercase tracking-widest text-rose-400">{t('performance.teamQualityAvg')}</span>
                        <Award className="text-rose-400" />
                     </div>
                     <div>
                        <span className="text-5xl font-black tracking-tighter">{(stats.qualityScore/10).toFixed(1)}</span>
                        <p className="text-slate-400 font-bold uppercase text-xs mt-2 tracking-widest">{t('performance.globalBenchmark')}</p>
                     </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between h-64">
                     <div className="flex justify-between items-start">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{t('performance.avgResponse')}</span>
                        <Clock className="text-indigo-500" />
                     </div>
                     <div>
                        <span className="text-5xl font-black text-slate-800 tracking-tighter">{stats.avgRepairTime}h</span>
                        <p className="text-slate-500 font-bold uppercase text-xs mt-2 tracking-widest">{t('performance.cycleComp')}</p>
                     </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between h-64">
                     <div className="flex justify-between items-start">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{t('performance.laborUtilization')}</span>
                        <Users className="text-emerald-500" />
                     </div>
                     <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <span className="text-4xl font-black text-slate-800 tracking-tighter">{stats.completionRate}%</span>
                            <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">{t('common.status.optimal')}</span>
                         </div>
                         <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.completionRate}%` }}></div>
                         </div>
                     </div>
                </div>
            </div>

            {/* Performance Rankings */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 bg-slate-50/30">
                     <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t('performance.rankingTitle')}</h3>
                </div>
                <div className="p-10">
                    <div className="space-y-6">
                        {workers.map((worker, i) => (
                            <div key={worker.id} className="p-10 rounded-[2.5rem] border border-slate-100 bg-white flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-xl hover:border-indigo-100 transition-all group">
                                <div className="flex items-center gap-8 w-full lg:w-auto">
                                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{worker.first_name} {worker.last_name}</h4>
                                        <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">{t('performance.technicianElite')}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-12 w-full lg:w-auto">
                                    <div className="text-center">
                                        <span className="block text-2xl font-black text-slate-800">{worker.completed_tasks}</span>
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('performance.tasksDone')}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black text-slate-800">{worker.avg_hours ? `${parseFloat(worker.avg_hours).toFixed(1)}h` : '--'}</span>
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('performance.avgDuration')}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black text-indigo-600">{Math.min(9.9, (9.0 + (worker.completed_tasks / 50))).toFixed(1)}</span>
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('performance.qualityScore')}</span>
                                    </div>
                                </div>

                                <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-800 transition-colors">
                                    <MoreHorizontal size={24} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default TeamPerformance;
