import React, { useState, useEffect } from 'react';
import api from '../services/api/axiosConfig';
import { useTranslation } from 'react-i18next';
import { Eye, Cpu, Zap, Radio, Boxes, Smartphone, Users, ShieldCheck } from 'lucide-react';

const NeuralAR = () => {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/work-orders');
            if (res.data.success) {
                setTasks(res.data.data.filter(t => t.status === 'in_progress'));
            }
        } catch (error) {
            console.error("Neural AR Sync Failure", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-12 lg:p-20 rounded-[4rem] text-white flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden border border-white/5 shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
                
                <div className="max-w-2xl relative z-10 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-8">
                        <Zap className="text-yellow-400" size={14} fill="currentColor" />
                        <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">{t('neural_ar.syncReady')}</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-tight mb-6">
                        {t('neural_ar.title').split(' ')[0]} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-100 italic">{t('neural_ar.title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed uppercase tracking-wide">
                        {t('neural_ar.subtitle')}
                    </p>
                    <div className="mt-10 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl max-w-md">
                         <h4 className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4 italic">{t('neural_ar.activeTasks')}</h4>
                         <div className="space-y-4">
                            {tasks.length === 0 ? (
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{t('neural_ar.noActiveTasks') || 'No Active Tasks'}</p>
                            ) : tasks.map(task => (
                                <div key={task.id} className="flex justify-between items-center group">
                                    <span className="text-[10px] font-black text-white/60 tracking-tight uppercase truncate max-w-[150px]">{task.title}</span>
                                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-all">{t('neural_ar.launchOverlay')}</button>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                <div className="relative z-10 w-full lg:w-1/3">
                    <div className="aspect-square bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-xl p-4 flex flex-col justify-between relative group">
                        <div className="absolute inset-4 border-2 border-white/5 rounded-[3rem] animate-pulse"></div>
                        <div className="flex justify-between items-center mb-10 relative z-10 px-4 pt-4">
                            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{t('neural_ar.syncReady')}</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t('neural_ar.twinStatus')}</span>
                                <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{t('neural_ar.statusSynced')}</div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center flex-grow">
                            <Boxes className="text-indigo-400 w-32 h-32 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-6 bg-slate-950/80 rounded-3xl border border-white/10">
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all group/card cursor-pointer">
                    <Radio className="text-indigo-400 mb-6 group-hover/card:rotate-12 transition-transform" size={40} />
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{t('neural_ar.expertSync')}</h4>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider leading-relaxed">
                        {t('neural_ar.expertSyncDesc')}
                    </p>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all group/card cursor-pointer">
                    <Zap className="text-yellow-400 mb-6 group-hover/card:scale-110 transition-transform" size={40} />
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{t('neural_ar.guidedRepair')}</h4>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider leading-relaxed">
                        {t('neural_ar.guidedRepairDesc')}
                    </p>
                </div>

                <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all group/card cursor-pointer">
                    <ShieldCheck className="text-emerald-400 mb-6 group-hover/card:rotate-[-12deg] transition-transform" size={40} />
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{t('neural_ar.bioSync')}</h4>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider leading-relaxed">
                        {t('neural_ar.bioSyncDesc')}
                    </p>
                </div>
            </div>
        </div>
    );
};


export default NeuralAR;
