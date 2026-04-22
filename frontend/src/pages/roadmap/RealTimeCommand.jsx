import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, ShieldAlert, TrendingDown, Clock, Zap, Target, BarChart } from 'lucide-react';
import api from '../../services/api/axiosConfig';

const RealTimeCommand = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        oee: 84.5,
        mttr: '45m',
        mtbf: '124h',
        downtimeCost: 12400
    });

    const [alerts, setAlerts] = useState([
        { id: 1, type: 'CRITICAL', msg: 'Vibration Anomaly in Node-04', time: '2m ago', cost: '$450/hr' },
        { id: 2, type: 'PREDICTIVE', msg: 'Bearing Wear expected in 4 days', time: '15m ago', cost: 'N/A' },
        { id: 3, type: 'SECURITY', msg: 'Unauthorized ECU Access attempt', time: '1h ago', cost: 'SEC-RISK' }
    ]);

    return (
        <div className="space-y-12 animate-fade-in-up uppercase">
            {/* Header with Pulse */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-7xl font-black text-slate-900 tracking-tighter italic">{t('roadmap.command.title')}</h1>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                        <p className="text-slate-400 font-black tracking-[0.4em] text-[10px]">{t('roadmap.command.subtitle')}</p>
                    </div>
                </div>
                <div className="px-12 py-6 bg-slate-900 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border-b-8 border-yellow-400">
                    <Zap className="text-yellow-400 fill-yellow-400" size={32} />
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 tracking-widest leading-none">{t('roadmap.command.globalStatus')}</p>
                        <p className="text-2xl font-black text-white italic">{t('roadmap.command.operational')}</p>
                    </div>
                </div>
            </div>

            {/* KPI Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-72 group hover:bg-slate-900 transition-all cursor-crosshair">
                    <Target className="text-indigo-600 group-hover:text-yellow-400" size={32} />
                    <div>
                        <p className="text-5xl font-black text-slate-900 group-hover:text-white tracking-tighter">{stats.oee}%</p>
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-2">{t('roadmap.command.oeeLabel')}</p>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-72 group hover:bg-slate-900 transition-all cursor-crosshair">
                    <Clock className="text-amber-600 group-hover:text-yellow-400" size={32} />
                    <div>
                        <p className="text-5xl font-black text-slate-900 group-hover:text-white tracking-tighter">{stats.mttr}</p>
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-2">{t('roadmap.command.mttrLabel')}</p>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-72 group hover:bg-slate-900 transition-all cursor-crosshair">
                    <BarChart className="text-emerald-600 group-hover:text-yellow-400" size={32} />
                    <div>
                        <p className="text-5xl font-black text-slate-900 group-hover:text-white tracking-tighter">{stats.mtbf}</p>
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-2">{t('roadmap.command.mtbfLabel')}</p>
                    </div>
                </div>
                <div className="bg-rose-900 p-10 rounded-[3.5rem] shadow-2xl flex flex-col justify-between h-72 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingDown size={140} />
                    </div>
                    <TrendingDown className="text-yellow-400" size={32} />
                    <div>
                        <p className="text-4xl font-black text-white tracking-tighter">${stats.downtimeCost.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-rose-300 tracking-widest uppercase mt-2">{t('roadmap.command.downtimeLabel')}</p>
                    </div>
                </div>
            </div>

            {/* Live Analytics & Alerts Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-3xl font-black text-slate-900 italic flex items-center gap-4">
                        <Activity className="text-rose-500 animate-pulse" /> {t('roadmap.command.eventStream')}
                    </h2>
                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <div key={alert.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex items-center justify-between group hover:shadow-2xl transition-all">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                        alert.type === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-slate-900 text-white'
                                    }`}>
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 tracking-[0.2em]">{alert.type}</p>
                                        <h4 className="text-lg font-black text-slate-900 italic tracking-tight">{alert.msg}</h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900 tracking-tight">{alert.cost}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[4rem] p-12 text-white space-y-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
                    <h2 className="text-3xl font-black italic tracking-tighter">{t('roadmap.command.esgPanel')}</h2>
                    <div className="space-y-8">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <span className="text-[10px] font-black text-slate-400 tracking-widest">{t('roadmap.command.co2Label')}</span>
                            <span className="text-lg font-black text-white italic">14.2 {t('roadmap.command.tons')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <span className="text-[10px] font-black text-slate-400 tracking-widest">{t('roadmap.command.energyIntensity')}</span>
                            <span className="text-lg font-black text-white italic">0.84 kW/{t('roadmap.command.unit')}</span>
                        </div>
                    </div>
                    <button className="w-full py-6 bg-yellow-400 text-slate-900 rounded-3xl font-black text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all">
                    {t('roadmap.command.esgReport')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RealTimeCommand;
