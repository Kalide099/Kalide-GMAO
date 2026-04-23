import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, ClipboardCheck, Camera, Mic, AlertTriangle, CheckCircle2 } from 'lucide-react';

const AutonomousTPM = () => {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState([
        { id: 1, text: t('nexus.tpm.tasks.t1'), status: 'pending' },
        { id: 2, text: t('nexus.tpm.tasks.t2'), status: 'pending' },
        { id: 3, text: t('nexus.tpm.tasks.t3'), status: 'pending' },
        { id: 4, text: t('nexus.tpm.tasks.t4'), status: 'pending' }
    ]);

    const toggleTask = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, status: task.status === 'done' ? 'pending' : 'done' } : task));
    };

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-orange-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-orange-200">
                        <Settings className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('nexus.tpm.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            {t('nexus.tpm.subtitle')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-orange-50 px-8 py-4 rounded-3xl border border-orange-100 text-orange-600 font-black text-[10px] uppercase tracking-widest">
                    <ClipboardCheck size={18} /> {t('nexus.tpm.routine_matrix')}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Checklist Section */}
                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">{t('nexus.tpm.inspection_title')}</h3>
                    <div className="space-y-6">
                        {tasks.map((task) => (
                            <div 
                                key={task.id} 
                                onClick={() => toggleTask(task.id)}
                                className={`p-8 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group ${task.status === 'done' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-transparent hover:border-orange-200 hover:bg-white'}`}
                            >
                                <p className={`font-bold transition-all ${task.status === 'done' ? 'text-emerald-800 line-through' : 'text-slate-800'}`}>
                                    {task.text}
                                </p>
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 group-hover:border-orange-400'}`}>
                                    {task.status === 'done' && <CheckCircle2 size={16} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Evidence & Anomaly */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                        <h3 className="text-2xl font-black uppercase italic tracking-tight">{t('nexus.tpm.anomaly_title')}</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <button className="flex flex-col items-center justify-center gap-4 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <Camera className="text-orange-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('nexus.tpm.capture_image')}</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-4 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:-rotate-12 transition-transform">
                                    <Mic className="text-indigo-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('nexus.tpm.voice_note')}</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-rose-500 p-12 rounded-[4rem] text-white flex justify-between items-center group cursor-pointer hover:bg-rose-600 transition-all">
                        <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tight">{t('nexus.tpm.problem_detected')}</h3>
                            <p className="text-rose-100 font-bold uppercase tracking-widest text-[9px] mt-2">{t('nexus.tpm.trigger_request')}</p>
                        </div>
                        <AlertTriangle className="group-hover:rotate-12 transition-transform" size={48} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutonomousTPM;
