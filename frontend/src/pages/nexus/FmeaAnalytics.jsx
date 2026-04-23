import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Plus, TrendingUp, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

const FmeaAnalytics = () => {
    const { t } = useTranslation();
    const [entries, setEntries] = useState([
        { id: 1, mode: t('nexus.rcm.modes.m1'), severity: 8, occurrence: 3, detection: 2, rpn: 48 },
        { id: 2, mode: t('nexus.rcm.modes.m2'), severity: 5, occurrence: 6, detection: 4, rpn: 120 },
    ]);

    const calculateRpn = (s, o, d) => s * o * d;

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                        <Layers className="text-yellow-400 w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('nexus.rcm.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            {t('nexus.rcm.subtitle')}
                        </p>
                    </div>
                </div>
                <div className="bg-rose-50 px-8 py-4 rounded-2xl border border-rose-100 flex items-center gap-4">
                    <AlertTriangle className="text-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                        {entries.length} {t('nexus.rcm.fault_modes_active')}
                    </span>
                </div>
            </div>

            {/* RPN Leaderboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                    <TrendingUp className="text-indigo-600" />
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">{t('nexus.rcm.risk_index')}</h4>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">{Math.max(...entries.map(e => e.rpn))}</p>
                </div>
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6">
                    <Shield className="text-yellow-400" />
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">{t('nexus.rcm.mitigations')}</h4>
                    <p className="text-5xl font-black text-white tracking-tighter">{"12"}</p>
                </div>
                 <div className="bg-emerald-500 p-10 rounded-[3rem] text-white space-y-6">
                    <CheckCircle className="text-white" />
                    <h4 className="text-xs font-black uppercase text-emerald-100 tracking-widest">{t('nexus.rcm.reliability_score')}</h4>
                    <p className="text-5xl font-black text-white tracking-tighter">{"94.2%"}</p>
                </div>
            </div>

            {/* FMEA Table */}
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('nexus.rcm.failure_mode')}</th>
                            <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('nexus.rcm.severity')}</th>
                            <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('nexus.rcm.occurrence')}</th>
                            <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('nexus.rcm.detection')}</th>
                            <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('nexus.rcm.rpn_score')}</th>
                            <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('nexus.rcm.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {entries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-10">
                                    <span className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{entry.mode}</span>
                                </td>
                                <td className="p-10 text-center font-bold text-slate-600">{entry.severity}</td>
                                <td className="p-10 text-center font-bold text-slate-600">{entry.occurrence}</td>
                                <td className="p-10 text-center font-bold text-slate-600">{entry.detection}</td>
                                <td className="p-10 text-center">
                                    <span className={`px-6 py-3 rounded-2xl font-black text-sm tracking-tighter ${entry.rpn > 100 ? 'bg-rose-500 text-white shadow-xl shadow-rose-200' : 'bg-slate-900 text-white'}`}>
                                        {entry.rpn}
                                    </span>
                                </td>
                                <td className="p-10 text-right">
                                    <button className="p-4 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                                        {t('nexus.rcm.analyze_details')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FmeaAnalytics;
