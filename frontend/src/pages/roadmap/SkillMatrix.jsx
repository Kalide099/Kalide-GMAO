import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, CheckCircle, AlertTriangle, Calendar, Search, User, Filter } from 'lucide-react';
import api from '../../services/api/axiosConfig';

const SkillMatrix = () => {
    const { t } = useTranslation();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await api.get('/certifications/matrix');
                if (res.data.success) {
                    setSkills(res.data.data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
             <p className="p-20 text-center font-black text-slate-300 italic animate-pulse uppercase tracking-widest text-xs">{t('roadmap.skills.loading')}</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in-up uppercase">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">{t('roadmap.skills.title')}</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-1 w-12 bg-yellow-400 rounded-full"></span>
                        <p className="text-slate-400 font-black tracking-[0.4em] text-[10px]">{t('roadmap.skills.subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-slate-900 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder={t('common.search')} 
                            className="bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black tracking-widest focus:ring-2 focus:ring-slate-900 outline-none w-80 transition-all shadow-sm"
                        />
                    </div>
                    <button className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase border-b border-slate-100">
                        <tr>
                            <th className="px-12 py-8">{t('roadmap.skills.tech')}</th>
                            <th className="px-12 py-8">{t('roadmap.skills.certs')}</th>
                            <th className="px-12 py-8">{t('roadmap.skills.status')}</th>
                            <th className="px-12 py-8 text-right uppercase tracking-[0.2em]">{t('roadmap.skills.action')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {skills.map(tech => (
                            <tr key={tech.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-12 py-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black italic shadow-xl">
                                            {tech.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-900 leading-none">{tech.name}</p>
                                            <p className="text-[10px] text-slate-400 font-black mt-2 tracking-widest uppercase">{t('roadmap.skills.role')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-12 py-10">
                                    <div className="flex flex-col gap-3">
                                        {tech.certs.map(c => (
                                            <div key={c.id} className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                                                <span className={`text-[10px] font-black tracking-wider uppercase ${c.status === 'active' ? 'text-slate-600' : 'text-rose-600'}`}>
                                                    {c.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-12 py-10">
                                    <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border-2 ${
                                        tech.certs.every(c => c.status === 'active') ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                                    }`}>
                                        <Award size={14} />
                                        <span className="text-[10px] font-black tracking-widest uppercase">
                                            {tech.certs.every(c => c.status === 'active') ? t('roadmap.skills.qualified') : t('roadmap.skills.unqualified')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-12 py-10 text-right">
                                    <button className="px-8 py-3 bg-slate-50 text-slate-900 border border-slate-100 rounded-xl font-black text-[10px] tracking-widest hover:bg-slate-900 hover:text-white transition-all uppercase">
                                        {t('roadmap.skills.view')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {skills.length === 0 && (
                             <tr>
                                 <td colSpan="4" className="px-12 py-20 text-center text-slate-400 font-black text-xs uppercase tracking-[0.3em] italic">{t('roadmap.skills.empty')}</td>
                             </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-16 bg-slate-900 rounded-[4rem] text-white flex justify-between items-center shadow-2xl shadow-slate-900/10 border border-white/5">
                    <div className="space-y-4">
                        <CheckCircle size={48} className="text-yellow-400 shadow-xl" />
                        <h3 className="text-4xl font-black tracking-tighter italic">94% {t('roadmap.skills.readiness')}</h3>
                        <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">{t('roadmap.skills.readinessSub')}</p>
                    </div>
                </div>
                <div className="p-16 bg-rose-950 rounded-[4rem] text-white flex justify-between items-center shadow-2xl shadow-rose-950/10 border border-rose-900/50">
                    <div className="space-y-4">
                        <AlertTriangle size={48} className="text-yellow-400 animate-pulse" />
                        <h3 className="text-4xl font-black tracking-tighter italic">12 {t('roadmap.skills.expiring')}</h3>
                        <p className="text-rose-400 font-black text-[10px] tracking-widest uppercase">{t('roadmap.skills.expiringSub')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillMatrix;
